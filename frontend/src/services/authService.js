import api from './api';

export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    // No longer auto-storing token - user must verify email first
    return response.data;
  },

  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      if (response.data.user?.tenant) {
        const tenantId = typeof response.data.user.tenant === 'object'
          ? response.data.user.tenant._id
          : response.data.user.tenant;
        localStorage.setItem('tenantId', tenantId);
      }
    }
    return response.data;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      // Ignore
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('tenantId');
      localStorage.removeItem('cart');
    }
  },

  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await api.put('/auth/update-profile', data);
    return response.data;
  },

  updatePassword: async (data) => {
    const response = await api.put('/auth/update-password', data);
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  resetPassword: async (token, password) => {
    const response = await api.put(`/auth/reset-password/${token}`, { password });
    return response.data;
  },

  resendVerification: async (email) => {
    const response = await api.post('/auth/resend-verification', { email });
    return response.data;
  },

  verifyEmail: async (token) => {
    const response = await api.get(`/auth/verify-email/${token}`);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      if (response.data.user?.tenant) {
        const tenantId = typeof response.data.user.tenant === 'object'
          ? response.data.user.tenant._id
          : response.data.user.tenant;
        localStorage.setItem('tenantId', tenantId);
      }
    }
    return response.data;
  },
};