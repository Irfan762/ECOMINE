import React, { useState, useRef } from 'react';
import axios from 'axios';
import './CSVUpload.css';

const CSVUpload = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
        setError(null);
      } else {
        setError('Please upload a CSV file');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setError(null);
      } else {
        setError('Please upload a CSV file');
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setError(null);
    setResults(null);

    const formData = new FormData();
    formData.append('csvFile', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:5000/api/csv/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        }
      );

      setResults(response.data);
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const downloadTemplate = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/csv/template',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'ecomine-lca-template.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Failed to download template');
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    }
    return num.toFixed(2);
  };

  return (
    <div className="csv-upload-container">
      <div className="csv-header">
        <div className="header-content">
          <h1 className="csv-title">
            <span className="title-icon"></span>
            Batch LCA Calculator
          </h1>
          <p className="csv-subtitle">
            Upload CSV files to calculate Life Cycle Assessments for multiple products at once
          </p>
        </div>
        <button className="btn-template" onClick={downloadTemplate}>
          <span>📥</span>
          Download Template
        </button>
      </div>

      {/* Upload Section */}
      <div className="upload-section">
        <div
          className={`upload-zone ${dragActive ? 'drag-active' : ''} ${file ? 'has-file' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          
          {!file ? (
            <>
              <div className="upload-icon">📁</div>
              <h3>Drag & Drop CSV File</h3>
              <p>or click to browse</p>
              <span className="upload-hint">Supports up to 10MB</span>
            </>
          ) : (
            <>
              <div className="file-icon">✅</div>
              <h3>{file.name}</h3>
              <p>{(file.size / 1024).toFixed(2)} KB</p>
              <button
                className="btn-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                  }
                }}
              >
                Remove
              </button>
            </>
          )}
        </div>

        {file && !uploading && (
          <button className="btn-upload" onClick={handleUpload}>
            <span>🚀</span>
            Start Batch Calculation
          </button>
        )}

        {uploading && (
          <div className="upload-progress">
            <div className="progress-header">
              <span>Processing...</span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          </div>
        )}

        {error && (
          <div className="error-message">
            <span>⚠️</span>
            {error}
          </div>
        )}
      </div>

      {/* Results Section */}
      {results && (
        <div className="results-section">
          <h2 className="results-title">
            <span>✨</span>
            Calculation Results
          </h2>

          {/* Summary Cards */}
          <div className="summary-cards">
            <div className="summary-card success">
              <div className="card-icon">✅</div>
              <div className="card-content">
                <div className="card-value">{results.successfulCalculations}</div>
                <div className="card-label">Successful</div>
              </div>
            </div>
            <div className="summary-card total">
              <div className="card-icon">📊</div>
              <div className="card-content">
                <div className="card-value">{results.totalRows}</div>
                <div className="card-label">Total Rows</div>
              </div>
            </div>
            <div className="summary-card failed">
              <div className="card-icon">⚠️</div>
              <div className="card-content">
                <div className="card-value">{results.failedRows}</div>
                <div className="card-label">Failed</div>
              </div>
            </div>
          </div>

          {/* Aggregate Metrics */}
          {results.summary && (
            <div className="aggregate-section">
              <h3 className="section-title">Aggregate Environmental Impact</h3>
              <div className="metrics-grid">
                <div className="metric-card">
                  <div className="metric-icon">⚡</div>
                  <div className="metric-value">
                    {formatNumber(results.summary.aggregateMetrics.totalEnergy_GJ)}
                  </div>
                  <div className="metric-label">Total Energy (GJ)</div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon">🌍</div>
                  <div className="metric-value">
                    {formatNumber(results.summary.aggregateMetrics.totalCO2_kg)}
                  </div>
                  <div className="metric-label">Total CO₂ (kg)</div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon">💧</div>
                  <div className="metric-value">
                    {formatNumber(results.summary.aggregateMetrics.totalWater_L)}
                  </div>
                  <div className="metric-label">Total Water (L)</div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon">♻️</div>
                  <div className="metric-value">
                    {results.summary.aggregateMetrics.avgCircularity_MCI.toFixed(2)}
                  </div>
                  <div className="metric-label">Avg Circularity</div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon">🗑️</div>
                  <div className="metric-value">
                    {formatNumber(results.summary.aggregateMetrics.totalWaste_kg)}
                  </div>
                  <div className="metric-label">Total Waste (kg)</div>
                </div>
                <div className="metric-card">
                  <div className="metric-icon">💰</div>
                  <div className="metric-value">
                    ${formatNumber(results.summary.aggregateMetrics.totalCBAMExposure_USD)}
                  </div>
                  <div className="metric-label">CBAM Exposure</div>
                </div>
              </div>
            </div>
          )}

          {/* Distribution Charts */}
          {results.summary && (
            <div className="distribution-section">
              <div className="distribution-card">
                <h4>By Metal Type</h4>
                <div className="distribution-bars">
                  {Object.entries(results.summary.byMetal).map(([metal, count]) => (
                    <div key={metal} className="bar-item">
                      <span className="bar-label">{metal}</span>
                      <div className="bar-container">
                        <div
                          className="bar-fill"
                          style={{
                            width: `${(count / results.totalRows) * 100}%`
                          }}
                        ></div>
                      </div>
                      <span className="bar-value">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="distribution-card">
                <h4>By Production Route</h4>
                <div className="distribution-bars">
                  {Object.entries(results.summary.byRoute).map(([route, count]) => (
                    <div key={route} className="bar-item">
                      <span className="bar-label">{route}</span>
                      <div className="bar-container">
                        <div
                          className="bar-fill"
                          style={{
                            width: `${(count / results.totalRows) * 100}%`
                          }}
                        ></div>
                      </div>
                      <span className="bar-value">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Errors List */}
          {results.errors && results.errors.length > 0 && (
            <div className="errors-section">
              <h3 className="section-title error">
                <span>⚠️</span>
                Validation Errors
              </h3>
              <div className="errors-list">
                {results.errors.map((err, idx) => (
                  <div key={idx} className="error-item">
                    {err}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Results Table */}
          <div className="table-section">
            <h3 className="section-title">Detailed Results</h3>
            <div className="table-wrapper">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Row</th>
                    <th>Plant Name</th>
                    <th>Metal</th>
                    <th>Route</th>
                    <th>CO₂ (kg)</th>
                    <th>Energy (GJ)</th>
                    <th>Water (L)</th>
                    <th>MCI</th>
                    <th>CBAM ($)</th>
                  </tr>
                </thead>
                <tbody>
                  {results.results.slice(0, 50).map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.rowNumber}</td>
                      <td>{item.plantName}</td>
                      <td className="capitalize">{item.inputs.metalType}</td>
                      <td className="capitalize">{item.inputs.productionRoute}</td>
                      <td>{item.results.inventory.totals.co2_kg.toFixed(2)}</td>
                      <td>{item.results.inventory.totals.energy_GJ.toFixed(2)}</td>
                      <td>{item.results.inventory.totals.water_L.toFixed(0)}</td>
                      <td>{item.results.circularity.MCI.toFixed(2)}</td>
                      <td>${item.results.financials.annual_USD.cbam_exposure.toFixed(0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {results.results.length > 50 && (
                <div className="table-footer">
                  Showing 50 of {results.results.length} results
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="btn-action primary">
              <span>📥</span>
              Download Full Report
            </button>
            <button className="btn-action secondary">
              <span>📊</span>
              Export to Excel
            </button>
            <button className="btn-action secondary" onClick={() => setResults(null)}>
              <span>🔄</span>
              New Upload
            </button>
          </div>
        </div>
      )}

      {/* Info Section */}
      {!results && (
        <div className="info-section">
          <h3>CSV Format Requirements</h3>
          <div className="info-grid">
            <div className="info-card">
              <div className="info-icon">📋</div>
              <h4>Required Columns</h4>
              <ul>
                <li>metalType (aluminum, copper, steel)</li>
                <li>productionRoute (primary, recycled)</li>
                <li>oreGrade (0.1-100)</li>
                <li>location (e.g., india, india_gujarat)</li>
              </ul>
            </div>
            <div className="info-card">
              <div className="info-icon">⚙️</div>
              <h4>Optional Columns</h4>
              <ul>
                <li>transportMode (rail, road_truck, ship)</li>
                <li>processingRoute (pyrometallurgy, eaf)</li>
                <li>productionCapacity (tonnes/year)</li>
                <li>recycledContentPct (0-100)</li>
              </ul>
            </div>
            <div className="info-card">
              <div className="info-icon">🏷️</div>
              <h4>Metadata Columns</h4>
              <ul>
                <li>plantName (for identification)</li>
                <li>batchId (for tracking)</li>
                <li>productionDate (ISO format)</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CSVUpload;
