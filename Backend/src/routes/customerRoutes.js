const express = require('express');
const {
  getCustomers,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer
} = require('../controllers/customerController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { resolveTenant, requireTenant } = require('../middleware/tenantResolver');

const router = express.Router();

router.use(protect);
router.use(resolveTenant);
router.use(requireTenant);
router.use(authorize('vendor', 'vendor_staff', 'super_admin'));

router
  .route('/')
  .get(getCustomers)
  .post(createCustomer);

router
  .route('/:id')
  .get(getCustomer)
  .put(updateCustomer)
  .delete(deleteCustomer);

module.exports = router;