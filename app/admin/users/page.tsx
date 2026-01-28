'use client';

import { useEffect, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import './users.css';
import { banUserThunk, unbanUserThunk, fetchAllUsersThunk } from '@/app/redux/features/users/userSlice';

export default function CustomersPage() {
  const dispatch = useAppDispatch();

  const { userData, loading } = useAppSelector(state => state.users);

  const customersOnly = userData.filter((user : any) => user.role === 'CUSTOMER');

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    dispatch(fetchAllUsersThunk());
  }, [dispatch]);

  const handleBanToggle = async (customer: any) => {
    let result;

    if (customer.is_banned) {
      result = await dispatch(unbanUserThunk(customer.id));
    } else {
      result = await dispatch(banUserThunk(customer.id));
    }

    if (banUserThunk.fulfilled.match(result) || unbanUserThunk.fulfilled.match(result)) {
      setSnackbarMsg(
        customer.is_banned ? 'Customer unbanned successfully' : 'Customer banned successfully'
      );
      setSnackbarType('success');
      // Refetch all users to update UI
      dispatch(fetchAllUsersThunk());
    } else {
      setSnackbarMsg(result.payload as string || 'Action failed');
      setSnackbarType('error');
    }

    setSnackbarOpen(true);
  };

  return (
    <div className="admin-containerrrr">
      <h1 className="admin-title">Customer Management</h1>

      {!customersOnly.length ? (
        <div className="admin-empty">No customers found</div>
      ) : (
        customersOnly.map((customer : any) => (
          <div key={customer.id} className="admin-row">
            <div>
              <strong>{customer.name}</strong>
              <p>{customer.email}</p>
            </div>

            <button
              className={customer.is_banned ? 'btn-unban' : 'btn-ban'}
              onClick={() => handleBanToggle(customer)}
              disabled={loading}
            >
              {customer.is_banned ? 'Unban' : 'Ban'}
            </button>
          </div>
        ))
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
