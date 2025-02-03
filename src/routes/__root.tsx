import React from 'react';
import { Header } from '@/components/Header';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { ThemeProvider } from '@/lib/ThemeProvider';
import { Footer } from '@/components/Footer';

const Root: React.FC = () => {
    const headerRef = React.useRef<HTMLHeadingElement>(null);
    
    return (
        <ThemeProvider>
            <div className="flex flex-col min-h-screen">
                <Header ref={headerRef} />
                <main className="flex-1">
                    <Outlet />
                </main>
                <Footer />
            </div>
            <TanStackRouterDevtools />
        </ThemeProvider>
    );
};

export const Route = createRootRoute({
    component: () => <Root />,
});