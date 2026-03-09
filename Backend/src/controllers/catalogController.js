const Catalog = require('../models/Catalog');
const Product = require('../models/Product');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const { getPagination } = require('../utils/helpers');
const cloudinary = require('../config/cloudinary');

exports.createCatalog = async (req, res) => {
  try {
    req.body.tenant = req.tenantId;
    req.body.createdBy = req.user._id;

    const shareableId = uuidv4().split('-')[0];
    req.body.sharing = { ...req.body.sharing, shareableLink: shareableId, isPublic: req.body.isPublic !== false };

    const catalog = await Catalog.create(req.body);

    const catalogUrl = `${process.env.CLIENT_URL}/catalog/${shareableId}`;
    const qrCode = await QRCode.toDataURL(catalogUrl);
    catalog.sharing.qrCode = qrCode;
    await catalog.save();

    res.status(201).json({ success: true, message: 'Catalog created', data: catalog });
  } catch (error) {
    console.error('CreateCatalog error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getCatalogs = async (req, res) => {
  try {
    const { page, limit, skip } = getPagination(req.query.page, req.query.limit);
    let query = { tenant: req.tenantId };
    if (req.query.status) query.status = req.query.status;
    if (req.query.search) {
      const regex = new RegExp(req.query.search, 'i');
      query.$or = [
        { name: regex },
        { description: regex },
        { tags: regex },
        { categories: regex },
      ];
    }

    const [catalogs, total] = await Promise.all([
      Catalog.find(query).sort({ updatedAt: -1 }).skip(skip).limit(limit).populate('products.product', 'name price images status').lean(),
      Catalog.countDocuments(query)
    ]);

    res.status(200).json({ success: true, data: catalogs, pagination: { page, limit, total, pages: Math.ceil(total / limit) } });
  } catch (error) {
    console.error('GetCatalogs error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getCatalog = async (req, res) => {
  try {
    const catalog = await Catalog.findOne({ _id: req.params.id, tenant: req.tenantId }).populate('products.product');
    if (!catalog) return res.status(404).json({ success: false, message: 'Catalog not found' });
    res.status(200).json({ success: true, data: catalog });
  } catch (error) {
    console.error('GetCatalog error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getPublicCatalog = async (req, res) => {
  try {
    const catalog = await Catalog.findOne({ 'sharing.shareableLink': req.params.shareableLink, 'sharing.isPublic': true, status: 'published' })
      .populate('products.product', 'name price compareAtPrice images shortDescription stock status category')
      .populate({ path: 'tenant', select: 'name logo branding contactInfo socialLinks owner', populate: { path: 'owner', select: 'phone' } });

    if (!catalog) return res.status(404).json({ success: false, message: 'Catalog not found' });
    if (catalog.sharing.expiresAt && catalog.sharing.expiresAt < new Date()) return res.status(410).json({ success: false, message: 'Catalog link expired' });

    catalog.analytics.viewCount += 1;
    catalog.analytics.lastViewedAt = new Date();
    await catalog.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, data: catalog });
  } catch (error) {
    console.error('GetPublicCatalog error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateCatalog = async (req, res) => {
  try {
    let catalog = await Catalog.findOne({ _id: req.params.id, tenant: req.tenantId });
    if (!catalog) return res.status(404).json({ success: false, message: 'Catalog not found' });
    catalog = await Catalog.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: 'Catalog updated', data: catalog });
  } catch (error) {
    console.error('UpdateCatalog error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteCatalog = async (req, res) => {
  try {
    const catalog = await Catalog.findOne({ _id: req.params.id, tenant: req.tenantId });
    if (!catalog) return res.status(404).json({ success: false, message: 'Catalog not found' });
    await Catalog.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Catalog deleted' });
  } catch (error) {
    console.error('DeleteCatalog error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.addProducts = async (req, res) => {
  try {
    const { productIds } = req.body;
    const catalog = await Catalog.findOne({ _id: req.params.id, tenant: req.tenantId });
    if (!catalog) return res.status(404).json({ success: false, message: 'Catalog not found' });

    const products = await Product.find({ _id: { $in: productIds }, tenant: req.tenantId });
    const existingIds = catalog.products.map(p => p.product.toString());
    const newProducts = products.filter(p => !existingIds.includes(p._id.toString())).map((p, i) => ({ product: p._id, order: catalog.products.length + i }));

    catalog.products.push(...newProducts);
    await catalog.save();
    await Product.updateMany({ _id: { $in: productIds } }, { $addToSet: { catalogs: catalog._id } });

    res.status(200).json({ success: true, message: `${newProducts.length} products added`, data: catalog });
  } catch (error) {
    console.error('AddProducts error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.uploadCoverImage = async (req, res) => {
  try {
    const catalog = await Catalog.findOne({ _id: req.params.id, tenant: req.tenantId });
    if (!catalog) return res.status(404).json({ success: false, message: 'Catalog not found' });
    if (!req.file) return res.status(400).json({ success: false, message: 'Please upload an image' });

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: `nextgen-saas/${req.tenantId}/catalogs`, resource_type: 'image' },
        (error, r) => { if (error) reject(error); else resolve(r); }
      );
      stream.end(req.file.buffer);
    });

    catalog.coverImage = { public_id: result.public_id, url: result.secure_url };
    await catalog.save();
    res.status(200).json({ success: true, message: 'Cover image uploaded', data: catalog.coverImage });
  } catch (error) {
    console.error('UploadCoverImage error:', error);
    const message = error?.message || 'Failed to upload cover image';
    return res.status(500).json({ success: false, message });
  }
};

exports.removeProduct = async (req, res) => {
  try {
    const catalog = await Catalog.findOne({ _id: req.params.id, tenant: req.tenantId });
    if (!catalog) return res.status(404).json({ success: false, message: 'Catalog not found' });

    catalog.products = catalog.products.filter(p => p.product.toString() !== req.params.productId);
    await catalog.save();
    await Product.findByIdAndUpdate(req.params.productId, { $pull: { catalogs: catalog._id } });

    res.status(200).json({ success: true, message: 'Product removed', data: catalog });
  } catch (error) {
    console.error('RemoveProduct error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

/* Atomically replace the entire product list for a catalog */
exports.syncProducts = async (req, res) => {
  try {
    const { productIds } = req.body;
    if (!Array.isArray(productIds)) {
      return res.status(400).json({ success: false, message: 'productIds must be an array' });
    }

    const catalog = await Catalog.findOne({ _id: req.params.id, tenant: req.tenantId });
    if (!catalog) return res.status(404).json({ success: false, message: 'Catalog not found' });

    // Products that were removed
    const oldIds = catalog.products.map(p => p.product.toString());
    const removedIds = oldIds.filter(id => !productIds.includes(id));
    const addedIds = productIds.filter(id => !oldIds.includes(id));

    // Verify added products belong to this tenant
    const validProducts = productIds.length > 0
      ? await Product.find({ _id: { $in: productIds }, tenant: req.tenantId }).select('_id')
      : [];
    const validIds = validProducts.map(p => p._id.toString());

    catalog.products = validIds.map((pid, i) => ({ product: pid, order: i }));
    await catalog.save();

    // Update cross-references in background (non-blocking)
    if (removedIds.length > 0) {
      Product.updateMany({ _id: { $in: removedIds } }, { $pull: { catalogs: catalog._id } }).catch(() => {});
    }
    if (addedIds.length > 0) {
      Product.updateMany({ _id: { $in: addedIds } }, { $addToSet: { catalogs: catalog._id } }).catch(() => {});
    }

    res.status(200).json({ success: true, message: 'Products synced', data: catalog });
  } catch (error) {
    console.error('SyncProducts error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};