const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const productRoutes = require('./productRoutes');
const catalogRoutes = require('./catalogRoutes');
const orderRoutes = require('./orderRoutes');
const vendorRoutes = require('./vendorRoutes');
const analyticsRoutes = require('./analyticsRoutes');
const aiRoutes = require('./aiRoutes');
const invoiceRoutes = require('./invoiceRoutes');
const paymentRoutes = require('./paymentRoutes');

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/catalogs', catalogRoutes);
router.use('/orders', orderRoutes);
router.use('/vendor', vendorRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/ai', aiRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/payments', paymentRoutes);

module.exports = router;