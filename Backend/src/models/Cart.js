const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
  },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: { type: Number, default: 1 },
    image: String,
  }],
  lastEmailSentAt: Date,
}, { timestamps: true });

cartSchema.index({ user: 1 }, { unique: true });
cartSchema.index({ updatedAt: 1 });

module.exports = mongoose.model('Cart', cartSchema);
