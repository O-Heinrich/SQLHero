/**
* Home page component for SQL Hero application.
* Provides introduction and entry point to SQL challenges.
* 
* Features:
* - Welcome message and application description
* - Start button linking to first challenge
* - PostgreSQL logo that adapts to theme
* - Responsive layout with flex wrapping
* 
* @module Index
*/

import { IndexSkeleton } from '@/components/Skeleton';
import { Wrapper } from '@/components/Wrapper';
import { createLazyFileRoute, useNavigate } from '@tanstack/react-router';
import { useTheme } from '@/hooks/useTheme';
import { useEffect, useMemo } from 'react';
import { FlashButton } from '@/components/buttons';
import { DbIllustration } from '@/components/DbIllustration';
import { useAppState } from '@/hooks/useAppState';

/**
* Route configuration for home page.
* Includes loading, error and not found states.
*/
export const Route = createLazyFileRoute('/')({
    component: Index,
    errorComponent: ({ error }) => <div>Error: {error.message}</div>,
    pendingComponent: () => <IndexSkeleton />,
    notFoundComponent: () => <div>Challenge not found</div>,
})

/**
* Main component for the home page.
* Renders welcome content and animated PostgreSQL logo.
* 
* Key features:
* - Responsive two-column layout
* - Theme-aware styling for the PostgreSQL logo
* - Call-to-action button linking to first challenge
*/
function Index() {
    const navigate = useNavigate();
    const { state, dispatch } = useAppState();
    const { theme } = useTheme();

    useEffect(() => {
        if (state === undefined) {
            dispatch({ type: 'LOAD_STATE', payload: null });
        }
    }, [state]);

    /**
     * Memoized theme check to prevent unnecessary re-renders
     * Used for conditional styling of the PostgreSQL logo
     */
    const isDark = useMemo(() => theme === 'dark', [theme]);

    return (
        <Wrapper>
            <title>SQL Hero - Startseite</title>
            <div className="flex justify-center items-center min-h-full flex-wrap">
                <section className="flex-1 min-w-[360px] z-1">
                    <h2>Teste dein SQL Wissen!</h2>
                    <p>Teste dein SQL Wissen mit SQL Hero, dem SQL Tool mit interaktiven Übungen.</p>
                    <p>
                        Auf jeder Seite findest du eine Aufgabe. Beantworte die Aufgabe direkt auf der Seite.
                        Starte den Test und du siehst, ob deine Lösung richtig ist.
                    </p>
                    <FlashButton 
                        label="Start" 
                        size="lg"
                        onClick={() => navigate({ 
                            to: '/challenges/$name', 
                            params: { name: '1' } 
                        })} 
                    />
                </section>
                <DbIllustration isDarkMode={isDark} />
            </div>
        </Wrapper>
    )
}