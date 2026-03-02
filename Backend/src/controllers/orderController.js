const Order = require('../models/Order');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const Customer = require('../models/Customer');
const { getPagination } = require('../utils/helpers');

// @desc    Create customer order (from public store)
exports.createCustomerOrder = async (req, res) => {
  try {
    const { items, shippingAddress, billingAddress, paymentMethod, customerNotes } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ success: false, message: 'Order must have items' });

    // Get tenant from first product
    const firstProduct = await Product.findOne({ _id: items[0].product, status: 'active' });
    if (!firstProduct) return res.status(404).json({ success: false, message: 'Product not found' });
    
    const tenantId = firstProduct.tenant;

    let subtotal = 0, taxAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findOne({ _id: item.product, status: 'active' });
      if (!product) return res.status(404).json({ success: false, message: `Product ${item.product} not found` });
      
      // Verify all products are from same tenant
      if (product.tenant.toString() !== tenantId.toString()) {
        return res.status(400).json({ success: false, message: 'Cannot order products from different vendors in one order' });
      }
      
      if (product.trackInventory && product.stock < item.quantity) {
        return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });
      }

      const itemTotal = product.price * item.quantity;
      const itemTax = product.taxable ? (itemTotal * (product.taxRate || 0) / 100) : 0;

      orderItems.push({ 
        product: product._id, 
        name: product.name, 
        sku: product.sku, 
        image: product.images[0]?.url, 
        price: product.price, 
        quantity: item.quantity, 
        tax: itemTax, 
        total: itemTotal + itemTax 
      });
      subtotal += itemTotal;
      taxAmount += itemTax;
    }

    const total = subtotal + taxAmount + (req.body.shippingCost || 0) - (req.body.discount || 0);

    const order = await Order.create({
      tenant: tenantId, 
      customer: req.user._id, 
      items: orderItems, 
      shippingAddress,
      billingAddress: billingAddress || shippingAddress, 
      subtotal, 
      taxAmount,
      shippingCost: req.body.shippingCost || 0, 
      discount: req.body.discount || 0,
      total, 
      paymentMethod, 
      customerNotes, 
      source: req.body.source || 'web',
      statusHistory: [{ status: 'pending', note: 'Order placed', updatedBy: req.user._id }]
    });

    // Update inventory
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity, orderCount: 1 } });
      await Inventory.findOneAndUpdate({ tenant: tenantId, product: item.product }, {
        $inc: { quantity: -item.quantity },
        $push: { movements: { type: 'out', quantity: item.quantity, reference: order.orderNumber, notes: 'Order placed', performedBy: req.user._id } }
      });
    }

    const Tenant = require('../models/Tenant');
    await Tenant.findByIdAndUpdate(tenantId, { $inc: { 'metadata.totalOrders': 1, 'metadata.totalRevenue': total } });

    const populatedOrder = await Order.findById(order._id).populate('customer', 'firstName lastName email phone');
    res.status(201).json({ success: true, message: 'Order created successfully', data: populatedOrder });
  } catch (error) {
    console.error('CreateCustomerOrder error:', error);
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// @desc    Create order (vendor/admin)
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, billingAddress, paymentMethod, customerNotes } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ success: false, message: 'Order must have items' });

    let subtotal = 0, taxAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findOne({ _id: item.product, tenant: req.tenantId, status: 'active' });
      if (!product) return res.status(404).json({ success: false, message: `Product ${item.product} not found` });
      if (product.trackInventory && product.stock < item.quantity) return res.status(400).json({ success: false, message: `Insufficient stock for ${product.name}` });

      const itemTotal = product.price * item.quantity;
      const itemTax = product.taxable ? (itemTotal * (product.taxRate / 100)) : 0;

      orderItems.push({ product: product._id, name: product.name, sku: product.sku, image: product.images[0]?.url, price: product.price, quantity: item.quantity, tax: itemTax, total: itemTotal + itemTax });
      subtotal += itemTotal;
      taxAmount += itemTax;
    }

    const total = subtotal + taxAmount + (req.body.shippingCost || 0) - (req.body.discount || 0);

    const order = await Order.create({
      tenant: req.tenantId, customer: req.user._id, items: orderItems, shippingAddress,
      billingAddress: billingAddress || shippingAddress, subtotal, taxAmount,
      shippingCost: req.body.shippingCost || 0, discount: req.body.discount || 0,
      total, paymentMethod, customerNotes, source: req.body.source || 'web',
      statusHistory: [{ status: 'pending', note: 'Order placed', updatedBy: req.user._id }]
    });

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity, orderCount: 1 } });
      await Inventory.findOneAndUpdate({ tenant: req.tenantId, product: item.product }, {
        $inc: { quantity: -item.quantity },
        $push: { movements: { type: 'out', quantity: item.quantity, reference: order.orderNumber, notes: 'Order placed', performedBy: req.user._id } }
      });
    }

    const Tenant = require('../models/Tenant');
    await Tenant.findByIdAndUpdate(req.tenantId, { $inc: { 'metadata.totalOrders': 1, 'metadata.totalRevenue': total } });

    const populatedOrder = await Order.findById(order._id).populate('customer', 'firstName lastName email phone');
    res.status(201).json({ success: true, message: 'Order created', data: populatedOrder });
  } catch (error) {
    console.error('CreateOrder error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query.page, req.query.limit);
    let query = { tenant: req.tenantId };
    if (req.query.status) query.status = req.query.status;
    if (req.query.paymentStatus) query.paymentStatus = req.query.paymentStatus;
    if (req.user.role === 'customer') query.customer = req.user._id;

    const [orders, total] = await Promise.all([
      Order.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('customer', 'firstName lastName email phone').lean(),
      Order.countDocuments(query)
    ]);

    res.status(200).json({ success: true, data: orders, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error('GetOrders error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get customer's orders (all vendors)
exports.getMyOrders = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query.page, req.query.limit);
    let query = { customer: req.user._id };
    if (req.query.status) query.status = req.query.status;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('items.product', 'name images')
        .lean(),
      Order.countDocuments(query)
    ]);

    res.status(200).json({ 
      success: true, 
      data: orders, 
      pagination: { page, limit, total, pages: Math.ceil(total / limit) } 
    });
  } catch (error) {
    console.error('GetMyOrders error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const query = { _id: req.params.id, tenant: req.tenantId };
    if (req.user.role === 'customer') query.customer = req.user._id;
    const order = await Order.findOne(query).populate('customer', 'firstName lastName email phone').populate('items.product', 'name images');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error('GetOrder error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, note, trackingNumber, trackingUrl } = req.body;
    const order = await Order.findOne({ _id: req.params.id, tenant: req.tenantId });
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const valid = { pending: ['confirmed', 'cancelled'], confirmed: ['processing', 'cancelled'], processing: ['shipped', 'cancelled'], shipped: ['delivered', 'returned'], delivered: ['returned', 'refunded'], cancelled: [], refunded: [], returned: ['refunded'] };
    if (!valid[order.status]?.includes(status)) return res.status(400).json({ success: false, message: `Cannot change from '${order.status}' to '${status}'` });

    order.status = status;
    order.statusHistory.push({ status, note: note || `Status updated to ${status}`, updatedBy: req.user._id });
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (trackingUrl) order.trackingUrl = trackingUrl;
    if (status === 'delivered') order.deliveredAt = new Date();

    if (status === 'cancelled') {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
        await Inventory.findOneAndUpdate({ tenant: req.tenantId, product: item.product }, {
          $inc: { quantity: item.quantity },
          $push: { movements: { type: 'return', quantity: item.quantity, reference: order.orderNumber, notes: 'Order cancelled', performedBy: req.user._id } }
        });
      }
    }

    await order.save();
    res.status(200).json({ success: true, message: `Status updated to ${status}`, data: order });
  } catch (error) {
    console.error('UpdateOrderStatus error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};