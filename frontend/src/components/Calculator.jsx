import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { assessmentService } from '../services/assessmentService';
import './Calculator.css';

const Calculator = () => {
  const { setCurrentAssessment, isLoading } = useContext(AppContext);
  const [formData, setFormData] = useState({
    metalType: 'aluminum',
    productionRoute: 'primary',
    oreGrade: 30, // Default for Aluminum
    productionCapacity: 100000,
    location: 'india',
    transportMode: 'rail',
    processingRoute: 'pyrometallurgy',
    recycledContentPct: 10,
    recycleRateEOL: 75,
    productLifeYrs: 20,
    dataQualityScore: 2,
    carbonCreditPriceUSD: 15
  });
  const [processing, setProcessing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: isNaN(value) || value === "" ? value : parseFloat(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const response = await assessmentService.createAssessment(formData);
      setCurrentAssessment(response.data);
      
      // Success delay for animation
      setTimeout(() => {
        setProcessing(false);
        // Switch to dashboard view if needed
        window.location.hash = '#/dashboard';
      }, 2000);
    } catch (error) {
      console.error('Assessment failed:', error);
      setProcessing(false);
    }
  };

  return (
    <div className="calculator premium-form">
      <section className="calculator-header">
        <h2>LCA Engine v2.0 🔬</h2>
        <p>Advanced Industrial LCA Modeling | ISO 14040/44 Compliant</p>
      </section>

      <form className="calculator-form glass-card" onSubmit={handleSubmit}>
        <div className="form-grid">
          {/* Core Configuration */}
          <div className="form-column">
            <h3 className="section-title">Core Configuration</h3>
            
            <div className="form-section">
              <label>Metal Type</label>
              <select name="metalType" value={formData.metalType} onChange={handleChange}>
                <option value="aluminum">Aluminum (Al)</option>
                <option value="copper">Copper (Cu)</option>
                <option value="steel">Steel (Fe)</option>
              </select>
            </div>

            <div className="form-section">
              <label>Production Route</label>
              <select name="productionRoute" value={formData.productionRoute} onChange={handleChange}>
                <option value="primary">Primary (Virgin Material)</option>
                <option value="recycled">Secondary (Recycled Scrap)</option>
              </select>
            </div>

            <div className="form-section">
              <label>Ore Grade (%)</label>
              <input type="number" name="oreGrade" value={formData.oreGrade} onChange={handleChange} step="0.1" />
              <small>Reference: Al (30%), Cu (2.5%), Fe (62%)</small>
            </div>

            <div className="form-section">
              <label>Processing Technology</label>
              <select name="processingRoute" value={formData.processingRoute} onChange={handleChange}>
                <option value="pyrometallurgy">Pyrometallurgy</option>
                <option value="hydrometallurgy">Hydrometallurgy</option>
                <option value="eaf">Electric Arc Furnace (EAF)</option>
                <option value="hybrid">Hybrid System</option>
              </select>
            </div>
          </div>

          {/* Logistics & Scale */}
          <div className="form-column">
            <h3 className="section-title">Operations & Scale</h3>

            <div className="form-section">
              <label>Geographic Location</label>
              <select name="location" value={formData.location} onChange={handleChange}>
                <option value="india">India (National Average)</option>
                <option value="india_jharkhand">India - Coal Belt (East)</option>
                <option value="india_tamilnadu">India - Renewable Heavy (South)</option>
                <option value="india_gujarat">India - Industrial Hub (West)</option>
                <option value="china">China</option>
                <option value="europe">Europe</option>
                <option value="nordics">Nordic Countries</option>
              </select>
            </div>

            <div className="form-section">
              <label>Transport Mode</label>
              <select name="transportMode" value={formData.transportMode} onChange={handleChange}>
                <option value="rail">Rail Freight</option>
                <option value="road_truck">Heavy Duty Truck</option>
                <option value="ship_coastal">Coastal Shipping</option>
              </select>
            </div>

            <div className="form-section">
              <label>Annual Capacity (tonnes)</label>
              <input type="number" name="productionCapacity" value={formData.productionCapacity} onChange={handleChange} step="10000" />
            </div>

            <div className="form-section">
              <label>Data Quality Score (DQS)</label>
              <select name="dataQualityScore" value={formData.dataQualityScore} onChange={handleChange}>
                <option value="1">1 - Primary Data (Highest)</option>
                <option value="2">2 - Site-Specific (High)</option>
                <option value="3">3 - Industry Average (Medium)</option>
                <option value="4">4 - Estimated Data (Low)</option>
                <option value="5">5 - Generic Data (Very Low)</option>
              </select>
            </div>
          </div>

          {/* Circularity & Finance */}
          <div className="form-column">
            <h3 className="section-title">Sustainability & Finance</h3>

            <div className="form-section">
              <label>Recycled Content (%)</label>
              <input type="number" name="recycledContentPct" value={formData.recycledContentPct} onChange={handleChange} min="0" max="100" />
            </div>

            <div className="form-section">
              <label>End-of-Life Recycle Rate (%)</label>
              <input type="number" name="recycleRateEOL" value={formData.recycleRateEOL} onChange={handleChange} min="0" max="100" />
            </div>

            <div className="form-section">
              <label>Expected Product Life (Years)</label>
              <input type="number" name="productLifeYrs" value={formData.productLifeYrs} onChange={handleChange} min="1" max="100" />
            </div>

            <div className="form-section">
              <label>Carbon Credit Price (USD/t)</label>
              <input type="number" name="carbonCreditPriceUSD" value={formData.carbonCreditPriceUSD} onChange={handleChange} />
            </div>
          </div>
        </div>

        <div className="form-footer">
          <button
            type="submit"
            className={`btn-primary-glow ${processing ? 'processing' : ''}`}
            disabled={processing || isLoading}
          >
            {processing ? '⚡ Running LCA Engine...' : 'Generate Full LCA Report'}
          </button>
        </div>
      </form>

      {processing && (
        <div className="processing-overlay">
          <div className="dna-loader"></div>
          <div className="processing-text">
            <h3>AI-Assisted Assessment in Progress</h3>
            <p>Predicting inventory gaps via Random Forest models...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;
