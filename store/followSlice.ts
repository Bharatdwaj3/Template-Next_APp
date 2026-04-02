// store/followSlice.ts

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

interface FollowState {
  following: string[];
}

const initialState: FollowState = {
  following: fromStorage<string[]>('nerthus_following', []),
};

const followSlice = createSlice({
  name: 'follow',
  initialState,
  reducers: {
    toggleFollow: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      const index = state.following.indexOf(userId);
      if (index > -1) {
        state.following.splice(index, 1);
      } else {
        state.following.push(userId);
      }
      toStorage('nerthus_following', state.following);
    },
    clearFollowing: (state) => {
      state.following = [];
      toStorage('nerthus_following', []);
    },
  },
});

export const { toggleFollow, clearFollowing } = followSlice.actions;
export default followSlice.reducer;