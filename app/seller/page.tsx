'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchSellerProductsThunk } from '../redux/features/seller/sellerSlice';
import Card from '../../components/SellerCard/SellerCard';
import { useRouter } from 'next/navigation';
import './order/order.css'

interface CardProps {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  subcategory: string;
  quantity: number;
  rating: number;
  images: string[];
}

const LIMIT = 10;

const Page = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const products = useAppSelector((state) => state.seller.products);
  const total = useAppSelector((state) => state.seller.total);
  const { searchValue, category, subcategory } = useAppSelector((state) => state.search);
  const router = useRouter();

  const [page, setPage] = useState(1);

  const sellerId = currentUser?.id;
  const totalPages = Math.ceil(total / LIMIT);
  const [debouncedSearch, setDebouncedSearch] = useState(searchValue);
  const [debouncedCategory, setDebouncedCategory] = useState(category);
  const [debouncedSubcategory, setDebouncedSubcategory] = useState(subcategory);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchValue);
      setDebouncedCategory(category);
      setDebouncedSubcategory(subcategory);
      setPage(1);
    }, 1000);

    return () => clearTimeout(handler);
  }, [searchValue, category, subcategory]);

  useEffect(() => {
    if (sellerId) {
      dispatch(
        fetchSellerProductsThunk({
          sellerId,
          limit: LIMIT,
          page,
          searchValue: debouncedSearch,
          category: debouncedCategory,
          subcategory: debouncedSubcategory,
        })
      );
    }
  }, [dispatch, sellerId, page, debouncedSearch, debouncedCategory, debouncedSubcategory]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
        Welcome, <strong>{currentUser?.name}</strong> (Seller) 👋
      </h2>

      <div className="view-orders-container">
        <button
          className="view-orders-btn"
          onClick={() => router.push('/seller/order')}
        >
          View Orders
        </button>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
        {products && products.length > 0 ? (
          products.map((product) => (
            <Card
              key={product.id}
              id={product.id}
              title={product.title}
              description={product.description || ""}
              price={product.price}
              category={product.category}
              subcategory={product.subcategory || ""}
              quantity={product.quantity}
              rating={product.rating || 0}
              images={Array.isArray(product.images) ? product.images : []}
            />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>

      {totalPages > 1 && (
        <div style={{
          bottom: '0', marginBottom: '1rem', marginTop: '1rem', display: 'flex', justifyContent: "center", gap: '1rem'
        }}>
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Page;