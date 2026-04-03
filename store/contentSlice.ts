
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ContentState {
  savedProduce: string[];
  visitedProduce: string[];
  searchQuery: string;
  selectedCategory: string;
}

const getCurrentUserId = (): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  return localStorage.getItem('currentUserId') || undefined;
};

const loadFromLocalStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === 'undefined') return fallback;
  try {
    const userId = getCurrentUserId();
    const finalKey = userId ? `${key}_${userId}` : key;
    const saved = localStorage.getItem(finalKey);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    return fallback;
  }
};

const saveToLocalStorage = <T,>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;
  const userId = getCurrentUserId();
  const finalKey = userId ? `${key}_${userId}` : key;
  localStorage.setItem(finalKey, JSON.stringify(value));
};

const initialState: ContentState = {
  savedProduce: loadFromLocalStorage<string[]>('nerthus_savedProduce', []),
  visitedProduce: loadFromLocalStorage<string[]>('nerthus_visitedProduce', []),
  searchQuery: '',
  selectedCategory: 'all',
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
      saveToLocalStorage('nerthus_savedProduce', state.savedProduce);
    },

    markProduceVisited: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const index = state.visitedProduce.indexOf(id);
      if (index > -1) state.visitedProduce.splice(index, 1);
      state.visitedProduce.unshift(id);
      if (state.visitedProduce.length > 20) {
        state.visitedProduce = state.visitedProduce.slice(0, 20);
      }
      saveToLocalStorage('nerthus_visitedProduce', state.visitedProduce);
    },

    clearVisitedProduce: (state) => {
      state.visitedProduce = [];
      saveToLocalStorage('nerthus_visitedProduce', []);
    },

    clearSavedProduce: (state) => {
      state.savedProduce = [];
      saveToLocalStorage('nerthus_savedProduce', []);
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    setCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    rehydrate: (state) => {
  state.savedProduce = loadFromLocalStorage<string[]>('nerthus_savedProduce', []);
  state.visitedProduce = loadFromLocalStorage<string[]>('nerthus_visitedProduce', []);
},
  },
});

export const {
  rehydrate,
  toggleSavedProduce,
  markProduceVisited,
  clearVisitedProduce,
  clearSavedProduce,
  setSearchQuery,
  setCategory,
} = contentSlice.actions;

export default contentSlice.reducer;