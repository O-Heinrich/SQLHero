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
 * @requires dompurify
 * @requires allotment
 * @requires react-ace
 * @requires react-zoom-pan-pinch
 * @requires @tanstack/react-router
 */

import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { clsx } from 'clsx';
import { createFileRoute } from '@tanstack/react-router';
import { TransformWrapper } from "react-zoom-pan-pinch";
import { toast } from 'sonner';
import dompurify from 'dompurify';
import { Allotment } from "allotment";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/theme-iplastic";
import "ace-builds/src-noconflict/ext-language_tools";
import { ChallengeSkeleton } from '@/components/Skeleton';
import { PgExecEngineContext } from '@/context/PgExecEngineContext';
import { useTheme } from '@/hooks/useTheme';
import { Table } from '@/components/table';
import { ERD, ErdControls } from '@/components/ERD';
import { useAppState } from '@/hooks/useAppState';
import { TableDiff } from '@/lib/types';
import { queryResultToStringArray, ResultSetComparison } from '@/lib/utils';
import { useChallengeNumber } from '@/hooks/useChallengeNumber';
import { IconButton } from '@/components/buttons/IconButton';
import { BREAKPOINTS } from 'virtual:sql-hero';
import { toggleHeaderSuccess } from '@/lib/reducer';
import { QueryResult, SqlExecutionResult } from '@/lib/exec-engine/postgres-engine';
import { BoltIcon, DownloadIcon, TableIcon } from '@/components/icons';

import "allotment/dist/style.css";

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
 * Represents the structure of a challenge, typically used in coding or database-related challenges.
 * 
 * This interface defines the properties required to describe a challenge, including its metadata, 
 * schema, and expected results.
 * 
 * @interface ChallengeData
 */
interface ChallengeData {
    /**
     * @property {number} number
     * @description A unique identifier or sequence number for the challenge.
     * @example 1
     */
    number: number;

    /**
     * @property {string} title
     * @description The title or name of the challenge.
     * @example "Find the highest salary"
     */
    title: string;

    /**
     * @property {string} schema
     * @description The schema or structure of the database/table(s) relevant to the challenge.
     * This is typically a SQL schema or a JSON representation of the data structure.
     * @example "CREATE TABLE employees (id INT, name TEXT, salary INT);"
     */
    schema: string;

    /**
     * @property {string} description
     * @description A detailed description of the challenge, including the problem statement and requirements.
     * @example "Write a query to find the employee with the highest salary."
     */
    description: string;

    /**
     * @property {'easy' | 'medium' | 'hard'} difficulty
     * @description The difficulty level of the challenge.
     * Possible values: 'easy', 'medium', 'hard'.
     * @example "medium"
     */
    difficulty: 'easy' | 'medium' | 'hard';
    /**
     * @property {string} query
     * @description The query or solution to the challenge. This is typically a SQL query or code snippet.
     * @example "SELECT name, MAX(salary) FROM employees;"
     */
    query: string;
    /**
     * @property {string} hashedResult
     * @description A hashed representation of the expected result of the challenge.
     * This is used to verify the correctness of the user's solution.
     * @example "a1b2c3d4e5f6g7h8i9j0"
     */
    hashedResult: string;
    /**
     * @property {string[]} hints
     * @description An array of hints to assist the user in solving the challenge.
     * Each hint is a string that provides guidance or clues.
     * @example ["Use the MAX() function", "Filter by salary"]
     */
    hints: string[];
    /**
     * @property {string} [erd]
     * @description Optional property representing an Entity-Relationship Diagram (ERD) for the challenge.
     * This is typically a URL or base64-encoded image of the ERD.
     * @example "https://example.com/erd.png"
     */
    erd?: string;
};

/**
 * Challenge header properties
 * @interface
 * @property {string} title - Challenge title
 * @property {string} subtitle - Challenge subtitle
 */
interface ChallengeHeaderProps {
    title: string;
    subtitle: string;
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
 * Props interface for QueryResultTable component
 * 
 * Defines the properties required for rendering a table that displays
 * SQL query execution results in a structured format.
 * 
 * @interface QueryResultTableProps
 */
interface QueryResultTableProps {
    /**
    * Unique identifier for the result table
    * Used for DOM identification and accessibility purposes
    * 
    * @property {string} id
    */
    id: string;
    /**
    * Query result data to display in the table
    * Optional as it may not be available before query execution
    * Contains fields, rows, and metadata from the executed query
    * 
    * @property {QueryResult} [result]
    */
    result?: QueryResult;
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
    const [editorState, setEditorState] = useState('');
    const [result, setResult] = useState<QueryResult | undefined>();
    const [isMobile, setIsMobile] = useState(window.innerWidth < BREAKPOINTS.lg);
    const [db, setDb] = useState<string>('');
    const [activeView, setActiveView] = useState(DetailViewPages.ERD);
    const { state, dispatch } = useAppState();
    const challengeNo = useChallengeNumber();
    const { theme } = useTheme();
    const isErdActive = useMemo(() => activeView === DetailViewPages.ERD, [activeView]);
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
        dispatch({ type: 'INIT_CHALLENGE', payload: { index: challengeNo - 1 } });
        const notCompleted = !state.challenges[challengeNo - 1].completed;
        toggleHeaderSuccess(notCompleted, state.headerElement);
    }, [challengeNo, dispatch, state.challenges, state.headerElement]);

    /**
     * Loads the challenge query and schema into the editor and database.
     * 
     * This effect:
     * - Sets the editor state to the challenge query.
     * - Fetches and executes the schema SQL if the database schema has changed.
     * - Updates the database state once the schema is loaded.
     * 
     * @effect
     * @dependencies db, pg, challenge, dispatch
     */
    useEffect(() => {
        // When fast debuging, the editorState is set 
        // to the challenge query: setEditorState(() => challenge.query);
        const query = state.challenges[challengeNo - 1]?.attempts.filter(attempt => Boolean(attempt.query)).pop()?.query ?? '';
        setEditorState(() => query);
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
    }, [db, challenge, dispatch, updateSchema, state.challenges, challengeNo]);

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
     * Observes changes in the viewport width and updates the UI for mobile responsiveness.
     * 
     * This effect:
     * - Uses the `ResizeObserver` API to monitor changes in the viewport width.
     * - Updates the `isMobile` state and switches the active view to the ERD (Entity-Relationship Diagram)
     *   when the viewport width crosses a breakpoint (e.g., for small devices).
     * - Cleans up the observer when the component unmounts or dependencies change.
     * 
     * @effect
     * @dependencies isMobile, rightColRef
     */
    useEffect(() => {
        if ('ResizeObserver' in window && rightColRef.current) {
            const observer = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    const smDevice = entry.contentRect.width < BREAKPOINTS.lg;
                    if (smDevice !== isMobile) {
                        setActiveView(() => DetailViewPages.ERD);
                        setIsMobile(() => smDevice);
                    }
                }
            });

            observer.observe(window.document.body);
            return () => observer.disconnect();
        }
    }, [isMobile, rightColRef]);

    /**
     * Handles the execution of a SQL query or a series of SQL statements for a specific challenge.
     * 
     * This function:
     * - Executes the SQL query/queries provided in the `editorState`.
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
            const challengeIndex = challengeNo - 1; // Calculate the challenge index.
            const result = await pg.execute(editorState); // Execute the SQL query.

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
                    payload: { index: challengeIndex, query: editorState }
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
                        query: editorState
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
                            <ChallengeLesson lesson={challenge.description!} />
                        </div>
                        <div className="relative h-full flex flex-col lg:mx-4 mt-4 pb-4 ">
                            <ChallengeEditor value={editorState} setValue={setEditorState} />
                            <Toolbar className="mx-4 justify-center">
                                <ErdControls disabled={!isErdActive} />
                                {isErdActive && <Spacer />}
                                <IconButton
                                    icon={<DownloadIcon size={1.5} />}
                                    aria-label="ERD downloaden"
                                    title="ERD downloaden"
                                    onClick={handleDownloadClick}
                                />
                                <IconButton
                                    icon={<TableIcon size={1.5} />}
                                    aria-label="ERD anzeigen"
                                    title="ERD anzeigen"
                                    disabled={isErdActive}
                                    onClick={handleErdClick}
                                />
                                <IconButton
                                    icon={<BoltIcon size={1.5} />}
                                    aria-label="SQL ausführen"
                                    title="SQL ausführen"
                                    disabled={!isErdActive}
                                    onClick={handleRun}
                                />
                            </Toolbar>
                        </div>
                        <DetailViewRoot active={activeView} result={result} erd={erdFile} isMobile={isMobile} />
                    </Allotment>
                </TransformWrapper>
            </div>
        );
    }

    return (
        <div key="desktop" className="flex flex-col gap-4 flex-1 inset-0  mt-[calc(var(--spacing)*-20)] mb-[calc(var(--spacing)*-20)]">
            <title>SQL Hero - Challenge</title>
            <TransformWrapper initialScale={2}>
                <Allotment className="overflow-auto h-full">
                    <Allotment vertical={true} className="mt-20 pb-22 overflow-auto h-full bg-gray-200/50 dark:bg-slate-900/50">
                        <div className="relative h-full flex flex-col lg:mx-4 mt-4 pb-4">
                            <ChallengeEditor value={editorState} setValue={setEditorState} />
                            <Toolbar className="mx-4 justify-center">
                                <ErdControls disabled={!isErdActive} />
                                {isErdActive && <Spacer />}
                                <IconButton
                                    icon={<DownloadIcon size={1.5} />}
                                    aria-label="ERD downloaden"
                                    title="ERD downloaden"
                                    onClick={handleDownloadClick}
                                />
                                <IconButton
                                    icon={<TableIcon size={1.5} />}
                                    aria-label="ERD anzeigen"
                                    title="ERD anzeigen"
                                    disabled={isErdActive}
                                    onClick={handleErdClick}
                                />
                                <IconButton
                                    icon={<BoltIcon size={1.5} />}
                                    aria-label="SQL ausführen"
                                    title="SQL ausführen"
                                    disabled={!isErdActive}
                                    onClick={handleRun}
                                />
                            </Toolbar>
                        </div>
                        <DetailViewRoot active={activeView} result={result} erd={erdFile} isMobile={isMobile} />
                    </Allotment>
                    <div ref={rightColRef} className="px-4 pt-4 pb-22 overflow-auto h-full border-l-4 border-ridge border-white/80 dark:border-slate-900/80">
                        <ChallengeLesson lesson={challenge.description!} />
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
            isMobile && 'bg-gray-200/50 dark:bg-slate-900/50'
        )}>
            {isResult && <QueryResultTable id="query-result" result={result} />}
            {isErd && <ERD src={erd} />}
        </div>
    );
}

/** 
 * Query result table component
 * 
 * @description 
 * The component uses the Table component to render the query result data in a tabular format.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {QueryResult} props.result - Query result data
 * @param {string} props.id - Unique table identifier
 * @returns {React.ReactElement} Query result table
 */
const QueryResultTable: React.FC<QueryResultTableProps> = ({
    result,
    ...props
}: {
    result?: QueryResult;
    id: string;
}): React.ReactElement => {
    const data = useMemo(() => result && queryResultToStringArray(result), [result]);
    return (
        <>
            {data && result && result.fields.length
                ? <Table {...props} columns={data.columns} rows={data.rows} />
                : <Table id={props.id} columns={['Ergebnis Tabelle']} rows={[['']]} />
            }
        </>
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
    <div className={`flex gap-2 justify-end p-2 ${className ?? ''}`}>
        {children}
    </div>
);

/**
 * Challenge header component
 * @component
 * @param {Object} props - Component properties
 * @param {string} props.title - Challenge title
 * @param {string} props.subtitle - Challenge subtitle
 * @deprecated
 */
export const ChallengeHeader: React.FC<ChallengeHeaderProps> = ({
    title,
    subtitle
}: {
    title: string;
    subtitle: string;
}) => (
    <>
        <h2 style={{ paddingTop: '2em' }}>{title}</h2>
        <h3>{subtitle}</h3>
    </>
);

/**
 * Challenge lesson display component with sanitized HTML
 * @component
 * @param {Object} props - Component properties
 * @param {string} props.lesson - HTML lesson content
 */
const ChallengeLesson: React.FC<{ lesson: string }> = ({
    lesson
}: {
    lesson: string;
}) => (
    <div className="mt-24"
        dangerouslySetInnerHTML={{
            __html: dompurify.sanitize(lesson)
        }}
    />
);

/**
 * Challenge task display component with sanitized HTML
 * @component
 * @param {Object} props - Component properties
 * @param {string} props.task - HTML task content
 * @deprecated
 */
export const ChallengeTask: React.FC<{ task: string }> = ({ task }: { task: string }) => (
    <p
        dangerouslySetInnerHTML={{
            __html: dompurify.sanitize(task)
        }}
    />
);

/**
 * SQL code editor component with theme awareness
 * @component
 * @description
 * Provides a full-featured SQL editor using Ace Editor with:
 * - Syntax highlighting
 * - Autocompletion
 * - Theme-aware styling
 * - Line numbers
 * - Live autocompletion
 * 
 * @param {Object} props - Component properties
 * @param {string} props.value - Current SQL query content
 * @param {React.Dispatch<string>} props.setValue - Function to update query content
 * 
 * @example
 * ```tsx
 * const [query, setQuery] = useState('');
 * <ChallengeEditor 
 *   value={query} 
 *   setValue={setQuery}
 * />
 * ```
 */
const ChallengeEditor: React.FC<{ value: string, setValue: React.Dispatch<string> }> = ({
    value, setValue
}: {
    value: string,
    setValue: React.Dispatch<string>
}) => {
    const { theme } = useTheme();
    return (
        <AceEditor
            mode="sql"
            theme={theme === 'dark' ? 'one_dark' : 'iplastic'}
            width='100%'
            height='100%'
            className='border-2 border-ridge shadow-lg border-gray-300 dark:border-gray-700 absolute inset-0'
            setOptions={{
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true,
                enableSnippets: true,
                showLineNumbers: true,
                tabSize: 4,
                cursorStyle: 'smooth',
            }}
            fontSize={16}
            value={value}
            onChange={(value: string) => setValue(value)}
            name="editor"
            editorProps={{ $blockScrolling: true }}
        />
    );
}

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