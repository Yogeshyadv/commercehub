import api from './api';

export const reviewService = {
  // Create a review
  createReview: async (reviewData) => {
    // reviewData: { productId, rating, title, comment }
    return api.post('/reviews', reviewData);
  },

  // Get reviews for a product
  getProductReviews: async (productId, params = {}) => {
    // params: { page, limit }
    return api.get(`/reviews/product/${productId}`, { params });
  },

  // Get vendor stats
  getVendorStats: async () => {
    return api.get('/reviews/vendor/stats');
  }
};
