const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
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
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: String,
  comment: {
    type: String,
    maxlength: 1000
  },
  images: [{
    public_id: String,
    url: String
  }],
  isVerifiedPurchase: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
  helpfulCount: { type: Number, default: 0 },
  reply: {
    comment: String,
    repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    repliedAt: Date
  }
}, {
  timestamps: true
});

reviewSchema.index({ tenant: 1, product: 1 });
reviewSchema.index({ tenant: 1, customer: 1 });

module.exports = mongoose.model('Review', reviewSchema);