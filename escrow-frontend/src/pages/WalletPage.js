/* global PaychanguCheckout */
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../css/wallet.css';

const Wallet = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [isPaychanguReady, setIsPaychanguReady] = useState(false);
  const location = useLocation();

  // Function to fetch wallet
  const fetchWalletData = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5000/api/users/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setWallet(data.user.wallet);
      setTransactions(data.user.wallet.transactions || []);
    } catch (error) {
      console.error('Error fetching wallet data:', error);
    }
  };

  // Handle redirect from PayChangu
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const txRef = params.get('tx_ref');

    if (txRef) {
      console.log('Returned with tx_ref:', txRef);
      fetchWalletData(); // Refresh wallet after payment

      // Clean up tx_ref from the URL
      const newUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }

    // Fix incorrect redirect with missing port
    if (window.location.hostname === 'localhost' && !window.location.port) {
      const correctedUrl = `http://localhost:3000${window.location.pathname}${window.location.search}`;
      console.warn('Incorrect redirect detected. Fixing...');
      window.location.href = correctedUrl;
    }
  }, [location]);

  // Fetch wallet and load PayChangu scripts
  useEffect(() => {
    fetchWalletData();

    if (window.jQuery && window.PaychanguCheckout) {
      setIsPaychanguReady(true);
      return;
    }

    const loadPaychangu = () => {
      const paychanguScript = document.createElement('script');
      paychanguScript.src = 'https://in.paychangu.com/js/popup.js';
      paychanguScript.async = true;
      paychanguScript.onload = () => {
        console.log('PayChangu loaded');
        setIsPaychanguReady(true);
      };
      document.body.appendChild(paychanguScript);
    };

    if (window.jQuery) {
      loadPaychangu();
    } else {
      const jQueryScript = document.createElement('script');
      jQueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
      jQueryScript.onload = loadPaychangu;
      document.body.appendChild(jQueryScript);
    }
  }, []);

  const makePayment = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    if (!isPaychanguReady || typeof PaychanguCheckout === 'undefined') {
      alert('Payment gateway is still loading. Please try again shortly.');
      return;
    }

    const txRef = '' + Math.floor(Math.random() * 1000000000 + 1);
    const baseUrl =
      window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : window.location.origin;

    const payload = {
      public_key: 'pub-test-9uC81abgFiPibuc2xAUblFToJdDOYbyj',
      tx_ref: txRef,
      amount: parseFloat(depositAmount),
      currency: 'MWK',
      return_url: `${baseUrl}/wallet`,
      callback_url: `${baseUrl}/wallet`,
      customer: {
        email: wallet?.user?.email || 'user@example.com',
        first_name: wallet?.user?.first_name || 'First',
        last_name: wallet?.user?.last_name || 'Last',
      },
      customization: {
        title: 'GamePay Wallet Deposit',
        description: 'Deposit to GamePay Wallet',
      },
      meta: {
        uuid: wallet?.user?._id || 'user-uuid',
        response: 'Deposit Response',
      },
    };

    console.log('Initiating PayChangu with:', payload);

    try {
      PaychanguCheckout(payload);
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initialize payment. Please try again.');
    }
  };

  if (!wallet) return <div className="wallet-page">Loading...</div>;

  return (
    <div className="wallet-page">
      <h1 className="wallet-header">Wallet</h1>

      <div className="wallet-balance">
        Balance: MK{wallet.balance.toFixed(2)}
      </div>

      <div className="wallet-actions">
        <button onClick={() => setShowDepositModal(true)}>Deposit</button>
        <button>Withdraw</button>
      </div>

      {showDepositModal && (
        <div className="modal-overlay">
          <div className="deposit-modal">
            <h3>Deposit to Wallet</h3>
            <input
              type="number"
              placeholder="Enter amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              min="100"
              step="100"
            />
            <div id="wrapper" style={{ minHeight: '300px', margin: '15px 0' }}></div>

            <div className="modal-actions">
              <button onClick={makePayment} className="proceed-btn">Proceed</button>
              <button onClick={() => setShowDepositModal(false)} className="cancel-btn">Cancel</button>
            </div>

            {!isPaychanguReady && (
              <p style={{ color: 'gray', marginTop: '10px' }}>
                Payment system is loading... Please wait
              </p>
            )}
          </div>
        </div>
      )}

      <div className="wallet-transactions">
        <h3>Recent Transactions</h3>
        {transactions.length === 0 ? (
          <p>No recent wallet transactions.</p>
        ) : (
          <table className="wallet-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr key={index}>
                  <td>{tx._id}</td>
                  <td>{tx.type}</td>
                  <td>MK{tx.amount.toFixed(2)}</td>
                  <td>{new Date(tx.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Wallet;
