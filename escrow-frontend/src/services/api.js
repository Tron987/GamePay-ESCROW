// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import './dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [escrows, setEscrows] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchUserData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/users/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setUser(data.user);
        setWallet(data.user.wallet);
        setEscrows(data.user.escrows || []);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
    fetchUserData();
  }, []);

  if (!user || !wallet) return <div className="dashboard-container">Loading...</div>;

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {user.name}</h1>
        <button className="btn-primary" onClick={() => {
          localStorage.clear();
          window.location.href = '/login';
        }}>Logout</button>
      </header>

      <div className="cards-container">
        <div className="card">
          <h2>Wallet Balance</h2>
          <p>${wallet.balance.toFixed(2)}</p>
        </div>
        <div className="card">
          <h2>Transactions</h2>
          <p>{escrows.length} Escrow Deals</p>
        </div>
      </div>

      <section className="escrows-section">
        <h2>Your Escrow Transactions</h2>
        {escrows.length === 0 ? (
          <p>No escrow transactions yet.</p>
        ) : (
          <table className="escrow-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {escrows.map((escrow, index) => (
                <tr key={index}>
                  <td>{escrow._id}</td>
                  <td>${escrow.amount}</td>
                  <td>{escrow.status}</td>
                  <td>{new Date(escrow.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
