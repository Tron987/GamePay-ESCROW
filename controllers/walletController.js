const Wallet = require('../models/Wallet');

// Fund Wallet (e.g. after PayChangu success)
exports.fundWallet = async (req, res) => {
  const { userId, amount } = req.body;
  try {
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) return res.status(404).json({ error: 'Wallet not found' });

    wallet.availableBalance += amount;
    await wallet.save();

    res.json({ message: 'Wallet funded', balance: wallet.availableBalance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Lock Funds in Escrow
exports.lockEscrow = async (userId, amount) => {
  const wallet = await Wallet.findOne({ userId });
  if (!wallet || wallet.availableBalance < amount) throw new Error('Insufficient balance');

  wallet.availableBalance -= amount;
  wallet.escrowBalance += amount;
  await wallet.save();
};

// Release Funds to Seller
exports.releaseEscrow = async (buyerId, sellerId, amount) => {
  const buyerWallet = await Wallet.findOne({ userId: buyerId });
  const sellerWallet = await Wallet.findOne({ userId: sellerId });

  if (!buyerWallet || !sellerWallet || buyerWallet.escrowBalance < amount) {
    throw new Error('Invalid wallets or insufficient escrow balance');
  }

  buyerWallet.escrowBalance -= amount;
  await buyerWallet.save();

  sellerWallet.availableBalance += amount;
  await sellerWallet.save();
};

// Refund to Buyer
exports.refundEscrow = async (userId, amount) => {
  const wallet = await Wallet.findOne({ userId });
  if (!wallet || wallet.escrowBalance < amount) throw new Error('Insufficient escrow balance');

  wallet.escrowBalance -= amount;
  wallet.availableBalance += amount;
  await wallet.save();
};

// View Wallet Balance
exports.getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ userId: req.params.userId });
    if (!wallet) return res.status(404).json({ error: 'Wallet not found' });

    res.json(wallet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
