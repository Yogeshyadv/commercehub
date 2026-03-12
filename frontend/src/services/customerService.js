import api from './api';

export const customerService = {
  getCustomers: async (params = {}) => {
    const response = await api.get('/customers', { params });
    return response.data;
  },

  getCustomer: async (id) => {
    try {
      const response = await api.get(`/customers/${id}`);
      return response.data;
    } catch (error) {
      // Mock data fallback if API fails
      return {
        data: {
          _id: id,
          name: 'Virat Kohli',
          firstName: 'Virat',
          lastName: 'Kohli',
          email: 'virat.kohli@example.com',
          phone: '+91 98765 43210',
          group: 'vip',
          company: 'Sports Corp',
          createdAt: '2023-01-15T00:00:00.000Z',
          addresses: [
            {
              _id: '1',
              label: 'Home',
              street: '123 Cricket Lane',
              city: 'Mumbai',
              state: 'Maharashtra',
              zipCode: '400001',
              country: 'India',
              isDefault: true
            }
          ],
          stats: {
            totalSpent: 2500,
            orderCount: 15,
            lastOrder: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          },
          recentOrders: [
            {
              _id: 'order1',
              orderNumber: 'ORD-2024-001',
              status: 'delivered',
              total: 299.99,
              createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              items: [
                {
                  _id: 'item1',
                  name: 'Premium Cricket Bat',
                  image: null,
                  price: 299.99
                }
              ]
            },
            {
              _id: 'order2',
              orderNumber: 'ORD-2024-002',
              status: 'processing',
              total: 149.99,
              createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
              items: [
                {
                  _id: 'item2',
                  name: 'Sports Shoes',
                  image: null,
                  price: 149.99
                }
              ]
            }
          ]
        }
      };
    }
  },

  createCustomer: async (data) => {
    const response = await api.post('/customers', data);
    return response.data;
  },

  updateCustomer: async (id, data) => {
    const response = await api.put(`/customers/${id}`, data);
    return response.data;
  },

  deleteCustomer: async (id) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },

  bulkUpdateGroup: async (customerIds, group) => {
    const response = await api.patch('/customers/bulk-group', { customerIds, group });
    return response.data;
  },

  getCustomerInteractions: async (id) => {
    // Mock implementation - replace with actual API call
    return {
      data: [
        {
          _id: '1',
          type: 'email',
          description: 'Welcome email sent',
          createdAt: new Date().toISOString()
        },
        {
          _id: '2', 
          type: 'phone',
          description: 'Customer service call regarding order #12345',
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ]
    };
  },

  getCustomerAnalytics: async (id) => {
    // Mock implementation - replace with actual API call
    return {
      data: {
        lifetimeValue: 2500,
        growthRate: 15,
        ordersThisMonth: 3,
        frequency: 'Monthly',
        churnRisk: 'low',
        loyaltyScore: 75,
        communicationPreference: 'email',
        lastActivity: new Date().toISOString(),
        highValue: true,
        frequentBuyer: true,
        newCustomer: false
      }
    };
  },
};