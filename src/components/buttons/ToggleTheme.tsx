import { motion } from "motion/react"
import { useTheme } from "@/hooks/useTheme";
import { SunIcon, MoonIcon } from "@/components/icons";

/**
 * Interactive theme toggle button with animated motion
 * 
 * @component
 * @description
 * Renders a button that:
 * - Toggles between dark and light themes
 * - Displays different icons based on current theme
 * - Provides tap animation using Framer Motion
 * 
 * @returns {React.ReactElement} Animated theme toggle button
 * 
 * @example
 * ```tsx
 * <ToggleThemeButton />
 * ```
 */
export const ToggleThemeButton: React.FC = (): React.ReactElement => {
    /**
     * Destructures theme context to access current theme and toggle function
     * @type {Object}
     * @property {string} theme - Current theme ('dark' or 'light')
     * @property {Function} toggleTheme - Function to switch between themes
     */
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button 
            onClick={toggleTheme} 
            className="theme-button"
            whileTap={{ scale: 0.75 }}
        >
            {theme === 'dark' ? <SunIcon size={1.75} /> : <MoonIcon size={1.75} />}
        </motion.button>
    );
}