const express = require('express');
const router = express.Router();
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const { register,
     login, 
     googleLogin, 
     requestPasswordReset, 
     resetPassword, 
     getAllUsers, 
     getCurrentUser } = require('../controllers/UserController');


router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);
router.get('/users', protect, authorizeRoles('admin'), getAllUsers);
router.get('/me', protect, getCurrentUser);

module.exports = router;
