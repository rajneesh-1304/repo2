import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getAddress, addAddress } from './addressService';

export const fetchAddressThunk = createAsyncThunk(
  'address/fetch',
  async (userId: number) => {
    return await getAddress(userId);
  }
);

export const addAddressThunk = createAsyncThunk(
  'address/add',
  async (addressData: {
    userId: number;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  }) => {
    return await addAddress(addressData);
  }
);

interface AddressState {
  address: any[];
  loading: boolean;
  error: string | null;
}

const initialState: AddressState = {
  address: [],
  loading: false,
  error: null,
};

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddressThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAddressThunk.fulfilled, (state, action) => {
        state.address = action.payload;
        state.loading = false;
      })
      .addCase(fetchAddressThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch address';
      })

      .addCase(addAddressThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(addAddressThunk.fulfilled, (state, action) => {
        state.address.push(action.payload);
        state.loading = false;
      })
      .addCase(addAddressThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add address';
      });
  },
});

export default addressSlice.reducer;
