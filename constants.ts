/**
 * Application Constants
 *
 * This file centralizes all constants used across the application.
 * Import from this file instead of defining constants in individual files.
 */

import { AuthRequestConfig, DiscoveryDocument, makeRedirectUri } from 'expo-auth-session';

// Authentication Constants
export const TOKEN_KEY_NAME = 'accessToken';
export const COOKIE_NAME = 'auth_token';
export const COOKIE_MAX_AGE = 172800; // 2 days in seconds: 2 * 24 * 60 * 60 = 172800
export const JWT_EXPIRATION_TIME = '2d'; // 2 days

// Google OAuth Constants
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
export const GOOGLE_REDIRECT_URI = `${process.env.EXPO_PUBLIC_BASE_URL}/api/auth/callback`;
export const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';

// Apple OAuth Constants
export const APPLE_CLIENT_ID = 'com.beto.expoauthexample.web';
export const APPLE_CLIENT_SECRET = process.env.APPLE_CLIENT_SECRET!;
export const APPLE_REDIRECT_URI = `${process.env.EXPO_PUBLIC_BASE_URL}/api/auth/apple/callback`;
export const APPLE_AUTH_URL = 'https://appleid.apple.com/auth/authorize';

// Environment Constants
export const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
export const APP_SCHEME = process.env.EXPO_PUBLIC_SCHEME;
export const JWT_SECRET = process.env.JWT_SECRET!;

// Cookie Settings
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: false,
  sameSite: 'Lax' as const,
  path: '/',
  maxAge: COOKIE_MAX_AGE,
};

export const authRequestConfig: AuthRequestConfig = {
  clientId: 'google',
  scopes: ['openid', 'profile', 'email'],
  redirectUri: makeRedirectUri(),
};

export const authDiscovery: DiscoveryDocument = {
  authorizationEndpoint: `${BASE_URL}/api/auth/authorize`,
  tokenEndpoint: `${BASE_URL}/api/auth/token`,
};
