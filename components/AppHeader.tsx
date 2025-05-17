import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColors } from '../lib/theme/useTheme';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
};

export function AppHeader({ title, subtitle, showBackButton, rightComponent }: AppHeaderProps) {
  const colors = useThemeColors();
  const router = useRouter();

  return (
    <SafeAreaView edges={['top']} style={[styles.safeArea, { backgroundColor: colors.primary }]}>
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerContent}>
          <View style={styles.leftSection}>
            {showBackButton && (
              <TouchableOpacity
                onPress={() => router.back()}
                style={[styles.backButton, { backgroundColor: colors.buttonBackground }]}>
                <Text style={[styles.backButtonText, { color: colors.buttonText }]}>←</Text>
              </TouchableOpacity>
            )}
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: colors.buttonText }]}>{title}</Text>
              {subtitle && (
                <Text style={[styles.subtitle, { color: colors.buttonText }]}>{subtitle}</Text>
              )}
            </View>
          </View>
          {rightComponent}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    width: '100%',
  },
  header: {
    paddingTop: 8,
    paddingBottom: 12,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: '600',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: '300',
    marginLeft: 4,
    opacity: 0.9,
  },
});
