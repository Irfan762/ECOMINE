import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppContext } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import AppPage from './pages/AppPage';
import SubscriptionPage from './pages/SubscriptionPage';
import AdminPanel from './pages/AdminPanel';
import Toast from './components/Toast';
import './App.css';

function App() {
  const { isAuthenticated, user, isInitializing, notification, showNotification } = useContext(AppContext);

  if (isInitializing) {
    return <div className="app-loading">Loading ECOMINE...</div>;
  }

  // Helper to check if user has active subscription
  const hasSubscription = user && (user.subscriptionStatus === 'active' || user.subscriptionStatus === 'trialing' || user.role === 'admin');
  const isAdmin = user && user.role === 'admin';

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Admin Route */}
        <Route 
          path="/admin" 
          element={isAuthenticated && isAdmin ? <AdminPanel /> : <Navigate to="/login" />} 
        />

        {/* Subscription Route */}
        <Route 
          path="/subscription" 
          element={isAuthenticated ? <SubscriptionPage /> : <Navigate to="/login" />} 
        />

        {/* Main App Route - Requires Subscription */}
        <Route 
          path="/app" 
          element={
            isAuthenticated ? (
              hasSubscription ? <AppPage /> : <Navigate to="/subscription" />
            ) : <Navigate to="/login" />
          } 
        />

        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              isAdmin ? <Navigate to="/admin" /> : (hasSubscription ? <Navigate to="/app" /> : <Navigate to="/subscription" />)
            ) : <Navigate to="/login" />
          } 
        />
      </Routes>
      
      {notification && (
        <Toast 
          message={notification.message} 
          type={notification.type} 
          onClose={() => showNotification(null)} 
        />
      )}
    </Router>
  );
}

export default App;
