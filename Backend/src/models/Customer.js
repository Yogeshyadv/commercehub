const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
    index: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  name: {
    type: String,
    required: [true, 'Customer name is required'],
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  company: String,
  gstin: String,
  addresses: [{
    label: { type: String, default: 'default' },
    street: String,
    city: String,
    state: String,
    country: { type: String, default: 'India' },
    zipCode: String,
    isDefault: { type: Boolean, default: false }
  }],
  tags: [String],
  group: {
    type: String,
    enum: ['regular', 'vip', 'wholesale', 'new'],
    default: 'regular'
  },
  notes: String,
  wishlist: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  loyaltyPoints: { type: Number, default: 0 },
  stats: {
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    averageOrderValue: { type: Number, default: 0 },
    lastOrderDate: Date,
    firstOrderDate: Date,
  },
  source: {
    type: String,
    enum: ['website', 'whatsapp', 'manual', 'import', 'referral'],
    default: 'website'
  },
  isActive: { type: Boolean, default: true },
  marketingConsent: { type: Boolean, default: false },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

customerSchema.index({ tenant: 1, email: 1 });
customerSchema.index({ tenant: 1, phone: 1 });
customerSchema.index({ tenant: 1, name: 'text' });

module.exports = mongoose.model('Customer', customerSchema);