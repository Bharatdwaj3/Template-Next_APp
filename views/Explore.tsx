// views/Explore.tsx

'use client';
import { Page } from '@/layout/Page';
import { ProduceGrid } from '@/components/ProduceGrid';
import CategoryFilter from '@/components/CategoryFilter';
import { useCartContext } from '@/hooks/useCartContext';

export default function Explore() {
  const { addToCart } = useCartContext();
  
  return (
    <Page>
      <div className="bg-[#1a3d2b] py-16 px-6">
        <h1 className="text-4xl font-black text-white uppercase tracking-tight">Fresh Daily</h1>
        <p className="text-white/80 mt-2">Browse Produce</p>
        <div className="w-12 h-0.5" style={{ background: 'linear-gradient(90deg, #e8c84a, transparent)' }} />
      </div>

      <CategoryFilter />
      <div className="max-w-7xl mx-auto px-6 py-10">
        <ProduceGrid onAddToCart={(item: any) => addToCart(item)} produce={[]} />
      </div>
    </Page>
  );
}