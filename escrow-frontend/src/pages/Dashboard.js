// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import logo from '../assets/GP.png';
import '../css/dashboard.css';

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
    <div className="dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <img src={logo} alt="GamePay Logo" className="logo" />
        <nav className="nav">
          <a href="/dashboard" className="active">Dashboard</a>
          <a href="/profile">Profile</a>
          <a href="/settings">Settings</a>
          <a href="/wallet">Wallet</a>
          <button onClick={() => {
            localStorage.clear();
            window.location.href = '/login';
          }}>Logout</button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="dashboard-header">
          <h1>Welcome, {user.name}</h1>
        </header>

        <section className="cards-container">
          <div className="card wallet-card">
            <h3>Wallet Balance</h3>
            <p>MK{wallet.balance.toFixed(2)}</p>
          </div>
          <div className="card">
            <h3>Escrow Transactions</h3>
            <p>{escrows.length} Deals</p>
          </div>
        </section>

        <section className="escrows-section">
          <h2>Your Escrow Transactions</h2>
          {escrows.length === 0 ? (
            <p>No escrow transactions yet.</p>
          ) : (
            <div className="escrow-table-container">
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
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
