const User = require('../models/User');
const Tenant = require('../models/Tenant');
const AuditLog = require('../models/AuditLog');
const notificationService = require('../services/notificationService');
const crypto = require('crypto');

// ── Cookie helpers ────────────────────────────────────────────
const ACCESS_COOKIE_OPTS = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  expires: new Date(Date.now() + 15 * 60 * 1000), // 15 min
});

const REFRESH_COOKIE_OPTS = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/api/v1/auth/refresh-token', // scoped to refresh endpoint
  expires: new Date(
    Date.now() +
      (parseInt(process.env.REFRESH_TOKEN_EXPIRE_DAYS) || 30) * 24 * 60 * 60 * 1000
  ),
});

// Helper: send access + refresh tokens
const sendTokenResponse = async (user, statusCode, res, message = 'Success') => {
  const accessToken  = user.getSignedJwtToken();
  const refreshToken = user.createRefreshToken(
    res.req?.headers?.['user-agent'] || 'unknown'
  );
  await user.save({ validateBeforeSave: false });

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshTokens;

  return res
    .status(statusCode)
    .cookie('token',         accessToken,  ACCESS_COOKIE_OPTS())
    .cookie('refreshToken',  refreshToken, REFRESH_COOKIE_OPTS())
    .json({
      success: true,
      message,
      token: accessToken,
      user: userObj,
    });
};

// @desc    Refresh access token
// @route   POST /api/v1/auth/refresh-token
exports.refreshToken = async (req, res) => {
  try {
    const rawToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!rawToken) {
      return res.status(401).json({ success: false, message: 'No refresh token provided' });
    }

    const hashed = crypto.createHash('sha256').update(rawToken).digest('hex');
    const user = await User.findOne({
      'refreshTokens.token': hashed,
      'refreshTokens.expiresAt': { $gt: new Date() },
    }).select('+refreshTokens');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }

    // Rotate: remove used token
    user.refreshTokens = user.refreshTokens.filter(t => t.token !== hashed);
    await sendTokenResponse(user, 200, res, 'Token refreshed');
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Revoke all refresh tokens (logout everywhere)
// @route   POST /api/v1/auth/logout-all
exports.logoutAll = async (req, res) => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user._id, { $set: { refreshTokens: [] } });
    }
    res
      .clearCookie('token')
      .clearCookie('refreshToken', { path: '/api/v1/auth/refresh-token' })
      .json({ success: true, message: 'Logged out from all devices' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc    Register user
// @route   POST /api/v1/auth/register
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, role, businessName } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide firstName, lastName, email and password'
      });
    }

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    // Generate email verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

    // Create user (unverified)
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
      phone,
      role: role || 'customer',
      isEmailVerified: process.env.NODE_ENV === 'development' || process.env.SKIP_EMAIL_VERIFICATION === 'true', // Auto-verify in development or if explicitly skipped
      emailVerificationToken: hashedToken,
      emailVerificationExpire: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    });

    // If registering as vendor, create a tenant
    if (role === 'vendor' && businessName) {
      const tenant = await Tenant.create({
        name: businessName,
        owner: user._id,
        contactInfo: {
          email: email,
          phone: phone
        }
      });

      user.tenant = tenant._id;
      await user.save({ validateBeforeSave: false });
    }

    // Log the registration
    try {
      await AuditLog.create({
        tenant: user.tenant,
        user: user._id,
        action: 'create',
        resource: 'user',
        resourceId: user._id,
        description: `New ${role || 'customer'} registered: ${email}`,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
    } catch (logError) {
      // Don't fail registration if audit log fails
      console.error('Audit log error:', logError.message);
    }

    // Send verification email
    try {
      await notificationService.sendVerificationEmail(
        email,
        verificationToken,
        `${firstName} ${lastName}`
      );
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Continue registration even if email fails
    }

    // Return success without auto-login (user must verify email first)
    res.status(201).json({
      success: true,
      message: 'Registration successful! Please check your email to verify your account.',
      email: email
    });
  } catch (error) {
    console.error('Register error:', error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. ')
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({
        success: false,
        message: `Duplicate value for field: ${field}`
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    const user = await User.findOne({ email }).select('+password').populate('tenant');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been deactivated'
      });
    }

    // Check email verification
    if (!user.isEmailVerified && process.env.NODE_ENV !== 'development') {
      return res.status(401).json({
        success: false,
        message: 'Please verify your email address before logging in',
        needsVerification: true
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    // Audit log
    try {
      await AuditLog.create({
        tenant: user.tenant?._id,
        user: user._id,
        action: 'login',
        resource: 'auth',
        description: `User logged in: ${email}`,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
    } catch (logError) {
      console.error('Audit log error:', logError.message);
    }

    sendTokenResponse(user, 200, res, 'Login successful');
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Logout
// @route   POST /api/v1/auth/logout
exports.logout = async (req, res) => {
  try {
    res.cookie('token', 'none', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true
    });

    if (req.user) {
      try {
        await AuditLog.create({
          tenant: req.user.tenant,
          user: req.user._id,
          action: 'logout',
          resource: 'auth',
          description: `User logged out: ${req.user.email}`,
          ipAddress: req.ip,
          userAgent: req.get('User-Agent')
        });
      } catch (logError) {
        console.error('Audit log error:', logError.message);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during logout'
    });
  }
};

// @desc    Get current user
// @route   GET /api/v1/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('tenant');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('GetMe error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update profile
// @route   PUT /api/v1/auth/update-profile
exports.updateProfile = async (req, res) => {
  try {
    const fieldsToUpdate = {};
    if (req.body.firstName) fieldsToUpdate.firstName = req.body.firstName;
    if (req.body.lastName) fieldsToUpdate.lastName = req.body.lastName;
    if (req.body.phone) fieldsToUpdate.phone = req.body.phone;
    if (req.body.addresses) fieldsToUpdate.addresses = req.body.addresses;

    const user = await User.findByIdAndUpdate(req.user._id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    // Sync phone to tenant's contactInfo so catalogs pick it up automatically
    if (req.body.phone && req.tenantId) {
      await Tenant.findByIdAndUpdate(req.tenantId, { 'contactInfo.phone': req.body.phone });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });
  } catch (error) {
    console.error('UpdateProfile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Update password
// @route   PUT /api/v1/auth/update-password
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide current and new password'
      });
    }

    const user = await User.findById(req.user._id).select('+password');

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res, 'Password updated successfully');
  } catch (error) {
    console.error('UpdatePassword error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with that email'
      });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Send the password reset email
    await notificationService.sendPasswordResetEmail(user.email, resetToken, user.firstName);

    res.status(200).json({
      success: true,
      message: 'Password reset email sent'
    });
  } catch (error) {
    console.error('ForgotPassword error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Verify email
// @route   GET /api/v1/auth/verify-email/:token
exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Verification token is required'
      });
    }

    // Hash the token to match stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user with matching token and not expired
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpire: { $gt: Date.now() }
    }).populate('tenant');

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Verify the email
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save({ validateBeforeSave: false });

    // Log the verification
    try {
      await AuditLog.create({
        tenant: user.tenant?._id,
        user: user._id,
        action: 'update',
        resource: 'user',
        resourceId: user._id,
        description: `Email verified: ${user.email}`,
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });
    } catch (logError) {
      console.error('Audit log error:', logError.message);
    }

    // Send token response to auto-login user
    sendTokenResponse(user, 200, res, 'Email verified successfully! You are now logged in.');
  } catch (error) {
    console.error('VerifyEmail error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during email verification'
    });
  }
};

// @desc    Resend verification email
// @route   POST /api/v1/auth/resend-verification
exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No user found with that email'
      });
    }

    if (user.isEmailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Email is already verified'
      });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(verificationToken).digest('hex');

    user.emailVerificationToken = hashedToken;
    user.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save({ validateBeforeSave: false });

    // Send verification email
    try {
      await notificationService.sendVerificationEmail(
        email,
        verificationToken,
        `${user.firstName} ${user.lastName}`
      );
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      return res.status(500).json({
        success: false,
        message: 'Failed to send verification email'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Verification email sent successfully'
    });
  } catch (error) {
    console.error('ResendVerification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// @desc    Reset password
// @route   PUT /api/v1/auth/reset-password/:resettoken
exports.resetPassword = async (req, res) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res, 'Password reset successful');
  } catch (error) {
    console.error('ResetPassword error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};