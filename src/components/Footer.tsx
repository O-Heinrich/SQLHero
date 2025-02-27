import React from "react";

import { Wrapper } from "@/components/Wrapper";
import { useTheme } from "@/hooks/useTheme";
import { isFirefox } from "@/lib/agents";

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
        <footer className={`flex justify-center relative items-center min-h-16 ${!isFirefox && 'backdrop-blur-xl'} z-100 relative bg-slate-50/20 dark:bg-slate-800/20 dark:text-white border-t border-groove border-gray-200 border-t-2 dark:border-slate-700 py-2 bottom-0`}>
            <Wrapper className="flex justify-between items-center max-w-400 z-20">
                <span className="text-sm/4 self-end ml-2 text-gray-500 dark:text-gray-400">
                    &copy; {new Date().getFullYear()} Berlin Beta Works Inklusiv
                </span>
                <img
                    src={isDarkMode ? '/drk-rki-bbw-3-dark-b.png' : '/drk-rki-bbw-3.png'}
                    alt="Logo Berlin Beta Works Inklusiv"
                    className="max-h-16 inline-block"
                />
            </Wrapper>
            {isFirefox && <div className="bg-transparent backdrop-blur-md absolute h-[81.6px] t-0 l-0 r-0 b-0 z-10 w-full" />}
        </footer>
    );
};