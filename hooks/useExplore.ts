// hooks/useExplore.ts
'use client';
import { useState } from 'react';
import { Clock, TrendingUp, Star, Leaf } from 'lucide-react';

export const EXPLORE_CATEGORIES = [
  { id: 'all', label: 'All Produce' },
  { id: 'Vegetables', label: 'Vegetables' },
  { id: 'Fruits', label: 'Fruits' },
  { id: 'Herbs', label: 'Herbs' },
  { id: 'Root Veg', label: 'Root Veg' },
  { id: 'Natural', label: 'Natural' },
  { id: 'Dairy', label: 'Dairy' },
  { id: 'Grains', label: 'Grains' },
];

export const EXPLORE_FILTERS = [
  { id: 'recent', label: 'Newest', icon: Clock },
  { id: 'trending', label: 'Popular', icon: TrendingUp },
  { id: 'featured', label: 'Top Rated', icon: Star },
  { id: 'organic', label: 'Organic', icon: Leaf },
];

export function useExplore() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState('recent');
  
  const categoryFilter = selectedCategory === 'all' ? null : selectedCategory;

  return {
    selectedCategory,
    setSelectedCategory,
    selectedFilter,
    setSelectedFilter,
    categoryFilter,
    categories: EXPLORE_CATEGORIES,
    filters: EXPLORE_FILTERS,
  };
}