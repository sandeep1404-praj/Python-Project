import api from './api';

const approvalService = {
  // Get all pending items for verification
  getPendingItems: async () => {
    try {
      const response = await api.get('/item-approval/pending_items/');
      // Response is either direct array or wrapped in data property
      return Array.isArray(response.data) ? response.data : response.data.results || [];
    } catch (error) {
      console.error('Error fetching pending items:', error);
      throw error;
    }
  },

  // Approve an item with optional rating
  approveItem: async (itemId, stars, comment) => {
    try {
      const response = await api.post('/item-approval/approve_item/', {
        item_id: itemId,
        stars: stars,
        comment: comment
      });
      return response.data;
    } catch (error) {
      console.error('Error approving item:', error);
      throw error;
    }
  },

  // Reject an item with a comment
  rejectItem: async (itemId, comment) => {
    try {
      const response = await api.post('/item-approval/reject_item/', {
        item_id: itemId,
        comment: comment
      });
      return response.data;
    } catch (error) {
      console.error('Error rejecting item:', error);
      throw error;
    }
  }
};

export default approvalService;
