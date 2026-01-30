// File: src/lib/api/exams.js
// ==================== src/lib/api/exams.js ====================
import { apiClient, handleApiResponse } from './client';

export const examsApi = {
  getAll: (params) =>
    handleApiResponse(apiClient.get('/exams/', { params })),
  
  getById: (id) =>
    handleApiResponse(apiClient.get(`/exams/${id}/`)),
  
  create: (data) =>
    handleApiResponse(apiClient.post('/exams/', data)),
  
  update: (id, data) =>
    handleApiResponse(apiClient.patch(`/exams/${id}/`, data)),
  
  delete: (id) =>
    handleApiResponse(apiClient.delete(`/exams/${id}/`)),
  
  // Get available classes
  getClasses: () =>
    handleApiResponse(apiClient.get('/classes/')),
  
  // Get available subjects
  getSubjects: () =>
    handleApiResponse(apiClient.get('/subjects/')),
};
