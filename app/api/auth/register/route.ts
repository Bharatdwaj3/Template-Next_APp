import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/model/user.model';
import { connectDB } from '@/lib/db';
import { setAccessToken, setRefreshToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { userName, fullName, email, accountType, password } = body;

    if (!userName || !fullName || !email || !accountType || !password) {
      return NextResponse.json(
        { success: false, message: 'All fields are required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'An account with this email already exists', code: 'EMAIL_EXISTS' },
        { status: 400 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ userName, fullName, email, accountType, password: hashedPassword });
    await user.save();

    const response = NextResponse.json(
      {
        success: true,
        message: 'Registered. Check your email for a verification code.',
        requiresVerification: true,
        user: { id: user._id, email: user.email },
      },
      { status: 201 }
    );

    setAccessToken(response, user);
    await setRefreshToken(response, user);

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error', code: 'REGISTRATION_ERROR' },
      { status: 500 }
    );
  }
}