import mongoose, { Schema, model, Document } from 'mongoose';

export interface IFarmer extends Document {
  userId: mongoose.Types.ObjectId;
  bio: string;
  interests: string[];                   
  farmType?: string[];                    
  products?: mongoose.Types.ObjectId[];  
  location?: {
    address?: string;
    coordinates?: [number, number];       
  };
  followers: mongoose.Types.ObjectId[];   
  following: mongoose.Types.ObjectId[];  
  mediaUrl: string;
  cloudinaryId: string;
  createdAt: Date;
  updatedAt: Date;
}

const farmerSchema = new Schema<IFarmer>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },

    bio: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    interests: {
      type: [String],
      enum: ['vegetables', 'fruits', 'herbs', 'grains', 'dairy', 'poultry', 'beekeeping', 'permaculture', 'agroforestry'],
      default: [],
    },

    farmType: {
      type: [String],
      enum: ['organic', 'biodynamic', 'natural', 'conventional', 'hydroponic', 'aquaponic'],
      default: [],
    },

    products: [{
      type: Schema.Types.ObjectId,
      ref: 'Produce',                  
    }],

    location: {
      address: { type: String, trim: true },
      coordinates: {
        type: [Number],                 
        index: '2dsphere',
      },
    },

    followers: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],

    following: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],

    mediaUrl: { type: String, default: '' },
    cloudinaryId: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

farmerSchema.index({ bio: 'text', interests: 'text' });

export default model<IFarmer>('Farmer', farmerSchema, 'farmers');