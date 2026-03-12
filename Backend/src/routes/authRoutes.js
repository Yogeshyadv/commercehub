const express = require('express');
const router = express.Router();
const {
  register,
  login,
  logout,
  getMe,
  updateProfile,
  updatePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  refreshToken,
  logoutAll,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const { validate, rules } = require('../middleware/validate');

// Public auth routes
router.post('/register',            validate(rules.register),       register);
router.post('/login',               validate(rules.login),          login);
router.post('/refresh-token',       refreshToken);
router.post('/forgot-password',     validate(rules.forgotPassword), forgotPassword);
router.put('/reset-password/:resettoken', validate(rules.resetPassword), resetPassword);
router.get('/verify-email/:token',  verifyEmail);
router.post('/resend-verification', resendVerification);

// Protected auth routes
router.post('/logout',             protect, logout);
router.post('/logout-all',         protect, logoutAll);
router.get('/me',                  protect, getMe);
router.put('/update-profile',      protect, updateProfile);
router.put('/update-password',     protect, validate(rules.updatePassword), updatePassword);

module.exports = router;