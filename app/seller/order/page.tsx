"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchOrdersBySellerIdThunk } from "@/app/redux/features/order/orderSlice";
import './order.css'

const OrderItemsPage = () => {
  const dispatch = useAppDispatch();

  const sellerId = useAppSelector(
    (state) => state.users.currentUser?.id
  );

  const items =
    useAppSelector((state) => state.order.orders) || [];

  const loading = useAppSelector(
    (state) => state.order.loading
  );

  useEffect(() => {
    if (!sellerId) return;
    dispatch(fetchOrdersBySellerIdThunk(sellerId));
  }, [sellerId, dispatch]);

  if (loading) return <p>Loading items...</p>;

  if (!Array.isArray(items) || items.length === 0) {
    return <p>No items found</p>;
  }

  return (
    <div className="cart-container" style={{ marginTop: "60px" }}>
      <h1 className="cart-title">All Ordered Items</h1>

      {items.map((item: any) => (
        <div key={item.id} className="order-card">
          <p><strong>Product:</strong> {item.productName}</p>
          <p><strong>Price:</strong> ₹ {item.price}</p>
          <p><strong>Quantity:</strong> {item.quantity}</p>
        </div>
      ))}
    </div>
  );
};

export default OrderItemsPage;
