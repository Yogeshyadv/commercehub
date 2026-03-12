const express = require('express');
const router = express.Router();
const { generateDescription, generateTags, generateSEO, applyToProduct, getRecommendations, getSimilarProducts, generateTheme, generateCatalog, chat } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { resolveTenant, requireTenant } = require('../middleware/tenantResolver');

router.use(resolveTenant);
router.use(requireTenant);

// Public routes
router.get('/similar/:productId', getSimilarProducts);
router.post('/chat', chat);

// Protected routes
router.use(protect);
router.get('/recommendations', getRecommendations);

// Vendor only routes
router.post('/description', authorize('vendor', 'vendor_staff', 'super_admin'), generateDescription);
router.post('/tags', authorize('vendor', 'vendor_staff', 'super_admin'), generateTags);
router.post('/seo', authorize('vendor', 'vendor_staff', 'super_admin'), generateSEO);
router.post('/theme', authorize('vendor', 'vendor_staff', 'super_admin'), generateTheme);
router.post('/catalog', authorize('vendor', 'vendor_staff', 'super_admin'), generateCatalog);
router.post('/apply/:productId', authorize('vendor', 'vendor_staff', 'super_admin'), applyToProduct);

module.exports = router;