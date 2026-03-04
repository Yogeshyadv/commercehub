const Order = require('../models/Order');
const Tenant = require('../models/Tenant');
const invoiceService = require('../services/invoiceService');
const notificationService = require('../services/notificationService');

// Helper to validate access
const validateInvoiceAccess = async (user, order) => {
  if (user.role === 'admin') return true;
  if (user.role === 'vendor' && order.tenant.toString() === user.tenant?.toString()) return true;
  if (order.customer && order.customer._id.toString() === user._id.toString()) return true;
  if (order.customer && order.customer.toString() === user._id.toString()) return true; // In case not populated
  return false;
};

// @desc    Generate invoice PDF for order
// @route   GET /api/v1/invoices/:orderId
exports.generateInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('customer', 'firstName lastName email phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!await validateInvoiceAccess(req.user, order)) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this invoice' });
    }

    // Try to find the tenant associated with the order
    let tenant = null;
    if (order.tenant) {
      tenant = await Tenant.findById(order.tenant);
    }
    
    // Fallback if tenant not found or not linked
    const tenantData = tenant || { name: 'NextGen Store', contactInfo: {} };

    const pdfBuffer = await invoiceService.generateInvoice(order, tenantData);

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
    const order = await Order.findById(req.params.orderId)
      .populate('customer', 'firstName lastName email phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!await validateInvoiceAccess(req.user, order)) {
      return res.status(403).json({ success: false, message: 'Not authorized to download this invoice' });
    }

    let tenant = null;
    if (order.tenant) {
      tenant = await Tenant.findById(order.tenant);
    }
    const tenantData = tenant || { name: 'NextGen Store', contactInfo: {} };

    const pdfBuffer = await invoiceService.generateInvoice(order, tenantData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order.orderNumber}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Invoice download error:', error);
    return res.status(500).json({ success: false, message: 'Failed to download invoice' });
  }
};

// @desc    Email invoice to customer
// @route   POST /api/v1/invoices/:orderId/email
exports.emailInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('customer', 'firstName lastName email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!await validateInvoiceAccess(req.user, order)) {
      return res.status(403).json({ success: false, message: 'Not authorized to email this invoice' });
    }

    let tenant = null;
    if (order.tenant) {
      tenant = await Tenant.findById(order.tenant);
    }
    const tenantData = tenant || { name: 'NextGen Store', contactInfo: {} };
    
    // Generate PDF
    const pdfBuffer = await invoiceService.generateInvoice(order, tenantData);

    const email = order.customer?.email || order.shippingAddress?.email;
    if (!email) {
      return res.status(400).json({ success: false, message: 'No customer email found for this order' });
    }

    // Send email
    const transporter = notificationService.getEmailTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'NextGen B2B <noreply@nextgen.com>',
      to: email,
      subject: `Invoice #${order.orderNumber} from ${tenantData.name || 'NextGen B2B'}`,
      text: `Dear ${order.customer?.firstName || 'Customer'},\n\nPlease find attached the invoice for your order #${order.orderNumber}.\n\nThank you for your business!\n\nBest regards,\n${tenantData.name || 'NextGen B2B Team'}`,
      attachments: [
        {
          filename: `invoice-${order.orderNumber}.pdf`,
          content: pdfBuffer,
          contentType: 'application/pdf'
        }
      ]
    });

    res.status(200).json({ success: true, message: `Invoice sent to ${email}` });
  } catch (error) {
    console.error('Email invoice error:', error);
    res.status(500).json({ success: false, message: 'Failed to send invoice email' });
  }
};