const Product = require('../models/Product');
const Inventory = require('../models/Inventory');
const cloudinary = require('../config/cloudinary');
const sharp = require('sharp');
const { getPagination } = require('../utils/helpers');

// @desc    Get public products (no auth required)
exports.getPublicProducts = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query.page, req.query.limit);
    let query = { status: 'active' }; // Only show active products to public

    if (req.query.search) query.$text = { $search: req.query.search };
    if (req.query.category) query.category = req.query.category;
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }
    if (req.query.brand) query.brand = req.query.brand;

    let sort = { createdAt: -1 };
    if (req.query.sort) {
      sort = {};
      req.query.sort.split(',').forEach(field => {
        sort[field.startsWith('-') ? field.substring(1) : field] = field.startsWith('-') ? -1 : 1;
      });
    }

    const [products, total] = await Promise.all([
      Product.find(query).sort(sort).skip(skip).limit(limit).lean(),
      Product.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('GetPublicProducts error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single public product (no auth required)
exports.getPublicProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, status: 'active' }).lean();
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('GetPublicProduct error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get public categories (no auth required)
exports.getPublicCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category', { status: 'active' });
    res.status(200).json({ success: true, data: categories.filter(Boolean) });
  } catch (error) {
    console.error('GetPublicCategories error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create product
exports.createProduct = async (req, res) => {
  try {
    req.body.tenant = req.tenantId;
    req.body.createdBy = req.user._id;

    const product = await Product.create(req.body);

    await Inventory.create({
      tenant: req.tenantId,
      product: product._id,
      quantity: req.body.stock || 0,
      reorderLevel: req.body.lowStockThreshold || 10,
    });

    const Tenant = require('../models/Tenant');
    await Tenant.findByIdAndUpdate(req.tenantId, {
      $inc: { 'metadata.totalProducts': 1 }
    });

    res.status(201).json({ success: true, message: 'Product created successfully', data: product });
  } catch (error) {
    console.error('CreateProduct error:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join('. ') });
    }
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get all products
exports.getProducts = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query.page, req.query.limit);
    let query = { tenant: req.tenantId };

    if (req.query.search) query.$text = { $search: req.query.search };
    if (req.query.category) query.category = req.query.category;
    if (req.query.status) query.status = req.query.status;
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = parseFloat(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = parseFloat(req.query.maxPrice);
    }
    if (req.query.brand) query.brand = req.query.brand;

    let sort = { createdAt: -1 };
    if (req.query.sort) {
      sort = {};
      req.query.sort.split(',').forEach(field => {
        sort[field.startsWith('-') ? field.substring(1) : field] = field.startsWith('-') ? -1 : 1;
      });
    }

    const [products, total] = await Promise.all([
      Product.find(query).sort(sort).skip(skip).limit(limit).populate('createdBy', 'firstName lastName').lean(),
      Product.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      data: products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    console.error('GetProducts error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, tenant: req.tenantId }).populate('createdBy', 'firstName lastName');
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    product.viewCount += 1;
    await product.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error('GetProduct error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update product
exports.updateProduct = async (req, res) => {
  try {
    let product = await Product.findOne({ _id: req.params.id, tenant: req.tenantId });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

    if (req.body.stock !== undefined) {
      await Inventory.findOneAndUpdate(
        { tenant: req.tenantId, product: product._id },
        {
          quantity: req.body.stock,
          $push: { movements: { type: 'adjustment', quantity: req.body.stock, notes: 'Stock updated via product edit', performedBy: req.user._id } }
        }
      );
    }

    res.status(200).json({ success: true, message: 'Product updated', data: product });
  } catch (error) {
    console.error('UpdateProduct error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, tenant: req.tenantId });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    if (product.images && product.images.length > 0) {
      for (const image of product.images) {
        if (image.public_id) {
          try { await cloudinary.uploader.destroy(image.public_id); } catch (e) { console.error('Cloudinary delete error:', e.message); }
        }
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    await Inventory.deleteMany({ product: req.params.id, tenant: req.tenantId });

    const Tenant = require('../models/Tenant');
    await Tenant.findByIdAndUpdate(req.tenantId, { $inc: { 'metadata.totalProducts': -1 } });

    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    console.error('DeleteProduct error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Upload images
exports.uploadImages = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, tenant: req.tenantId });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    if (!req.files || req.files.length === 0) return res.status(400).json({ success: false, message: 'Please upload at least one image' });

    const uploadPromises = req.files.map(async (file) => {
      const optimizedBuffer = await sharp(file.buffer).resize(1200, 1200, { fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 85 }).toBuffer();
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: `nextgen-saas/${req.tenantId}/products`, resource_type: 'image' },
          (error, result) => {
            if (error) reject(error);
            else resolve({ public_id: result.public_id, url: result.secure_url, alt: file.originalname.split('.')[0] });
          }
        );
        uploadStream.end(optimizedBuffer);
      });
    });

    const uploadedImages = await Promise.all(uploadPromises);
    product.images.push(...uploadedImages);
    await product.save();

    res.status(200).json({ success: true, message: 'Images uploaded', data: product.images });
  } catch (error) {
    console.error('UploadImages error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category', { tenant: req.tenantId });
    res.status(200).json({ success: true, data: categories });
  } catch (error) {
    console.error('GetCategories error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Bulk update status
exports.bulkUpdateStatus = async (req, res) => {
  try {
    const { productIds, status } = req.body;
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return res.status(400).json({ success: false, message: 'Please provide product IDs' });
    }
    const result = await Product.updateMany({ _id: { $in: productIds }, tenant: req.tenantId }, { status });
    res.status(200).json({ success: true, message: `${result.modifiedCount} products updated` });
  } catch (error) {
    console.error('BulkUpdate error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};