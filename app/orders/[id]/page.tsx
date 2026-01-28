'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'next/navigation';
import { AppDispatch } from '@/app/redux/store';
import { useAppSelector } from '@/app/redux/hooks';
import { fetchOrderByIdThunk } from '@/app/redux/features/order/orderSlice';
import './order.css';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const orderId = Number(id);

  const dispatch = useDispatch<AppDispatch>();
  const { currentOrder, loading } = useAppSelector(state => state.order);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrder = async () => {
      await dispatch(fetchOrderByIdThunk(orderId));
    };

    fetchOrder();
  }, [orderId, dispatch]);

  if (loading || !currentOrder) return <p>Loading order details...</p>;

  return (
    <div className="cart-container" style={{ marginTop: "60px" }}>
      <h1 className="cart-title">Order #{currentOrder.id}</h1>

      <p>Status: {currentOrder.status}</p>
      <p>Total Amount: ₹ {currentOrder.totalAmount}</p>
      <p>Placed On: {new Date(currentOrder.createdAt).toLocaleString()}</p>

      <h3>Items</h3>
      {currentOrder.items.map((item: any) => (
        <div key={item.id} className="order-item-card">
          <p><strong>{item.productName}</strong></p>
          <p>Price: ₹ {item.price}</p>
          <p>Quantity: {item.quantity}</p>
          <p>Subtotal: ₹ {Number(item.price) * item.quantity}</p>
        </div>
      ))}
    </div>
  );
}
