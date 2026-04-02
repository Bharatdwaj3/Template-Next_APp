// store/contentSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { api } from '@/lib/api';

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

// Async thunk to save a produce item
export const saveProduceToServer = createAsyncThunk(
  'content/saveProduceToServer',
  async (produceId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(`/buyer/saved/${produceId}`);
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      return { produceId, action: 'save' };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to save');
    }
  }
);

// Async thunk to unsave a produce item
export const unsaveProduceFromServer = createAsyncThunk(
  'content/unsaveProduceFromServer',
  async (produceId: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/buyer/saved/${produceId}`);
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      return { produceId, action: 'unsave' };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unsave');
    }
  }
);

// Async thunk to load saved produce from server
export const loadSavedProduceFromServer = createAsyncThunk(
  'content/loadSavedProduceFromServer',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/buyer/saved');
      if (!response.success) {
        return rejectWithValue(response.message);
      }
      const savedIds = response.savedProduce.map((item: any) => 
        typeof item === 'string' ? item : item._id
      );
      return savedIds;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to load saved items');
    }
  }
);

interface ContentState {
  savedProduce:     string[];
  viewedProduce:    string[];
  selectedCategory: string;
  searchQuery:      string;
  loading:          boolean;
  error:            string | null;
}

const initialState: ContentState = {
  savedProduce:     fromStorage<string[]>('nerthus_savedProduce', []),
  viewedProduce:    fromStorage<string[]>('nerthus_viewedProduce', []),
  selectedCategory: 'all',
  searchQuery:      '',
  loading:          false,
  error:            null,
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    // Local toggle (fallback when offline)
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
  extraReducers: (builder) => {
    builder
      // Save produce
      .addCase(saveProduceToServer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveProduceToServer.fulfilled, (state, action) => {
        state.loading = false;
        const { produceId } = action.payload;
        if (!state.savedProduce.includes(produceId)) {
          state.savedProduce.push(produceId);
          toStorage('nerthus_savedProduce', state.savedProduce);
        }
      })
      .addCase(saveProduceToServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Unsave produce
      .addCase(unsaveProduceFromServer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unsaveProduceFromServer.fulfilled, (state, action) => {
        state.loading = false;
        const { produceId } = action.payload;
        const index = state.savedProduce.indexOf(produceId);
        if (index > -1) {
          state.savedProduce.splice(index, 1);
          toStorage('nerthus_savedProduce', state.savedProduce);
        }
      })
      .addCase(unsaveProduceFromServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Load saved produce from server
      .addCase(loadSavedProduceFromServer.pending, (state) => {
        state.loading = true;
      })
      .addCase(loadSavedProduceFromServer.fulfilled, (state, action) => {
        state.loading = false;
        state.savedProduce = action.payload;
        toStorage('nerthus_savedProduce', state.savedProduce);
      })
      .addCase(loadSavedProduceFromServer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
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