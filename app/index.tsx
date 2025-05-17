import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useThemeColors } from '../lib/theme/useTheme';
import { SurahList } from '../components/SurahList';
import { SettingsMenu } from '../components/SettingsMenu';
import { AppHeader } from '../components/AppHeader';
import FullScreenLoader from '../components/FullSscreenLoader';
import LoginForm from '../components/LoginForm';

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Quran" subtitle="App" rightComponent={<SettingsMenu />} />
      <SurahList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
