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

// Define the API response type
interface ApiProduceItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  stock: number;
  category: string;
  img: string;
  isOrganic: boolean;
  rating: number;
  totalReviews: number;
  farmerId: {
    _id: string;
    userName: string;
    fullName: string;
    location?: { address?: string };
  };
}

export function ProduceGrid({ onAddToCart }: ProduceGridProps) {
  const dispatch = useAppDispatch();

  const selectedCategory = useAppSelector((s) => s.content.selectedCategory);
  const searchQuery      = useAppSelector((s) => s.content.searchQuery);

  const [produce, setProduce] = useState<Produce[]>([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('Newest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/produce/details/');
        const data = await res.json();
        
        console.log('Produce data from API:', data);
        
        if (data.success && data.produce) {
          // Convert the data to match the Produce interface
          const formattedProduce: Produce[] = data.produce.map((item: ApiProduceItem) => ({
            id: item._id,
            name: item.name,
            grower: item.farmerId?.fullName || 'Unknown Farmer',
            location: item.farmerId?.location?.address || '',
            price: item.price,
            unit: item.unit,
            rating: item.rating || 0,
            reviews: item.totalReviews || 0,
            category: item.category,
            isOrganic: item.isOrganic,
            isSeasonal: false,
            img: item.img || '/placeholder.jpg'
          }));
          
          // Apply filters client-side
          let filtered = formattedProduce;
          
          // Apply category filter
          if (selectedCategory !== 'all') {
            filtered = filtered.filter((p: Produce) => p.category === selectedCategory);
          }
          
          // Apply search filter
          if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter((p: Produce) => 
              p.name.toLowerCase().includes(query) ||
              p.grower.toLowerCase().includes(query)
            );
          }
          
          // Apply sorting
          switch (sort) {
            case 'Price: Low':
              filtered.sort((a: Produce, b: Produce) => a.price - b.price);
              break;
            case 'Price: High':
              filtered.sort((a: Produce, b: Produce) => b.price - a.price);
              break;
            case 'Top Rated':
              filtered.sort((a: Produce, b: Produce) => b.rating - a.rating);
              break;
            case 'Newest':
            default:
              // Newest by id (you can add createdAt if available)
              filtered.sort((a: Produce, b: Produce) => b.id.localeCompare(a.id));
              break;
          }
          
          console.log('Filtered produce:', filtered);
          setProduce(filtered);
        } else {
          console.error('API returned no produce:', data);
          setProduce([]);
        }
      } catch (error) {
        console.error('Error fetching produce:', error);
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
              }`}>
              {c === 'all' ? 'All Produce' : c}
            </button>
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
                    <div className="w-8 h-0.5" style={{ background: 'linear-gradient(90deg, #e8c84a, transparent)' }} />
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
}