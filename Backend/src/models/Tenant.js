const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Business name is required'],
    trim: true,
    maxlength: [100, 'Business name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    lowercase: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  logo: {
    public_id: String,
    url: String
  },
  branding: {
    primaryColor: { type: String, default: '#3B82F6' },
    secondaryColor: { type: String, default: '#1E40AF' },
    accentColor: { type: String, default: '#F59E0B' },
    fontFamily: { type: String, default: 'Inter' },
    headerStyle: { type: String, default: 'default' },
  },
  businessInfo: {
    type: { type: String, enum: ['retailer', 'wholesaler', 'manufacturer', 'distributor', 'other'], default: 'retailer' },
    industry: { type: String, default: 'general' },
    description: String,
    gstin: String,
    pan: String,
    registrationNumber: String,
  },
  contactInfo: {
    email: String,
    phone: String,
    website: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: { type: String, default: 'India' },
      zipCode: String,
    }
  },
  subscription: {
    plan: {
      type: String,
      enum: ['free', 'starter', 'professional', 'enterprise'],
      default: 'free'
    },
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    isActive: { type: Boolean, default: true },
    maxProducts: { type: Number, default: 50 },
    maxCatalogs: { type: Number, default: 5 },
    maxUsers: { type: Number, default: 2 },
    features: [{
      type: String,
      enum: ['ai_descriptions', 'analytics', 'multi_channel', 'crm', 'marketing', 'api_access', 'whitelabel', 'priority_support']
    }]
  },
  customDomain: {
    domain: String,
    isVerified: { type: Boolean, default: false },
    sslEnabled: { type: Boolean, default: false },
  },
  settings: {
    currency: { type: String, default: 'INR' },
    language: { type: String, default: 'en' },
    timezone: { type: String, default: 'Asia/Kolkata' },
    taxEnabled: { type: Boolean, default: true },
    defaultTaxRate: { type: Number, default: 18 },
    orderPrefix: { type: String, default: 'ORD' },
    invoicePrefix: { type: String, default: 'INV' },
    lowStockThreshold: { type: Number, default: 10 },
    autoConfirmOrders: { type: Boolean, default: false },
    allowGuestCheckout: { type: Boolean, default: true },
  },
  socialLinks: {
    facebook: String,
    instagram: String,
    twitter: String,
    linkedin: String,
    youtube: String,
    whatsapp: String,
  },
  paymentGateways: {
    stripe: {
      enabled: { type: Boolean, default: false },
      accountId: String,
    },
    razorpay: {
      enabled: { type: Boolean, default: false },
      keyId: String,
      keySecret: String,
    },
    cod: {
      enabled: { type: Boolean, default: true },
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  metadata: {
    totalProducts: { type: Number, default: 0 },
    totalOrders: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    totalCustomers: { type: Number, default: 0 },
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Auto-generate slug
tenantSchema.pre('save', function () {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      + '-' + Date.now().toString(36);
  }
});

tenantSchema.index({ slug: 1 });
tenantSchema.index({ owner: 1 });
tenantSchema.index({ 'subscription.plan': 1, isActive: 1 });

module.exports = mongoose.model('Tenant', tenantSchema);