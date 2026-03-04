import api from './api';

export const invoiceService = {
  // Download invoice as a blob to handle authentication correctly
  downloadInvoice: async (orderId) => {
    const response = await api.get(`/invoices/${orderId}/download`, {
      responseType: 'blob'
    });
    
    // Create blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `invoice-${orderId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
  },

  // View invoice in a new tab (using blob)
  viewInvoice: async (orderId) => {
    const response = await api.get(`/invoices/${orderId}`, {
      responseType: 'blob'
    });
    const file = new Blob([response.data], { type: 'application/pdf' });
    const fileURL = URL.createObjectURL(file);
    window.open(fileURL, '_blank');
  },

  emailInvoice: async (orderId) => {
    const response = await api.post(`/invoices/${orderId}/email`);
    return response.data;
  }
};
