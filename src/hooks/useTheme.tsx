import { useContext } from 'react';
import { ThemeContext } from '@/lib/ThemeContext';

export const useTheme = () => useContext(ThemeContext);