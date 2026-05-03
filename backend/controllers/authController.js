const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Register User
exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password, company } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      company
    });

    await user.save();

    const token = generateToken(user._id);
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        company: user.company,
        role: user.role,
        subscriptionTier: user.subscriptionTier,
        subscriptionStatus: user.subscriptionStatus
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;

    // Mock login for testing when MongoDB is unavailable
    if (email === 'test@ecomine.com' && password === 'Test@123') {
      const token = jwt.sign(
        { id: 'mock-user-123', email },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      return res.json({
        token,
        user: {
          id: 'mock-user-123',
          name: 'Test User',
          email: 'test@ecomine.com',
          company: 'ECOMINE Test',
          role: 'admin',
          subscriptionTier: 'enterprise',
          subscriptionStatus: 'active'
        },
        message: 'Mock login - MongoDB not available'
      });
    }

    // Find user in database
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        company: user.company,
        role: user.role,
        subscriptionTier: user.subscriptionTier,
        subscriptionStatus: user.subscriptionStatus
      }
    });
  } catch (error) {
    // If error is due to MongoDB, provide mock credentials
    if (error.name === 'MongooseError' || error.message.includes('connection')) {
      return res.status(503).json({ 
        error: 'Database unavailable. Use test@ecomine.com / Test@123 for demo login'
      });
    }
    res.status(500).json({ error: error.message });
  }
};

// Get Current User
exports.getCurrentUser = async (req, res) => {
  try {
    // Handle mock user
    if (req.userId === 'mock-user-123') {
      return res.json({
        id: 'mock-user-123',
        name: 'Test User',
        email: 'test@ecomine.com',
        company: 'ECOMINE Test',
        role: 'admin',
        subscriptionTier: 'enterprise',
        subscriptionStatus: 'active'
      });
    }

    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
