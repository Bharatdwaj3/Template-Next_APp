// hooks/useFollow.ts
'use client';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { followUserOnServer, unfollowUserFromServer, loadFollowingFromServer } from '@/store/followSlice';
import { toast } from 'react-hot-toast';

type EntityType = 'buyer' | 'farmer' | 'grocer';

export function useFollow(type: EntityType, userId: string) {
  const dispatch = useAppDispatch();
  const following = useAppSelector((state) => state.follow.following);
  const loading = useAppSelector((state) => state.follow.loading);
  const [isToggling, setIsToggling] = useState(false);
  
  const isFollowing = following.includes(userId);

  // Load following list from server on mount
  useEffect(() => {
    dispatch(loadFollowingFromServer());
  }, [dispatch]);

  const toggle = async () => {
    setIsToggling(true);
    try {
      if (isFollowing) {
        await dispatch(unfollowUserFromServer({ userId, type })).unwrap();
        toast.success('Unfollowed successfully');
      } else {
        await dispatch(followUserOnServer({ userId, type })).unwrap();
        toast.success('Followed successfully');
      }
    } catch (error: any) {
      toast.error(error || 'Failed to update follow status');
    } finally {
      setIsToggling(false);
    }
  };

  return { isFollowing, toggle, loading: loading || isToggling };
}