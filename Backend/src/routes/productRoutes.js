const express = require('express');
const router = express.Router();
const { createProduct, getProducts, getProduct, updateProduct, deleteProduct, uploadImages, getCategories, bulkUpdateStatus, getPublicProducts, getPublicProduct, getPublicCategories } = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { resolveTenant, requireTenant } = require('../middleware/tenantResolver');
const upload = require('../middleware/upload');

// Public routes (no auth required)
router.get('/public', getPublicProducts);
router.get('/public/categories', getPublicCategories);
router.get('/public/:id', getPublicProduct);

// Protected routes
router.use(protect);
router.use(resolveTenant);
router.use(requireTenant);

router.route('/').get(getProducts).post(authorize('vendor', 'vendor_staff', 'super_admin'), createProduct);
router.get('/categories', getCategories);
router.put('/bulk/status', authorize('vendor', 'super_admin'), bulkUpdateStatus);
router.route('/:id').get(getProduct).put(authorize('vendor', 'vendor_staff', 'super_admin'), updateProduct).delete(authorize('vendor', 'super_admin'), deleteProduct);
router.post('/:id/images', authorize('vendor', 'vendor_staff', 'super_admin'), upload.array('images', 10), uploadImages);

module.exports = router;