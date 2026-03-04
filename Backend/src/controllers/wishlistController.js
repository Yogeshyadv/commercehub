const User = require('../models/User');
const Product = require('../models/Product');
const { AppError } = require('../middleware/errorHandler');

// @desc    Get user wishlist
// @route   GET /api/v1/wishlist
// @access  Private
exports.getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'wishlist',
      select: 'name price images slug category stock alias rating numReviews'
    });

    if (!user) {
      return next(new AppError('User not found', 404));
    }

    res.status(200).json({
      success: true,
      count: user.wishlist.length,
      data: user.wishlist
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add product to wishlist
// @route   POST /api/v1/wishlist/:productId
// @access  Private
exports.addToWishlist = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return next(new AppError('Product not found', 404));
    }

    const user = await User.findById(req.user.id);

    // Check if product is already in wishlist
    if (user.wishlist.some(id => id.toString() === req.params.productId)) {
      return res.status(400).json({
        success: false,
        message: 'Product is already in wishlist'
      });
    }

    user.wishlist.push(req.params.productId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Product added to wishlist',
      data: user.wishlist
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/v1/wishlist/:productId
// @access  Private
exports.removeFromWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    const initialLength = user.wishlist.length;
    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== req.params.productId
    );

    if (initialLength === user.wishlist.length) {
       return res.status(404).json({
        success: false,
        message: 'Product not found in wishlist'
      });
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Product removed from wishlist',
      data: user.wishlist
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Check if product is in wishlist
// @route   GET /api/v1/wishlist/check/:productId
// @access  Private
exports.checkWishlistStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const isInWishlist = user.wishlist.some(id => id.toString() === req.params.productId);
        
        res.status(200).json({
            success: true,
            isWishlisted: isInWishlist
        });
    } catch (err) {
        next(err);
    }
};
