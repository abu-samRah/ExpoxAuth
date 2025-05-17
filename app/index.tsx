import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import LoginForm from './components/LoginForm';
import { BASE_URL } from '@/constants';
import { useState } from 'react';
import FullScreenLoader from './components/FullSscreenLoader';
import { SurahList } from './components/SurahList';
import { Ionicons } from '@expo/vector-icons';

export default function Index() {
  const { user, isLoading, signOut, fetchWithAuth } = useAuth();
  const [data, setData] = useState<any>(null);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Quran App</Text>
        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Ionicons name="log-out-outline" size={24} color="#007AFF" />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      <SurahList />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  signOutText: {
    marginLeft: 4,
    color: '#007AFF',
    fontSize: 16,
  },
});
