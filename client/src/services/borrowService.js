import api from './api.js';

export const borrowService = {
  getBorrowRequests: async () => {
    try {
      const response = await api.get('/borrow-requests/');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getBorrowRequest: async (id) => {
    try {
      const response = await api.get(`/borrow-requests/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createBorrowRequest: async (itemId) => {
    try {
      const response = await api.post('/borrow-requests/', {
        item: itemId,
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  approveBorrowRequest: async (id) => {
    try {
      const response = await api.post(`/borrow-requests/${id}/approve/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  denyBorrowRequest: async (id) => {
    try {
      const response = await api.post(`/borrow-requests/${id}/deny/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  returnItem: async (id) => {
    try {
      const response = await api.post(`/borrow-requests/${id}/return_item/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};
