import { createFileRoute } from '@tanstack/react-router';
import { PGlite } from '@electric-sql/pglite';
import DOMPurify from 'dompurify';

import { Wrapper } from '@/components/Wrapper';
import { PGliteProvider } from '@electric-sql/pglite-react';
import { live } from '@electric-sql/pglite/live';
import { Loading } from '@/components/Loader';


const fetchChallenge = async (name: string) => {
    const response = await fetch(`/api/challenges/${name}.json`);
    if (!response.ok) {
        throw new Error(`Challenge "${name}" not found (${response.status})`);
    }
    return response.json();
};

export const Route = createFileRoute('/challenges/$name')({
    component: Challenge,
    loader: ({ params }) => Promise.all([
        fetchChallenge(params.name),
        // ToDo: Not ideal to create a new PGlite instance for each challenge
        //       but at the moment it's the easiest way to get it working.
        //       Refactor to use a single instance for all challenges!
        PGlite.create({
            extensions: { live }
        })
    ]),
    errorComponent: ({ error }) => <div>Error: {error.message}</div>,
    pendingComponent: () => <Loading />,
    notFoundComponent: () => <div>Challenge not found</div>,
});

function Challenge() {
    const [challenge, pg] = Route.useLoaderData();
    const hasLesson = challenge.lesson !== undefined;
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