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
 * @requires @tanstack/react-router
 * @requires sonner
 * @requires dompurify
 * @requires allotment
 * @requires react-ace
 */

import { useContext, useEffect, useMemo, useRef, useState } from 'react';
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
import { PGlightContext } from '@/context/PGlightContext';
import { Button } from '@headlessui/react';
import { useTheme } from '@/hooks/useTheme';
import { Table } from '@/components/table';
import { ERD, ErdControls } from '@/components/ERD';
import { useAppState } from '@/hooks/useAppState';
import { QueryResult, TableDiff } from '@/lib/types';
import { queryResultToStringArray, ResultSetComparison } from '@/lib/utils';
import { useChallengNumber } from '@/hooks/useChallengNumber';
import { BoltIcon, DownloadIcon, TableIcon } from '@/components/icons';

import "allotment/dist/style.css";


enum DetailViewPages {
    ERD,
    RESULT,
}

/**
 * Represents the core structure of SQL challenge data
 * @interface
 * @property {Object} meta - Challenge metadata
 * @property {string} meta.title - Unique identifier for the challenge
 * @property {string} meta.schema - Database schema file path/URL
 * @property {string} title - Display title of the challenge
 * @property {string} solution - Correct SQL query solution
 * @property {string} [lesson] - Optional educational content in HTML format
 * @property {string} task - Challenge requirements/instructions in HTML format
 * @property {string} info - Additional challenge information in HTML format
 */
interface ChallengeData {
    number: number;
    title: string;
    schema: string;
    description: string;
    difficulty: 'easy' | 'medium' | 'hard';
    query: string;
    hashedResult: string;
    hints: string[];
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
 * Toolbar component properties
 * @interface
 * @property {React.ReactNode} children - Toolbar content
 * @property {string} [className] - Additional CSS classes
 */
interface ToolbarProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Query result table properties
 * @interface
 * @extends TableProps
 * @property {QueryResult} result - Query result data
 */
interface QueryResultTableProps {
    id: string;
    result?: QueryResult;
}

interface DetailViewProps {
    result?: QueryResult;
    active: DetailViewPages;
    erd: string;
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
 * @component
 * @description
 * Provides an interactive SQL challenge interface with the following features:
 * - Challenge description and educational content display
 * - SQL editor with syntax highlighting and autocompletion
 * - Query execution and result visualization
 * - Automatic solution validation
 * - Progress tracking and success/failure feedback
 * 
 * Uses PGlightContext for database operations and theme context for visual customization.
 * 
 * @example
 * ```tsx
 * <Challenge />
 * ```
 */
function Challenge() {
    const { pg } = useContext(PGlightContext);
    const challenge = Route.useLoaderData() as ChallengeData;
    const rightColRef = useRef<HTMLDivElement>(null);
    const [editorState, setEditorState] = useState('');
    const [result, setResult] = useState<QueryResult | undefined>();
    const [db, setDb] = useState<string>('');
    const [activeView, setActiveView] = useState(DetailViewPages.ERD);
    const { dispatch } = useAppState();
    const challengeNo = useChallengNumber();
    const { theme } = useTheme();
    const isErdActive = useMemo(() => activeView === DetailViewPages.ERD, [activeView]);
    const erdFile = useMemo(
        () => challenge.schema.replace('.sql', theme === 'dark' ? '-dark.svg' : '.svg'),
        [challenge.schema, theme]
    );
    useEffect(() => {
        setEditorState(() => challenge.query);
        if (pg && db !== challenge.schema) {
            fetch(challenge.schema).then(async (response) => {
                try {
                    const sql = await response.text();
                    await pg.exec(sql);
                    // setResult(() => result as QueryResult);
                } catch (error) {
                    const errMsg = typeof error === 'string' ? error : (error as Error).message;
                    toast.error(`Failed to load schema: ${errMsg}`);
                } finally {
                    setDb(() => challenge.schema);
                }
            });
        }
    }, [db, pg, challenge, dispatch]);
    useEffect(() => {
        if (rightColRef.current) {
            setActiveView(() => DetailViewPages.ERD);
            rightColRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }, [challengeNo]);

    /**
     * Handles execution of a SQL query and validation against challenge solution
     * 
     * This function executes the current editor content as a SQL query, compares
     * the result against the expected solution, and manages the application state
     * based on the outcome (success, failure, error).
     * 
     * @function handleRun
     * @async
     * @returns {Promise<void>} Promise that resolves after query execution and state updates
     * 
     * @example
     * // Connect to handleRun to a button click event
     * <Button onClick={handleRun}>Run Query</Button>
     */
    const handleRun = async () => {
        if (!pg) return;
        try {
            let query: QueryResult|null = null;
            const result = await pg.query(editorState) as QueryResult;
            const key = challengeNo.toString();

            if (!ResultSetComparison.hasSolution(challengeNo.toString())) {
                query = await pg.query(challenge.query) as QueryResult;
                ResultSetComparison.storeSolutionHash(key, query);
            }

            const isCorrect = ResultSetComparison.compareWithSolution(key, result);

            dispatch({
                type: 'ATTEMPT_CHALLENGE',
                payload: { id: challenge.title }
            });

            if (isCorrect) {
                toast.success('Challenge completed successfully');
                dispatch({
                    type: 'COMPLETE_CHALLENGE',
                    payload: { id: challenge.title }
                });
            } else {
                query ??= {} as QueryResult;
                //const diff = ResultSetComparison.getDifference(query, result);
                toast.error('Query result does not match the solution');
                dispatch({
                    type: 'CHALLENGE_FAILED',
                    payload: {
                        id: challenge.title,
                        difference: {} as TableDiff
                    }
                });
            }

            setResult(() => result as QueryResult);
            setActiveView(() => DetailViewPages.RESULT);
        } catch (error) {
            const errMsg = typeof error === 'string' ? error : (error as Error).message;
            toast.error(errMsg);
        }
    }

    /**
     * Handles click event for ERD/Result toggle button
     * 
     * This function toggles the active view between ERD and query result display.
     */
    const handleErdClick = () => setActiveView(() => DetailViewPages.ERD);

    const handleDownloadClick = () => {
        const a = document.createElement('a');
        const file = challenge.schema.split('/').pop()?.replace('.sql', 'db.pdf') ?? '';
        a.href = `/databases/pdf/${file}`;
        a.download = file;
        a.click();
    }

    return (
        <div className="flex flex-col gap-4 flex-1 inset-0  mt-[calc(var(--spacing)*-20)] mb-[calc(var(--spacing)*-20)]">
            <Allotment>
                <TransformWrapper initialScale={2}>
                    <Allotment vertical={true} className="mt-20 pb-22 overflow-auto h-full bg-gray-200/50 dark:bg-slate-900/50">
                        <div className="relative h-full flex flex-col mx-4 mt-4 pb-4">
                            <ChallengeEditor value={editorState} setValue={setEditorState} />
                            <Toolbar className="mx-4 justify-center">
                                <ErdControls disabled={!isErdActive} />
                                {isErdActive && <Spacer />}
                                <Button className="icon" aria-label="ERD downloaden" title="ERD downloaden" onClick={handleDownloadClick}>
                                    <DownloadIcon size={1.5} />
                                </Button>
                                <Button className="icon" aria-label="ERD anzeigen" title="ERD anzeigen" disabled={isErdActive}  onClick={handleErdClick}>
                                    <TableIcon size={1.5} />
                                </Button>
                                <Button className="icon" aria-label="SQL ausführen" title="SQL ausführen" disabled={!isErdActive}  onClick={handleRun}>
                                    <BoltIcon size={1.5} />
                                </Button>
                            </Toolbar>
                        </div>
                        <DetailViewRoot active={activeView} result={result} erd={erdFile} />
                    </Allotment>
                </TransformWrapper>
                <div ref={rightColRef} className="px-4 pt-4 pb-22 overflow-auto h-full border-l-4 border-ridge border-white/80 dark:border-slate-900/80">
                    <title>SQL Hero - Challenge</title>
                    <ChallengeLesson lesson={challenge.description!} />
                </div>
            </Allotment>
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
const DetailViewRoot: React.FC<DetailViewProps> = ({ active, result, erd }) => {
    return (
        <div className="px-4 overflow-auto h-full pb-16 border-t-4 border-ridge border-white/20 dark:border-slate-900/20 mb-40">
            {active === DetailViewPages.RESULT && <QueryResultTable id="query-result" result={result} />}
            {active === DetailViewPages.ERD && <ERD src={erd} />}
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