import { NextRequest, NextResponse } from "next/server";
import Grocer from '@/model/grocer.model';
import { getCurrentUser } from "@/lib/auth/currentUser";
import PERMISSIONS from "@/config/permissions.config";

export async function PUT(request:NextRequest, {params}:{params:{id:string}}){
    const user=await getCurrentUser(request);
    if(!user) return NextResponse.json({message: 'Unathorized'},{status:401});
    const allowedRoles=['Grocer', 'admin'];
    if(!allowedRoles.includes(user.accountType)){
        return NextResponse.json({message: 'Forbidden'},{status: 403});
    }
    if(!PERMISSIONS[user.acccountType]?.includes('update_writer')){
        return NextResponse.json({message: 'Forbidden'},{status: 403});
    }
    if(user.id!==params.id&&user.accountType!=='admin'){
        return NextResponse.json({message:'Forbidden'},{status:403});
    }
    try{
        const formData=await request.formData();
        const bio=formData.get('bio') as string;
        const intrests=formData.getAll('intrests') as string[];
        const image=formData.get('image') as File | null;

        const updateData: any={};
        if(bio) updateData.bio=bio;
        if(intrests?.length) updateData.intrests=intrests;
        if (image && image.size > 0) {
      updateData.mediaUrl = 'https://placeholder.com/uploaded.jpg';
    }
    const updated=await Grocer.findoneAndUpdate(
        {userId: params.id},
        updateData,
        {new : true, runValidators: true}
    );
    if(!updated){
        return NextResponse.json({message: 'Profile not found'},{status : 404});
    }
    }catch(err){
        console.log(err);
        return NextResponse.json({message:'Server error'},{status: 500})
    }
}