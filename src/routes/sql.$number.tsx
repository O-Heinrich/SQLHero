import { useContext, useEffect, useRef, useState } from 'react';
import { editor as monacoEditor } from 'monaco-editor/esm/vs/editor/editor.api';
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

enum PanelTypes {
    LESSON = 'lesson',
    EDITOR = 'editor',
    ERD = 'erd',
    RESULT = 'result',
}

const PANEL_TYPES = Object.values(PanelTypes);

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
        editorPanel: (props: IDockviewPanelProps<{
            query: string;
            ref: React.RefObject<monacoEditor.IStandaloneCodeEditor>;
        }>) => <EditorPanel
            params={{
                initialContent: props.params.query,
                ref: props.params.ref,
                onExecuted: (result: QueryResult) => {
                    const erdPanel = api?.panels[1];
                    api?.addPanel({
                        id: `${PanelTypes.RESULT}-${nextId()}`,
                        component: 'resultPanel',
                        title: 'Ergebnis',
                        params: {
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

        const loadLayout = () => {
            const editor = api.addPanel({
                id: `${PanelTypes.EDITOR}-${nextId()}`,
                title: 'SQL Editor',
                component: 'editorPanel',
                params: {
                    query: valueRef.current,
                    ref: editorRef,
                },
            });

            const erd = api.addPanel({
                id: `${PanelTypes.ERD}-${nextId()}`,
                component: 'erdPanel',
                title: 'ER Diagram',
                params: {
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
                title: 'Aufgabenstellung',
                params: {
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
            /*  api.clear(); */
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
        const len = attempts?.length ?? 0;
        setQuery(len > 0 ? attempts[len - 1]?.query ?? '' : '')
        editorRef?.current?.setValue(len > 0 ? attempts[len - 1].query ?? '' : '');
    }, [challengeIndex, state.challenges, query, api?.panels])

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
        />
    );
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

