import React, { use } from 'react';
import { Toaster } from 'sonner';
import { Header } from '@/components/Header';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from '@/context/ThemeProvider';
import { Footer } from '@/components/Footer';
import { PgExecEngineProvider } from '@/context/PgExecEngineProvider';
import { ThemeContext } from '@/context/ThemeContext';
import { AppStateProvider } from '@/context/AppStateContext';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';

const Root: React.FC = () => (
    <ThemeProvider>
        <PgExecEngineProvider>
            <AppStateProvider>
                <TransformWrapper initialScale={3}>
                    <div className="flex flex-col min-h-screen">
                        <Header />
                        <main className="flex flex-1 flex-wrap">
                            <Outlet />
                        </main>
                        <Footer />
                    </div>
                    {/* Workaround for mounting issue */}
                    <TransformComponent contentClass="hidden">
                        <img src="" />
                    </TransformComponent>
                </TransformWrapper>
                <Toaster 
                    offset={{right: '8vw'}} 
                    theme={use(ThemeContext).theme as 'light' | 'dark'}
                    toastOptions={{
                        classNames: {
                            error: 'hero-toast-error',
                            success: 'hero-toast-success',
                            icon: 'hero-toast-icon',
                        }
                    }}
                />
            </AppStateProvider>
        </PgExecEngineProvider>
    </ThemeProvider>
);

export const Route = createRootRoute({
    component: () => <Root />,
});