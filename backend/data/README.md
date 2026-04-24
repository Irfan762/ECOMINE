# EcoMine LCA Machine Learning Data Files

This directory contains CSV files with fake/sample data for training and testing the machine learning models used in the LCA (Life Cycle Assessment) calculations.

## Files Overview

### 1. **metal_production_data.csv**
Historical data on metal production impacts across different routes and locations.

**Columns:**
- `metal_type`: aluminum, copper, or steel
- `production_route`: primary or recycled
- `location`: china, india, europe, etc.
- `ore_grade`: Percentage of target element in ore
- `energy_kwh`: Energy consumption in kWh per kg
- `co2_kg`: CO2 emissions in kg per kg of metal
- `water_liters`: Water usage in liters per kg
- `waste_kg`: Waste generated
- `recycling_rate`: Percentage recycled
- `cost_usd`: Production cost in USD
- `date`: Date of record

**Use Case:** Historical reference data for model training and validation

---

### 2. **training_data_ml.csv**
Machine learning training dataset with normalized parameters and environmental outputs.

**Columns:**
- `metal_type`: Type of metal
- `production_capacity_tonnes`: Annual production capacity
- `ore_grade`: Ore quality metric
- `energy_mix`: Energy source multiplier (1.0 = mixed grid)
- `location_factor`: Geographic multiplier (1.0 = baseline)
- `processing_route`: pyrometallurgy, hydrometallurgy, hybrid, advanced
- `energy_consumption_kwh`: Target variable - predicted energy
- `co2_emissions_kg`: Target variable - predicted CO2
- `water_usage_liters`: Target variable - predicted water
- `waste_generation_kg`: Generated waste
- `circularity_index`: Percentage of circular economy integration (0-100)
- `confidence_score`: Model confidence level

**Use Case:** Train ML models (Random Forest, Neural Networks, XGBoost, etc.) to predict environmental impacts

---

### 3. **assessments_history.csv**
Historical assessment records from users with actual predictions.

**Columns:**
- `assessment_id`: Unique identifier
- `user_id`: User ID
- `metal_type`: Type of metal assessed
- `production_route`: primary or recycled
- `location`: Production location
- `ore_grade`: Ore quality
- `energy_kwh`: Calculated energy
- `co2_kg`: Calculated CO2
- `water_liters`: Calculated water
- `waste_kg`: Generated waste
- `circularity_index`: Circularity score
- `model_used`: ML model used (e.g., "Ensemble (RF + NN + GB)")
- `data_quality`: Data quality level (High/Medium)
- `created_at`: Timestamp
- `status`: Assessment status

**Use Case:** Analyze model performance, validate predictions, user analytics

---

### 4. **scenario_data.csv**
Pre-configured production scenarios for comparison and benchmarking.

**Columns:**
- `scenario_id`: Unique scenario ID
- `scenario_name`: Descriptive name
- `metal_type`: Type of metal
- `production_pathway`: primary or recycled
- `energy_source`: Coal, renewable, hydro, mixed, etc.
- `location`: Geographic location
- `expected_co2`: Predicted CO2 emissions
- `expected_energy`: Predicted energy consumption
- `expected_water`: Predicted water usage
- `mci_percentage`: Material Circularity Index
- `cost_usd`: Cost estimate
- `sustainability_tier`: standard, advanced, premium

**Use Case:** Provide users with ready-made scenarios to compare against their calculations

---

### 5. **user_calculations.csv**
User-generated LCA calculations from the platform.

**Columns:**
- `calculation_id`: Unique ID
- `user_email`: User email
- `project_name`: Name of project
- `category`: Project category (Industrial, Manufacturing, etc.)
- `metal_used`: Metal type
- `production_type`: primary or recycled
- `total_co2_kg`: Total CO2 emissions
- `energy_kwh`: Energy consumed
- `water_liters`: Water used
- `cost_estimate`: Cost estimate
- `completion_date`: When calculation was completed
- `export_format`: Export format (pdf, excel)
- `calculation_duration_sec`: How long calculation took

**Use Case:** Dashboard analytics, user statistics, export functionality testing

---

### 6. **model_performance.csv**
Performance metrics for different ML models and parameters.

**Columns:**
- `model_name`: Model name (Random Forest, Neural Network, Gradient Boosting, XGBoost, Ensemble)
- `parameter_predicted`: What parameter is predicted
- `accuracy_percent`: Accuracy percentage (0-100)
- `precision`: Precision score (0-1)
- `recall`: Recall score (0-1)
- `f1_score`: F1 score (0-1)
- `training_samples`: Number of training samples used
- `test_accuracy`: Accuracy on test set
- `deployment_date`: When model was deployed
- `status`: active or deprecated

**Use Case:** Model selection, performance monitoring, model benchmarking

---

## How to Use

### Python Backend
```python
from utils.data_loader import LCADataLoader

loader = LCADataLoader()
loader.load_all_data()

# Get training data for ML models
X, y = loader.get_training_features_labels()

# Get best model for a parameter
best_model = loader.get_best_model_for_parameter('co2_emissions')

# Display statistics
loader.display_statistics()
```

### Node.js Backend
```javascript
const CSVDataLoader = require('./utils/csvDataLoader');
const loader = new CSVDataLoader();

// Get metal production data
const metalData = loader.getMetalProductionData('aluminum');

// Get training data
const trainingData = loader.getTrainingData();

// Get best model
const bestModel = loader.getBestModelForParameter('energy_consumption');

// Get statistics
const stats = loader.getStatistics();
```

---

## Data Characteristics

- **Total Training Samples:** 15+ records per CSV
- **Metal Types:** Aluminum, Copper, Steel
- **Production Routes:** Primary & Recycled
- **Locations:** China, India, Europe, Nordics, GCC
- **Models Included:** Random Forest, Neural Network, Gradient Boosting, XGBoost, Ensemble

---

## Integration Points

1. **ML Model Training:** Use `training_data_ml.csv` to train models
2. **API Responses:** Return data from CSVs in assessment endpoints
3. **Dashboard Analytics:** Display statistics from all CSVs
4. **User History:** Query `assessments_history.csv` and `user_calculations.csv`
5. **Model Selection:** Use `model_performance.csv` to recommend best models

---

## Future Enhancements

- [ ] Integrate with actual ML libraries (TensorFlow, Scikit-learn)
- [ ] Add more diverse data (100+ records)
- [ ] Include regional variations
- [ ] Add temporal trends
- [ ] Create synthetic data generator

---

**Last Updated:** 2026-04-24
**Data Version:** v1.0
