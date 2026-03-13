'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ProduceCard, type Produce } from './ProduceCard';
import { SlidersHorizontal, Loader2 } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setCategory } from '@/store/contentSlice';
import { EmptyState } from '../errors/EmptyState';

const SORT_OPTIONS = ['Newest', 'Price: Low', 'Price: High', 'Top Rated'];
const CATEGORIES   = ['all', 'Vegetables', 'Fruits', 'Herbs', 'Root Veg', 'Natural', 'Dairy', 'Grains'];

interface ProduceGridProps {
  onAddToCart: (produce: Produce) => void;
}

export const ProduceGrid = ({ onAddToCart }: ProduceGridProps) => {
  const dispatch = useAppDispatch();

  const selectedCategory = useAppSelector((s) => s.content.selectedCategory);
  const searchQuery      = useAppSelector((s) => s.content.searchQuery);

  const [produce,     setProduce]     = useState<Produce[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [sort,        setSort]        = useState('Newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory !== 'all') params.set('category', selectedCategory);
        if (searchQuery)                params.set('search', searchQuery);
        params.set('sort', sort);

        const res  = await fetch(`/api/produce?${params}`);
        const data = await res.json();
        setProduce(data.success ? (data.produce ?? []) : []);
      } catch {
        setProduce([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedCategory, searchQuery, sort]);

  const handleCategoryChange = (cat: string) => dispatch(setCategory(cat));

  return (
    <section className="bg-[#f5f0e8] px-6 py-12 min-h-[60vh]">
      <div className="max-w-7xl mx-auto">

        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => handleCategoryChange(c)}
              className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border transition-all ${
                selectedCategory === c
                  ? 'bg-[#1a3d2b] text-[#e8c84a] border-[#1a3d2b]'
                  : 'bg-white text-[#4a5a4e] border-[#d4c9b0] hover:border-[#1a3d2b]/40'
              }`}>{c === 'all' ? 'All Produce' : c}</button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-[#8a9a8e]">
            {loading ? 'Loading...' : `${produce.length} results`}
          </p>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex gap-2">
              {SORT_OPTIONS.map((s) => (
                <button key={s} onClick={() => setSort(s)}
                  className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border transition-all ${
                    sort === s ? 'bg-[#1a3d2b] text-[#e8c84a] border-[#1a3d2b]' : 'bg-white text-[#4a5a4e] border-[#d4c9b0] hover:border-[#1a3d2b]/40'
                  }`}>{s}</button>
              ))}
            </div>
            <button onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border border-[#d4c9b0] bg-white text-[#4a5a4e] hover:border-[#1a3d2b]/40 transition-colors">
              <SlidersHorizontal size={12} /> Filters
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mb-8">
              <div className="bg-white border border-[#d4c9b0] rounded-2xl p-6 grid grid-cols-3 gap-6">
                {['Organic Only', 'In Season', 'Price Range'].map((label) => (
                  <div key={label}>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#1a3d2b] mb-2">{label}</p>
                    <div className="w-8 h-[2px]" style={{ background: 'linear-gradient(90deg, #e8c84a, transparent)' }} />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading && (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-[#1a3d2b] animate-spin" />
          </div>
        )}
        {!loading && produce.length === 0 && (
          <EmptyState title="No Produce Found" message="Try a different category or clear your filters."
            ctaHref="/features/produce" onSecondary={() => handleCategoryChange('all')} secondaryLabel="Clear Filters" />
        )}
        {!loading && produce.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {produce.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <ProduceCard produce={p} onAddToCart={onAddToCart} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};