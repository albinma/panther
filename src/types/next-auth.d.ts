import { DefaultSession } from 'next-auth';

declare module 'next-auth/jwt' {
  interface JWT {
    idToken?: string;
    accessToken?: string;
  }
}

declare module 'next-auth' {
  interface Session {
    user: {
      accessToken?: string;
    } & DefaultSession['user'];
  }

  interface User {
    accessToken?: string;
  }
}
