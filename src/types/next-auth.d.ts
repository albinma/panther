import { DefaultSession } from 'next-auth';

declare module 'next-auth/jwt' {
  interface JWT {
    user?: User;
    accessToken?: string;
    refreshToken?: string;
    exp?: number;
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      accessToken?: string;
      refreshToken?: string;
      publicAddress: string;
      isAdmin: boolean;
      exp: number;
    } & DefaultSession['user'];
  }

  interface User {
    publicAddress: string;
    accessToken?: string;
    refreshToken?: string;
    isAdmin: boolean;
    exp: number;
  }
}
