import { NextResponse } from "next/server";
import User from '@/models/user.model';
import { getAuthenticatedUser } from '@/lib/auth';


export async function GET(request){
    try{
        const currentUser=await getAuthenticatedUser(request);
        if(!currentUser){
            return NextResponse.json(
                {
                    success: false,
                    message: 'Not Authenticated',
                    code: 'AUTH_REQUIRED'
                },
                {
                    status: 401
                }
            );
        }
        const profile=await User.findById(currentUser.id)
            .select('-password -accountType -refreshToekn -googleID -discordId');
        if(!profile){
            return NextResponse.json(
                {
                    success: false,
                    message: 'User not found',
                    code: 'USER_NOT_FOUND'
                },
                {
                    status: 404
                }
            );
        }
        return NextResponse.json({
            success: true,
            message: 'Welcome to your dashboard!',
            user: {
                id: profile._id,
                userName: profile.userName,
                fullName: profile.fullName,
                email: profile.email,
                accountType: currentUser.accountType,
                avatar: profile.avatar,
                isActive: profile.isActive,
                createdAt: profile.createdAt,
                updatedAt: profile.updatedAt,
                lastLogin: profile.lastLogin
            }
        });
    }catch(err){
        console.log(err);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}