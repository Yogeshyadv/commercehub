import api from './api';

export const productService = {
  // Public endpoints (no auth required)
  getPublicProducts: async (params = {}) => {
    const response = await api.get('/products/public', { params });
    return response.data;
  },

  getPublicProduct: async (id) => {
    const response = await api.get(`/products/public/${id}`);
    return response.data;
  },

  getPublicCategories: async () => {
    const response = await api.get('/products/public/categories');
    return response.data;
  },

  // Protected endpoints (auth required)
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response.data;
  },

  getProduct: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },

  createProduct: async (data) => {
    const response = await api.post('/products', data);
    return response.data;
  },

  updateProduct: async (id, data) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },

  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },

  uploadImages: async (id, files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    const response = await api.post(`/products/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  getCategories: async () => {
    const response = await api.get('/products/categories');
    return response.data;
  },

  bulkUpdateStatus: async (productIds, status) => {
    const response = await api.put('/products/bulk/status', { productIds, status });
    return response.data;
  },
};