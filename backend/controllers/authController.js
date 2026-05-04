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
    if (require('mongoose').connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database is offline. Registration is temporarily disabled.' });
    }

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
    const isDbConnected = require('mongoose').connection.readyState === 1;

    // Mock login for testing (Always check this first if DB is down or for specific test credentials)
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
        message: 'Login successful'
      });
    }

    if (!isDbConnected) {
      return res.status(503).json({ 
        error: 'Database is currently offline. Please use the test credentials for the demo.' 
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

    // Check if user is approved
    if (user.role !== 'admin' && user.status !== 'approved') {
      return res.status(403).json({ 
        error: 'Your account is pending approval. Please contact an administrator.',
        status: user.status 
      });
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

    if (require('mongoose').connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database is offline.' });
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
