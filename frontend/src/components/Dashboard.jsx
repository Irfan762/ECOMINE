import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { assessmentService } from '../services/assessmentService';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
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
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const { user, currentAssessment, setCurrentAssessment } = useContext(AppContext);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animatedValues, setAnimatedValues] = useState({ energy: 0, co2: 0, water: 0, circularity: 0 });
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
      const { energy, co2, water, circularity } = currentAssessment.results;
      animateValue('energy', energy.value);
      animateValue('co2', co2.value);
      animateValue('water', water.value);
      animateValue('circularity', circularity);
    }
  }, [currentAssessment]);

  const animateValue = (key, targetValue) => {
    const duration = 1500;
    const steps = 60;
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

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAssessments();
    }, 30000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading) {
    return (
      <div className="dashboard">
        <section className="dashboard-header">
          <h2>Dashboard 📊</h2>
          <p>Loading your data...</p>
        </section>
        <div className="skeleton-grid">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="skeleton-card">
              <div className="skeleton-header"></div>
              <div className="skeleton-value"></div>
              <div className="skeleton-range"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!currentAssessment && assessments.length === 0) {
    return (
      <div className="dashboard">
        <section className="dashboard-header">
          <h2>Dashboard 📊</h2>
          <p>Welcome back, {user?.name}! Start by creating a new assessment.</p>
        </section>
        <section className="kpi-grid">
          <div className="kpi-card">
            <span className="kpi-value">0</span>
            <span className="kpi-label">Total Assessments</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-value">0</span>
            <span className="kpi-label">CI Score (Avg)</span>
          </div>
          <div className="kpi-card">
            <span className="kpi-value">N/A</span>
            <span className="kpi-label">Compliance Status</span>
          </div>
        </section>
      </div>
    );
  }

  const { energy, co2, water, circularity } = currentAssessment.results;

  return (
    <div className="dashboard">
      <section className="dashboard-header">
        <div className="header-content">
          <div>
            <h2>Dashboard 📊</h2>
            <p>Assessment Results: {currentAssessment.metalType?.toUpperCase()} | {currentAssessment.location?.toUpperCase()}</p>
          </div>
          <div className="header-actions">
            <button className="refresh-btn" onClick={fetchAssessments}>
              🔄 Refresh
            </button>
            <span className="last-refresh">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </span>
          </div>
        </div>
      </section>

      {assessments.length > 1 && (
        <section className="assessment-selector">
          <label>Select Assessment:</label>
          <select 
            value={currentAssessment._id} 
            onChange={(e) => {
              const selected = assessments.find(a => a._id === e.target.value);
              setCurrentAssessment(selected);
            }}
          >
            {assessments.map(assessment => (
              <option key={assessment._id} value={assessment._id}>
                {assessment.metalType?.toUpperCase()} - {new Date(assessment.createdAt).toLocaleDateString()}
              </option>
            ))}
          </select>
        </section>
      )}

      <section className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Energy Intensity</span>
            <span className="confidence-badge">{energy.confidence}%</span>
          </div>
          <span className="kpi-value animated-number">{animatedValues.energy.toFixed(1)} GJ/t</span>
          <span className="kpi-range">Range: {energy.range[0]} - {energy.range[1]} GJ/t</span>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">CO₂ Emissions</span>
            <span className="confidence-badge">{co2.confidence}%</span>
          </div>
          <span className="kpi-value animated-number">{animatedValues.co2.toFixed(1)} tonnes/t</span>
          <span className="kpi-range">Range: {co2.range[0]} - {co2.range[1]} tonnes/t</span>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Water Usage</span>
            <span className="confidence-badge">{water.confidence}%</span>
          </div>
          <span className="kpi-value animated-number">{animatedValues.water.toFixed(0)} m³/t</span>
          <span className="kpi-range">Range: {water.range[0]} - {water.range[1]} m³/t</span>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Circularity Index</span>
            <span className="confidence-badge">87%</span>
          </div>
          <span className="kpi-value animated-number">{animatedValues.circularity}%</span>
          <span className="kpi-range">Recycling potential</span>
        </div>
      </section>

      <section className="charts-section">
        <div className="chart-card">
          <h3>Assessment Trends</h3>
          <Line 
            key={`line-${currentAssessment._id}`}
            data={{
              labels: assessments.slice(-7).map(a => new Date(a.createdAt).toLocaleDateString()),
              datasets: [{
                label: 'CO₂ Emissions',
                data: assessments.slice(-7).map(a => a.results?.co2?.value || 0),
                borderColor: '#00D9FF',
                backgroundColor: 'rgba(0, 217, 255, 0.1)',
                fill: true,
                tension: 0.4
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: { 
                legend: { 
                  labels: { color: '#E2E8F0' } 
                } 
              },
              scales: {
                x: { 
                  ticks: { color: '#B0B8C1' }, 
                  grid: { color: 'rgba(255,255,255,0.1)' } 
                },
                y: { 
                  ticks: { color: '#B0B8C1' }, 
                  grid: { color: 'rgba(255,255,255,0.1)' } 
                }
              }
            }}
          />
        </div>
        <div className="chart-card">
          <h3>Metal Distribution</h3>
          <Doughnut 
            key={`doughnut-${assessments.length}`}
            data={{
              labels: ['Aluminum', 'Copper', 'Steel'],
              datasets: [{
                data: [
                  assessments.filter(a => a.metalType === 'aluminum').length,
                  assessments.filter(a => a.metalType === 'copper').length,
                  assessments.filter(a => a.metalType === 'steel').length
                ],
                backgroundColor: ['#00D9FF', '#FFC185', '#B4413C'],
                borderWidth: 0
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: true,
              plugins: { 
                legend: { 
                  labels: { color: '#E2E8F0' } 
                } 
              }
            }}
          />
        </div>
      </section>

      <section className="recent-assessments">
        <h3>Recent Assessments ({assessments.length})</h3>
        {assessments.length > 0 && (
          <div className="assessment-list">
            {assessments.slice(0, 5).map(assessment => (
              <div 
                key={assessment._id} 
                className={`assessment-item ${currentAssessment._id === assessment._id ? 'active' : ''}`}
                onClick={() => setCurrentAssessment(assessment)}
              >
                <div className="assessment-info">
                  <span className="assessment-metal">{assessment.metalType?.toUpperCase()}</span>
                  <span className="assessment-date">{new Date(assessment.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="assessment-metrics">
                  <span>CO₂: {assessment.results?.co2?.value} t/t</span>
                  <span>Energy: {assessment.results?.energy?.value} GJ/t</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="model-info">
        <h3>Model Information</h3>
        <div className="model-details">
          <div className="detail-item">
            <span className="label">Model Used:</span>
            <span className="value">{currentAssessment.modelUsed}</span>
          </div>
          <div className="detail-item">
            <span className="label">Data Quality:</span>
            <span className="value">{currentAssessment.dataQuality}</span>
          </div>
          <div className="detail-item">
            <span className="label">Generated:</span>
            <span className="value">{new Date(currentAssessment.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
