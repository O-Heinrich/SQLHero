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

import { IndexSkeleton } from '@/components/Skeleton'
import { createLazyFileRoute } from '@tanstack/react-router'
import { MainView } from '@/components/MainView'

/**
 * Route configuration for home page.
 * Includes loading, error and not found states.
 */
export const Route = createLazyFileRoute('/dockview')({
    component:() => <AppView />,
    errorComponent: ({ error }) => <div>Error: {error.message}</div>,
    pendingComponent: () => <IndexSkeleton />,
    notFoundComponent: () => <div>Challenge not found</div>,
})

function AppView() {
    return <div style={{width: '100vw', flex: '100%', overflow: 'auto'}}><MainView /></div>
}
