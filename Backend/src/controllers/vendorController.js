const Tenant = require('../models/Tenant');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Customer = require('../models/Customer');

exports.getDashboardStats = async (req, res) => {
  try {
    const tenantId = req.tenantId;
    const today = new Date();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

    const [totalProducts, activeProducts, totalOrders, monthlyOrders, lastMonthOrders, totalCustomers, monthlyRevenue, lastMonthRevenue, recentOrders, lowStockProducts] = await Promise.all([
      Product.countDocuments({ tenant: tenantId }),
      Product.countDocuments({ tenant: tenantId, status: 'active' }),
      Order.countDocuments({ tenant: tenantId }),
      Order.countDocuments({ tenant: tenantId, createdAt: { $gte: startOfMonth } }),
      Order.countDocuments({ tenant: tenantId, createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth } }),
      Customer.countDocuments({ tenant: tenantId }),
      Order.aggregate([{ $match: { tenant: tenantId, createdAt: { $gte: startOfMonth }, paymentStatus: 'completed' } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.aggregate([{ $match: { tenant: tenantId, createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }, paymentStatus: 'completed' } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.find({ tenant: tenantId }).sort({ createdAt: -1 }).limit(10).populate('customer', 'firstName lastName').lean(),
      Product.find({ tenant: tenantId, stock: { $lte: 10 }, trackInventory: true, status: 'active' }).select('name stock images sku').limit(10).lean(),
    ]);

    const currentRev = monthlyRevenue[0]?.total || 0;
    const prevRev = lastMonthRevenue[0]?.total || 0;
    const revGrowth = prevRev > 0 ? (((currentRev - prevRev) / prevRev) * 100).toFixed(1) : 0;
    const ordGrowth = lastMonthOrders > 0 ? (((monthlyOrders - lastMonthOrders) / lastMonthOrders) * 100).toFixed(1) : 0;

    res.status(200).json({
      success: true,
      data: {
        overview: { totalProducts, activeProducts, totalOrders, monthlyOrders, totalCustomers, monthlyRevenue: currentRev, revenueGrowth: parseFloat(revGrowth), orderGrowth: parseFloat(ordGrowth) },
        recentOrders, lowStockProducts
      }
    });
  } catch (error) {
    console.error('DashboardStats error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getVendorProfile = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.tenantId).populate('owner', 'firstName lastName email');
    if (!tenant) return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: tenant });
  } catch (error) {
    console.error('GetVendorProfile error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateVendorProfile = async (req, res) => {
  try {
    const allowed = ['name', 'branding', 'businessInfo', 'contactInfo', 'socialLinks', 'settings'];
    const updates = {};
    Object.keys(req.body).forEach(key => { if (allowed.includes(key)) updates[key] = req.body[key]; });

    const tenant = await Tenant.findByIdAndUpdate(req.tenantId, updates, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: 'Profile updated', data: tenant });
  } catch (error) {
    console.error('UpdateVendorProfile error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};