import React from 'react';
import '../css/first.css';
import logo from '../assets/GP.png';
function LandingPage() {
    
  return (
    <div className="landing-container">
      <header className="header">
        <img src={logo} alt="GamePay Logo" className="logo" />
        <nav className="nav-links">
          <a href="#how-it-works">How It Works</a>
          <a href="#story">The Story</a>
          <a href="#features">Features</a>
          <a href="#contact">Contact</a>
          <a href="/login" className="btn">Get Started</a>
        </nav>
      </header>

      <section className="hero">
        <div className="hero-text">
          <h1>Secure Peer-to-Peer Payments with <br /><span>GamePay Escrow</span></h1>
          <p>Don't let trust issues stop your deals. GamePay Escrow holds funds safely until both sides are satisfied.</p>
          <a href="/login" className="btn-primary">Create Your Escrow
          </a>
        </div>
        <div className="hero-visual">
          <img src="https://www.shutterstock.com/image-illustration/secure-payment-design-260nw-589663346.jpg" alt="Escrow Steps" className="escrow-flow" />
        </div>
      </section>

      <section id="how-it-works" className="how-it-works">
        <h2>How Escrow Works</h2>
        <div className="steps">
          <div className="step">
            <h3>1. Buyer Deposits Funds</h3>
            <p>The buyer places money into GamePay Escrow instead of sending directly to the seller.</p>
          </div>
          <div className="step">
            <h3>2. Seller Delivers Product</h3>
            <p>The seller delivers the item or service confidently, knowing the funds are secure.</p>
          </div>
          <div className="step">
            <h3>3. Buyer Confirms</h3>
            <p>The buyer receives the product and confirms it's as expected.</p>
          </div>
          <div className="step">
            <h3>4. Funds Released</h3>
            <p>GamePay Escrow releases payment to the seller — simple, safe, fair.</p>
          </div>
        </div>
      </section>

      <section id="story" className="story-section">
        <h2 className="story-title">A Real-World Example</h2>
        <p className="story-subtitle">
          Meet James. He found a rare gaming headset on Facebook Marketplace but didn’t trust the seller.
        </p>
        <div className="steps">
          <div className="step">
            <h3>James uses GamePay Escrow</h3>
            <p>Instead of paying directly, he creates a GamePay Escrow deal. His funds are held securely while the seller is notified.</p>
          </div>
          <div className="step">
            <h3>Seller ships the headset</h3>
            <p>The seller sees the escrow confirmation and sends the headset to James — no stress, no scams.</p>
          </div>
          <div className="step">
            <h3>Everyone’s happy</h3>
            <p>James confirms delivery and GamePay releases the funds. Trust built, deal done.</p>
          </div>
        </div>
        <p className="story-bottom">
          Whether it’s a Facebook Marketplace trade, buying game coins, or freelancing — GamePay Escrow keeps your transactions safe and honest.
        </p>
      </section>

      <footer className="footer">
        <p>GamePay Escrow © 2025. A sub-brand of <strong>GamePay</strong>.</p>
      </footer>
    </div>
  );
}

export default LandingPage;
