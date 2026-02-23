import React from 'react';
import { useCategoryFilter } from '../hooks/useCategoryFilter';

export default function CategoryFilter() {
const {selectedCategory, handleCategoryClick, CATEGORIES}=useCategoryFilter();
  return (
    <div 
      className="glass-strong rounded-2xl mb-8 sticky top-20 z-10 animate-fade-in"
      style={{ padding: '24px 40px' }}
    >
      <div className="flex gap-3 flex-wrap justify-center items-center">
        {CATEGORIES.map((cat, idx) => (
          <button
            key={cat.value}
            onClick={() => handleCategoryClick(cat.value)}
            className={`
              px-6 py-3 rounded-xl font-medium text-base
              transition-all duration-300 ease-in-out
              flex items-center gap-2
              ${selectedCategory === cat.value 
                ? 'bg-primary text-primary-foreground glow-border scale-105' 
                : 'bg-secondary text-foreground hover:bg-muted'
              }
              hover:-translate-y-1 hover:shadow-lg
              animate-fade-in
            `}
            style={{ animationDelay: `${idx * 100}ms` }}
          >
            <span>{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}