// hooks/useCartContext.tsx
'use client';
import { createContext, useContext, ReactNode } from 'react';
import { useCart, type CartItem, type Produce } from './useCart';

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  total: number;
  itemCount: number;
  setIsOpen: (v: boolean) => void;
  addToCart: (p: Produce) => void;
  increment: (id: string) => void;
  decrement: (id: string) => void;
  remove: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const cart = useCart();
  return <CartContext.Provider value={cart}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCartContext must be used inside <CartProvider>');
  return ctx;
}