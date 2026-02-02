import api from './api';

const pointsService = {
  // Get current user's points
  getMyPoints: async () => {
    const response = await api.get('/user-points/my_points/');
    return response.data;
  },

  // Get user's point transactions
  getMyTransactions: async () => {
    const response = await api.get('/user-points/transactions/');
    return response.data;
  },

  // Get all point transactions (for the user)
  getTransactions: async () => {
    const response = await api.get('/point-transactions/');
    return response.data;
  },

  // Get a specific user's points
  getUserPoints: async (userId) => {
    const response = await api.get(`/user-points/${userId}/`);
    return response.data;
  }
};

export default pointsService;
