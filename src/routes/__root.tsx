import React from 'react';
import { Header } from '@/components/Header';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';

const Root: React.FC = () => {
    const headerRef = React.useRef<HTMLHeadingElement>(null);
    return (
        <>
            <Header ref={headerRef} />
            <Outlet />
            <TanStackRouterDevtools />
        </>
    );
};

export const Route = createRootRoute({
    component: () => <Root />,
});