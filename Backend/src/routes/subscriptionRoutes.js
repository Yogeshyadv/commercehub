const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const {
  getCurrentSubscription,
  getPlans,
  createSubscriptionOrder,
  verifySubscriptionPayment,
} = require('../controllers/subscriptionController');

router.get('/plans', getPlans);
router.get('/current', protect, authorize('vendor', 'admin', 'super_admin'), getCurrentSubscription);
router.post('/create-order', protect, authorize('vendor', 'admin', 'super_admin'), createSubscriptionOrder);
router.post('/verify', protect, authorize('vendor', 'admin', 'super_admin'), verifySubscriptionPayment);

module.exports = router;
