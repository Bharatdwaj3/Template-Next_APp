// model/order.model.ts

import mongoose, { Schema, model, models } from 'mongoose';

export interface IOrder {
  orderId: string;
  paymentId?: string;
  userId: mongoose.Types.ObjectId;
  customerInfo: {
    name: string;
    email: string;
    phone?: string;
    address?: string;
  };
  items: Array<{
    _id: string;
    name: string;
    price: number;
    quantity: number;
    unit: string;
    img?: string;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'paid' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned' | 'failed' | 'refunded';
  orderDate?: Date;
  estimatedDelivery?: Date;
  paidAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
  cancelledAt?: Date;
  returnedAt?: Date;
  processingAt?: Date;
  outForDeliveryAt?: Date;
  cancelReason?: string;
  returnReason?: string;
  returnType?: 'full' | 'partial';
  returnAmount?: number;
  returnedItems?: string[];
  refundStatus?: 'pending' | 'processing' | 'completed' | 'failed';
  paymentMethod?: 'razorpay' | 'cod' | 'upi';
  trackingDetails?: {
    courier: string;
    trackingNumber: string;
    trackingUrl: string;
  };
  adminNotes?: string;
  error?: {
    code: string;
    description: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new Schema<IOrder>(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    paymentId: {
      type: String,
      sparse: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customerInfo: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String },
      address: { type: String },
    },
    items: [
      {
        _id: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true, min: 1 },
        unit: { type: String, required: true },
        img: { type: String },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'paid', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned', 'failed', 'refunded'],
      default: 'pending',
    },
    orderDate: { type: Date, default: Date.now },
    estimatedDelivery: Date,
    paidAt: Date,
    shippedAt: Date,
    deliveredAt: Date,
    cancelledAt: Date,
    returnedAt: Date,
    processingAt: Date,
    outForDeliveryAt: Date,
    cancelReason: String,
    returnReason: String,
    returnType: {
      type: String,
      enum: ['full', 'partial'],
    },
    returnAmount: Number,
    returnedItems: [String],
    refundStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
    },
    paymentMethod: {
      type: String,
      enum: ['razorpay', 'cod', 'upi'],
      default: 'razorpay',
    },
    trackingDetails: {
      courier: String,
      trackingNumber: String,
      trackingUrl: String,
    },
    adminNotes: String,
    error: {
      code: String,
      description: String,
    },
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderId: 1 });

export default models.Order || model<IOrder>('Order', orderSchema);