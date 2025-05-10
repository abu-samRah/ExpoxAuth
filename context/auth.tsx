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
import { handleWebTokenResponse } from '@/utils/handleWebTokenResponse';
import { useTokenResponse } from '@/hooks/useTokenResponse';
import { handleNativeTokenResponse } from '@/utils/handleNativeTokenResponse';

// Complete any pending auth sessions
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
  fetchWithAuth: (_: string, __: RequestInit) => Promise.resolve(new Response()),
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

  const { code } = response?.type === 'success' ? response.params : { code: '' };

  const getTokenResponse = useTokenResponse(code, isWeb, request);

  const handleAuthResponse = useCallback(async () => {
    if (!response) return;

    if (response.type === 'error') {
      setError(response.error as AuthError);
      return;
    }

    try {
      setIsLoading(true);

      const tokenResponse = await getTokenResponse();

      console.log('tokenResponse', { tokenResponse });

      if (!tokenResponse.ok) {
        console.error(`Token request failed with status: ${tokenResponse.status}`);

        return;
      }

      if (isWeb) {
        const { sessionData, error } = await handleWebTokenResponse(tokenResponse);
        if (error) {
          console.error('Failed to authenticate');
          return;
        }

        setUser(sessionData);
      } else {
        const { accessToken, decodedUser } = await handleNativeTokenResponse(tokenResponse);

        setAccessToken(accessToken);

        setUser(decodedUser);

        // Store access token in secure storage
        tokenCache?.saveToken(TOKEN_KEY_NAME, accessToken);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [getTokenResponse, isWeb, response]);

  useEffect(() => {
    handleAuthResponse();
  }, [handleAuthResponse]);

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
          if (!storedToken) return;

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
      } catch (e) {
        console.error(e);
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
