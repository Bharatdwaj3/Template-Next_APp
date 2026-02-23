import { useMemo, useEffect, useState } from 'react';
import api from '../util/api';

export function useContentList(ids, enabled = true) {
  const [stories, setStories] = useState([]);
  const [fetching, setFetching] = useState(false);

  const stableIds = useMemo(() => ids, [JSON.stringify(ids)]);
  useEffect(() => {
    if (!enabled || stableIds.length === 0) {
      setStories([]);
      return;
    }

    const fetchAll = async () => {
      setFetching(true);
      try {
        const results = await Promise.all(
          stableIds.map(id =>
            api.get(`/content/${id}`).then(res => res.data).catch(() => null)
          )
        );
        setStories(results.filter(Boolean));
      } catch (err) {
        console.error(err);
        setStories([]);
      } finally {
        setFetching(false);
      }
    };

    fetchAll();
  }, [stableIds, enabled]);

  return { stories, fetching };
}