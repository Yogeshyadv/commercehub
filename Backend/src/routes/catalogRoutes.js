const express = require('express');
const router = express.Router();
const { createCatalog, getCatalogs, getCatalog, getPublicCatalog, updateCatalog, deleteCatalog, addProducts, removeProduct, uploadCoverImage, syncProducts } = require('../controllers/catalogController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/rbac');
const { resolveTenant, requireTenant } = require('../middleware/tenantResolver');
const upload = require('../middleware/upload');

router.get('/public/:shareableLink', getPublicCatalog);

router.use(protect);
router.use(resolveTenant);
router.use(requireTenant);

router.route('/').get(getCatalogs).post(authorize('vendor', 'vendor_staff', 'super_admin'), createCatalog);
router.route('/:id').get(getCatalog).put(authorize('vendor', 'vendor_staff', 'super_admin'), updateCatalog).delete(authorize('vendor', 'super_admin'), deleteCatalog);
router.post('/:id/products', authorize('vendor', 'vendor_staff', 'super_admin'), addProducts);
router.put('/:id/products', authorize('vendor', 'vendor_staff', 'super_admin'), syncProducts);
router.delete('/:id/products/:productId', authorize('vendor', 'vendor_staff', 'super_admin'), removeProduct);
router.post('/:id/cover', authorize('vendor', 'vendor_staff', 'super_admin'), upload.single('coverImage'), uploadCoverImage);

module.exports = router;