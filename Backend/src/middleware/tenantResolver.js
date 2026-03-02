const Tenant = require('../models/Tenant');

// Resolve tenant from subdomain, header, or user
exports.resolveTenant = async (req, res, next) => {
  let tenantId = null;

  // 1. Check x-tenant-id header
  if (req.headers['x-tenant-id']) {
    tenantId = req.headers['x-tenant-id'];
  }

  // 2. Check subdomain
  if (!tenantId) {
    const host = req.hostname;
    const parts = host.split('.');
    if (parts.length > 2) {
      const subdomain = parts[0];
      const tenant = await Tenant.findOne({ slug: subdomain, isActive: true });
      if (tenant) {
        tenantId = tenant._id;
      }
    }
  }

  // 3. Fall back to authenticated user's tenant
  if (!tenantId && req.user && req.user.tenant) {
    tenantId = req.user.tenant._id || req.user.tenant;
  }

  if (tenantId) {
    req.tenantId = tenantId;
  }

  next();
};

// Require tenant - fail if not resolved
exports.requireTenant = (req, res, next) => {
  if (!req.tenantId) {
    return res.status(400).json({
      success: false,
      message: 'Tenant context is required. Please provide x-tenant-id header or use a tenant subdomain.'
    });
  }
  next();
};