import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { initLoginParticles } from '../utils/particles';
import { 
  LeafIcon, MailIcon, LockIcon, AlertIcon, ArrowRightIcon, 
  RocketIcon, TargetIcon, MicroscopeIcon, ChartIcon, 
  RecycleIcon, IndiaIcon, CheckIcon, CloseIcon 
} from '../components/Icons';
import './LoginPage.css';

const LoginPage = () => {
  const { login, isLoading, error, showNotification } = useContext(AppContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showDemoForm, setShowDemoForm] = useState(false);
  const [demoMessage, setDemoMessage] = useState('');

  const handleDemoSubmit = async (e) => {
    e.preventDefault();
    const demoData = {
      name: e.target.name.value,
      email: e.target.email.value,
      company: e.target.company.value,
      message: e.target.message.value
    };
    
    try {
      const response = await fetch('http://localhost:5000/api/demo/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(demoData)
      });
      const data = await response.json();
      showNotification('Request sent successfully');
      setShowDemoForm(false);
    } catch (err) {
      showNotification('Failed to submit demo request', 'error');
    }
  };

  useEffect(() => {
    // Initialize particle animation
    initLoginParticles();

    // Add tilt effect to info cards
    const cards = document.querySelectorAll('[data-tilt]');
    cards.forEach(card => {
      card.addEventListener('mousemove', handleTilt);
      card.addEventListener('mouseleave', resetTilt);
    });

    return () => {
      cards.forEach(card => {
        card.removeEventListener('mousemove', handleTilt);
        card.removeEventListener('mouseleave', resetTilt);
      });
    };
  }, []);

  const handleTilt = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;

    // Update mouse position for hover effect
    const mouseX = (x / rect.width) * 100;
    const mouseY = (y / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${mouseX}%`);
    card.style.setProperty('--mouse-y', `${mouseY}%`);
  };

  const resetTilt = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
  };

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
      {/* Animated Background */}
      <div className="login-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="grid-overlay"></div>
        <canvas id="loginParticles"></canvas>
      </div>

      <div className="login-container">
        <div className="login-card" data-aos="fade-right">
          <div className="login-header">
            <div className="logo-wrapper">
              <div className="logo-glow"></div>
              <span className="logo-icon"><LeafIcon width="28" height="28" /></span>
            </div>
            <h1 className="gradient-text">ECOMINE</h1>
            <p className="subtitle">AI-Powered Life Cycle Assessment Platform</p>
            <div className="status-badge">
              <span className="status-dot"></span>
              <span>System Online</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">
                <span className="label-icon"><MailIcon /></span>
                Email Address
              </label>
              <div className="input-wrapper">
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
                <div className="input-border"></div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <span className="label-icon"><LockIcon /></span>
                Password
              </label>
              <div className="input-wrapper">
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
                <div className="input-border"></div>
              </div>
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon"><AlertIcon /></span>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-login"
              disabled={isLoading}
            >
              <span className="btn-content">
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <span className="arrow"><ArrowRightIcon /></span>
                  </>
                )}
              </span>
              <div className="btn-shine"></div>
            </button>
          </form>

          <div className="login-footer">
            <p>Don't have an account? <span className="link">Sign up</span></p>
            <div className="demo-request-link" onClick={() => setShowDemoForm(true)}>
              Request a Professional Demo <RocketIcon className="inline-icon" />
            </div>
            <div className="demo-badge">
              <span className="demo-icon"><TargetIcon /></span>
              <span className="demo-text">Demo: test@ecomine.com / Test@123</span>
            </div>
          </div>
        </div>

        {/* Request Demo Modal */}
        {showDemoForm && (
          <div className="demo-modal-overlay">
            <div className="demo-modal">
              <button className="close-modal" onClick={() => setShowDemoForm(false)}><CloseIcon /></button>
              <h2>Request Platform Demo</h2>
              <p>Experience the full power of ECOMINE AI</p>
              <form onSubmit={handleDemoSubmit}>
                <input type="text" name="name" placeholder="Full Name" required />
                <input type="email" name="email" placeholder="Business Email" required />
                <input type="text" name="company" placeholder="Company Name" required />
                <textarea name="message" placeholder="Tell us about your requirements..."></textarea>
                <button type="submit" className="btn-submit-demo">Submit Request</button>
              </form>
              {demoMessage && <p className="demo-success">{demoMessage}</p>}
            </div>
          </div>
        )}

        <div className="login-info" data-aos="fade-left">
          <div className="info-header">
            <h2>Why Choose ECOMINE?</h2>
            <p>Industry-leading sustainability intelligence</p>
          </div>
          
          <div className="info-cards">
            <div className="info-card" data-tilt>
              <div className="card-icon-wrapper">
                <div className="card-icon-glow"></div>
                <span className="card-icon"><MicroscopeIcon width="24" height="24" /></span>
              </div>
              <h3>Advanced AI Models</h3>
              <p>Ensemble of Random Forest, XGBoost, and Neural Networks</p>
              <div className="card-stats">
                <span className="stat">96% Accuracy</span>
              </div>
            </div>
            
            <div className="info-card" data-tilt>
              <div className="card-icon-wrapper">
                <div className="card-icon-glow"></div>
                <span className="card-icon"><ChartIcon width="24" height="24" /></span>
              </div>
              <h3>Comprehensive LCA</h3>
              <p>ISO 14040/44 compliant life cycle assessments</p>
              <div className="card-stats">
                <span className="stat">Full Compliance</span>
              </div>
            </div>
            
            <div className="info-card" data-tilt>
              <div className="card-icon-wrapper">
                <div className="card-icon-glow"></div>
                <span className="card-icon"><RecycleIcon width="24" height="24" /></span>
              </div>
              <h3>Circularity Focus</h3>
              <p>Material flow analysis and recycling potential</p>
              <div className="card-stats">
                <span className="stat">92% Efficiency</span>
              </div>
            </div>
            
            <div className="info-card" data-tilt>
              <div className="card-icon-wrapper">
                <div className="card-icon-glow"></div>
                <span className="card-icon"><IndiaIcon width="24" height="24" /></span>
              </div>
              <h3>India-First</h3>
              <p>Tailored for Indian metallurgists and engineers</p>
              <div className="card-stats">
                <span className="stat">28+ Regions</span>
              </div>
            </div>
          </div>

          <div className="trust-badges">
            <div className="badge"><CheckIcon width="14" height="14" /> ISO Certified</div>
            <div className="badge"><CheckIcon width="14" height="14" /> CBAM Ready</div>
            <div className="badge"><CheckIcon width="14" height="14" /> BRSR Compliant</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
