import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/first.css';
import '../css/auth.css';
import logo from '../assets/GP.png';

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'buyer',
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="landing-container">
      <header className="auth-header">
        <a href="/" className="back-link">Back to Home</a>
        <img src={logo} alt="GamePay Logo" className="logo-center" />
      </header>

      <main className="auth-main">
        <section className="auth-container">
          <div className="htext">
            <h1>Create your <span>GamePay Escrow</span> account</h1>
            <p>Register to get started with secure transactions.</p>

            <form onSubmit={handleRegister} className="auth-form">
              {error && <p className="auth-error">{error}</p>}

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                style={{
                  padding: '14px 20px',
                  borderRadius: '30px',
                  border: '1px solid #2c2c35',
                  backgroundColor: '#1a1a1f',
                  color: 'white',
                  fontSize: '16px',
                }}
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller</option>
              </select>

              <button type="submit" className="btn-primary">Register</button>
              <p className="auth-footer">
                Already have an account? <a href="/login">Login</a>
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

export default RegisterPage;
