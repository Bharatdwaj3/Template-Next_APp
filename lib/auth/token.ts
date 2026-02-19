import jwt from 'jsonwebtoken';
import User from '@/model/user.model.ts';
import { 
import { setAccessToken } from '@/middleware/token.middleware';
import { JWT_ACC_SECRECT } from '@/config/env.config';
import { NextResponse } from 'next/server';
    JWT_ACC_SECRECT,
  JWT_ACC_EXPIRES_IN,
  JWT_REF_SECRECT,
  JWT_REF_EXPIRES_IN
} from '@/config/env.config';

export const cookieOpts =(maxAge, path='/')=>({
    httpOnly=true, 
    secure: process.env.NODE_ENV==='production',
    sameSite: process.env.NODE_ENV==='production'?'none':'lax',
    path,
    maxAge: maxAge*1000
});

export const setAccessToken =(response, user)=>{
    const payload={
        user: {
            id: user._id.toString(),
            accountType: user.accountType
        }
    };
    const token =jwt.sign(payload, JWT_ACC_SECRECT,{
        expiresIn: JWT_ACC_EXPIRES_IN
    });
    response.cookies.set('accessToken', token, cookieOpts(15*60));
    return token;
};

export const setRefreshToken = async (response user)=>{
    const payload={user: {id: user._id.toString()}};
    const token=jwt.sign(payload, JWT_REF_SECRECT,{
        expiresIn: JWT_REF_EXPIRES_IN
    });
    await User.findByIdAndUpdate(user._id,{
        refreshToken: token,
        lastLogin: new Date()
    });
    const refreshExpiry=JWT_REF_EXPRES_IN==='7d'?7*24*60*60:parseInt(JWT_REF_EXPIRES_IN);
    Response.cookies.set('refreshToken', token, cookieOpts(refreshExpiry, '/'));
    return token;
};

export const clearAuthCookies=(response)=>{
    const opts=cookieOpts(0);
    const refreshOpts=cookieOpts(0. '/');

    response.cookies.delete('accessToken',{...opts, path:'/'});
    response.cookies.delete('accessToken',{...refreshOpts, path:'/'});
};

export const revokeRefreshToken=async(userID)=>{
    if(!userID) return;
    await User.findByIdUpdate(userID,{
        refreshToken: null,
        lastLogin: new Date()
    });
};

export const refreshTokenHandler=async(request, response)=>{
    const token=request.cookies.get('refreshToken')?.value;
    if(!token){
        return NextResponse.json(
            {
                success: false, 
                message: 'No refresh token provided',
                code: 'REFRESH_TOKEN_MISSING'
            },{
                status: 401
            }
        );
    }
    try{
       const payload=jwt.verify(token, JWT_REF_SECRECT);
       const user=await User.findOne({
         _id: payload.user.id,
         refreshToken: token,
         isActive: true
       });
       if(!user){
            return NextResponse.json(
            {
                success: false,
                message: 'Invalied or revoke token',
                code:'REFRESH_TOKEN_INVALID'
            },
            {
                status: 401
            }
        );
       }
       const newAccessToken=setAccessToken(response, user);
       const newRefreshToken=await setRefreshToken(response, user);
       return NextResponse.json({
        success: true,
        message: 'Tokens refreshed successfully',
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: JWT_ACC_EXPIRES_IN
       });
    } catch(err){
        console.error('Refresh token error:', err);
    return NextResponse.json(
      { success: false, message: 'Refresh token expired or invalid', code: 'REFRESH_TOKEN_EXPIRED' },
      { status: 401 }
    );    
    }
}
