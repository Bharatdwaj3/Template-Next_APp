// app/client-wrapper.tsx
'use client';

import { StoreProvider } from '@/store/StoreProvider';
import { CartProvider } from '@/hooks/useCartContext';
import { Cart } from '@/components/Cart';
import { useCartContext } from '@/hooks/useCartContext';
import Navbar from '@/components/Navbar';

function GlobalCart() {
  const { items, isOpen, setIsOpen, addToCart, increment, decrement, remove } = useCartContext();
  
  return (
    <Cart
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      items={items}
      onIncrement={increment}
      onDecrement={decrement}
      onRemove={remove}
    />
  );
}

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <CartProvider>
        <Navbar />
        {children}
        <GlobalCart />
      </CartProvider>
    </StoreProvider>
  );
}