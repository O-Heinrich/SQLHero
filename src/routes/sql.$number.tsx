/**
 * @module ChallengeView
 * @description Provides the main SQL learning challenge interface with integrated editor,
 * database visualization, lesson display, and results panel. This module orchestrates
 * the complete interactive learning experience for SQL challenges.
 */

import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { editor as monacoEditor } from 'monaco-editor/esm/vs/editor/editor.api';
import { DockviewApi, DockviewReact, DockviewReadyEvent, IDockviewPanelHeaderProps, IDockviewPanelProps } from 'dockview-react';
import { clsx } from 'clsx';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { createFileRoute } from '@tanstack/react-router';
import { toast } from 'sonner';
import { ChallengeSkeleton } from '@/components/Skeleton';
import { useTheme } from '@/hooks/useTheme';
import { useAppState } from '@/hooks/useAppState';
import { Challenge, PanelTypes } from '@/lib/types';
import { useChallengeNumber } from '@/hooks/useChallengeNumber';
import { toggleHeaderSuccess } from '@/lib/reducer';
import { QueryResult } from '@/lib/exec-engine/postgres-engine';
import { ChallengeLesson } from '@/components/ChallengeLesson';
import { QueryResultTable } from '@/components/QueryResultTable';
import { nextId } from '@/lib/dockview/defaultLayout';
import { RightControls } from '@/components/dockview/Controls';
import { EditorPanel } from '@/components/dockview/components';
import { PgExecEngineContext } from "@/context/PgExecEngineContext";
import { ERD } from '@/components/ERD';

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
 * Array of all available panel type values
 * @constant
 */
const PANEL_TYPES = Object.values(PanelTypes);

/**
 * Custom tab header component for Dockview panels
 * 
 * Renders a header with the panel title and conditionally displays a close button
 * for result panels. The component detects if the panel is a result panel by checking
 * if the panel ID contains the PanelTypes.RESULT identifier.
 * 
 * @component
 * @param {IDockviewPanelHeaderProps<{title: string}>} props - The component props from Dockview
 * @param {Object} props.params - Parameters passed to the component
 * @param {string} props.params.title - The title to display in the header
 * @param {Object} props.api - The Dockview panel API
 * @param {string} props.api.id - The panel identifier
 * @param {Function} props.api.close - Function to close the panel
 * @returns {JSX.Element} The rendered tab header component
 */
const TabHeader: React.FunctionComponent<IDockviewPanelHeaderProps<{title: string}>> = (props) => {
    /**
     * Determines if the current panel is a result panel based on its ID
     * Memoized to prevent unnecessary recalculations
     */
    const isResult = useMemo(() => props.api.id.includes(PanelTypes.RESULT), [props.api.id]);
    
    return (
        <div className="flex gap-4 items-center justify-between py-2 px-4">
            <div className="text-gray-700 dark:text-gray-300">{props.params.title}</div>
            {isResult && (
                <div title={props.params.title} role="button" className="action" onClick={() => props.api.close()}>
                    <span
                        style={{ fontSize: 'inherit' }}
                    >
                        <XMarkIcon className="size-4" />
                    </span>
                </div>
            )}
        </div>
    );
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
    const valueRef = useRef<string>('');
    const lessonRef = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useState<string>('');
    const isInitialized = useRef<boolean>(false);
    const { state, dispatch } = useAppState();
    const { updateSchema } = useContext(PgExecEngineContext);
    const challengeNumber = useChallengeNumber();
    const challengeIndex = challengeNumber - 1;
    const [db, setDb] = useState<string>('');
    const editorRef = useRef<monacoEditor.IStandaloneCodeEditor | null>(null);
    const { theme } = useTheme();

    /**
     * Updates the current challenge in the app state when it changes
     */
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


    /**
     * Collection of panel components used in the dockview layout
     * 
     * @type {Record<string, React.FC<IDockviewPanelProps<any>>}
     */
    const components = {
        /**
         * Panel component for displaying challenge instructions and lesson content
         * 
         * @component
         * @param {IDockviewPanelProps<{description: string, difficulty: string, lessonRef: React.RefObject<HTMLDivElement>}>} props - Panel props
         * @returns {JSX.Element} Rendered lesson panel
         */
        lessonPanel: function LessonPanel(props: IDockviewPanelProps<{
            description: string;
            difficulty: 'easy' | 'medium' | 'hard' | 'unknown';
            lessonRef: React.RefObject<HTMLDivElement>
        }>) {
            const [content, setContent] = useState<string>('');
            useEffect(() => {
                setContent(props.params.description);
            }, [props.params.description]);
            return <div className={clsx('p-4 w-full h-full')}>
                <ChallengeLesson
                    lesson={content}
                    difficulty={props.params.difficulty}
                    ref={props.params.lessonRef}
                />
            </div>;
        },
        /**
         * Panel component for SQL editor with execution capabilities
         * 
         * @component
         * @param {IDockviewPanelProps<{query: string, ref: React.RefObject<monacoEditor.IStandaloneCodeEditor>}>} props - Panel props
         * @returns {JSX.Element} Rendered editor panel
         */
        editorPanel: (props: IDockviewPanelProps<{
            query: string;
            ref: React.RefObject<monacoEditor.IStandaloneCodeEditor>;
            erdSrc: string;
        }>) => <EditorPanel
            params={{
                erdSrc: props.params.erdSrc,
                initialContent: props.params.query,
                ref: props.params.ref,
                onExecuted: (result: QueryResult) => {
                    const erdPanel = api?.panels[1];
                    api?.addPanel({
                        id: `${PanelTypes.RESULT}-${nextId()}`,
                        component: 'resultPanel',
                        params: {
                            title: 'Ergebnis',
                            result: result,
                        },
                        position: {
                            direction: 'within',
                            referencePanel: erdPanel,
                        },
                    });
                },
            }} 
            api={props.api} 
            containerApi={props.containerApi} 
        />,
        /**
         * Panel component for displaying entity relationship diagrams
         * 
         * @component
         * @param {IDockviewPanelProps<{src: string}>} props - Panel props with diagram source
         * @returns {JSX.Element} Rendered ERD panel
         */
        erdPanel: function ErdPanel(props: IDockviewPanelProps<{ src: string }>) {
            const { theme } = useTheme();
            return (

                <div className={clsx('cursor-move h-full', BG_STYLE)}>
                    <ERD src={props.params.src?.replace(
                        '.sql',
                        theme === 'dark' ? '-dark.svg' : '.svg',
                    ) ?? ''} />
                </div>
            )
        },
        /**
         * Panel component for displaying SQL query results
         * 
         * @component
         * @param {IDockviewPanelProps<{result: QueryResult}>} props - Panel props with query result
         * @returns {JSX.Element} Rendered result table panel
         */
        resultPanel: (props: IDockviewPanelProps<{ result: QueryResult }>) => {
            return (
                <div
                    className={clsx(
                        'h-full',
                        'border-t-4 border-ridge',
                        'border-white/20 dark:border-slate-900/20',
                        'overflow-auto',
                    )}
                >
                    <QueryResultTable id="query-result" result={props.params.result} />
                </div>
            );
        },
    }

    /**
     * Manages the dockview layout initialization and panel updates
     * 
     * This effect:
     * - Sets up event listeners for panel and group changes
     * - Creates the initial dockview layout with editor, ERD, and lesson panels
     * - Updates panel content when challenge data changes
     * 
     * @effect
     * @dependencies api, challenge, query, theme
     */
    useEffect(() => {
        if (!api) {
            return;
        } else if (isInitialized.current) {
            api.panels.forEach((panel) => {
                const [type] = PANEL_TYPES.filter(type => type === panel.id.split('-')[0] as PanelTypes);
                switch (type) {
                    case PanelTypes.EDITOR:
                        editorRef.current?.setValue(query);
                        break;
                    case PanelTypes.ERD:
                        panel.api.updateParameters({ src: challenge.schema });
                        break;
                    case PanelTypes.LESSON:
                        panel.api.updateParameters({ description: challenge.description, difficulty: challenge.difficulty });
                        break;
                    default:
                        break;
                }

            });
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

        /**
         * Creates the initial dockview layout with editor, ERD, and lesson panels
         * 
         * @function loadLayout
         */
        const loadLayout = () => {
            const editor = api.addPanel({
                id: `${PanelTypes.EDITOR}-${nextId()}`,
                component: 'editorPanel',
                params: {
                    title: 'SQL Editor',
                    query: valueRef.current,
                    ref: editorRef,
                    erdSrc:  challenge.schema.replace('.sql', '.svg'),
                },
            });

            const erd = api.addPanel({
                id: `${PanelTypes.ERD}-${nextId()}`,
                component: 'erdPanel',
                params: {
                    title: 'ER Diagram',
                    src: challenge.schema.replace('.sql', '.svg'),
                },
                position: {
                    referencePanel: editor,
                    direction: 'left',
                },
            });

            api.addPanel({
                id: `${PanelTypes.LESSON}-${nextId()}`,
                component: 'lessonPanel',
                params: {
                    title: 'Aufgabenstellung',
                    description: challenge.description,
                    difficulty: challenge.difficulty,
                    lessonRef,
                },
                position: {
                    referencePanel: editor,
                    direction: 'below',
                },
            });

            erd.api.setActive();
            editor.api.setActive();
        };

        loadLayout();
        isInitialized.current = true;
        return () => {
            disposables.forEach((disposable) => disposable?.dispose());
        };
    }, [api, challenge, challengeIndex, challengeNumber, dispatch, query, theme, valueRef]);

    /**
     * Loads the challenge query and schema into the database.
     *
     * This effect:
     * - Fetches and executes the schema SQL if the database schema has changed.
     * - Updates the database state once the schema is loaded.
     *
     * @effect
     * @dependencies db, challenge.schema, updateSchema
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
        );
        const len = attempts?.length ?? 0;
        setQuery(len > 0 ? attempts[len - 1]?.query ?? '' : '')
        editorRef?.current?.setValue(len > 0 ? attempts[len - 1].query ?? '' : '');
    }, [challengeIndex, state.challenges, query, api?.panels])

    /**
     * Handles the ready event for the Dockview component.
     * Sets the API reference in state when the Dockview component is initialized.
     * 
     * @param {DockviewReadyEvent} event - The ready event object containing the Dockview API
     */
    const onReady = (event: DockviewReadyEvent) => {
        setApi(() => event.api);
    }

    /**
     * Renders the Dockview component with configuration for the SQL challenge environment.
     * Provides theme-based styling, custom header components, and popout functionality.
     * 
     * @returns {JSX.Element} The configured DockviewReact component
     */
    return (
        <>
            <title>SQL Hero - Challenges</title>
            <DockviewReact
                popoutUrl="/popout.html"
                components={components}
                onReady={onReady}
                className={theme === 'dark' ? 'dockview-theme-abyss' : 'dockview-theme-light'}
                rightHeaderActionsComponent={RightControls}
                defaultTabComponent={TabHeader}
            />
        </>
    );
}

/**
 * TanStack Router configuration for challenge routes
 * @constant
 * @type {RouteConfig}
 */
export const Route = createFileRoute('/sql/$number')({
    /**
     * Main component rendered for this route
     * @returns {JSX.Element} The View component for the SQL challenge
     */
    component: View,
    
    /**
     * Loads challenge data based on the route parameter
     * @param {Object} params - Route parameters
     * @param {string} params.number - Challenge number identifier
     * @returns {Promise<Challenge>} The challenge data
     */
    loader: ({ params }) => fetchChallenge(params.number),
    
    /**
     * Displays error information when challenge loading fails
     * @param {Object} props - Error component props
     * @param {Error} props.error - The error that occurred
     * @returns {JSX.Element} Error display component
     */
    errorComponent: ({ error }) => <div>Error: {error.message}</div>,
    
    /**
     * Component shown while challenge data is loading
     * @returns {JSX.Element} Loading skeleton component
     */
    pendingComponent: ChallengeSkeleton,
    
    /**
     * Component shown when the requested challenge doesn't exist
     * @returns {JSX.Element} Not found message component
     */
    notFoundComponent: () => <div>Challenge not found</div>,
});

