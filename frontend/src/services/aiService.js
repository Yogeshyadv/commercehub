import api from './api';

export const aiService = {
  generateDescription: async (productData) => {
    const response = await api.post('/ai/description', productData);
    return response.data;
  },

  generateTags: async (productData) => {
    const response = await api.post('/ai/tags', productData);
    return response.data;
  },

  applyToProduct: async (productId, options = {}) => {
    const response = await api.post(`/ai/apply/${productId}`, options);
    return response.data;
  },
};