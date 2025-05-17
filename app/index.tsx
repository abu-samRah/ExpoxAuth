import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../hooks/useAuth';
import { useThemeColors } from '../lib/theme/useTheme';
import { SurahList } from '../components/SurahList';
import { SettingsMenu } from '../components/SettingsMenu';
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
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <Text style={[styles.title, { color: colors.buttonText }]}>Quran App</Text>
        <View style={styles.headerRight}>
          <SettingsMenu />
        </View>
      </View>
      <SurahList />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerRight: {
    marginRight: -8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
