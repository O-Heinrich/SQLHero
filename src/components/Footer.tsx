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
        <footer className="flex justify-center items-center min-h-16 bg-gray-200 dark:bg-[#44475a] dark:text-white border-t border-gray-300 dark:border-gray-700">
            <Wrapper className="text-center">
                <p>loving</p>
                <img 
                    src={isDarkMode ? '/drk-rki-bbw-3-dark-b.png' : '/drk-rki-bbw-3.png'} 
                    alt="Logo Berlin Beta Works Inklusiv" 
                    className="max-h-42 inline-block" 
                />
            </Wrapper>
        </footer>
    );
};