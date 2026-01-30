// File: src/lib/api/attendance.js

// ==================== src/lib/api/attendance.js ====================
import { apiClient, handleApiResponse } from './client';

export const attendanceApi = {
  getAll: (params) =>
    handleApiResponse(apiClient.get('/attendance/', { params })),
  
  getMy: (params) =>
    handleApiResponse(apiClient.get('/attendance/my_attendance/', { params })),
  
  create: (data) =>
    handleApiResponse(apiClient.post('/attendance/', data)),
  
  bulkMark: (data) =>
    handleApiResponse(apiClient.post('/attendance/bulk_mark/', data)),
  
  getStats: (studentId) =>
    handleApiResponse(
      apiClient.get('/attendance/stats/', { 
        params: studentId ? { student_id: studentId } : {} 
      })
    ),
};