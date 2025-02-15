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
            <div className="flex justify-center overflow-hidden items-center min-h-full flex-wrap">
                <section className="flex-1 min-w-md z-1">
                    <h2>Teste dein SQL Wissen!</h2>
                    <p>Teste dein SQL Wissen mit SQL Hero, dem SQL Tool mit interaktiven Übungen.</p>
                    <p>Auf jeder Seite findest du eine Aufgabe. Beantworte die Aufgabe direkt auf der Seite. Starte den Test und du siehst, ob deine Lösung richtig ist.</p>
                    <Link to="/challenges/$name" params={{ name: '1' }}>
                        <Button className="mx-4 mt-6 text-2xl">
                            Start
                        </Button>
                    </Link>
                </section>
                <img
                    src={pgImage}
                    alt="SQL Hero"
                    width="400"
                    height="auto"
                    className="min-w-[200px] max-w-[400px] flex-1"
                    style={{ 
                        mixBlendMode: isDark ? 'color-dodge' : 'multiply',
                        filter: isDark ? 'drop-shadow(rgba(0 0 0 / 60%) -0.2em -1em 1.2em)' : 'drop-shadow(rgb(128 128 128 / 40%) -0.2em -1em 1.2em)',
                        perspective: '200px',
                        perspectiveOrigin: '250% 50%',
                        transition: 'all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1)',
                        transform: 'perspective(1200px) translate3d(20px, 20px, 400px) rotate3d(100, 0.2, -0.1, 330deg)',
                    }}
                />
            </div>
        </Wrapper>
    )
}