import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { User } from 'next-auth';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      id: 'crypto',
      name: 'Crypto Wallet Auth',
      credentials: {
        publicAddress: { label: 'Public Address', type: 'text' },
        signature: { label: 'Signature', type: 'text' },
      },
      authorize: async (credentials): Promise<User | null> => {
        if (!credentials) {
          return null;
        }

        const { publicAddress, signature } = credentials;

        const res = await fetch(process.env.AUTH_ISSUER + '/auth/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicAddress, signature }),
        });

        if (!res.ok) {
          return null;
        }

        const data: {
          access_token: string;
          refresh_token?: string;
          expires_in?: number;
        } = await res.json();

        if (!data || !data.access_token) {
          return null;
        }

        const user = {
          id: '',
          accessToken: data.access_token,
        };

        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user && user.accessToken) {
        token.accessToken = user.accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        name: session.user.name,
        email: session.user.email,
        accessToken: token.accessToken,
      };
      return session;
    },
  },
});

export { handler as GET, handler as POST };
