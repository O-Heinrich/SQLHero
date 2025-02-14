import { useContext } from 'react';
import { ThemeContext, IThemeContext } from '@/context/ThemeContext';

/**
 * Custom hook to access theme context throughout the application
 * 
 * @returns {IThemeContext} Theme context object with current theme and toggle function
 * 
 * @example
 * ```tsx
 * const { theme, toggleTheme } = useTheme();
 * ```
 */
export const useTheme = (): IThemeContext => useContext(ThemeContext);