'use client';

import { useEffect, useState } from 'react';
import { useAppSelector } from '@/store/hooks';
import type { NerthusUser } from '@/store/avatarSlice';

export function useProfile() {
  const storeUser = useAppSelector((state) => state.avatar.user);

  const [profile, setProfile] = useState<NerthusUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (storeUser) {
        setProfile(storeUser);
        setLoading(false);
        return;
      }

      try {
        const res  = await fetch('/api/auth/profile');
        const data = await res.json();

        if (data.success) {
          setProfile(data.user);
        }
      } catch {
        console.error('Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [storeUser]);

  return { profile, loading, user: storeUser };
}