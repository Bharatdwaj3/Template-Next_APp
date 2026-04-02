// hooks/useSavedProduce.ts
'use client';
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { saveProduceToServer, unsaveProduceFromServer, loadSavedProduceFromServer } from '@/store/contentSlice';
import { toast } from 'react-hot-toast';

export function useSavedProduce(id: string) {
  const dispatch = useAppDispatch();
  const savedProduce = useAppSelector((state) => state.content.savedProduce);
  const loading = useAppSelector((state) => state.content.loading);
  const [isSaving, setIsSaving] = useState(false);
  
  const isSaved = savedProduce.includes(id);

  // Load saved produce from server on mount
  useEffect(() => {
    if (id) {
      dispatch(loadSavedProduceFromServer());
    }
  }, [dispatch, id]);

  const toggle = async () => {
    setIsSaving(true);
    try {
      if (isSaved) {
        await dispatch(unsaveProduceFromServer(id)).unwrap();
        toast.success('Removed from saved produce');
      } else {
        await dispatch(saveProduceToServer(id)).unwrap();
        toast.success('Added to saved produce!');
      }
    } catch (error: any) {
      toast.error(error || 'Failed to update saved items');
    } finally {
      setIsSaving(false);
    }
  };

  return { isSaved, toggle, savedProduce, isSaving, loading };
}