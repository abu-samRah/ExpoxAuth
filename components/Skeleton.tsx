import React, { FC, useRef, useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { useThemeColors } from '../lib/theme/useTheme';

// Base animated skeleton line component
export const SkeletonLine: FC<{
  width: string | number;
  height: number;
  style?: any;
  delay?: number;
  borderRadius?: number;
}> = ({ width, height, style, delay = 0, borderRadius = 4 }) => {
  const colors = useThemeColors();
  const shimmerTranslateX = useRef(new Animated.Value(-200)).current;

  useEffect(() => {
    const startAnimation = () => {
      shimmerTranslateX.setValue(-200);

      const shimmerAnimation = Animated.loop(
        Animated.timing(shimmerTranslateX, {
          toValue: 200,
          duration: 1500,
          useNativeDriver: true,
        }),
      );

      // Add delay for staggered effect
      setTimeout(() => {
        shimmerAnimation.start();
      }, delay);

      return shimmerAnimation;
    };

    const animation = startAnimation();

    return () => animation.stop();
  }, [shimmerTranslateX, delay]);

  return (
    <View
      style={[
        {
          width,
          height,
          backgroundColor: colors.border,
          borderRadius,
          overflow: 'hidden',
        },
        style,
      ]}>
      <Animated.View
        style={[
          {
            width: 100,
            height: '100%',
            backgroundColor: colors.background,
            opacity: 0.6,
            transform: [{ translateX: shimmerTranslateX }],
          },
        ]}
      />
    </View>
  );
};

// Circular skeleton for avatars, numbers, etc.
export const SkeletonCircle: FC<{
  size: number;
  delay?: number;
  style?: any;
}> = ({ size, delay = 0, style }) => {
  return (
    <SkeletonLine width={size} height={size} borderRadius={size / 2} delay={delay} style={style} />
  );
};

// Surah list item skeleton
export const SurahSkeleton: FC<{ index?: number }> = ({ index = 0 }) => {
  const colors = useThemeColors();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Stagger the fade-in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      delay: index * 100,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim, index]);

  return (
    <Animated.View style={[styles.surahItem, { backgroundColor: colors.card, opacity: fadeAnim }]}>
      <SkeletonCircle size={40} delay={index * 150} style={styles.numberSkeleton} />
      <View style={styles.contentSkeleton}>
        <SkeletonLine
          width="70%"
          height={20}
          style={styles.titleSkeleton}
          delay={index * 150 + 100}
        />
        <SkeletonLine
          width="90%"
          height={16}
          style={styles.subtitleSkeleton}
          delay={index * 150 + 200}
        />
        <SkeletonLine
          width="60%"
          height={14}
          style={styles.metaSkeleton}
          delay={index * 150 + 300}
        />
      </View>
    </Animated.View>
  );
};

// Search input skeleton
export const SearchSkeleton: FC<{ delay?: number }> = ({ delay = 0 }) => {
  return (
    <SkeletonLine
      width="100%"
      height={48}
      style={styles.searchSkeleton}
      delay={delay}
      borderRadius={8}
    />
  );
};

// Complete surah list skeleton
export const SurahListSkeleton: FC<{ itemCount?: number }> = ({ itemCount = 8 }) => {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.searchContainer}>
        <SearchSkeleton />
      </View>
      <View style={styles.listContent}>
        {Array.from({ length: itemCount }).map((_, index) => (
          <SurahSkeleton key={index} index={index} />
        ))}
      </View>
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
  searchSkeleton: {
    marginBottom: 12,
  },
  sortContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  listContent: {
    padding: 16,
    paddingTop: 0,
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
  numberSkeleton: {
    marginRight: 16,
  },
  contentSkeleton: {
    flex: 1,
  },
  titleSkeleton: {
    marginBottom: 8,
  },
  subtitleSkeleton: {
    marginBottom: 8,
  },
  metaSkeleton: {
    marginBottom: 0,
  },
});
