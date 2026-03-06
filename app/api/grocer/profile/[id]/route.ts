import { NextRequest, NextResponse } from "next/server";
import Grocer from '@/model/grocer.model';
import { getCurrentUser } from "@/lib/auth/currentUser";
import { connectDB }      from '@/lib/db';
import PERMISSIONS from "@/config/permissions.config";

export async function PUT(request:NextRequest, {params}:{params:{id:string}}){
    await connectDB();
    
    const user=await getCurrentUser(request);
    if(!user) return NextResponse.json({message: 'Unathorized'},{status:401});
    
    const allowedRoles=['grocer', 'admin'];
    if(!allowedRoles.includes(user.accountType)){
        return NextResponse.json({message: 'Forbidden'},{status: 403});
    }
    if(!PERMISSIONS[user.acccountType]?.includes('update_grocer')){
        return NextResponse.json({message: 'Forbidden'},{status: 403});
    }
    if(user.id!==params.id&&user.accountType!=='admin'){
        return NextResponse.json({message:'Forbidden'},{status:403});
    }
    try{
        const formData=await request.formData();
        const bio=formData.get('bio') as string;
        const interests=formData.getAll('interests') as string[];
        const image=formData.get('image') as File | null;

        const updateData:  Record<string, unknown>={};
        if(bio) updateData.bio=bio;
        if(interests?.length) updateData.interests=interests;
        if (image && image.size > 0) {
      updateData.mediaUrl = 'https://placeholder.com/uploaded.jpg';
    }
    const updated=await Grocer.findOneAndUpdate(
        {userId: params.id},
        updateData,
        {new : true, runValidators: true}
    );
    if(!updated){
        return NextResponse.json({message: 'Profile not found'},{status : 404});
    }
    return NextResponse.json({ success: true, grocer: updated });
    }catch(err){
        console.log(err);
        return NextResponse.json({message:'Server error'},{status: 500})
    }
}