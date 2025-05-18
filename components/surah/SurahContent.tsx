import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useThemeColors } from '../../lib/theme/useTheme';
import type { Ayah } from '../../lib/schemas/quran';
import { SurahHeader } from './SurahHeader';
import { Verse } from './Verse';

type SurahContentProps = {
  colors: ReturnType<typeof useThemeColors>;
  data: {
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: string;
    ayahs: Ayah[];
  };
};

export const SurahContent: React.FC<SurahContentProps> = ({ colors, data }) => {
  const { name, englishName, englishNameTranslation, numberOfAyahs, revelationType, ayahs } = data;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.content}>
        <SurahHeader
          colors={colors}
          arabicName={name}
          englishName={englishName}
          englishNameTranslation={englishNameTranslation}
          numberOfAyahs={numberOfAyahs}
          revelationType={revelationType}
        />
        <View style={styles.versesContainer}>
          {ayahs.map((ayah) => (
            <Verse key={ayah.numberInSurah} colors={colors} ayah={ayah} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  versesContainer: {
    padding: 16,
  },
});
