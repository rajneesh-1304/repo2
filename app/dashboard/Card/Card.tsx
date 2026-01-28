'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface CartItem {
  id: number | string;
  title: string;
  thumbnail: string;
  price: number;
  quantity: number;
}

interface CardProps {
  id: number | string;
  title: string;
  thumbnail: string;
  price: number;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const Card: React.FC<CardProps> = ({
  id,
  title,
  thumbnail,
  price,
  cartItems,
  setCartItems,
}) => {
  const router = useRouter();
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const exists = cartItems.some(item => item.id === id);
    setAdded(exists);
  }, [cartItems, id]);

  const handleClick = () => {
    router.push(`/product/${id}`);
  };

  const addItem = () => {
    if (added) return;

    setCartItems(prev => [
      ...prev,
      { id, title, thumbnail, price, quantity: 1 },
    ]);

    setAdded(true);
  };

  return (
    <div className="card">
      <div className="card_image">
        <img className="card_img" src={thumbnail} alt={title} />
      </div>

      <div className="property">{title}</div>

      <div>
        <button className="product_detail" onClick={handleClick}>
          Product Detail
        </button>
      </div>

      <div className="price">
        <p className="amount">$ {price}</p>
        <button className="cart_button" onClick={addItem}>
          {added ? '✅ Added' : '🛒 Add'}
        </button>
      </div>
    </div>
  );
};

export default Card;
