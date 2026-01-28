"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/app/redux/store";
import { useAppSelector } from "@/app/redux/hooks";
import "@/app/cart/cart.css";
import {
  fetchCartThunk,
  updateQuantityThunk,
  removeItemThunk,
  clearCartThunk,
} from "@/app/redux/features/cart/cartSlice";
import {
  fetchAddressThunk,
  addAddressThunk,
} from "@/app/redux/features/address/addressSlice";
import { placeOrderThunk } from "../redux/features/order/orderSlice";
import { useRouter } from "next/navigation";
import { Snackbar, Alert } from "@mui/material";
import { fetchCouponsThunk } from "../redux/features/couponSlice";

const getProductImage = (images: any) => {
  if (Array.isArray(images) && images.length > 0) return images[0];
  return "/no-image.png";
};

export default function CartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useAppSelector((state) => state.users.currentUser?.id);

  const cart = useAppSelector((state) => state.cart.cart);
  const cartItems = cart?.items || [];
  const router = useRouter();
  const address = useAppSelector((state) => state.address.address);
  const coupons = useAppSelector((state) => state.coupon.coupons);
  const [coupon, setCoupon] = useState("");
  const [totalAmt, setTotalAmt] = useState(0);
  console.log(coupons);

  const [modalOpen, setModalOpen] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [addressForm, setAddressForm] = useState({
    landmark: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
  });

  const [snackbar, setSnackbar] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchCouponsThunk());
      dispatch(fetchCartThunk(userId));
      dispatch(fetchAddressThunk(userId));
    }
  }, [userId, dispatch]);

  const totalAmount = cartItems.reduce(
    (sum: number, item: any) => sum + item.product.price * item.quantity,
    0,
  );

  const showSnackbar = (message: string, type: "success" | "error") => {
    setSnackbar({ message, type });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(null);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      showSnackbar("Your cart is empty!", "error");
      return;
    }

    if (!address || address.length === 0) {
      setModalOpen(true);
    } else {
      placeOrder(address[0]);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressForm.city || !addressForm.state || !addressForm.pincode) {
      showSnackbar("Please fill in all required fields!", "error");
      return;
    }

    setPlacingOrder(true);
    if (!userId) {
      return;
    }
    await dispatch(
      addAddressThunk({
        ...addressForm,
        userId,
      }),
    );

    await dispatch(fetchAddressThunk(userId));
    setModalOpen(false);
    placeOrder(addressForm);
  };

  const applyCoupon = () => {
    const c: any = coupons.filter((d: any) => d.code === coupon);
    const coup = c[0].discount;
    console.log(c[0].discount);
    const amt = (totalAmount * coup) / 100;
    setTotalAmt(amt);
    console.log(totalAmt);
  };

  const placeOrder = async (address: any) => {
    if (!userId) return;

    setPlacingOrder(true);

    try {
      await dispatch(placeOrderThunk(userId)).unwrap();
      await dispatch(clearCartThunk(userId));
      setCoupon("");
      showSnackbar(
        `Order placed successfully 🎉 Delivery: ${address.city}, ${address.state}, ${address.pincode}`,
        "success",
      );
    } catch (error) {
      console.error(error);
      showSnackbar("Failed to place order ❌", "error");
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="cart-container" style={{ marginTop: "50px" }}>
      <h1 className="cart-title">Shopping Cart</h1>
      <button
        className="order-history-btn"
        onClick={() => router.push("/orders")}
      >
        Order History
      </button>

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item: any) => (
            <div key={item.id} className="cart-item">
              <img
                src={getProductImage(item.product.images)}
                alt={item.product.title}
                className="cart-item-image"
              />
              <div className="cart-item-details">
                <h3>{item.product.title}</h3>
                <p className="cart-item-price">₹ {item.product.price}</p>
                <div className="quantity-controls">
                  <button
                    disabled={item.quantity === 1}
                    onClick={() =>
                      dispatch(
                        updateQuantityThunk({
                          itemId: item.id,
                          quantity: item.quantity - 1,
                        }),
                      )
                    }
                  >
                    −
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() =>
                      dispatch(
                        updateQuantityThunk({
                          itemId: item.id,
                          quantity: item.quantity + 1,
                        }),
                      )
                    }
                  >
                    +
                  </button>
                  <button
                    className="remove-btn"
                    onClick={() => dispatch(removeItemThunk(item.id))}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="cart-item-total">
                ₹ {item.product.price * item.quantity}
              </div>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Total Items</span>
            <span>{cartItems.length}</span>
          </div>
          <div className="summary-row total">
            <span>Total</span>
            <span>₹ {totalAmount}</span>
          </div>
          <div
            className="summary-row total bbbb"
            style={{ display: coupon ? "block" : "none" }}
          >
            <span>Amount After Discount</span>
            <span>₹ {totalAmt}</span>
          </div>

          <div>
            <input
              type="text"
              placeholder="Add Coupon"
              style={{ padding: "5px", width: "250px" }}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <button onClick={() => applyCoupon()}>Apply</button>
          </div>

          <button
            className="checkout-btn"
            onClick={handleCheckout}
            disabled={placingOrder}
          >
            {placingOrder ? "Processing..." : "Checkout"}
          </button>

          <button
            className="clear-cart-btn"
            onClick={() => userId && dispatch(clearCartThunk(userId))}
          >
            Clear Cart
          </button>
        </div>
      </div>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add Delivery Address</h2>
            <form onSubmit={handleAddressSubmit} className="address-form">
              <input
                type="text"
                placeholder="Landmark"
                value={addressForm.landmark}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, landmark: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="City *"
                value={addressForm.city}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, city: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="State *"
                value={addressForm.state}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, state: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Pincode *"
                value={addressForm.pincode}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, pincode: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Country"
                value={addressForm.country}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, country: e.target.value })
                }
              />
              <div className="modal-actions">
                <button
                  type="submit"
                  className="checkout-btn"
                  disabled={placingOrder}
                >
                  Save & Place Order
                </button>
                <button
                  type="button"
                  className="clear-cart-btn"
                  onClick={() => setModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
          {snackbar?.message || ""}
        </Alert>
      </Snackbar>
    </div>
  );
}
