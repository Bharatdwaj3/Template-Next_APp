import { NextResponse } from "next/server";
import bcrypt from 'bcryptjs'
import User from '@/model/user.model';
import { setAccessToken, setRefreshToken } from "@/middleware/token.middleware";

export async function POST(request){
    try{
        const {email, password}=await request.json();
        if(!email || !password){
            return NextResponse.json(
                {
                    success: false,
                    message: 'Email and password are required', 
                    code: 'missing credentials'
                },
                {status: 400}
            );
        }
        const user=await User.findOne({email}).select('+password');
        if(!user){
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalied credentials',
                    code: 'INVALID_CREDENTIALS'
                },
                {
                    status: 400
                }
            );
        }
        if(!user.isActive){
            return NextResponse.json(
                {
                    success:false,
                    message: 'Account is deactivated',
                    code: 'ACCOUNT_DEACTIVATED'
                },
                {
                    status: 403
                }
            );
        }
        const isMatch=await bcrypt.compare(password, user.password);
        if(!isMatch){
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid credentials',
                    code: 'INVALID_CREDENTIALS'
                }
            );
        }
        setAccessToken(NextResponse.next(), user);
        await setRefreshToken(NextResponse.next(), user);
        return NextResponse.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                userName: user.userName,
                fullName: user.fullName,
                email: user.email,
                accountType: user.accountType,
                lastLogin: user.lastLogin
            }
        });
    }catch(err){
        console.error('Login error: ', err);
        return NextResponse.json(
            {
                success:false,
                message: 'Server Error',
                code: 'LOGIN_FAILED'
            },
            {
                status: 500
            }
        );
    }
}