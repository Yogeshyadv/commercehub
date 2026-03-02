const express = require('express');
const router = express.Router();
const {
  getSalesAnalytics,
  getCustomerAnalytics
} = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { resolveTenant, requireTenant } = require('../middleware/tenantResolver');

router.use(protect);
router.use(authorize('vendor', 'super_admin'));
router.use(resolveTenant);
router.use(requireTenant);

router.get('/sales', getSalesAnalytics);
router.get('/customers', getCustomerAnalytics);

module.exports = router;