import React from 'react';
import { Header } from '@/components/Header';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from '@/lib/ThemeProvider';
import { Footer } from '@/components/Footer';

const Root: React.FC = () => {
    const headerRef = React.useRef<HTMLHeadingElement>(null);
    
    return (
        <ThemeProvider>
            <div className="flex flex-col min-h-screen">
                <Header ref={headerRef} />
                <main className="flex-1 pt-10 pb-6">
                    <Outlet />
                </main>
                <Footer />
            </div>
        </ThemeProvider>
    );
};

export const Route = createRootRoute({
    component: () => <Root />,
});