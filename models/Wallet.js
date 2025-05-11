// models/Wallet.js
const mongoose = require('mongoose');

const WalletSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  availableBalance: { type: Number, default: 0 },
  escrowBalance: { type: Number, default: 0 },
  currency: { type: String, default: 'USD' },
}, { timestamps: true });

module.exports = mongoose.model('Wallet', WalletSchema);
