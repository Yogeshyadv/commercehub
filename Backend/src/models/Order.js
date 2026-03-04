const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  variant: {
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  name: { type: String, required: true },
  sku: String,
  image: String,
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true }
});

const addressSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  street: String,
  city: String,
  state: String,
  country: { type: String, default: 'India' },
  zipCode: String,
});

const orderSchema = new mongoose.Schema({
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
    index: true
  },
  orderNumber: {
    type: String,
    // required: true // Handled by pre-save hook
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],

  // Addresses
  shippingAddress: addressSchema,
  billingAddress: addressSchema,

  // Pricing
  subtotal: { type: Number, required: true },
  taxAmount: { type: Number, default: 0 },
  shippingCost: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  couponCode: String,
  total: { type: Number, required: true },
  currency: { type: String, default: 'INR' },

  // Status
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded', 'returned'],
    default: 'pending'
  },
  statusHistory: [{
    status: String,
    note: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timestamp: { type: Date, default: Date.now }
  }],

  // Payment
  paymentMethod: {
    type: String,
    enum: ['stripe', 'razorpay', 'paypal', 'upi', 'cod', 'bank_transfer'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded', 'partially_refunded'],
    default: 'pending'
  },
  paymentId: String,  // External payment gateway ID
  paymentDetails: mongoose.Schema.Types.Mixed,

  // Shipping
  shippingMethod: String,
  trackingNumber: String,
  trackingUrl: String,
  estimatedDelivery: Date,
  deliveredAt: Date,

  // Invoice
  invoiceNumber: String,
  invoiceUrl: String,

  // Notes
  customerNotes: String,
  internalNotes: String,

  // Source
  source: {
    type: String,
    enum: ['web', 'mobile', 'whatsapp', 'api', 'manual', 'marketplace'],
    default: 'web'
  },
  catalog: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Catalog'
  },

  isB2B: { type: Boolean, default: false },
  companyName: String,
  gstin: String,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Generate order number
orderSchema.pre('save', async function () {
  if (this.isNew && !this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments({ tenant: this.tenant });
    this.orderNumber = `ORD-${Date.now().toString(36).toUpperCase()}-${(count + 1).toString().padStart(5, '0')}`;
  }
});

orderSchema.index({ tenant: 1, status: 1, createdAt: -1 });
orderSchema.index({ tenant: 1, customer: 1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ tenant: 1, paymentStatus: 1 });

module.exports = mongoose.model('Order', orderSchema);