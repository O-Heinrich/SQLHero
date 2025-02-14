import { IndexSkeleton } from '@/components/Skeleton';
import { Wrapper } from '@/components/Wrapper';
import { Button } from '@headlessui/react';
import { createLazyFileRoute, Link } from '@tanstack/react-router';
import databaseLight from '@/assets/database-light.svg';
import databaseDark from '@/assets/database-dark.svg';
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
                    <Link to="/challenges/$name" params={{name: '1'}}>
                        <Button className="mt-6 text-2xl">
                            Start
                        </Button>
                    </Link>
                </section>
                <img src={isDark ? databaseDark : databaseLight} alt="SQL Hero" className="w-1/2 max-w-132 dark:mix-blend-color-dodge" />
            </div>
        </Wrapper>
    )
}