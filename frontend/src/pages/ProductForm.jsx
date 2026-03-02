import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, Save, Eye, Package, Image as ImageIcon, 
  List, Tag, DollarSign, Globe,
  Check, X, AlertCircle
} from 'lucide-react';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import ImageUpload from '../components/products/ImageUpload';
import SpecificationsBuilder from '../components/products/SpecificationsBuilder';
import { productService } from '../services/productService';
import toast from 'react-hot-toast';
import { formatCurrency } from '../utils/formatters';

const tabs = [
  { id: 'basic', name: 'Basic Info', icon: List },
  { id: 'images', name: 'Media', icon: ImageIcon },
  { id: 'pricing', name: 'Pricing & Inventory', icon: DollarSign },
  { id: 'specifications', name: 'Specifications', icon: Tag },
  { id: 'seo', name: 'SEO', icon: Globe },
];

export default function ProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    brand: '',
    shortDescription: '',
    description: '',
    price: '',
    compareAtPrice: '',
    costPrice: '',
    taxRate: '0',
    taxable: true,
    stock: '0',
    lowStockThreshold: '10',
    trackInventory: true,
    status: 'draft',
    images: [],
    tags: [],
    specifications: [],
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
  });

  const [tagInput, setTagInput] = useState('');

  // Derived State for Profit Calculation
  const profit = parseFloat(formData.price || 0) - parseFloat(formData.costPrice || 0);
  const margin = parseFloat(formData.price) > 0 ? ((profit / parseFloat(formData.price)) * 100).toFixed(1) : 0;

  useEffect(() => {
    if (id) {
       fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await productService.getProduct(id);
      // Transform specs object back to array if needed
      const specs = response.data.attributes 
        ? Object.entries(response.data.attributes).map(([key, value]) => ({ key, value }))
        : [];
      
      setFormData({
        ...response.data,
        specifications: specs || [],
        stock: response.data.stock?.toString() || '0',
        price: response.data.price?.toString() || '',
        compareAtPrice: response.data.compareAtPrice?.toString() || '',
        costPrice: response.data.costPrice?.toString() || '',
      });
    } catch (error) {
      toast.error('Failed to load product details');
      navigate('/dashboard/products');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const handleSubmit = async (e) => {
    if(e) e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Please fill in required fields (Name, Price, Category)');
      // Switch to basic tab if validation fails there
      if (!formData.name || !formData.category) setActiveTab('basic');
      else if (!formData.price) setActiveTab('pricing');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        price: parseFloat(formData.price),
        compareAtPrice: formData.compareAtPrice ? parseFloat(formData.compareAtPrice) : undefined,
        costPrice: formData.costPrice ? parseFloat(formData.costPrice) : undefined,
        taxRate: parseFloat(formData.taxRate),
        stock: parseInt(formData.stock),
        lowStockThreshold: parseInt(formData.lowStockThreshold),
        attributes: formData.specifications.reduce((acc, spec) => {
          if (spec.key && spec.value) {
            acc[spec.key] = spec.value;
          }
          return acc;
        }, {}),
      };

      if (id) {
        await productService.updateProduct(id, payload);
        toast.success('Product updated successfully!');
      } else {
        await productService.createProduct(payload);
        toast.success('Product created successfully!');
      }
      
      navigate('/dashboard/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = () => {
    // In a real app, this would open a preview modal or new tab with the draft data
    // For now, if it's an existing product, we can open the public page
    if (id) {
        window.open(`/product/${id}`, '_blank');
    } else {
        toast.success('Save the product first to preview it');
    }
  };

  if (fetching) return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-zinc-950">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-950 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard/products')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-gray-500 dark:text-gray-400"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {id ? 'Edit Product' : 'Create Product'}
                  {formData.status === 'draft' && (
                    <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium dark:bg-yellow-900/30 dark:text-yellow-500">
                      Draft
                    </span>
                  )}
                  {formData.status === 'active' && (
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-xs font-medium dark:bg-green-900/30 dark:text-green-500">
                      Active
                    </span>
                  )}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {id ? 'Update product details and inventory' : 'Add a new product to your catalog'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="secondary"
                onClick={handlePreview}
                disabled={loading}
                className="hidden sm:flex"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-2 hidden sm:block"></div>
              <Button
                variant="secondary"
                onClick={() => { setFormData(p => ({ ...p, status: 'draft' })); setTimeout(() => document.getElementById('product-form').requestSubmit(), 0); }}
                disabled={loading}
              >
                Save Draft
              </Button>
              <Button
                onClick={() => { setFormData(p => ({ ...p, status: 'active' })); setTimeout(() => document.getElementById('product-form').requestSubmit(), 0); }}
                loading={loading}
              >
                <Save className="w-4 h-4 mr-2" />
                {id ? 'Update Product' : 'Publish Product'}
              </Button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-1 overflow-x-auto no-scrollbar -mb-px">
            {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
                        activeTab === tab.id
                            ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                            : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:border-gray-300'
                        }`}
                    >
                        <Icon className="w-4 h-4" />
                        {tab.name}
                    </button>
                );
            })}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form id="product-form" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area (Left 2/3) */}
            <div className="lg:col-span-2 space-y-6">
                
                {/* Basic Info Tab */}
                {activeTab === 'basic' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">General Information</h3>
                    <div className="space-y-4">
                        <div>
                            <Input
                                label="Product Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Classic Leather Jacket"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Brand"
                                name="brand"
                                value={formData.brand}
                                onChange={handleChange}
                                placeholder="e.g. Nike"
                            />
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-900 dark:text-white">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        list="category-options"
                                        className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 dark:text-white placeholder-gray-400"
                                        placeholder="Select or type category..."
                                        required
                                    />
                                    <datalist id="category-options">
                                        {['Electronics', 'Fashion', 'Home & Garden', 'Beauty', 'Toys', 'Sports', 'Automotive', 'Books', 'Health', 'Groceries'].map(cat => (
                                            <option key={cat} value={cat} />
                                        ))}
                                    </datalist>
                                </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                                Description
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={6}
                                className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white resize-y"
                                placeholder="Describe your product..."
                            />
                        </div>
                    </div>
                    </div>

                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Organization</h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                                Tags
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                    className="flex-1 px-4 py-2 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
                                    placeholder="Add tag..."
                                />
                                <Button type="button" onClick={addTag} variant="secondary">Add</Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {formData.tags.map(tag => (
                                    <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                        {tag}
                                        <button type="button" onClick={() => removeTag(tag)} className="ml-2 hover:text-blue-900 hover:dark:text-blue-300">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                    </div>
                    <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-gray-800">
                        <Button type="button" onClick={() => setActiveTab('images')} size="lg">Next: Media &rarr;</Button>
                    </div>
                </div>
                )}

                {/* Images Tab */}
                {activeTab === 'images' && (
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                         <div className="flex items-center justify-between mb-4">
                             <h3 className="text-lg font-bold text-gray-900 dark:text-white">Product Media</h3>
                             <span className="text-sm text-gray-500">{formData.images.length} images added</span>
                         </div>
                         <ImageUpload 
                            images={formData.images} 
                            onChange={imgs => setFormData({...formData, images: imgs})}
                         />
                         <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
                            <Button type="button" variant="secondary" onClick={() => setActiveTab('basic')} size="lg">&larr; Back</Button>
                            <Button type="button" onClick={() => setActiveTab('pricing')} size="lg">Next: Pricing &rarr;</Button>
                         </div>
                    </div>
                )}

                {/* Pricing & Inventory Tab */}
                {activeTab === 'pricing' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Pricing Card */}
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-green-500" /> Pricing
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Selling Price"
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    required
                                    prefix="$"
                                />
                                <Input
                                    label="Compare at Price"
                                    name="compareAtPrice"
                                    type="number"
                                    value={formData.compareAtPrice}
                                    onChange={handleChange}
                                    placeholder="0.00"
                                    prefix="$"
                                    helpText="Original price before discount"
                                />
                                <div className="md:col-span-2 border-t border-gray-100 dark:border-gray-800 pt-4">
                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <Input
                                            label="Cost per Item"
                                            name="costPrice"
                                            type="number"
                                            value={formData.costPrice}
                                            onChange={handleChange}
                                            placeholder="0.00"
                                            prefix="$"
                                            helpText="Customers won't see this"
                                        />
                                        <div className="bg-gray-50 dark:bg-zinc-800/50 rounded-xl p-4 flex items-center justify-between">
                                            <div>
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Margin</p>
                                                <p className={`text-xl font-bold ${margin < 15 ? 'text-red-500' : 'text-green-500'}`}>
                                                    {isFinite(margin) ? margin : 0}%
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Profit</p>
                                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {formatCurrency(profit > 0 ? profit : 0)}
                                                </p>
                                            </div>
                                        </div>
                                     </div>
                                </div>
                            </div>
                        </div>

                         {/* Inventory Card */}
                         <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5 text-blue-500" /> Inventory
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="SKU (Stock Keeping Unit)"
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleChange}
                                    placeholder="Leaves empty to auto-generate"
                                />
                                <div className="flex items-center gap-4 pt-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            name="trackInventory"
                                            checked={formData.trackInventory}
                                            onChange={handleChange}
                                            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300"
                                        />
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Track Quantity</span>
                                    </label>
                                </div>
                                {formData.trackInventory && (
                                    <>
                                        <Input
                                            label="Quantity Available"
                                            name="stock"
                                            type="number"
                                            value={formData.stock}
                                            onChange={handleChange}
                                        />
                                        <Input
                                            label="Low Stock Alert Level"
                                            name="lowStockThreshold"
                                            type="number"
                                            value={formData.lowStockThreshold}
                                            onChange={handleChange}
                                        />
                                    </>
                                )}
                            </div>
                         </div>
                         <div className="flex justify-between items-center pt-6 border-t border-gray-100 dark:border-gray-800">
                            <Button type="button" variant="secondary" onClick={() => setActiveTab('images')} size="lg">&larr; Back</Button>
                            <Button type="button" onClick={() => setActiveTab('specifications')} size="lg">Next: Specs &rarr;</Button>
                        </div>
                    </div>
                )}

                 {/* Specifications Tab */}
                 {activeTab === 'specifications' && (
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Technical Specifications</h3>
                        <SpecificationsBuilder 
                            specifications={formData.specifications} 
                            onChange={specs => setFormData({...formData, specifications: specs})}
                        />
                         <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
                            <Button type="button" variant="secondary" onClick={() => setActiveTab('pricing')} size="lg">&larr; Back</Button>
                            <Button type="button" onClick={() => setActiveTab('seo')} size="lg">Next: SEO &rarr;</Button>
                         </div>
                    </div>
                )}
                
                 {/* SEO Tab */}
                 {activeTab === 'seo' && (
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Search Engine Optimization</h3>
                        <div className="space-y-4">
                            <Input
                                label="Page Title"
                                name="metaTitle"
                                value={formData.metaTitle}
                                onChange={handleChange}
                                placeholder={formData.name}
                                helpText="70 characters max"
                            />
                            <div>
                                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Meta Description</label>
                                <textarea
                                    name="metaDescription"
                                    value={formData.metaDescription}
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white resize-none"
                                />
                                <p className="text-xs text-gray-500 mt-1">Recommended 160 characters max</p>
                            </div>
                        </div>
                         <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
                            <Button type="button" variant="secondary" onClick={() => setActiveTab('specifications')} size="lg">&larr; Back</Button>
                            <Button type="button" onClick={() => { setFormData(p => ({ ...p, status: 'active' })); setTimeout(() => document.getElementById('product-form').requestSubmit(), 0); }} size="lg" className="bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20">
                                Save Product
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Sidebar (Right 1/3) */}
            <div className="space-y-6">
                {/* Status Card */}
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-6">
                    <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Product Status</h3>
                    <div className="space-y-4">
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white font-medium"
                        >
                            <option value="draft">Draft</option>
                            <option value="active">Active</option>
                            <option value="archived">Archived</option>
                        </select>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {formData.status === 'active' 
                            ? 'This product is visible in your store.' 
                            : 'This product is hidden from your store.'}
                        </p>
                    </div>
                </div>

                {/* Quick Completion Guide */}
                <div className="bg-blue-50 dark:bg-blue-900/10 rounded-2xl p-6 border border-blue-100 dark:border-blue-900/20">
                    <h3 className="text-blue-900 dark:text-blue-100 font-bold mb-3 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        Completion
                    </h3>
                    <div className="space-y-3">
                         {[
                             ['Basic Info', !!formData.name && !!formData.category],
                             ['Pricing', !!formData.price],
                             ['Media', formData.images.length > 0],
                             ['Inventory', !!formData.sku || !formData.trackInventory]
                         ].map(([label, active]) => (
                             <div key={label} className="flex items-center gap-2 text-sm">
                                 <div className={`w-5 h-5 rounded-full flex items-center justify-center ${active ? 'bg-blue-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                                     {active && <Check className="w-3 h-3" />}
                                 </div>
                                 <span className={active ? 'text-blue-700 dark:text-blue-300 font-medium' : 'text-gray-500 dark:text-gray-400'}>{label}</span>
                             </div>
                         ))}
                    </div>
                </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
