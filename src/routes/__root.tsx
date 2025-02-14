import React, { use } from 'react';
import { Toaster } from 'sonner';
import { Header } from '@/components/Header';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from '@/lib/ThemeProvider';
import { Footer } from '@/components/Footer';
import { PGlightProvider } from '@/lib/PGlightProvider';
import { ThemeContext } from '@/lib/ThemeContext';

const Root: React.FC = () => {
    const headerRef = React.useRef<HTMLHeadingElement>(null);
    
    return (
        <ThemeProvider>
            <PGlightProvider>
                <div className="flex flex-col min-h-screen">
                    <Header ref={headerRef} />
                    <main className="flex-1 pt-10 pb-6">
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
            </PGlightProvider>
        </ThemeProvider>
    );
};

export const Route = createRootRoute({
    component: () => <Root />,
});