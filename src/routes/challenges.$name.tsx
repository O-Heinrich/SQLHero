import { useContext, useEffect, useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import DOMPurify from 'dompurify';
import hljs from "highlight.js";

import { Wrapper } from '@/components/Wrapper';
import { Skeleton } from '@/components/Skeleton';
import { PGlightContext } from '@/lib/PGlightContext';
import { Button } from '@headlessui/react';


const fetchChallenge = async (name: string) => {
    const response = await fetch(`/api/challenges/${name}.json`);
    if (!response.ok) {
        throw new Error(`Challenge "${name}" not found (${response.status})`);
    }
    return response.json();
};

export const Route = createFileRoute('/challenges/$name')({
    component: Challenge,
    loader: ({ params }) => fetchChallenge(params.name),
    errorComponent: ({ error }) => <div>Error: {error.message}</div>,
    pendingComponent: () => <Skeleton />,
    notFoundComponent: () => <div>Challenge not found</div>,
});

function Challenge() {
    const [isHighlighted, setIsHighlighted] = useState(false);
    const pg = useContext(PGlightContext).pg;
    const challenge = Route.useLoaderData();
    const hasLesson = challenge.lesson !== undefined;

    useEffect(() => {
        if (!isHighlighted) {
            hljs.highlightAll();
            setIsHighlighted(true);
        }
    }, [isHighlighted]);

    const handleRun = async () => {
        if (!pg) return;
        const body = await fetch('/databases/nordwind.sql');
        const sql = await body.text();

        const schemaResult = await pg.exec(sql);
        console.log(schemaResult);
        const result = await pg.query('SELECT * FROM customers');
        console.log(result);
    }
    
    return (
        <Wrapper>
            <title>SQL Hero - {challenge.meta.title}</title>
            <h2>{challenge.meta.title}</h2>
            <h3>{challenge.title}</h3>
            {hasLesson && (
                <div
                    dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(challenge.lesson)
                    }}
                />
            )}
            <p
                dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(challenge.task)
                }}
            />
            <Button onClick={handleRun}>Run</Button>
        </Wrapper>
    );
}