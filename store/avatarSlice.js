import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../util/api.js';

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
      const res = await api.get('/user/profile');
      return res.data.user;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to load user');
    }
  }
);

const avatarSlice = createSlice({
  name: 'avatar',
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => { state.loading = true; })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.user = null;
      });
  },
});

export const { clearUser } = avatarSlice.actions;
export default avatarSlice.reducer;