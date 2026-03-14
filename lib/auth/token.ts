import jwt from 'jsonwebtoken';
import User from '@/model/user.model';
import { config } from '@/config/env';
import { NextResponse } from 'next/server';

export const cookieOpts = (maxAge: number, path = '/') => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  path,
  maxAge: maxAge * 1000,
} as const);

export const setAccessToken = (response: NextResponse, user: any) => {
  const payload = {
    user: {
      id: user._id.toString(),
      accountType: user.accountType,
    },
  };
  const token = jwt.sign(payload, config.JWT_ACC_SECRECT, {
    expiresIn: config.JWT_ACC_EXPIRES_IN,
  });
  response.cookies.set('accessToken', token, cookieOpts(15 * 60));
  return token;
};

export const setRefreshToken = async (response: NextResponse, user: any) => {
  const payload = { user: { id: user._id.toString() } };
  const token = jwt.sign(payload, config.JWT_REF_SECRECT, {
    expiresIn: config.JWT_REF_EXPIRES_IN,
  });
  await User.findByIdAndUpdate(user._id, {
    refreshToken: token,
    lastLogin: new Date(),
  });
  const refreshExpiry =
    config.JWT_REF_EXPIRES_IN === '7d' ? 7 * 24 * 60 * 60 : parseInt(config.JWT_REF_EXPIRES_IN);
  response.cookies.set('refreshToken', token, cookieOpts(refreshExpiry, '/'));
  return token;
};

export const clearAuthCookies = (response: NextResponse) => {
  const opts = cookieOpts(0);
  const refreshOpts = cookieOpts(0, '/');
  response.cookies.delete('accessToken', { ...opts, path: '/' });
  response.cookies.delete('refreshToken', { ...refreshOpts, path: '/' });
};

export const revokeRefreshToken = async (userID: string) => {
  if (!userID) return;
  await User.findByIdAndUpdate(userID, {
    refreshToken: null,
    lastLogin: new Date(),
  });
};

export const refreshTokenHandler = async (request: Request, response: NextResponse) => {
  const token = (request as any).cookies?.get('refreshToken')?.value;
  if (!token) {
    return NextResponse.json(
      { success: false, message: 'No refresh token provided', code: 'REFRESH_TOKEN_MISSING' },
      { status: 401 }
    );
  }
  try {
    const payload: any = jwt.verify(token, config.JWT_REF_SECRECT);
    const user = await User.findOne({
      _id: payload.user.id,
      refreshToken: token,
      isActive: true,
    });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid or revoked token', code: 'REFRESH_TOKEN_INVALID' },
        { status: 401 }
      );
    }
    const newAccessToken = setAccessToken(response, user);
    const newRefreshToken = await setRefreshToken(response, user);
    return NextResponse.json({
      success: true,
      message: 'Tokens refreshed successfully',
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: config.JWT_ACC_EXPIRES_IN,
    });
  } catch (err) {
    console.error('Refresh token error:', err);
    return NextResponse.json(
      { success: false, message: 'Refresh token expired or invalid', code: 'REFRESH_TOKEN_EXPIRED' },
      { status: 401 }
    );
  }
};