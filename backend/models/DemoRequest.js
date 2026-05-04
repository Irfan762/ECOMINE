const mongoose = require('mongoose');

const demoRequestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  company: {
    type: String,
    required: true
  },
  message: String,
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'approved', 'rejected']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, { bufferCommands: false });

module.exports = mongoose.model('DemoRequest', demoRequestSchema);
