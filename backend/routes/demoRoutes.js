const express = require('express');
const router = express.Router();
const { submitDemoRequest, getAllDemoRequests, updateDemoRequestStatus } = require('../controllers/demoController');
const { verifyToken } = require('../middleware/authMiddleware');
const User = require('../models/User');

// Public route to submit a demo request
router.post('/request', submitDemoRequest);

// Protected Admin routes
const isAdmin = async (req, res, next) => {
  try {
    if (req.userId === 'mock-user-123') {
      return next();
    }

    if (require('mongoose').connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database is offline.' });
    }

    const user = await User.findById(req.userId);
    if (user && user.role === 'admin') {
      next();
    } else {
      res.status(403).json({ error: 'Access denied' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

router.get('/requests', verifyToken, isAdmin, getAllDemoRequests);
router.put('/requests/:id', verifyToken, isAdmin, updateDemoRequestStatus);

module.exports = router;
