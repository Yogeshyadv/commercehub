const express = require('express');
const router = express.Router();
const { generateDescription, generateTags, applyToProduct } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { resolveTenant, requireTenant } = require('../middleware/tenantResolver');

router.use(protect);
router.use(resolveTenant);
router.use(requireTenant);
router.use(authorize('vendor', 'vendor_staff', 'super_admin'));

router.post('/description', generateDescription);
router.post('/tags', generateTags);
router.post('/apply/:productId', applyToProduct);

module.exports = router;