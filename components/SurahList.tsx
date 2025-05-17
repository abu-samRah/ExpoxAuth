import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSurahList } from '../hooks/useQuran';
import type { SurahListItem } from '../lib/schemas/quran';

export function SurahList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading, error } = useSurahList();

  const handleSurahPress = (surah: SurahListItem) => {
    router.push({
      pathname: '/surah/[id]',
      params: { id: surah.number.toString() },
    });
  };

  const filteredSurahs = data?.data.filter((surah) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      surah.name.toLowerCase().includes(searchLower) ||
      surah.englishName.toLowerCase().includes(searchLower) ||
      surah.englishNameTranslation.toLowerCase().includes(searchLower) ||
      surah.number.toString().includes(searchQuery)
    );
  });

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
      </View>
    );
  }

  if (!data?.data.length) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>No Surahs found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search Surahs..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#666"
      />
      <FlatList
        data={filteredSurahs}
        keyExtractor={(item) => item.number.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.surahItem} onPress={() => handleSurahPress(item)}>
            <View style={styles.surahNumber}>
              <Text style={styles.numberText}>{item.number}</Text>
            </View>
            <View style={styles.surahInfo}>
              <Text style={styles.surahName}>{item.englishName}</Text>
              <Text style={styles.surahTranslation}>{item.englishNameTranslation}</Text>
              <Text style={styles.verseCount}>
                {item.numberOfAyahs} Verses • {item.revelationType}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
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
  searchInput: {
    margin: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    fontSize: 16,
    color: '#333',
  },
  listContent: {
    padding: 16,
  },
  surahItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  surahNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  numberText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  surahInfo: {
    flex: 1,
  },
  surahName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  surahTranslation: {
    fontSize: 16,
    color: '#666',
    marginBottom: 4,
  },
  verseCount: {
    fontSize: 14,
    color: '#888',
  },
  errorText: {
    color: '#666',
    fontSize: 16,
    textAlign: 'center',
  },
});
