import { NextRequest, NextResponse } from 'next/server';
import Produce from '@/model/produce.model';
import { getCurrentUser } from '@/lib/auth/currentUser';
import PERMISSIONS from '@/config/permissions.config';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const produce = await produce.findById(params.id)
      .populate('author', 'fullName userName avatar accountType');

    if (!Produce) {
      return NextResponse.json({ message: 'Produce not found' }, { status: 404 });
    }

    return NextResponse.json(Produce, { status: 200 });
  } catch (err) {
    console.error('Get Produce error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const allowed = PERMISSIONS[user.accountType] || [];
  if (!allowed.includes('update_Produce')) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const formData = await request.formData();

    const title       = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category    = formData.get('category') as string;
    const mediaType   = formData.get('mediaType') as string;
    const image       = formData.get('image') as File | null;

    const updates: any = {};
    if (title)       updates.title = title;
    if (description) updates.description = description;
    if (category)    updates.category = category;
    if (mediaType)   updates.mediaType = mediaType;

    if (image && image.size > 0) {
      updates.mediaUrl = 'https://via.placeholder.com/updated-Produce.jpg';
    }

    const updated = await Produce.findByIdAndUpdate(params.id, updates, {
      new: true,
      runValidators: true
    });

    if (!updated) {
      return NextResponse.json({ message: 'Produce not found' }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    console.error('Update Produce error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const user = await getCurrentUser(request);
  if (!user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const allowed = PERMISSIONS[user.accountType] || [];
  if (!allowed.includes('delete_Produce')) {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
  }

  try {
    const deleted = await Produce.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ message: 'Produce not found' }, { status: 404 });
    }


    return NextResponse.json({ message: 'Produce deleted successfully' }, { status: 200 });
  } catch (err) {
    console.error('Delete Produce error:', err);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}