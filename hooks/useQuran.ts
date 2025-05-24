import { useQuery } from '@tanstack/react-query';
import { fetchSurah, fetchSurahList } from '../lib/api/quran';
import type { SurahResponse, SurahListResponse } from '../lib/schemas/quran';
import { ZodError } from 'zod';

// Custom error type for validation errors
class ValidationError extends Error {
  constructor(
    message: string,
    public zodError: ZodError,
  ) {
    super(message);
    this.name = 'ValidationError';
  }
}

export function useSurahList() {
  return useQuery<SurahListResponse['data'], Error>({
    queryKey: ['surahList'],
    queryFn: async () => {
      try {
        return (await fetchSurahList()).data;
      } catch (error) {
        if (error instanceof ZodError) {
          throw new ValidationError('Invalid Surah list response', error);
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useSurah(surahNumber: number, edition: string = 'quran-uthmani') {
  return useQuery<SurahResponse['data'], Error>({
    queryKey: ['surah', surahNumber, edition],
    queryFn: async () => {
      try {
        return (await fetchSurah(surahNumber, edition)).data;
      } catch (error) {
        if (error instanceof ZodError) {
          throw new ValidationError(`Invalid Surah ${surahNumber} response`, error);
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
