import { SurahListResponse, SurahResponse } from '@/types/quran';
import { quranApi } from './client';

// Cache surah list for 1 hour since it rarely changes
export async function fetchSurahList(): Promise<SurahListResponse> {
  return quranApi.get<SurahListResponse>('/surah');
}

// Cache individual surahs for 30 minutes
export async function fetchSurah(
  surahNumber: number,
  edition: string = 'quran-uthmani',
): Promise<SurahResponse> {
  return quranApi.get<SurahResponse>(`/surah/${surahNumber}/${edition}`);
}
