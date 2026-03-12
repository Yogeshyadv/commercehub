const express = require('express');
const router = express.Router();
const { getProductInventory, getAllInventory, addInventoryLocation, updateStock, transferStock } = require('../controllers/inventoryController');
const { protect } = require('../middleware/auth');
const { resolveTenant, requireTenant } = require('../middleware/tenantResolver');
const { authorize } = require('../middleware/rbac');

router.use(protect);
router.use(resolveTenant);
router.use(requireTenant);

// All inventory (paginated)
router.get('/', authorize('vendor', 'vendor_staff', 'super_admin'), getAllInventory);
router.get('/product/:productId', getProductInventory);
router.post('/location', authorize('vendor', 'vendor_staff'), addInventoryLocation);

// Inventory ID centric routes
router.put('/:id/stock', authorize('vendor', 'vendor_staff'), updateStock);
router.post('/transfer', authorize('vendor', 'vendor_staff'), transferStock);

module.exports = router;
