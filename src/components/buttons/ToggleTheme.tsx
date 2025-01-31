import { motion } from "motion/react"
import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon } from "@/components/icons";

export const ToggleThemeButton: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        <motion.button onClick={toggleTheme} className="p-1 rounded-full bg-transparent" whileTap={{ scale: 0.75 }}>
            {theme === 'dark' ? <Sun size={8} /> : <Moon size={8} />}
        </motion.button>
    );
}