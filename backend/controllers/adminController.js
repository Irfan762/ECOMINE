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

// Update user subscription and status
exports.updateUserSubscription = async (req, res) => {
  try {
    const { userId, subscriptionTier, subscriptionStatus, subscriptionExpires, status, isApproved } = req.body;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (subscriptionTier) user.subscriptionTier = subscriptionTier;
    if (subscriptionStatus) user.subscriptionStatus = subscriptionStatus;
    if (subscriptionExpires) user.subscriptionExpires = new Date(subscriptionExpires);
    if (status) user.status = status;
    if (isApproved !== undefined) user.isApproved = isApproved;
    
    user.updatedAt = Date.now();
    await user.save();

    res.json({ message: 'User updated successfully', user });
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

// Create a new user manually
exports.createUser = async (req, res) => {
  try {
    if (require('mongoose').connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database is offline. User creation is disabled.' });
    }

    const { name, email, password, company, role, subscriptionTier } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
      company,
      role: role || 'user',
      subscriptionTier: subscriptionTier || 'free',
      status: 'approved',
      isApproved: true
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully', user });
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
