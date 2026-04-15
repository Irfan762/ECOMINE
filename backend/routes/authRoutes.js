const express = require('express');
const { body } = require('express-validator');
const { register, login, getCurrentUser } = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

// Register
router.post('/register', [
  body('name', 'Name is required').notEmpty(),
  body('email', 'Valid email is required').isEmail(),
  body('password', 'Password must be at least 6 characters').isLength({ min: 6 })
], register);

// Login
router.post('/login', [
  body('email', 'Valid email is required').isEmail(),
  body('password', 'Password is required').notEmpty()
], login);

// Get Current User
router.get('/me', verifyToken, getCurrentUser);

module.exports = router;
