import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { reportService } from '../services/assessmentService';
import './Reports.css';

const Reports = () => {
  const { currentAssessment, isLoading } = useContext(AppContext);
  const [generatingReport, setGeneratingReport] = useState(null);
  const [reports, setReports] = useState([]);

  const handleGenerateReport = async (reportType) => {
    if (!currentAssessment) return;
    
    setGeneratingReport(reportType);
    
    try {
      const response = await reportService.generateReport(currentAssessment._id, reportType);
      setReports([...reports, response.data]);
      
      setTimeout(() => {
        setGeneratingReport(null);
      }, 2000);
    } catch (error) {
      console.error('Failed to generate report:', error);
      setGeneratingReport(null);
    }
  };

  if (!currentAssessment) {
    return (
      <div className="reports">
        <section className="reports-header">
          <h2>Reports 📄</h2>
          <p>Create an assessment to generate compliance reports</p>
        </section>
      </div>
    );
  }

  return (
    <div className="reports">
      <section className="reports-header">
        <h2>Reports 📄</h2>
        <p>Generate ISO/CBAM/BRSR/Circularity compliance reports</p>
      </section>

      <section className="report-generator">
        <h3>Generate New Report</h3>
        <div className="report-options">
          <button
            className="report-btn iso-btn"
            onClick={() => handleGenerateReport('iso')}
            disabled={generatingReport === 'iso' || isLoading}
          >
            <span className="icon">📋</span>
            <span className="title">ISO 14040/44</span>
            <span className="desc">Life Cycle Assessment</span>
          </button>

          <button
            className="report-btn cbam-btn"
            onClick={() => handleGenerateReport('cbam')}
            disabled={generatingReport === 'cbam' || isLoading}
          >
            <span className="icon">🌍</span>
            <span className="title">CBAM Report</span>
            <span className="desc">Carbon Border Adjustment</span>
          </button>

          <button
            className="report-btn brsr-btn"
            onClick={() => handleGenerateReport('brsr')}
            disabled={generatingReport === 'brsr' || isLoading}
          >
            <span className="icon">📊</span>
            <span className="title">BRSR Framework</span>
            <span className="desc">Business Responsibility Report</span>
          </button>

          <button
            className="report-btn circ-btn"
            onClick={() => handleGenerateReport('circularity')}
            disabled={generatingReport === 'circularity' || isLoading}
          >
            <span className="icon">♻️</span>
            <span className="title">Circularity Index</span>
            <span className="desc">Recycling & Material Flow</span>
          </button>
        </div>
      </section>

      {generatingReport && (
        <section className="generating-status">
          <div className="spinner"></div>
          <p>Generating {generatingReport.toUpperCase()} report...</p>
        </section>
      )}

      <section className="reports-list">
        <h3>Generated Reports ({reports.length})</h3>
        {reports.length === 0 ? (
          <p className="empty-state">No reports generated yet.</p>
        ) : (
          <div className="report-cards">
            {reports.map(report => (
              <div key={report._id} className="report-card">
                <div className="card-header">
                  <h4>{report.title}</h4>
                  <span className="status-badge">{report.status}</span>
                </div>
                <div className="card-body">
                  <p><strong>Generated:</strong> {new Date(report.createdAt).toLocaleDateString()}</p>
                  {report.generatedAt && (
                    <p><strong>File Size:</strong> 2.4 MB</p>
                  )}
                </div>
                <div className="card-footer">
                  {report.status === 'completed' && (
                    <a href={report.downloadUrl} className="btn-download">📥 Download</a>
                  )}
                  <button className="btn-delete">🗑️ Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="compliance-info">
        <h3>Compliance Standards Included</h3>
        <div className="info-grid">
          <div className="info-card">
            <h4>ISO 14040:2006 & 44:2006</h4>
            <p>Comprehensive LCA methodology, scope definition, impact assessment, and interpretation aligned with international standards.</p>
          </div>
          <div className="info-card">
            <h4>EU CBAM Regulation</h4>
            <p>Carbon border adjustment mechanism reporting with embedded emissions calculations for trading compliance.</p>
          </div>
          <div className="info-card">
            <h4>BRSR Framework</h4>
            <p>Indian business responsibility framework with sustainability metrics and stakeholder disclosure requirements.</p>
          </div>
          <div className="info-card">
            <h4>Material Circularity Index</h4>
            <p>Recycling potential, end-of-life recovery rates, and circular economy contribution assessment.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reports;
