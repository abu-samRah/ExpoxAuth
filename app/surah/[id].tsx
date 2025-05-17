import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSurah } from '../../hooks/useQuran';
import type { Ayah } from '../../lib/schemas/quran';
import { useThemeColors } from '../../lib/theme/useTheme';
import { AppHeader } from '../../components/AppHeader';
import { SettingsMenu } from '../../components/SettingsMenu';

export default function SurahPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const surahNumber = parseInt(id, 10);
  const colors = useThemeColors();

  const { data, isLoading, error } = useSurah(surahNumber);

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.errorText }]}>
          {error instanceof Error ? error.message : 'An error occurred'}
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.buttonBackground }]}
          onPress={() => router.back()}>
          <Text style={[styles.retryText, { color: colors.buttonText }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!data?.data) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.errorText }]}>Surah not found</Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.buttonBackground }]}
          onPress={() => router.back()}>
          <Text style={[styles.retryText, { color: colors.buttonText }]}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { name, englishName, englishNameTranslation, numberOfAyahs, revelationType, ayahs } =
    data.data;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader
        title={englishName}
        subtitle={`${surahNumber}`}
        showBackButton
        rightComponent={<SettingsMenu />}
      />
      <ScrollView style={styles.content}>
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.card,
              borderBottomColor: colors.border,
            },
          ]}>
          <Text style={[styles.arabicName, { color: colors.textPrimary }]}>{name}</Text>
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

        <View style={styles.versesContainer}>
          {ayahs.map((ayah: Ayah) => (
            <View
              key={ayah.numberInSurah}
              style={[styles.verseContainer, { backgroundColor: colors.card }]}>
              <View style={[styles.verseNumber, { backgroundColor: colors.verseNumber }]}>
                <Text style={[styles.verseNumberText, { color: colors.verseNumberText }]}>
                  {ayah.numberInSurah}
                </Text>
              </View>
              <Text style={[styles.arabicText, { color: colors.textPrimary }]}>{ayah.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
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
  versesContainer: {
    padding: 16,
  },
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
