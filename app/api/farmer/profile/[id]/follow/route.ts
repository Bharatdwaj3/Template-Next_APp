// api/farmer/profile/[id]/follow/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Farmer from '@/model/farmer.model';
import Grocer from '@/model/grocer.model';
import Buyer from '@/model/buyer.model';
import { getCurrentUser } from '@/lib/auth/currentUser';
import { connectDB } from '@/lib/db';
import { Types } from 'mongoose';

// Helper to get the correct Model based on user type
function getProfileModel(accountType?: string) {
  switch (accountType?.toLowerCase()) {
    case 'grocer': return Grocer;
    case 'buyer': return Buyer;
    default: return Farmer;
  }
}

// GET: Fetch follow status and counts
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  const currentUser = await getCurrentUser();

  try {
    const targetFarmer = await Farmer.findOne({ userId: new Types.ObjectId(id) });
    if (!targetFarmer) {
      return NextResponse.json({ success: false, message: 'Farmer not found' }, { status: 404 });
    }

    const followingCount = targetFarmer.following?.length || 0;
    let isFollowing = false;

    if (currentUser) {
      const ProfileModel = getProfileModel(currentUser.accountType);
      const currentUserProfile = await ProfileModel.findOne({ userId: new Types.ObjectId(currentUser.id) });
      
      if (currentUserProfile) {
        isFollowing = currentUserProfile.following?.some(
          (fid: Types.ObjectId) => fid.toString() === id
        ) || false;
      }
    }

    return NextResponse.json({
      success: true,
      isFollowing,
      followerCount: targetFarmer.followers?.length || 0,
      followingCount,
    });
  } catch (error: unknown) {
    console.error('Follow status error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// POST: Follow (BIDIRECTIONAL UPDATE)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
  if (currentUser.id === id) return NextResponse.json({ success: false, message: 'Cannot follow yourself' }, { status: 400 });

  try {
    // 1. Update TARGET farmer's followers
    const targetFarmer = await Farmer.findOne({ userId: new Types.ObjectId(id) });
    if (!targetFarmer) return NextResponse.json({ success: false, message: 'Farmer not found' }, { status: 404 });

    if (!targetFarmer.followers) targetFarmer.followers = [];
    if (!targetFarmer.followers.some((fid: Types.ObjectId) => fid.toString() === currentUser.id)) {
      targetFarmer.followers.push(new Types.ObjectId(currentUser.id));
      await targetFarmer.save();
    }

    // 2. Update CURRENT USER's following
    const ProfileModel = getProfileModel(currentUser.accountType);
    const currentUserProfile = await ProfileModel.findOne({ userId: new Types.ObjectId(currentUser.id) });
if (!currentUserProfile) {
  return NextResponse.json(
    { success: false, message: 'Your profile was not found. Cannot update following.' },
    { status: 404 }
  );
}
    if (currentUserProfile) {
      if (!currentUserProfile.following) currentUserProfile.following = [];
      if (!currentUserProfile.following.some((fid: Types.ObjectId) => fid.toString() === id)) {
        currentUserProfile.following.push(new Types.ObjectId(id));
        await currentUserProfile.save();
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Followed successfully',
      followerCount: targetFarmer.followers.length,
      followingCount: currentUserProfile?.following?.length || 0,
    });
  } catch (error: unknown) {
    console.error('Follow error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// DELETE: Unfollow (BIDIRECTIONAL UPDATE)
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const { id } = await params;
  const currentUser = await getCurrentUser();

  if (!currentUser) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });

  try {
    // 1. Update TARGET farmer's followers
    const targetFarmer = await Farmer.findOne({ userId: new Types.ObjectId(id) });
    if (!targetFarmer) return NextResponse.json({ success: false, message: 'Farmer not found' }, { status: 404 });

    if (targetFarmer.followers) {
      targetFarmer.followers = targetFarmer.followers.filter(
        (fid: Types.ObjectId) => fid.toString() !== currentUser.id
      );
      await targetFarmer.save();
    }

    // 2. Update CURRENT USER's following
    const ProfileModel = getProfileModel(currentUser.accountType);
    const currentUserProfile = await ProfileModel.findOne({ userId: new Types.ObjectId(currentUser.id) });

    if (currentUserProfile && currentUserProfile.following) {
      currentUserProfile.following = currentUserProfile.following.filter(
        (fid: Types.ObjectId) => fid.toString() !== id
      );
      await currentUserProfile.save();
    }

    return NextResponse.json({
      success: true,
      message: 'Unfollowed successfully',
      followerCount: targetFarmer.followers.length,
      followingCount: currentUserProfile?.following?.length || 0,
    });
  } catch (error: unknown) {
    console.error('Unfollow error:', error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}