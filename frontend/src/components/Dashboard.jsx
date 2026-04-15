import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user, currentAssessment } = useContext(AppContext);

  if (!currentAssessment) {
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
        <h2>Dashboard 📊</h2>
        <p>Assessment Results: {currentAssessment.metalType.toUpperCase()} | {currentAssessment.location.toUpperCase()}</p>
      </section>

      <section className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Energy Intensity</span>
            <span className="confidence-badge">{energy.confidence}%</span>
          </div>
          <span className="kpi-value">{energy.value} GJ/t</span>
          <span className="kpi-range">Range: {energy.range[0]} - {energy.range[1]} GJ/t</span>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">CO₂ Emissions</span>
            <span className="confidence-badge">{co2.confidence}%</span>
          </div>
          <span className="kpi-value">{co2.value} tonnes/t</span>
          <span className="kpi-range">Range: {co2.range[0]} - {co2.range[1]} tonnes/t</span>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Water Usage</span>
            <span className="confidence-badge">{water.confidence}%</span>
          </div>
          <span className="kpi-value">{water.value} m³/t</span>
          <span className="kpi-range">Range: {water.range[0]} - {water.range[1]} m³/t</span>
        </div>

        <div className="kpi-card">
          <div className="kpi-header">
            <span className="kpi-label">Circularity Index</span>
            <span className="confidence-badge">87%</span>
          </div>
          <span className="kpi-value">{circularity}%</span>
          <span className="kpi-range">Recycling potential</span>
        </div>
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
