const express = require('express');
const router = express.Router();
const { generateInvoice, downloadInvoice } = require('../controllers/invoiceController');
const { protect } = require('../middleware/auth');
const { resolveTenant, requireTenant } = require('../middleware/tenantResolver');

router.use(protect);
router.use(resolveTenant);
router.use(requireTenant);

router.get('/:orderId', generateInvoice);
router.get('/:orderId/download', downloadInvoice);

module.exports = router;