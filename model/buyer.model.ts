import mongoose, { Model, Schema, Document, Types } from 'mongoose';
import '@/model/user.model';

export interface IBuyer extends Document {
  userId:       mongoose.Types.ObjectId;
  savedProduce: Types.ObjectId[];
  orderHistory: Types.ObjectId[];
  following: Types.ObjectId[];
  deliveryAddresses: Array<{
    label?: string;
    address?: string;
    coordinates?: number[];
  }>;
  mediaUrl: string;
  cloudinaryId: string;
  createdAt: Date;
  updatedAt: Date;
}

const buyerSchema = new Schema<IBuyer>(
  {
    userId: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true, 
      unique: true 
    },

    savedProduce: [{
      type: Schema.Types.ObjectId,
      ref: 'Produce',
    }],

    orderHistory: [{
      type: Schema.Types.ObjectId,
      ref: 'Order',
    }],

    following: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],

    deliveryAddresses: [{
      label: { type: String, trim: true },
      address: { type: String, trim: true },
      coordinates: { type: [Number] }, 
    }],

    mediaUrl: { type: String, default: '' },
    cloudinaryId: { type: String, default: '' },
  },
  { timestamps: true }
);

const Buyer: Model<IBuyer> = mongoose.models.Buyer || mongoose.model<IBuyer>('Buyer', buyerSchema, 'buyers');

export default Buyer;