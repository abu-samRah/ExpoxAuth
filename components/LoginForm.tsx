import { FC, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Dimensions,
} from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useThemeColors } from '@/lib/theme/useTheme';
import LottieView from 'lottie-react-native';

const { width } = Dimensions.get('window');

const LoginForm: FC = () => {
  const { signIn } = useAuth();
  const colors = useThemeColors();

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    // Start animations when component mounts
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Start the Lottie animation
    animationRef.current?.play();
  }, [fadeAnim, slideAnim]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.animationContainer}>
        <LottieView
          ref={animationRef}
          source={require('@/assets/animations/quran-reading.json')}
          style={styles.animation}
          autoPlay
          loop={true}
          speed={0.7}
          renderMode="AUTOMATIC"
        />
      </View>

      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Welcome</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Sign in to access your Quran journey
          </Text>
        </View>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={[styles.googleButton, { backgroundColor: colors.card }]}
            onPress={signIn}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={0.8}>
            <Image source={require('@/assets/images/google-icon.png')} style={styles.googleIcon} />
            <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
              Continue with Google
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={[styles.termsText, { color: colors.textTertiary }]}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  animationContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    height: width * 0.6,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  animation: {
    width: width * 0.6,
    height: width * 0.6,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    marginTop: width * 0.3,
  },
  header: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.8,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  termsText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
});

export default LoginForm;
