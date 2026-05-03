const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
let mongoConnected = false;
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
})
  .then(() => {
    console.log('✅ MongoDB connected');
    mongoConnected = true;
  })
  .catch(err => {
    console.error('⚠️ MongoDB connection warning:', err.message);
    console.log('📝 Running in mock mode - login will use test credentials');
  });

// Routes
const { checkSubscription } = require('./middleware/subscriptionMiddleware');

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/subscription', require('./routes/subscriptionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Protected core routes - require subscription
app.use('/api/assessments', checkSubscription, require('./routes/assessmentRoutes'));
app.use('/api/scenarios', checkSubscription, require('./routes/scenarioRoutes'));
app.use('/api/reports', checkSubscription, require('./routes/reportRoutes'));
app.use('/api/csv', checkSubscription, require('./routes/csvRoutes'));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ECOMINE API is running 🌿', timestamp: new Date() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 ECOMINE Backend Server running on port ${PORT}`);
});
