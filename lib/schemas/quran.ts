import { z } from 'zod';

// Base schemas for common fields
export const EditionSchema = z.object({
  identifier: z.string(),
  language: z.string(),
  name: z.string(),
  englishName: z.string(),
  format: z.string(),
  type: z.string(),
});

export const AyahSchema = z.object({
  number: z.number(),
  text: z.string(),
  numberInSurah: z.number(),
  juz: z.number(),
  manzil: z.number(),
  page: z.number(),
  ruku: z.number(),
  hizbQuarter: z.number(),
  sajda: z.boolean(),
});

// Schema for a single Surah in the list
export const SurahListItemSchema = z.object({
  number: z.number(),
  name: z.string(),
  englishName: z.string(),
  englishNameTranslation: z.string(),
  numberOfAyahs: z.number(),
  revelationType: z.string(),
});

// Schema for a full Surah with ayahs
export const SurahSchema = SurahListItemSchema.extend({
  ayahs: z.array(AyahSchema),
});

// API Response schemas
export const SurahListResponseSchema = z.object({
  code: z.number(),
  status: z.string(),
  data: z.array(SurahListItemSchema),
});

export const SurahResponseSchema = z.object({
  code: z.number(),
  status: z.string(),
  data: SurahSchema,
});

// Type exports (we'll use these later)
export type Edition = z.infer<typeof EditionSchema>;
export type Ayah = z.infer<typeof AyahSchema>;
export type SurahListItem = z.infer<typeof SurahListItemSchema>;
export type Surah = z.infer<typeof SurahSchema>;
export type SurahListResponse = z.infer<typeof SurahListResponseSchema>;
export type SurahResponse = z.infer<typeof SurahResponseSchema>;
