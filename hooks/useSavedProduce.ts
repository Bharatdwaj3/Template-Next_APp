'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleSavedProduce } from '@/store/contentSlice';


export function useSavedProduce(id: string) {
  const dispatch    = useAppDispatch();
  const savedProduce = useAppSelector((state) => state.content.savedProduce);
  const isSaved     = savedProduce.includes(id);

  const toggle = () => dispatch(toggleSavedProduce(id));

  return { isSaved, toggle, savedProduce };
}