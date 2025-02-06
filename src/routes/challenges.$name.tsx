import { createFileRoute } from '@tanstack/react-router';
import { PGlite } from '@electric-sql/pglite';

import { Wrapper } from '@/components/Wrapper';
import { PGliteProvider } from '@electric-sql/pglite-react';
import { live } from '@electric-sql/pglite/live';

const pg = await PGlite.create({
    extensions: {
        live,
    }
});

const fetchChallenge = async (name: string) => {
    const response = await fetch(`/api/challenges/${name}.json`);

    if (!response.ok) {
        throw new Error('Failed to fetch challenge');
    }

    return response.json();
}

export const Route = createFileRoute('/challenges/$name')({
    component: Challenge,
    loader: ({ params }) => {
        return fetchChallenge(params.name);
    }
});

function Challenge() {
    const challenge = Route.useLoaderData();
    return (
    <Wrapper>
        <PGliteProvider db={pg}>
            <title>SQL Hero - Challenges</title>
            <h2>{challenge.meta.title}</h2>
            <h3>{challenge.title}</h3>
            <p dangerouslySetInnerHTML={{__html: challenge.task}} />
        </PGliteProvider>
    </Wrapper>
    );
}
