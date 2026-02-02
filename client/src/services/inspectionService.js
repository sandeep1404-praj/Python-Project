import api from './api.js';

export const inspectionService = {
  getInspectionReports: async () => {
    try {
      const response = await api.get('/inspection-reports/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getInspectionReport: async (id) => {
    try {
      const response = await api.get(`/inspection-reports/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  submitReport: async (itemId, conditionRating, notes = '') => {
    try {
      const response = await api.post('/inspection-reports/submit_report/', {
        item_id: itemId,
        condition_rating: conditionRating,
        notes,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
