import { useContext } from 'react';
import { ThemeContext, ThemeContextType } from '@/lib/ThemeContext';

/**
 * Custom hook to access theme context throughout the application
 * 
 * @returns {ThemeContextType} Theme context object with current theme and toggle function
 * 
 * @example
 * ```tsx
 * const { theme, toggleTheme } = useTheme();
 * ```
 */
export const useTheme = (): ThemeContextType => useContext(ThemeContext);