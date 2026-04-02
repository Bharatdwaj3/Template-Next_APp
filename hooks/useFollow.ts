'use client';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleFollow } from '@/store/followSlice';
import { toast } from 'react-hot-toast';

export function useFollow(userId: string) {
  const dispatch = useAppDispatch();
  const following = useAppSelector((state) => state.follow.following);
  const isFollowing = following.includes(userId);

  const toggle = () => {
    dispatch(toggleFollow(userId));
    toast.success(isFollowing ? 'Unfollowed successfully' : 'Followed successfully');
  };

  return { isFollowing, toggle };
}