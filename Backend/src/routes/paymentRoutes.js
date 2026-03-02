const express = require('express');
const router = express.Router();
const { createRazorpayOrder, verifyRazorpayPayment, getRazorpayKey } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');
const { resolveTenant, requireTenant } = require('../middleware/tenantResolver');

router.use(protect);
router.use(resolveTenant);
router.use(requireTenant);

router.get('/razorpay/key', getRazorpayKey);
router.post('/razorpay/create', createRazorpayOrder);
router.post('/razorpay/verify', verifyRazorpayPayment);

module.exports = router;