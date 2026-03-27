import { Schema, model, models } from 'mongoose';
import '@/model/user.model';

const grocerSchema = new Schema(
  {
    userId: {
      type:     Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      unique:   true,
    },

    bio: {
      type:      String,
      required:  true,
      trim:      true,
      maxlength: 1000,
    },

    shopName: {
      type:      String,
      required:  true,
      trim:      true,
      maxlength: 100,
    },

    location: {
      address:     { type: String, trim: true },
      coordinates: { type: [Number], index: '2dsphere' }, 
    },
    savedProduce: [{
      type: Schema.Types.ObjectId,
      ref:  'Produce',
    }],

    likedProduce: [{
      type: Schema.Types.ObjectId,
      ref:  'Produce',
    }],
    followers: [{
      type: Schema.Types.ObjectId,
      ref:  'User',
    }],
    following: [{
      type: Schema.Types.ObjectId,
      ref:  'User',
    }],

    mediaUrl:     { type: String, default: '' },
    cloudinaryId: { type: String, default: '' },
  },
  { timestamps: true },
);

export default models.Grocer ?? model('Grocer', grocerSchema, 'grocers');