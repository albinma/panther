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
      emailVerified: boolean;
      exp: number;
      role: string;
    } & DefaultSession['user'];
  }

  interface User {
    accessToken?: string;
    refreshToken?: string;
    id: string;
    publicAddress: string;
    email?: string;
    emailVerified: boolean;
    exp: number;
    role: string;
  }
}
