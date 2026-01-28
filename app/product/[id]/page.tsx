'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch } from '@/app/redux/hooks';
import './detail.css';
import { fetchProductByIdThunk } from '@/app/redux/features/seller/sellerSlice';
import { useParams } from 'next/navigation';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  rating?: number;
  quantity?: number;
  category?: string;
  subcategory?: string;
  images?: string[];
}


const ProductPage = () => {
  const dispatch = useAppDispatch();
  const params = useParams();
  const productId = Number(params.id);
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (productId) {
        const response = await dispatch(fetchProductByIdThunk(productId));
        setProduct(response.payload);
      }
    };

    fetchProduct();
  }, [dispatch, productId]);


  return (
    <div className="product-page">
      <div className="product-card">
        <div className="product-grid">

          <div className="product-images">
            {product?.images && product?.images.length > 0 ? (
              <img
                src={product.images[0]}
                alt={product?.title ?? "Product image"}
                className="main-image"
              />
            ) : (
              <img
                src="/no-image.png"
                alt="No image"
                className="main-image"
              />
            )}
          </div>


          <div className="product-details">
            <h1 className="product-title">{product?.title}</h1>

            <p className="product-description">{product?.description}</p>

            <p className="product-price">₹{product?.price}</p>

            <div className="product-meta">
              <span>⭐ {product?.rating}</span>
              <span>Stock: {product?.quantity}</span>
            </div>

            <div className="product-info">
              <p><strong>Category:</strong> {product?.category}</p>
              <p><strong>Subcategory:</strong> {product?.subcategory}</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductPage;
