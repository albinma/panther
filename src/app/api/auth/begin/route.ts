import { getBasicAuthenticationHeader } from '@/utils/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { publicAddress } = await request.json();

  // Send the public address to generate a nonce associates with our account
  const response = await fetch(process.env.AUTH_ISSUER + '/auth/begin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getBasicAuthenticationHeader(),
    },
    body: JSON.stringify({
      publicAddress,
    }),
  });

  const nonceCookie = response.headers.getSetCookie().at(0);

  if (!nonceCookie) {
    throw new Error('Nonce cookie not found');
  }

  const responseData = await response.json();

  return NextResponse.json(responseData, {
    headers: {
      'Set-Cookie': nonceCookie,
    },
  });
}
