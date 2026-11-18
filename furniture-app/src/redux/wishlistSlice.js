import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import Cookies from 'js-cookie';

let apiBaseUrl = process.env.NEXT_PUBLIC_APIBASEURL;

export const fetchWishlist = createAsyncThunk("wishlist/fetchWishlist", async () => {
  try {
    let token = Cookies.get("token");
    if (!token) return [];

    const res = await axios.get(`${apiBaseUrl}web/wishlist/view`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data || [];
  } catch (err) {
    return [];
  }
});

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
  },
  reducers: {
    clearWishlist: (state) => {
      state.items = [];
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchWishlist.fulfilled, (state, action) => {
      state.items = action.payload;
    });
  }
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;