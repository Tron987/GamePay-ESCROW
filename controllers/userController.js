const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const nodemailer = require('nodemailer');
const Wallet = require('../models/Wallet');
const Escrow = require('../models/EscrowTransaction'); 

const axios = require('axios');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Register with email & password
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, phone, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
    await Wallet.create({ userId: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login with email/password
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login/Register with Google


exports.googleLogin = async (req, res) => {
  const { tokenId } = req.body;

  try {
    // 1. Get Google user info
    const googleUser = await axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo',
      { headers: { Authorization: `Bearer ${tokenId}` } }
    );

    console.log("Google user data:", googleUser.data);

    const { email, name, email_verified } = googleUser.data;

    if (!email_verified) {
      return res.status(400).json({ error: 'Email not verified by Google' });
    }

    // 2. Check if user exists
    let user = await User.findOne({ email });
    console.log("Existing user from DB:", user);


    // 3. If not, create a new user
    if (!user) {
      user = new User({
        name: name || 'Google User',
        email,
        phone: '', // default empty
        password: '', // empty password for Google login
        role: 'buyer'
      });
      await user.save();
      console.log("User saved to DB:", user);


      // Create wallet for the user
      await Wallet.create({ userId: user._id });
    }

    // 4. Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });

  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ error: 'Google login failed' });
  }
};


exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });

    const wallet = await Wallet.findOne({ userId: user._id });
    const escrows = await Escrow.find({
      $or: [{ buyer: user._id }, { seller: user._id }]
    }).sort({ createdAt: -1 });

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        wallet: wallet || { balance: 0 },
        escrows: escrows || []
      }
    });
  } catch (err) {
    console.error("getCurrentUser error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Request password reset (send email)
exports.requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    // Send email using nodemailer (SMTP must be configured)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: `"GamePay Escrow" <${process.env.SMTP_EMAIL}>`,
      to: user.email,
      subject: 'Password Reset',
      html: `<p>Click the link below to reset your password:</p><a href="${process.env.CLIENT_URL}/reset-password/${resetToken}">Reset Password</a>`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Password reset email sent' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Confirm password reset
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(400).json({ error: 'Invalid token' });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Token expired or invalid' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

