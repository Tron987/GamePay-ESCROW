const express = require('express');
const router = express.Router();
const { register, login, googleLogin, requestPasswordReset, resetPassword } = require('../controllers/UserController');

router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

module.exports = router;
