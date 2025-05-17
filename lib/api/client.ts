import { Platform } from 'react-native';
import { tokenCache } from '@/utils/cache';
import { TOKEN_KEY_NAME } from '@/constants';

interface FetchOptions extends RequestInit {
  params?: Record<string, string | number>;
  requiresAuth?: boolean;
}

interface ApiClientOptions {
  baseUrl: string;
  requiresAuth?: boolean;
}

class ApiClient {
  private baseUrl: string;
  private defaultRequiresAuth: boolean;

  constructor({ baseUrl, requiresAuth = false }: ApiClientOptions) {
    this.baseUrl = baseUrl;
    this.defaultRequiresAuth = requiresAuth;
  }

  private buildUrl(path: string, params?: Record<string, string | number>): string {
    const url = new URL(`${this.baseUrl}${path}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value.toString());
      });
    }

    return url.toString();
  }

  private async getAuthHeaders(options: FetchOptions): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    const requiresAuth = options.requiresAuth ?? this.defaultRequiresAuth;

    if (requiresAuth) {
      const isWeb = Platform.OS === 'web';

      if (isWeb) {
        // For web, we'll use credentials: 'include' in the fetch options
        return headers;
      } else {
        // For native, we'll add the Bearer token
        const token = await tokenCache?.getToken(TOKEN_KEY_NAME);
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
      }
    }

    return headers;
  }

  async fetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
    const { params, requiresAuth, ...fetchOptions } = options;
    const url = this.buildUrl(path, params);
    const headers = await this.getAuthHeaders(options);

    const response = await fetch(url, {
      ...fetchOptions,
      headers,
      credentials:
        (requiresAuth ?? this.defaultRequiresAuth) && Platform.OS === 'web' ? 'include' : undefined,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  get<T>(path: string, options: FetchOptions = {}): Promise<T> {
    return this.fetch<T>(path, { ...options, method: 'GET' });
  }

  post<T>(path: string, data: unknown, options: FetchOptions = {}): Promise<T> {
    return this.fetch<T>(path, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  put<T>(path: string, data: unknown, options: FetchOptions = {}): Promise<T> {
    return this.fetch<T>(path, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  delete<T>(path: string, options: FetchOptions = {}): Promise<T> {
    return this.fetch<T>(path, { ...options, method: 'DELETE' });
  }
}

export const createApiClient = (options: ApiClientOptions) => {
  return new ApiClient(options);
};
