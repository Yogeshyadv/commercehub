const express = require('express');
const router = express.Router();
const {
  createOrder,
  createCustomerOrder,
  getOrders,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { resolveTenant, requireTenant } = require('../middleware/tenantResolver');

// Customer routes (no tenant required)
router.post('/customer', protect, createCustomerOrder);
router.get('/my-orders', protect, getMyOrders);
router.put('/:id/cancel', protect, cancelOrder);
router.get('/:id', protect, resolveTenant, getOrder);

// Protected routes with tenant requirement
router.use(protect);
router.use(resolveTenant);
router.use(requireTenant);

router.route('/')
  .get(getOrders)
  .post(createOrder);

router.put('/:id/status', authorize('vendor', 'vendor_staff', 'super_admin'), updateOrderStatus);

module.exports = router;