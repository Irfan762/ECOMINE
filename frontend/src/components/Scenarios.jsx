import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { scenarioService } from '../services/assessmentService';
import './Scenarios.css';

const Scenarios = () => {
  const { currentAssessment, scenarios, setScenarios, isLoading, showNotification } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: '',
    oreGrade: 1.5,
    energyMix: 'mixed_grid',
    processingRoute: 'pyrometallurgy'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchScenarios();
  }, [currentAssessment]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchScenarios = async () => {
    if (!currentAssessment) {
      setLoading(false);
      return;
    }
    try {
      const response = await scenarioService.getScenarios();
      setScenarios(response.data);
    } catch (error) {
      console.error('Failed to fetch scenarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: isNaN(value) ? value : parseFloat(value)
    }));
  };

  const handleAddScenario = async (e) => {
    e.preventDefault();
    
    try {
      const scenario = {
        ...formData,
        assessmentId: currentAssessment?._id,
        parameters: {
          metalType: currentAssessment?.metalType,
          oreGrade: formData.oreGrade,
          location: currentAssessment?.location,
          energyMix: formData.energyMix,
          processingRoute: formData.processingRoute
        },
        results: {
          energy: 12.5 + (formData.oreGrade - 1.5) * 3,
          co2: 2.8 + (formData.oreGrade - 1.5) * 0.8,
          water: 850 + (formData.oreGrade - 1.5) * 200,
          circularity: 85
        }
      };

      const response = await scenarioService.createScenario(scenario);
      setScenarios([...scenarios, response.data]);
      showNotification('Scenario added successfully');
      
      setFormData({
        name: '',
        oreGrade: 1.5,
        energyMix: 'mixed_grid',
        processingRoute: 'pyrometallurgy'
      });
    } catch (error) {
      console.error('Failed to create scenario:', error);
      showNotification('Failed to create scenario', 'error');
    }
  };

  const handleDeleteScenario = async (scenarioId) => {
    try {
      await scenarioService.deleteScenario(scenarioId);
      setScenarios(scenarios.filter(s => s._id !== scenarioId));
      showNotification('Scenario deleted successfully');
    } catch (error) {
      console.error('Failed to delete scenario:', error);
      showNotification('Failed to delete scenario', 'error');
    }
  };

  if (loading) {
    return (
      <div className="scenarios">
        <section className="scenarios-header">
          <h2>Scenarios 🎯</h2>
          <p>Loading scenarios...</p>
        </section>
      </div>
    );
  }

  if (!currentAssessment) {
    return (
      <div className="scenarios">
        <section className="scenarios-header">
          <h2>Scenarios 🎯</h2>
          <p>Create an assessment to compare scenarios</p>
        </section>
      </div>
    );
  }

  return (
    <div className="scenarios">
      <section className="scenarios-header">
        <h2>Scenarios 🎯</h2>
        <p>Compare multiple what-if scenarios for optimization</p>
      </section>

      <section className="scenario-builder">
        <h3>New Scenario</h3>
        <form onSubmit={handleAddScenario}>
          <div className="form-row">
            <div className="form-section">
              <label htmlFor="name">Scenario Name</label>
              <input
                type="text"
                name="name"
                placeholder="e.g., Renewable Energy Case"
                value={formData.name}
                onChange={handleChange}
                required
              />
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
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-section">
              <label htmlFor="energyMix">Energy Mix</label>
              <select
                name="energyMix"
                value={formData.energyMix}
                onChange={handleChange}
              >
                <option value="coal_heavy">Coal Heavy</option>
                <option value="mixed_grid">Mixed Grid</option>
                <option value="renewable_heavy">Renewable Heavy</option>
              </select>
            </div>

            <div className="form-section">
              <label htmlFor="processingRoute">Processing Route</label>
              <select
                name="processingRoute"
                value={formData.processingRoute}
                onChange={handleChange}
              >
                <option value="pyrometallurgy">Pyrometallurgy</option>
                <option value="hydrometallurgy">Hydrometallurgy</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
          </div>

          <button type="submit" className="btn-submit" disabled={isLoading}>
            + Add Scenario
          </button>
        </form>
      </section>

      <section className="scenarios-list">
        <h3>Saved Scenarios ({scenarios.length})</h3>
        {scenarios.length === 0 ? (
          <p className="empty-state">No scenarios yet. Create one to compare!</p>
        ) : (
          <div className="scenario-cards">
            {scenarios.map(scenario => (
              <div key={scenario._id} className="scenario-card">
                <div className="card-header">
                  <h4>{scenario.name}</h4>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteScenario(scenario._id)}
                  >
                    ✕
                  </button>
                </div>
                <div className="card-metrics">
                  <div className="metric">
                    <span>Energy: {scenario.results?.energy?.toFixed(1) || 'N/A'} GJ/t</span>
                  </div>
                  <div className="metric">
                    <span>CO₂: {scenario.results?.co2?.toFixed(1) || 'N/A'} t CO₂/t</span>
                  </div>
                  <div className="metric">
                    <span>Water: {scenario.results?.water?.toFixed(0) || 'N/A'} m³/t</span>
                  </div>
                </div>
                <div className="card-footer">
                  <small>{new Date(scenario.createdAt).toLocaleDateString()}</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Scenarios;
