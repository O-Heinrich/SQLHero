import React, { useState, ReactNode, useEffect } from 'react';
import { ThemeContext } from './ThemeContext';

/**
 * ThemeProvider component manages the application's theme state and system theme preference.
 * 
 * @component
 * @param {Object} props - Component properties
 * @param {ReactNode} props.children - Child components to be wrapped by the theme context
 * 
 * @description
 * This provider does the following:
 * - Detects the user's system color scheme preference
 * - Initializes the theme state based on system preference or saved value
 * - Saves the theme state to local storage
 * - Provides theme state and toggle functionality through context
 * - Automatically applies 'dark' or 'light' class to the document root
 * 
 * @example
 * ```tsx
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 * ```
 * 
 * @returns {React.ReactElement} A context provider with theme capabilities
 */
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }: { children: ReactNode; }): React.ReactElement => {
    /**
     * Current theme state, defaulting to 'light'
     * @type {string}
     */
    const [theme, setTheme] = useState<string>('light');

    /**
     * Initial effect to set theme based on system preference
     * 
     * @effects
     * - Determines initial theme from system or saved color scheme
     * - Adds event listener for future system theme changes
     * - Removes event listener on component unmount
     */
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        setTheme(savedTheme ?? systemTheme);

        /**
         * Handles system theme change events
         * 
         * @param {MediaQueryListEvent} e - Media query change event
         */
        const handleChange = (e: MediaQueryListEvent) => {
            setTheme( e.matches ? 'dark' : 'light');
        };

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', handleChange);

        return () => {
            window.matchMedia('(prefers-color-scheme: dark)').removeEventListener('change', handleChange);
        };
    }, []);

    /**
     * Effect to apply theme-specific class to document root
     * 
     * @effects
     * - Adds or removes 'dark' class on document root based on theme
     * - Triggers on theme state changes
     */
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    /**
     * Toggles between light and dark themes and saves to local storage
     * 
     * @returns {void}
     */
    const toggleTheme = (): void => {
        setTheme((prevTheme) => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            return newTheme;
        });
    };

    return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};