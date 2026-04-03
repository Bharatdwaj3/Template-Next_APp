import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FollowState {
  following: string[];
  followerCount: number;
}

const loadFollowing = (): string[] => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem('nerthus_following');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveFollowing = (following: string[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('nerthus_following', JSON.stringify(following));
};

const initialState: FollowState = {
  following: loadFollowing(),
  followerCount: 0,
};

const followSlice = createSlice({
  name: 'follow',
  initialState,
  reducers: {
    // Only modifies 'following' - NEVER touches 'followerCount'
    toggleFollow: (state, action: PayloadAction<string>) => {
      const userId = action.payload;
      const index = state.following.indexOf(userId);
      if (index > -1) {
        state.following.splice(index, 1);
      } else {
        state.following.push(userId);
      }
      saveFollowing(state.following);
    },
    
    setFollowing: (state, action: PayloadAction<string[]>) => {
      state.following = action.payload;
      saveFollowing(state.following);
    },
    
    // ONLY called from page.tsx with API data
    setFollowerCount: (state, action: PayloadAction<number>) => {
      state.followerCount = action.payload;
    },
    
    clearFollowing: (state) => {
      state.following = [];
      state.followerCount = 0;
      saveFollowing([]);
    },
  },
});

export const { toggleFollow, setFollowing, setFollowerCount, clearFollowing } = followSlice.actions;
export default followSlice.reducer;