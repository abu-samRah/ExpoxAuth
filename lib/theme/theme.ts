import { useColorScheme } from 'react-native';

export type ThemeColors = {
  // Base colors
  primary: string;
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
  background: '#FFFFFF',
  card: '#FFFFFF',
  text: '#000000',
  border: '#EEEEEE',
  notification: '#FF3B30',

  textPrimary: '#333333',
  textSecondary: '#666666',
  textTertiary: '#888888',

  searchBackground: '#F5F5F5',
  verseNumber: '#4CAF50',
  verseNumberText: '#FFFFFF',
  errorText: '#666666',
  buttonBackground: '#4CAF50',
  buttonText: '#FFFFFF',
};

export const darkTheme: ThemeColors = {
  primary: '#66BB6A',
  background: '#121212',
  card: '#1E1E1E',
  text: '#FFFFFF',
  border: '#2C2C2C',
  notification: '#FF453A',

  textPrimary: '#FFFFFF',
  textSecondary: '#B0B0B0',
  textTertiary: '#808080',

  searchBackground: '#2C2C2C',
  verseNumber: '#66BB6A',
  verseNumberText: '#FFFFFF',
  errorText: '#B0B0B0',
  buttonBackground: '#66BB6A',
  buttonText: '#FFFFFF',
};
