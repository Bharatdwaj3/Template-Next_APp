import {configureStore} from "@reduxjs/toolkit";
import avatarReducer from './avatarSlice';
import contentReducer from './contentSlice';
import followReducer from './followSlice';

export const store=configureStore({
    reducer:{
        avatar: avatarReducer,
        content: contentReducer,
        follow: followReducer,
    },
});

