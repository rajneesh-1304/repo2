import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import {
  getSellerProducts,
  addProduct,
  deleteProduct,
  getProductById,
} from './sellerService';

export interface Product {
  id: number;
  title: string;
  description?: string;
  price: number;
  category: string;
  subcategory?: string;
  quantity: number;
  rating?: number;
  images?: string;
}

interface SellerProductState {
  products: Product[];
  product: Product | null,
  loading: boolean;
  error: string | null;
  total: number;
}


const initialState: SellerProductState = {
  products: [],
  product: null,
  loading: false,
  error: null,
  total: 0,
};


export const fetchSellerProductsThunk = createAsyncThunk(
  'sellerProducts/fetch',
  async (
    {
      sellerId,
      limit = 10,
      page = 1,
      searchValue,
      category,
      subcategory
    }: { sellerId: number; limit?: number; page?: number; searchValue?: string; category?: string; subcategory?:string },
    { rejectWithValue }
  ) => {
    try {
      return await getSellerProducts(sellerId, limit, page, searchValue, category, subcategory);
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
    }
  }
);


export const addProductThunk = createAsyncThunk(
  'sellerProducts/add',
  async (productData: FormData, { rejectWithValue }) => {
    try {
      return await addProduct(productData);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to add product'
      );
    }
  }
);

export const deleteProductThunk = createAsyncThunk(
  'sellerProducts/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await deleteProduct(id);
      return id;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to delete product'
      );
    }
  }
);

export const fetchProductByIdThunk = createAsyncThunk(
  'sellerProducts/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      return await getProductById(id);
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || 'Failed to fetch product'
      );
    }
  }
);

const sellerProductSlice = createSlice({
  name: 'sellerProducts',
  initialState,
  reducers: {
    clearSellerProducts: (state) => {
      state.products = [];
      state.total = 0;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(fetchSellerProductsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchSellerProductsThunk.fulfilled,
        (state, action: PayloadAction<{ data: Product[]; total: number }>) => {
          state.loading = false;
          state.products = action.payload.data;
          state.total = action.payload.total;
        }
      )
      .addCase(fetchSellerProductsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(addProductThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addProductThunk.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          state.products.unshift(action.payload);
          state.total += 1;
        }
      )
      .addCase(addProductThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteProductThunk.fulfilled, (state, action) => {
        state.products = state.products.filter(
          (p) => p.id !== action.payload
        );
        state.total -= 1;
      })
      .addCase(fetchProductByIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.product = null;
      })
      .addCase(
        fetchProductByIdThunk.fulfilled,
        (state, action: PayloadAction<Product>) => {
          state.loading = false;
          state.product = action.payload;
        }
      )
      .addCase(fetchProductByIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSellerProducts } = sellerProductSlice.actions;
export default sellerProductSlice.reducer;
