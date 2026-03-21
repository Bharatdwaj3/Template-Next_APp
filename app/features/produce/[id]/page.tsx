'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { Star, Leaf, ShoppingBasket, ArrowLeft, MapPin, Minus, Plus, Bookmark, BookmarkCheck } from 'lucide-react';
import { useProduceDetail } from '@/hooks/useProduceDetail';
import { useSavedProduce }  from '@/hooks/useSavedProduce';
import { useCartContext }   from '@/hooks/useCartContext';

export default function ProduceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params); 

  const { produce, loading }            = useProduceDetail(id);
  const { isSaved, toggle: toggleSave } = useSavedProduce(id);
  const { addToCart, setIsOpen }        = useCartContext();
  const [qty, setQty]                   = useState(1);

  if (loading) return (
    <div className="min-h-screen bg-[#f5f0e8] flex items-center justify-center pt-24">
      <div className="w-8 h-8 border-2 border-[#1a3d2b] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!produce) return null;

  return (
    <div className="min-h-screen bg-[#f5f0e8] pt-24">
      <div className="max-w-6xl mx-auto px-6 py-10">

        <Link href="/features/produce"
          className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#8a9a8e] hover:text-[#1a3d2b] transition-colors mb-8">
          <ArrowLeft size={12} /> All Produce
        </Link>

        <div className="grid grid-cols-12 gap-10 mb-16">

          <div className="col-span-6">
            <div className="relative w-full h-[420px] rounded-2xl overflow-hidden border border-[#d4c9b0] shadow-lg">
              <img src={produce.img} alt={produce.name} className="w-full h-full object-cover" />
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-[#e8c84a]" />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {produce.isOrganic && (
                  <span className="flex items-center gap-1 bg-[#1a3d2b] text-[#e8c84a] text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                    <Leaf size={9} /> Organic
                  </span>
                )}
                {produce.isSeasonal && (
                  <span className="bg-[#e86c2a] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full">
                    In Season
                  </span>
                )}
              </div>
              <button onClick={toggleSave}
                className="absolute top-4 right-4 w-9 h-9 rounded-xl bg-white/90 flex items-center justify-center hover:bg-white transition-colors">
                {isSaved
                  ? <BookmarkCheck size={16} className="text-[#1a3d2b]" />
                  : <Bookmark size={16} className="text-[#8a9a8e]" />
                }
              </button>
            </div>
          </div>

          <div className="col-span-6 flex flex-col justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#e86c2a] mb-2">{produce.category}</p>
              <h1 className="text-4xl font-black text-[#1a3d2b] uppercase tracking-tight leading-none mb-2">{produce.name}</h1>
              <div className="w-12 h-[2px] mb-4" style={{ background: 'linear-gradient(90deg, #e8c84a, transparent)' }} />

              <Link href={`/features/farmer/${produce.growerId}`}
                className="inline-flex items-center gap-2 text-[11px] text-[#8a9a8e] hover:text-[#1a3d2b] transition-colors mb-3 group">
                <MapPin size={12} className="text-[#e86c2a]" />
                by <b className="text-[#4a5a4e] group-hover:text-[#1a3d2b]">{produce.grower}</b> · {produce.location}
              </Link>

              <div className="flex items-center gap-2 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={13} className={i < Math.round(produce.rating) ? 'fill-[#e86c2a] text-[#e86c2a]' : 'text-[#d4c9b0]'} />
                ))}
                <span className="text-[11px] font-black text-[#e86c2a]">{produce.rating}</span>
                <span className="text-[10px] text-[#8a9a8e]">({produce.reviews})</span>
              </div>

              <p className="text-sm text-[#4a5a4e] leading-relaxed mb-8">{produce.description}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-[#1a3d2b]">₹{produce.price * qty}</span>
                <span className="text-[11px] text-[#8a9a8e]">for {qty} {produce.unit}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-white border border-[#d4c9b0] rounded-xl p-1">
                  <button onClick={() => setQty(Math.max(1, qty - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f5f0e8] transition-colors">
                    <Minus size={13} className="text-[#1a3d2b]" />
                  </button>
                  <span className="text-sm font-black text-[#1a3d2b] w-6 text-center">{qty}</span>
                  <button onClick={() => setQty(qty + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#f5f0e8] transition-colors">
                    <Plus size={13} className="text-[#1a3d2b]" />
                  </button>
                </div>

                <button
                  onClick={() => { addToCart(produce); setIsOpen(true); }}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#1a3d2b] text-[#e8c84a] text-[11px] font-black uppercase tracking-widest py-3.5 rounded-xl hover:bg-[#1a3d2b]/90 transition-colors">
                  <ShoppingBasket size={14} /> Add to Basket
                </button>
              </div>

              <Link href="/features/produce/checkout"
                className="flex items-center justify-center w-full bg-white border border-[#d4c9b0] text-[#1a3d2b] text-[11px] font-black uppercase tracking-widest py-3.5 rounded-xl hover:border-[#1a3d2b]/40 transition-colors">
                Buy Now →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}