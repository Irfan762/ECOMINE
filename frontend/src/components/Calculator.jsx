import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { assessmentService } from '../services/assessmentService';
import './Calculator.css';

const Calculator = () => {
  const { setCurrentAssessment, isLoading } = useContext(AppContext);
  const [formData, setFormData] = useState({
    metalType: 'aluminum',
    oreGrade: 1.5,
    productionCapacity: 100000,
    location: 'india',
    energyMix: 'mixed_grid',
    processingRoute: 'pyrometallurgy'
  });
  const [processing, setProcessing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: isNaN(value) ? value : parseFloat(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const response = await assessmentService.createAssessment(formData);
      setCurrentAssessment(response.data);
      
      // Show success animation
      setTimeout(() => {
        setProcessing(false);
      }, 2000);
    } catch (error) {
      console.error('Assessment failed:', error);
      setProcessing(false);
    }
  };

  return (
    <div className="calculator">
      <section className="calculator-header">
        <h2>LCA Calculator 🔬</h2>
        <p>Configure parameters and run AI-powered Life Cycle Assessment</p>
      </section>

      <form className="calculator-form" onSubmit={handleSubmit}>
        <div className="form-section">
          <label htmlFor="metalType">Metal Type</label>
          <select
            name="metalType"
            value={formData.metalType}
            onChange={handleChange}
            disabled={processing}
          >
            <option value="aluminum">Aluminum (Al)</option>
            <option value="copper">Copper (Cu)</option>
            <option value="steel">Steel (Fe)</option>
          </select>
        </div>

        <div className="form-section">
          <label htmlFor="oreGrade">Ore Grade (%)</label>
          <input
            type="number"
            name="oreGrade"
            value={formData.oreGrade}
            onChange={handleChange}
            min="0.1"
            max="10"
            step="0.1"
            disabled={processing}
          />
          <small>Primary ore content (0.1 - 10%)</small>
        </div>

        <div className="form-section">
          <label htmlFor="productionCapacity">Production Capacity (tonnes/year)</label>
          <input
            type="number"
            name="productionCapacity"
            value={formData.productionCapacity}
            onChange={handleChange}
            min="10000"
            step="10000"
            disabled={processing}
          />
        </div>

        <div className="form-section">
          <label htmlFor="location">Geographic Location</label>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            disabled={processing}
          >
            <option value="china">China</option>
            <option value="india">India</option>
            <option value="europe">Europe</option>
            <option value="nordics">Nordic Countries</option>
            <option value="gcc">GCC Countries</option>
          </select>
        </div>

        <div className="form-section">
          <label htmlFor="energyMix">Energy Mix</label>
          <select
            name="energyMix"
            value={formData.energyMix}
            onChange={handleChange}
            disabled={processing}
          >
            <option value="coal_heavy">Coal Heavy (60%+)</option>
            <option value="mixed_grid">Mixed Grid</option>
            <option value="renewable_heavy">Renewable Heavy (60%+)</option>
          </select>
        </div>

        <div className="form-section">
          <label htmlFor="processingRoute">Processing Route</label>
          <select
            name="processingRoute"
            value={formData.processingRoute}
            onChange={handleChange}
            disabled={processing}
          >
            <option value="pyrometallurgy">Pyrometallurgy (High Temp)</option>
            <option value="hydrometallurgy">Hydrometallurgy (Aqueous)</option>
            <option value="hybrid">Hybrid Route</option>
          </select>
        </div>

        <button
          type="submit"
          className={`btn-submit ${processing ? 'processing' : ''}`}
          disabled={processing || isLoading}
        >
          {processing ? '⏳ Analyzing...' : 'Calculate LCA'}
        </button>
      </form>

      {processing && (
        <div className="processing-indicator">
          <div className="spinner"></div>
          <p>Running AI ensemble models...</p>
          <div className="progress-steps">
            <div className="step">1. Data preprocessing</div>
            <div className="step">2. Model ensemble</div>
            <div className="step">3. Uncertainty analysis</div>
            <div className="step">4. Report generation</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;
