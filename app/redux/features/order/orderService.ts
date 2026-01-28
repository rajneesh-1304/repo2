import axios from 'axios';

const BASE_URL = process.env.BASE_URL;

export const placeOrder = async (userId: number) => {
  const res = await axios.post(`${BASE_URL}/orders/checkout`, {
    userId,
  });
  return res.data;
};

export const getUserOrders = async (userId: number) => {
  const res = await axios.get(`${BASE_URL}/orders`, {
    params: { userId },
  });
  return res.data;
};

export const getOrderById = async (orderId: number) => {
  const res = await axios.get(`${BASE_URL}/orders/${orderId}`);
  return res.data;
};

export const cancelOrder = async (orderId: number) => {
  const res = await axios.patch(`${BASE_URL}/orders/${orderId}/cancel`);
  return res.data;
};

export const updateOrderStatus = async (
  orderId: number,
  status: string,
) => {
  const res = await axios.patch(
    `${BASE_URL}/orders/${orderId}/status`,
    { status },
  );
  return res.data;
};

export const fetchAllOrders= async ()=>{
  const res=await axios.get(`${BASE_URL}/orders`);
  return res.data
}

export const getOrdersBySellerId = async (userId: number)=>{
  const res = await axios.get(`${BASE_URL}/orders/order/${userId}`)
  return res.data;
}