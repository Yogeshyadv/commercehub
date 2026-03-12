const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
    index: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  variant: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  location: {
    name: { type: String, default: 'Default Warehouse' },
    code: String,
    address: String
  },
  quantity: { type: Number, required: true, default: 0 },
  reservedQuantity: { type: Number, default: 0 },
  availableQuantity: {
    type: Number,
    default: function () { return this.quantity - this.reservedQuantity; }
  },
  reorderLevel: { type: Number, default: 10 },
  reorderQuantity: { type: Number, default: 50 },
  batchNumber: String,
  expiryDate: Date,
  manufactureDate: Date,
  costPrice: Number,
  lastRestockedAt: Date,
  movements: [{
    type: { type: String, enum: ['in', 'out', 'adjustment', 'transfer', 'return'] },
    quantity: Number,
    reference: String,
    notes: String,
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

inventorySchema.index({ tenant: 1, product: 1 });
inventorySchema.index({ tenant: 1, 'location.name': 1 });
inventorySchema.index({ quantity: 1, reorderLevel: 1 });

module.exports = mongoose.model('Inventory', inventorySchema);