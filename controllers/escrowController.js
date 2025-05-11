const EscrowTransaction = require('../models/EscrowTransaction');

// Create a new transaction
exports.createTransaction = async (req, res) => {
  const { buyerId, sellerId, amount, itemDescription } = req.body;

  try {
    const transaction = new EscrowTransaction({
      buyerId,
      sellerId,
      amount,
      itemDescription,
    });

    await transaction.save();

    res.status(201).json({ message: 'Escrow transaction created', transaction });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all transactions for a user
exports.getUserTransactions = async (req, res) => {
  const { userId } = req.params;

  try {
    const transactions = await EscrowTransaction.find({
      $or: [{ buyerId: userId }, { sellerId: userId }]
    }).sort({ createdAt: -1 });

    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.fundTransaction = async (req, res) => {
    const { id } = req.params;
    const { paymentReference } = req.body;
  
    try {
      const transaction = await EscrowTransaction.findById(id);
      if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
  
      if (transaction.status !== 'pending')
        return res.status(400).json({ error: 'Transaction already funded or invalid state' });
  
      transaction.status = 'funded';
      transaction.paymentReference = paymentReference || 'Manual Payment';
      transaction.updatedAt = new Date();
      await transaction.save();
  
      res.json({ message: 'Escrow funded successfully', transaction });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
  exports.releaseFunds = async (req, res) => {
    const { id } = req.params;
  
    try {
      const transaction = await EscrowTransaction.findById(id);
      if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
  
      if (transaction.status !== 'funded')
        return res.status(400).json({ error: 'Only funded transactions can be released' });
  
      transaction.status = 'released';
      transaction.updatedAt = new Date();
      await transaction.save();
  
      // Trigger payout to seller here (e.g., mobile money or wallet credit)
      res.json({ message: 'Funds released to seller', transaction });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  
  exports.cancelTransaction = async (req, res) => {
    const { id } = req.params;
  
    try {
      const transaction = await EscrowTransaction.findById(id);
      if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
  
      if (transaction.status !== 'pending')
        return res.status(400).json({ error: 'Only pending transactions can be cancelled' });
  
      transaction.status = 'cancelled';
      transaction.updatedAt = new Date();
      await transaction.save();
  
      res.json({ message: 'Transaction cancelled', transaction });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  exports.raiseDispute = async (req, res) => {
    const { id } = req.params;
    const { reason } = req.body;
  
    try {
      const transaction = await EscrowTransaction.findById(id);
      if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
  
      if (transaction.status !== 'funded')
        return res.status(400).json({ error: 'Only funded transactions can be disputed' });
  
      transaction.status = 'disputed';
      transaction.disputeReason = reason || 'No reason provided';
      transaction.updatedAt = new Date();
      await transaction.save();
  
      res.json({ message: 'Transaction disputed', transaction });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  exports.adminResolveDispute = async (req, res) => {
    const { id } = req.params;
    const { action } = req.body; // 'release' or 'refund'
  
    try {
      const transaction = await EscrowTransaction.findById(id);
      if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
  
      if (transaction.status !== 'disputed')
        return res.status(400).json({ error: 'Transaction is not under dispute' });
  
      if (action === 'release') {
        transaction.status = 'released';
      } else if (action === 'refund') {
        transaction.status = 'refunded';
      } else {
        return res.status(400).json({ error: 'Invalid action. Use "release" or "refund".' });
      }
  
      transaction.updatedAt = new Date();
      await transaction.save();
  
      res.json({ message: `Transaction ${action}d by admin`, transaction });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
  
