import { NextRequest, NextResponse } from "next/server";
import Farmer from "@/model/farmer.model";
import { getCurrentUser } from "@/lib/auth/currentUser";
import PERMISSIONS from "@/config/permissions.config";

export async function GET(request: NextRequest){
    const user=await getCurrentUser(request);
    if(!user){
        return NextResponse.json({message: 'Unauthorized'},{status: 401});
    }
    const role=user?.accountType;
    const allowed = PERMISSIONS[role] || [];
    if(!allowed.includes('view_farmers')){
        return NextResponse.json({message: 'Forbidden'},{status: 403});
    }
    try{
        const farmers  = await Farmer.find({}).lean();
        return NextResponse.json(farmers,{status: 200});    
    }catch(err){
        console.log(err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}
