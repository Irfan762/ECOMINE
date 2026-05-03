const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const User = require('../models/User');

// Mock checkout session (in real life this would be Stripe/PayPal)
router.post('/checkout', verifyToken, async (req, res) => {
  try {
    const { plan } = req.body;
    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // In a real app, you'd redirect to a payment gateway here.
    // For this demo, we'll just upgrade them immediately.
    
    user.subscriptionTier = plan;
    user.subscriptionStatus = 'active';
    
    // Set expiry date to 30 days from now
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);
    user.subscriptionExpires = expiry;
    
    await user.save();

    res.json({ 
      message: 'Subscription activated successfully!',
      user: {
        subscriptionTier: user.subscriptionTier,
        subscriptionStatus: user.subscriptionStatus,
        subscriptionExpires: user.subscriptionExpires
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get current subscription status
router.get('/status', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('subscriptionTier subscriptionStatus subscriptionExpires');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
