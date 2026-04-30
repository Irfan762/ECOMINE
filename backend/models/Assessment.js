const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  metalType: {
    type: String,
    enum: ['aluminum', 'copper', 'steel'],
    required: true
  },
  oreGrade: {
    type: Number,
    required: true,
    min: 0.1,
    max: 10
  },
  productionCapacity: {
    type: Number,
    required: true
  },
  location: {
    type: String,
    enum: ['china', 'india', 'europe', 'nordics', 'gcc'],
    required: true
  },
  energyMix: {
    type: String,
    enum: ['coal_heavy', 'mixed_grid', 'renewable_heavy'],
    required: true
  },
  processingRoute: {
    type: String,
    enum: ['pyrometallurgy', 'hydrometallurgy', 'hybrid'],
    required: true
  },
  results: {
    type: mongoose.Schema.Types.Mixed
  },
  modelUsed: String,
  dataQuality: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Assessment', assessmentSchema);
