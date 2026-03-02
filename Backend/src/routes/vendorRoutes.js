const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getVendorProfile,
  updateVendorProfile
} = require('../controllers/vendorController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { resolveTenant, requireTenant } = require('../middleware/tenantResolver');

router.use(protect);
router.use(authorize('vendor', 'vendor_staff', 'super_admin'));
router.use(resolveTenant);
router.use(requireTenant);

router.get('/dashboard', getDashboardStats);
router.route('/profile')
  .get(getVendorProfile)
  .put(updateVendorProfile);

module.exports = router;