/**
 * This module provides a React context (`ThemeContext`) for managing the application's theme.
 * The context holds the current theme (e.g., 'light' or 'dark') and a function to toggle between themes.
 * This allows the theme state and toggle functionality to be shared across the application.
 *
 * The context is initialized with a default value where the theme is set to 'light' and the `toggleTheme`
 * function is a no-op. Consumers of the context can provide their own implementation of the theme state
 * and toggle logic.
 *
 * @module context/ThemeContext
 */

import { createContext } from 'react';

/**
 * Represents the structure of the `ThemeContext`. It contains the current theme and a function
 * to toggle between themes.
 */
export interface IThemeContext {
    /**
     * The current theme of the application. This can be a string value such as 'light' or 'dark'.
     */
    theme: string;

    /**
     * A function to toggle the theme between different states (e.g., 'light' and 'dark').
     * This function is typically implemented to update the theme state.
     */
    toggleTheme: () => void;
}

/**
 * The React context for managing the application's theme. It provides the current theme
 * and a function to toggle the theme to all components in the tree. The context is initialized
 * with a default value where the theme is 'light' and the `toggleTheme` function is a no-op.
 *
 * @example
 * // Providing a custom theme and toggle function
 * const [theme, setTheme] = useState('light');
 * const toggleTheme = () => {
 *     setTheme(theme === 'light' ? 'dark' : 'light');
 * };
 * <ThemeContext.Provider value={{ theme, toggleTheme }}>
 *     <App />
 * </ThemeContext.Provider>
 *
 * @example
 * // Consuming the context in a component
 * const { theme, toggleTheme } = useContext(ThemeContext);
 * return (
 *     <button onClick={toggleTheme}>
 *         Switch to {theme === 'light' ? 'dark' : 'light'} mode
 *     </button>
 * );
 */
export const ThemeContext: React.Context<IThemeContext> = createContext<IThemeContext>({
    theme: 'light', // Default theme
    toggleTheme: () => { }, // Default no-op toggle function
});