import React, { useState, FC, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSurahList } from '../hooks/useQuran';
import type { SurahListItem } from '../lib/schemas/quran';
import { useThemeColors } from '../lib/theme/useTheme';
import { SurahListSkeleton } from './Skeleton';

export const SurahList: FC = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: surahList, isLoading, error, refetch } = useSurahList();
  console.log({ isLoading });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const colors = useThemeColors();

  const handleSurahPress = useCallback(
    (surah: SurahListItem) => {
      router.push({
        pathname: '/surah/[id]',
        params: {
          id: surah.number.toString(),
          name: surah.englishName,
        },
      });
    },
    [router],
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  const handleScrollBeginDrag = useCallback(() => {
    Keyboard.dismiss();
  }, []);

  const filteredSurahs = useMemo(
    () =>
      surahList?.filter((surah) => {
        const searchLower = searchQuery.toLowerCase();
        return (
          surah.name.toLowerCase().includes(searchLower) ||
          surah.englishName.toLowerCase().includes(searchLower) ||
          surah.englishNameTranslation.toLowerCase().includes(searchLower) ||
          surah.number.toString().includes(searchQuery)
        );
      }),
    [searchQuery, surahList],
  );

  const renderItem = useCallback(
    ({ item }: { item: SurahListItem }) => (
      <TouchableOpacity
        style={[styles.surahItem, { backgroundColor: colors.card }]}
        onPress={() => handleSurahPress(item)}>
        <View style={[styles.surahNumber, { backgroundColor: colors.verseNumber }]}>
          <Text style={[styles.numberText, { color: colors.verseNumberText }]}>{item.number}</Text>
        </View>
        <View style={styles.surahInfo}>
          <Text style={[styles.surahName, { color: colors.textPrimary }]}>{item.englishName}</Text>
          <Text style={[styles.surahTranslation, { color: colors.textSecondary }]}>
            {item.englishNameTranslation}
          </Text>
          <Text style={[styles.verseCount, { color: colors.textTertiary }]}>
            {item.numberOfAyahs} Verses • {item.revelationType}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    [handleSurahPress, colors],
  );

  if (isLoading) {
    return <SurahListSkeleton itemCount={8} />;
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.errorText }]}>
          {error instanceof Error ? error.message : 'An error occurred'}
        </Text>
      </View>
    );
  }

  if (!surahList?.length) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={[styles.errorText, { color: colors.errorText }]}>No Surahs found</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <TextInput
        style={[
          styles.searchInput,
          {
            backgroundColor: colors.searchBackground,
            color: colors.textPrimary,
          },
        ]}
        placeholder="Search Surahs..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholderTextColor={colors.textTertiary}
      />
      <FlatList
        data={filteredSurahs}
        keyExtractor={(item) => item.number.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
        onScrollBeginDrag={handleScrollBeginDrag}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    paddingBottom: 8,
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
    borderRadius: 8,
    fontSize: 16,
  },
  listContent: {
    padding: 16,
  },
  surahItem: {
    flexDirection: 'row',
    padding: 16,
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  numberText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  surahInfo: {
    flex: 1,
  },
  surahName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  surahTranslation: {
    fontSize: 16,
    marginBottom: 4,
  },
  verseCount: {
    fontSize: 14,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  // Skeleton styles
  skeletonNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 16,
  },
  skeletonLine: {
    borderRadius: 4,
    marginBottom: 8,
  },
  skeletonTitle: {
    height: 20,
    width: '70%',
  },
  skeletonSubtitle: {
    height: 16,
    width: '90%',
  },
  skeletonMeta: {
    height: 14,
    width: '60%',
  },
});
