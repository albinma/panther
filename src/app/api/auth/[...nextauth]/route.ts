import { decode, sign, verify } from 'jsonwebtoken';
import NextAuth, { User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { cookies } from 'next/headers';

const refreshAccessToken = async (token: JWT): Promise<JWT> => {
  try {
    const { refreshToken } = token;
    const res = await fetch(process.env.AUTH_ISSUER + '/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw data;
    }

    const { accessToken, refreshToken: newRefreshToken } = data;

    const payload = verify(accessToken, process.env.AUTH_SECRET, {
      audience: process.env.AUTH_AUDIENCE,
      issuer: process.env.AUTH_ISSUER,
    });

    if (!payload) {
      throw new Error('InvalidAccessToken');
    }

    const { exp } = payload as { exp: number };

    return {
      ...token,
      accessToken,
      refreshToken: newRefreshToken,
      exp,
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
        message: { label: 'Message', type: 'text' },
        signature: { label: 'Signature', type: 'text' },
      },
      authorize: async (credentials): Promise<User | null> => {
        if (!credentials) {
          return null;
        }

        const { publicAddress, message, signature } = credentials;
        const nonceCookie = cookies().get('sesame-bun');

        if (!nonceCookie) {
          return null;
        }

        const res = await fetch(process.env.AUTH_ISSUER + '/auth/complete', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Cookie: `${nonceCookie.name}=${nonceCookie.value}`,
          },
          body: JSON.stringify({ publicAddress, message, signature }),
        });

        if (!res.ok) {
          return null;
        }

        cookies().delete('sesame-bun');

        const data: {
          accessToken: string;
          refreshToken?: string;
        } = await res.json();

        if (!data || !data.accessToken || !data.refreshToken) {
          return null;
        }

        const { accessToken, refreshToken } = data;

        const payload = verify(accessToken, process.env.AUTH_SECRET, {
          audience: process.env.AUTH_AUDIENCE,
          issuer: process.env.AUTH_ISSUER,
        });

        if (!payload) {
          return null;
        }

        const { sub, isAdmin, exp } = payload as {
          sub: string;
          isAdmin: boolean;
          exp: number;
        };

        const user = {
          publicAddress,
          accessToken,
          refreshToken,
          id: sub,
          isAdmin,
          exp,
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
