// File: src/lib/api/grades.js

// ==================== src/lib/api/grades.js ====================
import { apiClient, handleApiResponse } from './client';

export const gradesApi = {
  getAll: (params) =>
    handleApiResponse(apiClient.get('/grades/', { params })),
  
  getMy: (params) =>
    handleApiResponse(apiClient.get('/grades/my_grades/', { params })),
  
  create: (data) =>
    handleApiResponse(apiClient.post('/grades/', data)),
  
  bulkCreate: (data) =>
    handleApiResponse(apiClient.post('/grades/bulk_create/', data)),
  
  getStats: (studentId, params) =>
    handleApiResponse(
      apiClient.get('/grades/stats/', { 
        params: { 
          ...(studentId ? { student_id: studentId } : {}),
          ...params 
        } 
      })
    ),
};