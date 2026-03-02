const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  tenant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  plan: {
    type: String,
    enum: ['free', 'starter', 'professional', 'enterprise'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'expired', 'trial', 'past_due'],
    default: 'active'
  },
  billingCycle: {
    type: String,
    enum: ['monthly', 'yearly'],
    default: 'monthly'
  },
  price: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  startDate: { type: Date, default: Date.now },
  endDate: Date,
  trialEndsAt: Date,
  cancelledAt: Date,
  paymentGateway: String,
  gatewaySubscriptionId: String,
  invoices: [{
    invoiceId: String,
    amount: Number,
    status: { type: String, enum: ['paid', 'unpaid', 'failed'] },
    paidAt: Date,
    url: String
  }],
  limits: {
    products: { type: Number, default: 50 },
    catalogs: { type: Number, default: 5 },
    users: { type: Number, default: 2 },
    storage: { type: Number, default: 500 }, // MB
    apiCalls: { type: Number, default: 1000 },
  }
}, {
  timestamps: true
});

subscriptionSchema.index({ tenant: 1 });
subscriptionSchema.index({ status: 1, endDate: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);