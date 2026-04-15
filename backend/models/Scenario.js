const mongoose = require('mongoose');

const scenarioSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  assessmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assessment'
  },
  parameters: {
    metalType: String,
    oreGrade: Number,
    location: String,
    energyMix: String,
    processingRoute: String
  },
  results: {
    energy: Number,
    co2: Number,
    water: Number,
    circularity: Number,
    cost: Number
  },
  comparison: {
    baseline: mongoose.Schema.Types.ObjectId,
    improvement: {
      energy: Number,
      co2: Number,
      water: Number,
      cost: Number
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Scenario', scenarioSchema);
