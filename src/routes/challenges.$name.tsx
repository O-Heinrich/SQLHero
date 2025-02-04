import { Wrapper } from '@/components/Wrapper';
import { createFileRoute } from '@tanstack/react-router';

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
            <title>SQL Hero - Challenges</title>
            <h2>{challenge.name}</h2>
            <p>{challenge.description}</p>
        </Wrapper>
    );
}
