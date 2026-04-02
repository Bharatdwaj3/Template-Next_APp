// app/features/order-success/page.tsx

'use client';

import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function OrderSuccessPage() {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center pt-24 px-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-[var(--color-border)]">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-green-600" />
          </div>
          
          <h1 className="text-2xl font-black text-[var(--color-primary)] mb-2">
            Order Placed! 🎉
          </h1>
          <p className="text-[#8a9a8e] mb-6">
            Your fresh produce is on its way!
          </p>
          
          <div className="space-y-3">
            <Link
              href="/features/orders"
              className="block w-full py-3 bg-[var(--color-primary)] text-[var(--color-primary-accent)] rounded-xl font-bold hover:bg-[var(--color-primary-hover)] transition-colors"
            >
              View My Orders
            </Link>
            <Link
              href="/features/produce"
              className="block w-full py-3 border border-[var(--color-border)] text-[var(--color-primary)] rounded-xl font-bold hover:bg-[var(--color-bg)] transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}