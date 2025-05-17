import { useColorScheme } from 'react-native';
import { createContext, useContext } from 'react';

export type ThemeColors = {
  // Base colors
  primary: string;
  primaryDark: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;

  // Text colors
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;

  // UI elements
  searchBackground: string;
  verseNumber: string;
  verseNumberText: string;
  errorText: string;
  buttonBackground: string;
  buttonText: string;
};

export const lightTheme: ThemeColors = {
  primary: '#4CAF50',
  primaryDark: '#388E3C',
  background: '#FFFFFF',
  card: '#F5F5F5',
  text: '#000000',
  border: '#E0E0E0',
  notification: '#FF3B30',

  textPrimary: '#212121',
  textSecondary: '#757575',
  textTertiary: '#9E9E9E',

  searchBackground: '#F5F5F5',
  verseNumber: '#4CAF50',
  verseNumberText: '#FFFFFF',
  errorText: '#D32F2F',
  buttonBackground: 'rgba(255, 255, 255, 0.2)',
  buttonText: '#FFFFFF',
};

export const darkTheme: ThemeColors = {
  primary: '#388E3C',
  primaryDark: '#2E7D32',
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  border: '#2C2C2C',
  notification: '#FF453A',

  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textTertiary: '#808080',

  searchBackground: '#2C2C2C',
  verseNumber: '#388E3C',
  verseNumberText: '#FFFFFF',
  errorText: '#EF5350',
  buttonBackground: 'rgba(255, 255, 255, 0.1)',
  buttonText: '#FFFFFF',
};

export const ThemeContext = createContext<{
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
}>({
  isDark: false,
  colors: lightTheme,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);
