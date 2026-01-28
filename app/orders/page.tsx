'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { AppDispatch } from '@/app/redux/store';
import { useAppSelector } from '@/app/redux/hooks';
import { fetchUserOrdersThunk, cancelOrderThunk } from '@/app/redux/features/order/orderSlice';
import { Snackbar, Alert } from '@mui/material';
import './orders.css';

export default function OrdersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const userId = useAppSelector(state => state.users.currentUser?.id);
  const { orders, loading } = useAppSelector(state => state.order);

  const [snackbar, setSnackbar] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserOrdersThunk(userId));
    }
  }, [userId, dispatch]);

  const handleCancel = async (orderId: number) => {
    try {
      await dispatch(cancelOrderThunk(orderId)).unwrap();
      setSnackbar({ message: 'Order cancelled successfully ✅', type: 'success' });
    } catch (error) {
      setSnackbar({ message: 'Failed to cancel order ❌', type: 'error' });
    }
  };

  const handleViewDetails = (orderId: number) => {
    router.push(`/orders/${orderId}`);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(null);
  };

  if (loading) return <p>Loading orders...</p>;
  if (!orders.length) return <p>No orders found</p>;

  return (
    <div className="cart-container" style={{ marginTop: '60px' }}>
      <h1 className="cart-title">Order History</h1>

      {orders.map((order: any) => (
        <div key={order.id} className="order-card">
          <p><strong>Order #{order.id}</strong></p>
          <p>Status: {order.status}</p>
          <p>Total: ₹ {order.totalAmount}</p>
          <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>

          <div className="order-actions">
            <button
              className="view-btn"
              onClick={() => handleViewDetails(order.id)}
            >
              View Details
            </button>

            {order.status === 'INPROCESS' && (
              <button
                className="cancel-btn"
                onClick={() => handleCancel(order.id)}
              >
                Cancel Order
              </button>
            )}
          </div>
        </div>
      ))}

      {snackbar && (
        <Snackbar
          open={!!snackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.type}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      )}
    </div>
  );
}
