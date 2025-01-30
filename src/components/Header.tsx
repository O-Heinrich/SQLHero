import React from "react";
import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { Wrapper } from "@/components/Wrapper";
import { APP_NAME } from "@/constants";
import Logo from "./Logo";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@headlessui/react";

interface HeaderProps {
    ref?: React.Ref<HTMLHeadingElement>;
}

export const Header: React.FC<HeaderProps> = ({ ref }) => {
    const { theme, toggleTheme } = useTheme();
    const isDarkMode = React.useMemo(() => theme === 'dark', [theme]);

    return (
        <header ref={ref} className={clsx('sticky', 'top-0', 'z-50', 'dark:bg-red-500/50', 'bg-red-800/50', 'text-white', 'backdrop-blur-xl')}>
            <Wrapper className={clsx('flex', 'justify-between', 'items-center')}>
                <span className={clsx('flex', 'items-center', 'gap-1')}>
                    <Logo fill={isDarkMode ? '#efefef' : '#343434'} />
                    <h1 className={clsx('text-3xl', 'dark:text-white/85', 'text-black/85')}>{APP_NAME}</h1>
                </span>
                <div className="p-2 flex gap-2">
                    <Link to="/" className={clsx('[&.active]:font-bold')}>
                        Home
                    </Link>{' '}
                    <Link to="/about" className={clsx('[&.active]:font-bold')}>
                        About
                    </Link>
                    <Button onClick={toggleTheme} className={clsx('p-2', 'rounded-md', 'bg-gray-800/50', 'dark:bg-gray-200/50')}>
                        {isDarkMode ? 'Light' : 'Dark'} Mode
                    </Button>
                </div>
            </Wrapper>
        </header>
    );
};