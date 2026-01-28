import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  placeOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
  fetchAllOrders,
  getOrdersBySellerId
} from './orderService';

export const placeOrderThunk = createAsyncThunk(
  'orders/place',
  async (userId: number) => {
    return await placeOrder(userId);
  }
);

export const fetchUserOrdersThunk = createAsyncThunk(
  'orders/fetchUserOrders',
  async (userId: number) => {
    return await getUserOrders(userId);
  }
);

export const fetchAllOrderThunk = createAsyncThunk(
  'orders/fetchAllOrders',
  async () => {
    return await fetchAllOrders();
  }
)

export const fetchOrderByIdThunk = createAsyncThunk(
  'orders/fetchById',
  async (orderId: number) => {
    return await getOrderById(orderId);
  }
);

export const cancelOrderThunk = createAsyncThunk(
  'orders/cancel',
  async (orderId: number) => {
    return await cancelOrder(orderId);
  }
);

export const fetchOrdersBySellerIdThunk = createAsyncThunk(
  'orders/fetchBySellerId',
  async (userId: number) => {
    return await getOrdersBySellerId(userId);
  }
);


export const updateOrderStatusThunk = createAsyncThunk(
  'orders/updateStatus',
  async ({
    orderId,
    status,
  }: {
    orderId: number;
    status: string;
  }) => {
    return await updateOrderStatus(orderId, status);
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [] as any[],
    currentOrder: null as any,
    loading: false,
    error: null as string | null,
  },
  reducers: {
    clearCurrentOrder(state) {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(placeOrderThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(placeOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
        state.orders.unshift(action.payload);
      })
      .addCase(placeOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Order failed';
      })

      .addCase(fetchUserOrdersThunk.fulfilled, (state, action) => {
        state.orders = action.payload;
      })

      .addCase(fetchOrderByIdThunk.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })

      .addCase(cancelOrderThunk.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        state.orders = state.orders.map(order =>
          order.id === action.payload.id
            ? action.payload
            : order
        );
      })

      .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })

      .addCase(fetchOrdersBySellerIdThunk.fulfilled, (state, action) => {
        state.orders = action.payload;
      })

  },
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
