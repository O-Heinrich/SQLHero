import { useContext } from 'react';
import { ThemeContext, IThemeContext } from '@/context/ThemeContext';

/**
 * A custom React hook that provides access to the theme context. This hook is a convenience wrapper
 * around `useContext` and is used to retrieve the current theme and the `toggleTheme` function
 * from the `ThemeContext`.
 *
 * This hook simplifies the process of consuming the theme context in components and ensures that
 * the context is used correctly.
 *
 * @throws {Error} - Throws an error if the hook is used outside of the `ThemeProvider`.
 * @returns {IThemeContext} - An object containing the current theme and the `toggleTheme` function.
 *
 * @example
 * // Using the hook in a component
 * const { theme, toggleTheme } = useTheme();
 * return (
 *     <button onClick={toggleTheme}>
 *         Switch to {theme === 'light' ? 'dark' : 'light'} mode
 *     </button>
 * );
 */
export const useTheme = (): IThemeContext => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};