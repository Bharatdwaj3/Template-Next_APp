'use client';
import { motion } from 'framer-motion';
import { useCategoryFilter } from '@/hooks/useCategoryFilter';

export default function CategoryFilter() {
  const { selectedCategory, handleCategoryClick, PRODUCE_CATEGORIES: CATEGORIES } =
    useCategoryFilter();

  return (
    <div className="flex flex-wrap gap-3 mb-8">
      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-cta mb-2 w-full">
        Browse by Category
      </p>
      {CATEGORIES.map((cat, idx) => (
        <motion.button
          key={cat.value}
          onClick={() => handleCategoryClick(cat.value)}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.06 }}
          whileHover={{ y: -2 }}
          className={`px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-200 border ${
            selectedCategory === cat.value
              ? 'bg-primary text-accent border-primary shadow-lg'
              : 'bg-bg-alt/60 text-text-green border-border hover:border-primary/40 hover:text-primary'
          }`}
        >
          {cat.label}
        </motion.button>
      ))}
    </div>
  );
}