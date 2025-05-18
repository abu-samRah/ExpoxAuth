import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useThemeColors } from '../lib/theme/useTheme';
import { SurahList } from '../components/SurahList';
import FullScreenLoader from '../components/FullSscreenLoader';
import LoginForm from '../components/LoginForm';
import { SettingsMenu } from '../components/SettingsMenu';
import { Stack } from 'expo-router';

export default function Home() {
  const { user, isLoading } = useAuth();
  const colors = useThemeColors();

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Quran',
          headerTitle: 'Quran App',
          headerRight: () => <SettingsMenu />,
        }}
      />
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <SurahList />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
