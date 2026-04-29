const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const LCA_ENGINE = require('../utils/lcaEngine');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'lca-data-' + uniqueSuffix + '.csv');
  }
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

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
  return map[location?.toLowerCase()] || 'india_national';
}

// Parse CSV row to LCA inputs
function parseCSVRow(row) {
  return {
    metalType: (row.metalType || row.metal_type || row.Metal)?.toLowerCase(),
    productionRoute: (row.productionRoute || row.production_route || row.Route || 'primary').toLowerCase(),
    oreGrade: parseFloat(row.oreGrade || row.ore_grade || row.OreGrade || 2.5),
    gridZone: mapLocationToGrid(row.location || row.Location || row.gridZone),
    transportMode: (row.transportMode || row.transport_mode || row.Transport || 'rail').toLowerCase(),
    processingRoute: (row.processingRoute || row.processing_route || row.Processing || 'pyrometallurgy').toLowerCase(),
    productionCapacity: parseInt(row.productionCapacity || row.production_capacity || row.Capacity || 10000),
    recycledContentPct: parseFloat(row.recycledContentPct || row.recycled_content || row.RecycledContent || 0),
    recycleRateEOL: parseFloat(row.recycleRateEOL || row.recycle_rate || row.RecycleRate || 0),
    productLifeYrs: parseInt(row.productLifeYrs || row.product_life || row.ProductLife || 10),
    dataQualityScore: parseInt(row.dataQualityScore || row.data_quality || row.DataQuality || 3),
    carbonCreditPriceUSD: parseFloat(row.carbonCreditPriceUSD || row.carbon_price || row.CarbonPrice || 8),
    // Additional metadata
    plantName: row.plantName || row.plant_name || row.PlantName || 'Unknown',
    batchId: row.batchId || row.batch_id || row.BatchID || '',
    productionDate: row.productionDate || row.production_date || row.Date || new Date().toISOString()
  };
}

// Validate CSV row
function validateRow(row, rowIndex) {
  const errors = [];
  
  if (!row.metalType || !['aluminum', 'copper', 'steel'].includes(row.metalType)) {
    errors.push(`Row ${rowIndex}: Invalid or missing metalType (must be aluminum, copper, or steel)`);
  }
  
  if (row.oreGrade && (row.oreGrade < 0.1 || row.oreGrade > 100)) {
    errors.push(`Row ${rowIndex}: Invalid oreGrade (must be between 0.1 and 100)`);
  }
  
  if (row.productionCapacity && row.productionCapacity < 0) {
    errors.push(`Row ${rowIndex}: Invalid productionCapacity (must be positive)`);
  }
  
  return errors;
}

// Process CSV file and run LCA calculations
exports.uploadCSV = [
  upload.single('csvFile'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const results = [];
      const errors = [];
      let rowIndex = 0;

      // Read and parse CSV
      const stream = fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (row) => {
          rowIndex++;
          try {
            // Parse row
            const lcaInputs = parseCSVRow(row);
            
            // Validate row
            const validationErrors = validateRow(lcaInputs, rowIndex);
            if (validationErrors.length > 0) {
              errors.push(...validationErrors);
              return;
            }

            // Run LCA calculation
            const lcaResult = LCA_ENGINE.runFullLCA(lcaInputs);

            // Store result
            results.push({
              rowNumber: rowIndex,
              plantName: lcaInputs.plantName,
              batchId: lcaInputs.batchId,
              productionDate: lcaInputs.productionDate,
              inputs: lcaInputs,
              results: lcaResult
            });
          } catch (error) {
            errors.push(`Row ${rowIndex}: ${error.message}`);
          }
        })
        .on('end', () => {
          // Clean up uploaded file
          fs.unlinkSync(req.file.path);

          // Generate summary statistics
          const summary = generateSummary(results);

          // Send response
          res.json({
            success: true,
            totalRows: rowIndex,
            successfulCalculations: results.length,
            failedRows: errors.length,
            errors: errors,
            summary: summary,
            results: results,
            downloadLinks: {
              detailedReport: `/api/csv/download-report/${req.file.filename}`,
              summaryReport: `/api/csv/download-summary/${req.file.filename}`
            }
          });
        })
        .on('error', (error) => {
          // Clean up uploaded file
          if (fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
          res.status(500).json({ error: 'Error processing CSV file: ' + error.message });
        });

    } catch (error) {
      // Clean up uploaded file
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(500).json({ error: error.message });
    }
  }
];

// Generate summary statistics
function generateSummary(results) {
  if (results.length === 0) {
    return null;
  }

  const summary = {
    totalAssessments: results.length,
    byMetal: {},
    byRoute: {},
    aggregateMetrics: {
      totalEnergy_GJ: 0,
      totalCO2_kg: 0,
      totalWater_L: 0,
      totalWaste_kg: 0,
      avgCircularity_MCI: 0,
      totalCBAMExposure_USD: 0
    },
    topRecommendations: {},
    complianceStatus: {
      iso14040: results.length,
      cbamReady: results.length,
      sebiReady: results.length
    }
  };

  results.forEach(item => {
    const metal = item.inputs.metalType;
    const route = item.inputs.productionRoute;
    const result = item.results;

    // Count by metal
    summary.byMetal[metal] = (summary.byMetal[metal] || 0) + 1;

    // Count by route
    summary.byRoute[route] = (summary.byRoute[route] || 0) + 1;

    // Aggregate metrics
    summary.aggregateMetrics.totalEnergy_GJ += result.inventory.totals.energy_GJ;
    summary.aggregateMetrics.totalCO2_kg += result.inventory.totals.co2_kg;
    summary.aggregateMetrics.totalWater_L += result.inventory.totals.water_L;
    summary.aggregateMetrics.totalWaste_kg += result.inventory.totals.waste_kg;
    summary.aggregateMetrics.avgCircularity_MCI += result.circularity.MCI;
    summary.aggregateMetrics.totalCBAMExposure_USD += result.financials.annual_USD.cbam_exposure;

    // Collect recommendations
    result.recommendations.forEach(rec => {
      const key = rec.stage;
      if (!summary.topRecommendations[key]) {
        summary.topRecommendations[key] = {
          count: 0,
          avgSavingPct: 0,
          message: rec.message
        };
      }
      summary.topRecommendations[key].count++;
      summary.topRecommendations[key].avgSavingPct += rec.potential_saving_pct;
    });
  });

  // Calculate averages
  summary.aggregateMetrics.avgCircularity_MCI = 
    parseFloat((summary.aggregateMetrics.avgCircularity_MCI / results.length).toFixed(3));

  // Average recommendations
  Object.keys(summary.topRecommendations).forEach(key => {
    summary.topRecommendations[key].avgSavingPct = 
      Math.round(summary.topRecommendations[key].avgSavingPct / summary.topRecommendations[key].count);
  });

  return summary;
}

// Download CSV template
exports.downloadTemplate = (req, res) => {
  const templatePath = path.join(__dirname, '../templates/lca-upload-template.csv');
  
  // Create template if it doesn't exist
  if (!fs.existsSync(path.dirname(templatePath))) {
    fs.mkdirSync(path.dirname(templatePath), { recursive: true });
  }

  const templateContent = `metalType,productionRoute,oreGrade,location,transportMode,processingRoute,productionCapacity,recycledContentPct,recycleRateEOL,productLifeYrs,dataQualityScore,carbonCreditPriceUSD,plantName,batchId,productionDate
aluminum,primary,2.5,india,rail,pyrometallurgy,100000,0,0,10,3,8,Plant-A,BATCH-001,2024-01-15
copper,primary,1.8,india_gujarat,road_truck,pyrometallurgy,50000,10,20,15,2,8,Plant-B,BATCH-002,2024-01-16
steel,recycled,62,india_jharkhand,rail,eaf,200000,80,85,20,1,8,Plant-C,BATCH-003,2024-01-17
aluminum,recycled,30,india_south,rail,pyrometallurgy,75000,90,95,12,2,8,Plant-D,BATCH-004,2024-01-18`;

  fs.writeFileSync(templatePath, templateContent);

  res.download(templatePath, 'ecomine-lca-template.csv', (err) => {
    if (err) {
      res.status(500).json({ error: 'Error downloading template' });
    }
  });
};

// Get upload history
exports.getUploadHistory = async (req, res) => {
  try {
    // This would typically fetch from database
    // For now, return mock data
    res.json({
      uploads: [
        {
          id: 'upload-1',
          filename: 'production-data-jan-2024.csv',
          uploadedAt: new Date(),
          totalRows: 150,
          successfulCalculations: 148,
          failedRows: 2,
          status: 'completed'
        }
      ]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadCSV: exports.uploadCSV,
  downloadTemplate: exports.downloadTemplate,
  getUploadHistory: exports.getUploadHistory
};
