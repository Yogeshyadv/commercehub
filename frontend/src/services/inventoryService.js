import api from './api';

export const inventoryService = {
  getAllInventory: async (params = {}) => {
    const response = await api.get('/inventory', { params });
    return response.data;
  },

  getProductInventory: async (productId) => {
    const response = await api.get(`/inventory/product/${productId}`);
    return response.data;
  },

  addLocation: async (data) => {
    const response = await api.post('/inventory/location', data);
    return response.data;
  },

  updateStock: async (id, data) => {
    const response = await api.put(`/inventory/${id}/stock`, data);
    return response.data;
  },

  transferStock: async (data) => {
    const response = await api.post('/inventory/transfer', data);
    return response.data;
  }
};