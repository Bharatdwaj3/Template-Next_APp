// app/api/payments/update-order/route.ts


import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/currentUser';
import { connectDB } from '@/lib/db';
import Order from '@/model/order.model';

const validStatusTransitions: Record<string, string[]> = {
  pending: ['processing', 'cancelled'],
  processing: ['paid', 'cancelled'],
  paid: ['shipped', 'cancelled'],
  shipped: ['out_for_delivery', 'cancelled'],
  out_for_delivery: ['delivered', 'cancelled'],
  delivered: ['returned'],
  cancelled: [],
  returned: [],
};

export async function PUT(req: NextRequest) {
  try {
    await connectDB();

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (user.accountType !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Only admin can update order status' },
        { status: 403 }
      );
    }

    const { orderId, status, trackingDetails, notes } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, message: 'Order ID and status are required' },
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

    const allowedTransitions = validStatusTransitions[order.status];
    if (!allowedTransitions.includes(status) && order.status !== status) {
      return NextResponse.json(
        { 
          success: false, 
          message: `Cannot change order status from ${order.status} to ${status}`,
          allowedTransitions 
        },
        { status: 400 }
      );
    }

    const updateData: any = {
      status,
      updatedAt: new Date(),
    };

    switch (status) {
      case 'processing':
        updateData.processingAt = new Date();
        break;
      case 'shipped':
        updateData.shippedAt = new Date();
        if (trackingDetails) {
          updateData.trackingDetails = trackingDetails;
        }
        break;
      case 'out_for_delivery':
        updateData.outForDeliveryAt = new Date();
        break;
      case 'delivered':
        updateData.deliveredAt = new Date();
        break;
      case 'cancelled':
        updateData.cancelledAt = new Date();
        break;
      case 'returned':
        updateData.returnedAt = new Date();
        break;
    }

    if (notes) {
      updateData.adminNotes = notes;
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      { $set: updateData },
      { new: true }
    );

    return NextResponse.json({
      success: true,
      message: `Order status updated to ${status}`,
      order: {
        orderId: updatedOrder.orderId,
        status: updatedOrder.status,
        previousStatus: order.status,
        updatedAt: updatedOrder.updatedAt,
        trackingDetails: updatedOrder.trackingDetails,
      },
    });
  } catch (error: any) {
    console.error('Update order error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update order', error: error.message },
      { status: 500 }
    );
  }
}