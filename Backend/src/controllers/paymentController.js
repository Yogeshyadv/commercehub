const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');

let razorpay = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_ID !== 'rzp_test_xxx') {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

// @desc    Create Razorpay order
// @route   POST /api/v1/payments/razorpay/create
exports.createRazorpayOrder = async (req, res) => {
  try {
    if (!razorpay) {
      return res.status(503).json({
        success: false,
        message: 'Payment gateway not configured. Please use COD.'
      });
    }

    const { orderId } = req.body;

    const order = await Order.findOne({
      _id: orderId,
      tenant: req.tenantId,
      paymentStatus: 'pending'
    });

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found or already paid' });
    }

    const options = {
      amount: Math.round(order.total * 100), // Razorpay uses paise
      currency: order.currency || 'INR',
      receipt: order.orderNumber,
      notes: {
        orderId: order._id.toString(),
        tenant: req.tenantId.toString()
      }
    };

    const razorpayOrder = await razorpay.orders.create(options);

    res.status(200).json({
      success: true,
      data: {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        key: process.env.RAZORPAY_KEY_ID
      }
    });
  } catch (error) {
    console.error('Razorpay create error:', error);
    return res.status(500).json({ success: false, message: 'Payment creation failed' });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/v1/payments/razorpay/verify
exports.verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

    // Verify signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed. Invalid signature.'
      });
    }

    // Update order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.paymentStatus = 'completed';
    order.paymentId = razorpay_payment_id;
    order.paymentDetails = {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      verifiedAt: new Date()
    };
    order.status = 'confirmed';
    order.statusHistory.push({
      status: 'confirmed',
      note: 'Payment received via Razorpay',
      updatedBy: req.user._id
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      data: order
    });
  } catch (error) {
    console.error('Razorpay verify error:', error);
    return res.status(500).json({ success: false, message: 'Payment verification failed' });
  }
};

// @desc    Get Razorpay key (public)
// @route   GET /api/v1/payments/razorpay/key
exports.getRazorpayKey = async (req, res) => {
  res.status(200).json({
    success: true,
    data: { key: process.env.RAZORPAY_KEY_ID || null }
  });
};