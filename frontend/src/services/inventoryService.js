import api from './api';

export const inventoryService = {
  getInventory: async (params = {}) => {
    const response = await api.get('/inventory', { params });
    return response.data;
  },

  updateStock: async (productId, data) => {
    const response = await api.put(`/inventory/${productId}`, data);
    return response.data;
  },

  getLowStock: async () => {
    const response = await api.get('/inventory/low-stock');
    return response.data;
  },
};