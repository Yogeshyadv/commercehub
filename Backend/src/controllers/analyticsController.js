const Order = require('../models/Order');
const Customer = require('../models/Customer');
const mongoose = require('mongoose');

exports.getSalesAnalytics = async (req, res) => {
  try {
    // Ensure tenantId is ObjectId for aggregation matching
    const tenantId = new mongoose.Types.ObjectId(req.tenantId);
    
    const { period = '30d' } = req.query;
    let startDate;
    const endDate = new Date();

    switch (period) {
      case 'today': startDate = new Date(); break;
      case '7d': startDate = new Date(Date.now() - 7 * 86400000); break;
      case '30d': startDate = new Date(Date.now() - 30 * 86400000); break;
      case '90d': startDate = new Date(Date.now() - 90 * 86400000); break;
      case '1y': startDate = new Date(Date.now() - 365 * 86400000); break;
      default: startDate = new Date(Date.now() - 30 * 86400000);
    }
    
    // Normalize startDate to midnight
    startDate.setHours(0,0,0,0);

    const [salesDataRaw, topProducts, summary, orderStatusBreakdown, salesByCategory, salesByRegion] = await Promise.all([
      Order.aggregate([
        { 
            $match: { 
                tenant: tenantId, 
                createdAt: { $gte: startDate }, 
                status: { $nin: ['cancelled', 'refunded'] } 
            } 
        },
        { 
            $group: { 
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, 
                revenue: { $sum: '$total' }, 
                orders: { $sum: 1 }, 
                averageOrderValue: { $avg: '$total' } 
            } 
        },
        { $sort: { _id: 1 } }
      ]),
      Order.aggregate([
        { $match: { tenant: tenantId, createdAt: { $gte: startDate }, status: { $nin: ['cancelled'] } } },
        { $unwind: '$items' },
        { $group: { _id: '$items.product', name: { $first: '$items.name' }, totalQuantity: { $sum: '$items.quantity' }, totalRevenue: { $sum: '$items.total' } } },
        { $sort: { totalRevenue: -1 } }, { $limit: 10 }
      ]),
      Order.aggregate([
        { $match: { tenant: tenantId, createdAt: { $gte: startDate }, status: { $nin: ['cancelled'] } } },
        { $group: { _id: null, totalRevenue: { $sum: '$total' }, totalOrders: { $sum: 1 }, averageOrderValue: { $avg: '$total' }, totalTax: { $sum: '$taxAmount' } } }
      ]),
      Order.aggregate([
        { $match: { tenant: tenantId, createdAt: { $gte: startDate } } },
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      // Sales by Category
      Order.aggregate([
        { $match: { tenant: tenantId, createdAt: { $gte: startDate }, status: { $nin: ['cancelled'] } } },
        { $unwind: '$items' },
        {
          $lookup: {
            from: 'products',
            localField: 'items.product',
            foreignField: '_id',
            as: 'productDetails'
          }
        },
        { $unwind: '$productDetails' },
        {
          $group: {
            _id: '$productDetails.category',
            revenue: { $sum: '$items.total' },
            count: { $sum: '$items.quantity' }
          }
        },
        { $sort: { revenue: -1 } },
        { $limit: 5 }
      ]),
      // Sales by Region (State)
      Order.aggregate([
        { $match: { tenant: tenantId, createdAt: { $gte: startDate }, status: { $nin: ['cancelled'] } } },
        { $group: { _id: '$shippingAddress.state', revenue: { $sum: '$total' }, count: { $sum: 1 } } },
        { $sort: { revenue: -1 } },
        { $limit: 5 }
      ])
    ]);
    
    // Fill in missing dates
    const salesData = [];
    const currentDate = new Date(startDate);
    const today = new Date();
    today.setHours(23, 59, 59, 999);

    if (period === 'today') {
      const existing = salesDataRaw.length > 0 ? salesDataRaw[0] : null;
      salesData.push(existing || {
          _id: startDate.toISOString().split('T')[0],
          revenue: 0,
          orders: 0,
          averageOrderValue: 0
      });
    } else {
        while (currentDate <= today) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const existing = salesDataRaw.find(d => d._id === dateStr);
            
            if (existing) {
                salesData.push(existing);
            } else {
                salesData.push({
                    _id: dateStr,
                    revenue: 0,
                    orders: 0,
                    averageOrderValue: 0
                });
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    res.status(200).json({
      success: true,
      data: { 
        period, 
        summary: summary[0] || { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0, totalTax: 0 }, 
        salesData, 
        topProducts, 
        orderStatusBreakdown,
        salesByCategory, 
        salesByRegion
      }
    });
  } catch (error) {
    console.error('SalesAnalytics error:', error);
    return res.status(500).json({ success: false, message: error.message, stack: error.stack });
  }
};

exports.getCustomerAnalytics = async (req, res) => {
  try {
    const tenantId = new mongoose.Types.ObjectId(req.tenantId);
    
    // We already use Mongoose model methods here, so tenantId casting might be handled,
    // but aggregate stages below will fail if not cast.
    const [totalCustomers, newThisMonth, customerGroups, topCustomers] = await Promise.all([
      Customer.countDocuments({ tenant: tenantId }),
      Customer.countDocuments({ tenant: tenantId, createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } }),
      // Aggregate needs explicit ObjectId
      Customer.aggregate([{ $match: { tenant: tenantId } }, { $group: { _id: '$group', count: { $sum: 1 } } }]),
      Customer.find({ tenant: tenantId }).sort({ 'stats.totalSpent': -1 }).limit(10).select('name email stats').lean()
    ]);

    res.status(200).json({ success: true, data: { totalCustomers, newThisMonth, customerGroups, topCustomers } });
  } catch (error) {
    console.error('CustomerAnalytics error:', error);
    return res.status(500).json({ success: false, message: error.message, stack: error.stack });
  }
};