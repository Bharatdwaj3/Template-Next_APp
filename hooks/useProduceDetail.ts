// hooks/useProduceDetail.ts
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { markProduceVisited } from '@/store/contentSlice';
import { api } from '@/lib/api';

interface Produce {
  id:          string;
  name:        string;
  grower:      string;
  growerId:    string;
  location:    string;
  price:       number;
  unit:        string;
  rating:      number;
  reviews:     number;
  isOrganic:   boolean;
  isSeasonal:  boolean;
  category:    string;
  description: string;
  img:         string;
}

export function useProduceDetail(id: string) {
  const router   = useRouter();
  const dispatch = useAppDispatch();
  const [produce, setProduce] = useState<Produce | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProduce = async () => {
      try {
        const data = await api.get(`/produce/details/${id}`);

        if (!data) {
          router.replace('/features/produce');
          return;
        }

        setProduce(data.produce);
        dispatch(markProduceVisited(id));
      } catch {
        router.replace('/features/produce');
      } finally {
        setLoading(false);
      }
    };

    fetchProduce();
  }, [id, router, dispatch]);

  return { produce, loading, id };
}