import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/context/auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../lib/theme/ThemeProvider';
import { TouchableOpacity, Text } from 'react-native';
import { useTheme } from '../lib/theme/useTheme';

const queryClient = new QueryClient();

function ThemeToggle() {
  const { isDark, toggleTheme, colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={toggleTheme}
      style={{
        marginRight: 16,
        padding: 8,
        borderRadius: 8,
        backgroundColor: colors.buttonBackground,
      }}>
      <Text style={{ color: colors.buttonText, fontSize: 14 }}>{isDark ? '☀️' : '🌙'}</Text>
    </TouchableOpacity>
  );
}

function RootLayoutContent() {
  const { colors } = useTheme();

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen
            name="index"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <SafeAreaProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </SafeAreaProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
