'use client';

import { Page }            from '@/layout/Page';
import { ProduceGrid }     from '@/components/ProduceGrid';
import { Cart }            from '@/components/Cart';
import { useCartContext }  from '@/hooks/useCartContext';
import CategoryFilter      from '@/components/CategoryFilter';

export default function Explore() {
  const { items, isOpen, setIsOpen, addToCart, increment, decrement, remove } = useCartContext();

  return (
    <Page>
      {/* Header banner */}
      <div className="bg-[#1a3d2b] px-6 py-14 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#e8c84a]" />
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e8c84a]/60 mb-2">
            Fresh Daily
          </p>
          <h1 className="text-5xl font-black text-white uppercase tracking-tight leading-none mb-3">
            Browse Produce
          </h1>
          <div className="w-12 h-0.5" style={{ background: 'linear-gradient(90deg, #e8c84a, transparent)' }} />
        </div>
      </div>

      <CategoryFilter />

      <ProduceGrid onAddToCart={addToCart} />

      <Cart
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        items={items}
        onIncrement={increment}
        onDecrement={decrement}
        onRemove={remove}
      />
    </Page>
  );
}