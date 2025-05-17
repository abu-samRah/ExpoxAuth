import { createApiClient } from './client';
import { QURAN_API_BASE_URL } from '@/constants';
import {
  SurahResponse,
  SurahListResponse,
  SurahListResponseSchema,
  SurahResponseSchema,
} from '../schemas/quran';

const quranApi = createApiClient({
  baseUrl: QURAN_API_BASE_URL,
});

// Cache surah list for 1 hour since it rarely changes
export async function fetchSurahList(): Promise<SurahListResponse> {
  const response = await quranApi.get<SurahListResponse>('/surah');
  return SurahListResponseSchema.parse(response);
}

// Cache individual surahs for 30 minutes
export async function fetchSurah(
  surahNumber: number,
  edition: string = 'quran-uthmani',
): Promise<SurahResponse> {
  const response = await quranApi.get<SurahResponse>(`/surah/${surahNumber}/${edition}`);
  return SurahResponseSchema.parse(response);
}
