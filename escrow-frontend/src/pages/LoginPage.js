import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/first.css';
import '../css/auth.css';
import logo from '../assets/GP.png';
import googleIcon from '../assets/google.png'; // Ensure you have a Google icon image


function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleLogin = () => {
  setGoogleLoading(true);
  setError(null);

  const client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  let timeoutId;

  const client = window.google.accounts.oauth2.initTokenClient({
    client_id,
    scope: 'openid email profile',
    callback: async (response) => {
      clearTimeout(timeoutId); // clear timeout when callback is invoked

      if (response.error || !response.access_token) {
        setError('Google login failed or was cancelled.');
        setGoogleLoading(false);
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/users/google-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tokenId: response.access_token }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        localStorage.setItem('token', data.token);
        navigate('/dashboard');
      } catch (err) {
        setError(err.message);
        setGoogleLoading(false);
      }
    },
  });

  client.requestAccessToken();

  // Timeout after 10 seconds if no response
  timeoutId = setTimeout(() => {
    setGoogleLoading(false);
    setError('Google login was cancelled or took too long.');
  }, 10000);
};



  const handleResetPassword = () => {
    navigate('/reset-password');
  };

  return (
    <div className="landing-container">
      <header className="auth-header">
        <a href="/" className="back-link">Back to Home</a>
        <img src={logo} alt="GamePay Logo" className="logo-center" />
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </header>

      <main className="auth-main">
        <section className="auth-container">
          <div className="htext">
            <h1>Login to <span>GamePay Escrow</span></h1>
            <p>Access your secure transactions and wallet.</p>
            <form onSubmit={handleLogin} className="auth-form">
              {error && <p className="auth-error">{error}</p>}

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button type="submit" className="btn-primary">Login</button>

              <p className="auth-footer" style={{ marginTop: '10px' }}>
  <button
    type="button"
    onClick={handleResetPassword}
    style={{
      background: 'none',
      border: 'none',
      padding: 0,
      font: 'inherit',
      color: 'blue',
      textDecoration: 'underline',
      cursor: 'pointer',
    }}
  >
    Forgot password?
  </button>
</p>


              <div className="or-separator">or</div>

<div className="google-login-wrapper">
  <div
    onClick={handleGoogleLogin}
    className="google-icon-clickable"
    title="Sign in with Google"
  >
    {googleLoading ? (
      <span className="google-loading-text">Signing in...</span>
    ) : (
      <img
        src={googleIcon}
        alt="Sign in with Google"
        className="google-login-icon"
      />
    )}
  </div>
</div>


              <p className="auth-footer">
                Don't have an account? <a href="/register">Register</a>
              </p>
            </form>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>GamePay Escrow © 2025. A sub-brand of <strong>GamePay</strong>.</p>
      </footer>
    </div>
  );
}

export default LoginPage;
