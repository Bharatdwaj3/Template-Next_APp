import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import User from '@/model/user.model';
import { config } from '@/config/env';
import { NextResponse } from 'next/server';

export const cookieOpts = (maxAge: number, path = '/') => ({
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  path,
  maxAge:   maxAge * 1000,
} as const);

export const setAccessToken = (response: NextResponse, user: any) => {
  const payload = { user: { id: user._id.toString(), accountType: user.accountType } };
  const token   = jwt.sign(payload, config.JWT_ACC_SECRECT, { expiresIn: config.JWT_ACC_EXPIRES_IN });
  response.cookies.set('accessToken', token, cookieOpts(15 * 60));
  return token;
};

export const setRefreshToken = async (response: NextResponse, user: any) => {
  const payload = { user: { id: user._id.toString() } };
  const token   = jwt.sign(payload, config.JWT_REF_SECRECT, { expiresIn: config.JWT_REF_EXPIRES_IN });
  await User.findByIdAndUpdate(user._id, { refreshToken: token, lastLogin: new Date() });
  const refreshExpiry = config.JWT_REF_EXPIRES_IN === '7d' ? 7 * 24 * 60 * 60 : parseInt(config.JWT_REF_EXPIRES_IN);
  response.cookies.set('refreshToken', token, cookieOpts(refreshExpiry, '/'));
  return token;
};

export const clearAuthCookies = (response: NextResponse) => {
  response.cookies.delete('accessToken',  { path: '/' });
  response.cookies.delete('refreshToken', { path: '/' });
};

export const revokeRefreshToken = async (userID: string) => {
  if (!userID) return;
  await User.findByIdAndUpdate(userID, { refreshToken: null, lastLogin: new Date() });
};

export const refreshTokenHandler = async () => {
  const cookieStore = await cookies();
  const token       = cookieStore.get('refreshToken')?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: 'No refresh token provided', code: 'REFRESH_TOKEN_MISSING' },
      { status: 401 }
    );
  }

  try {
    const payload: any = jwt.verify(token, config.JWT_REF_SECRECT);
    const user = await User.findOne({ _id: payload.user.id, refreshToken: token, isActive: true });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid or revoked token', code: 'REFRESH_TOKEN_INVALID' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true, message: 'Tokens refreshed successfully', expiresIn: config.JWT_ACC_EXPIRES_IN,
    });

    setAccessToken(response, user);
    await setRefreshToken(response, user);
    return response;
  } catch (err) {
    console.error('Refresh token error:', err);
    return NextResponse.json(
      { success: false, message: 'Refresh token expired or invalid', code: 'REFRESH_TOKEN_EXPIRED' },
      { status: 401 }
    );
  }
};