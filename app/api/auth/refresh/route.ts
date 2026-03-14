import { NextResponse } from 'next/server';
import { refreshTokenHandler } from '@/lib/auth';

export async function POST(request: Request) {
  return refreshTokenHandler(request, NextResponse.next());
}