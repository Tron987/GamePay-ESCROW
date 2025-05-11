const express = require('express');
const router = express.Router();
const {
  createTransaction,
  getUserTransactions,
  fundTransaction,
  releaseFunds,
  cancelTransaction,
  raiseDispute,
  adminResolveDispute
} = require('../controllers/escrowController');

router.post('/create', createTransaction);
router.get('/user/:userId', getUserTransactions);
router.post('/fund/:id', fundTransaction);
router.post('/release/:id', releaseFunds);
router.post('/cancel/:id', cancelTransaction);
router.post('/dispute/:id', raiseDispute);
router.post('/admin-resolve/:id', adminResolveDispute);


module.exports = router;
