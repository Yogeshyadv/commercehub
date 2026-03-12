const mongoose = require('mongoose');

const catalogSchema = new mongoose.Schema({
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
    required: [true, 'Catalog name is required'],
    trim: true,
    maxlength: [100, 'Catalog name cannot exceed 100 characters']
  },
  slug: {
    type: String,
    lowercase: true
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  coverImage: {
    public_id: String,
    url: String
  },
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    order: { type: Number, default: 0 },
    isHighlighted: { type: Boolean, default: false }
  }],
  blocks: [{
    id: { type: String, required: true },
    type: { type: String, required: true }, // e.g. "hero", "productGrid", "feature", "footer"
    content: { type: mongoose.Schema.Types.Mixed, default: {} },
    settings: { type: mongoose.Schema.Types.Mixed, default: {} }
  }],
  template: {
    type: String,
    enum: [
      'grid', 'list', 'magazine', 'minimal', 'luxury', 'modern', 'classic', 'modern-blocks',
      'minimal-luxe', 'dark-premium', 'bold-commerce', 'tech-specs', 'artisan-market',
      'flash-sale', 'fresh-grocery', 'corporate-b2b', 'editorial', 'neon-street',
      'pastel-beauty', 'sports-fitness', 'real-estate', 'kids-playful', 'pharmacy-health',
      'jewellery-gold', 'auto-parts', 'furniture-home', 'pet-store'
    ],
    default: 'grid'
  },
  design: {
    backgroundColor: { type: String, default: '#FFFFFF' },
    textColor: { type: String, default: '#000000' },
    accentColor: { type: String, default: '#3B82F6' },
    fontFamily: { type: String, default: 'Inter' },
    showPrices: { type: Boolean, default: true },
    customTexts: { type: mongoose.Schema.Types.Mixed, default: {} },
    showStock: { type: Boolean, default: false },
    showDescription: { type: Boolean, default: true },
    productsPerRow: { type: Number, default: 3, min: 1, max: 6 },
    customCSS: String,
    headerHtml: String,
    footerHtml: String,
  },
  branding: {
    showLogo: { type: Boolean, default: true },
    showBusinessName: { type: Boolean, default: true },
    showContact: { type: Boolean, default: true },
    watermark: { type: Boolean, default: false },
  },
  sharing: {
    isPublic: { type: Boolean, default: true },
    shareableLink: String,
    qrCode: String,
    password: String,
    expiresAt: Date,
    allowDownload: { type: Boolean, default: true },
  },
  categories: [String],
  tags: [String],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  analytics: {
    viewCount:       { type: Number, default: 0 },
    shareCount:      { type: Number, default: 0 },
    uniqueVisitors:  { type: Number, default: 0 },
    lastViewedAt:    Date,
    whatsappClicks:  { type: Number, default: 0 },
    // productId (string) → total product-card clicks
    productClickData: { type: Map, of: Number, default: () => ({}) },
    // productId (string) → WhatsApp order button clicks per product
    productWhatsappData: { type: Map, of: Number, default: () => ({}) },
  },
  isWhatsAppEnabled: { type: Boolean, default: true },
  language: { type: String, default: 'en' },
  currency: { type: String, default: 'INR' },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

catalogSchema.virtual('productCount').get(function () {
  return this.products ? this.products.length : 0;
});

catalogSchema.pre('save', function () {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      + '-' + Date.now().toString(36);
  }
});

catalogSchema.index({ tenant: 1, status: 1 });
catalogSchema.index({ slug: 1 });
catalogSchema.index({ 'sharing.shareableLink': 1 });

module.exports = mongoose.model('Catalog', catalogSchema);