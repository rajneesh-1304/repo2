"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { fetchWishlistThunk, removeItemFromWishlistThunk } from "@/app/redux/features/cart/cartSlice";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import "./wishlist.css";

interface WishlistItem {
  id: number;           // Wishlist record ID
  productId: number;    // Product ID
  title: string;
  price: number;
  category: string;
  subcategory?: string;
  sellerId: number;
  images?: string[];
}

const Page = () => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector(state => state.users.currentUser?.id);
  const wishlist = useAppSelector(state => state.cart.wishlist ?? []);


  const [snackbar, setSnackbar] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showSnackbar = (message: string, type: "success" | "error") => setSnackbar({ message, type });
  const handleCloseSnackbar = () => setSnackbar(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchWishlistThunk(Number(userId)));
    }
  }, [dispatch, userId]);

  const handleDelete = async (productId: number) => {
    if (!userId) return;
    try {
      await dispatch(removeItemFromWishlistThunk({ userId, productId })).unwrap();
      showSnackbar("Removed from wishlist ✅", "success");
    } catch (err: any) {
      console.error("Wishlist delete error:", err);
      showSnackbar(err?.message || "Failed to remove from wishlist ❌", "error");
    }
  };
  console.log('wishlist', wishlist)

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="wishlist-empty">
        <h2>Your wishlist is empty 💔</h2>
      </div>
    );
  }

  return (
    <div className="wishlist-container" >
      {Array.isArray(wishlist) && wishlist.map((wish : any) => (
        <div className="wishlist-card" key={wish.id}>
          <img
            src={wish.images?.[0] || "/placeholder.png"}
            alt={wish.title}
            className="wishlist-image"
          />

          <h3 className="wishlist-title">{wish.title}</h3>

          <p className="wishlist-category">
            {wish.category} • {wish.subcategory || "N/A"}
          </p>

          <p className="wishlist-price">₹{wish.price}</p>

          <div className="wishlist-footer">
            <p className="wishlist-seller">
              Seller: <b>{wish.sellerId}</b>
            </p>

            <button className="delete-btn" onClick={() => handleDelete(wish.id)}>
              Delete
            </button>
          </div>
        </div>
      ))}

      <Snackbar
        open={!!snackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar?.type || "success"} sx={{ width: "100%" }}>
          {snackbar?.message || ""}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Page;
