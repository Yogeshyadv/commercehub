const mongoose = require('mongoose');
const Customer = require('../models/Customer');
const Order = require('../models/Order');

// @desc    Get all customers
// @route   GET /api/v1/customers
// @access  Private (Vendor/Staff)
exports.getCustomers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;

    const query = { tenant: req.tenantId };

    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { email: { $regex: req.query.search, $options: 'i' } },
        { phone: { $regex: req.query.search, $options: 'i' } },
        { company: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    if (req.query.group) {
      query.group = req.query.group;
    }

    const total = await Customer.countDocuments(query);
    const customers = await Customer.find(query)
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit)
      .populate('user', 'firstName lastName email');

    const pagination = {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    };

    res.status(200).json({
      success: true,
      count: customers.length,
      pagination,
      data: customers
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single customer
// @route   GET /api/v1/customers/:id
// @access  Private (Vendor/Staff)
exports.getCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findOne({
      _id: req.params.id,
      tenant: req.tenantId
    }).populate('user', 'firstName lastName email photoUrl');

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // For order lookup, prefer user ID if linked, otherwise try customer ID (legacy/direct)
    const lookupId = customer.user ? customer.user._id : customer._id;
    const tenantId = new mongoose.Types.ObjectId(req.tenantId);

    // Get customer stats
    const stats = await Order.aggregate([
      { 
        $match: { 
          customer: lookupId, 
          tenant: tenantId, 
          status: { $nin: ['cancelled', 'refunded'] } 
        } 
      },
      {
        $group: {
          _id: null,
          totalSpent: { $sum: '$total' },
          orderCount: { $sum: 1 },
          lastOrder: { $max: '$createdAt' }
        }
      }
    ]);

    const customerObj = customer.toObject();
    if (stats.length > 0) {
      customerObj.stats = {
        totalSpent: stats[0].totalSpent,
        totalOrders: stats[0].orderCount, // Map to schema field
        orderCount: stats[0].orderCount, // Keep for frontend compatibility
        lastOrderDate: stats[0].lastOrder
      };
    } else {
      // If no orders found via aggregation, fallback to stored stats or defaults
      customerObj.stats = { 
        totalSpent: customer.stats?.totalSpent || 0, 
        totalOrders: customer.stats?.totalOrders || 0,
        orderCount: customer.stats?.totalOrders || 0, // Alias
        lastOrderDate: customer.stats?.lastOrderDate || null
      };
    }

    // Get recent orders
    const recentOrders = await Order.find({ 
      customer: lookupId, 
      tenant: req.tenantId 
    })
      .sort({ createdAt: -1 })
      .limit(5);
    
    // If customer has no saved addresses but has orders, try to extract unique addresses from orders
    if ((!customerObj.addresses || customerObj.addresses.length === 0) && recentOrders.length > 0) {
        const extractedAddresses = [];
        const seen = new Set();
        recentOrders.forEach(order => {
             if (order.shippingAddress) {
                 const key = `${order.shippingAddress.street}-${order.shippingAddress.zipCode}`;
                 if (!seen.has(key)) {
                     seen.add(key);
                     extractedAddresses.push({
                         street: order.shippingAddress.street,
                         city: order.shippingAddress.city,
                         state: order.shippingAddress.state,
                         zipCode: order.shippingAddress.zipCode,
                         country: order.shippingAddress.country,
                         label: 'From Order',
                         source: 'order'
                     });
                 }
             }
        });
        customerObj.addresses = extractedAddresses;
    }

    customerObj.recentOrders = recentOrders;

    res.status(200).json({
      success: true,
      data: customerObj
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new customer
// @route   POST /api/v1/customers
// @access  Private (Vendor/Staff)
exports.createCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.create({
      ...req.body,
      tenant: req.tenantId
    });

    res.status(201).json({
      success: true,
      data: customer
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update customer
// @route   PUT /api/v1/customers/:id
// @access  Private (Vendor/Staff)
exports.updateCustomer = async (req, res, next) => {
  try {
    let customer = await Customer.findOne({ _id: req.params.id, tenant: req.tenantId });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: customer
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete customer
// @route   DELETE /api/v1/customers/:id
// @access  Private (Vendor/Staff)
exports.deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findOne({ _id: req.params.id, tenant: req.tenantId });

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    // Check if customer has orders
    const hasOrders = await Order.exists({ customer: req.params.id });
    if (hasOrders) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete customer with existing orders. Archive them instead.' 
      });
    }

    await customer.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};