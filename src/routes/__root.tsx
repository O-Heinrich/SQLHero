import React from 'react';
import { Header } from '@/components/Header';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { ThemeProvider } from '@/lib/ThemeProvider';

const Root: React.FC = () => {
    const headerRef = React.useRef<HTMLHeadingElement>(null);
    
    return (
        <ThemeProvider>
            <Header ref={headerRef} />
            <Outlet />
            <TanStackRouterDevtools />
        </ThemeProvider>
    );
};

export const Route = createRootRoute({
    component: () => <Root />,
});