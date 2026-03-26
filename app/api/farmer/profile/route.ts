//farmer/profile/route.ts

import { NextResponse } from 'next/server';
import Farmer from '@/model/farmer.model';
import { connectDB } from '@/lib/db';

export async function GET() {
  try {
  
    await connectDB();

    const farmers = await Farmer.find({})
      .populate('userId', 'userName fullName email avatar accountType')
      .sort({ createdAt: -1 }); 

    return NextResponse.json({
      success: true,
      count: farmers.length,
      farmers,
    });

  } catch (error: any) {
    console.error('Error fetching Farmers:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || 'Failed to fetch Farmers' 
      },
      { status: 500 }
    );
  }
}