import React from 'react';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { useSurah } from '../../hooks/useQuran';
import { useThemeColors } from '../../lib/theme/useTheme';
import { SettingsMenu } from '../../components/SettingsMenu';
import { LoadingState } from '../../components/surah/LoadingState';
import { ErrorState } from '../../components/surah/ErrorState';
import { SurahContent } from '../../components/surah/SurahContent';

export default function SurahPage() {
  const { id, name } = useLocalSearchParams<{ id: string; name: string }>();
  const router = useRouter();
  const surahNumber = parseInt(id, 10);
  const colors = useThemeColors();

  const { data, isLoading, error } = useSurah(surahNumber);

  const handleGoBack = () => router.back();

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState colors={colors} />;
    }

    if (error) {
      return (
        <ErrorState
          colors={colors}
          message={error instanceof Error ? error.message : 'An error occurred'}
          onRetry={handleGoBack}
        />
      );
    }

    if (!data?.data) {
      return <ErrorState colors={colors} message="Surah not found" onRetry={handleGoBack} />;
    }

    return <SurahContent colors={colors} data={data.data} />;
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: name,
          headerBackTitle: 'Back',
          headerRight: () => <SettingsMenu />,
        }}
      />
      {renderContent()}
    </>
  );
}
