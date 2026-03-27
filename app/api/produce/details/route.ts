// produce/details/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Produce from '@/model/produce.model';
import Farmer from '@/model/farmer.model'; // Import Farmer model
import { getCurrentUser } from '@/lib/auth/currentUser';
import { connectDB } from '@/lib/db';
import PERMISSIONS from '@/config/permissions.config';
 
export async function GET() {
  try {
    await connectDB();
 
    const produce = await Produce.find({})
      .populate('farmerId', 'userName fullName email avatar accountType') 
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
 
    // Use Next.js built-in formData() method
    const formData = await req.formData();
    
    // Extract fields from formData
    const name = formData.get('name') as string;
    const price = formData.get('price') as string;
    const unit = formData.get('unit') as string;
    const category = formData.get('category') as string;
    const stock = formData.get('stock') as string;
    const description = formData.get('description') as string;
    const isOrganic = formData.get('isOrganic') === 'true';
    const imageFile = formData.get('image') as File | null;

    // Debug logs
    console.log('=== RECEIVED FORM DATA ===');
    console.log('Name:', name);
    console.log('Price:', price);
    console.log('Unit:', unit);
    console.log('Category:', category);
    console.log('Stock:', stock);
    console.log('Description:', description);
    console.log('Is Organic:', isOrganic);
    console.log('Has Image:', !!imageFile);
    if (imageFile) {
      console.log('Image name:', imageFile.name);
      console.log('Image size:', imageFile.size);
      console.log('Image type:', imageFile.type);
    }

    // Validate required fields
    if (!name || name.trim() === '') {
      console.error('Missing name field');
      return NextResponse.json(
        { message: 'Name is required' },
        { status: 400 }
      );
    }
    
    if (!price || price.trim() === '') {
      console.error('Missing price field');
      return NextResponse.json(
        { message: 'Price is required' },
        { status: 400 }
      );
    }

    // Prepare produce data
    const produceData: any = {
      name: name.trim(),
      price: parseFloat(price),
      unit: unit || 'kg',
      category: category || 'Vegetables',
      stock: stock ? parseInt(stock) : 0,
      description: description || '',
      isOrganic: isOrganic || false,
      farmerId: user.id, // Reference to User model
    };

    // Handle image if uploaded (optional)
    if (imageFile) {
      // Convert file to base64 for temporary storage
      // In production, upload to Cloudinary or similar
      const bytes = await imageFile.arrayBuffer();
      const buffer = Buffer.from(bytes);
      produceData.img = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
      console.log('Image processed successfully');
    }

    console.log('Creating produce with data:', produceData);

    // Create the produce
    const produce = await Produce.create(produceData);
    
    // Update farmer's produce array (if Farmer model exists)
    try {
      await Farmer.findOneAndUpdate(
        { userId: user.id },
        { $push: { produce: produce._id } },
        { upsert: true }
      );
      console.log('Updated farmer produce array with ID:', produce._id);
    } catch (farmerError) {
      console.log('Note: Farmer model update skipped (may not exist yet)');
    }
 
    return NextResponse.json(
      { 
        success: true, 
        message: 'Produce created successfully', 
        produce 
      },
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