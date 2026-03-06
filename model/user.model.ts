import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    userName: {
      type:      String,
      required:  [true, 'Username is required'],
      unique:    true,        
      trim:      true,
      minlength: 2,          
      maxlength: 50,
    },
    fullName: {
      type:      String,
      required:  [true, 'Full name is required'],
      trim:      true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type:      String,
      required:  [true, 'Email is required'],
      unique:    true,
      trim:      true,
      lowercase: true,
      match:     [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
    },
    password: {
      type:      String,
      required:  [true, 'Password is required'],
      minlength: 6,
    },
    avatar: { type: String, default: '' },

    accountType: {
      type:     String,
      required: [true, 'Account type is required'],
      enum: {
        values:  ['farmer', 'grocer', 'buyer', 'admin'],
        message: 'Invalid account type',
      },
    },

    refreshToken: { type: String,  default: null,      select: false },
    lastLogin:    { type: Date,    default: Date.now },
    isActive:     { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default model('User', userSchema, 'users');