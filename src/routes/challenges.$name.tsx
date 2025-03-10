/**
 * @module SQLChallenge
 * @description
 * This module implements an interactive SQL learning environment with challenge management,
 * code editing, and real-time validation capabilities. It provides a complete interface
 * for users to learn and practice SQL through hands-on challenges.
 * 
 * Key features:
 * - Interactive SQL code editor with syntax highlighting
 * - Real-time query execution and validation
 * - Challenge progress tracking
 * - Educational content display
 * - Theme-aware UI components
 * 
 * The module uses several external dependencies:
 * - React for UI components and state management
 * - TanStack Router for routing
 * - Ace Editor for SQL editing
 * - DOMPurify for HTML sanitization
 * - Allotment for split-pane layouts
 * 
 * @requires react
 * @requires sonner
 * @requires allotment
 * @requires @tanstack/react-router
 */

import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { createFileRoute } from '@tanstack/react-router';
import { TransformWrapper } from "react-zoom-pan-pinch";
import { toast } from 'sonner';
import { Allotment } from "allotment";

import { ChallengeSkeleton } from '@/components/Skeleton';
import { PgExecEngineContext } from '@/context/PgExecEngineContext';
import { useTheme } from '@/hooks/useTheme';
import { ERD, ErdControls } from '@/components/ERD';
import { useAppState } from '@/hooks/useAppState';
import { TableDiff, ChallengeData } from '@/lib/types';
import { ResultSetComparison } from '@/lib/utils';
import { useChallengeNumber } from '@/hooks/useChallengeNumber';
import { IconButton } from '@/components/buttons/IconButton';
import { BREAKPOINTS } from 'virtual:sql-hero';
import { toggleHeaderSuccess } from '@/lib/reducer';
import { QueryResult, SqlExecutionResult } from '@/lib/exec-engine/postgres-engine';
import { PlayIcon, ArrowLeftIcon, ArrowDownOnSquareStackIcon } from '@heroicons/react/24/solid';
import { useResizeObserver } from '@/hooks/useResizeObserver';
/* import { CodeEditor } from '@/components/CodeEditor'; */
import { ChallengeLesson } from '@/components/ChallengeLesson';
import { ChallengeEditor } from '@/components/ChallengeEditor';
import { QueryResultTable } from '@/components/QueryResultTable';
import "allotment/dist/style.css";


/**
 * Background style for the challenge workspace
 * @constant
 */
const BG_STYLE = 'dark:bg-gray-700  dark:bg-blend-overlay bg-blend-multiply dark:to-slate-800 dark:from-gray-700/80 from-white to-gray-200 bg-radial bg-size-125 bg-radial-[at_50%_50%]';

/**
 * Enumeration of available detail view pages
 * 
 * Defines the possible display modes for the challenge detail view area.
 * Used to control which content is shown in the main challenge workspace.
 * 
 * @enum {number}
 */
enum DetailViewPages {
    /**
    * Entity Relationship Diagram view
    * Displays the database schema visualization
    */
    ERD,
    /**
    * Query Result view
    * Displays the output of executed SQL queries
    */
    RESULT,
}

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
    children: React.ReactNode;
    /**
    * Optional additional CSS classes to apply to the toolbar container
    * Allows for customization of the toolbar's appearance
    * 
    * @property {string} [className]
    */
    className?: string;
}

/**
 * Props interface for DetailView component
 * 
 * Defines the properties required for rendering the detail view area
 * of the challenge workspace, which can display either query results
 * or the database entity relationship diagram.
 * 
 * @interface DetailViewProps
 */
interface DetailViewProps {
    /**
    * Query result data to display when in RESULT view mode
    * Optional as it may not be available before first query execution
    * 
    * @property {QueryResult} [result]
    */
    result?: QueryResult;
    /**
     * Currently active view mode determining what content to display
     * Controls whether to show the ERD diagram or query results
     * 
     * @property {DetailViewPages} active
     * @see DetailViewPages enum
     */
    active: DetailViewPages;
    /**
     * Source URL for the entity relationship diagram image
     * Displayed when active view is set to DetailViewPages.ERD
     * 
     * @property {string} erd
     */
    erd: string;
    /**
     * Indicates whether the current view is on a mobile device
     * Used to adjust the layout and styling for mobile screens
     * 
     * @property {boolean} isMobile
     */
    isMobile: boolean;
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
    const response = await fetch(`/api/challenges/${name}.json`);
    if (!response.ok) {
        throw new Error(`Challenge "${name}" not found (${response.status})`);
    }
    return response.json();
};


/**
* Vertical Divider Component
* 
* A customizable vertical line divider element used to visually separate content
* in layouts. Adapts to both light and dark themes automatically.
* 
* @component VerticalDivider
*/
const Spacer: React.FC = () => <span className="inline-block h-12 my-1 w-0.5 self-stretch bg-neutral-100 dark:bg-white/10" />;

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
function Challenge() {
    const { pg, updateSchema } = useContext(PgExecEngineContext);
    const challenge = Route.useLoaderData() as ChallengeData;
    const rightColRef = useRef<HTMLDivElement>(null);
    const editorRef = useRef<string>('');
    const [result, setResult] = useState<QueryResult | undefined>();
    const [isMobile, setIsMobile] = useState(window.innerWidth < BREAKPOINTS.lg);
    const [db, setDb] = useState<string>('');
    const [activeView, setActiveView] = useState(DetailViewPages.ERD);
    const { state, dispatch } = useAppState();
    const challengeNo = useChallengeNumber();
    const challengeIndex = useMemo(() => challengeNo - 1, [challengeNo]);
    const { theme } = useTheme();
    const isErdActive = useMemo(() => activeView === DetailViewPages.ERD, [activeView]);
    const resizeObserve = useResizeObserver<HTMLElement>();
    const erdFile = useMemo(
        () => challenge.schema.replace('.sql', theme === 'dark' ? '-dark.svg' : '.svg'),
        [challenge.schema, theme]
    );

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
        const attempts = state.challenges[challengeIndex]?.attempts.filter(attempt => Boolean(attempt.query));
        const len = attempts?.length ?? 0;
        editorRef.current = len > 0 ? attempts[len - 1].query! : '';
    }, [challengeIndex, state.challenges]);

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
                    const sql = await response.text();
                    await updateSchema(sql);
                } catch (error) {
                    const errMsg = typeof error === 'string' ? error : (error as Error).message;
                    toast.error('Failed to load schema', {
                        description: errMsg
                    });
                } finally {
                    setDb(() => challenge.schema);
                }
            });
        }
    }, [db, challenge.schema, dispatch, updateSchema, state.challenges, challengeIndex]);

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
        if (rightColRef.current) {
            setActiveView(() => DetailViewPages.ERD);
            rightColRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [challengeNo]);

    /**
     * Handles responsive view detection based on window size changes
     * Switches between mobile and desktop views when breakpoint is crossed
     * 
     * This effect:
     * - Observes the window size and updates the view based on the breakpoint.
     * - Sets the active view to the ERD page when switching to mobile view.
     * 
     * @effect
     * @dependencies isMobile, resizeObserve, rightColRef
     */
    useEffect(() => {
        try {
            /**
             * Observes window body size and updates mobile view state
             * Uses the custom useResizeObserver hook to track size changes
             * 
             * Switches active view and mobile state when screen width 
             * crosses the defined large breakpoint
             * 
             * @param target - The window.document.body element to observe
             * @param callback - Resize event handler that checks mobile breakpoint
             */
            resizeObserve(window.document.body, (entries) => {
                for (const entry of entries) {
                    const smDevice = entry.contentRect.width < BREAKPOINTS.lg;
                    if (smDevice !== isMobile) {
                        setActiveView(() => DetailViewPages.ERD);
                        setIsMobile(() => smDevice);
                    }
                }
            });
        } catch (error) {
            const errMsg = typeof error === 'string' ? error : (error as Error).message;
            toast.error('Failed to observe window resize', {
                description: errMsg
            });
        }
    }, [isMobile, resizeObserve, rightColRef]);

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
        if (!pg) return;

        try {
            let queryResult: SqlExecutionResult | null = null;
            const key = challengeNo.toString(); // Create a key for the current challenge.
            const result = await pg.execute(editorRef.current ?? ''); // Execute the SQL query.

            if (!result.success) {
                throw new Error(result.error ?? 'An error occurred while executing the query.');
            }

            if (!ResultSetComparison.hasSolution(key) && !ResultSetComparison.hasSolution(`${key}-0`)) {
                queryResult = await pg.execute(challenge.query);
                if (queryResult.success) {
                    for (let i = 0; i < queryResult.data!.length; i++) {
                        ResultSetComparison.storeSolutionHash(`${key}-${i}`, queryResult.data![i]);
                    }
                } else {
                    throw new Error(result.error ?? 'An error occurred while executing the solution query.');
                }
            }

            const isCorrect = result.data!.reduce((success, result, i) => {
                const key = `${challengeNo.toString()}-${i}`;
                return success && ResultSetComparison.compareWithSolution(key, result);
            }, Boolean(result.data?.length));

            if (isCorrect) {
                toast.success('Erfolg', {
                    description: 'Ergebnis korrekt. Gut gemacht!'
                });
                dispatch({
                    type: 'COMPLETE_CHALLENGE',
                    payload: { index: challengeIndex, query: editorRef.current }
                });
            } else {
                toast.error('Fehler', {
                    description: 'Die gelieferten Datensätze stimmen nicht überein.'
                });
                dispatch({
                    type: 'CHALLENGE_FAILED',
                    payload: {
                        index: challengeIndex,
                        difference: {} as TableDiff,
                        query: editorRef.current
                    }
                });
            }

            setResult(() => result.data!.pop());
            setActiveView(() => DetailViewPages.RESULT);
        } catch (error) {
            // Handle errors and display an error message.
            const errMsg = typeof error === 'string' ? error : (error as Error).message;
            toast.error('Fehler beim Ausführen der Abfrage', {
                description: errMsg
            });
        }
    };

    /**
     * Switches the detail view to display the Entity Relationship Diagram
     * 
     * Sets the active view state to ERD mode, causing the UI to display
     * the database schema visualization instead of query results.
     * 
     * @function handleErdClick
     * @returns {void}
     */
    const handleErdClick = (): void => setActiveView(() => DetailViewPages.ERD);

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
        const a = document.createElement('a');
        const file = challenge.schema.split('/').pop()?.replace('.sql', '.pdf') ?? '';
        a.href = `/databases/pdf/${file}`;
        a.download = file;
        a.click();
    }

    if (isMobile) {
        return (
            <div key="mobile" className="flex flex-col gap-4 flex-1 inset-0  mt-[calc(var(--spacing)*-20)] mb-[calc(var(--spacing)*-20)]">
                <title>SQL Hero - Challenge</title>
                <TransformWrapper initialScale={2}>
                    <Allotment vertical={true} className="mt-1 pb-1 lg:mt-20 lg:pb-22 overflow-auto h-full">
                        <div ref={rightColRef} className="px-4 pt-4 pb-22 overflow-auto h-full border-l-4 border-ridge border-white/80 dark:border-slate-900/80">
                            <ChallengeLesson lesson={challenge.description!} difficulty={challenge.difficulty} />
                        </div>
                        <div className="relative h-full flex flex-col lg:mx-4 mt-4 pb-4 ">
                            <ChallengeEditor valueRef={editorRef} />
                            {/* <CodeEditor value={editorState} onChange={setEditorState} /> */}
                            <div className="flex-1">
                                <Toolbar className="mx-4 justify-center">
                                    <ErdControls disabled={!isErdActive} />
                                    {isErdActive && <Spacer />}
                                    <IconButton
                                        icon={<ArrowDownOnSquareStackIcon className="size-6" />}
                                        aria-label="ERD downloaden"
                                        title="ERD downloaden"
                                        disabled={!isErdActive}
                                        onClick={handleDownloadClick}
                                    />
                                    <IconButton
                                        icon={<ArrowLeftIcon className="size-6" />}
                                        aria-label="ERD anzeigen"
                                        title="ERD anzeigen"
                                        disabled={isErdActive}
                                        onClick={handleErdClick}
                                    />
                                    <IconButton
                                        icon={<PlayIcon className="size-6" />}
                                        aria-label="SQL ausführen"
                                        title="SQL ausführen"
                                        variant="primary"
                                        onClick={handleRun}
                                    />
                                </Toolbar>    
                                <DetailViewRoot active={activeView} result={result} erd={erdFile} isMobile={isMobile} />
                            </div>
                        </div>
                    </Allotment>
                </TransformWrapper>
            </div>
        );
    }

    return (
        <div key="desktop" className={`flex flex-col gap-4 flex-1 inset-0  mt-[calc(var(--spacing)*-20)] mb-[calc(var(--spacing)*-20)] `}>
            <title>SQL Hero - Challenge</title>
            <TransformWrapper initialScale={2}>
                <Allotment className="overflow-auto h-full">
                    <Allotment vertical={true} className={`mt-16 pb-22 overflow-auto h-full ${BG_STYLE}`}>
                        <div className="relative h-full flex flex-col mt-4 pb-4">
                            {<ChallengeEditor valueRef={editorRef} />}
                            {/* <CodeEditor ref={editorRef} value={''} /> */}
                            <Toolbar className="justify-center">
                                <ErdControls disabled={!isErdActive} />
                                {isErdActive && <Spacer />}
                                <IconButton
                                    icon={<ArrowDownOnSquareStackIcon className="size-6" />}
                                    aria-label="ERD downloaden"
                                    title="ERD downloaden"
                                    disabled={!isErdActive}
                                    onClick={handleDownloadClick}
                                />
                                <IconButton
                                    icon={<ArrowLeftIcon className="size-6" />}
                                    aria-label="ERD anzeigen"
                                    title="ERD anzeigen"
                                    disabled={isErdActive}
                                    onClick={handleErdClick}
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
                        <DetailViewRoot active={activeView} result={result} erd={erdFile} isMobile={isMobile} />
                    </Allotment>
                    <div ref={rightColRef} className="px-4 pt-4 pb-22 overflow-auto h-full border-l-4 border-ridge border-white/80 dark:border-slate-900/80">
                        <ChallengeLesson lesson={challenge.description!} difficulty={challenge.difficulty} />
                    </div>
                </Allotment>
            </TransformWrapper>
        </div>
    );
}

/**
 * Detail view root component for ERD and query result display
 * @component
 * @param {Object} props - Component properties
 * @param {DetailViewPages} props.active - Active detail view page
 * @param {QueryResult} props.result - Query result data
 * @param {string} props.erd - ERD image URL
 * @returns {React.ReactElement} Detail view root component
 * @example
 * ```tsx
 * <DetailViewRoot active={DetailViewPages.RESULT} result={result} erd={erd} />
 * ```
 */
const DetailViewRoot: React.FC<DetailViewProps> = ({ active, result, erd, isMobile }) => {
    const isResult = active === DetailViewPages.RESULT;
    const isErd = active === DetailViewPages.ERD;
    return (
        <div className={clsx(
            isErd && 'cursor-move',
            'h-full',
            isResult && 'lg:px-4 pb-16 mb-40',
            'border-t-4 border-ridge',
            'border-white/20 dark:border-slate-900/20',
            'overflow-auto',
            isMobile && BG_STYLE
        )}>
            {isResult && <QueryResultTable id="query-result" result={result} />}
            {isErd && <ERD src={erd} />}
        </div>
    );
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
 * TanStack Router configuration for challenge routes
 * @constant
 * @type {RouteConfig}
 */
export const Route = createFileRoute('/challenges/$name')({
    component: Challenge,
    loader: ({ params }) => fetchChallenge(params.name),
    errorComponent: ({ error }) => <div>Error: {error.message}</div>,
    pendingComponent: ChallengeSkeleton,
    notFoundComponent: () => <div>Challenge not found</div>,
});