const User = require('../models/User');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user subscription
exports.updateUserSubscription = async (req, res) => {
  try {
    const { userId, subscriptionTier, subscriptionStatus, subscriptionExpires } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (subscriptionTier) user.subscriptionTier = subscriptionTier;
    if (subscriptionStatus) user.subscriptionStatus = subscriptionStatus;
    if (subscriptionExpires) user.subscriptionExpires = new Date(subscriptionExpires);
    
    user.updatedAt = Date.now();
    await user.save();

    res.json({ message: 'User subscription updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get stats
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeSubscriptions = await User.countDocuments({ subscriptionStatus: 'active' });
    const professionalUsers = await User.countDocuments({ subscriptionTier: 'professional' });
    const enterpriseUsers = await User.countDocuments({ subscriptionTier: 'enterprise' });

    res.json({
      totalUsers,
      activeSubscriptions,
      professionalUsers,
      enterpriseUsers
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
