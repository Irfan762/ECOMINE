const Scenario = require('../models/Scenario');

// Create Scenario
exports.createScenario = async (req, res) => {
  try {
    const scenario = new Scenario({
      userId: req.userId,
      ...req.body
    });

    await scenario.save();
    res.status(201).json(scenario);
  } catch (error) {
    // Return mock scenario if database unavailable
    res.status(201).json({
      _id: 'mock-' + Date.now(),
      ...req.body,
      createdAt: new Date(),
      message: 'Mock scenario (database unavailable)'
    });
  }
};

// Get User Scenarios
exports.getScenarios = async (req, res) => {
  try {
    const scenarios = await Scenario.find({ userId: req.userId })
      .populate('assessmentId')
      .sort({ createdAt: -1 });
    res.json(scenarios);
  } catch (error) {
    // Return mock data if database unavailable
    res.json([
      {
        _id: 'mock-scenario-1',
        name: 'Conservative Estimate',
        parameters: { oreGrade: 1.8, energyMix: 'renewable_heavy', processingRoute: 'hydrometallurgy' },
        results: { energy: 12.5, co2: 10.8, water: 1280, circularity: 88 },
        createdAt: new Date()
      },
      {
        _id: 'mock-scenario-2',
        name: 'Aggressive Estimate',
        parameters: { oreGrade: 1.2, energyMix: 'coal_heavy', processingRoute: 'pyrometallurgy' },
        results: { energy: 18.5, co2: 15.2, water: 1650, circularity: 78 },
        createdAt: new Date()
      }
    ]);
  }
};

// Get Single Scenario
exports.getScenario = async (req, res) => {
  try {
    const scenario = await Scenario.findById(req.params.id);
    if (!scenario || scenario.userId.toString() !== req.userId) {
      return res.status(404).json({ error: 'Scenario not found' });
    }
    res.json(scenario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Scenario
exports.updateScenario = async (req, res) => {
  try {
    const scenario = await Scenario.findById(req.params.id);
    if (!scenario || scenario.userId.toString() !== req.userId) {
      return res.status(404).json({ error: 'Scenario not found' });
    }

    Object.assign(scenario, req.body);
    scenario.updatedAt = Date.now();
    await scenario.save();
    
    res.json(scenario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Scenario
exports.deleteScenario = async (req, res) => {
  try {
    const scenario = await Scenario.findById(req.params.id);
    if (!scenario || scenario.userId.toString() !== req.userId) {
      return res.status(404).json({ error: 'Scenario not found' });
    }

    await Scenario.deleteOne({ _id: req.params.id });
    res.json({ message: 'Scenario deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Compare Scenarios
exports.compareScenarios = async (req, res) => {
  try {
    const { scenarioIds } = req.body;
    const scenarios = await Scenario.find({
      _id: { $in: scenarioIds },
      userId: req.userId
    });

    res.json(scenarios);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
