import { IndexSkeleton } from '@/components/Skeleton';
import { Wrapper } from '@/components/Wrapper';
import { Button } from '@headlessui/react';
import { createLazyFileRoute, Link } from '@tanstack/react-router';
import pgImage from '@/assets/pg.svg';
import { useTheme } from '@/hooks/useTheme';
import { useMemo } from 'react';

export const Route = createLazyFileRoute('/')({
    component: Index,
    errorComponent: ({ error }) => <div>Error: {error.message}</div>,
    pendingComponent: () => <IndexSkeleton />,
    notFoundComponent: () => <div>Challenge not found</div>,
})

function Index() {
    const { theme } = useTheme();
    const isDark = useMemo(() => theme === 'dark', [theme]);

    return (
        <Wrapper>
            <title>SQL Hero - Startseite</title>
            <div className="flex items-center h-full">
                <section className="flex-1">
                    <h2>Teste dein SQL Wissen!</h2>
                    <p>Teste dein SQL Wissen mit SQL Hero, dem SQL Tool mit interaktiven Übungen.</p>
                    <p>Auf jeder Seite findest du eine Aufgabe. Beantworte die Aufgabe direkt auf der Seite. Starte den Test und du siehst, ob deine Lösung richtig ist.</p>
                    <Link to="/challenges/$name" params={{ name: '1' }}>
                        <Button className="mt-6 text-2xl">
                            Start
                        </Button>
                    </Link>
                </section>
                <img
                    src={pgImage}
                    alt="SQL Hero"
                    width="400"
                    height="auto"
                    style={{ 
                        filter: isDark ? 'drop-shadow(-0.2em 1.5em 0.95em rgba(0, 0, 0, 0.41))' : 'drop-shadow(rgb(128, 128, 128) -0.2em 1.5em 0.95em)',
                        perspective: '200px',
                        perspectiveOrigin: '250% 50%',
                        transform: 'perspective(1200px) translate3d(-10px, 20px, 400px) rotate3d(100, 0.2, -0.1, 337deg)',
                    }}
                />
            </div>
        </Wrapper>
    )
}