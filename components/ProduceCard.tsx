// components/ProduceCard.tsx
'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBasket,
  Leaf,
  Star,
  Eye,
  Clock,
  Package
} from 'lucide-react';

export interface Produce {
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
    avatar: string;
  };
  createdAt: string;
}

interface ProduceCardProps {
  produce: Produce;
  onAddToCart: (item: any) => void;
}

export const ProduceCard = ({ produce, onAddToCart }: ProduceCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsAdding(true);
    onAddToCart({
      id: produce._id,
      name: produce.name,
      price: produce.price,
      quantity: 1,
      unit: produce.unit,
      img: produce.img,
      grower: produce.farmerId.fullName,
      farmerId: produce.farmerId._id,
    });
    setTimeout(() => setIsAdding(false), 500);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <Link href={`/features/produce/${produce._id}`} className="block">
      <motion.div
        className="bg-bg-alt border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-xl transition-all duration-300 group relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -4 }}
      >
        {/* Image Container - FIXED: Added proper wrapper with dimensions */}
        <div className="relative w-full h-48 overflow-hidden bg-bg">
          {produce.img ? (
            <Image
              src={produce.img}
              alt={produce.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-bg">
              <Package size={64} className="text-text-muted" />
            </div>
          )}
        </div>

        <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
          {produce.isOrganic && (
            <span className="flex items-center gap-1 bg-primary text-accent text-[9px] font-black px-2.5 py-1 rounded-full">
              <Leaf size={10} /> ORGANIC
            </span>
          )}
          {produce.stock <= 10 && produce.stock > 0 && (
            <span className="bg-orange-100 text-orange-700 text-[9px] font-black px-2.5 py-1 rounded-full">
              LOW STOCK
            </span>
          )}
          {produce.stock === 0 && (
            <span className="bg-red-100 text-red-700 text-[9px] font-black px-2.5 py-1 rounded-full">
              OUT OF STOCK
            </span>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          className="absolute top-3 right-3 z-10"
        >
          <div className="bg-bg-alt/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
            <Eye size={14} className="text-primary" />
          </div>
        </motion.div>

        <div className="p-5">
          <p className="text-[9px] font-black uppercase tracking-widest text-cta mb-1">
            {produce.category}
          </p>

          <h3 className="text-lg font-black text-primary uppercase tracking-tight mb-2 line-clamp-1">
            {produce.name}
          </h3>

          <div className="flex items-center gap-2 mb-3">
            {produce.farmerId.avatar ? (
              <div className="relative w-5 h-5 rounded-full overflow-hidden">
                <Image
                  src={produce.farmerId.avatar}
                  alt={produce.farmerId.fullName}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-[8px] font-black text-primary">
                  {produce.farmerId.fullName?.[0]}
                </span>
              </div>
            )}
            <span className="text-[10px] text-text-muted">
              by {produce.farmerId.fullName}
            </span>
          </div>

          <div className="flex items-center gap-1 mb-3">
            <Star size={12} className="fill-cta text-cta" />
            <span className="text-sm font-bold text-cta">
              {produce.rating || 0}
            </span>
            <span className="text-[10px] text-text-muted">
              ({produce.totalReviews || 0} reviews)
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-black text-cta">
                ₹{produce.price}
              </span>
              <span className="text-[10px] text-text-muted ml-1">
                /{produce.unit}
              </span>
            </div>
          
            <motion.button
              onClick={handleAddToCart}
              disabled={produce.stock === 0 || isAdding}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-bold text-[10px] uppercase tracking-wider transition-all ${
                produce.stock === 0
                  ? 'bg-border text-text-muted cursor-not-allowed'
                  : isAdding
                  ? 'bg-primary-hover text-accent'
                  : 'bg-primary text-accent hover:bg-primary-hover'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {isAdding ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                    className="w-3 h-3 border-2 border-accent border-t-transparent rounded-full"
                  />
                  Added
                </>
              ) : (
                <>
                  <ShoppingBasket size={12} />
                  Add
                </>
              )}
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute inset-x-0 bottom-0 bg-linear-to-t from-primary via-primary/95 to-transparent p-5 pt-16 z-10"
            >
              <p className="text-[11px] text-text-inverse/90 mb-3 line-clamp-2 leading-relaxed">
                {produce.description || 'Fresh organic produce from local farms'}
              </p>

              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1">
                  <Clock size={11} className="text-accent" />
                  <span className="text-[9px] text-text-inverse/80">
                    Listed {formatDate(produce.createdAt)}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Package size={11} className="text-accent" />
                  <span className="text-[9px] text-text-inverse/80">
                    {produce.stock} {produce.unit} available
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className={`text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded ${
                  produce.stock > 10
                    ? 'bg-green-500/20 text-green-300'
                    : produce.stock > 0
                    ? 'bg-orange-500/20 text-orange-300'
                    : 'bg-red-500/20 text-red-300'
                }`}>
                  {produce.stock > 10
                    ? 'In Stock'
                    : produce.stock > 0
                    ? `Only ${produce.stock} left`
                    : 'Out of Stock'}
                </div>
              
                <span className="text-[9px] text-text-inverse/60 uppercase tracking-wider">
                  Click for details →
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </Link>
  );
};
