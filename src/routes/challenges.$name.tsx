import { useContext, useEffect, useState, useRef } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import dompurify from 'dompurify';
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-sql";
import "ace-builds/src-noconflict/theme-solarized_dark";
import "ace-builds/src-noconflict/theme-iplastic";
import "ace-builds/src-noconflict/ext-language_tools";
import { Wrapper } from '@/components/Wrapper';
import { Skeleton } from '@/components/Skeleton';
import { PGlightContext } from '@/lib/PGlightContext';
import { Button } from '@headlessui/react';
import { useTheme } from '@/hooks/useTheme';
import { Table } from '@/components/table';
import { NotificationContext } from '@/lib/NotificationContext';

/**
 * Fetches challenge data from the API
 * @async
 * @param {string} name - Challenge identifier
 * @returns {Promise<Object>} Challenge data
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
 * Represents the structure of challenge data
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

interface QueryResult {
    fields: { name: string }[];
    rows: Record<string, unknown>[];
}

/**
 * Main Challenge component that displays and manages SQL challenges
 * @component
 * @description
 * Provides a complete interface for:
 * - Displaying challenge details and lessons
 * - SQL editor with syntax highlighting
 * - Query execution capabilities
 * - Theme-aware styling
 */
function Challenge() {
    const { pg } = useContext(PGlightContext);
    const challenge = Route.useLoaderData() as ChallengeData;
    const [editorState, setEditorState] = useState('');
    const [result, setResult] = useState<QueryResult | null>(null);
    const [db, setDb] = useState<string>('');
    const hasLesson = challenge.lesson !== undefined;
    const lessonsRef = useRef<HTMLDivElement>(null);
    const notificator = useContext(NotificationContext);

    useEffect(() => {
        setEditorState(() => challenge.solution);
    }, [challenge]);

    useEffect(() => {
        if (pg && db === '') {
            fetch(challenge.meta.schema).then(async (response) => {
                try {
                    const sql = await response.text();
                    await pg.exec(sql);
                    setDb(() => sql);
                } catch (error) {
                    const errMsg = typeof error === 'string' ? error : (error as Error).message;
                    notificator.notify(`Failed to load schema: ${errMsg}`);
                }
            });
        }
    }, [db, pg, challenge, notificator]);

    const handleRun = async () => {
        if (!pg) return;
        try {
            const result = await pg.query(editorState);
            setResult(() => result as QueryResult);
        } catch (error) {
            const errMsg = typeof error === 'string' ? error : (error as Error).message;
            notificator.notify(`Failed to execute query: ${errMsg}`);
        }
    }

    return (
        <Wrapper>
            <title>SQL Hero - Challenge</title>
            <ChallengeHeader title={challenge.title} subtitle={challenge.meta.title} />
            {hasLesson && <ChallengeLesson ref={lessonsRef} lesson={challenge.lesson!} />}
            <div 
                dangerouslySetInnerHTML={{ __html: dompurify.sanitize(challenge.info) }} 
            />
            <ChallengeTask task={challenge.task} />
            <ChallengeEditor value={editorState} setValue={setEditorState} />
            <Button onClick={handleRun}>Run</Button>
            {result && <Table columns={result.fields.map((field) => field.name)} rows={result.rows.map((row) => Object.values(row))} />}
        </Wrapper>
    );
}

/**
 * Challenge header properties
 * 
 * @typedef ChallengeHeaderProps
 * @property {string} title - Challenge title
 * @property {string} subtitle - Challenge subtitle
 */
interface ChallengeHeaderProps {
    title: string;
    subtitle: string;
}

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
        <h2>{title}</h2>
        <h3>{subtitle}</h3>
    </>
);

/**
 * Challenge lesson display component with sanitized HTML
 * @component
 * @param {Object} props - Component properties
 * @param {string} props.lesson - HTML lesson content
 */
const ChallengeLesson: React.FC<{ 
    ref: React.Ref<HTMLDivElement>
    lesson: string 
}> = ({ ref, lesson }: { 
    ref: React.Ref<HTMLDivElement>;
    lesson: string; 
}) => (
    <div
        ref={ref}
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
 * SQL editor component with theme support
 * @component
 * @param {Object} props - Component properties
 * @param {string} props.value - Current editor value
 * @param {Function} props.setValue - Value update function
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
            theme={theme === 'dark' ? 'solarized_dark' : 'iplastic'}
            width='100%'
            height='300px'
            className='border-2 border-ridge shadow-lg border-gray-300 dark:border-gray-700 my-4 rounded-md'
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
    pendingComponent: () => <Skeleton />,
    notFoundComponent: () => <div>Challenge not found</div>,
});