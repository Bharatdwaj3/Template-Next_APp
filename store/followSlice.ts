// store/followSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FollowState {
  following: string[];
  followerCount: number;
}

const loadFromStorage = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('nerthus_following');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const loadFollowerCount = (): number => {
  if (typeof window === 'undefined') return 0;
  try {
    const raw = localStorage.getItem('nerthus_follower_count');
    return raw ? parseInt(raw, 10) : 0;
  } catch {
    return 0;
  }
};

const saveToStorage = (following: string[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('nerthus_following', JSON.stringify(following));
};

const saveFollowerCount = (count: number) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('nerthus_follower_count', String(count));
};

const initialState: FollowState = {
  following: loadFromStorage(),
  followerCount: loadFollowerCount(),
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
        state.followerCount = Math.max(0, state.followerCount - 1);
      } else {
        state.following.push(userId);
        state.followerCount = state.followerCount + 1;
      }
      saveToStorage(state.following);
      saveFollowerCount(state.followerCount); // persist after every toggle
    },
    setFollowing: (state, action: PayloadAction<string[]>) => {
      state.following = action.payload;
      saveToStorage(state.following);
    },
    // seeds from API data on page load and persists it
    setFollowerCount: (state, action: PayloadAction<number>) => {
      state.followerCount = action.payload;
      saveFollowerCount(action.payload); // persist when seeded too
    },
    clearFollowing: (state) => {
      state.following = [];
      state.followerCount = 0;
      saveToStorage([]);
      saveFollowerCount(0);
    },
  },
});

export const { toggleFollow, setFollowing, setFollowerCount, clearFollowing } = followSlice.actions;
export default followSlice.reducer;