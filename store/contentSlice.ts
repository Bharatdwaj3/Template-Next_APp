// store/contentSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

function fromStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function toStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(value));
}

interface ContentState {
  savedProduce: string[];
  viewedProduce: string[];
  selectedCategory: string;
  searchQuery: string;
  loading: boolean;
  error: string | null;
}

const initialState: ContentState = {
  savedProduce: fromStorage<string[]>('nerthus_savedProduce', []),
  viewedProduce: fromStorage<string[]>('nerthus_viewedProduce', []),
  selectedCategory: 'all',
  searchQuery: '',
  loading: false,
  error: null,
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    toggleSavedProduce: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.savedProduce.indexOf(id);
      if (index > -1) {
        state.savedProduce.splice(index, 1);
      } else {
        state.savedProduce.push(id);
      }
      toStorage('nerthus_savedProduce', state.savedProduce);
    },
    markProduceVisited: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (!state.viewedProduce.includes(id)) {
        state.viewedProduce.unshift(id);
        if (state.viewedProduce.length > 50) {
          state.viewedProduce = state.viewedProduce.slice(0, 50);
        }
      }
      toStorage('nerthus_viewedProduce', state.viewedProduce);
    },
    clearViewHistory: (state) => {
      state.viewedProduce = [];
      toStorage('nerthus_viewedProduce', []);
    },
    setCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSavedProduce: (state) => {
      state.savedProduce = [];
      toStorage('nerthus_savedProduce', []);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  toggleSavedProduce,
  markProduceVisited,
  clearViewHistory,
  setCategory,
  setSearchQuery,
  clearSavedProduce,
  clearError,
} = contentSlice.actions;

export default contentSlice.reducer;