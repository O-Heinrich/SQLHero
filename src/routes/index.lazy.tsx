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
import pgImage from '@/assets/pg.svg';
import { useTheme } from '@/hooks/useTheme';
import { useMemo } from 'react';
import { FlashButton } from '@/components/buttons';

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
    const { theme } = useTheme();

    /**
     * Memoized theme check to prevent unnecessary re-renders
     * Used for conditional styling of the PostgreSQL logo
     */
    const isDark = useMemo(() => theme === 'dark', [theme]);

    return (
        <Wrapper>
            <title>SQL Hero - Startseite</title>

            {/* Main content container with responsive flex layout */}
            <div className="flex justify-center items-center min-h-full flex-wrap">

                {/* Text content section */}
                <section className="flex-1 min-w-md z-1">
                    <h2>Teste dein SQL Wissen!</h2>
                    <p>Teste dein SQL Wissen mit SQL Hero, dem SQL Tool mit interaktiven Übungen.</p>
                    <p>Auf jeder Seite findest du eine Aufgabe. Beantworte die Aufgabe direkt auf der Seite.
                        Starte den Test und du siehst, ob deine Lösung richtig ist.</p>

                    {/* Navigation to first challenge */}
                    <FlashButton 
                        label="Start" 
                        size="lg"
                        onClick={() => navigate({ 
                            to: '/challenges/$name', 
                            params: { name: '1' } 
                        })} 
                    />
                </section>

                {/* PostgreSQL logo with theme-aware styling and 3D animation */}
                <img
                    src={pgImage}
                    alt="SQL Hero"
                    width="400"
                    height="auto"
                    className="min-w-[200px] max-w-[400px] flex-1"
                    style={{
                        // Theme-dependent blend mode for optimal visibility
                        mixBlendMode: isDark ? 'color-dodge' : 'multiply',

                        // Theme-dependent shadow effect
                        filter: isDark
                            ? 'drop-shadow(rgba(0 0 0 / 60%) -0.2em -1em 1.2em)'
                            : 'drop-shadow(rgb(128 128 128 / 40%) -0.2em -1em 1.2em)',

                        // 3D transform properties for logo animation
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