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
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-cta mb-2">
            Fresh Daily
          </p>
          <h1 className="text-4xl font-black text-text-main uppercase tracking-tight">
            Browse Produce
          </h1>
          <div
            className="w-12 h-0.5"
            style={{ background: 'linear-gradient(90deg, var(--color-accent), transparent)' }}
          />
        </div>

        <CategoryFilter />

        <ProduceGrid onAddToCart={(item: any) => addToCart(item)} produce={[]} />
      </div>
    </Page>
  );
}