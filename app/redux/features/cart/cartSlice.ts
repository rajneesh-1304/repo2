import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  addToWishlist,
  getWishlist,
  deleteWishlist,
} from './cartService';

interface RemoveWishlistPayload {
  userId: number;
  productId: number;
}

interface WishlistItem {
  id: number;           
  title: string;
  price: number;
  category: string;
  subcategory?: string;
  sellerId: number;
  images?: string[];
}

interface CartState {
  cart: any;
  wishlist: any;
  loading: boolean;
  error: string | null;
}

const initialState: CartState = {
  cart: null as any,
    loading: false,
    error: null as string | null,
    wishlist: [] as WishlistItem[],
};

// Thunks
export const fetchCartThunk = createAsyncThunk(
  'cart/fetch',
  async (userId: number) => getCart(userId)
);

export const addToCartThunk = createAsyncThunk(
  'cart/add',
  async (data: { userId: number; productId: number; quantity: number; sellerId: number }) =>
    addToCart(data)
);

export const updateQuantityThunk = createAsyncThunk(
  'cart/update',
  async ({ itemId, quantity }: { itemId: number; quantity: number }) =>
    updateCartItem(itemId, quantity)
);

export const removeItemThunk = createAsyncThunk(
  'cart/remove',
  async (itemId: number) => removeCartItem(itemId)
);

export const clearCartThunk = createAsyncThunk(
  'cart/clear',
  async (userId: number) => clearCart(userId)
);

export const addToWishlistThunk = createAsyncThunk(
  'wishlist/add',
  async (data: { userId: number; productId: number }) => addToWishlist(data)
);

export const fetchWishlistThunk = createAsyncThunk(
  'wishlist/fetch',
  async (userId: number) => getWishlist(userId)
);

export const removeItemFromWishlistThunk = createAsyncThunk(
  'wishlist/remove',
  async ({ userId, productId }: RemoveWishlistPayload) =>
    deleteWishlist({ userId, productId })
);

// Slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // --- Cart ---
    builder
      .addCase(fetchCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartThunk.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading = false;
      })
      .addCase(fetchCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch cart';
      })

      .addCase(addToCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCartThunk.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading = false;
      })
      .addCase(addToCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add to cart';
      })

      .addCase(updateQuantityThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateQuantityThunk.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading = false;
      })
      .addCase(updateQuantityThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update quantity';
      })

      .addCase(removeItemThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeItemThunk.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading = false;
      })
      .addCase(removeItemThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove item';
      })

      .addCase(clearCartThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCartThunk.fulfilled, (state) => {
        state.cart = null;
        state.loading = false;
      })
      .addCase(clearCartThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to clear cart';
      });

    // --- Wishlist ---
    builder
      .addCase(fetchWishlistThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlistThunk.fulfilled, (state, action) => {
        state.wishlist = action.payload;
        console.log('action', action.payload)
        state.loading = false;
      })
      .addCase(fetchWishlistThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch wishlist';
      })

      .addCase(addToWishlistThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToWishlistThunk.fulfilled, (state, action) => {
        state.wishlist = action.payload;
        state.loading = false;
      })
      .addCase(addToWishlistThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add to wishlist';
      })

      .addCase(removeItemFromWishlistThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeItemFromWishlistThunk.fulfilled, (state, action) => {
        state.wishlist = action.payload; 
        state.loading = false;
      })
      .addCase(removeItemFromWishlistThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to remove from wishlist';
      });
  },
});

export default cartSlice.reducer;
