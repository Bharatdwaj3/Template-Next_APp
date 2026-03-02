'use client'

import {motion} from 'framer-motion';
import {
  Leaf, BookOpen, FlaskConical, Palette, Sun, Clock,
} from 'lucide-react';
import { useCategoryFilter } from '@/hooks/useCategoryFilter';

const CATEGORY_ICONS: Record<string, React.ReactNode>={
  all: <Leaf size={14}/>,
  fiction: < BookOpen size={14}/> ,
  science: < FlaskConical size={14}/>,
  art: <Palette size={14}/>,
  daily: <Sun size={14}/>,
  history: <Clock size={14}/>,
};

export default function ContentFilter(){
  const {selectedCategory, handleCategoryClick, CATEGORIES}=useCategoryFilter();

  return(
    <div className='bg-[#f5f0e8]/90 backdrop-blur-md border-b border-[#d4c90] sticky top-20 z-10'>
      <div className='max-w-7xl mx-auto px-6 py-5'>
        <p className='text-[9px] font-black uppercase tracking-[0.5em] text-[#8a9a8e] mb-4 text-center'>
          Filter Produce
        </p>
        <div className='flex gap-2.5 flex-wrap justify-center items-center'>
          {CATEGORIES.map((cat, idx)=>(
            <motion.button
              key={cat.value}
              onClick={()=>handleCategoryClick(cat.value)}
              initial={{opacity: 0, y:8}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: idx*0.06}}
              whileHover={{y: -2}}
              className={`
                flex items-center gap-2 px-5 py-2.5 rounded-full
                text-[11px] font-black uppercase tracking-widest
                border transition-all duration-200
                ${selectedCategory===cat.value
                  ? 'bg-[#1a3d2b] text-[#e8c84a] border-[#1a3d2b] shadow-lg'
                  : 'bg-white/60 text-[#4a5a4e] border-[#d4c9b0] hover:border-[#1a3d2b]/40 hover:text-[#1a3d2b]'
                }
              `}
            >
              {CATEGORY_ICONS[cat.value]}
              <span>{cat.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
}