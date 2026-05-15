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
const connectDB = async () => {
  try {
    mongoose.set('bufferCommands', false);
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      family: 4 // Force IPv4 to avoid some DNS resolution issues on Windows
    });
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    if (err.message.includes('ECONNREFUSED')) {
      console.log('💡 Tip: This looks like a DNS or Network issue.');
      console.log('   1. Check if your current IP (103.68.11.170) is whitelisted in MongoDB Atlas.');
      console.log('   2. Try changing your DNS to Google (8.8.8.8) or Cloudflare (1.1.1.1).');
      console.log('   3. If you are on a VPN, try disabling it.');
    } else if (err.message.includes('querySrv')) {
      console.log('💡 Tip: Your network might be blocking SRV records. Try the standard connection string format.');
    }
  }
};

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 ECOMINE Backend Server running on port ${PORT}`);
});

// Routes
const { checkSubscription } = require('./middleware/subscriptionMiddleware');

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/subscription', require('./routes/subscriptionRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/demo', require('./routes/demoRoutes'));

// Protected core routes
app.use('/api/assessments', require('./routes/assessmentRoutes'));
app.use('/api/scenarios', require('./routes/scenarioRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/csv', require('./routes/csvRoutes'));

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


