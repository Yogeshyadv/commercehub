import api from './api';

export const catalogService = {
  getCatalogs: async (params = {}) => {
    const response = await api.get('/catalogs', { params });
    return response.data;
  },

  getCatalog: async (id) => {
    const response = await api.get(`/catalogs/${id}`);
    return response.data;
  },

  getPublicCatalog: async (shareableLink) => {
    const response = await api.get(`/catalogs/public/${shareableLink}`);
    return response.data;
  },

  createCatalog: async (data) => {
    const response = await api.post('/catalogs', data);
    return response.data;
  },

  updateCatalog: async (id, data) => {
    const response = await api.put(`/catalogs/${id}`, data);
    return response.data;
  },

  addProducts: async (id, productIds) => {
    const response = await api.post(`/catalogs/${id}/products`, { productIds });
    return response.data;
  },

  removeProduct: async (id, productId) => {
    const response = await api.delete(`/catalogs/${id}/products/${productId}`);
    return response.data;
  },

  deleteCatalog: async (id) => {
    const response = await api.delete(`/catalogs/${id}`);
    return response.data;
  },

  uploadCoverImage: async (id, file) => {
    const formData = new FormData();
    formData.append('coverImage', file);
    const response = await api.post(`/catalogs/${id}/cover`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
};