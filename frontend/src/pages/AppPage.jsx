import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import Dashboard from '../components/Dashboard';
import Calculator from '../components/Calculator';
import Analytics from '../components/Analytics';
import Scenarios from '../components/Scenarios';
import Reports from '../components/Reports';
import CSVUpload from '../components/CSVUpload';
import './AppPage.css';

const AppPage = () => {
  const { user, logout } = useContext(AppContext);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    // Add entrance animation
    document.body.classList.add('app-loaded');
  }, []);

  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'calculator':
        return <Calculator />;
      case 'analytics':
        return <Analytics />;
      case 'scenarios':
        return <Scenarios />;
      case 'reports':
        return <Reports />;
      case 'csv-upload':
        return <CSVUpload />;
      default:
        return <Dashboard />;
    }
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    // Add page transition effect
    const main = document.querySelector('.app-main');
    main.style.opacity = '0';
    main.style.transform = 'translateY(20px)';
    setTimeout(() => {
      main.style.opacity = '1';
      main.style.transform = 'translateY(0)';
    }, 100);
  };

  return (
    <div className="app-page">
      {/* Animated Background */}
      <div className="app-background">
        <div className="bg-gradient gradient-1"></div>
        <div className="bg-gradient gradient-2"></div>
        <div className="bg-grid"></div>
      </div>

      <nav className="app-nav">
        <div className="nav-logo">
          <div className="logo-glow-nav"></div>
          <span className="logo-icon">🌿</span>
          <div className="logo-text-wrapper">
            <span className="logo-text">ECOMINE</span>
            <span className="logo-subtitle">Enterprise</span>
          </div>
        </div>

        <div className="nav-menu">
          <button
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => handleSectionChange('dashboard')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-label">Dashboard</span>
            <div className="nav-indicator"></div>
          </button>
          <button
            className={`nav-item ${activeSection === 'calculator' ? 'active' : ''}`}
            onClick={() => handleSectionChange('calculator')}
          >
            <span className="nav-icon">🔬</span>
            <span className="nav-label">Calculator</span>
            <div className="nav-indicator"></div>
          </button>
          <button
            className={`nav-item ${activeSection === 'csv-upload' ? 'active' : ''}`}
            onClick={() => handleSectionChange('csv-upload')}
          >
            <span className="nav-icon">📊</span>
            <span className="nav-label">Batch Upload</span>
            <div className="nav-indicator"></div>
          </button>
          <button
            className={`nav-item ${activeSection === 'analytics' ? 'active' : ''}`}
            onClick={() => handleSectionChange('analytics')}
          >
            <span className="nav-icon">📈</span>
            <span className="nav-label">Analytics</span>
            <div className="nav-indicator"></div>
          </button>
          <button
            className={`nav-item ${activeSection === 'scenarios' ? 'active' : ''}`}
            onClick={() => handleSectionChange('scenarios')}
          >
            <span className="nav-icon">🎯</span>
            <span className="nav-label">Scenarios</span>
            <div className="nav-indicator"></div>
          </button>
          <button
            className={`nav-item ${activeSection === 'reports' ? 'active' : ''}`}
            onClick={() => handleSectionChange('reports')}
          >
            <span className="nav-icon">📄</span>
            <span className="nav-label">Reports</span>
            <div className="nav-indicator"></div>
          </button>
        </div>

        <div className="nav-user" onClick={() => setShowUserMenu(!showUserMenu)}>
          <div className="user-info">
            <span className="user-name">{user?.name || 'User'}</span>
            <span className="user-role">{user?.role === 'admin' ? 'Administrator' : 'Premium User'}</span>
          </div>
          <div className="user-avatar">
            <div className="avatar-glow"></div>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          {showUserMenu && (
            <div className="user-menu">
              {user?.role === 'admin' && (
                <div className="menu-item" onClick={() => window.location.href = '/admin'}>
                  <span>🛡️</span> Admin Dashboard
                </div>
              )}
              <div className="menu-item">
                <span>⚙️</span> Settings
              </div>
              <div className="menu-item">
                <span>👤</span> Profile
              </div>
              <div className="menu-divider"></div>
              <div className="menu-item" onClick={logout}>
                <span>🚪</span> Logout
              </div>
            </div>
          )}
        </div>
      </nav>

      <main className="app-main">
        <div className="section-wrapper">
          {renderSection()}
        </div>
      </main>

      {/* Status Bar */}
      <div className="status-bar">
        <div className="status-item">
          <span className="status-dot online"></span>
          <span>System Online</span>
        </div>
        <div className="status-item">
          <span>🔒</span>
          <span>Secure Connection</span>
        </div>
        <div className="status-item">
          <span>⚡</span>
          <span>AI Models Active</span>
        </div>
      </div>
    </div>
  );
};

export default AppPage;
