const mongoose = require('mongoose');

const escrowTransactionSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  itemDescription: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'funded', 'released', 'cancelled'],
    default: 'pending',
  },
  paymentReference: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('EscrowTransaction', escrowTransactionSchema);
