import React from 'react';
import {
  // eslint-disable-next-line no-shadow-restricted-names
  Infinity, BookOpen, FlaskConical, Palette, Sun, Clock,
} from 'lucide-react';

import { useCategoryFilter } from '../hooks/useCategoryFilter';

const CATEGORY_ICONS = {
  all:     <Infinity size={16} />,
  fiction: <BookOpen size={16} />,
  science: <FlaskConical size={16} />,
  art:     <Palette size={16} />,
  daily:   <Sun size={16} />,
  history: <Clock size={16} />,
};

export default function ContentFilter() {
  const { selectedCategory, handleCategoryClick, CATEGORIES } = useCategoryFilter();

  return (
    <div className="glass-strong rounded-2xl mb-8 sticky top-20 z-10 px-10 py-6">
      <div className="flex gap-3 flex-wrap justify-center items-center">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleCategoryClick(cat.value)}
            className={`
              flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold
              border transition-all duration-300
              hover:-translate-y-0.5 hover:shadow-lg
              ${selectedCategory === cat.value
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-secondary text-foreground border-border hover:bg-muted hover:border-primary/30'
              }
            `}
          >
            {CATEGORY_ICONS[cat.value]}
            <span>{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}