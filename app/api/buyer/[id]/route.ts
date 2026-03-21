import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Buyer from '@/model/buyer.model';
import User from '@/model/user.model';
import { getCurrentUser } from '@/lib/auth/currentUser';
import { connectDB } from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (currentUser.id !== params.id) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  if (!mongoose.Types.ObjectId.isValid(params.id)) {
    return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
  }

  try {
    const [result] = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(params.id), accountType: 'buyer' } },
      {
        $lookup: {
          from:         'buyers',
          localField:   '_id',
          foreignField: 'userId',
          as:           'profile',
        },
      },
      { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
      { $project: { password: 0, refreshToken: 0 } },
    ]);

    if (!result) return NextResponse.json({ message: 'Buyer not found' }, { status: 404 });

    return NextResponse.json({
      success: true,
      buyer: {
        id:          result._id,
        userName:    result.userName,
        fullName:    result.fullName,
        email:       result.email,
        accountType: result.accountType,
        avatar:      result.avatar,
        createdAt:   result.createdAt,
        lastLogin:   result.lastLogin,
        profile:     result.profile || {},
      },
    });
  } catch (err) {
    console.error('Get buyer error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (currentUser.id !== params.id) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  try {
    await User.findByIdAndDelete(params.id);
    await Buyer.findOneAndDelete({ userId: params.id });
    return NextResponse.json({ success: true, message: 'Account deleted' });
  } catch (err) {
    console.error('Delete buyer error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}