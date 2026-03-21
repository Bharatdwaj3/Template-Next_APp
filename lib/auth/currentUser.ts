import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import User from '@/model/user.model';
import { config } from '@/config/env';
import { connectDB } from '@/lib/db';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) return null;

  try {
    await connectDB();
    const payload: any = jwt.verify(token, config.JWT_ACC_SECRECT);
    const user = await User.findById(payload.user.id).select('isActive accountType');

    if (!user || !user.isActive) return null;

    return {
      id:          payload.user.id,
      accountType: user.accountType as string,
    };
  } catch (err: any) {
    console.warn('JWT verification failed:', err.message);
    return null;
  }
}