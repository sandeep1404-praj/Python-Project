import api from './api.js';

export const itemService = {
  getItems: async () => {
    try {
      const response = await api.get('/items/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getItem: async (id) => {
    try {
      const response = await api.get(`/items/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createItem: async (itemData) => {
    try {
      const response = await api.post('/items/', itemData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateItem: async (id, itemData) => {
    try {
      const response = await api.put(`/items/${id}/`, itemData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteItem: async (id) => {
    try {
      await api.delete(`/items/${id}/`);
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
