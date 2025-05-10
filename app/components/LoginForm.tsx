import { FC } from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '@/hooks/useAuth';

const LoginForm: FC = () => {
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
};

export default LoginForm;
