import api from './api';

const subscriptionService = {
  getPlans: () => api.get('/subscriptions/plans'),
  getCurrent: () => api.get('/subscriptions/current'),
  createOrder: (plan, billingCycle = 'monthly') =>
    api.post('/subscriptions/create-order', { plan, billingCycle }),
  verifyPayment: (payload) =>
    api.post('/subscriptions/verify', payload),
};

export default subscriptionService;
