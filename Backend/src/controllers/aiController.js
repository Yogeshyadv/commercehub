const aiService = require('../services/aiService');
const Product = require('../models/Product');
const Order = require('../models/Order');
const mongoose = require('mongoose');

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

// @desc    Generate AI catalog theme
// @route   POST /api/v1/ai/theme
exports.generateTheme = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ success: false, message: 'Prompt is required' });
    const result = await aiService.generateCatalogTheme(prompt);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('AI Theme error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate theme' });
  }
};

// @desc    Generate AI catalog metadata and find matching products
// @route   POST /api/v1/ai/catalog
exports.generateCatalog = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ success: false, message: 'Prompt is required' });
    
    // 1. Ask AI to generate catalog details
    const catalogData = await aiService.generateCatalogDetails(prompt);

    // 2. Find matching products based on categories & tags
    let matchingProducts = [];
    if (catalogData.categories?.length || catalogData.tags?.length) {
      const orConditions = [];
      if (catalogData.categories?.length > 0) {
        orConditions.push({ category: { $in: catalogData.categories.map(c => new RegExp(c, 'i')) } });
      }
      if (catalogData.tags?.length > 0) {
        orConditions.push({ tags: { $in: catalogData.tags.map(t => new RegExp(t, 'i')) } });
      }
      
      if (orConditions.length > 0) {
        matchingProducts = await Product.find({
          tenant: req.tenantId,
          $or: orConditions
        }).select('_id name price category images stock').limit(50);
      }
    }

    res.status(200).json({ 
      success: true, 
      data: {
        ...catalogData,
        suggestedProducts: matchingProducts
      }
    });
  } catch (error) {
    console.error('AI Catalog error:', error);
    res.status(500).json({ success: false, message: 'Failed to generate catalog' });
  }
};

// @desc    AI chat assistant with live business context
// @route   POST /api/v1/ai/chat
exports.chat = async (req, res) => {
  try {
    const { messages, context } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ success: false, message: 'messages array is required' });
    }

    // ── Gather live business metrics for this vendor's tenant ─────────────
    let bizContext = '';
    if (req.tenantId) {
      try {
        const tenantId = new mongoose.Types.ObjectId(req.tenantId);
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

        const [
          monthStats,
          lastMonthStats,
          pendingCount,
          lowStockItems,
          topProducts,
          totalCustomers,
        ] = await Promise.all([
          // This month revenue + order count
          Order.aggregate([
            { $match: { tenant: tenantId, createdAt: { $gte: startOfMonth }, status: { $nin: ['cancelled', 'refunded'] } } },
            { $group: { _id: null, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
          ]),
          // Last month revenue + order count
          Order.aggregate([
            { $match: { tenant: tenantId, createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }, status: { $nin: ['cancelled', 'refunded'] } } },
            { $group: { _id: null, revenue: { $sum: '$total' }, orders: { $sum: 1 } } },
          ]),
          // Pending orders
          Order.countDocuments({ tenant: tenantId, status: 'pending' }),
          // Low stock (stock ≤ 10, not out of stock)
          Product.find({ tenant: tenantId, stock: { $gt: 0, $lte: 10 }, status: 'active' })
            .select('name stock').limit(10).lean(),
          // Top 5 products by revenue (this month)
          Order.aggregate([
            { $match: { tenant: tenantId, createdAt: { $gte: startOfMonth }, status: { $nin: ['cancelled'] } } },
            { $unwind: '$items' },
            { $group: { _id: '$items.product', name: { $first: '$items.name' }, revenue: { $sum: '$items.total' }, qty: { $sum: '$items.quantity' } } },
            { $sort: { revenue: -1 } },
            { $limit: 5 },
          ]),
          // Total distinct customers
          Order.distinct('customer', { tenant: tenantId }),
        ]);

        const thisMonth = monthStats[0] || { revenue: 0, orders: 0 };
        const lastMonth = lastMonthStats[0] || { revenue: 0, orders: 1 };
        const revenueGrowth = lastMonth.revenue > 0
          ? (((thisMonth.revenue - lastMonth.revenue) / lastMonth.revenue) * 100).toFixed(1)
          : 'N/A';

        const topProductsList = topProducts.map(p => `${p.name} (₹${p.revenue?.toFixed(0)}, ${p.qty} units)`).join('; ') || 'No sales yet';
        const lowStockList = lowStockItems.map(p => `${p.name} (${p.stock} left)`).join(', ') || 'None';

        bizContext = `
=== YOUR STORE METRICS (live data) ===
This month:  ₹${thisMonth.revenue.toFixed(2)} revenue across ${thisMonth.orders} orders
Last month:  ₹${lastMonth.revenue.toFixed(2)} revenue across ${lastMonth.orders} orders
Revenue growth: ${revenueGrowth}%
Pending orders: ${pendingCount}
Total customers: ${totalCustomers.length}
Low-stock products: ${lowStockList}
Top sellers this month: ${topProductsList}
======================================`;
      } catch {
        // Non-fatal — proceed without business context
      }
    }

    const systemPrompt = [
      'You are an intelligent AI business assistant embedded inside a SaaS vendor dashboard called CommerceHub.',
      'You help vendors manage products, orders, inventory, and analytics.',
      'Be concise, friendly, and actionable. Use short paragraphs or bullet points. Never make up numbers — only use the live data provided.',
      bizContext,
      context?.productName ? `Current product context: ${context.productName}` : '',
      context?.catalogName ? `Current catalog context: ${context.catalogName}` : '',
    ].filter(Boolean).join('\n');

    const reply = await aiService.chat([
      { role: 'system', content: systemPrompt },
      ...messages.slice(-12), // keep last 12 messages for context
    ]);

    res.status(200).json({ success: true, data: { reply } });
  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({ success: false, message: 'Failed to get AI response' });
  }
};