// app/api/payments/failure/route.ts



import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/currentUser';
import { connectDB } from '@/lib/db';
import Order from '@/model/order.model';

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

    const { order_id, payment_id, error_code, error_description } = await req.json();

    await Order.create({
      orderId: order_id,
      paymentId: payment_id,
      userId: user.id,
      status: 'failed',
      error: {
        code: error_code,
        description: error_description,
      },
      failedAt: new Date(),
    });

    return NextResponse.json({
      success: false,
      message: 'Payment failed',
      data: { order_id, payment_id, error_code, error_description },
    });
  } catch (error: any) {
    console.error('Payment failure handler error:', error);
    return NextResponse.json(
      { success: false, message: 'Error processing payment failure' },
      { status: 500 }
    );
  }
}