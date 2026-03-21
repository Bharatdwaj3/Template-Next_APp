import { Schema, model } from 'mongoose';

const buyerSchema = new Schema(
  {
    userId: {
      type:     Schema.Types.ObjectId,
      ref:      'User',
      required: true,
      unique:   true,
    },

    savedProduce: [{
      type: Schema.Types.ObjectId,
      ref:  'Produce',
    }],

    orderHistory: [{
      type: Schema.Types.ObjectId,
      ref:  'Order',
    }],

    following: [{
      type: Schema.Types.ObjectId,
      ref:  'User',
    }],

    deliveryAddresses: [{
      label:       { type: String, trim: true },
      address:     { type: String, trim: true },
      coordinates: { type: [Number] },
    }],

    mediaUrl:     { type: String, default: '' },
    cloudinaryId: { type: String, default: '' },
  },
  { timestamps: true },
);

export default model('Buyer', buyerSchema, 'buyers');