const aiService = require('../services/aiService');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Generate AI product description
// @route   POST /api/v1/ai/description
exports.generateDescription = async (req, res) => {
  try {
    const { name, category, brand, price, shortDescription, tags } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Product name and category are required'
      });
    }

    const result = await aiService.generateProductDescription({
      name, category, brand, price, shortDescription, tags
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('AI Description error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate description' });
  }
};

// @desc    Generate AI tags for product
// @route   POST /api/v1/ai/tags
exports.generateTags = async (req, res) => {
  try {
    const { name, category, brand } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Product name and category are required'
      });
    }

    const result = await aiService.generateProductTags({ name, category, brand });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('AI Tags error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate tags' });
  }
};

// @desc    Generate AI SEO metadata
// @route   POST /api/v1/ai/seo
exports.generateSEO = async (req, res) => {
  try {
    const { name, category, description } = req.body;

    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Product name and category are required'
      });
    }

    const result = await aiService.generateSEOData({
      name, category, description
    });

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('AI SEO error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate SEO data' });
  }
};

// @desc    Apply AI description to existing product
// @route   POST /api/v1/ai/apply/:productId
exports.applyToProduct = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.productId,
      tenant: req.tenantId
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const result = await aiService.generateProductDescription({
      name: product.name,
      category: product.category,
      brand: product.brand,
      price: product.price,
      shortDescription: product.shortDescription,
      tags: product.tags
    });

    product.aiGeneratedDescription = result.description;
    if (req.body.applyAsMain) {
      product.description = result.description;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: 'AI description generated and saved',
      data: { description: result.description, source: result.source }
    });
  } catch (error) {
    console.error('Apply AI error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get personalized product recommendations
// @route   GET /api/v1/ai/recommendations
exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const recentOrders = await Order.find({ 
      customer: userId, 
      tenant: req.tenantId 
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('items.product');

    const purchasedCategories = new Set();
    const purchasedProductIds = new Set();
    
    for (const order of recentOrders) {
      for (const item of order.items) {
        if (item.product) {
          if (item.product.category) purchasedCategories.add(item.product.category);
          purchasedProductIds.add(item.product._id.toString());
        }
      }
    }

    let query = {
      tenant: req.tenantId,
      stock: { $gt: 0 },
      _id: { $nin: Array.from(purchasedProductIds) }
    };

    if (purchasedCategories.size > 0) {
      query.category = { $in: Array.from(purchasedCategories) };
    }

    let recommendations = await Product.find(query)
      .sort(purchasedCategories.size > 0 ? { stock: -1 } : { createdAt: -1 }) 
      .limit(8)
      .select('name price category images slug stock');

    if (recommendations.length < 4) {
      const fallback = await Product.find({
        tenant: req.tenantId,
        stock: { $gt: 0 },
        _id: { $nin: [...Array.from(purchasedProductIds), ...recommendations.map(r => r._id)] }
      })
      .limit(8 - recommendations.length)
      .select('name price category images slug stock');
      
      recommendations = [...recommendations, ...fallback];
    }

    res.status(200).json({ success: true, data: recommendations });
  } catch (error) {
    console.error('AI Recommendations error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get similar products based on viewing context
// @route   GET /api/v1/ai/similar/:productId
exports.getSimilarProducts = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const similar = await Product.find({
      tenant: req.tenantId,
      _id: { $ne: productId },
      $or: [
        { category: product.category },
      ]
    })
    .limit(6)
    .select('name price category images slug stock');

    res.status(200).json({ success: true, data: similar });
  } catch (error) {
    console.error('AI Similar Products error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};