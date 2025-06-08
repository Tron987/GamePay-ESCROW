const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, default: '' }, // ✅ default empty
  password: { type: String, default: '' }, // ✅ default empty for Google login
  role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' }
});


const User = mongoose.model('User', userSchema);
module.exports = User;
