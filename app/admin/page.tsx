'use client';

import Link from 'next/link';
import './admin.css';

export default function AdminDashboard() {
  return (
    <div className="admin-container" style={{marginTop:"40px"}}>
      <h1 className="admin-title">Admin Dashboard</h1>
      <p className="admin-subtitle">Manage users, sellers & products</p>

      <div className="admin-grid">
        <Link href="/admin/users" className="admin-card users">
          <h2>👤 Users</h2>
          <p>View & ban platform users</p>
        </Link>

        <Link href="/admin/sellers" className="admin-card sellers">
          <h2>🧑‍💼 Sellers</h2>
          <p>Manage sellers & permissions</p>
        </Link>

        <Link href="/admin/products" className="admin-card products">
          <h2>📦 Products</h2>
          <p>Ban or approve products</p>
        </Link>
      </div>
    </div>
  );
}
