import api from './api';

const ratingService = {
  // Get all ratings
  getRatings: async () => {
    const response = await api.get('/ratings/');
    return response.data;
  },

  // Get a specific rating
  getRating: async (id) => {
    const response = await api.get(`/ratings/${id}/`);
    return response.data;
  },

  // Create a rating
  createRating: async (itemId, stars, comment) => {
    const response = await api.post('/ratings/create_rating/', {
      item_id: itemId,
      stars: stars,
      comment: comment
    });
    return response.data;
  },

  // Update a rating
  updateRating: async (id, data) => {
    const response = await api.put(`/ratings/${id}/`, data);
    return response.data;
  },

  // Delete a rating
  deleteRating: async (id) => {
    await api.delete(`/ratings/${id}/`);
  }
};

export default ratingService;
