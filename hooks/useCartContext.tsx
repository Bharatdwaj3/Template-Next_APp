'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useCart, type CartItem } from '@/hooks/useCart';
//import type { Produce } from '@/components/ProduceCard';

export interface Produce {
  id:       string;
  name:     string;
  price:    number;
  unit:     string;
  grower:   string;
  location: string;
  rating:   number;
  img:      string;
}

interface CartContextValue {
  items:       CartItem[];
  isOpen:      boolean;
  total:       number;
  setIsOpen:   (v: boolean) => void;
  addToCart:   (p: Produce) => void;
  increment:   (id: string) => void;
  decrement:   (id: string) => void;
  remove:      (id: string) => void;
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