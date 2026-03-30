// app/api/payments/track-order/[orderId]/route.ts


import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/currentUser';
import { connectDB } from '@/lib/db';
import Order from '@/model/order.model';

const trackingSteps = {
  pending: [
    { status: 'Order Placed', description: 'Your order has been received', completed: true },
    { status: 'Payment Pending', description: 'Awaiting payment confirmation', completed: false },
  ],
  processing: [
    { status: 'Order Placed', description: 'Your order has been received', completed: true },
    { status: 'Payment Confirmed', description: 'Payment has been verified', completed: true },
    { status: 'Preparing', description: 'Farmers are preparing your produce', completed: false },
  ],
  paid: [
    { status: 'Order Placed', description: 'Your order has been received', completed: true },
    { status: 'Payment Confirmed', description: 'Payment has been verified', completed: true },
    { status: 'Preparing', description: 'Farmers are preparing your produce', completed: true },
    { status: 'Packed', description: 'Your order has been packed', completed: false },
  ],
  shipped: [
    { status: 'Order Placed', description: 'Your order has been received', completed: true },
    { status: 'Payment Confirmed', description: 'Payment has been verified', completed: true },
    { status: 'Preparing', description: 'Farmers are preparing your produce', completed: true },
    { status: 'Packed', description: 'Your order has been packed', completed: true },
    { status: 'Shipped', description: 'Your order is on the way', completed: true },
    { status: 'Out for Delivery', description: 'Out for delivery', completed: false },
  ],
  delivered: [
    { status: 'Order Placed', description: 'Your order has been received', completed: true },
    { status: 'Payment Confirmed', description: 'Payment has been verified', completed: true },
    { status: 'Preparing', description: 'Farmers are preparing your produce', completed: true },
    { status: 'Packed', description: 'Your order has been packed', completed: true },
    { status: 'Shipped', description: 'Your order is on the way', completed: true },
    { status: 'Out for Delivery', description: 'Out for delivery', completed: true },
    { status: 'Delivered', description: 'Order delivered successfully', completed: true },
  ],
  cancelled: [
    { status: 'Order Placed', description: 'Your order has been received', completed: true },
    { status: 'Cancelled', description: 'Order has been cancelled', completed: true },
  ],
  returned: [
    { status: 'Order Placed', description: 'Your order has been received', completed: true },
    { status: 'Delivered', description: 'Order was delivered', completed: true },
    { status: 'Return Initiated', description: 'Return request submitted', completed: true },
    { status: 'Return Approved', description: 'Return approved, refund processing', completed: false },
  ],
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    await connectDB();

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { orderId } = await params;

    const order = await Order.findOne({ orderId }).populate('userId', 'userName fullName email');

    if (!order) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.userId._id.toString() !== user.id && user.accountType !== 'admin') {
      return NextResponse.json(
        { success: false, message: 'Unauthorized to view this order' },
        { status: 403 }
      );
    }

    const steps = trackingSteps[order.status as keyof typeof trackingSteps] || trackingSteps.pending;

    const trackingInfo = {
      orderId: order.orderId,
      status: order.status,
      orderDate: order.createdAt,
      estimatedDelivery: order.estimatedDelivery,
      deliveredAt: order.deliveredAt,
      cancelledAt: order.cancelledAt,
      returnedAt: order.returnedAt,
      trackingSteps: steps,
      currentStep: steps.filter(s => s.completed).length,
      totalSteps: steps.length,
      items: order.items,
      totalAmount: order.totalAmount,
      customerInfo: order.customerInfo,
    };

    return NextResponse.json({
      success: true,
      tracking: trackingInfo,
    });
  } catch (error: any) {
    console.error('Track order error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to track order', error: error.message },
      { status: 500 }
    );
  }
}