import { FC } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useThemeColors } from '@/lib/theme/useTheme';

const LoginForm: FC = () => {
  const { signIn } = useAuth();
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.textPrimary }]}>Welcome</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            Sign in to access your Quran journey
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.googleButton, { backgroundColor: colors.card }]}
          onPress={signIn}>
          <Image source={require('@/assets/images/google-icon.png')} style={styles.googleIcon} />
          <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
            Continue with Google
          </Text>
        </TouchableOpacity>

        <Text style={[styles.termsText, { color: colors.textTertiary }]}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
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
