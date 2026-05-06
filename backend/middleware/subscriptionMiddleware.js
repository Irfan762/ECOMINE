const User = require('../models/User');

const checkSubscription = async (req, res, next) => {
  try {
    // Handle mock user
    if (req.userId === 'mock-user-123') {
      return next();
    }

    if (require('mongoose').connection.readyState !== 1) {
      console.warn('⚠️ Database is offline. Operating in Offline/Mock mode.');
      req.userId = req.userId || 'mock-user-123';
      return next(); 
    }

    const user = await User.findById(req.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Admins always have access
    if (user.role === 'admin') {
      return next();
    }

    if (user.subscriptionStatus !== 'active' && user.subscriptionStatus !== 'trialing') {
      return res.status(403).json({ 
        error: 'Subscription required',
        subscriptionStatus: user.subscriptionStatus 
      });
    }

    // Check if subscription has expired
    if (user.subscriptionExpires && new Date() > user.subscriptionExpires) {
      user.subscriptionStatus = 'expired';
      await user.save();
      return res.status(403).json({ 
        error: 'Subscription expired',
        subscriptionStatus: 'expired' 
      });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: 'Server error checking subscription' });
  }
};

module.exports = { checkSubscription };
