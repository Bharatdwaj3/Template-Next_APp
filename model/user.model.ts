import {Schema, model} from "mongoose";

const user_Schema=new Schema({
    userName: {
        type:String,
        required:[true, 'User Name is required'],
        trim:true,
        minLength:2,
        maxLength:50,
    },
    fullName: {
        type:String,
        required:[true, 'Full Name is required'],
        trim:true,
        minLength:2,
        maxLength:50,
    },
    email:{
        type:String,
        required:[true, 'User email is required'],
        unique:true,
        trim: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'Please fill a valid email address'],
    },
    password:{
        type:String,
        required:[true, 'User Password is required'],
        minLength:6,
    },
    avatar: { type: String },
    accountType: {
        type: String,
        required: [true, 'Account type required'],
            enum: {
                values: ['reader', 'writer', 'admin'],
                message: 'Invalid account type'
        }
    },
    refreshToken:{type: String, default:null, select:false},
    lastLogin:{type:Date, default:Date.now},
    isActive:{type:Boolean, default: true},
 
},{
    timestamps:true,
    
});


export default model('userModel', user_Schema,'user');
