"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchProductsThunk } from "@/app/redux/features/products/productSlice";
import { fetchImagesThunk } from "@/app/redux/features/imageSlice";
import {
  addToCartThunk,
  addToWishlistThunk,
} from "@/app/redux/features/cart/cartSlice";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import "./product.css";

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  subcategory?: string;
  rating?: number;
  sellerId: number;
  images?: string[];
}

interface Image {
  id: number;
  url: string;
}

const LIMIT = 10;

export default function Product() {
  const dispatch = useAppDispatch();

  const userId = useAppSelector((state) => state.users.currentUser?.id);

  const products = useAppSelector(
    (state) => state.products.productData as Product[],
  );

  const total = useAppSelector((state) => state.products.total);

  const images = useAppSelector((state) => state.image.images as Image[]);

  const { searchValue, category, subcategory } = useAppSelector(
    (state) => state.search,
  );

  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ message, type });
  };

  const handleCloseSnackbar = () => setSnackbar(null);

  const [page, setPage] = useState(1);
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
    dispatch(
      fetchProductsThunk({
        page,
        limit: LIMIT,
        searchValue: debouncedSearch,
        category: debouncedCategory,
        subcategory: debouncedSubcategory,
      }),
    );
  }, [
    dispatch,
    page,
    debouncedSearch,
    debouncedCategory,
    debouncedSubcategory,
  ]);

  useEffect(() => {
    dispatch(fetchImagesThunk());
  }, [dispatch]);

  const [carouselIndex, setCarouselIndex] = useState(0);
  const visibleItems = Math.min(4, images.length);

  const prevSlide = () => setCarouselIndex((prev) => Math.max(prev - 1, 0));

  const nextSlide = () =>
    setCarouselIndex((prev) =>
      Math.min(prev + 1, images.length - visibleItems),
    );

  useEffect(() => {
    if (images.length === 0) return;

    const interval = setInterval(() => {
      setCarouselIndex((prev) =>
        prev < images.length - visibleItems ? prev + 1 : 0,
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [images, visibleItems]);

  return (
    <div className="home">
      {images.length > 0 && (
        <div className="relative w-full mb-8">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 gap-4"
              style={{
                transform: `translateX(-${
                  (100 / visibleItems) * carouselIndex
                }%)`,
              }}
            >
              {images.map((img) => (
                <div
                  key={img.id}
                  className="flex-shrink-0"
                  style={{ width: `${100 / visibleItems}%` }}
                >
                  <div className="carousel-card">
                    <img
                      src={img.url}
                      alt="carousel"
                      className="carousel-img"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button onClick={prevSlide} className="carousel-btn left">
            &#10094;
          </button>
          <button onClick={nextSlide} className="carousel-btn right">
            &#10095;
          </button>
        </div>
      )}

      {/* 🔹 PRODUCT GRID */}
      <div className="prod">
        {products.length > 0 ? (
          products.map((p) => (
            <div className="card" key={p.id}>
              <div className="card_image">
                <img
                  className="card_img"
                  src={p.images?.[0] ?? "/no-image.png"}
                  alt={p.title}
                />
              </div>

              <div className="card_body">
                <h3 className="property">{p.title}</h3>
                <p className="category">{p.category}</p>

                <div className="price">
                  <span className="amount">₹ {p.price}</span>
                  <span className="rating">⭐ {p.rating || 0}</span>
                </div>

                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    className="add_to_cart_btn"
                    onClick={async () => {
                      if (!userId) {
                        showSnackbar("Please login first", "error");
                        return;
                      }
                      try {
                        await dispatch(
                          addToCartThunk({
                            userId,
                            productId: p.id,
                            quantity: 1,
                            sellerId: p.sellerId,
                          }),
                        ).unwrap();
                        showSnackbar("Added to cart ✅", "success");
                      } catch {
                        showSnackbar("Failed to add to cart ❌", "error");
                      }
                    }}
                  >
                    Add to Cart
                  </button>

                  <button
                    className="add_to_cart_btn"
                    onClick={async () => {
                      if (!userId) {
                        showSnackbar("Please login first", "error");
                        return;
                      }
                      try {
                        await dispatch(
                          addToWishlistThunk({
                            userId,
                            productId: p.id,
                          }),
                        ).unwrap();
                        showSnackbar("Added to wishlist ✅", "success");
                      } catch {
                        showSnackbar("Already present in wishlist ❌", "error");
                      }
                    }}
                  >
                    Add to Wishlist
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>

      {/* 🔹 PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
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

      {/* 🔹 SNACKBAR */}
      <Snackbar
        open={!!snackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar?.type || "success"}
          sx={{ width: "100%" }}
        >
          {snackbar?.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
