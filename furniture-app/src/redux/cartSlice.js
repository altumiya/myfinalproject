"use client"
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie'
let apiBaseUrl = process.env.NEXT_PUBLIC_APIBASEURL;

export const fetchCartbyId = createAsyncThunk("cart/fetchCartbyIdStatus", async () => {
  try {
    let token = Cookies.get("token");

    return await axios
      .get(`${apiBaseUrl}web/cart/view-cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.data)
      .then((finalRes) => finalRes.data);
  } catch (err) {
    return [];
  }
});
const mycart = createSlice({
  name: "cart",
  initialState: {
    cart: [],
  },
  reducers: {
    clearCart: (state) => {
      state.cart = [];
    }
  },
  extraReducers:(builder)=>{
    builder.addCase(fetchCartbyId.fulfilled, (state, action) => {
      // Add user to the state array
      //action.payload  createAsyncThunk  API Data
       state.cart=action.payload
    })
  }
});

export const { addToCart, deleteCart, changeQty, clearCart } = mycart.actions;
export default mycart.reducer;