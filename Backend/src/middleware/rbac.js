// Role-based access control
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role '${req.user.role}' is not authorized to access this route`
      });
    }

    next();
  };
};

// Check if user belongs to the tenant
exports.checkTenantAccess = async (req, res, next) => {
  if (req.user.role === 'super_admin') {
    return next(); // Super admin has access to everything
  }

  const tenantId = req.params.tenantId || req.body.tenant || req.user.tenant;

  if (!tenantId) {
    return res.status(400).json({
      success: false,
      message: 'Tenant ID is required'
    });
  }

  if (req.user.tenant && req.user.tenant.toString() !== tenantId.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to access this tenant\'s data'
    });
  }

  req.tenantId = tenantId;
  next();
};