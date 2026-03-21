import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface NerthusUser {
  id:          string;
  userName:    string;
  fullName:    string;
  email:       string;
  accountType: 'buyer' | 'farmer' | 'grocer';
  avatar:      string | null;
  isActive:    boolean;
  lastLogin:   string;
  createdAt:   string;
}

interface AvatarState {
  user:    NerthusUser | null;
  loading: boolean;
  error:   string | null;
}

const initialState: AvatarState = {
  user:    null,
  loading: false,
  error:   null,
};

export const fetchUser = createAsyncThunk(
  'avatar/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      let res = await fetch('/api/auth/profile');

      // Try refresh once if expired
      if (res.status === 401) {
        const refresh = await fetch('/api/auth/refresh', { method: 'POST' });
        if (!refresh.ok) {
          // Refresh failed — user is genuinely not logged in, stop here
          return rejectWithValue(null);
        }
        res = await fetch('/api/auth/profile');
      }

      if (!res.ok) return rejectWithValue(null);

      const data = await res.json();
      if (!data.success) return rejectWithValue(null);
      return data.user as NerthusUser;
    } catch {
      return rejectWithValue(null);
    }
  }
);

const avatarSlice = createSlice({
  name: 'avatar',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user    = null;
      state.error   = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error   = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user    = action.payload;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.loading = false;
        state.user    = null;
        // Don't set error — unauthenticated is normal, not an error
        state.error   = null;
      });
  },
});

export const { clearUser } = avatarSlice.actions;
export default avatarSlice.reducer;