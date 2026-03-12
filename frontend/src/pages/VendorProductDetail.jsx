import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Package,
  Star,
  MoreVertical,
  Eye,
  Share2,
  Copy,
  BarChart3
} from 'lucide-react';
import { productService } from '../services/productService';
import { formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Badge from '../components/common/Badge';

const STATUS_BADGE = {
  active: { label: 'Active', color: 'green' },
  draft: { label: 'Draft', color: 'gray' },
  inactive: { label: 'Inactive', color: 'yellow' },
};

export default function VendorProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productService.getProduct(id);
      setProduct(response.data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      toast.error('Product not found');
      navigate('/dashboard/products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!product) return;
    
    setDeleting(true);
    try {
      await productService.deleteProduct(product._id);
      toast.success('Product deleted successfully');
      navigate('/dashboard/products');
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product');
    } finally {
      setDeleting(false);
      setDeleteDialog(false);
    }
  };

  const handleShareProduct = async () => {
    const productUrl = `${window.location.origin}/product/${product._id}`;
    try {
      await navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: productUrl,
      });
    } catch (err) {
      navigator.clipboard.writeText(productUrl);
      toast.success('Product link copied to clipboard!');
    }
  };

  const handleViewCustomerPage = () => {
    window.open(`/product/${product._id}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <Loader text="Loading product details..." />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4">
        <Package className="w-16 h-16 text-gray-300 dark:text-zinc-700 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Product not found</h2>
        <button 
          onClick={() => navigate('/dashboard/products')}
          className="px-6 py-2.5 bg-[#DC2626] text-white rounded-full hover:bg-[#b91c1c] transition-colors font-medium mt-4"
        >
          Back to Products
        </button>
      </div>
    );
  }

  const statusCfg = STATUS_BADGE[product.status] || STATUS_BADGE.draft;
  const images = product.images?.length > 0 ? product.images : [{ url: '', alt: 'No image' }];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard/products')}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Product Details</h1>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleViewCustomerPage}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors"
              >
                <Eye className="w-4 h-4" />
                View Customer Page
              </button>
              
              <button
                onClick={() => navigate(`/dashboard/products/edit/${product._id}`)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#DC2626] rounded-lg hover:bg-[#b91c1c] transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Product
              </button>
              
              <div className="relative">
                <button
                  onClick={() => setShowActions(!showActions)}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <MoreVertical className="w-5 h-5" />
                </button>
                
                {showActions && (
                  <>
                    <div 
                      className="fixed inset-0 z-30" 
                      onClick={() => setShowActions(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-gray-200 dark:border-zinc-700 z-40 py-1">
                      <button
                        onClick={handleShareProduct}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                      >
                        <Share2 className="w-4 h-4" />
                        Share Product
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}/product/${product._id}`);
                          toast.success('Link copied!');
                          setShowActions(false);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                      >
                        <Copy className="w-4 h-4" />
                        Copy Link
                      </button>
                      <div className="border-t border-gray-200 dark:border-zinc-700 my-1" />
                      <button
                        onClick={() => {
                          setDeleteDialog(true);
                          setShowActions(false);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete Product
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Product Images */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 overflow-hidden">
              <div className="aspect-square bg-gray-50 dark:bg-zinc-900 relative">
                {images[0]?.url ? (
                  <img
                    src={images[0].url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-300 dark:text-zinc-600" />
                  </div>
                )}
              </div>
              
              {images.length > 1 && (
                <div className="p-4 border-t border-gray-200 dark:border-zinc-700">
                  <div className="grid grid-cols-4 gap-2">
                    {images.map((img, idx) => (
                      <div
                        key={idx}
                        className="aspect-square bg-gray-50 dark:bg-zinc-900 rounded-lg overflow-hidden border-2 border-transparent hover:border-[#128C7E] transition-colors cursor-pointer"
                      >
                        {img.url ? (
                          <img src={img.url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-300" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Product Information */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Info */}
            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {product.name}
                  </h2>
                  {product.sku && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      SKU: {product.sku}
                    </p>
                  )}
                </div>
                <Badge color={statusCfg.color}>{statusCfg.label}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Price</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {formatCurrency(product.price)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Stock</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {product.stock ?? 0}
                  </p>
                </div>
              </div>

              {product.category && (
                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Category</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {product.category}
                  </p>
                </div>
              )}

              {product.shortDescription && (
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Short Description</p>
                  <p className="text-gray-700 dark:text-gray-300">
                    {product.shortDescription}
                  </p>
                </div>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Description</h3>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
              </div>
            )}

            {/* Specifications */}
            {product.attributes && Object.keys(product.attributes).length > 0 && (
              <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(product.attributes).map(([key, value]) => (
                    <div key={key} className="border-b border-gray-200 dark:border-zinc-700 pb-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{key}</p>
                      <p className="text-sm text-gray-900 dark:text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-gray-200 dark:border-zinc-700 p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-[#128C7E]/10 rounded-lg mx-auto mb-2">
                    <Star className="w-6 h-6 text-[#128C7E]" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {product.rating?.toFixed(1) || '0.0'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Rating</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-500/10 rounded-lg mx-auto mb-2">
                    <BarChart3 className="w-6 h-6 text-blue-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {product.numReviews || 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Reviews</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-500/10 rounded-lg mx-auto mb-2">
                    <Package className="w-6 h-6 text-green-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {product.totalSold || 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Sold</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-500/10 rounded-lg mx-auto mb-2">
                    <Eye className="w-6 h-6 text-purple-500" />
                  </div>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {product.views || 0}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Views</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Product"
        message={`Are you sure you want to delete "${product.name}"? This action cannot be undone and will remove the product from your catalog.`}
        confirmLabel="Delete Product"
        variant="danger"
      />
    </div>
  );
}
