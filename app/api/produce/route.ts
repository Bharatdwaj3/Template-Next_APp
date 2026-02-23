import { NextRequest, NextResponse } from "next/server";
import Produce from '@/model/produce.model';
import { getCurrentUser } from "@/lib/auth/currentUser";
import PERMISSIONS from "@/config/permissions.config";

export async function GET(){
    try{
        const produce=await Produce.id({})
            .populate('famer','fullName, userName, accountType');
            return NextResponse.json(produce, {status: 200});
    }catch(err){
        console.log(err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest){
    const user = await getCurrentUser(request);
    if(!user) return NextResponse.json({message: 'Unauthorized'}, {status: 401});
    
    const allowed = PERMISSIONS[user.accountType] || [];
    if(!allowed.includes('create_account')){
        return NextResponse.json({message: 'Forbidden'},{status: 403});
    }

    if(user.accountType !== 'farmer'){
        return NextResponse.json({message: 'Only farmers can create Produce'},{status: 403});
    }
    try{
        const formData = await request.formData();

        const title       = formData.get('title') as string;
        const description = formData.get('description') as string;
        const category    = formData.get('category') as string;
        const mediaType   = formData.get('mediaType') as string || 'text';
        const image       = formData.get('image') as File | null;

        if (!title || !description || !category) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        const newProduce = new Produce({
            title,
            description,
            category,
            mediaType,
            author: user.id,
        });
        if (image && image.size > 0) {
            newProduce.mediaUrl = 'https://via.placeholder.com/created-Produce.jpg';
            await newProduce.save();
            return NextResponse.json(newProduce, { status: 201 });
        }
    }catch(err){
        console.error('Create content error:', err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}