// app/api/payments/create-order/route.ts

import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getCurrentUser } from '@/lib/auth/currentUser';
import { connectDB } from '@/lib/db';
import Order from '@/model/order.model';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

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

    if (user.accountType !== 'buyer') {
      return NextResponse.json(
        { success: false, message: 'Only buyers can make payments' },
        { status: 403 }
      );
    }

    const { amount, cartItems, customerInfo, paymentMethod = 'razorpay' } = await req.json();

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid amount' },
        { status: 400 }
      );
    }

    if (!cartItems || !cartItems.length) {
      return NextResponse.json(
        { success: false, message: 'Cart is empty' },
        { status: 400 }
      );
    }

    if (!customerInfo || !customerInfo.name || !customerInfo.email) {
      return NextResponse.json(
        { success: false, message: 'Customer information is required' },
        { status: 400 }
      );
    }

    const pendingOrder = await Order.findOne({
      userId: user.id,
      status: 'pending',
    });

    if (pendingOrder) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'You already have a pending order. Please complete or cancel it first.',
          orderId: pendingOrder.orderId 
        },
        { status: 400 }
      );
    }

    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        userId: user.id,
        customerName: customerInfo.name,
        customerEmail: customerInfo.email,
        itemsCount: cartItems.length,
      },
    };

    const razorpayOrder = await razorpay.orders.create(options);

    const order = await Order.create({
      orderId: razorpayOrder.id,
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
      status: 'pending',
      paymentMethod,
      orderDate: new Date(),
      estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), 
    });

    return NextResponse.json({
      success: true,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      key_id: process.env.RAZORPAY_KEY_ID,
      orderDetails: order,
    });
  } catch (error: any) {
    console.error('Create order failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create order',
        error: error.message,
      },
      { status: 500 }
    );
  }
}