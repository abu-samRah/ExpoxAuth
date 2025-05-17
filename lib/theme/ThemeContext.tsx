import { createContext } from 'react';
import type { ThemeColors } from './theme';

export type ThemeContextType = {
  colors: ThemeColors;
  isDark: boolean;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  colors: {} as ThemeColors,
  isDark: false,
  toggleTheme: () => {},
});
