import { NextResponse } from 'next/server';
import Buyer from '@/model/buyer.model';
import { connectDB } from '@/lib/db';

export async function GET() {
  try {
  
    await connectDB();

    const buyers = await Buyer.find({})
      .populate('userId', 'userName fullName email avatar accountType')
      .sort({ createdAt: -1 }); 

    return NextResponse.json({
      success: true,
      count: buyers.length,
      buyers,
    });

  } catch (error: any) {
    console.error('Error fetching buyers:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to fetch buyers' 
      },
      { status: 500 }
    );
  }
}