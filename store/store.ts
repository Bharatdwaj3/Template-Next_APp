// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import avatarReducer from './avatarSlice';
import contentReducer from './contentSlice';
import followReducer from './followSlice';

const loadInitialState = () => {
  if (typeof window === 'undefined') return {};
  
  try {
    const following = localStorage.getItem('nerthus_following');
    return {
      follow: {
        following: following ? JSON.parse(following) : [],
      },
    };
  } catch {
    return {};
  }
};

export const store = configureStore({
  reducer: {
    avatar: avatarReducer,
    content: contentReducer,
    follow: followReducer,
  },
  preloadedState: loadInitialState(), // Load saved data on startup
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;