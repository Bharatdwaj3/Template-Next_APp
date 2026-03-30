// app/api/payments/cancel-order/route.ts

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

    const { orderId, reason } = await req.json();

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

    if (order.userId.toString() !== user.id && user.accountType !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'You can only cancel your own orders' },
        { status: 403 }
      );
    }

    const canCancel = ['pending', 'processing'].includes(order.status);
    if (!canCancel) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Order cannot be cancelled because it is already ${order.status}` 
        },
        { status: 400 }
      );
    }

    let refundStatus = null;
    if (order.status === 'paid' && order.paymentId) {
      refundStatus = 'pending';
    }

    for (const item of order.items) {
      await Produce.findByIdAndUpdate(item._id, {
        $inc: { stock: item.quantity }
      });
    }

    order.status = 'cancelled';
    order.cancelledAt = new Date();
    order.cancelReason = reason || 'Cancelled by user';
    order.refundStatus = refundStatus;
    await order.save();

    return NextResponse.json({
      success: true,
      message: 'Order cancelled successfully',
      order: {
        orderId: order.orderId,
        status: order.status,
        cancelledAt: order.cancelledAt,
        refundStatus: order.refundStatus,
      },
    });
  } catch (error: any) {
    console.error('Cancel order error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to cancel order', error: error.message },
      { status: 500 }
    );
  }
}