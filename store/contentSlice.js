import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bookmarks: JSON.parse(localStorage.getItem('bookmarks') || '[]'),
  visitedArticles: JSON.parse(localStorage.getItem('visitedArticles') || '[]'),
  selectedCategory: 'all',
  searchQuery: '',
};

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    toggleBookmark: (state, action) => {
      const contentId = action.payload;
      const index = state.bookmarks.indexOf(contentId);
      
      if (index > -1) {
        state.bookmarks.splice(index, 1);
      } else {
        state.bookmarks.push(contentId);
      }
      
      localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
    },
    
      markAsVisited: (state, action) => {
      const contentId = action.payload;
      
      if (!state.visitedArticles.includes(contentId)) {
        state.visitedArticles.unshift(contentId);
      }
    },

    clearHistory: (state) => {
      state.visitedArticles = [];
    },

    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    
    clearBookmarks: (state) => {
      state.bookmarks = [];
    },
  },
});

export const { 
  markAsVisited,
  clearHistory,
  toggleBookmark, 
  setCategory, 
  setSearchQuery, 
  clearBookmarks 
} = contentSlice.actions;


export default contentSlice.reducer;