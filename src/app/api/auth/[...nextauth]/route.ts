import { decode, sign, verify } from 'jsonwebtoken';
import NextAuth, { User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';

const refreshAccessToken = async (token: JWT): Promise<JWT> => {
  try {
    const { refreshToken } = token;
    const res = await fetch(process.env.AUTH_ISSUER + '/auth/refresh-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw data;
    }

    return {
      ...token,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      exp: data.expires_in,
    };
  } catch (error) {
    await fetch('/api/auth/signout');
    return { ...token, error: 'RefreshAccessTokenError' };
  }
};

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

        const payload = verify(data.access_token, process.env.AUTH_SECRET, {
          audience: process.env.AUTH_AUDIENCE,
          issuer: process.env.AUTH_ISSUER,
        });

        if (!payload) {
          return null;
        }

        const { sub, public_address, email, email_verified, role, exp } =
          payload as {
            sub: string;
            public_address: string;
            email?: string;
            email_verified: boolean;
            role: string;
            exp: number;
          };

        const user = {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          id: sub,
          publicAddress: public_address,
          email,
          emailVerified: email_verified,
          exp,
          role,
        };

        return user;
      },
    }),
  ],
  session: {
    maxAge: 7 * 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      name: 'next-auth.session-token',
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: true },
    },
  },
  jwt: {
    secret: process.env.AUTH_SECRET,
    async encode({ token, secret }) {
      const jwt = sign(token || {}, secret);

      return jwt;
    },
    async decode({ token }) {
      const ret = decode(token || '');
      return ret as JWT;
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const { accessToken, refreshToken, exp } = user;
        return {
          user,
          accessToken,
          refreshToken,
          exp,
        };
      }

      const { exp = 0 } = token;

      if (Math.floor(Date.now() / 1000) < exp) {
        return token;
      }

      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (session.user) {
        session = { ...session };
        session.user = token.user;

        if (token.exp) {
          session.expires = new Date(token.exp * 1000).toISOString();
        }
      }

      return session;
    },
  },
});

export { handler as GET, handler as POST };
