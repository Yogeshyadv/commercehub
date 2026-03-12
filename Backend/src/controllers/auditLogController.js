const AuditLog = require('../models/AuditLog');
const { getPagination } = require('../utils/helpers');

// @desc    Get audit logs for tenant
// @route   GET /api/v1/audit-logs
// @access  Private (Vendor/Admin)
exports.getAuditLogs = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query.page, req.query.limit);
    const query = { tenant: req.tenantId };

    if (req.query.action) query.action = req.query.action;
    if (req.query.resource) query.resource = req.query.resource;
    if (req.query.userId) query.user = req.query.userId;
    if (req.query.from || req.query.to) {
      query.createdAt = {};
      if (req.query.from) query.createdAt.$gte = new Date(req.query.from);
      if (req.query.to)   query.createdAt.$lte = new Date(req.query.to);
    }

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('user', 'firstName lastName email')
        .lean(),
      AuditLog.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: logs,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('GetAuditLogs error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
