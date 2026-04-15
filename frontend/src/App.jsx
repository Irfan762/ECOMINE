import React, { useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppContext } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import AppPage from './pages/AppPage';
import './App.css';

function App() {
  const { isAuthenticated } = useContext(AppContext);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/app" 
          element={isAuthenticated ? <AppPage /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/app" /> : <Navigate to="/login" />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
