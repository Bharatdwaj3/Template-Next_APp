// features/produce/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { ProduceGrid } from '@/components/ProduceGrid';
import { type Produce } from '@/components/ProduceCard';
import { useCartContext } from '@/hooks/useCartContext';
import { Loader2 } from 'lucide-react';
import { api } from '@/lib/api';

export default function ProducePage() {
  const { addToCart } = useCartContext();
  const [produce, setProduce] = useState<Produce[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduce = async () => {
      try {
        const data = await api.get('/produce/details');
        if (data.success) {
          setProduce(data.produce);
        }
      } catch {
        console.error('Error fetching produce');
      } finally {
        setLoading(false);
      }
    };
    fetchProduce();
  }, []);

  const handleAddToCart = (item: any) => {
    addToCart(item);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-cta mb-2">
            Fresh Daily
          </p>
          <h1 className="text-4xl font-black text-primary uppercase tracking-tight">
            Browse Produce
          </h1>
          <div className="w-12 h-0.5 mt-4" style={{ background: 'linear-gradient(90deg, var(--color-accent), transparent)' }} />
        </div>

        <ProduceGrid produce={produce} onAddToCart={handleAddToCart} />
      </div>
    </div>
  );
}