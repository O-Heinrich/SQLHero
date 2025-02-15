import React, { use } from 'react';
import { Toaster } from 'sonner';
import { Header } from '@/components/Header';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from '@/context/ThemeProvider';
import { Footer } from '@/components/Footer';
import { PGlightProvider } from '@/context/PGlightProvider';
import { ThemeContext } from '@/context/ThemeContext';
import { AppStateProvider } from '@/context/AppStateContext';

const Root: React.FC = () => (
    <ThemeProvider>
        <PGlightProvider>
            <AppStateProvider>
                <div className="flex flex-col min-h-screen">
                    <Header />
                    <main className="flex flex-1">
                        <Outlet />
                    </main>
                    <Footer />
                </div>
                <Toaster 
                    offset={{right: '8vw'}} 
                    theme={use(ThemeContext).theme as 'light' | 'dark'}
                    toastOptions={{
                        classNames: {
                            toast: 'hero-toast',
                            icon: 'hero-toast-icon',
                        }
                    }}
                />
            </AppStateProvider>
        </PGlightProvider>
    </ThemeProvider>
);

export const Route = createRootRoute({
    component: () => <Root />,
});