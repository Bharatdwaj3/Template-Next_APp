'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleFollow } from '@/store/followSlice';

type EntityType = 'farmer' | 'grocer' | 'produce' | string;

export function useFollow(type: EntityType, id: string) {
  const dispatch  = useAppDispatch();
  const following = useAppSelector((s) => s.follow.following);

  const key         = `${type}:${id}`;
  const isFollowing = following.includes(key);
  const toggle      = () => dispatch(toggleFollow(key));

  const getFollowedByType = (t: EntityType) =>
    following
      .filter((k) => k.startsWith(`${t}:`))
      .map((k) => k.split(':')[1]);

  return { isFollowing, toggle, following, getFollowedByType };
}