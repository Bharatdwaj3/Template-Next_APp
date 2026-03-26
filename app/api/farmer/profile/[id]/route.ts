//farmer/profile/id/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Farmer from '@/model/farmer.model';
import User from '@/model/user.model';
import { getCurrentUser } from '@/lib/auth/currentUser';
import { connectDB } from '@/lib/db';
import PERMISSIONS from '@/config/permissions.config';
import upload from '@/services/mutler';
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
    const farmer = await Farmer.findOne({ userId: id })
      .populate('userId', 'userName fullName email avatar accountType');

    if (!farmer) {
      return NextResponse.json({ message: 'Farmer profile not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, farmer });
  } catch (error: any) {
    console.error('Get farmer error:', error);
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
  if (!['farmer', 'admin'].includes(user.accountType || '')) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }
  if (!PERMISSIONS[user.accountType || '']?.includes('update_farmer')) {
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
    if (contentType.includes('multipart/form-data')) {
      await new Promise((resolve, reject) => {
        upload.single('image')(
          req as any,
          {} as any,
          (err: any) => {
            if (err) return reject(err);
            resolve(true);
          }
        );
      });

      const multerReq: any = req;
      
      if (multerReq.body?.bio) updateData.bio = multerReq.body.bio;
      if (multerReq.body?.interests) updateData.interests = JSON.parse(multerReq.body.interests);
      if (multerReq.body?.farmType) updateData.farmType = JSON.parse(multerReq.body.farmType);
      if (multerReq.body?.produce) updateData.produce = JSON.parse(multerReq.body.produce);
      if (multerReq.body?.location) updateData.location = JSON.parse(multerReq.body.location);
      if (multerReq.body?.followers) updateData.followers = JSON.parse(multerReq.body.followers);
      if (multerReq.body?.following) updateData.following = JSON.parse(multerReq.body.following);
      if (multerReq.file) {
        updateData.mediaUrl = multerReq.file.path;
        updateData.cloudinaryId = multerReq.file.filename;
      }
    } 
    else if (contentType.includes('application/json')) {
      const body = await req.json();
      
      if (body.bio) updateData.bio = body.bio;
      if (body.interests) updateData.interests = body.interests;
      if (body.farmType) updateData.farmType = body.farmType;
      if (body.produce) updateData.produce = body.produce;
      if (body.location) updateData.location = body.location;
      if (body.followers) updateData.followers = body.followers;
      if (body.following) updateData.following = body.following;
      if (body.mediaUrl) updateData.mediaUrl = body.mediaUrl;
      if (body.cloudinaryId) updateData.cloudinaryId = body.cloudinaryId;
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: 'No data provided to update' },
        { status: 400 }
      );
    }

    const updated = await Farmer.findOneAndUpdate(
      { userId: id },
      { $set: updateData },
      {
        new: true,           
        runValidators: true,
        upsert: true,        
      }
    );

    const wasCreated = (updated as any).isNew;
    const message = wasCreated 
      ? 'Farmer profile created successfully' 
      : 'Farmer profile updated successfully';

    return NextResponse.json({
      success: true,
      message,
      farmer: updated,
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
    await Farmer.findOneAndDelete({ userId: id });
    return NextResponse.json({ success: true, message: 'Account deleted successfully' });
  } catch (error: any) {
    console.error('Delete error:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}