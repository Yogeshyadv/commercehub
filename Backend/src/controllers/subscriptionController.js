const Razorpay = require('razorpay');
const crypto = require('crypto');
const Subscription = require('../models/Subscription');
const Tenant = require('../models/Tenant');

const PLAN_PRICES = {
  free:         { monthly: 0,    yearly: 0,     limits: { products: 20,   catalogs: 2,  users: 1,  storage: 100,  apiCalls: 500   } },
  starter:      { monthly: 999,  yearly: 9990,  limits: { products: 100,  catalogs: 10, users: 3,  storage: 1000, apiCalls: 5000  } },
  professional: { monthly: 2499, yearly: 24990, limits: { products: 500,  catalogs: 50, users: 10, storage: 5000, apiCalls: 25000 } },
  enterprise:   { monthly: 5999, yearly: 59990, limits: { products: -1,   catalogs: -1, users: -1, storage: -1,   apiCalls: -1    } },
};

let razorpay = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'rzp_test_xxx') {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// @desc    Get current subscription
// @route   GET /api/v1/subscriptions/current
exports.getCurrentSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findOne({ tenant: req.tenantId })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ success: true, data: subscription });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get available plans
// @route   GET /api/v1/subscriptions/plans
exports.getPlans = async (req, res) => {
  const plans = Object.entries(PLAN_PRICES).map(([id, data]) => ({ id, ...data }));
  res.json({ success: true, data: plans });
};

// @desc    Create Razorpay order for plan upgrade
// @route   POST /api/v1/subscriptions/create-order
exports.createSubscriptionOrder = async (req, res) => {
  try {
    const { plan, billingCycle = 'monthly' } = req.body;

    if (!PLAN_PRICES[plan]) {
      return res.status(400).json({ success: false, message: 'Invalid plan' });
    }

    const amount = PLAN_PRICES[plan][billingCycle];

    if (amount === 0) {
      // Downgrade to free — no payment needed
      const existing = await Subscription.findOne({ tenant: req.tenantId }).sort({ createdAt: -1 });
      if (existing) {
        await Subscription.findByIdAndUpdate(existing._id, { plan: 'free', status: 'active', billingCycle, price: 0, limits: PLAN_PRICES.free.limits, endDate: null });
      } else {
        await Subscription.create({ tenant: req.tenantId, plan: 'free', status: 'active', billingCycle, price: 0, limits: PLAN_PRICES.free.limits });
      }
      return res.json({ success: true, message: 'Switched to free plan', data: { free: true } });
    }

    if (!razorpay) {
      return res.status(503).json({ success: false, message: 'Payment gateway not configured' });
    }

    const receipt = `sub_${req.tenantId.toString().slice(-8)}_${Date.now()}`;
    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // paise
      currency: 'INR',
      receipt,
      notes: { tenantId: req.tenantId.toString(), plan, billingCycle },
    });

    res.json({
      success: true,
      data: {
        orderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID,
        plan,
        billingCycle,
      },
    });
  } catch (error) {
    console.error('Subscription order error:', error);
    res.status(500).json({ success: false, message: 'Failed to create order' });
  }
};

// @desc    Verify payment and activate subscription
// @route   POST /api/v1/subscriptions/verify
exports.verifySubscriptionPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan, billingCycle = 'monthly' } = req.body;

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(503).json({ success: false, message: 'Payment gateway not configured' });
    }

    // Verify HMAC signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSig = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSig !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment verification failed. Invalid signature.' });
    }

    if (!PLAN_PRICES[plan]) {
      return res.status(400).json({ success: false, message: 'Invalid plan' });
    }

    const price = PLAN_PRICES[plan][billingCycle];
    const limits = PLAN_PRICES[plan].limits;

    const now = new Date();
    const endDate = new Date(now);
    if (billingCycle === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    const invoice = {
      invoiceId: razorpay_payment_id,
      amount: price,
      status: 'paid',
      paidAt: new Date(),
    };

    const existing = await Subscription.findOne({ tenant: req.tenantId }).sort({ createdAt: -1 });

    if (existing) {
      existing.plan = plan;
      existing.status = 'active';
      existing.billingCycle = billingCycle;
      existing.price = price;
      existing.limits = limits;
      existing.startDate = now;
      existing.endDate = endDate;
      existing.gatewaySubscriptionId = razorpay_order_id;
      existing.paymentGateway = 'razorpay';
      existing.invoices.push(invoice);
      await existing.save();
    } else {
      await Subscription.create({
        tenant: req.tenantId,
        plan, billingCycle, price, limits, status: 'active',
        startDate: now, endDate,
        gatewaySubscriptionId: razorpay_order_id,
        paymentGateway: 'razorpay',
        invoices: [invoice],
      });
    }

    res.json({ success: true, message: `Successfully upgraded to ${plan} plan` });
  } catch (error) {
    console.error('Subscription verify error:', error);
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
};
