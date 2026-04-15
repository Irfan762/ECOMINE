import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const { login, isLoading, error } = useContext(AppContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/app');
    } catch (error) {
      // Error is handled in context
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <span className="logo-icon">🌿</span>
            <h1>ECOMINE</h1>
            <p>AI-Powered Life Cycle Assessment Platform</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <button
              type="submit"
              className="btn-login"
              disabled={isLoading}
            >
              {isLoading ? '🔄 Signing in...' : '✓ Sign In'}
            </button>
          </form>

          <div className="login-footer">
            <p>Don't have an account? <span className="link">Sign up</span></p>
            <p className="demo-text">Demo: demo@ecomine.com / demo123</p>
          </div>
        </div>

        <div className="login-info">
          <div className="info-card">
            <h3>🔬 Advanced AI Models</h3>
            <p>Ensemble of Random Forest, XGBoost, and Neural Networks</p>
          </div>
          <div className="info-card">
            <h3>📊 Comprehensive LCA</h3>
            <p>ISO 14040/44 compliant life cycle assessments</p>
          </div>
          <div className="info-card">
            <h3>♻️ Circularity Focus</h3>
            <p>Material flow analysis and recycling potential</p>
          </div>
          <div className="info-card">
            <h3>🇮🇳 India-First</h3>
            <p>Tailored for Indian metallurgists and engineers</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
