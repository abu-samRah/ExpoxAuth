import { View, Text, Button } from 'react-native';
import { useAuth } from '@/hooks/useAuth';

export default function LoginForm() {
  const { signIn } = useAuth();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text>Login</Text>
      <Button title="Sign in with Google" onPress={signIn} />
    </View>
  );
}
