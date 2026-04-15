import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import Dashboard from '../components/Dashboard';
import Calculator from '../components/Calculator';
import Analytics from '../components/Analytics';
import Scenarios from '../components/Scenarios';
import Reports from '../components/Reports';
import './AppPage.css';

const AppPage = () => {
  const { user } = useContext(AppContext);
  const [activeSection, setActiveSection] = useState('dashboard');

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
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="app-page">
      <nav className="app-nav">
        <div className="nav-logo">
          <span className="logo-icon">🌿</span>
          <span className="logo-text">ECOMINE</span>
        </div>

        <div className="nav-menu">
          <button
            className={`nav-item ${activeSection === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveSection('dashboard')}
          >
            📊 Dashboard
          </button>
          <button
            className={`nav-item ${activeSection === 'calculator' ? 'active' : ''}`}
            onClick={() => setActiveSection('calculator')}
          >
            🔬 Calculator
          </button>
          <button
            className={`nav-item ${activeSection === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveSection('analytics')}
          >
            📈 Analytics
          </button>
          <button
            className={`nav-item ${activeSection === 'scenarios' ? 'active' : ''}`}
            onClick={() => setActiveSection('scenarios')}
          >
            🎯 Scenarios
          </button>
          <button
            className={`nav-item ${activeSection === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveSection('reports')}
          >
            📄 Reports
          </button>
        </div>

        <div className="nav-user">
          <span className="user-name">{user?.name || 'User'}</span>
          <div className="user-avatar">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </nav>

      <main className="app-main">
        {renderSection()}
      </main>
    </div>
  );
};

export default AppPage;
