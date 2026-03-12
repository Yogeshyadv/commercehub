const Cart = require('../models/Cart');

// @desc    Get user's cart
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price images stock status');
    res.status(200).json({ success: true, data: cart || { items: [] } });
  } catch (error) {
    console.error('GetCart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Save/sync user's cart
exports.saveCart = async (req, res) => {
  try {
    const { items, tenant } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'items must be an array' });
    }

    const cartItems = items.map(item => ({
      product: item.product?._id || item.product,
      name: item.product?.name || item.name || '',
      price: item.product?.price || item.price || 0,
      quantity: item.quantity || 1,
      image: item.product?.images?.[0]?.url || item.product?.images?.[0] || item.image || '',
    }));

    // Resolve tenant from first item's product if not provided
    let tenantId = tenant;
    if (!tenantId && cartItems.length > 0) {
      const Product = require('../models/Product');
      const prod = await Product.findById(cartItems[0].product, 'tenant').lean();
      tenantId = prod?.tenant;
    }

    const cart = await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: cartItems, tenant: tenantId },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json({ success: true, data: cart });
  } catch (error) {
    console.error('SaveCart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Clear user's cart
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.status(200).json({ success: true, message: 'Cart cleared' });
  } catch (error) {
    console.error('ClearCart error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
