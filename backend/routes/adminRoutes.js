const express = require('express');
const router = express.Router();
const { getAllUsers, updateUserSubscription, deleteUser, getStats } = require('../controllers/adminController');
const { verifyToken } = require('../middleware/authMiddleware');
const User = require('../models/User');

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    // Handle mock admin
    if (req.userId === 'mock-user-123') {
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
router.put('/subscription', updateUserSubscription);
router.delete('/users/:id', deleteUser);
router.get('/stats', getStats);

module.exports = router;
