import { NextResponse } from "next/server";
import {clearAuthCookies, revokeRefreshToken} from '@/middleware/token.dbMiddleware';

async function getUserFromRequest(request){
    return null;
}

export async function POST(request){
    try{
        const user=await getUserFromRequest(request);
        if(user?.id){
            await revokeRefreshToken(user.id);
        }
        const response=NextResponse.json({
            success: true,
            message: 'User logged out successfully',
            code: 'LOGOUT_SUCCESS'
        });
        clearAuthCookies(response);
        return response;
    }catch(err){
        console.log('Logout error',err);
        return NextResponse.json(
            {
                success: false,
                message: 'Logout failed',
                code: 'LOGOUT_FAILED'
            },
            {
                status: 500
            }
        );
    }
}
