import { BASE_URL } from '@/constants';
import { AuthRequest } from 'expo-auth-session';
import { useCallback, useMemo } from 'react';

export const useTokenResponse = (code: string, isWeb: boolean, request: AuthRequest | null) => {
  // Create form data to send to our token endpoint
  // We include both the code and platform information
  // The platform info helps our server handle web vs native differently

  const formData = useMemo(() => {
    const formData = new FormData();

    formData.append('code', code); // Append the new code

    formData.append('platform', isWeb ? 'web' : 'native'); // Append platform info
    formData.append('code_verifier', request?.codeVerifier || ''); // Append code verifier if available

    return formData;
  }, [code, isWeb, request?.codeVerifier]);

  // Send the authorization code to our token endpoint
  // The server will exchange this code with Google for access and refresh tokens
  // For web: credentials are included to handle cookies
  // For native: we'll receive the tokens directly in the response
  const getTokenResponse = useCallback(
    async () =>
      await fetch(`${BASE_URL}/api/auth/token`, {
        method: 'POST',
        body: formData,
        credentials: isWeb ? 'include' : 'same-origin', // Include cookies for web
      }),
    [formData, isWeb],
  );

  return getTokenResponse;
};
