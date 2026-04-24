/**
 * CSV Data Loader for Node.js Backend
 * Integrates with Express.js and ML models
 */

const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');

class CSVDataLoader {
  constructor(dataDir = path.join(__dirname, '../data')) {
    this.dataDir = dataDir;
    this.cache = {};
  }

  /**
   * Load CSV file and return parsed data
   */
  loadCSV(filename) {
    if (this.cache[filename]) {
      return this.cache[filename];
    }

    try {
      const filePath = path.join(this.dataDir, filename);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const records = csv.parse(fileContent, {
        columns: true,
        skip_empty_lines: true,
        relax_column_count: true
      });
      
      this.cache[filename] = records;
      return records;
    } catch (error) {
      console.error(`Error loading CSV ${filename}:`, error.message);
      return [];
    }
  }

  /**
   * Get metal production data
   */
  getMetalProductionData(metalType = null) {
    const data = this.loadCSV('metal_production_data.csv');
    if (metalType) {
      return data.filter(row => row.metal_type === metalType);
    }
    return data;
  }

  /**
   * Get training data for ML models
   */
  getTrainingData() {
    return this.loadCSV('training_data_ml.csv');
  }

  /**
   * Get assessment history
   */
  getAssessmentHistory(userId = null) {
    const data = this.loadCSV('assessments_history.csv');
    if (userId) {
      return data.filter(row => row.user_id === userId);
    }
    return data;
  }

  /**
   * Get production scenarios
   */
  getScenarios() {
    return this.loadCSV('scenario_data.csv');
  }

  /**
   * Get user calculations
   */
  getUserCalculations(userEmail = null) {
    const data = this.loadCSV('user_calculations.csv');
    if (userEmail) {
      return data.filter(row => row.user_email === userEmail);
    }
    return data;
  }

  /**
   * Get model performance metrics
   */
  getModelPerformance(modelName = null) {
    const data = this.loadCSV('model_performance.csv');
    if (modelName) {
      return data.filter(row => row.model_name === modelName);
    }
    return data;
  }

  /**
   * Get best model for a specific parameter
   */
  getBestModelForParameter(parameter) {
    const data = this.getModelPerformance();
    const filtered = data.filter(row => row.parameter_predicted === parameter);
    if (filtered.length === 0) return null;
    
    return filtered.reduce((best, current) => {
      return parseFloat(current.accuracy_percent) > parseFloat(best.accuracy_percent) ? current : best;
    });
  }

  /**
   * Get statistics from data
   */
  getStatistics() {
    const metalData = this.getMetalProductionData();
    const trainingData = this.getTrainingData();
    const assessments = this.getAssessmentHistory();
    const models = this.getModelPerformance();

    return {
      metalProduction: {
        totalRecords: metalData.length,
        metals: [...new Set(metalData.map(row => row.metal_type))],
        avgCO2: (metalData.reduce((sum, row) => sum + parseFloat(row.co2_kg || 0), 0) / metalData.length).toFixed(2)
      },
      training: {
        totalSamples: trainingData.length,
        avgEnergy: (trainingData.reduce((sum, row) => sum + parseFloat(row.energy_consumption_kwh || 0), 0) / trainingData.length).toFixed(2),
        avgConfidence: (trainingData.reduce((sum, row) => sum + parseFloat(row.confidence_score || 0), 0) / trainingData.length).toFixed(2)
      },
      assessments: {
        totalAssessments: assessments.length,
        avgConfidence: (assessments.reduce((sum, row) => sum + parseFloat(row.confidence_score || 0), 0) / assessments.length).toFixed(2)
      },
      models: {
        totalModels: models.length,
        bestAccuracy: Math.max(...models.map(row => parseFloat(row.accuracy_percent))).toFixed(2)
      }
    };
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.cache = {};
  }
}

module.exports = CSVDataLoader;
