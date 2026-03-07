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
      const res = await fetch('api/auth/profile');
      if(res.status===401){
        return rejectWithValue('Not Authenticated');
      }

      const data=await res.json();

      if(!data.success){
        return rejectWithValue(data.message ?? 'Failed to load user');
      }
    } catch{
      return rejectWithValue('Network error. Could not load profile');
    }
  }
);

const avatarSlice = createSlice({
  name: 'avatar',
  initialState,
  reducers: {
    clearUser: (state) => {
      state.user = null;
      state.error = null;
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
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? 'Unknown error';
        state.user = null;
      });
  },
});

export const { clearUser } = avatarSlice.actions;
export default avatarSlice.reducer;