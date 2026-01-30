// File: src/lib/api/assignments.js

// ==================== src/lib/api/assignments.js ====================
import { apiClient, handleApiResponse } from './client';

export const assignmentsApi = {
  getAll: (params) =>
    handleApiResponse(apiClient.get('/assignments/', { params })),
  
  getById: (id) =>
    handleApiResponse(apiClient.get(`/assignments/${id}/`)),
  
  create: (data) =>
    handleApiResponse(apiClient.post('/assignments/', data)),
  
  update: (id, data) =>
    handleApiResponse(apiClient.patch(`/assignments/${id}/`, data)),
  
  delete: (id) =>
    apiClient.delete(`/assignments/${id}/`),
};

export const submissionsApi = {
  getAll: (params) =>
    handleApiResponse(
      apiClient.get('/assignment-submissions/', { params })
    ),
  
  submit: (data) =>
    handleApiResponse(
      apiClient.post('/assignment-submissions/', data)
    ),
  
  grade: (id, marks, feedback) =>
    handleApiResponse(
      apiClient.post(`/assignment-submissions/${id}/grade/`, { 
        marks_obtained: marks, 
        feedback 
      })
    ),
};
