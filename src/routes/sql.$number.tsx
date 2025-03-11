import { useContext, useEffect, useMemo, useRef, useState } from 'react';
// import { createPortal } from 'react-dom'
import { DockviewApi, DockviewReact, DockviewReadyEvent, IDockviewPanelProps } from 'dockview-react';
import { clsx } from 'clsx';
import { createFileRoute } from '@tanstack/react-router';
import { toast } from 'sonner';
import { ChallengeSkeleton } from '@/components/Skeleton';
import { useTheme } from '@/hooks/useTheme';
import { useAppState } from '@/hooks/useAppState';
import { Challenge } from '@/lib/types';
import { useChallengeNumber } from '@/hooks/useChallengeNumber';
import { toggleHeaderSuccess } from '@/lib/reducer';
import { QueryResult } from '@/lib/exec-engine/postgres-engine';
import { ChallengeLesson } from '@/components/ChallengeLesson';
import { QueryResultTable } from '@/components/QueryResultTable';
import { nextId } from '@/lib/dockview/defaultLayout';
import { LeftControls, RightControls } from '@/components/dockview/Controls';
import { EditorPanel } from '@/components/dockview/components';
import { PgExecEngineContext } from "@/context/PgExecEngineContext";
import '../../node_modules/dockview/dist/styles/dockview.css';

/**
 * Background style for the challenge workspace
 * @constant
 */
const BG_STYLE =
'w-full h-full dark:bg-gray-700 dark:bg-blend-overlay bg-blend-multiply dark:to-slate-800 dark:from-gray-700/80 from-white to-gray-200 bg-radial bg-size-125 bg-radial-[at_50%_50%]';


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
    const [api, setApi] = useState<DockviewApi | undefined>();

    const [, setActivePanel] = useState<string>();
    const [, setActiveGroup] = useState<string>();
    const challenge = Route.useLoaderData() as Challenge;
    const [value, setValue] = useState<string>('');
    const valueRef = useRef<string>('');
    const lessonRef = useRef<HTMLDivElement>(null);
    const isInitialized = useRef<boolean>(false);
    const { state, dispatch } = useAppState();
    const { updateSchema } = useContext(PgExecEngineContext);
    const challengeNumber = useChallengeNumber();
    const challengeIndex = useMemo(() => challengeNumber - 1, [challengeNumber]);
    const [result, setResult] = useState<QueryResult | undefined>();
    const [db, setDb] = useState<string>('');
    const { theme } = useTheme();

    useEffect(() => {
        dispatch({ type: 'SET_CURRENT_CHALLENGE', payload: challenge });
    }, [challenge, dispatch]);

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
        editorPanel: (props: IDockviewPanelProps) => <EditorPanel 
            initialContent={challenge.query} 
            api={props.api} 
            containerApi={props.containerApi} 
            params={props.params} 
        />,
        erdPanel: function ErdPanel() {
            const { theme } = useTheme();
            return (
                <div className={clsx('w-full h-full flex items-center justify-center p-4', BG_STYLE)}>
                    <img
                        key={`erd-${theme}`}
                        src={challenge.schema?.replace(
                            '.sql',
                            theme === 'dark' ? '-dark.svg' : '.svg',
                        )}
                        alt="ERD"
                        width="100%"
                        height="100%"
                        className="erd max-h-full max-w-full"
                    />
                </div>
            )
        },
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
        if (!api) {
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

            const editor = api.addPanel({
                id: `editor-${nextId()}`,
                title: 'SQL Editor',
                component: 'editorPanel',
            });
        
            const erd = api.addPanel({
                id: `erd-${nextId()}`,
                component: 'erdPanel',
                title: 'ER Diagram',
                position: {
                    referencePanel: editor,
                    direction: 'left',
                },
            });
        
            api.addPanel({
                id: `lesson-${nextId()}`,
                component: 'lessonPanel',
                title: 'Aufgabenstellung',
                position: {
                    referencePanel: editor,
                    direction: 'below',
                },
            });

            api.addPanel({
                id: `result-${nextId()}`,
                component: 'resultPanel',
                title: 'Ergebnis',
                position: {
                    referencePanel: erd,
                    direction: 'whitin',
                },
            });

            
            erd.api.setActive();
            editor.api.setActive();
            isInitialized.current = true;
        };

        loadLayout();

        return () => {
            api.clear();
            disposables.forEach((disposable) => disposable?.dispose());
        };
    }, [api, challenge, challengeIndex, challengeNumber, dispatch, theme, valueRef]);

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

    

    const onReady = (event: DockviewReadyEvent) => {

        setApi(() => event.api);
    }

    return (
        <DockviewReact
            popoutUrl="/popout.html"
            components={components}
            onReady={onReady}
            className={theme === 'dark' ? 'dockview-theme-abyss' : 'dockview-theme-light'}
            rightHeaderActionsComponent={RightControls}
            leftHeaderActionsComponent={LeftControls}
            // prefixHeaderActionsComponent={
            //     PrefixHeaderControls
            // }
        />
    )
}

/**
 * TanStack Router configuration for challenge routes
 * @constant
 * @type {RouteConfig}
 */
export const Route = createFileRoute('/sql/$number')({
    component: () => <View />,
    loader: ({ params }) => fetchChallenge(params.number),
    errorComponent: ({ error }) => <div>Error: {error.message}</div>,
    pendingComponent: ChallengeSkeleton,
    notFoundComponent: () => <div>Challenge not found</div>,
});

