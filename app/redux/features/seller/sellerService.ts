import axios from "axios";
import { setSubcategory } from "../search/searchSlice";

const BASE_URL = process.env.BASE_URL;

export const addProduct = async (productData: any) => {
  try {
    const res = await axios.post(`${BASE_URL}/products/addproduct`, productData);
    return res.data;
  } catch (error) {
    console.error("Error in Adding Product:", error);
    throw error;
  }
};

export const getProducts = async (
  limit = 10,
  page = 1,
  searchVal = "",
  category = "",
  sellerId?: number
) => {
  try {
    let url = `${BASE_URL}/products?limit=${limit}&page=${page}&title=${searchVal}&category=${category}`;

    if (sellerId) {
      url += `&sellerId=${sellerId}`;
    }

    const res = await axios.get(url);
    return res.data;
  } catch (error) {
    console.error("Error in Fetching Products:", error);
    throw error;
  }
};

export const getSellerProducts = async (
  sellerId: number,
  limit = 10,
  page = 1,
  searchVal?: string,
  category?: string,
  subcategory?:string
) => {
  try {
    const url = `${BASE_URL}/products?sellerId=${sellerId}&limit=${limit}&page=${page}&title=${searchVal}&category=${category}&subcategory=${subcategory}`;
    const res = await axios.get(url);
    return res.data;
  } catch (error: any) {
    console.error('Error in Fetching Seller Products:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch products');
  }
};

export const getProductById = async (id: number | string) => {
  try {
    const res = await axios.get(`${BASE_URL}/products/${id}`);
    return res.data.product;
  } catch (error) {
    console.error("Error in Fetching Product:", error);
    throw error;
  }
};

export const updateProduct = async (
  id: number | string,
  productData: any
) => {
  try {
    const res = await axios.patch(`${BASE_URL}/products/update/${id}`, productData);
    return res.data;
  } catch (error) {
    console.error("Error in Updating Product:", error);
    throw error;
  }
};

export const deleteProduct = async (id: number | string) => {
  try {
    const res = await axios.delete(`${BASE_URL}/products/${id}`);
    return res.data;
  } catch (error) {
    console.error("Error in Deleting Product:", error);
    throw error;
  }
};
