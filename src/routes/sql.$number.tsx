import { useContext, useEffect, useMemo, useRef, useState } from 'react';
// import { createPortal } from 'react-dom'
import { DockviewApi, DockviewReact, DockviewReadyEvent } from 'dockview-react';
import { clsx } from 'clsx';
import { createFileRoute } from '@tanstack/react-router';
import { toast } from 'sonner';
import { ChallengeSkeleton } from '@/components/Skeleton';
import { PgExecEngineContext } from '@/context/PgExecEngineContext';
import { useTheme } from '@/hooks/useTheme';
import { useAppState } from '@/hooks/useAppState';
import { TableDiff, ChallengeData } from '@/lib/types';
import { ResultSetComparison } from '@/lib/utils';
import { useChallengeNumber } from '@/hooks/useChallengeNumber';
import { IconButton } from '@/components/buttons/IconButton';
import { toggleHeaderSuccess } from '@/lib/reducer';
import { QueryResult, SqlExecutionResult} from '@/lib/exec-engine/postgres-engine';
import { PlayIcon, ArrowDownOnSquareStackIcon } from '@heroicons/react/24/solid';
import { CodeEditor } from '@/components/CodeEditor';
import { ChallengeLesson } from '@/components/ChallengeLesson';
import { QueryResultTable } from '@/components/QueryResultTable';
import 'dockview/dist/styles/dockview.css';
import { defaultConfig, nextId } from '@/lib/dockview/defaultLayout';
import { LeftControls, PrefixHeaderControls, RightControls } from '@/components/dockview/Controls';

/**
 * Background style for the challenge workspace
 * @constant
 */
const BG_STYLE =
    'w-full h-full dark:bg-gray-700 dark:bg-blend-overlay bg-blend-multiply dark:to-slate-800 dark:from-gray-700/80 from-white to-gray-200 bg-radial bg-size-125 bg-radial-[at_50%_50%]';


/**
 * Props interface for Toolbar component
 *
 * Defines the properties for a container component that displays
 * action buttons and controls in a horizontal bar.
 *
 * @interface ToolbarProps
 */
interface ToolbarProps {
    /**
     * Child elements to render within the toolbar
     * Typically consists of buttons, dropdowns, and other control elements
     *
     * @property {React.ReactNode} children
     */
    children: React.ReactNode
    /**
     * Optional additional CSS classes to apply to the toolbar container
     * Allows for customization of the toolbar's appearance
     *
     * @property {string} [className]
     */
    className?: string
}

/**
 * Fetches challenge data from the API
 * @async
 * @function
 * @param {string} name - Challenge identifier
 * @returns {Promise<Object>} Challenge data object
 * @throws {Error} If challenge not found or fetch fails
 */
const fetchChallenge = async (name: string): Promise<object> => {
    const response = await fetch(`/api/challenges/${name}.json`)
    if (!response.ok) {
        throw new Error(`Challenge "${name}" not found (${response.status})`)
    }
    return response.json()
}

/**
 * Toolbar component for challenge actions
 * @component
 * @param {Object} props - Component properties
 * @param {React.ReactNode} props.children - Toolbar content
 * @param {string} [props.className] - Additional CSS classes
 */
const Toolbar: React.FC<ToolbarProps> = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <div className={`bg-gray-200 dark:bg-slate-900/50 flex gap-2 justify-end p-2 ${className ?? ''}`}>
        {children}
    </div>
);
/**
 * Main Challenge component that provides a complete SQL learning environment
 *
 * Provides an interactive SQL challenge interface with the following features:
 * - Challenge description and educational content display
 * - SQL editor with syntax highlighting and autocompletion
 * - Query execution and result visualization
 * - Automatic solution validation
 * - Progress tracking and success/failure feedback
 *
 * Uses PGlightContext for database operations and theme context for visual customization.
 *
 * @component Challenge
 *
 * @example
 * ```tsx
 * <Challenge />
 * ```
 */
function View() {
    const [, setPanels] = useState<string[]>([]);
    const [, setGroups] = useState<string[]>([]);
    const [api, setApi] = useState<DockviewApi>();

    const [, setActivePanel] = useState<string>();
    const [, setActiveGroup] = useState<string>();

    const { pg, updateSchema } = useContext(PgExecEngineContext)
    const challenge = Route.useLoaderData() as ChallengeData;
    const [value, setValue] = useState<string>('');
    const valueRef = useRef<string>('');
    const lessonRef = useRef<HTMLDivElement>();
    const isInitialized = useRef<boolean>(false);
    const [result, setResult] = useState<QueryResult | undefined>();
    const [db, setDb] = useState<string>('');
    const { state, dispatch } = useAppState();
    const challengeNumber = useChallengeNumber();
    const challengeIndex = useMemo(() => challengeNumber - 1, [challengeNumber]);
    const { theme } = useTheme();
    const [svgTheme, setSvgTheme] = useState<string>(theme === 'dark' ? '-dark.svg' : '.svg');

    useEffect(() => {
        setSvgTheme(() => (theme === 'dark' ? '-dark.svg' : '.svg'));
    }, [theme]);

    /**
     * Initializes the challenge and updates the header UI based on the completion status.
     * 
     * This effect:
     * - Dispatches an action to initialize the current challenge.
     * - Toggles the header success state based on whether the challenge is completed.
     * 
     * @effect
     * @dependencies challengeNo, dispatch, state.challenges, state.headerElement
     */
    useEffect(() => {
        dispatch({ type: 'INIT_CHALLENGE', payload: { index: challengeIndex } });
        const notCompleted = !state.challenges[challengeIndex].completed;
        toggleHeaderSuccess(notCompleted, state.headerElement);
    }, [challengeIndex, dispatch, state.challenges, state.headerElement]);

    const components = {
        lessonPanel: () => (
            <div className={clsx('p-4 w-full h-full')}>
                <ChallengeLesson
                    lesson={challenge.description}
                    difficulty={challenge.difficulty}
                    ref={lessonRef}
                />
            </div>
        ),
        editorPanel: () => (
            <div className={BG_STYLE}>
                <CodeEditor value={challenge.query} ref={valueRef} />
                <Toolbar className="justify-center">
                    <IconButton
                        icon={<ArrowDownOnSquareStackIcon className="size-6" />}
                        aria-label="ERD downloaden"
                        title="ERD downloaden"
                        onClick={handleDownloadClick}
                    />
                    <IconButton
                        icon={<PlayIcon className="size-6" />}
                        aria-label="SQL ausführen"
                        title="SQL ausführen"
                        variant="primary"
                        onClick={handleRun}
                    />
                </Toolbar>
            </div>
        ),
        erdPanel: () => (
            <div className={clsx('w-full h-full flex items-center justify-center p-4', BG_STYLE)}>
                <img
                    key={`erd-${svgTheme}`}
                    src={challenge.schema?.replace(
                        '.sql',
                        svgTheme,
                    )}
                    alt="ERD"
                    width="100%"
                    height="100%"
                    className="erd"
                />
            </div>
        ),
        resultPanel: () => (
            <div
                className={clsx(
                    'h-full',
                    'lg:px-4 pb-16 mb-40',
                    'border-t-4 border-ridge',
                    'border-white/20 dark:border-slate-900/20',
                    'overflow-auto',
                )}
            >
                <QueryResultTable id="query-result" result={result} />
            </div>
        ),
    }

    useEffect(() => {
        if (isInitialized.current) {
            return;
        }

        if (!api) {
            dispatch({ type: 'SET_CURRENT_CHALLENGE', payload: challenge });
            return;
        }

        const disposables = [
            api.onDidAddPanel((event) => {
                setPanels((_) => [..._, event.id]);
            }),
            api.onDidActivePanelChange((event) => {
                setActivePanel(event?.id);
            }),
            api.onDidRemovePanel((event) => {
                setPanels((_) => {
                    const next = [..._];
                    next.splice(
                        next.findIndex((x) => x === event.id),
                        1
                    );

                    return next;
                });
            }),
            api.onDidAddGroup((event) => {
                setGroups((_) => [..._, event.id]);
            }),
            api.onDidRemoveGroup((event) => {
                setGroups((_) => {
                    const next = [..._];
                    next.splice(
                        next.findIndex((x) => x === event.id),
                        1
                    );

                    return next;
                });
            }),
            api.onDidActiveGroupChange((event) => {
                setActiveGroup(event?.id);
            }),
        ];

        const loadLayout = () => {
            const serialized = localStorage.getItem('dv-state');

            if (serialized) {
                try {
                    api.fromJSON(JSON.parse(serialized));
                    return;
                } catch {
                    localStorage.removeItem('dv-state');
                }
                return;
            }

            defaultConfig(api);
            
            isInitialized.current = true;
        };

        loadLayout();

        return () => {
            disposables.forEach((disposable) => disposable?.dispose());
        };
    }, [api, challengeNumber, dispatch]);

    /**
     * Loads the challenge query and schema into the database.
     *
     * This effect:
     * - Fetches and executes the schema SQL if the database schema has changed.
     * - Updates the database state once the schema is loaded.
     *
     * @effect
     * @dependencies db, challenge.schema, dispatch, updateSchema, state.challenges, challengeIndex
     */
    useEffect(() => {
        if (db !== challenge.schema) {
            fetch(challenge.schema).then(async (response) => {
                try {
                    const sql = await response.text()
                    await updateSchema(sql)
                } catch (error) {
                    const errMsg =
                        typeof error === 'string' ? error : (error as Error).message
                    toast.error('Failed to load schema', {
                        description: errMsg,
                    })
                } finally {
                    setDb(() => challenge.schema)
                }
            })
        }
    }, [
        db,
        challenge.schema,
        dispatch,
        updateSchema,
        state.challenges,
        challengeIndex,
    ])

    /**
     * Initializes the challenge and updates the header UI based on the completion status.
     *
     * This effect:
     * - Dispatches an action to initialize the current challenge.
     * - Toggles the header success state based on whether the challenge is completed.
     *
     * @effect
     * @dependencies challengeNo, dispatch, state.challenges, state.headerElement
     */
    useEffect(() => {
        dispatch({ type: 'INIT_CHALLENGE', payload: { index: challengeIndex } })
        const notCompleted = !state.challenges[challengeIndex].completed
        toggleHeaderSuccess(notCompleted, state.headerElement)
    }, [challengeIndex, dispatch, state.challenges, state.headerElement])

    /**
     * Updates the SQL editor content based on the current challenge attempt.
     *
     * This effect:
     * - Retrieves the latest SQL query attempt for the current challenge.
     * - Sets the SQL editor content to the latest query attempt.
     * - When no attempts are available, the editor is cleared.
     *
     * @effect
     * @dependencies challengeIndex, state.challenges
     */
    useEffect(() => {
        const attempts = state.challenges[challengeIndex]?.attempts.filter(
            (attempt) => Boolean(attempt.query),
        )
        const len = attempts?.length ?? 0
        valueRef.current = len > 0 ? attempts[len - 1].query! : ''
        if (value !== valueRef.current) {
            setValue(() => valueRef.current);
        }
    }, [challengeIndex, state.challenges, value])

    /**
     * Updates the view to show the ERD (Entity-Relationship Diagram) and scrolls to the top of the right column.
     *
     * This effect:
     * - Sets the active view to the ERD page.
     * - Scrolls the right column to the top when the challenge number changes.
     *
     * @effect
     * @dependencies challengeNo
     */
    useEffect(() => {
        if (api) {
            api.getPanel('lesson')?.view.content.element.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [api])

    /**
     * Handles the execution of a SQL query or a series of SQL statements for a specific challenge.
     *
     * This function:
     * - Executes the SQL query/queries provided in the `editorRef`.
     * - Compares the result with a pre-stored solution (if available).
     * - Dispatches appropriate actions based on whether the challenge was completed successfully or not.
     * - Updates the UI to display the result or error messages.
     *
     * @async
     * @function handleRun
     * @returns {Promise<void>} - A promise that resolves when the function completes.
     *
     * @example
     * await handleRun();
     */
    const handleRun = async (): Promise<void> => {
        // If the PostgreSQL client (`pg`) is not available, exit the function.
        if (!pg) return

        try {
            let queryResult: SqlExecutionResult | null = null
            const key = challengeNumber.toString() // Create a key for the current challenge.
            const result = await pg.execute(valueRef.current ?? '') // Execute the SQL query.

            if (!result.success) {
                throw new Error(
                    result.error ?? 'An error occurred while executing the query.',
                );
            }

            if (
                !ResultSetComparison.hasSolution(key) &&
                !ResultSetComparison.hasSolution(`${key}-0`)
            ) {
                queryResult = await pg.execute(challenge.query)
                if (queryResult.success) {
                    for (let i = 0; i < queryResult.data!.length; i++) {
                        ResultSetComparison.storeSolutionHash(
                            `${key}-${i}`,
                            queryResult.data![i],
                        );
                    }
                } else {
                    throw new Error(
                        result.error ??
                        'An error occurred while executing the solution query.',
                    );
                }
            }

            const isCorrect = result.data!.reduce((success, result, i) => {
                const key = `${challengeNumber.toString()}-${i}`;
                return success && ResultSetComparison.compareWithSolution(key, result);
            }, Boolean(result.data?.length))

            setResult(result.data ? result.data[0] : undefined);

            if (isCorrect) {
                toast.success('Erfolg', {
                    description: 'Ergebnis korrekt. Gut gemacht!',
                });
                dispatch({
                    type: 'COMPLETE_CHALLENGE',
                    payload: { index: challengeIndex, query: valueRef.current },
                });
            } else {
                toast.error('Fehler', {
                    description: 'Die gelieferten Datensätze stimmen nicht überein.',
                });
                dispatch({
                    type: 'CHALLENGE_FAILED',
                    payload: {
                        index: challengeIndex,
                        difference: {} as TableDiff,
                        query: valueRef.current,
                    },
                });
            }

            setResult(() => result.data ? result.data.pop() : undefined);
        } catch (error) {
            // Handle errors and display an error message.
            const errMsg =
                typeof error === 'string' ? error : (error as Error).message
            toast.error('Fehler beim Ausführen der Abfrage', {
                description: errMsg,
            })
        }
    }

    /**
     * Handles database schema PDF download
     *
     * Creates and triggers a download for the PDF version of the current challenge's
     * database schema. Extracts the appropriate filename from the schema path,
     * replacing the .sql extension with db.pdf.
     *
     * @function handleDownloadClick
     * @returns {void}
     */
    const handleDownloadClick = (): void => {
        const a = document.createElement('a')
        const file =
            challenge.schema.split('/').pop()?.replace('.sql', '.pdf') ?? ''
        a.href = `/databases/pdf/${file}`
        a.download = file
        a.click()
    }

    const onReady = (event: DockviewReadyEvent) => {
        
        setApi(() => event.api);
    }

    return (
        <DockviewReact
            popoutUrl="about:blank"
            components={components}
            onReady={onReady}
            className={theme || 'dockview-theme-abyss'}
            rightHeaderActionsComponent={RightControls}
            leftHeaderActionsComponent={LeftControls}
            prefixHeaderActionsComponent={
                PrefixHeaderControls
            }
        />
    )
}

/**
 * TanStack Router configuration for challenge routes
 * @constant
 * @type {RouteConfig}
 */
export const Route = createFileRoute('/sql/$number')({
    component: View,
    loader: ({ params }) => fetchChallenge(params.number),
    errorComponent: ({ error }) => <div>Error: {error.message}</div>,
    pendingComponent: ChallengeSkeleton,
    notFoundComponent: () => <div>Challenge not found</div>,
})
