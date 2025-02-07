import { createFileRoute } from '@tanstack/react-router';
import DOMPurify from 'dompurify';

import { Wrapper } from '@/components/Wrapper';
import { PGliteProvider } from '@electric-sql/pglite-react';
import { Skeleton } from '@/components/Skeleton';

import hljs from "highlight.js";

import { useContext, useEffect } from 'react';
import { PGlightContext } from '@/lib/PGlightContext';


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
    const pg = useContext(PGlightContext).pg;
    const challenge = Route.useLoaderData();
    const hasLesson = challenge.lesson !== undefined;

    useEffect(() => {
        hljs.highlightAll();
    }, []);
    
    return (
        <Wrapper>
            <PGliteProvider db={pg}>
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
            </PGliteProvider>
        </Wrapper>
    );
}