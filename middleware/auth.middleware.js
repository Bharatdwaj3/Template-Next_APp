import jwt from 'jsonwebtoken';
import User from '@models/user.model';
import {JWT_ACC_SECRECT} from "@/config/env.config";
import {cookies } from 'next/headers';


export async function  getAuthenticatedUser(){
  const cookieStore=await  cookies();
  const token = cookieStore.get('accessToken')?.value;
  if(!token){
    return null;
  }
  try{
    const payload=jwt.verify(token, JWT_ACC_SECRECT);
    const user=await User.findById(payload.user.id).select('id accountType isActive');
    if(!user || !user.isActive){
      return null;
    }
    return {
      id: user.id,
      accountType: user.accountType
    };
  }catch(err){
    console.log('JWT verification failed',err);
    return null;
  }
}