const Assessment = require('../models/Assessment');
const LCA_ENGINE = require('../utils/lcaEngine');
const ML_PREDICTOR = require('../utils/mlPredictorBridge');

// Location to grid zone mapper
function mapLocationToGrid(location) {
  const map = {
    'india': 'india_national',
    'india_jharkhand': 'india_coal_belt',
    'india_odisha': 'india_coal_belt',
    'india_chhattisgarh': 'india_coal_belt',
    'india_karnataka': 'india_south',
    'india_tamilnadu': 'india_south',
    'india_gujarat': 'india_west',
    'india_maharashtra': 'india_west',
    'india_up': 'india_north',
    'india_rajasthan': 'india_north',
    'india_northeast': 'india_northeast',
    'china': 'china',
    'europe': 'europe',
    'nordics': 'nordics',
    'gcc': 'gcc',
    'usa': 'usa'
  };
  return map[location] || 'india_national';
}

// Create Assessment with Full LCA Engine
exports.createAssessment = async (req, res) => {
  try {
    // Map frontend form fields to LCA engine inputs
    const lcaInputs = {
      metalType: req.body.metalType,                          // 'aluminum'|'copper'|'steel'
      productionRoute: req.body.productionRoute || 'primary', // 'primary'|'recycled'
      oreGrade: parseFloat(req.body.oreGrade),
      gridZone: mapLocationToGrid(req.body.location),
      transportMode: req.body.transportMode || 'rail',
      processingRoute: req.body.processingRoute || 'pyrometallurgy',
      productionCapacity: parseInt(req.body.productionCapacity),
      recycledContentPct: parseFloat(req.body.recycledContentPct || 0),
      recycleRateEOL: parseFloat(req.body.recycleRateEOL || 0),
      productLifeYrs: parseInt(req.body.productLifeYrs || 10),
      dataQualityScore: req.body.dataQualityScore || 3,
      carbonCreditPriceUSD: parseFloat(req.body.carbonCreditPriceUSD || 8)
    };

    // Run standard LCA calculation (for baseline and fallback)
    const lcaResult = LCA_ENGINE.runFullLCA(lcaInputs);

    // Primary: Augment and Overwrite with ML predictions
    try {
      // Get the specific grid factor for the ML model
      const gridFactors = {
        india_national: 0.716, india_coal_belt: 0.820, india_south: 0.650, 
        india_west: 0.680, india_north: 0.730, india_northeast: 0.510,
        china: 0.581, europe: 0.233, nordics: 0.028, gcc: 0.542, usa: 0.386
      };
      lcaInputs.gridFactor = gridFactors[lcaInputs.gridZone] || 0.716;

      const mlPredictions = await ML_PREDICTOR.predict(lcaInputs);
      
      // Map ML predictions back into the main results object
      if (mlPredictions && mlPredictions.co2_kg) {
        lcaResult.inventory.totals.co2_kg = mlPredictions.co2_kg.predicted;
        lcaResult.inventory.totals.energy_GJ = mlPredictions.energy_GJ.predicted;
        lcaResult.inventory.totals.water_L = mlPredictions.water_L.predicted;
        
        lcaResult.uncertainty.co2_range = [mlPredictions.co2_kg.ci_low, mlPredictions.co2_kg.ci_high];
        lcaResult.uncertainty.confidence_pct = mlPredictions.co2_kg.confidence_pct;
        
        lcaResult.modelUsed = 'ML Predictive Engine (RandomForest/GBM) + India LCI';
      }
    } catch (mlError) {
      console.warn('ML Prediction failed (falling back to standard LCA):', mlError.message);
    }

    const assessment = new Assessment({
      userId: req.userId,
      ...req.body,
      results: lcaResult,
      modelUsed: lcaResult.modelUsed,
      dataQuality: lcaResult.dataQuality
    });

    await assessment.save();
    res.status(201).json(assessment);
  } catch (error) {
    console.error('LCA Calculation Error:', error);
    
    // Return mock assessment with LCA engine if database unavailable
    try {
      const lcaInputs = {
        metalType: req.body.metalType,
        productionRoute: req.body.productionRoute || 'primary',
        oreGrade: parseFloat(req.body.oreGrade),
        gridZone: mapLocationToGrid(req.body.location),
        transportMode: req.body.transportMode || 'rail',
        processingRoute: req.body.processingRoute || 'pyrometallurgy',
        productionCapacity: parseInt(req.body.productionCapacity),
        recycledContentPct: parseFloat(req.body.recycledContentPct || 0),
        recycleRateEOL: parseFloat(req.body.recycleRateEOL || 0),
        productLifeYrs: parseInt(req.body.productLifeYrs || 10),
        dataQualityScore: req.body.dataQualityScore || 3,
        carbonCreditPriceUSD: parseFloat(req.body.carbonCreditPriceUSD || 8)
      };

      const lcaResult = LCA_ENGINE.runFullLCA(lcaInputs);

      // Try ML in fallback mode too
      try {
        const gridFactors = {
          india_national: 0.716, india_coal_belt: 0.820, india_south: 0.650, 
          india_west: 0.680, india_north: 0.730, india_northeast: 0.510,
          china: 0.581, europe: 0.233, nordics: 0.028, gcc: 0.542, usa: 0.386
        };
        lcaInputs.gridFactor = gridFactors[lcaInputs.gridZone] || 0.716;
        const mlPredictions = await ML_PREDICTOR.predict(lcaInputs);
        if (mlPredictions && mlPredictions.co2_kg) {
          lcaResult.inventory.totals.co2_kg = mlPredictions.co2_kg.predicted;
          lcaResult.inventory.totals.energy_GJ = mlPredictions.energy_GJ.predicted;
          lcaResult.inventory.totals.water_L = mlPredictions.water_L.predicted;
          lcaResult.modelUsed = 'ML Predictive Engine (RandomForest/GBM) + India LCI';
        }
      } catch (e) {}

      res.status(201).json({
        _id: 'mock-' + Date.now(),
        ...req.body,
        results: lcaResult,
        modelUsed: lcaResult.modelUsed,
        dataQuality: lcaResult.dataQuality,
        createdAt: new Date(),
        message: 'Mock assessment (database unavailable)'
      });
    } catch (lcaError) {
      res.status(500).json({ error: lcaError.message });
    }
  }
};

// Get User Assessments
exports.getAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(assessments);
  } catch (error) {
    // Return mock data if database unavailable
    res.json([
      {
        _id: 'mock-assessment-1',
        metalType: 'aluminum',
        location: 'india',
        oreGrade: 1.5,
        productionCapacity: 100000,
        energyMix: 'mixed_grid',
        processingRoute: 'pyrometallurgy',
        results: {
          energy: { value: 15.2, range: [14.0, 16.4], confidence: 94 },
          co2: { value: 12.5, range: [11.5, 13.5], confidence: 94 },
          water: { value: 1450, range: [1334, 1566], confidence: 89 },
          circularity: 85
        },
        createdAt: new Date()
      }
    ]);
  }
};

// Get Single Assessment
exports.getAssessment = async (req, res) => {
  try {
    if (req.params.id.startsWith('mock-')) {
      const assessments = await exports.getAssessments(req, { json: (data) => data }); // Hacky way to get the mock list
      const assessment = assessments.find(a => a._id === req.params.id);
      return res.json(assessment || { _id: req.params.id, metalType: 'aluminum', results: {} });
    }

    const assessment = await Assessment.findById(req.params.id);
    if (!assessment || assessment.userId.toString() !== req.userId) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    res.json(assessment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Assessment
exports.deleteAssessment = async (req, res) => {
  try {
    if (req.params.id.startsWith('mock-')) {
      return res.json({ message: 'Mock assessment deleted' });
    }

    const assessment = await Assessment.findById(req.params.id);
    if (!assessment || assessment.userId.toString() !== req.userId) {
      return res.status(404).json({ error: 'Assessment not found' });
    }
    
    await Assessment.deleteOne({ _id: req.params.id });
    res.json({ message: 'Assessment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
