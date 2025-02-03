import React from "react";

import { Wrapper } from "@/components/Wrapper";
import { useTheme } from "@/hooks/useTheme";

export const Footer: React.FC = () => {
    const { theme } = useTheme();
    const isDarkMode = React.useMemo(() => theme === 'dark', [theme]);

    return (
        <footer className="flex justify-center items-center min-h-16 bg-gray-200 dark:bg-[#44475a] dark:text-white border-t border-gray-300 dark:border-gray-700">
            <Wrapper className="text-center">
                <p>loving</p>
                <img src={isDarkMode ? '/drk-rki-bbw-3-dark-b.png' : '/drk-rki-bbw-3.png'} alt="Logo Berlin Beta Works Inklusiv" className="max-h-42 inline-block" />
            </Wrapper>
        </footer>
    );
};