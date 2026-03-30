// app/api/payments/verify/route.ts

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getCurrentUser } from '@/lib/auth/currentUser';
import { connectDB } from '@/lib/db';
import Order from '@/model/order.model';
import Produce from '@/model/produce.model';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cartItems,
      customerInfo,
      amount,
    } = await req.json();

    // Verify signature
    const sign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(razorpay_order_id + '|' + razorpay_payment_id)
      .digest('hex');

    if (sign !== razorpay_signature) {
      return NextResponse.json(
        { success: false, message: 'Invalid signature' },
        { status: 400 }
      );
    }

    const existingOrder = await Order.findOne({ orderId: razorpay_order_id });
    
    if (existingOrder) {
      existingOrder.status = 'paid';
      existingOrder.paymentId = razorpay_payment_id;
      existingOrder.paidAt = new Date();
      await existingOrder.save();
      
      for (const item of cartItems) {
        await Produce.findByIdAndUpdate(item._id, {
          $inc: {
            stock: -item.quantity,
            totalSales: item.quantity,
            revenue: item.price * item.quantity,
          },
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        paymentId: razorpay_payment_id,
        order: existingOrder,
      });
    }

    const order = await Order.create({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      userId: user.id,
      customerInfo: {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: customerInfo.address,
      },
      items: cartItems.map((item: any) => ({
        _id: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        unit: item.unit,
        img: item.img,
      })),
      totalAmount: amount,
      status: 'paid',
      paidAt: new Date(),
    });

    for (const item of cartItems) {
      await Produce.findByIdAndUpdate(item._id, {
        $inc: {
          stock: -item.quantity,
          totalSales: item.quantity,
          revenue: item.price * item.quantity,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      paymentId: razorpay_payment_id,
      order,
    });
  } catch (error: any) {
    console.error('Verify payment error:', error);
    return NextResponse.json(
      { success: false, message: 'Payment verification failed', error: error.message },
      { status: 500 }
    );
  }
}