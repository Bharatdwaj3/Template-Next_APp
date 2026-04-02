'use client';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleSavedProduce } from '@/store/contentSlice';
import { toast } from 'react-hot-toast';

export function useSavedProduce(id: string) {
  const dispatch = useAppDispatch();
  const savedProduce = useAppSelector((state) => state.content.savedProduce);
  const isSaved = savedProduce.includes(id);

  const toggle = () => {
    dispatch(toggleSavedProduce(id));
    toast.success(isSaved ? 'Removed from saved produce' : 'Added to saved produce');
  };

  return { isSaved, toggle, savedProduce };
}