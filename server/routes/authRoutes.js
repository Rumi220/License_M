const express = require('express');
const router = express.Router();

const { register, login, getMe } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Get current user info (only if logged in)
router.get('/me', authenticateToken, getMe);

module.exports = router;
