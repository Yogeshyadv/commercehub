const Order = require('../models/Order');
const Customer = require('../models/Customer');

exports.getSalesAnalytics = async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const { period = '30d' } = req.query;
    let startDate;
    const endDate = new Date();

    switch (period) {
      case '7d': startDate = new Date(Date.now() - 7 * 86400000); break;
      case '30d': startDate = new Date(Date.now() - 30 * 86400000); break;
      case '90d': startDate = new Date(Date.now() - 90 * 86400000); break;
      case '1y': startDate = new Date(Date.now() - 365 * 86400000); break;
      default: startDate = new Date(Date.now() - 30 * 86400000);
    }

    const [salesData, topProducts, summary] = await Promise.all([
      Order.aggregate([
        { $match: { tenant: tenantId, createdAt: { $gte: startDate, $lte: endDate }, paymentStatus: { $in: ['completed', 'pending'] } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, revenue: { $sum: '$total' }, orders: { $sum: 1 }, averageOrderValue: { $avg: '$total' } } },
        { $sort: { _id: 1 } }
      ]),
      Order.aggregate([
        { $match: { tenant: tenantId, createdAt: { $gte: startDate } } },
        { $unwind: '$items' },
        { $group: { _id: '$items.product', name: { $first: '$items.name' }, totalQuantity: { $sum: '$items.quantity' }, totalRevenue: { $sum: '$items.total' } } },
        { $sort: { totalRevenue: -1 } }, { $limit: 10 }
      ]),
      Order.aggregate([
        { $match: { tenant: tenantId, createdAt: { $gte: startDate }, paymentStatus: 'completed' } },
        { $group: { _id: null, totalRevenue: { $sum: '$total' }, totalOrders: { $sum: 1 }, averageOrderValue: { $avg: '$total' }, totalTax: { $sum: '$taxAmount' } } }
      ])
    ]);

    res.status(200).json({
      success: true,
      data: { period, summary: summary[0] || { totalRevenue: 0, totalOrders: 0, averageOrderValue: 0, totalTax: 0 }, salesData, topProducts }
    });
  } catch (error) {
    console.error('SalesAnalytics error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getCustomerAnalytics = async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const [totalCustomers, newThisMonth, customerGroups, topCustomers] = await Promise.all([
      Customer.countDocuments({ tenant: tenantId }),
      Customer.countDocuments({ tenant: tenantId, createdAt: { $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } }),
      Customer.aggregate([{ $match: { tenant: tenantId } }, { $group: { _id: '$group', count: { $sum: 1 } } }]),
      Customer.find({ tenant: tenantId }).sort({ 'stats.totalSpent': -1 }).limit(10).select('name email stats').lean()
    ]);

    res.status(200).json({ success: true, data: { totalCustomers, newThisMonth, customerGroups, topCustomers } });
  } catch (error) {
    console.error('CustomerAnalytics error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};