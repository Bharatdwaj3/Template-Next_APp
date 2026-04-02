// components/Cart.tsx
'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ShoppingBasket, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export type { CartItem } from '@/hooks/useCart';
import type { CartItem } from '@/hooks/useCart';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
}

export const Cart = ({ isOpen, onClose, items, onIncrement, onDecrement, onRemove }: CartProps) => {
  const router = useRouter();
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    onClose();
    sessionStorage.setItem('checkoutCart', JSON.stringify(items));
    sessionStorage.setItem('checkoutTotal', total.toString());
    router.push('/features/checkout');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-primary/40 backdrop-blur-sm z-100"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-bg z-101 flex flex-col shadow-2xl"
          >
            <div className="absolute top-0 left-0 right-0 h-0.75 bg-accent" />

            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBasket className="w-5 h-5 text-primary" />
                <div>
                  <h2 className="text-lg font-black text-primary uppercase tracking-tight">Your Basket</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                    {itemCount} {itemCount === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-primary/8 transition-colors"
              >
                <X size={18} className="text-text-green" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                  <ShoppingBasket className="w-12 h-12 text-primary/20" />
                  <p className="text-2xl font-black text-primary/20 uppercase tracking-tight">Basket Empty</p>
                  <p className="text-sm text-text-muted">Add some fresh produce to get started</p>
                  <button
                    onClick={onClose}
                    className="text-[11px] font-black uppercase tracking-widest text-cta border-b border-cta pb-0.5 hover:text-cta/80 transition-colors"
                  >
                    Browse Produce →
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex gap-4 bg-bg-alt border border-border rounded-2xl p-3 hover:border-primary/30 transition-colors"
                  >
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <Image src={item.img} alt={item.name} fill className="object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] font-black text-primary uppercase tracking-tight truncate">
                        {item.name}
                      </p>
                      <p className="text-[10px] text-text-muted mb-2">{item.grower}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 bg-bg rounded-lg p-1">
                          <button
                            onClick={() => onDecrement(item.id)}
                            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-border transition-colors"
                          >
                            <Minus size={11} className="text-primary" />
                          </button>
                          <span className="text-[12px] font-black text-primary w-4 text-center">{item.quantity}</span>
                          <button
                            onClick={() => onIncrement(item.id)}
                            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-border transition-colors"
                          >
                            <Plus size={11} className="text-primary" />
                          </button>
                        </div>
                        <p className="text-[13px] font-black text-primary">
                          ₹{(item.price * item.quantity).toFixed(0)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemove(item.id)}
                      className="self-start p-1.5 hover:bg-cta/10 rounded-lg transition-colors group"
                    >
                      <Trash2 size={13} className="text-border group-hover:text-cta transition-colors" />
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="px-6 py-5 border-t border-border space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-black uppercase tracking-widest text-text-muted">Total</p>
                  <p className="text-2xl font-black text-primary">₹{total.toFixed(0)}</p>
                </div>
                <button
                  onClick={handleCheckout}
                  className="flex items-center justify-center gap-2 w-full bg-primary text-accent text-[11px] font-black uppercase tracking-widest py-4 rounded-xl hover:bg-primary/90 transition-colors"
                >
                  Proceed to Checkout <ArrowRight size={14} />
                </button>
                <button
                  onClick={onClose}
                  className="w-full text-[10px] font-black uppercase tracking-widest text-text-muted hover:text-primary transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};