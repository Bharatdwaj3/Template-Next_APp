// store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import avatarReducer  from './avatarSlice';
import contentReducer from './contentSlice';
import followReducer  from './followSlice';

export const store = configureStore({
  reducer: {
    avatar:  avatarReducer,
    content: contentReducer,
    follow:  followReducer,
  },
});

export type AppStore    = typeof store;
export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;