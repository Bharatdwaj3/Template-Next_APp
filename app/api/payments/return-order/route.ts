// app/api/payments/return-order/route.ts

import { NextRequest, NextResponse } from 'next/server';
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

    const { orderId, items, reason, returnType = 'full' } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { success: false, message: 'Order ID is required' },
        { status: 400 }
      );
    }

    const order = await Order.findOne({ orderId });

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

 
    if (order.userId.toString() !== user.id) {
      return NextResponse.json(
        { success: false, message: 'You can only return your own orders' },
        { status: 403 }
      );
    }

     const canReturn = order.status === 'delivered';
    const daysSinceDelivery = order.deliveredAt 
      ? Math.floor((Date.now() - new Date(order.deliveredAt).getTime()) / (1000 * 60 * 60 * 24))
      : 0;
    const returnWindow = 7; 

    if (!canReturn) {
      return NextResponse.json(
        { success: false, message: 'Only delivered orders can be returned' },
        { status: 400 }
      );
    }

    if (daysSinceDelivery > returnWindow) {
      return NextResponse.json(
        { success: false, message: `Return window is ${returnWindow} days. Order delivered ${daysSinceDelivery} days ago.` },
        { status: 400 }
      );
    }

    let returnAmount = 0;
    let returnedItems = [];

    if (returnType === 'full') {
      returnAmount = order.totalAmount;
      returnedItems = order.items;
    } else if (returnType === 'partial' && items?.length) {
      returnedItems = order.items.filter(item => items.includes(item._id));
      returnAmount = returnedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    } else {
      return NextResponse.json(
        { success: false, message: 'Invalid return request' },
        { status: 400 }
      );
    }

    for (const item of returnedItems) {
      await Produce.findByIdAndUpdate(item._id, {
        $inc: { stock: item.quantity }
      });
    }

    order.status = 'returned';
    order.returnedAt = new Date();
    order.returnReason = reason;
    order.returnType = returnType;
    order.returnAmount = returnAmount;
    order.returnedItems = returnedItems.map((item: any) => item._id);
    order.refundStatus = 'pending';
    await order.save();

    return NextResponse.json({
      success: true,
      message: 'Return request submitted successfully',
      order: {
        orderId: order.orderId,
        status: order.status,
        returnAmount,
        refundStatus: order.refundStatus,
        estimatedRefundDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), 
      },
    });
  } catch (error: any) {
    console.error('Return order error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to process return', error: error.message },
      { status: 500 }
    );
  }
}