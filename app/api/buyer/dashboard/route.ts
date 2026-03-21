import { NextResponse } from 'next/server';
import Buyer from '@/model/buyer.model';
import { getCurrentUser } from '@/lib/auth/currentUser';
import { connectDB } from '@/lib/db';

export async function GET() {
  await connectDB();
  const currentUser = await getCurrentUser();
  if (!currentUser) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  if (currentUser.accountType !== 'buyer') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const buyer = await Buyer.findOne({ userId: currentUser.id })
      .populate('savedProduce', 'name price unit img isOrganic');

    if (!buyer) {
      return NextResponse.json({
        success: true,
        dashboard: {
          stats: [
            { label: 'Saved Items', value: '0' },
            { label: 'Following',   value: '0' },
            { label: 'Followers',   value: '0' },
          ],
          savedProduce: [],
        },
      });
    }

    return NextResponse.json({
      success: true,
      dashboard: {
        stats: [
          { label: 'Saved Items', value: String(buyer.savedProduce.length) },
          { label: 'Following',   value: String(buyer.following.length) },
          { label: 'Followers',   value: String(buyer.followers.length) },
        ],
        savedProduce: buyer.savedProduce,
      },
    });
  } catch (err) {
    console.error('buyer dashboard error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}