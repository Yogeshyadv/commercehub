const cron = require('node-cron');
const Cart = require('../models/Cart');
const User = require('../models/User');
const notificationService = require('../services/notificationService');

// Run every 30 minutes
const job = cron.schedule('*/30 * * * *', async () => {
  try {
    const thresholdTime = new Date(Date.now() - 2 * 60 * 60 * 1000); // 2 hours ago
    const emailCooldown = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago

    const abandonedCarts = await Cart.find({
      updatedAt: { $lte: thresholdTime },
      'items.0': { $exists: true }, // cart has at least 1 item
      $or: [
        { lastEmailSentAt: { $exists: false } },
        { lastEmailSentAt: { $lte: emailCooldown } },
      ],
    })
      .populate('user', 'firstName email')
      .populate('items.product', 'name price images')
      .limit(50)
      .lean();

    for (const cart of abandonedCarts) {
      if (!cart.user?.email) continue;
      try {
        const itemsSummary = cart.items
          .slice(0, 3)
          .map(i => i.name || i.product?.name || 'Item')
          .join(', ');

        const totalValue = cart.items.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);

        const transporter = notificationService.getEmailTransporter();
        await transporter.sendMail({
          from: process.env.EMAIL_FROM || 'CommerceHub <noreply@commercehub.com>',
          to: cart.user.email,
          subject: 'You left something in your cart!',
          text: `Hi ${cart.user.firstName || 'there'},\n\nYou have items in your cart: ${itemsSummary}${cart.items.length > 3 ? ' and more' : ''}.\nTotal: ₹${totalValue.toFixed(2)}\n\nComplete your purchase before items sell out!`,
        });

        await Cart.findByIdAndUpdate(cart._id, { lastEmailSentAt: new Date() });
        console.log(`[AbandonedCart] Sent recovery email to ${cart.user.email}`);
      } catch (err) {
        console.error(`[AbandonedCart] Failed to notify ${cart.user?.email}:`, err.message);
      }
    }
  } catch (err) {
    console.error('[AbandonedCart] Job error:', err.message);
  }
}, { scheduled: false });

module.exports = job;
