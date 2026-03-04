const mongoose = require('mongoose');
const Review = require('../models/Review');
const Order = require('../models/Order');
const Product = require('../models/Product');
const { getPagination } = require('../utils/helpers');

// @desc    Create a review
// @route   POST /api/v1/reviews
// @access  Private (Customer)
exports.createReview = async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user has purchased this product
    const order = await Order.findOne({
        customer: req.user._id,
        'items.product': productId,
        status: { $in: ['delivered', 'shipped', 'completed'] }
    });

    if (!order) {
        return res.status(403).json({ success: false, message: 'You must purchase this product to review it.' });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({
      product: productId,
      customer: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      tenant: product.tenant,
      product: productId,
      customer: req.user._id,
      rating,
      title,
      comment,
      isVerifiedPurchase: true,
      isApproved: true
    });

    await updateProductRating(productId);

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    console.error('Create Review Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get reviews for a product
// @route   GET /reviews/product/:productId
// @access  Public
exports.getProductReviews = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query.page, req.query.limit);
    const productId = req.params.productId;

    const query = { product: productId, isApproved: true };

    const [reviews, total] = await Promise.all([
      Review.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('customer', 'firstName lastName')
        .lean(),
      Review.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: reviews,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get Product Reviews Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Get reviews for a vendor (Tenant)
// @route   GET /reviews/vendor/stats
// @access  Private (Vendor)
exports.getVendorReviewStats = async (req, res) => {
  try {
    const stats = await Review.aggregate([
      { $match: { tenant: req.tenantId } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
          breakdown: {
            $push: '$rating'
          }
        }
      }
    ]);

    res.status(200).json({ success: true, data: stats[0] || { averageRating: 0, totalReviews: 0 } });
  } catch (error) {
    console.error('Get Vendor Stats Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Helper
const updateProductRating = async (productId) => {
  try {
    const stats = await Review.aggregate([
      { $match: { product: new mongoose.Types.ObjectId(productId), isApproved: true } },
      {
        $group: {
          _id: '$product',
          averageRating: { $avg: '$rating' },
          numReviews: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        rating: stats[0].averageRating,
        numReviews: stats[0].numReviews
      });
    } else {
       await Product.findByIdAndUpdate(productId, {
        rating: 0,
        numReviews: 0
      }); 
    }
  } catch (error) {
    console.error('Update Product Rating Error:', error);
  }
};
