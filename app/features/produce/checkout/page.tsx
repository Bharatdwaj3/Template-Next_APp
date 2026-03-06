'use client';

import Link from 'next/link';
import { ShoppingBasket } from 'lucide-react';
import { useCartContext } from '@/hooks/useCartContext';
import { CheckoutForm }  from '@/components/CheckoutForm';

export default function CheckoutPage() {
  const { items } = useCartContext();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#f5f0e8] flex flex-col items-center justify-center gap-6 pt-24">
        <ShoppingBasket className="w-12 h-12 text-[#1a3d2b]/20" />
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#8a9a8e]">Nothing to check out</p>
        <Link href="/features/produce"
          className="bg-[#1a3d2b] text-[#e8c84a] text-[11px] font-black uppercase tracking-widest px-8 py-3.5 rounded-xl hover:bg-[#1a3d2b]/90 transition-colors">
          Browse Produce →
        </Link>
      </div>
    );
  }

  return <CheckoutForm items={items} />;
}