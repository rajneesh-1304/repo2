'use client';

import { useEffect, useState } from 'react';
import { Snackbar, Alert, Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import {
  fetchProductsThunk,
  banProductThunk,
  unbanProductThunk,
} from '@/app/redux/features/products/productSlice';
import './product.css';

export default function ProductsPage() {
  const dispatch = useAppDispatch();
  const { loading, total } = useAppSelector(state => state.products);
  const products = useAppSelector(state =>
  state.products.productData.map((p: any) => ({
    ...p,
    isActive: !p.isActive,
  }))
);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
  const [page, setPage] = useState(1);
  const limit = 10; // items per page

  const fetchProducts = async (pageNumber: number) => {
    await dispatch(fetchProductsThunk({ page: pageNumber, limit }));
  };

  useEffect(() => {
    fetchProducts(page);
  }, [dispatch, page]);

  const handleBanToggle = async (product: any) => {
    let result;
    if (product.isActive) {
      result = await dispatch(unbanProductThunk(product.id));
    } else {
      result = await dispatch(banProductThunk(product.id));
    }

    if (
      banProductThunk.fulfilled.match(result) ||
      unbanProductThunk.fulfilled.match(result)
    ) {
      setSnackbarMsg(
        product.is_Active ? 'Product unbanned successfully' : 'Product banned successfully'
      );
      setSnackbarType('success');
      fetchProducts(page); 
    } else {
      setSnackbarMsg(result.payload as string || 'Action failed');
      setSnackbarType('error');
    }

    setSnackbarOpen(true);
  };
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="admin-containerr" style={{ marginTop: '50px' }}>
      <h1 className="admin-title">Product Management</h1>

      {!products?.length ? (
        <div className="admin-empty">No products found</div>
      ) : (
        <>
          {products.map((product : any) => (
            
            <div key={product.id} className="admin-row">
              <div className="admin-info">
                <strong>{product.title}</strong>
                <p>₹{product.price}</p>
                <p className="admin-sub">
                  Seller: <b>{product.sellerId}</b>
                </p>
              </div>

              <button
                className={product.isActive ? 'btn-unban' : 'btn-ban'}
                onClick={() => handleBanToggle(product)}
                disabled={loading}
              >
                {product.isActive ? 'Unban' : 'Ban'}
              </button>
            </div>
          ))}

          {/* Pagination Buttons */}
          <div className="pagination">
            <Button
              variant="contained"
              disabled={page <= 1 || loading}
              onClick={() => setPage(prev => prev - 1)}
            >
              Previous
            </Button>
            <span style={{ margin: '0 10px' }}>
              Page {page} of {totalPages}
            </span>
            <Button
              variant="contained"
              disabled={page >= totalPages || loading}
              onClick={() => setPage(prev => prev + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2500}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
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
