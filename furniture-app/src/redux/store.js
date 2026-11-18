"use client"
import { configureStore } from "@reduxjs/toolkit";
import cartSlice from './cartSlice'
import userSlice from './userSlice';
import userReducer from './userSlice';
import wishlistReducer from './wishlistSlice'
export let store = configureStore(
    {
        reducer:{
            cartStore: cartSlice,
            wishlistStore: wishlistReducer,
            user: userSlice,
            userStore: userReducer,
        }
    }
)