import React from "react";

import { Wrapper } from "@/components/Wrapper";
import { useTheme } from "@/hooks/useTheme";

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
        <footer className="flex justify-center items-center min-h-16 backdrop-blur-xl z-100 relative bg-slate-200/20 dark:bg-slate-900/20 dark:text-white border-t border-gray-300 dark:border-slate-700 py-2 bottom-0">
            <Wrapper className="flex justify-between items-center max-w-400">
                <span className="text-sm/4 self-end ml-2 text-gray-500 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} Berlin Beta Works Inklusiv
                </span>
                <img
                    src={isDarkMode ? '/drk-rki-bbw-3-dark-b.png' : '/drk-rki-bbw-3.png'}
                    alt="Logo Berlin Beta Works Inklusiv"
                    className="max-h-16 inline-block"
                />
            </Wrapper>
        </footer>
    );
};