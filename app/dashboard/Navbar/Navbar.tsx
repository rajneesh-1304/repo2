'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/app/redux/hooks';
import { logout } from '@/app/redux/features/users/userSlice';
import AddProductModal from '../Modal/AddProduct';
import './navbar.css';

interface NavbarProps {
  searchValue: string;
  setSearchValue: (val: string) => void;
  category: string;
  setCategory: (val: string) => void;
  subcategory: string;
  setSubcategory: (val: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({
  searchValue,
  setSearchValue,
  category,
  setCategory,
  subcategory,
  setSubcategory,
}) => {
  const currentUser = useAppSelector((state) => state.users.currentUser);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  const subcategoriesMap: Record<string, string[]> = {
    electronics: ['Mobiles', 'Laptops', 'Headphones', 'Smartphone'],
    books: ['Fiction', 'Non-fiction', 'Educational'],
    grocery: ['Fruits', 'Vegetables', 'Snacks'],
  };

  const currentSubcategories = category ? subcategoriesMap[category.toLowerCase()] || [] : [];

  return (
    <div className="navbar">
      <h1 className="heading" onClick={() => router.push('/')}>
        Flipkart
      </h1>

      <input
        className="search_bar"
        placeholder="Search for products"
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />

      <select
        className="category_select"
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
          setSubcategory(''); 
        }}
      >
        <option value="">All Categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Books">Books</option>
        <option value="Grocery">Grocery</option>
      </select>

      <select
        className="category_select"
        value={subcategory}
        onChange={(e) => setSubcategory(e.target.value)}
        disabled={!category}
      >
        <option value="">All Subcategories</option>
        {currentSubcategories.map((sub, idx) => (
          <option key={idx} value={sub}>
            {sub}
          </option>
        ))}
      </select>

      {currentUser?.role === 'SELLER' && (
        <button className="cart_button" onClick={() => setIsModalOpen(true)}>
          Add Product
        </button>
      )}

      {currentUser?.role === 'CUSTOMER' && (
        <button className="cart_button" onClick={() => router.push('/cart')}>
          Cart
        </button>
      )}

      {currentUser?.role === 'CUSTOMER' && (
        <button className="cart_button" onClick={() => router.push('/wishlist')}>
          WishList
        </button>
      )}

      <div className="auth_section">
        {!currentUser ? (
          <button onClick={() => router.push('/login')} className="nav_btn">
            Login
          </button>
        ) : (
          <button onClick={handleLogout} className="nav_btn logout">
            Logout
          </button>
        )}
      </div>

      {isModalOpen && <AddProductModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};

export default Navbar;
