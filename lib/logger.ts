import { NextRequest } from 'next/server';

export function logRequest(request:NextRequest) {
  if (process.env.NODE_ENV === 'development') {
    const method = request.method;
    const url = request.nextUrl.pathname;
    console.log(`[${new Date().toISOString()}] ${method} ${url}`);
  }
}