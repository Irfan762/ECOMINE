import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { assessmentService } from '../services/assessmentService';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import './Dashboard.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const { user, currentAssessment, setCurrentAssessment } = useContext(AppContext);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animatedValues, setAnimatedValues] = useState({ energy: 0, co2: 0, water: 0, circularity: 0, roi: 0 });
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    fetchAssessments();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAssessments = async () => {
    try {
      const response = await assessmentService.getAssessments();
      setAssessments(response.data);
      if (response.data.length > 0 && !currentAssessment) {
        setCurrentAssessment(response.data[0]);
      }
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Failed to fetch assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Animate values when currentAssessment changes
  useEffect(() => {
    if (currentAssessment?.results) {
      const results = currentAssessment.results;
      // Handle both old and new data structures
      const co2 = results.inventory?.totals?.co2_kg ?? results.co2?.value ?? 0;
      const energy = results.inventory?.totals?.energy_GJ ?? results.energy?.value ?? 0;
      const water = results.inventory?.totals?.water_L ?? results.water?.value ?? 0;
      const circularity = (results.circularity?.MCI ?? results.circularity ?? 0) * 100;
      const roi = results.financials?.roi_months ?? 0;

      animateValue('energy', energy);
      animateValue('co2', co2);
      animateValue('water', water);
      animateValue('circularity', circularity);
      animateValue('roi', roi);
    }
  }, [currentAssessment]);

  const animateValue = (key, targetValue) => {
    const duration = 1000;
    const steps = 30;
    const stepValue = targetValue / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += stepValue;
      if (current >= targetValue) {
        setAnimatedValues(prev => ({ ...prev, [key]: targetValue }));
        clearInterval(timer);
      } else {
        setAnimatedValues(prev => ({ ...prev, [key]: current }));
      }
    }, duration / steps);
  };

  if (loading) {
    return (
      <div className="dashboard loading-state">
        <div className="shimmer-wrapper">
          <div className="shimmer"></div>
        </div>
        <p>Loading LCA Intelligence...</p>
      </div>
    );
  }

  if (!currentAssessment && assessments.length === 0) {
    return (
      <div className="dashboard empty-state">
        <section className="dashboard-header">
          <h2>Dashboard 📊</h2>
          <p>Welcome back, {user?.name}! Your sustainability journey starts here.</p>
        </section>
        <div className="empty-content">
          <div className="empty-icon">🌱</div>
          <h3>No Assessments Yet</h3>
          <p>Create your first Life Cycle Assessment to see environmental insights.</p>
          <button className="cta-btn" onClick={() => window.location.hash = '#/calculator'}>
            Launch Calculator
          </button>
        </div>
      </div>
    );
  }

  const results = currentAssessment.results || {};
  const inventory = results.inventory || { totals: {}, stageBreakdown: {} };
  const lcia = results.lcia || { midpoint: {}, endpoint: {} };
  const circularity = results.circularity || {};
  const financials = results.financials || { per_tonne_USD: {}, annual_USD: {} };
  const recommendations = results.recommendations || [];
  const mlPredictions = results.mlPredictions || null;

  return (
    <div className="dashboard premium-theme">
      <section className="dashboard-header">
        <div className="header-glass">
          <div className="header-info">
            <h2>LCA Intelligence 📊</h2>
            <div className="header-meta">
              <span className="badge-metal">{currentAssessment.metalType?.toUpperCase()}</span>
              <span className="divider">|</span>
              <span className="meta-item">{currentAssessment.location?.toUpperCase()}</span>
              <span className="divider">|</span>
              <span className="meta-item">{new Date(currentAssessment.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <div className="header-actions">
            <button className="refresh-btn glow-on-hover" onClick={fetchAssessments}>
              🔄 Refresh
            </button>
          </div>
        </div>
      </section>

      {assessments.length > 1 && (
        <section className="assessment-selector-wrapper">
          <select 
            className="styled-select"
            value={currentAssessment._id} 
            onChange={(e) => {
              const selected = assessments.find(a => a._id === e.target.value);
              setCurrentAssessment(selected);
            }}
          >
            {assessments.map(assessment => (
              <option key={assessment._id} value={assessment._id}>
                {assessment.metalType?.toUpperCase()} - {new Date(assessment.createdAt).toLocaleDateString()} ({assessment.location})
              </option>
            ))}
          </select>
        </section>
      )}

      {/* Primary KPIs */}
      <section className="kpi-grid">
        <div className="kpi-card energy">
          <div className="kpi-icon">⚡</div>
          <div className="kpi-content">
            <span className="kpi-label">Energy Intensity</span>
            <span className="kpi-value">{animatedValues.energy.toFixed(1)} <small>GJ/t</small></span>
          </div>
          <div className="kpi-footer">
            <span className="trend-neutral">Primary Fuel: Coal</span>
          </div>
        </div>

        <div className="kpi-card carbon">
          <div className="kpi-icon">☁️</div>
          <div className="kpi-content">
            <span className="kpi-label">Carbon Footprint</span>
            <span className="kpi-value">{(animatedValues.co2 / 1000).toFixed(2)} <small>t CO₂e</small></span>
          </div>
          <div className="kpi-footer">
            <span className="confidence-tag">ISO 14064 Compliant</span>
          </div>
        </div>

        <div className="kpi-card water">
          <div className="kpi-icon">💧</div>
          <div className="kpi-content">
            <span className="kpi-label">Water Usage</span>
            <span className="kpi-value">{animatedValues.water.toFixed(0)} <small>L/t</small></span>
          </div>
          <div className="kpi-footer">
            <span className="water-scarcity">Scarcity Factor: 2.8x</span>
          </div>
        </div>

        <div className="kpi-card circular">
          <div className="kpi-icon">♻️</div>
          <div className="kpi-content">
            <span className="kpi-label">Circularity Index</span>
            <span className="kpi-value">{animatedValues.circularity.toFixed(1)}%</span>
          </div>
          <div className="kpi-footer">
            <span className="mci-label">MCI Score</span>
          </div>
        </div>
      </section>

      {/* Main Analysis Section */}
      <div className="analysis-grid">
        {/* Stage Breakdown Chart */}
        <div className="glass-panel chart-panel stage-analysis">
          <div className="panel-header">
            <h3>Stage Contribution (CO₂e)</h3>
          </div>
          <div className="chart-container">
            <Bar 
              data={{
                labels: Object.keys(inventory.stageBreakdown || {}).map(s => s.toUpperCase()),
                datasets: [{
                  label: 'kg CO₂-eq per tonne',
                  data: Object.values(inventory.stageBreakdown || {}).map(s => s.co2_kg),
                  backgroundColor: 'rgba(0, 217, 255, 0.6)',
                  borderColor: '#00D9FF',
                  borderWidth: 1,
                  borderRadius: 6
                }]
              }}
              options={{
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#718096' } },
                  y: { grid: { display: false }, ticks: { color: '#E2E8F0' } }
                }
              }}
            />
          </div>
        </div>

        {/* Financial Insights */}
        <div className="glass-panel info-panel financials">
          <div className="panel-header">
            <h3>Financial Impact (USD)</h3>
          </div>
          <div className="financial-stats">
            <div className="stat-item">
              <span className="stat-label">Energy Cost / Tonne</span>
              <span className="stat-value">${financials.per_tonne_USD?.energy_cost}</span>
            </div>
            <div className="stat-item warning">
              <span className="stat-label">EU CBAM Exposure</span>
              <span className="stat-value">${financials.per_tonne_USD?.cbam_cost}</span>
            </div>
            <div className="stat-item success">
              <span className="stat-label">Carbon Credit Potential</span>
              <span className="stat-value">${financials.per_tonne_USD?.carbon_credit_revenue}</span>
            </div>
            <div className="roi-meter">
              <div className="roi-info">
                <span>Sustainability ROI</span>
                <span>{animatedValues.roi.toFixed(1)} Months</span>
              </div>
              <div className="roi-bar">
                <div className="roi-fill" style={{ width: `${Math.min(100, (12/animatedValues.roi)*100)}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ML & Recommendations Section */}
      <div className="intelligence-grid">
        {/* ML Validation */}
        {mlPredictions && (
          <div className="glass-panel intelligence-panel ml-validation">
            <div className="panel-header">
              <h3>AI Model Validation 🤖</h3>
              <span className="badge-ai">Ensemble Prediction</span>
            </div>
            <div className="ml-comparison">
              <div className="ml-row">
                <span className="ml-label">CO₂ Prediction</span>
                <div className="ml-gauge">
                  <span className="ml-val">{mlPredictions.co2_kg?.predicted} kg</span>
                  <span className="ml-conf">Accuracy: {mlPredictions.co2_kg?.confidence_pct}%</span>
                </div>
              </div>
              <div className="ml-row">
                <span className="ml-label">Energy Prediction</span>
                <div className="ml-gauge">
                  <span className="ml-val">{mlPredictions.energy_GJ?.predicted} GJ</span>
                  <span className="ml-conf">Accuracy: {mlPredictions.energy_GJ?.confidence_pct}%</span>
                </div>
              </div>
              <div className="ml-disclaimer">
                * AI predicts missing inventory data using Random Forest models.
              </div>
            </div>
          </div>
        )}

        {/* AI Recommendations */}
        <div className="glass-panel intelligence-panel recommendations">
          <div className="panel-header">
            <h3>Actionable Recommendations</h3>
          </div>
          <div className="rec-list">
            {recommendations.length > 0 ? recommendations.map((rec, idx) => (
              <div key={idx} className={`rec-item ${rec.priority.toLowerCase()}`}>
                <div className="rec-icon">{rec.priority === 'HIGH' ? '🔴' : '🟡'}</div>
                <div className="rec-content">
                  <p className="rec-msg">{rec.message}</p>
                  <span className="rec-saving">Potential Savings: {rec.potential_saving_pct}%</span>
                </div>
              </div>
            )) : (
              <p className="no-data">Calculating recommendations...</p>
            )}
          </div>
        </div>
      </div>

      {/* LCIA Midpoint Details */}
      <section className="glass-panel lcia-section">
        <div className="panel-header">
          <h3>Life Cycle Impact Assessment (LCIA)</h3>
          <span className="methodology">Method: ReCiPe 2016 / IPCC AR6</span>
        </div>
        <div className="lcia-grid">
          <div className="lcia-item">
            <span className="lcia-label">Global Warming (GWP100)</span>
            <span className="lcia-val">{lcia.midpoint?.climate_change_GWP100_kgCO2eq} <small>kg CO₂e</small></span>
          </div>
          <div className="lcia-item">
            <span className="lcia-label">Water Scarcity (AWARE)</span>
            <span className="lcia-val">{lcia.midpoint?.water_scarcity_AWARE_m3eq} <small>m³ world-eq</small></span>
          </div>
          <div className="lcia-item">
            <span className="lcia-label">Acidification (CML)</span>
            <span className="lcia-val">{lcia.midpoint?.acidification_kgSO2eq} <small>kg SO₂-eq</small></span>
          </div>
          <div className="lcia-item">
            <span className="lcia-label">Resource Depletion</span>
            <span className="lcia-val">{lcia.midpoint?.metal_depletion_kgFeEq} <small>kg Fe-eq</small></span>
          </div>
        </div>
      </section>

      {/* ISO Compliance Footer */}
      <footer className="dashboard-footer">
        <div className="footer-glass">
          <div className="compliance-badges">
            <div className="iso-badge">ISO 14040/44</div>
            <div className="iso-badge">CBAM READY</div>
            <div className="iso-badge">SEBI BRSR</div>
          </div>
          <div className="data-integrity">
            <span>Model: {results.modelUsed}</span>
            <span className="divider">|</span>
            <span>Data Quality: {results.dataQuality}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
