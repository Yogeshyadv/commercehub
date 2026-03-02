const express = require('express');
const router = express.Router();
const {
  createOrder,
  createCustomerOrder,
  getOrders,
  getMyOrders,
  getOrder,
  updateOrderStatus
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { resolveTenant, requireTenant } = require('../middleware/tenantResolver');

// Customer routes (no tenant required)
router.post('/customer', protect, createCustomerOrder);
router.get('/my-orders', protect, getMyOrders);

// Protected routes with tenant requirement
router.use(protect);
router.use(resolveTenant);
router.use(requireTenant);

router.route('/')
  .get(getOrders)
  .post(createOrder);

router.route('/:id')
  .get(getOrder);

router.put('/:id/status', authorize('vendor', 'vendor_staff', 'super_admin'), updateOrderStatus);

module.exports = router;