const { spawn } = require('child_process');
const path = require('path');

/**
 * Bridge to call Python ML Predictor
 */
const ML_PREDICTOR = {
  /**
   * Predict LCA parameters using Python ML Engine
   * @param {Object} inputs - LCA input parameters
   * @returns {Promise<Object>} - Predicted values and confidence intervals
   */
  predict(inputs) {
    return new Promise((resolve, reject) => {
      const pythonPath = 'python'; // or 'python3' depending on environment
      const scriptPath = path.join(__dirname, '../ml/lca_predictor.py');
      
      const pythonProcess = spawn(pythonPath, [scriptPath, JSON.stringify(inputs)]);
      
      let dataString = '';
      let errorString = '';

      pythonProcess.stdout.on('data', (data) => {
        dataString += data.toString();
      });

      pythonProcess.stderr.on('data', (data) => {
        errorString += data.toString();
      });

      pythonProcess.on('close', (code) => {
        if (code !== 0) {
          console.error(`Python ML Predictor failed with code ${code}: ${errorString}`);
          return reject(new Error(errorString || `Process exited with code ${code}`));
        }

        try {
          const result = JSON.parse(dataString);
          if (result.error) {
            return reject(new Error(result.error));
          }
          resolve(result);
        } catch (err) {
          console.error('Failed to parse Python ML output:', dataString);
          reject(new Error('Invalid output from ML predictor'));
        }
      });
    });
  }
};

module.exports = ML_PREDICTOR;
