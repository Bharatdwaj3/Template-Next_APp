import { NextRequest, NextResponse } from "next/server";
import Grocer from '@/model/grocer.model'
import PERMISSIONS from '@/config/permissions.config';
import { getCurrentUser } from '@/lib/auth/currentUser';

export async function GET(request: NextRequest){
    const user=await getCurrentUser(request);
        if(!user) return NextResponse.json({
            message: 'Unathorized'
        },
        {
            status : 401
        });
    const allowed=PERMISSIONS[user.accountType] || [];
    if(!allowed.includes('list_grocers')){
        return NextResponse.json(
            {
                message: 'Forbidden'
            }
            ,
            {
                status: 403
            }
        );
        try{
            const grocers=await Grocer.find({}).lean();
            return NextResponse.json(grocers,{
                status: 200
            });
        }catch(err){
            return NextResponse.json({message: 'Server Error',err},{status: 500});
        }
    }
}