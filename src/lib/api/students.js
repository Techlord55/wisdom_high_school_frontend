// File: src/lib/api/students.js

// ==================== src/lib/api/students.js ====================
import { apiClient, handleApiResponse } from './client';

export const studentsApi = {
  getCurrent: () =>
    handleApiResponse(apiClient.get('/students/me/')),
  
  getAll: (params) =>
    handleApiResponse(apiClient.get('/students/', { params })),
  
  getById: (id) =>
    handleApiResponse(apiClient.get(`/students/${id}/`)),
  
  createProfile: (data) =>
    handleApiResponse(apiClient.post('/students/', data)),
};
