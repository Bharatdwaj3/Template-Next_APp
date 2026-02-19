import { NextResponse } from 'next/server';
import { refreshTokenHandler } from '@/middleware/token.middleware';

export async function POST(request: unknown) {
  return refreshTokenHandler(request, NextResponse.next());
}