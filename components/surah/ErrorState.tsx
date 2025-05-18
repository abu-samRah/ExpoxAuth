import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useThemeColors } from '../../lib/theme/useTheme';

type ErrorStateProps = {
  colors: ReturnType<typeof useThemeColors>;
  message: string;
  onRetry: () => void;
};

export const ErrorState: React.FC<ErrorStateProps> = ({ colors, message, onRetry }) => (
  <View style={[styles.centered, { backgroundColor: colors.background }]}>
    <Text style={[styles.errorText, { color: colors.errorText }]}>{message}</Text>
    <TouchableOpacity
      style={[styles.retryButton, { backgroundColor: colors.buttonBackground }]}
      onPress={onRetry}>
      <Text style={[styles.retryText, { color: colors.buttonText }]}>Go Back</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    padding: 12,
    borderRadius: 8,
  },
  retryText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
