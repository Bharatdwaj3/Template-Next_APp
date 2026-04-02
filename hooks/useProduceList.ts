// hooks/useProduceList.ts
'use client';
import { useMemo, useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Produce {
  id:       string;
  name:     string;
  price:    number;
  unit:     string;
  grower:   string;
  location: string;
  rating:   number;
  img:      string;
}

export function useProduceList(ids: string[], enabled = true) {
  const [produce, setProduce] = useState<Produce[]>([]);
  const [fetching, setFetching] = useState(false);
  const stableIds = useMemo(() => ids, [ids]);

  useEffect(() => {
    if (!enabled || stableIds.length === 0) {
      setProduce([]);
      return;
    }

    const fetchAll = async () => {
      setFetching(true);
      try {
        const results = await Promise.all(
          stableIds.map((id) =>
            api.get(`/produce/details/${id}`)
              .then((d) => (d.success ? d.produce : null))
              .catch(() => null)
          )
        );
        setProduce(results.filter(Boolean) as Produce[]);
      } catch {
        setProduce([]);
      } finally {
        setFetching(false);
      }
    };

    fetchAll();
  }, [stableIds, enabled]);

  return { produce, fetching };
}