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

import { useContext, useEffect, useMemo, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
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
import { useAppState } from '@/hooks/useAppState';
import "allotment/dist/style.css";
import { QueryResult } from '@/lib/types';
import { queryResultToStringArray } from '@/lib/utils';
import { DEBUG } from '@/constants';

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
    meta: {
        title: string;
        schema: string;
    };
    title: string;
    solution: string;
    lesson?: string;
    task: string;
    info: string;
}

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
    result: QueryResult;
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
    const [editorState, setEditorState] = useState('');
    const [result, setResult] = useState<QueryResult | null>(null);
    const [db, setDb] = useState<string>('');
    const { state, dispatch } = useAppState();
    const hasLesson = challenge.lesson !== undefined;
    useEffect(() => {
        if (pg && db !== challenge.meta.schema) {
            fetch(challenge.meta.schema).then(async (response) => {
                try {
                    const sql = await response.text();
                    const result = await pg.exec(sql);
                    console.log(result)
                } catch (error) {
                    const errMsg = typeof error === 'string' ? error : (error as Error).message;
                    toast.error(`Failed to load schema: ${errMsg}`);
                } finally {
                    setDb(() => challenge.meta.schema);
                }
            });
        }
    }, [db, pg, challenge]);

    const handleRun = async () => {
        if (!pg) return;
        try {
            const result = await pg.query(editorState);
            const sollution = await pg.query(challenge.solution);
            const isCorrect = JSON.stringify(result.rows) === JSON.stringify(sollution?.rows);

            if (DEBUG) {
                console.table(result.rows);
                console.table(sollution?.rows);
                console.log(isCorrect);
            }

            dispatch({
                type: 'ATTEMPT_CHALLENGE',
                payload: { id: challenge.meta.title }
            });

            if (isCorrect) {
                toast.success('Challenge completed successfully');
                state.headerElement?.classList.add('bg-green-500/50');
                dispatch({
                    type: 'COMPLETE_CHALLENGE',
                    payload: { id: challenge.meta.title }
                });
            } else {
                toast.error('Query result does not match the solution');
                state.headerElement?.classList.add('bg-red-500/50');
            }

            setResult(() => result as QueryResult);
        } catch (error) {
            const errMsg = typeof error === 'string' ? error : (error as Error).message;
            toast.error(`Failed to load schema: ${errMsg}`);
        }
    }

    return (
        <div className="flex flex-col gap-4 flex-1 inset-0  mt-[calc(var(--spacing)*-20)] mb-[calc(var(--spacing)*-20)]">
            <Allotment>
                <Allotment vertical={true} className="mt-20 pb-22 overflow-auto h-full bg-gray-200/50 dark:bg-slate-900/50">
                    <div className="relative h-full flex flex-col mx-4 mt-4 pb-4">
                        <ChallengeEditor value={editorState} setValue={setEditorState} />
                        <Toolbar className="mx-4">
                            <Button onClick={handleRun}>Run</Button>
                        </Toolbar>
                    </div>
                    <div className="px-4 overflow-auto h-full pb-16 border-t-4 border-ridge border-white/20 dark:border-slate-900/20">
                        {result && result.fields.length > 0 
                            ? <QueryResultTable id="query-result" result={result ?? {} as QueryResult} />
                            : <Table id="query-result" columns={['Ergebnis Tabelle']} rows={[['']]} />
                        }
                    </div>
                </Allotment>
                <div className="px-4 pt-4 pb-22 overflow-auto h-full border-l-4 border-ridge border-white/80 dark:border-slate-900/80">
                    <title>SQL Hero - Challenge</title>
                    <ChallengeHeader title={challenge.title} subtitle={challenge.meta.title} />
                    {hasLesson && <ChallengeLesson lesson={challenge.lesson!} />}
                    <div 
                        dangerouslySetInnerHTML={{ __html: dompurify.sanitize(challenge.info) }} 
                    />
                    <ChallengeTask task={challenge.task} />
                </div>
            </Allotment>
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
    result: QueryResult; 
    id: string; 
}): React.ReactElement => {
    const data = useMemo(() => queryResultToStringArray(result), [result]);
    return (
        <Table {...props} columns={data.columns} rows={data.rows} />
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
 */
const ChallengeHeader: React.FC<ChallengeHeaderProps> = ({ 
    title, 
    subtitle 
}: { 
    title: string; 
    subtitle: string; 
}) => (
    <>
        <h2 style={{paddingTop: '2em'}}>{title}</h2>
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
    <div
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
 */
const ChallengeTask: React.FC<{ task: string }> = ({ task }: { task: string }) => (
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