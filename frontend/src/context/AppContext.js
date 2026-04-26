import React, { createContext, useState, useCallback } from 'react';
import { authService } from '../services/assessmentService';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInitialData = useCallback(async () => {
    try {
      const { assessmentService, scenarioService } = await import('../services/assessmentService');
      
      // Fetch assessments
      const assessmentsRes = await assessmentService.getAssessments();
      if (assessmentsRes.data.length > 0) {
        setCurrentAssessment(assessmentsRes.data[0]);
      }
      
      // Fetch scenarios
      const scenariosRes = await scenarioService.getScenarios();
      setScenarios(scenariosRes.data);
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login(email, password);
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      setUser(userData);
      setIsAuthenticated(true);
      
      // Fetch initial data after login
      await fetchInitialData();
      
      return userData;
    } catch (err) {
      const message = err.response?.data?.error || 'Login failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchInitialData]);

  const register = useCallback(async (name, email, password, company) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.register(name, email, password, company);
      const { token, user: userData } = response.data;
      
      localStorage.setItem('token', token);
      setUser(userData);
      setIsAuthenticated(true);
      
      // Fetch initial data after registration
      await fetchInitialData();
      
      return userData;
    } catch (err) {
      const message = err.response?.data?.error || 'Registration failed';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchInitialData]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    setCurrentAssessment(null);
    setScenarios([]);
  }, []);

  const value = {
    user,
    isAuthenticated,
    isLoading,
    error,
    currentAssessment,
    setCurrentAssessment,
    scenarios,
    setScenarios,
    login,
    register,
    logout
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
