import api from './api';

export const orderService = {
  getOrders: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response.data;
  },

  getOrder: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get('/orders/my-orders');
    return response.data;
  },

  createOrder: async (data) => {
    const response = await api.post('/orders', data);
    return response.data;
  },

  createCustomerOrder: async (data) => {
    const response = await api.post('/orders/customer', data);
    return response.data;
  },

  updateOrderStatus: async (id, data) => {
    const response = await api.put(`/orders/${id}/status`, data);
    return response.data;
  },
};