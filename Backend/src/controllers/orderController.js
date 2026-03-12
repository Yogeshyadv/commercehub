const Order = require('../models/Order');
const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const Customer = require('../models/Customer');
const Tenant = require('../models/Tenant'); // Moved to top
const Notification = require('../models/Notification'); // Import Notification model
const User = require('../models/User');
const notificationService = require('../services/notificationService');
const { getPagination } = require('../utils/helpers');

// @desc    Create customer order (from public store)
exports.createCustomerOrder = async (req, res) => {
  try {
    const { items, shippingAddress, billingAddress, paymentMethod, customerNotes, loyaltyPointsRedeemed = 0 } = req.body;
    if (!items || items.length === 0) return res.status(400).json({ success: false, message: 'Order must have items' });

    // Validate loyalty points if provided
    if (loyaltyPointsRedeemed > 0) {
      const userRecord = await User.findById(req.user._id, 'loyaltyPoints');
      if (!userRecord || userRecord.loyaltyPoints < loyaltyPointsRedeemed) {
        return res.status(400).json({ success: false, message: 'Insufficient loyalty points' });
      }
    }
    if (!paymentMethod) return res.status(400).json({ success: false, message: 'Payment method is required' });

    // Get tenant from first product
    const firstProduct = await Product.findOne({ _id: items[0].product, status: { $in: ['active', 'published'] } });
    if (!firstProduct) return res.status(404).json({ success: false, message: 'One or more products not found or unavailable' });
    
    const tenantId = firstProduct.tenant;

    let subtotal = 0, taxAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findOne({ _id: item.product, status: { $in: ['active', 'published'] } });
      if (!product) return res.status(404).json({ success: false, message: `Product ${item.product} not found or unavailable` });
      
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

    const total = subtotal + taxAmount + (req.body.shippingCost || 0) - (req.body.discount || 0) - loyaltyPointsRedeemed;

    const order = await Order.create({
      tenant: tenantId, 
      customer: req.user._id, 
      items: orderItems, 
      shippingAddress,
      billingAddress: billingAddress || shippingAddress, 
      subtotal, 
      taxAmount,
      shippingCost: req.body.shippingCost || 0, 
      discount: (req.body.discount || 0) + loyaltyPointsRedeemed,
      loyaltyPointsRedeemed,
      total: Math.max(0, total), 
      paymentMethod, 
      customerNotes, 
      source: req.body.source || 'web',
      statusHistory: [{ status: 'pending', note: 'Order placed', updatedBy: req.user._id }]
    });

    // Update inventory
    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity, orderCount: 1 } });
      try {
        await Inventory.findOneAndUpdate({ tenant: tenantId, product: item.product }, {
          $inc: { quantity: -item.quantity },
          $push: { movements: { type: 'out', quantity: item.quantity, reference: order.orderNumber, notes: 'Order placed', performedBy: req.user._id } }
        });
      } catch (invError) {
        console.warn('Inventory update failed but order placed:', invError.message);
      }
    }

    await Tenant.findByIdAndUpdate(tenantId, { $inc: { 'metadata.totalOrders': 1, 'metadata.totalRevenue': total } });

    // Deduct redeemed loyalty points
    if (loyaltyPointsRedeemed > 0) {
      await User.findByIdAndUpdate(req.user._id, { $inc: { loyaltyPoints: -loyaltyPointsRedeemed } });
    }
    
    // Notify Vendor (Tenant Owner)
    try {
        const tenant = await Tenant.findById(tenantId);
        if (tenant && tenant.owner) {
             const customerName = `${req.user.firstName} ${req.user.lastName}`;
             const notif = await Notification.create({
                recipient: tenant.owner,
                sender: req.user._id,
                type: 'NEW_ORDER',
                title: 'New Order Received',
                message: `You have a new order #${order._id.toString().slice(-8).toUpperCase()} from ${customerName} worth ₹${total}`,
                relatedId: order._id
             });
             
             // Emit Socket Event
             const io = req.app.get('io');
             if (io) {
                 io.to(tenant.owner.toString()).emit('notification', notif);
                 io.to(tenant._id.toString()).emit('new_order', {
                     orderId: order._id,
                     customer: customerName,
                     amount: total,
                     status: 'pending'
                 });
             }
             // Check for low stock on each ordered item
             for (const item of orderItems) {
               const updatedProd = await Product.findById(item.product, 'name stock trackInventory');
               if (updatedProd?.trackInventory && updatedProd.stock <= 5) {
                 const lowNotif = await Notification.create({
                   recipient: tenant.owner,
                   type: 'LOW_STOCK',
                   title: 'Low Stock Alert',
                   message: `"${updatedProd.name}" has only ${updatedProd.stock} unit${updatedProd.stock !== 1 ? 's' : ''} left after a recent order.`,
                   relatedId: updatedProd._id
                 });
                 if (io) io.to(tenant.owner.toString()).emit('notification', lowNotif);
               }
             }
        }
    } catch (notifErr) {
        console.error('Failed to notify vendor', notifErr);
    }
    
    // Sync Customer Record for Analytics
    try {
      const customerName = `${req.user.firstName} ${req.user.lastName}`;
      await Customer.findOneAndUpdate(
        { tenant: tenantId, user: req.user._id },
        { 
          $set: { 
            name: customerName,
            email: req.user.email,
            phone: req.user.phone,
            'stats.lastOrderDate': new Date()
          },
          $setOnInsert: { 
            'stats.firstOrderDate': new Date(),
            source: 'website'
          },
          $inc: { 
            'stats.totalOrders': 1, 
            'stats.totalSpent': total 
          }
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } catch (custErr) {
      console.error('Failed to sync customer record', custErr);
    }

    const populatedOrder = await Order.findById(order._id).populate('customer', 'firstName lastName email phone');
    res.status(201).json({ success: true, message: 'Order created successfully', data: populatedOrder });
  } catch (error) {
    console.error('CreateCustomerOrder error:', error);
    // Return specific error message to frontend
    return res.status(500).json({ success: false, message: error.message || 'Failed to place order' });
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
        .populate('customer', 'firstName lastName email') // Populate customer for UI
        .populate('tenant', 'name') // Populate tenant name for UI
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
    // If customer, find by ID and check access
    // If vendor/admin (with tenantId), filter by tenant
    
    let query = { _id: req.params.id };
    
    // For customers, we don't enforce tenant check in query, we check ownership
    if (req.user.role === 'customer') {
      // Allow finding by ID, will check customer field ownership below
    } else if (req.tenantId) {
      // Vendor/Admin context with tenant header
      query.tenant = req.tenantId;
    }

    const order = await Order.findOne(query)
      .populate('customer', 'firstName lastName email phone')
      .populate('items.product', 'name images')
      .populate('tenant', 'name contactInfo');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Authorization Check
    if (req.user.role === 'customer' && order.customer._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

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
    if (status === 'delivered') {
      order.deliveredAt = new Date();
      // Award loyalty points: 1 point per ₹10 spent
      const pointsToAward = Math.floor((order.total || 0) / 10);
      if (pointsToAward > 0) {
        await User.findByIdAndUpdate(order.customer, { $inc: { loyaltyPoints: pointsToAward } });
      }
    }

    // Create Notification
    const notificationMessages = {
      confirmed: 'Your order has been confirmed and is being prepared.',
      processing: 'Your order is being packaged and processed.',
      shipped: 'Your order has been packaged and shipped! It will be delivered in 3 days.',
      delivered: 'Your order has been delivered successfully.',
      cancelled: 'Your order has been cancelled.'
    };

    if (notificationMessages[status]) {
      const notif = await Notification.create({
        recipient: order.customer,
        sender: req.user._id,
        type: 'ORDER_UPDATE',
        title: `Order ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        message: `${notificationMessages[status]} (Order #${order.orderNumber || order._id})`,
        relatedId: order._id
      });
      // Emit Socket Event to customer
      const io = req.app.get('io');
      if (io) {
        io.to(order.customer.toString()).emit('notification', notif);
      }
    }

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

    // Send SMS to customer on meaningful status changes
    if (notificationMessages[status]) {
      try {
        const customerUser = await User.findById(order.customer, 'phone firstName').lean();
        if (customerUser?.phone) {
          const smsMsg = notificationService.getOrderNotification(
            { orderNumber: order.orderNumber || order._id.toString().slice(-8).toUpperCase(), total: order.total, trackingNumber: order.trackingNumber },
            status
          );
          await notificationService.sendSMS(customerUser.phone, smsMsg);
        }
      } catch (smsErr) {
        console.error('SMS notification failed (non-fatal):', smsErr.message);
      }
    }

    res.status(200).json({ success: true, message: `Status updated to ${status}`, data: order });
  } catch (error) {
    console.error('UpdateOrderStatus error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Cancel order (customer)
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.user._id
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.status !== 'pending' && order.status !== 'confirmed') {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled in its current state' });
    }

    order.status = 'cancelled';
    order.statusHistory.push({ status: 'cancelled', note: 'Customer cancelled order', updatedBy: req.user._id });
    
    // Restock inventory
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } });
      try {
        await Inventory.findOneAndUpdate({ tenant: order.tenant, product: item.product }, {
          $inc: { quantity: item.quantity },
          $push: { movements: { type: 'in', quantity: item.quantity, reference: order.orderNumber, notes: 'Order cancelled by customer', performedBy: req.user._id } }
        });
      } catch (invError) {
        console.warn('Inventory update failed, ignoring', invError);
      }
    }

    await order.save();

    // Notify Vendor (Tenant Owner)
    try {
        const tenant = await Tenant.findById(order.tenant);
        if (tenant && tenant.owner) {
             const customerName = `${req.user.firstName} ${req.user.lastName}`;
             await Notification.create({
                recipient: tenant.owner,
                sender: req.user._id,
                type: 'ORDER_UPDATE',
                title: 'Order Cancelled',
                message: `Order #${order.orderNumber || order._id.toString().slice(-8).toUpperCase()} has been cancelled by the customer ${customerName}.`,
                relatedId: order._id
             });
        }
    } catch (notifErr) {
        console.error('Failed to notify vendor about cancellation', notifErr);
    }
    
    // Notify Customer (redundant as they did it, but good for record)
    try { 
      await Notification.create({
        recipient: req.user._id,
        sender: null,
        type: 'ORDER_UPDATE',
        title: 'Order Cancelled',
        message: `You have successfully cancelled your order #${order._id.toString().slice(-8).toUpperCase()}.`,
        relatedId: order._id
      });
    } catch(err) {
      console.error('Failed to notify customer about cancellation', err);
    }

    res.status(200).json({ success: true, message: 'Order cancelled successfully', data: order });
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create order from WhatsApp catalog (public — no auth required)
// @route   POST /api/v1/orders/whatsapp
// Accepts cart from the public catalog page after customer clicks
// "Order on WhatsApp". Customer lands on the URL, we record the order.
exports.createWhatsAppOrder = async (req, res) => {
  try {
    const { tenantId, catalogName, customerName, customerPhone, items } = req.body;

    if (!tenantId) return res.status(400).json({ success: false, message: 'tenantId is required' });
    if (!items || items.length === 0) return res.status(400).json({ success: false, message: 'items array is required' });

    const mongoose = require('mongoose');
    if (!mongoose.Types.ObjectId.isValid(tenantId)) {
      return res.status(400).json({ success: false, message: 'Invalid tenantId' });
    }

    // Verify the tenant exists
    const tenant = await Tenant.findById(tenantId).lean();
    if (!tenant) return res.status(404).json({ success: false, message: 'Store not found' });

    // Find or create a guest user keyed by phone, so repeat customer are recognised
    const phone = (customerPhone || '').replace(/\D/g, '').slice(-10);
    const guestEmail = `wa_${phone || 'guest'}@whatsapp.local`;
    const guestFirstName = customerName?.split(' ')[0] || 'WhatsApp';
    const guestLastName  = customerName?.split(' ').slice(1).join(' ') || 'Customer';

    let guestUser = await User.findOne({ email: guestEmail }).lean();
    if (!guestUser) {
      const bcrypt = require('bcryptjs');
      const randomPwd = await bcrypt.hash(Math.random().toString(36), 10);
      guestUser = await User.create({
        firstName: guestFirstName,
        lastName:  guestLastName,
        email:     guestEmail,
        phone:     phone || undefined,
        password:  randomPwd,
        role:      'customer',
        isEmailVerified: false,
      });
    }

    // Resolve items from DB (validate products belong to this tenant)
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      if (!item.productId || !mongoose.Types.ObjectId.isValid(item.productId)) continue;
      const product = await Product.findOne({ _id: item.productId, tenant: tenantId }).lean();
      if (!product) continue;
      const qty = Math.max(1, parseInt(item.quantity, 10) || 1);
      const lineTotal = product.price * qty;
      orderItems.push({
        product: product._id,
        name:    product.name,
        sku:     product.sku,
        image:   product.images?.[0]?.url,
        price:   product.price,
        quantity: qty,
        tax:     0,
        total:   lineTotal,
      });
      subtotal += lineTotal;
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid products found' });
    }

    const order = await Order.create({
      tenant:        tenantId,
      customer:      guestUser._id,
      items:         orderItems,
      subtotal,
      taxAmount:     0,
      shippingCost:  0,
      discount:      0,
      total:         subtotal,
      paymentMethod: 'whatsapp',
      source:        'whatsapp',
      customerNotes: catalogName ? `Via catalog: ${catalogName}` : 'WhatsApp order',
      statusHistory: [{ status: 'pending', note: 'WhatsApp order received' }],
    });

    // Emit real-time notification to vendor
    try {
      if (tenant.owner) {
        const notif = await Notification.create({
          recipient: tenant.owner,
          type:      'NEW_ORDER',
          title:     'New WhatsApp Order',
          message:   `New order from ${customerName || phone || 'WhatsApp customer'} — ₹${subtotal}`,
          relatedId: order._id,
        });
        const io = req.app.get('io');
        if (io) {
          io.to(tenant.owner.toString()).emit('notification', notif);
          io.to(tenantId.toString()).emit('new_order', {
            orderId: order._id,
            customer: customerName || phone || 'WhatsApp',
            amount: subtotal,
            status: 'pending',
            source: 'whatsapp',
          });
        }
      }
    } catch (notifErr) {
      console.error('WhatsApp order notification error (non-fatal):', notifErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Order recorded successfully',
      data: { orderId: order._id, orderNumber: order.orderNumber, total: subtotal }
    });
  } catch (error) {
    console.error('CreateWhatsAppOrder error:', error);
    res.status(500).json({ success: false, message: 'Failed to record order' });
  }
};