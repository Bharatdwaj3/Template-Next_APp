// models/grocer.model.ts
import { Schema, model } from 'mongoose';

const grocerSchema = new Schema({
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
  shopName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  location: {
    address: { type: String, trim: true },
    coordinates: { type: [Number], index: '2dsphere' }, // [lng, lat]
  },
  savedProducts: [{
    type: Schema.Types.ObjectId,
    ref: 'Produce',
  }],
  likedProducts: [{
    type: Schema.Types.ObjectId,
    ref: 'Produce',
  }],
  following: [{
    type: Schema.Types.ObjectId,
    ref: 'Farmer',
  }],
  mediaUrl: { type: String, default: '' },
  cloudinaryId: { type: String, default: '' },
}, {
  timestamps: true,
});

export default model('Grocer', grocerSchema, 'grocers');