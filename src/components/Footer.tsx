/**
 * @module Footer
 * @description 
 * Provides the application footer component with responsive theming
 * and branding elements that adapt to the current application theme.
 */
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
 * - Copyright information
 * - Special handling for Firefox browser
 * 
 * The footer serves as a consistent branding element across the application
 * and automatically adapts its appearance based on the current theme settings.
 * 
 * @example
 * ```tsx
 * <Footer />
 * ```
 */
export const Footer: React.FC = (): React.ReactElement => {
    /**
    * Current theme from the application theme context
    */
    const { theme } = useTheme();

    /**
    * Memoized boolean indicating if dark theme is active
    * 
    * @type {boolean}
    * @default false
    */
    const isDarkMode: boolean = React.useMemo(() => theme === 'dark', [theme]);

    return (
        <footer className={`z-50 shadow-xl flex justify-center relative items-center min-h-16 ${!isFirefox && 'backdrop-blur-xl'} z-100 relative bg-slate-50/20 dark:bg-slate-800/20 dark:text-white border-groove border-gray-200 border-t-2 dark:border-slate-700 bottom-0`}>
            <div className="w-full py-2 z-20" style={{boxShadow: isDarkMode ? '0 -2px 2px var(--footer-shadow), 0 0 0.4em rgb(5 5 5)' : '0 -2px 2px var(--footer-shadow), 0 0 0.2em rgb(0 0 0 / 59%)'}}>
                <Wrapper className="flex justify-between items-center max-w-400 z-20">
                    <span className="text-sm/4 self-end ml-2 text-gray-500 dark:text-gray-400">
                        &copy; 2025 - {new Date().getFullYear()} Berlin Beta Work INklusiv
                    </span>
                    <img
                        src={isDarkMode ? '/drk-rki-bbw-3-dark-b.png' : '/drk-rki-bbw-3.png'}
                        alt="Logo Berlin Beta Work INklusiv"
                        className="max-h-16 inline-block"
                    />
                </Wrapper>
            </div>
            {isFirefox && <div className="bg-transparent backdrop-blur-md absolute h-[81.6px] t-0 l-0 r-0 b-0 z-10 w-full" />}
        </footer>
    );
};