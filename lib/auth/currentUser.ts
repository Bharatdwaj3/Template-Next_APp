// utils/auth/currentUser.js    ← adapted from auth.middleware.js
import jwt from 'jsonwebtoken';
import User from '@/model/user.model';
import { config } from '@/config/env';

export async function getCurrentUser(request) {
  const token = request.cookies.get('accessToken')?.value;

  if (!token) {
    return null;
  }

  try {
    const payload = jwt.verify(token, config.JWT_ACC_SECRECT);
    const user = await User.findById(payload.user.id).select('isActive accountType');

    if (!user || !user.isActive) {
      return null;
    }

    return {
      id: payload.user.id,
      accountType: user.accountType
    };
  } catch (err) {
    console.warn('JWT verification failed:', err.message);
    return null;
  }
}