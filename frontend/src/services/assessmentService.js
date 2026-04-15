import api from './api';

export const authService = {
  register: (name, email, password, company) =>
    api.post('/auth/register', { name, email, password, company }),

  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  getCurrentUser: () =>
    api.get('/auth/me')
};

export const assessmentService = {
  createAssessment: (data) =>
    api.post('/assessments', data),

  getAssessments: () =>
    api.get('/assessments'),

  getAssessment: (id) =>
    api.get(`/assessments/${id}`),

  deleteAssessment: (id) =>
    api.delete(`/assessments/${id}`)
};

export const scenarioService = {
  createScenario: (data) =>
    api.post('/scenarios', data),

  getScenarios: () =>
    api.get('/scenarios'),

  getScenario: (id) =>
    api.get(`/scenarios/${id}`),

  updateScenario: (id, data) =>
    api.put(`/scenarios/${id}`, data),

  deleteScenario: (id) =>
    api.delete(`/scenarios/${id}`),

  compareScenarios: (scenarioIds) =>
    api.post('/scenarios/compare', { scenarioIds })
};

export const reportService = {
  generateReport: (assessmentId, reportType) =>
    api.post('/reports', { assessmentId, reportType }),

  getReports: () =>
    api.get('/reports'),

  getReport: (id) =>
    api.get(`/reports/${id}`),

  deleteReport: (id) =>
    api.delete(`/reports/${id}`)
};
