// hooks/useCart.ts
'use client'

import { useState, useEffect } from "react"

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

export interface CartItem extends Produce {
  quantity: number;
}

const CART_STORAGE_KEY = 'nerthus_cart';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load cart:', error);
    }
    setIsInitialized(true);
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    }
  }, [items, isInitialized]);

  const addToCart = (produce: Produce) => {
    setItems((prev) => {
      const exists = prev.find((i) => i.id === produce.id);
      if (exists) {
        return prev.map((i) =>
          i.id === produce.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...produce, quantity: 1 }];
    });
    setIsOpen(true);
  };

  const increment = (id: string) => {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i))
    );
  };

  const decrement = (id: string) => {
    setItems((prev) =>
      prev
        .map((i) =>
          i.id === id && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i
        )
        .filter((i) => i.quantity > 0)
    );
  };

  const remove = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return { 
    items, 
    isOpen, 
    setIsOpen, 
    addToCart, 
    increment, 
    decrement, 
    remove, 
    clearCart,
    total,
    itemCount
  };
}