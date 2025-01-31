import React from "react";
import clsx from "clsx";
import { Link } from "@tanstack/react-router";
import { APP_NAME } from "@/constants";
import { Wrapper } from "@/components/Wrapper";
import { Logo } from "@/components/Logo";
import { ToggleThemeButton } from "./buttons/ToggleTheme";
import { useTheme } from "@/hooks/useTheme";

interface HeaderProps {
    ref?: React.Ref<HTMLHeadingElement>;
}

export const Header: React.FC<HeaderProps> = ({ ref }) => {
    const { theme } = useTheme();
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
                    <ToggleThemeButton />
                </div>
            </Wrapper>
        </header>
    );
};