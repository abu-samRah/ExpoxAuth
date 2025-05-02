import { BASE_URL } from '@/constants';
import { AuthUser } from '@/types/user';

type SuccessResponse = {
  sessionData: AuthUser;
  error: false;
};

type ErrorResponse = {
  sessionData?: never;
  error: true;
};

export const handleWebTokenResponse = async (
  tokenResponse: Response,
): Promise<SuccessResponse | ErrorResponse> => {
  const userData = (await tokenResponse.json()) as { success: boolean };

  if (userData.success) {
    // Fetch the session to get user data
    // This ensures we have the most up-to-date user information
    const sessionResponse = await fetch(`${BASE_URL}/api/auth/session`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!sessionResponse.ok) {
      throw new Error(`Session request failed with status: ${sessionResponse.status}`);
    }

    const sessionData = (await sessionResponse.json()) as AuthUser;
    return { sessionData, error: false };
  } else {
    return { error: true };
  }
};
