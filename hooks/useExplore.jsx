import { useState } from 'react';
import { Clock, TrendingUp, Star } from 'lucide-react';

export const EXPLORE_CATEGORIES = [
  { id: 'all',        label: 'All Stories'  },
  { id: 'fiction',    label: 'Fiction'      },
  { id: 'technology', label: 'Technology'   },
  { id: 'lifestyle',  label: 'Lifestyle'    },
  { id: 'business',   label: 'Business'     },
  { id: 'science',    label: 'Science'      },
  { id: 'history',    label: 'History'      },
];

export const EXPLORE_FILTERS = [
  { id: 'recent',   label: 'Recent',   icon: Clock      },
  { id: 'trending', label: 'Trending', icon: TrendingUp  },
  { id: 'featured', label: 'Featured', icon: Star        },
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