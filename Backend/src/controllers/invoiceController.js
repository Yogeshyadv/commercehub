const Order = require('../models/Order');
const Tenant = require('../models/Tenant');
const invoiceService = require('../services/invoiceService');

// @desc    Generate invoice PDF for order
// @route   GET /api/v1/invoices/:orderId
exports.generateInvoice = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      tenant: req.tenantId
    }).populate('customer', 'firstName lastName email phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const tenant = await Tenant.findById(req.tenantId);

    const pdfBuffer = await invoiceService.generateInvoice(order, tenant);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename=invoice-${order.orderNumber}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Invoice generation error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate invoice' });
  }
};

// @desc    Download invoice PDF
// @route   GET /api/v1/invoices/:orderId/download
exports.downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.orderId,
      tenant: req.tenantId
    }).populate('customer', 'firstName lastName email phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const tenant = await Tenant.findById(req.tenantId);
    const pdfBuffer = await invoiceService.generateInvoice(order, tenant);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.orderNumber}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Invoice download error:', error);
    return res.status(500).json({ success: false, message: 'Failed to download invoice' });
  }
};