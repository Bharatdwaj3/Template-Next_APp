import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  following: JSON.parse(localStorage.getItem('following') || '[]'), 
};

const followSlice = createSlice({
  name: 'follow',
  initialState,
  reducers: {
    toggleFollow: (state, action) => {
      const writerId = action.payload;
      const index = state.following.indexOf(writerId);
      
      if (index > -1) {
        state.following.splice(index, 1);
      } else {
        state.following.push(writerId);
      }
    },
    
    clearFollowing: (state) => {
      state.following = [];
      localStorage.removeItem('following');
    },
  },
});

export const { toggleFollow, clearFollowing } = followSlice.actions;
export default followSlice.reducer;