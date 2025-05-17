import { Stack } from 'expo-router';
import { AuthProvider } from '@/context/auth';
import { QueryProvider } from '@/context/QueryProvider';

export default function RootLayout() {
  return (
    <AuthProvider>
      <QueryProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </QueryProvider>
    </AuthProvider>
  );
}
