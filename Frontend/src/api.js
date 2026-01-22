import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * API endpoints for data visualization backend
 */
export const api = {
  /**
   * Upload a file (CSV, JSON, TXT, XLSX, TSV)
   */
  uploadFile: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  /**
   * Apply filters to the current dataset
   */
  filterData: async (filterRequest) => {
    return apiClient.post('/filter', filterRequest);
  },

  /**
   * Reset to original dataset
   */
  resetData: async () => {
    return apiClient.delete('/reset');
  },

  /**
   * Get column information
   */
  getColumnInfo: async (column) => {
    return apiClient.get(`/column/${column}`);
  },
};

export default apiClient;
