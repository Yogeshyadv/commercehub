const express = require('express');
const router = express.Router();
const { generateInvoice, downloadInvoice, emailInvoice } = require('../controllers/invoiceController');
const { protect } = require('../middleware/auth');
const { resolveTenant, requireTenant } = require('../middleware/tenantResolver');

router.use(protect);
// router.use(resolveTenant); // Remove tenant dependency for invoices
// router.use(requireTenant); // Remove tenant dependency for invoices

router.get('/:orderId', generateInvoice);
router.get('/:orderId/download', downloadInvoice);
router.post('/:orderId/email', emailInvoice);

module.exports = router;