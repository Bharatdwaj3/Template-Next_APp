//grocer/profile/route.ts

import { NextResponse } from 'next/server';
import Grocer from '@/model/grocer.model';
import { connectDB } from '@/lib/db';

export async function GET() {
  try {
  
    await connectDB();

    const Grocers = await Grocer.find({})
      .populate('userId', 'userName fullName email avatar accountType')
      .sort({ createdAt: -1 }); 

    return NextResponse.json({
      success: true,
      count: Grocers.length,
      Grocers,
    });

  } catch (error: any) {
    console.error('Error fetching Grocers:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to fetch Grocers' 
      },
      { status: 500 }
    );
  }
}