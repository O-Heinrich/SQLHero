import React from "react";

import { Wrapper } from "@/components/Wrapper";
import { useTheme } from "@/hooks/useTheme";
import { Link } from "@tanstack/react-router";
import clsx from "clsx";

/**
 * Footer component displaying a logo with theme-dependent image
 * 
 * @component
 * @returns {React.ReactElement} Footer with responsive logo
 * 
 * @description
 * Renders a footer with:
 * - Responsive background color based on theme
 * - Dynamic logo image depending on dark/light mode
 * - Centered content within a wrapper
 * 
 * @example
 * ```tsx
 * <Footer />
 * ```
 */
export const Footer: React.FC = (): React.ReactElement => {
    /**
     * Determines if current theme is dark mode
     * @type {boolean}
     */
    const { theme } = useTheme();
    const isDarkMode = React.useMemo(() => theme === 'dark', [theme]);

    return (
        <footer className="flex justify-center items-center min-h-16 bg-slate-200 dark:bg-slate-900 dark:text-white border-t border-gray-300 dark:border-slate-700">
            <Wrapper className="text-center">
                <div className="text-sm">loving</div>
                <img 
                    src={isDarkMode ? '/drk-rki-bbw-3-dark-b.png' : '/drk-rki-bbw-3.png'} 
                    alt="Logo Berlin Beta Works Inklusiv" 
                    className="max-h-20 inline-block" 
                />
                <div className="text-sm">
                    <Link to="/" className={clsx('[&.active]:font-bold')}>
                        Home
                    </Link>
                    {' | '}
                    <Link to="/introduction" className={clsx('[&.active]:font-bold')}>
                        Einführung
                    </Link>
                    {' | '}
                    <Link to="/about" className={clsx('[&.active]:font-bold')}>
                        About
                    </Link>
                </div>
            </Wrapper>
        </footer>
    );
};