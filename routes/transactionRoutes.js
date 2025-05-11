const express = require('express');
const Transaction = require('../models/EscrowTransaction'); // Assuming you have a model for transactions
const router = express.Router();

// Create a new transaction (escrow)
router.post('/create', async (req, res) => {
  const { buyer, seller, amount, product_name, product_description } = req.body;
  try {
    const newTransaction = new Transaction({
      buyer, seller, amount, product_name, product_description
    });
    await newTransaction.save();
    res.status(201).json({ message: 'Transaction created successfully', transaction: newTransaction });
  } catch (err) {
    res.status(400).json({ message: 'Error creating transaction', error: err.message });
  }
});

module.exports = router;
