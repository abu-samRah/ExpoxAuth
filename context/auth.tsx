import React, {
  createContext,
  FC,
  useEffect,
  useState,
  PropsWithChildren,
  useCallback,
} from 'react';
import * as WebBrowser from 'expo-web-browser';
import { AuthError, useAuthRequest } from 'expo-auth-session';
import { BASE_URL, TOKEN_KEY_NAME, authRequestConfig, authDiscovery } from '../constants';
import { Platform } from 'react-native';
import * as jose from 'jose';
import { tokenCache } from '@/utils/cache';
import { AuthUser } from '@/types/user';

WebBrowser.maybeCompleteAuthSession();

type AuthState = {
  user: AuthUser | null;
  signIn: () => void;
  signOut: () => void;
  fetchWithAuth: (url: string, options: RequestInit) => Promise<Response>;
  isLoading: boolean;
  error: AuthError | null;
};

const initialState: AuthState = {
  user: null as AuthUser | null,
  signIn: () => {},
  signOut: () => {},
  fetchWithAuth: (url: string, options: RequestInit) => Promise.resolve(new Response()),
  isLoading: false,
  error: null as AuthError | null,
};

export const AuthContext = createContext(initialState);

export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);

  const [request, response, promptAsync] = useAuthRequest(authRequestConfig, authDiscovery);

  const isWeb = Platform.OS === 'web';

  const handleResponse = useCallback(async () => {
    if (response?.type === 'success') {
      const { code } = response.params;
      try {
        setIsLoading(true);

        // Create form data to send to our token endpoint
        // We include both the code and platform information
        // The platform info helps our server handle web vs native differently
        const formData = new FormData();
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
        const tokenResponse = await fetch(`${BASE_URL}/api/auth/token`, {
          method: 'POST',
          body: formData,
          credentials: isWeb ? 'include' : 'same-origin', // Include cookies for web
        });

        if (isWeb) {
          const userData = await tokenResponse.json();

          if (userData.success) {
            // Fetch the session to get user data
            // This ensures we have the most up-to-date user information
            const sessionResponse = await fetch(`${BASE_URL}/api/auth/session`, {
              method: 'GET',
              credentials: 'include',
            });

            if (sessionResponse.ok) {
              const sessionData = await sessionResponse.json();
              setUser(sessionData as AuthUser);
            }
          }
        } else {
          const accessTokenResponse = await tokenResponse.json();

          const accessToken = accessTokenResponse.access_token;

          setAccessToken(accessToken);

          const decodedUser = jose.decodeJwt(accessToken);
          setUser(decodedUser as AuthUser);

          // Store access token in secure storage
          tokenCache?.saveToken(TOKEN_KEY_NAME, accessToken);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    } else if (response?.type === 'error') {
      setError(response.error as AuthError);
    }
  }, [isWeb, request?.codeVerifier, response]);

  useEffect(() => {
    handleResponse();
  }, [handleResponse]);

  useEffect(() => {
    const restoreSession = async () => {
      setIsLoading(true);
      try {
        if (isWeb) {
          const sessionResponse = await fetch(`${BASE_URL}/api/auth/session`, {
            method: 'GET',
            credentials: 'include',
          });

          if (sessionResponse.ok) {
            const userData = await sessionResponse.json();
            setUser(userData as AuthUser);
          }
        } else {
          const storedToken = await tokenCache?.getToken(TOKEN_KEY_NAME);
          if (storedToken) {
            try {
              const decodedUser = jose.decodeJwt(storedToken);
              const exp = decodedUser.exp;
              const now = Math.floor(Date.now() / 1000);

              if (exp && exp > now) {
                setUser(decodedUser as AuthUser);
                setAccessToken(storedToken);
              } else {
                setUser(null);
                setAccessToken(null);
                tokenCache?.deleteToken(TOKEN_KEY_NAME);
              }
            } catch (e) {
              console.error(e);
            }
          }
        }
      } catch (e) {
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, [isWeb]);

  const signIn = async () => {
    try {
      if (!request) {
        console.error('No request found');
        return;
      }
      await promptAsync();
    } catch (err) {
      console.error(err);
    }
  };

  const signOut = async () => {
    if (isWeb) {
      // For web: Call logout endpoint to clear the cookie
      try {
        await fetch(`${BASE_URL}/api/auth/logout`, {
          method: 'POST',
          credentials: 'include',
        });
      } catch (error) {
        console.error('Error during web logout:', error);
      }
    } else {
      // For native: Clear both tokens from cache
      await tokenCache?.deleteToken('accessToken');
    }

    // Clear state
    setUser(null);
    setAccessToken(null);
  };

  const fetchWithAuth = (url: string, options: RequestInit) => {
    if (isWeb) {
      return fetch(url, { ...options, credentials: 'include' });
    }
    return fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${accessToken}` },
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        signIn,
        signOut,
        fetchWithAuth,
        isLoading,
        error,
      }}>
      {children}
    </AuthContext.Provider>
  );
};
