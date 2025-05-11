const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getUserTransactions
} = require('../controllers/escrowController');

router.post('/create', createTransaction);
router.get('/user/:userId', getUserTransactions);

module.exports = router;
