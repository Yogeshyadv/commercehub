import api from './api';

export const aiService = {
  generateCatalog: async (prompt) => {
    const response = await api.post('/ai/catalog', { prompt });
    return response.data;
  },

  generateTheme: async (prompt) => {
    const response = await api.post('/ai/theme', { prompt });
    return response.data;
  },

  generateDescription: async (productData) => {
    const response = await api.post('/ai/description', productData);
    return response.data;
  },

  generateTags: async (productData) => {
    const response = await api.post('/ai/tags', productData);
    return response.data;
  },

  generateSEO: async (productData) => {
    const response = await api.post('/ai/seo', productData);
    return response.data;
  },

  applyToProduct: async (productId, options = {}) => {
    const response = await api.post(`/ai/apply/${productId}`, options);
    return response.data;
  },

  getRecommendations: async () => {
    const response = await api.get('/ai/recommendations');
    return response.data;
  },

  getSimilarProducts: async (productId) => {
    const response = await api.get(`/ai/similar/${productId}`);
    return response.data;
  }
};
