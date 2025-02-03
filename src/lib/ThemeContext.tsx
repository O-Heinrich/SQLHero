import { createContext } from 'react';

/**
 * @typedef {Object} ThemeContextType
 * @property {string} theme - Current theme identifier (e.g., 'light', 'dark')
 * @property {function} toggleTheme - Function to switch between themes
 */
export interface ThemeContextType {
    theme: string;
    toggleTheme: () => void;
}

/**
 * React context object for managing theme state across components
 * @context ThemeContext
 * @type {React.Context<ThemeContextType>}
 * @default
 * @property {string} theme='light' - Default theme initialization
 * @property {function} toggleTheme=() => {} - No-op default toggle function (to be implemented in provider)
 * @example
 * // Create a theme provider component
 * function ThemeProvider({ children }) {
 *   const [theme, setTheme] = useState('light');
 *   const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
 * 
 *   return (
 *     <ThemeContext.Provider value={{ theme, toggleTheme }}>
 *       {children}
 *     </ThemeContext.Provider>
 *   );
 * }
 * 
 * @example
 * // Consume context in a component
 * function ThemeButton() {
 *   const { theme, toggleTheme } = useContext(ThemeContext);
 *   return (
 *     <button onClick={toggleTheme}>
 *       Switch to {theme === 'light' ? 'dark' : 'light'} mode
 *     </button>
 *   );
 * }
 */
export const ThemeContext: React.Context<ThemeContextType> = createContext<ThemeContextType>({
    theme: 'light',
    toggleTheme: () => { },
});