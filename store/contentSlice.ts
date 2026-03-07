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
  savedProduce:     string[];
  viewedProduce:    string[];
  selectedCategory: string;
  searchQuery:      string;
}

const initialState: ContentState = {
  savedProduce: fromStorage<string[]>('nerthus_savedProduce', []),
  viewedProduce: fromStorage<string[]>('nerthus_viewedProduce', []),
  selectedCategory: 'all',
  searchQuery: '',
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
      
      if (!state.visitedProduce.includes(id)) {
        state.visitedProduce.unshift(id);
      }
      toStorage('nerthus_viewedProduce', state.viewedProduce);
    },

    clearViewHistory: (state) => {
      state.visitedProduce = [];
      toStorage('nerthus_viewedProduce', []);
    },

    setCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;
    },
    
    setSearchQuery: (state, action:PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    
    clearSavedProduce: (state) => {
      state.savedProduce = [];
      toStorage('nerthus_savedProduce', [])
    },
  },
});

export const { 
  toggleSavedProduce, 
  markProduceVisited,
  clearViewHistory,
  setCategory, 
  setSearchQuery, 
  clearSavedProduce 
} = contentSlice.actions;


export default contentSlice.reducer;