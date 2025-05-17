import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  RefreshControl,
} from 'react-native';
import { useSurahList } from '@/app/hooks/useQuran';
import { useRouter } from 'expo-router';
import { useState, useCallback, useMemo } from 'react';
import { Surah } from '@/types/quran';

export function SurahList() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useSurahList();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSurahs = useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter(
      (surah) =>
        surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        surah.englishNameTranslation.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [data?.data, searchQuery]);

  const handleSurahPress = useCallback(
    (surah: Surah) => {
      router.push({
        pathname: '/surah/[id]',
        params: { id: surah.number.toString() },
      });
    },
    [router],
  );

  const renderItem = useCallback(
    ({ item }: { item: Surah }) => (
      <TouchableOpacity
        style={styles.surahItem}
        onPress={() => handleSurahPress(item)}
        activeOpacity={0.7}>
        <View style={styles.surahNumber}>
          <Text style={styles.numberText}>{item.number}</Text>
        </View>
        <View style={styles.surahInfo}>
          <Text style={styles.surahName}>{item.englishName}</Text>
          <Text style={styles.surahTranslation}>{item.englishNameTranslation}</Text>
          <Text style={styles.surahMeta}>
            {item.numberOfAyahs} verses • {item.revelationType}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [handleSurahPress],
  );

  if (isLoading && !data) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error.message}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search surah..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor="#666"
      />
      <FlatList
        data={filteredSurahs}
        keyExtractor={(item) => item.number.toString()}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refetch} />}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {searchQuery ? 'No surahs found' : 'No surahs available'}
            </Text>
          </View>
        }
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
  centerContainer: {
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
  },
  listContent: {
    paddingBottom: 20,
  },
  surahItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  surahNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  numberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
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
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  surahMeta: {
    fontSize: 12,
    color: '#888',
  },
  errorText: {
    color: '#ff3b30',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  retryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
    fontSize: 16,
  },
});
