import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '../../lib/theme/useTheme';

type SurahHeaderProps = {
  colors: ReturnType<typeof useThemeColors>;
  arabicName: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
};

export const SurahHeader: React.FC<SurahHeaderProps> = ({
  colors,
  arabicName,
  englishName,
  englishNameTranslation,
  numberOfAyahs,
  revelationType,
}) => (
  <View
    style={[
      styles.header,
      {
        backgroundColor: colors.card,
        borderBottomColor: colors.border,
      },
    ]}>
    <Text style={[styles.arabicName, { color: colors.textPrimary }]}>{arabicName}</Text>
    <Text style={[styles.englishName, { color: colors.textSecondary }]}>{englishName}</Text>
    <Text style={[styles.translation, { color: colors.textTertiary }]}>
      {englishNameTranslation}
    </Text>
    <View style={styles.metaContainer}>
      <Text style={[styles.metaText, { color: colors.textSecondary }]}>
        {numberOfAyahs} Verses • {revelationType}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  header: {
    padding: 20,
    borderBottomWidth: 1,
  },
  arabicName: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  englishName: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 4,
  },
  translation: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 16,
  },
});
