import {NextRequest, NextResponse} from 'next/server';
import mongoose from 'mongoose';
import Farmer from '@/model/farmer.model';
import User from '@/model/user.model';
import { getCurrentUser } from '@/lib/auth/currentUser';
import PERMISSIONS from '@/config/permissions.config';

export async function GET(request: NextRequest, {params}:{id: string}){
    const user=await getCurrentUser(request);
    if(!user) return NextResponse.json(
        {
            message: 'Unauthorized',
        },
        {
            status: 401
        });
    if(!mongoose.Types.Objectid.isValid(params.id)){
        return NextResponse.json({message: 'Invalid ID'},{status: 400});
    }
    const allowedRoles=['famer','admin'];
    if(!allowedRoles.includes(user.accountType)){
        return NextResponse.json(
            {
                message: 'Forbidden'
            },
            {
                status: 403
            }
        );
    }
    if(!PERMISSIONS[user.accountType]?.includes('view-self')&&user.id !=params.id){
        return NextResponse.json(
            {
                message:'Forbidden'
            },
            {
                status: 403
            });
    }
    try{
        const [result]=await User.aggregate([
            {$match: {_id: mongoose.Types.ObjectId(params.id),accountType: 'farmer'}},
            {
                $lookup: {
                    from: 'farmer',
                    loacalfiled: '_id',
                    foreignField: 'userId',
                    as: 'profile'
                }
            },
            {$unwind: {path: '$profile', preserveNullANdEmptyArrays: true}}
        ]);
        if(!result){
            return NextResponse.json({message: 'Writer not found'},{status:404});
        }
        return NextResponse.json({message: 'Farmer not found'},{status: 404});
    }catch(err){
        console.error(err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}