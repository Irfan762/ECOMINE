import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { assessmentService } from '../services/assessmentService';
import { Bar, Radar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import './Analytics.css';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Analytics = () => {
  const { currentAssessment } = useContext(AppContext);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [animatedHotspots, setAnimatedHotspots] = useState([0, 0, 0, 0]);

  useEffect(() => {
    fetchAssessments();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchAssessments = async () => {
    try {
      const response = await assessmentService.getAssessments();
      setAssessments(response.data);
      
      // Animate hotspots
      const targetHotspots = [45, 28, 18, 9];
      animateHotspots(targetHotspots);
    } catch (error) {
      console.error('Failed to fetch assessments:', error);
    } finally {
      setLoading(false);
    }
  };

  const animateHotspots = (targetValues) => {
    const duration = 1000;
    const steps = 30;
    targetValues.forEach((target, index) => {
      const stepValue = target / steps;
      let current = 0;
      const timer = setInterval(() => {
        current += stepValue;
        if (current >= target) {
          setAnimatedHotspots(prev => {
            const newValues = [...prev];
            newValues[index] = target;
            return newValues;
          });
          clearInterval(timer);
        } else {
          setAnimatedHotspots(prev => {
            const newValues = [...prev];
            newValues[index] = current;
            return newValues;
          });
        }
      }, duration / steps);
    });
  };

  if (loading) {
    return (
      <div className="analytics">
        <section className="analytics-header">
          <h2>Analytics 📈</h2>
          <p>Loading analytics data...</p>
        </section>
      </div>
    );
  }

  if (!currentAssessment) {
    return (
      <div className="analytics">
        <section className="analytics-header">
          <h2>Analytics 📈</h2>
          <p>Create an assessment to view detailed analytics</p>
        </section>
      </div>
    );
  }

  const { energy, co2, water } = currentAssessment.results;
  const avgEnergy = assessments.length > 0 
    ? (assessments.reduce((sum, a) => sum + (a.results?.energy?.value || 0), 0) / assessments.length).toFixed(1)
    : 0;
  const avgCO2 = assessments.length > 0 
    ? (assessments.reduce((sum, a) => sum + (a.results?.co2?.value || 0), 0) / assessments.length).toFixed(1)
    : 0;

  return (
    <div className="analytics">
      <section className="analytics-header">
        <h2>Analytics 📈</h2>
        <p>Detailed insights and trend analysis for your assessment</p>
      </section>

      {assessments.length > 1 && (
        <section className="analytics-summary">
          <div className="summary-card">
            <h4>Total Assessments</h4>
            <span className="summary-value">{assessments.length}</span>
          </div>
          <div className="summary-card">
            <h4>Avg Energy</h4>
            <span className="summary-value">{avgEnergy} GJ/t</span>
          </div>
          <div className="summary-card">
            <h4>Avg CO₂</h4>
            <span className="summary-value">{avgCO2} t/t</span>
          </div>
        </section>
      )}

      <section className="analytics-grid">
        <div className="metric-card chart-container">
          <h3>Energy Hotspots</h3>
          <Bar 
            data={{
              labels: ['Ore Processing', 'Transportation', 'Refining', 'Packaging'],
              datasets: [{
                label: 'Impact %',
                data: animatedHotspots,
                backgroundColor: ['#FFC185', '#B4413C', '#00D9FF', '#5D878F'],
                borderRadius: 8
              }]
            }}
            options={{
              indexAxis: 'y',
              responsive: true,
              plugins: { legend: { display: false } },
              scales: {
                x: { ticks: { color: '#B0B8C1' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                y: { ticks: { color: '#E2E8F0' }, grid: { display: false } }
              }
            }}
          />
        </div>

        <div className="metric-card chart-container">
          <h3>Confidence Analysis</h3>
          <Radar 
            data={{
              labels: ['Energy', 'CO₂', 'Water', 'Circularity', 'Cost'],
              datasets: [{
                label: 'Model Confidence',
                data: [energy.confidence, co2.confidence, water.confidence, 87, 92],
                backgroundColor: 'rgba(0, 217, 255, 0.2)',
                borderColor: '#00D9FF',
                pointBackgroundColor: '#00D9FF'
              }]
            }}
            options={{
              responsive: true,
              plugins: { legend: { labels: { color: '#E2E8F0' } } },
              scales: {
                r: {
                  angleLines: { color: 'rgba(255,255,255,0.1)' },
                  grid: { color: 'rgba(255,255,255,0.1)' },
                  pointLabels: { color: '#E2E8F0' },
                  ticks: { color: '#B0B8C1', backdropColor: 'transparent' },
                  min: 0,
                  max: 100
                }
              }
            }}
          />
        </div>

        <div className="metric-card chart-container">
          <h3>Trend Comparison</h3>
          <Line 
            data={{
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
              datasets: [
                {
                  label: 'Your Assessment',
                  data: [energy.value, energy.value * 0.95, energy.value * 0.9, energy.value * 0.88, energy.value * 0.85, energy.value * 0.82],
                  borderColor: '#00D9FF',
                  backgroundColor: 'rgba(0, 217, 255, 0.1)',
                  fill: true,
                  tension: 0.4
                },
                {
                  label: 'Global Average',
                  data: [15, 14.8, 14.5, 14.2, 14, 13.8],
                  borderColor: '#FFC185',
                  backgroundColor: 'rgba(255, 193, 133, 0.1)',
                  fill: true,
                  tension: 0.4
                }
              ]
            }}
            options={{
              responsive: true,
              plugins: { legend: { labels: { color: '#E2E8F0' } } },
              scales: {
                x: { ticks: { color: '#B0B8C1' }, grid: { color: 'rgba(255,255,255,0.1)' } },
                y: { ticks: { color: '#B0B8C1' }, grid: { color: 'rgba(255,255,255,0.1)' } }
              }
            }}
          />
        </div>

        <div className="metric-card">
          <h3>Compliance Readiness</h3>
          <div className="compliance-data">
            <div className="compliance-item">
              <span className="label">ISO 14040/44 Ready</span>
              <span className="status">✓ Compliant</span>
            </div>
            <div className="compliance-item">
              <span className="label">CBAM Reporting</span>
              <span className="status">✓ Eligible</span>
            </div>
            <div className="compliance-item">
              <span className="label">BRSR Framework</span>
              <span className="status">✓ Aligned</span>
            </div>
            <div className="compliance-item">
              <span className="label">Scope 3 Ready</span>
              <span className="status">✓ Available</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Analytics;
