import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const { publicAddress } = await request.json();

  // Send the public address to generate a nonce associates with our account
  const response = await fetch('http://localhost:9001/auth/authorize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      publicAddress,
    }),
  });

  const responseData = await response.json();

  return NextResponse.json(responseData);
}
