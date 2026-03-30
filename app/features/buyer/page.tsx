// app/api/buyer/profile/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Buyer from '@/model/buyer.model';
import User from '@/model/user.model';
import { getCurrentUser } from '@/lib/auth/currentUser';
import { connectDB } from '@/lib/db';
import PERMISSIONS from '@/config/permissions.config';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const buyer = await Buyer.findOne({ userId: id })
      .populate('userId', 'userName fullName email avatar accountType');
      
    if (!buyer) {
      return NextResponse.json({ message: 'Buyer profile not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, buyer });
  } catch (error: any) {
    console.error('Get buyer error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  const user = await getCurrentUser();
  
  if (!user) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!['buyer', 'admin'].includes(user.accountType || '')) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  if (!PERMISSIONS[user.accountType || '']?.includes('update_buyer')) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  if (user.id !== id && user.accountType !== 'admin') {
    return NextResponse.json(
      { message: 'You can only update your own profile' },
      { status: 403 }
    );
  }

  const updateData: Record<string, any> = {};
  const contentType = req.headers.get('content-type') || '';

  try {
    if (contentType.includes('application/json')) {
      const body = await req.json();
      
      if (body.bio) updateData.bio = body.bio;
      if (body.location) updateData.location = body.location;
      if (body.savedProduce) updateData.savedProduce = body.savedProduce;
      if (body.likedProduce) updateData.likedProduce = body.likedProduce;
      if (body.followers) updateData.followers = body.followers;
      if (body.following) updateData.following = body.following;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: 'No data provided to update' },
        { status: 400 }
      );
    }

    const updated = await Buyer.findOneAndUpdate(
      { userId: id },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
        upsert: true,
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Buyer profile updated successfully',
      buyer: updated,
    });
  } catch (error: any) {
    console.error('Error:', error?.message || error);
    return NextResponse.json(
      { message: error?.message || 'Server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (currentUser.id !== id && currentUser.accountType !== 'admin') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    await User.findByIdAndDelete(id);
    await Buyer.findOneAndDelete({ userId: id });
    return NextResponse.json({ success: true, message: 'Buyer account deleted successfully' });
  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}