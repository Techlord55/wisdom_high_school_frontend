// src/lib/api/settings.js
import { apiClient } from './client';

export const settingsApi = {
  // Get system settings
  getSettings: async () => {
    const response = await apiClient.get('/system-settings/');
    return response.data; // Returns settings object directly
  },

  // Update system settings
  updateSettings: async (data) => {
    const response = await apiClient.patch('/system-settings/1/', data);
    return response.data;
  },

  // Backup database
  backupDatabase: async () => {
    const response = await apiClient.post('/system-settings/backup_database/');
    return response.data;
  },

  // Clear cache
  clearCache: async () => {
    const response = await apiClient.post('/system-settings/clear_cache/');
    return response.data;
  },
};
