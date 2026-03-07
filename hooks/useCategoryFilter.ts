'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setCategory } from '@/store/contentSlice';


export const PRODUCE_CATEGORIES = [
  { value: 'all',       label: 'All Produce'  },
  { value: 'Vegetables',label: 'Vegetables'   },
  { value: 'Fruits',    label: 'Fruits'       },
  { value: 'Herbs',     label: 'Herbs'        },
  { value: 'Root Veg',  label: 'Root Veg'     },
  { value: 'Natural',   label: 'Natural'      },
  { value: 'Dairy',     label: 'Dairy'        },
  { value: 'Grains',    label: 'Grains'       },
];

export function useCategoryFilter() {
  const dispatch = useAppDispatch();
  const selectedCategory = useAppSelector((state) => state.content.selectedCategory);

  const handleCategoryClick = (category: string) => {
    dispatch(setCategory(category));
  };

  return { selectedCategory, handleCategoryClick, PRODUCE_CATEGORIES };
}