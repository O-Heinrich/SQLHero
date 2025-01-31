import { motion } from "motion/react"
import { useTheme } from "@/hooks/useTheme";
import { Sun, Moon } from "@/components/icons";
import {Button} from "@headlessui/react";

export const ToggleThemeButton: React.FC = () => {
    const { theme, toggleTheme } = useTheme();
    return (
        
            <Button onClick={toggleTheme} style={{backgroundColor: 'transparent'}}  >
                <motion.button className="p-1 roubded-full" whileTap={{ scale: 0.15 }}>
                {theme === 'dark' ? <Sun size={8} /> : <Moon size={8} />}
                </motion.button>
            </Button>
    );
}