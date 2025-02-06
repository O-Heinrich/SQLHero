import { createFileRoute } from '@tanstack/react-router';
import { PGlite } from '@electric-sql/pglite';
import ContentLoader from 'react-content-loader';
import DOMPurify from 'dompurify';

import { Wrapper } from '@/components/Wrapper';
import { PGliteProvider } from '@electric-sql/pglite-react';
import { live } from '@electric-sql/pglite/live';
import { useTheme } from '@/hooks/useTheme';


const fetchChallenge = async (name: string) => {
    const response = await fetch(`/api/challenges/${name}.json`);
    if (!response.ok) {
        throw new Error(`Challenge "${name}" not found (${response.status})`);
    }
    return response.json();
};

const Loading = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    return (
        <Wrapper>
            <ContentLoader
                width="100%"
                height={900}
                backgroundColor={isDark ? '#333' : '#f5f5f5'}
                foregroundColor={isDark ? '#555' : '#dbdbdb'}
                animate={true}
            >
                <rect x="0" y="0" rx="3" ry="3" width="250" height="3.75rem" />
                <rect x="10" y="4rem" rx="3" ry="3" width="100%" height="1.25rem" />
                <rect x="10" y="5.5rem" rx="3" ry="3" width="100%" height="1.25rem" />
                <rect x="10" y="7rem" rx="3" ry="3" width="100%" height="1.25rem" />
                <rect x="10" y="8.5rem" rx="3" ry="3" width="100%" height="1.25rem" />
                <rect x="10" y="10rem" rx="3" ry="3" width="100%" height="1.25rem" />
                <rect x="10" y="11.5rem" rx="3" ry="3" width="100%" height="1.25rem" />
                <rect x="10" y="13rem" rx="3" ry="3" width="100%" height="1.25rem" />
                <rect x="10" y="14.5rem" rx="3" ry="3" width="100%" height="1.25rem" />
                <rect x="10" y="16rem" rx="3" ry="3" width="100%" height="1.25rem" />
                <rect x="10" y="17.5rem" rx="3" ry="3" width="100%" height="1.25rem" />
                <rect x="10" y="19rem" rx="3" ry="3" width="100%" height="1.25rem" />
            </ContentLoader>
        </Wrapper>
    );
}

export const Route = createFileRoute('/challenges/$name')({
    component: Challenge,
    loader: ({ params }) => Promise.all([
        fetchChallenge(params.name),
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