// produce/details/route.ts


import { NextRequest, NextResponse } from 'next/server';
import Produce from '@/model/produce.model';
import { getCurrentUser } from '@/lib/auth/currentUser';
import { connectDB } from '@/lib/db';
import PERMISSIONS from '@/config/permissions.config';
import upload from '@/services/mutler';
 
export async function GET() {
  try {
    await connectDB();
 
    const produce = await Produce.find({})
      .populate('farmerId', 'userName fullName email avatar accountType') // ✅ fixed: was 'userId'
      .sort({ createdAt: -1 });
 
    return NextResponse.json({
      success: true,
      count: produce.length,
      produce,
    });
 
  } catch (error: any) {
    console.error('Error fetching Produce:', error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || 'Failed to fetch Produce'
      },
      { status: 500 }
    );
  }
}
 
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getCurrentUser();
 
    if (!user) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
 
    if (!['farmer', 'admin'].includes(user.accountType || '')) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
 
    if (!PERMISSIONS[user.accountType || '']?.includes('create_produce')) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }
 
    const contentType = req.headers.get('content-type') || '';
    const produceData: Record<string, any> = {};
 
    if (contentType.includes('multipart/form-data')) {
      await new Promise((resolve, reject) => {
        upload.single('image')(req as any, {} as any, (err: any) => {
          if (err) return reject(err);
          resolve(true);
        });
      });
 
      const multerReq: any = req;
      if (multerReq.body?.name) produceData.name = multerReq.body.name;
      if (multerReq.body?.description) produceData.description = multerReq.body.description;
      if (multerReq.body?.price) produceData.price = parseFloat(multerReq.body.price);
      if (multerReq.body?.unit) produceData.unit = multerReq.body.unit;
      if (multerReq.body?.stock) produceData.stock = parseInt(multerReq.body.stock);
      if (multerReq.body?.category) produceData.category = multerReq.body.category;
      if (multerReq.body?.isOrganic) produceData.isOrganic = multerReq.body.isOrganic === 'true';
      if (multerReq.file) {
        produceData.img = multerReq.file.path;
        produceData.cloudinaryId = multerReq.file.filename;
      }
    }
 
    else if (contentType.includes('application/json')) {
      const body = await req.json();
      if (body.name) produceData.name = body.name;
      if (body.description) produceData.description = body.description;
      if (body.price !== undefined) produceData.price = parseFloat(body.price);
      if (body.unit) produceData.unit = body.unit;
      if (body.stock !== undefined) produceData.stock = parseInt(body.stock);
      if (body.category) produceData.category = body.category;
      if (body.isOrganic !== undefined) produceData.isOrganic = body.isOrganic;
      if (body.img) produceData.img = body.img;
      if (body.cloudinaryId) produceData.cloudinaryId = body.cloudinaryId;
    }
 
    if (!produceData.name || produceData.price === undefined) {
      return NextResponse.json(
        { message: 'Name and price are required' },
        { status: 400 }
      );
    }
 
    produceData.farmerId = user.id;
 
    const produce = await Produce.create(produceData);
 
    return NextResponse.json(
      { success: true, message: 'Produce created successfully', produce },
      { status: 201 }
    );
 
  } catch (error: any) {
    console.error('Create produce error:', error);
    return NextResponse.json(
      { message: error.message || 'Server error' },
      { status: 500 }
    );
  }
}
 