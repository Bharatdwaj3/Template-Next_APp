// hooks/useFollow.ts
'use client';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleFollow, setFollowerCount, setFollowing } from '@/store/followSlice'; // ✅ added setFollowing
import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';

export function useFollow(farmerUserId: string) {
  const dispatch = useAppDispatch();
  const following = useAppSelector((state) => state.follow.following);
  const isFollowing = following.includes(farmerUserId);
  const [loading, setLoading] = useState(false);
  const [followerCount, setFollowerCountState] = useState(0);
  const [followingCount, setFollowingCountState] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await fetch(`/api/farmer/profile/${farmerUserId}/follow`);
        const data = await res.json();
        if (data.success) {
          setFollowerCountState(data.followerCount || 0);
          setFollowingCountState(data.followingCount || 0);
          dispatch(setFollowerCount(data.followerCount || 0));

           dispatch(setFollowing(
            data.isFollowing
              ? [...new Set([...following, farmerUserId])] 
              : following.filter((fid) => fid !== farmerUserId) 
          ));
        }
      } catch (err) {
        console.error('Failed to fetch counts:', err);
      }
    };

    if (farmerUserId) {
      fetchCounts();
    }
  }, [farmerUserId, dispatch]);

  const toggle = async () => {
    setLoading(true);
    const method = isFollowing ? 'DELETE' : 'POST';
    
    try {
      const res = await fetch(`/api/farmer/profile/${farmerUserId}/follow`, {
        method,
        headers: { 'Content-Type': 'application/json' },
      });
      
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || 'Failed');

      dispatch(toggleFollow(farmerUserId));
      setFollowerCountState(data.followerCount);
    //  setFollowingCountState(data.followingCount || followingCount);
      dispatch(setFollowerCount(data.followerCount));
      
      toast.success(isFollowing ? 'Unfollowed successfully' : 'Followed successfully');
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return { 
    isFollowing, 
    toggle, 
    loading, 
    followerCount,
    followingCount 
  };
}