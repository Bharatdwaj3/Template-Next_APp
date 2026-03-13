'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Star, ShoppingBasket, Leaf } from 'lucide-react';

export interface Produce {
  id: string;
  name: string;
  grower: string;
  location: string;
  price: number;
  unit: string;
  rating: number;
  reviews: number;
  category: string;
  isOrganic: boolean;
  isSeasonal: boolean;
  img: string;
}

interface ProduceCardProps {
  produce: Produce;
  onAddToCart: (produce: Produce) => void;
}

export const ProduceCard = ({ produce, onAddToCart }: ProduceCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    whileHover={{ y: -4 }}
    transition={{ duration: 0.2 }}
    className="bg-white border border-[#d4c9b0] rounded-2xl overflow-hidden group hover:border-[#1a3d2b]/40 hover:shadow-xl transition-all"
  >
    
    <div className="relative w-full h-44 overflow-hidden">
      <Image
        src={produce.img}
        alt={produce.name}
        fill
        className="object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div className="absolute top-0 left-0 right-0 h-0.75 bg-[#e8c84a] opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
        {produce.isOrganic && (
          <span className="flex items-center gap-1 bg-[#1a3d2b] text-[#e8c84a] text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
            <Leaf size={9} /> Organic
          </span>
        )}
        {produce.isSeasonal && (
          <span className="bg-[#e86c2a] text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
            In Season
          </span>
        )}
      </div>
    </div>

   
    <div className="p-4">  
      <p className="text-[9px] font-black uppercase tracking-[0.4em] text-[#8a9a8e] mb-1">
        {produce.category}
      </p>

      
      <h3 className="text-[15px] font-black text-[#1a3d2b] uppercase tracking-tight leading-tight mb-1">
        {produce.name}
      </h3>

      <p className="text-[10px] text-[#8a9a8e] mb-3">
        by <span className="font-bold text-[#4a5a4e]">{produce.grower}</span> · {produce.location}
      </p>

      <div className="flex items-center gap-1.5 mb-4">
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={11}
              className={i < Math.round(produce.rating) ? 'fill-[#e86c2a] text-[#e86c2a]' : 'text-[#d4c9b0]'}
            />
          ))}
        </div>
        <span className="text-[10px] font-bold text-[#e86c2a]">{produce.rating}</span>
        <span className="text-[10px] text-[#8a9a8e]">({produce.reviews})</span>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <span className="text-xl font-black text-[#1a3d2b]">₹{produce.price}</span>
          <span className="text-[10px] text-[#8a9a8e] ml-1">/ {produce.unit}</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onAddToCart(produce)}
          className="flex items-center gap-2 bg-[#1a3d2b] text-[#e8c84a] text-[10px] font-black uppercase tracking-widest px-4 py-2.5 rounded-xl hover:bg-[#1a3d2b]/90 transition-colors"
        >
          <ShoppingBasket size={13} />
          Add
        </motion.button>
      </div>
    </div>
  </motion.div>
);