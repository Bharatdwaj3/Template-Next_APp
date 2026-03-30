// app/features/produce/page.tsx

'use client';

import { useEffect, useState } from 'react';
import { ProduceGrid, type Produce } from '@/components/ProduceGrid';
import { useCartContext } from '@/hooks/useCartContext';
import { Loader2 } from 'lucide-react';

export default function ProducePage() {
  const { addItem } = useCartContext();
  const [produce, setProduce] = useState<Produce[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduce = async () => {
      try {
        const res = await fetch('/api/produce/details');
        const data = await res.json();
        if (data.success) {
          setProduce(data.produce);
        }
      } catch (error) {
        console.error('Error fetching produce:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduce();
  }, []);

  const handleAddToCart = (item: any) => {
    addItem(item);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#1a3d2b]" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f0e8]">
      <div className="bg-[#1a3d2b] py-16 px-6">
        <h1 className="text-4xl font-black text-white uppercase tracking-tight">
          Fresh Daily
        </h1>
        <p className="text-white/80 mt-2">Browse Produce</p>
        <div className="w-12 h-0.5 mt-4" style={{ background: 'linear-gradient(90deg, #e8c84a, transparent)' }} />
      </div>
      <div className="max-w-7xl mx-auto px-6 py-10">
        <ProduceGrid produce={produce} onAddToCart={handleAddToCart} />
      </div>
    </div>
  );
}