import jwt from "jsonwebtoken";
import User from '../models/user.model.js';
import { JWT_ACC_SECRECT, JWT_ACC_EXPIRES_IN, JWT_REF_SECRECT, JWT_REF_EXPIRES_IN } from "../config/env.config.js";


const cookieOpts=(maxAge, path='/')=>({
    httpOnly: true,
    secure: process.env.NODE_ENV=='production',
    sameSite: process.env.NODE_ENV=='production' ? 'none' : 'lax',
    path,
    maxAge: maxAge*1000
});

const setAccessToken=(res, user)=>{
    const payload={
        user: {
            id: user._id.toString(),
            accountType: user.accountType
        }
    };
    const token = jwt.sign(payload, JWT_ACC_SECRECT, {expiresIn: JWT_ACC_EXPIRES_IN});
    res.cookie('accessToken', token, cookieOpts(15*60));
    return token;
};

const setRefreshToken=async (res, user)=>{
    const payload={user: {id: user._id.toString()}};
    const token = jwt.sign(payload, JWT_REF_SECRECT, {expiresIn: JWT_REF_EXPIRES_IN});
    
    await User.findByIdAndUpdate(user._id, {
        refreshToken: token,
        lastLogin: new Date()
    });

    const refreshExpiry=JWT_REF_EXPIRES_IN==='7d' ? 7*24*60*60: parseInt(JWT_REF_EXPIRES_IN);
    res.cookie('refreshToken', token, cookieOpts(refreshExpiry, '/'));
    return token;
};

const clearAuthCookies=(res)=>{

    const opts=cookieOpts(0);
    const refreshOpts=cookieOpts(0, '/');

    res.clearCookie('accessToken', {...opts, path: '/'});
    res.clearCookie('refreshToken', {...refreshOpts, path: '/'});
};

const revokeRefreshToken=async(userID)=>{
    if(!userID) return;
    await User.findByIdAndUpdate(userID, {
        refreshToken: null, 
        lastLogin: new Date()
    });
}

const refreshTokenHandler=async(req, res)=>{
    const token=req.cookies.refreshToken;
    if(!token){
        return res.status(401).json({
            success: false,
            message: 'No refresh token provided',
            code: 'REFRESH_TOKEN_MISSING'
        });
    }
    try{
        const payload=jwt.verify(token, JWT_REF_SECRECT);
        const user=await User.findOne({
            _id: payload.user.id,
            refreshToken:  token,
            isActive: true
        });
        if(!user){
            return res.status(401).json({
                success: false,
                message: 'Invalid or revoked refresh token',
                code: 'REFRESH_TOKEN_INVALID'
            });
        }
        const newAccessToken=setAccessToken(res, user);
        const newRefreshToken=await setRefreshToken(res, user);

        res.json({
            success:true,
            message: 'Tokens refreshed successfully',
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            expiresIn: JWT_ACC_EXPIRES_IN
        });
    }catch(error){
        console.error('Refresh token error: ', error);
        res.status(401).json({
            success: false,
            message: 'Refresh token expired or invalid',
            code: 'REFRESH_TOKEN_EXPIRED'
        });
    }
};



export {
  setAccessToken,
  setRefreshToken,
  clearAuthCookies,
  revokeRefreshToken,
  refreshTokenHandler,
  cookieOpts
};
