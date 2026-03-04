const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
    index: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [150, 'Product name cannot exceed 150 characters']
  },
  slug: {
    type: String,
    lowercase: true,
    trim: true
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
    trim: true
  },
  shortDescription: {
    type: String,
    maxlength: [300, 'Short description cannot exceed 300 characters']
  },
  description: {
    type: String,
    maxlength: [3000, 'Description cannot exceed 3000 characters']
  },
  category: {
    type: String,
    trim: true,
    default: 'general'
  },
  brand: {
    type: String,
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  compareAtPrice: {
    type: Number,
    min: [0, 'Compare at price cannot be negative']
  },
  costPrice: {
    type: Number,
    min: [0, 'Cost price cannot be negative']
  },
  taxable: {
    type: Boolean,
    default: true
  },
  taxRate: {
    type: Number,
    default: 0,
    min: [0, 'Tax rate cannot be negative'],
    max: [100, 'Tax rate cannot exceed 100']
  },
  status: {
    type: String,
    enum: ['draft', 'active', 'inactive', 'archived'],
    default: 'draft'
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: [0, 'Low stock threshold cannot be negative']
  },
  trackInventory: {
    type: Boolean,
    default: true
  },
  images: [{
    public_id: String,
    url: String,
    alt: String
  }],
  tags: [String],
  catalogs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Catalog'
  }],
  attributes: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  orderCount: {
    type: Number,
    default: 0
  },
  viewCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  numReviews: {
    type: Number,
    default: 0
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }]
}, {
  timestamps: true
});

productSchema.pre('save', function () {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      + '-' + Date.now().toString(36);
  }

  if (!this.sku) {
    this.sku = `SKU-${Date.now().toString(36).toUpperCase()}`;
  }
});

productSchema.index({ tenant: 1, sku: 1 }, { unique: true });
productSchema.index({ tenant: 1, status: 1 });
productSchema.index({ tenant: 1, category: 1 });
productSchema.index({ name: 'text', description: 'text', sku: 'text', brand: 'text' });

module.exports = mongoose.model('Product', productSchema);