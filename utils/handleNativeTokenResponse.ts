import * as jose from 'jose';
import { AuthUser } from '@/types/user';

export const handleNativeTokenResponse = async (tokenResponse: any) => {
  const accessTokenResponse = (await tokenResponse.json()) as { access_token: string };

  const accessToken = accessTokenResponse.access_token;

  const decodedUser = jose.decodeJwt(accessToken) as AuthUser;

  return { accessToken, decodedUser };
};
