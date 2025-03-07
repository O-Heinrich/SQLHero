import { motion } from "motion/react"
import { useTheme } from "@/hooks/useTheme";
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

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
            className="theme-button ml-0! mr-0! md:mr-4! p-2! transition-duration-200!"
            transition={{ duration: 0.2 }}
            whileTap={{ scale: 0.75, opacity: 0.5 }}
        >
            {theme === 'dark' ? <SunIcon className="size-6 text-white/75!"  /> : <MoonIcon className="size-6 text-black/75"  />}
        </motion.button>
    );
}