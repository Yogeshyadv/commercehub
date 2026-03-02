import api from './api';

export const paymentService = {
  getRazorpayKey: async () => {
    const response = await api.get('/payments/razorpay/key');
    return response.data;
  },

  createRazorpayOrder: async (orderId) => {
    const response = await api.post('/payments/razorpay/create', { orderId });
    return response.data;
  },

  verifyRazorpayPayment: async (data) => {
    const response = await api.post('/payments/razorpay/verify', data);
    return response.data;
  },

  getInvoiceUrl: (orderId) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    return `${baseUrl}/invoices/${orderId}`;
  },

  getInvoiceDownloadUrl: (orderId) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    return `${baseUrl}/invoices/${orderId}/download`;
  },
};