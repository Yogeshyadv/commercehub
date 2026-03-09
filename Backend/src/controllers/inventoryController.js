const Inventory = require('../models/Inventory');
const Product = require('../models/Product');

// Helper to sync total stock to Product model
const syncProductStock = async (productId, tenantId) => {
  const inventories = await Inventory.find({ product: productId, tenant: tenantId });
  const totalStock = inventories.reduce((sum, inv) => sum + inv.quantity, 0);
  await Product.findByIdAndUpdate(productId, { stock: totalStock });
};

// @desc    Get inventory for a product (all locations)
exports.getProductInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find({ 
      product: req.params.productId, 
      tenant: req.tenantId 
    }).populate('product', 'name sku images');
    
    res.status(200).json({ success: true, data: inventory });
  } catch (error) {
    console.error('GetInventory error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Add new location/inventory record
exports.addInventoryLocation = async (req, res) => {
  try {
    const { productId, locationName, quantity, reorderLevel } = req.body;
    
    // Check if location already exists for this product
    const existing = await Inventory.findOne({
      tenant: req.tenantId,
      product: productId,
      'location.name': locationName
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'Location already exists for this product' });
    }

    const inventory = await Inventory.create({
      tenant: req.tenantId,
      product: productId,
      location: { name: locationName },
      quantity: quantity || 0,
      reorderLevel: reorderLevel || 10,
      movements: [{
        type: 'in',
        quantity: quantity || 0,
        notes: 'Initial stock at location',
        performedBy: req.user._id
      }]
    });

    await syncProductStock(productId, req.tenantId);

    res.status(201).json({ success: true, data: inventory });
  } catch (error) {
    console.error('AddInventoryLocation error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update stock (Adjustment/Restock/Consume)
exports.updateStock = async (req, res) => {
  try {
    const { type, quantity, notes } = req.body; // type: 'in' | 'out' | 'adjustment'
    const inventory = await Inventory.findOne({ _id: req.params.id, tenant: req.tenantId });

    if (!inventory) return res.status(404).json({ success: false, message: 'Inventory record not found' });

    let newQuantity = inventory.quantity;
    if (type === 'in') newQuantity += parseInt(quantity);
    else if (type === 'out') newQuantity -= parseInt(quantity);
    else if (type === 'adjustment') newQuantity = parseInt(quantity);
    
    if (newQuantity < 0) return res.status(400).json({ success: false, message: 'Insufficient stock' });

    inventory.quantity = newQuantity;
    inventory.movements.push({
      type,
      quantity: parseInt(quantity),
      notes: notes || 'Manual update',
      performedBy: req.user._id,
      timestamp: new Date()
    });

    await inventory.save();
    await syncProductStock(inventory.product, req.tenantId);

    // Fire LOW_STOCK notification when stock drops to or below reorder level
    if (type !== 'in' && newQuantity <= inventory.reorderLevel) {
      try {
        const Notification = require('../models/Notification');
        const Tenant = require('../models/Tenant');
        const [tenant, product] = await Promise.all([
          Tenant.findById(req.tenantId, 'owner'),
          Product.findById(inventory.product, 'name')
        ]);
        if (tenant?.owner) {
          const notif = await Notification.create({
            recipient: tenant.owner,
            type: 'LOW_STOCK',
            title: 'Low Stock Alert',
            message: `"${product?.name || 'A product'}" is running low — only ${newQuantity} unit${newQuantity !== 1 ? 's' : ''} remaining (reorder level: ${inventory.reorderLevel}).`,
            relatedId: inventory.product
          });
          const io = req.app.get('io');
          if (io) io.to(tenant.owner.toString()).emit('notification', notif);
        }
      } catch (e) {
        console.warn('Low stock notification failed:', e.message);
      }
    }

    res.status(200).json({ success: true, data: inventory });
  } catch (error) {
    console.error('UpdateStock error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Transfer stock between locations
exports.transferStock = async (req, res) => {
  try {
    const { fromId, toId, quantity, notes } = req.body;
    
    const source = await Inventory.findOne({ _id: fromId, tenant: req.tenantId });
    const dest = await Inventory.findOne({ _id: toId, tenant: req.tenantId });

    if (!source || !dest) return res.status(404).json({ success: false, message: 'Source or Destination not found' });
    if (source.product.toString() !== dest.product.toString()) return res.status(400).json({ success: false, message: 'Product mismatch' });
    if (source.quantity < quantity) return res.status(400).json({ success: false, message: 'Insufficient stock at source' });

    // Decrement Source
    source.quantity -= parseInt(quantity);
    source.movements.push({
      type: 'transfer',
      quantity: -parseInt(quantity),
      notes: `Transfer to ${dest.location.name}. ${notes || ''}`,
      performedBy: req.user._id
    });
    await source.save();

    // Increment Dest
    dest.quantity += parseInt(quantity);
    dest.movements.push({
      type: 'transfer',
      quantity: parseInt(quantity),
      notes: `Transfer from ${source.location.name}. ${notes || ''}`,
      performedBy: req.user._id
    });
    await dest.save();

    // No need to sync product total stock as it remains same globally

    res.status(200).json({ success: true, message: 'Transfer successful' });
  } catch (error) {
    console.error('TransferStock error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
