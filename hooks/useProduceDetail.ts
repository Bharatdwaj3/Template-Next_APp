'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { markProduceViewed } from '@/store/contentSlice';

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
        const res  = await fetch(`/api/produce/${id}`);
        const data = await res.json();

        if (!res.ok || !data.success) {
          router.replace('/features/produce');
          return;
        }

        setProduce(data.produce);
        dispatch(markProduceViewed(id));
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