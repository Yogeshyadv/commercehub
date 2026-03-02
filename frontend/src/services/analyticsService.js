import api from './api';

export const analyticsService = {
  getSalesAnalytics: async (params = {}) => {
    const response = await api.get('/analytics/sales', { params });
    return response.data;
  },

  getCustomerAnalytics: async () => {
    const response = await api.get('/analytics/customers');
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get('/vendor/dashboard');
    return response.data;
  },
};