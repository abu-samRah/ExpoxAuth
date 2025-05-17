import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, Stack, useRouter } from 'expo-router';
import { useSurah } from '../../hooks/useQuran';
import type { Ayah } from '../../lib/schemas/quran';

export default function SurahPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const surahNumber = parseInt(id, 10);

  const { data, isLoading, error } = useSurah(surahNumber);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          {error instanceof Error ? error.message : 'An error occurred'}
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!data?.data) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Surah not found</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => router.back()}>
          <Text style={styles.retryText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { name, englishName, englishNameTranslation, numberOfAyahs, revelationType, ayahs } =
    data.data;

  return (
    <>
      <Stack.Screen
        options={{
          title: `${surahNumber}. ${englishName}`,
          headerBackTitle: 'Back',
        }}
      />
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.arabicName}>{name}</Text>
          <Text style={styles.englishName}>{englishName}</Text>
          <Text style={styles.translation}>{englishNameTranslation}</Text>
          <View style={styles.metaContainer}>
            <Text style={styles.metaText}>
              {numberOfAyahs} Verses • {revelationType}
            </Text>
          </View>
        </View>

        <View style={styles.versesContainer}>
          {ayahs.map((ayah: Ayah) => (
            <View key={ayah.numberInSurah} style={styles.verseContainer}>
              <View style={styles.verseNumber}>
                <Text style={styles.verseNumberText}>{ayah.numberInSurah}</Text>
              </View>
              <Text style={styles.arabicText}>{ayah.text}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    padding: 20,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  arabicName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  englishName: {
    fontSize: 24,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  translation: {
    fontSize: 18,
    color: '#888',
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
    color: '#666',
  },
  versesContainer: {
    padding: 16,
  },
  verseContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#fff',
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
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  verseNumberText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  arabicText: {
    fontSize: 24,
    color: '#333',
    textAlign: 'right',
    lineHeight: 40,
  },
  errorText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    padding: 12,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
