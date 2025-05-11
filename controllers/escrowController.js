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
