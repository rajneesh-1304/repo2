"use client";

import { useEffect, useState } from "react";
import { Snackbar, Alert } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import "./seller.css";
import {
  banUserThunk,
  unbanUserThunk,
  fetchAllUsersThunk,
} from "@/app/redux/features/users/userSlice";

export default function SellersPage() {
  const dispatch = useAppDispatch();

  const { userData, loading } = useAppSelector((state) => state.users);

  const sellersOnly = userData?.filter((user: any) => user.role === "SELLER");

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarType, setSnackbarType] = useState<"success" | "error">(
    "success",
  );

  useEffect(() => {
    dispatch(fetchAllUsersThunk());
  }, [dispatch]);

  const handleBanToggle = async (seller: any) => {
    let result;

    if (seller.is_banned) {
      result = await dispatch(unbanUserThunk(seller.id));
    } else {
      result = await dispatch(banUserThunk(seller.id));
    }

    if (
      banUserThunk.fulfilled.match(result) ||
      unbanUserThunk.fulfilled.match(result)
    ) {
      setSnackbarMsg(
        seller.is_banned
          ? "Seller unbanned successfully"
          : "Seller banned successfully",
      );
      setSnackbarType("success");
      dispatch(fetchAllUsersThunk());
    } else {
      setSnackbarMsg((result.payload as string) || "Action failed");
      setSnackbarType("error");
    }

    setSnackbarOpen(true);
  };

  return (
    <div className="admin-containerrr">
      <h1 className="admin-title">Seller Management</h1>

      {!sellersOnly?.length ? (
        <div className="admin-empty">No sellers found</div>
      ) : (
        sellersOnly.map((seller: any) => (
          <div key={seller.id} className="admin-row">
            <div>
              <strong>{seller.name}</strong>
              <p>{seller.email}</p>
            </div>

            <button
              className={seller.is_banned ? "btn-unban" : "btn-ban"}
              onClick={() => handleBanToggle(seller)}
              disabled={loading}
            >
              {seller.is_banned ? "Unban" : "Ban"}
            </button>
          </div>
        ))
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarType}
          variant="filled"
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </div>
  );
}
