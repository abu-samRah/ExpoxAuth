import React from 'react';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/context/auth';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '../lib/theme/ThemeProvider';
import { useThemeColors } from '../lib/theme/useTheme';
import { View, StyleSheet } from 'react-native';

const queryClient = new QueryClient();

function RootLayoutContent() {
  const colors = useThemeColors();

  return (
    <SafeAreaProvider>
      <Stack
        screenOptions={{
          headerTintColor: colors.buttonText,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShadowVisible: false,
          headerBackground: () => (
            <View style={[styles.headerBackground, { backgroundColor: colors.background }]}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: colors.primary,
                  borderBottomLeftRadius: 10,
                  borderBottomRightRadius: 10,
                }}
              />
            </View>
          ),
        }}
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  headerBackground: {
    flex: 1,
    height: 80,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
});

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider>
          <RootLayoutContent />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
