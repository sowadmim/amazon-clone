// @ts-nocheck
import { getToken } from 'next-auth/jwt';
import { NextFetchEvent, NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const token = await getToken({
    req: req,
    secret: process.env.JWT_SECRET!,
  });

  if (!token) {
    return NextResponse.redirect('/auth/login');
  }

  return NextResponse.next();
}
