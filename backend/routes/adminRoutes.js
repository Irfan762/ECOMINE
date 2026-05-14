const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserSubscription, deleteUser, getStats, createUser } = require('../controllers/adminController');
const { verifyToken } = require('../middleware/authMiddleware');
const User = require('../models/User');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    // Handle mock admin
    if (req.userId === 'mock-user-123' || req.userId === '507f1f77bcf86cd799439011') {
      return next();
    }

    if (require('mongoose').connection.readyState !== 1) {
      return next();
    }

    const user = await User.findById(req.userId);
    if (user && user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Access denied. Admin only.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error checking admin role' });
  }
};

router.use(verifyToken);
router.use(isAdmin);

router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/subscription', updateUserSubscription);
router.delete('/users/:id', deleteUser);
router.get('/stats', getStats);

module.exports = router;
