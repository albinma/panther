import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(): Promise<NextResponse> {
  const userCount = await prisma.user.count();
  throw new Error('test');
  if (userCount <= 0) {
    throw new Error('No users found, seed failed');
  }

  return NextResponse.json({ status: 'healthy' });
}
