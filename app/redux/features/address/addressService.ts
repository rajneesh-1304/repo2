import axios from 'axios';
const URL=process.env.BASE_URL;
const BASE_URL = `${URL}/address`; 

export const getAddress = async (userId: number) => {
  const res = await axios.get(BASE_URL, { params: { userId } });
  return res.data;
};

export const addAddress = async (addressData: {
  userId: number;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}) => {
  const res = await axios.post(BASE_URL, addressData);
  return res.data;
};
