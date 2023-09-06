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

  const data = await res.json();

  return NextResponse.json(data);
}
