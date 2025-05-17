import { useQuery } from '@tanstack/react-query';
import { fetchSurah, fetchSurahList } from '@/lib/api/quran';

export function useSurahList() {
  return useQuery({
    queryKey: ['surahList'],
    queryFn: fetchSurahList,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useSurah(surahNumber: number, edition: string = 'quran-uthmani') {
  return useQuery({
    queryKey: ['surah', surahNumber, edition],
    queryFn: () => fetchSurah(surahNumber, edition),
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
