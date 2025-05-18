import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useThemeColors } from '../../lib/theme/useTheme';

type LoadingStateProps = {
  colors: ReturnType<typeof useThemeColors>;
};

export const LoadingState: React.FC<LoadingStateProps> = ({ colors }) => (
  <View style={[styles.centered, { backgroundColor: colors.background }]}>
    <ActivityIndicator size="large" color={colors.primary} />
  </View>
);

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});
