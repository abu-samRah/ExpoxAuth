import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useThemeColors } from '../../lib/theme/useTheme';
import type { Ayah } from '../../lib/schemas/quran';

type VerseProps = {
  colors: ReturnType<typeof useThemeColors>;
  ayah: Ayah;
};

export const Verse: React.FC<VerseProps> = ({ colors, ayah }) => (
  <View style={[styles.verseContainer, { backgroundColor: colors.card }]}>
    <View style={[styles.verseNumber, { backgroundColor: colors.verseNumber }]}>
      <Text style={[styles.verseNumberText, { color: colors.verseNumberText }]}>
        {ayah.numberInSurah}
      </Text>
    </View>
    <Text style={[styles.arabicText, { color: colors.textPrimary }]}>{ayah.text}</Text>
  </View>
);

const styles = StyleSheet.create({
  verseContainer: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  verseNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  verseNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  arabicText: {
    fontSize: 24,
    textAlign: 'right',
    lineHeight: 40,
  },
});
