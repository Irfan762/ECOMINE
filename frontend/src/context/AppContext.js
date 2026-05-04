import React, { createContext, useState, useCallback, useEffect } from 'react';
import { authService } from '../services/assessmentService';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [scenarios, setScenarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = useCallback((message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  }, []);

  const fetchInitialData = useCallback(async () => {
    try {
      const { assessmentService, scenarioService } = await import('../services/assessmentService');
      
      // Fetch user profile if token exists but user is null
      const token = localStorage.getItem('token');
      let currentUser = user;

      if (token && !user) {
        try {
          const userRes = await authService.getCurrentUser();
          currentUser = userRes.data;
          setUser(currentUser);
          setIsAuthenticated(true);
        } catch (err) {
          console.error('Session expired or invalid');
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          setUser(null);
          return;
        }
      }

      // Only fetch assessments and scenarios if user has active subscription or is admin
      const hasSub = currentUser?.subscriptionStatus === 'active' || 
                    currentUser?.subscriptionStatus === 'trialing' || 
                    currentUser?.role === 'admin';

      if (hasSub) {
        // Fetch assessments
        try {
          const assessmentsRes = await assessmentService.getAssessments();
          if (assessmentsRes.data.length > 0) {
            setCurrentAssessment(assessmentsRes.data[0]);
          }
        } catch (err) {
          console.error('Failed to fetch assessments:', err);
        }
        
        // Fetch scenarios
        try {
          const scenariosRes = await scenarioService.getScenarios();
          setScenarios(scenariosRes.data);
        } catch (err) {
          console.error('Failed to fetch scenarios:', err);
        }
      }
    } catch (error) {
      console.error('Failed to fetch initial data:', error);
    } finally {
      setIsInitializing(false);
    }
  }, [user]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchInitialData();
    } else {
      setIsInitializing(false);
    }
  }, [fetchInitialData]);

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
    setUser,
    isAuthenticated,
    isLoading,
    isInitializing,
    error,
    currentAssessment,
    setCurrentAssessment,
    scenarios,
    setScenarios,
    login,
    register,
    logout,
    notification,
    showNotification
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
