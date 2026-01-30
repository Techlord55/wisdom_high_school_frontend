// File: src/lib/api/users.js
// ==================== src/lib/api/users.js ====================
import { apiClient, handleApiResponse } from './client';

export const usersApi = {
  getCurrent: () => 
    handleApiResponse(apiClient.get('/users/me/')),
  
  updateProfile: (data) =>
    handleApiResponse(apiClient.patch('/users/update_profile/', data)),
  
  getAll: (params) =>
    handleApiResponse(apiClient.get('/users/', { params })),
  
  getById: (id) =>
    handleApiResponse(apiClient.get(`/users/${id}/`)),
};
