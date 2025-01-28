import React from "react";
import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { Wrapper } from "@/components/Wrapper";
import { APP_NAME } from "@/constants";

interface HeaderProps {
    ref?: React.Ref<HTMLHeadingElement>;
}

export const Header: React.FC<HeaderProps> = ({ ref }) => {
    return (
        <header ref={ref} className={clsx('sticky', 'top-0', 'z-50', 'dark:bg-red-500/50', 'bg-red-800/50', 'text-white', 'backdrop-blur-xl')}>
            <Wrapper size='7xl' className={clsx('flex', 'justify-between', 'items-center')}>
                <h1 className={clsx('text-3xl')}>{APP_NAME}</h1>
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