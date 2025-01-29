import React from "react";
import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { Wrapper } from "@/components/Wrapper";
import DatabaseLogoDark from '@/assets/database-dark.svg';
import DatabaseLogoLight from '@/assets/database-light.svg';
import { APP_NAME } from "@/constants";

interface HeaderProps {
    ref?: React.Ref<HTMLHeadingElement>;
}

export const Header: React.FC<HeaderProps> = ({ ref }) => {
    const [isDarkMode, setIsDarkMode] = React.useState(() => window?.matchMedia('(prefers-color-scheme: dark)')?.matches || false);

    React.useEffect(() => {
        const mediaQueryList = window.matchMedia('(prefers-color-scheme: dark)');

        const listener = (event: MediaQueryListEvent) => {
            setIsDarkMode(event.matches);
        };

        mediaQueryList.addEventListener('change', listener);

        return () => {
            mediaQueryList.removeEventListener('change', listener);
        };
    }, [isDarkMode]);

    return (
        <header ref={ref} className={clsx('sticky', 'top-0', 'z-50', 'dark:bg-red-500/50', 'bg-red-800/50', 'text-white', 'backdrop-blur-xl')}>
            <Wrapper className={clsx('flex', 'justify-between', 'items-center')}>
                <span className={clsx('flex', 'items-center', 'gap-1')}>
                    <img src={isDarkMode ? DatabaseLogoDark : DatabaseLogoLight} alt="Database" className={clsx('size-12')} />
                    <h1 className={clsx('text-3xl')}>{APP_NAME}</h1>
                </span>
                <div className="p-2 flex gap-2">
                    <Link to="/" className={clsx('[&.active]:font-bold')}>
                        Home
                    </Link>{' '}
                    <Link to="/about" className={clsx('[&.active]:font-bold')}>
                        About
                    </Link>
                </div>
            </Wrapper>
        </header>
    );
};