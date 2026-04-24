"""
ML Data Loader for EcoMine LCA Calculations
Loads and processes CSV files for machine learning models
"""

import pandas as pd
import os
from pathlib import Path

class LCADataLoader:
    def __init__(self, data_dir='backend/data'):
        self.data_dir = data_dir
        self.metal_data = None
        self.training_data = None
        self.assessments = None
        self.scenarios = None
        self.user_calculations = None
        self.model_performance = None
        
    def load_all_data(self):
        """Load all CSV files"""
        try:
            self.metal_data = pd.read_csv(f'{self.data_dir}/metal_production_data.csv')
            print("✓ Metal production data loaded")
            
            self.training_data = pd.read_csv(f'{self.data_dir}/training_data_ml.csv')
            print("✓ Training data loaded")
            
            self.assessments = pd.read_csv(f'{self.data_dir}/assessments_history.csv')
            print("✓ Assessment history loaded")
            
            self.scenarios = pd.read_csv(f'{self.data_dir}/scenario_data.csv')
            print("✓ Scenario data loaded")
            
            self.user_calculations = pd.read_csv(f'{self.data_dir}/user_calculations.csv')
            print("✓ User calculations loaded")
            
            self.model_performance = pd.read_csv(f'{self.data_dir}/model_performance.csv')
            print("✓ Model performance loaded")
            
            return True
        except Exception as e:
            print(f"Error loading data: {e}")
            return False
    
    def get_metal_by_type(self, metal_type):
        """Get data for specific metal"""
        if self.metal_data is None:
            self.load_all_data()
        return self.metal_data[self.metal_data['metal_type'] == metal_type]
    
    def get_training_features_labels(self):
        """Get features and labels for ML training"""
        if self.training_data is None:
            self.load_all_data()
        
        feature_cols = ['production_capacity_tonnes', 'ore_grade', 'energy_mix', 
                       'location_factor', 'energy_consumption_kwh']
        
        X = self.training_data[feature_cols]
        y_energy = self.training_data['energy_consumption_kwh']
        y_co2 = self.training_data['co2_emissions_kg']
        y_water = self.training_data['water_usage_liters']
        
        return X, {'energy': y_energy, 'co2': y_co2, 'water': y_water}
    
    def get_best_model_for_parameter(self, parameter):
        """Get best performing model for a specific parameter"""
        if self.model_performance is None:
            self.load_all_data()
        
        filtered = self.model_performance[self.model_performance['parameter_predicted'] == parameter]
        if not filtered.empty:
            return filtered.loc[filtered['accuracy_percent'].idxmax()]
        return None
    
    def get_scenario_by_name(self, scenario_name):
        """Get scenario data by name"""
        if self.scenarios is None:
            self.load_all_data()
        return self.scenarios[self.scenarios['scenario_name'].str.contains(scenario_name, case=False)]
    
    def get_user_calculations_summary(self, user_email):
        """Get summary of calculations for a user"""
        if self.user_calculations is None:
            self.load_all_data()
        
        user_data = self.user_calculations[self.user_calculations['user_email'] == user_email]
        if not user_data.empty:
            return {
                'total_calculations': len(user_data),
                'avg_co2': user_data['total_co2_kg'].mean(),
                'total_cost': user_data['cost_estimate'].sum(),
                'latest_calculation': user_data.iloc[-1]['calculation_id']
            }
        return None
    
    def display_statistics(self):
        """Display statistics from loaded data"""
        print("\n=== EcoMine LCA Data Statistics ===")
        
        if self.metal_data is not None:
            print(f"\nMetal Production Records: {len(self.metal_data)}")
            print(f"Metals: {self.metal_data['metal_type'].unique().tolist()}")
            
        if self.training_data is not None:
            print(f"\nTraining Samples: {len(self.training_data)}")
            print(f"Avg Energy (kWh): {self.training_data['energy_consumption_kwh'].mean():.2f}")
            print(f"Avg CO2 (kg): {self.training_data['co2_emissions_kg'].mean():.2f}")
            
        if self.assessments is not None:
            print(f"\nTotal Assessments: {len(self.assessments)}")
            print(f"Avg Confidence: {self.assessments['confidence_score'].mean():.2f}")
            
        if self.model_performance is not None:
            best_model = self.model_performance.loc[self.model_performance['accuracy_percent'].idxmax()]
            print(f"\nBest Model: {best_model['model_name']} ({best_model['accuracy_percent']}% accuracy)")


if __name__ == '__main__':
    loader = LCADataLoader()
    loader.load_all_data()
    loader.display_statistics()
    
    # Example: Get best model for CO2 emissions prediction
    print("\n=== Best Models for Each Parameter ===")
    for param in ['energy_consumption', 'co2_emissions', 'water_usage']:
        best = loader.get_best_model_for_parameter(param)
        if best is not None:
            print(f"{param}: {best['model_name']} (Accuracy: {best['accuracy_percent']}%)")
