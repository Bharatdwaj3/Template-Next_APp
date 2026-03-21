import { NextResponse } from 'next/server';
import Buyer from '@/model/buyer.model';
import { connectDB } from '@/lib/db';
import PERMISSIONS from '@/config/permissions.config';
import { getCurrentUser } from '@/lib/auth/currentUser';

export async function GET() {
  await connectDB();
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const allowed = PERMISSIONS[user.accountType] || [];
  if (!allowed.includes('list_buyers')) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const buyers = await Buyer.find({}).lean();
    return NextResponse.json({ success: true, buyers }, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}