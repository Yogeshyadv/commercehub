const aiService = require('../services/aiService');
const Product = require('../models/Product');

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