//farmer/route.ts

import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Farmer from '@/model/farmer.model';
import User from '@/model/user.model';
import { getCurrentUser } from '@/lib/auth/currentUser';
import { connectDB } from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;

  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (currentUser.id !== id) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json({ message: 'Invalid ID' }, { status: 400 });
  }

  try {
    const [result] = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id), accountType: 'farmer' } },
      {
        $lookup: {
          from:         'farmers',          
          localField:   '_id',
          foreignField: 'userId',
          as:           'profile',
        },
      },
      { $unwind: { path: '$profile', preserveNullAndEmptyArrays: true } },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              {
                _id:         '$_id',
                userName:    '$userName',
                fullName:    '$fullName',
                email:       '$email',
                accountType: '$accountType',
                avatar:      '$avatar',
                lastLogin:   '$lastLogin',
                createdAt:   '$createdAt',
              },
              { $ifNull: ['$profile', {}] },  
            ],
          },
        },
      },
      { $project: { password: 0, refreshToken: 0 } },
    ]);

    if (!result) return NextResponse.json({ message: 'Farmer not found' }, { status: 404 }); // ✅ Updated message

    return NextResponse.json({ success: true, farmer: result }); 
  } catch (err) {
    console.error('Get farmer error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  await connectDB();
  const { id } = await params;

  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (currentUser.id !== id) return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  try {
    await User.findByIdAndDelete(id);
    await Farmer.findOneAndDelete({ userId: id }); // ✅ Changed Buyer to Farmer
    return NextResponse.json({ success: true, message: 'Farmer account deleted' }); // ✅ Updated message
  } catch (err) {
    console.error('Delete farmer error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}