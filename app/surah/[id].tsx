import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useSurah } from '@/app/hooks/useQuran';
import { Ayah } from '@/types/quran';

type Edition = 'quran-uthmani' | 'en.sahih';

export default function SurahPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [edition, setEdition] = useState<Edition>('quran-uthmani');
  const { data: surah, isLoading, error } = useSurah(Number(id), edition);

  const toggleEdition = () => {
    setEdition((prev) => (prev === 'quran-uthmani' ? 'en.sahih' : 'quran-uthmani'));
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: `Surah ${id}`,
          headerBackTitle: 'Back',
          headerRight: () => (
            <TouchableOpacity onPress={toggleEdition} style={styles.languageToggle}>
              <Text style={styles.languageToggleText}>
                {edition === 'quran-uthmani' ? 'English' : 'Arabic'}
              </Text>
            </TouchableOpacity>
          ),
        }}
      />
      {isLoading ? (
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      ) : error ? (
        <View style={styles.container}>
          <Text style={styles.errorText}>Error loading Surah: {error.message}</Text>
        </View>
      ) : !surah ? (
        <View style={styles.container}>
          <Text style={styles.errorText}>Surah not found</Text>
        </View>
      ) : (
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.surahName}>{surah.data.name}</Text>
            <Text style={styles.surahTranslation}>{surah.data.englishName}</Text>
            <Text style={styles.surahInfo}>
              {surah.data.revelationType} • {surah.data.numberOfAyahs} Verses
            </Text>
          </View>

          <View style={styles.versesContainer}>
            {surah.data.ayahs.map((ayah: Ayah) => (
              <View key={ayah.number} style={styles.verseContainer}>
                <View style={styles.verseNumber}>
                  <Text style={styles.verseNumberText}>{ayah.numberInSurah}</Text>
                </View>
                <Text style={[styles.verseText, edition === 'en.sahih' && styles.verseTextEnglish]}>
                  {ayah.text}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  surahName: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  surahTranslation: {
    fontSize: 24,
    textAlign: 'center',
    color: '#666',
    marginBottom: 8,
  },
  surahInfo: {
    fontSize: 16,
    textAlign: 'center',
    color: '#888',
  },
  versesContainer: {
    padding: 16,
  },
  verseContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  verseNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  verseNumberText: {
    fontSize: 16,
    color: '#666',
  },
  verseText: {
    flex: 1,
    fontSize: 24,
    lineHeight: 40,
    textAlign: 'right',
  },
  verseTextEnglish: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'left',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    margin: 20,
  },
  languageToggle: {
    marginRight: 16,
    padding: 8,
  },
  languageToggleText: {
    color: '#007AFF',
    fontSize: 16,
  },
});
