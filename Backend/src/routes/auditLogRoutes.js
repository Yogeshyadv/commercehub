const express = require('express');
const { getAuditLogs } = require('../controllers/auditLogController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { resolveTenant, requireTenant } = require('../middleware/tenantResolver');

const router = express.Router();

router.use(protect);
router.use(resolveTenant);
router.use(requireTenant);
router.use(authorize('vendor', 'super_admin'));

router.get('/', getAuditLogs);

module.exports = router;
