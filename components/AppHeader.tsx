import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useThemeColors } from '../lib/theme/useTheme';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

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
    <SafeAreaView edges={['top']} style={styles.safeArea}>
      <LinearGradient
        colors={[colors.primary, colors.primaryDark || colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}>
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
          {rightComponent && <View style={styles.rightSection}>{rightComponent}</View>}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    width: '100%',
  },
  header: {
    paddingTop: 8,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
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
    flex: 1,
  },
  rightSection: {
    marginLeft: 16,
  },
  backButton: {
    padding: 10,
    borderRadius: 12,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: '600',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    letterSpacing: -0.5,
    flexShrink: 1,
  },
  subtitle: {
    fontSize: 28,
    fontWeight: '300',
    marginLeft: 4,
    opacity: 0.9,
  },
});
