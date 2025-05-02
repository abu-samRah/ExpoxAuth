import { BASE_URL } from '@/constants';
import { useCallback, useMemo } from 'react';

export const useTokenResponse = (code: string, isWeb: boolean, request: any) => {
  // Create form data to send to our token endpoint
  // We include both the code and platform information
  // The platform info helps our server handle web vs native differently
  const formData = useMemo(() => new FormData(), []);
  formData.append('code', code);

  // Add platform information for the backend to handle appropriately
  if (isWeb) {
    formData.append('platform', 'web');
  }

  // Get the code verifier from the request object
  // This is the same verifier that was used to generate the code challenge
  if (request?.codeVerifier) {
    formData.append('code_verifier', request.codeVerifier);
  } else {
    console.warn('No code verifier found in request object');
  }

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
