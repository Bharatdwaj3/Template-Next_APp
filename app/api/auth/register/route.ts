import { NextResponse } from "next/server";
import bcrypt from "bycryptjs";
import User from "@/model/user.model";
import {setAccessToken, setRefreshToken} from '@/middleware/token.middleware';

export async function POST(request){
    try{
        const body=await request.json();
        const {userName, fullName, email, accountType, password}=body;
        if(!userName || !fullName || !email || !accountType || !password){
            return NextResponse.json(
                {success: false, message: 'All fields are required', code: 'VALIDATION ERROR'},
                {status: 400}
            );
        }
        const existingUser=await User.findOne({email});
        if(existingUser){
            return NextResponse.json(
                {success: false, message: 'User with this email already exists', code:'EMAIL EXISTS'},
                {status : 400}
            );
        }

        const user = new User({userName, fullName, email, accountType, password});
        const salt=await bcrypt.genSalt(10);
        user.password=await bcrypt.hash(password, salt);

        await user.save();
        setAccessToken(NextResponse.next(), user);
        await setRefreshToken(NextResponse.next(), user);

        return NextResponse.json(
            {
                success: true,
                message: 'Registered Check for email verification code',
                requiresVerification: true,
                user: {id: user._id, email: user.email}
            },
            {status: 201}
        );
    }catch(error){
        console.error('Registration error: ',error);
        return NextResponse.json(
            {
                success: false,
                message: 'Server error: ', 
                code: 'Registration error!'
            
            },
            {status: 500}
        );
    }
}