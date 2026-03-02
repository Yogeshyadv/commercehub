const Catalog = require('../models/Catalog');
const Product = require('../models/Product');
const QRCode = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const { getPagination } = require('../utils/helpers');

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
    if (req.query.search) query.name = { $regex: req.query.search, $options: 'i' };

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
      .populate('tenant', 'name logo branding contactInfo socialLinks');

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