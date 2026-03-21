import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Grocer from '@/model/grocer.model';
import User from '@/model/user.model';
import { getCurrentUser } from '@/lib/auth/currentUser';
import { connectDB } from '@/lib/db';
import PERMISSIONS from '@/config/permissions.config';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ message: 'Invalid ID format' }, { status: 400 });
  }

  try {
    const [result] = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(params.id), accountType: 'grocer' } },
      {
        $lookup: {
          from:         'grocers',
          localField:   '_id',
          foreignField: 'userId',
          as:           'profile',
        },
      },
      { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
      { $project: { password: 0, refreshToken: 0 } },
    ]);

    if (!result) return NextResponse.json({ message: 'Grocer not found' }, { status: 404 });
    return NextResponse.json({ success: true, grocer: { ...result, profile: result.profile || {} } });
  } catch (err) {
    console.error('Get grocer error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const allowed = PERMISSIONS[user.accountType] || [];
  if (!allowed.includes('delete_grocer')) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const deleted = await Grocer.findByIdAndDelete(params.id);
    if (!deleted) return NextResponse.json({ message: 'Grocer not found' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Grocer deleted', deletedGrocerId: deleted._id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}