// hooks/useVisitedProduce.ts
'use client';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { markProduceVisited, clearVisitedProduce } from '@/store/contentSlice';
import { api } from '@/lib/api';
import { useState, useEffect } from 'react';

interface ProduceItem {
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
  farmerId: { 
    _id: string;
    fullName: string;
  };
}

export function useVisitedProduce() {
  const dispatch = useAppDispatch();
  const visitedIds = useAppSelector((state) => state.content.visitedProduce);
  const [visitedProduce, setVisitedProduce] = useState<ProduceItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadVisitedProduce = async () => {
    if (!visitedIds.length) {
      setVisitedProduce([]);
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.get('/produce/details/');
      if (response.success && response.produce) {
        const visited = response.produce
          .filter((p: ProduceItem) => visitedIds.includes(p._id))
          .slice(0, 10);
        setVisitedProduce(visited);
      }
    } catch (error) {
      console.error('Failed to load visited produce:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsVisited = (produceId: string) => {
    dispatch(markProduceVisited(produceId));
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear your browsing history?')) {
      dispatch(clearVisitedProduce());
      setVisitedProduce([]);
    }
  };

  useEffect(() => {
    loadVisitedProduce();
  }, [visitedIds]);

  return { visitedProduce, loading, markAsVisited, clearHistory, visitedCount: visitedIds.length };
}