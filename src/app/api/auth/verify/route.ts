import { decode, JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { publicAddress, signature } = await request.json();
  const res = await fetch('http://localhost:9001/auth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      publicAddress,
      signature,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({}, { status: res.status });
  }

  const data: {
    access_token: string;
    refresh_token: string;
  } = await res.json();

  const { sub: userId } = decode(data.access_token) as JwtPayload;

  cookies().set({
    name: 'session',
    value: JSON.stringify({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      userId,
    }),
    httpOnly: true,
    path: '/',
  });

  return NextResponse.json({}, { status: 200 });
}
