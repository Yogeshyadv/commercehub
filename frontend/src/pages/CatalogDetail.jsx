import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Plus, Search, Trash2, ExternalLink, 
  Check, X, Image as ImageIcon, CheckCircle2,
  Package, LayoutGrid, List as ListIcon, Share2, Copy
} from 'lucide-react';
import { catalogService } from '../services/catalogService';
import { productService } from '../services/productService';
import Loader from '../components/common/Loader';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useDebounce } from '../hooks/useDebounce';
import { formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';

export default function CatalogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]); // Products currently in catalog
  
  // Product Picker Modal
  const [showPicker, setShowPicker] = useState(false);
  const [pickerProducts, setPickerProducts] = useState([]);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [addingProducts, setAddingProducts] = useState(false);

  // Removing Product
  const [removeTarget, setRemoveTarget] = useState(null);
  const [removing, setRemoving] = useState(false);

  const debouncedPickerSearch = useDebounce(pickerSearch, 400);

  const fetchCatalog = useCallback(async () => {
    try {
      setLoading(true);
      const res = await catalogService.getCatalog(id);
      const catalogData = res.data;
      setCatalog(catalogData);
      // Backend stores products as [{ product: PopulatedProduct, order }]
      // Normalize to just the product objects
      const normalizedProducts = (catalogData.products || [])
        .map(entry => entry.product || entry)
        .filter(Boolean);
      setProducts(normalizedProducts);
    } catch (error) {
      console.error('Failed to load catalog:', error);
      toast.error('Failed to load catalog');
      navigate('/dashboard/catalogs');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  // Fetch available products for picker
  const fetchPickerProducts = useCallback(async () => {
    try {
      setPickerLoading(true);
      const params = { limit: 20 }; // Fetch first 20 for now, could implement pagination in picker
      if (debouncedPickerSearch) params.search = debouncedPickerSearch;
      
      const res = await productService.getProducts(params);
      
      // Filter out products already in catalog
      const currentIds = new Set(products.map(p => p._id));
      setPickerProducts(res.data.filter(p => !currentIds.has(p._id)));
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setPickerLoading(false);
    }
  }, [debouncedPickerSearch, products]);

  useEffect(() => {
    if (showPicker) {
      fetchPickerProducts();
    }
  }, [showPicker, fetchPickerProducts]);

  const handleAddProducts = async () => {
    if (selectedProductIds.length === 0) return;
    setAddingProducts(true);
    try {
      await catalogService.addProducts(id, selectedProductIds);
      toast.success('Products added to catalog');
      setShowPicker(false);
      setSelectedProductIds([]);
      setPickerSearch('');
      fetchCatalog(); // Refresh catalog products
    } catch (error) {
      toast.error('Failed to add products');
    } finally {
      setAddingProducts(false);
    }
  };

  const handleRemoveProduct = async () => {
    if (!removeTarget) return;
    setRemoving(true);
    try {
      await catalogService.removeProduct(id, removeTarget._id);
      toast.success('Product removed from catalog');
      setRemoveTarget(null);
      fetchCatalog(); // Refresh catalog products
    } catch (error) {
      toast.error('Failed to remove product');
    } finally {
      setRemoving(false);
    }
  };

  const toggleProductSelection = (productId) => {
    setSelectedProductIds(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const copyShareLink = () => {
    const link = `${window.location.origin}/catalog/${catalog.sharing?.shareableLink}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  };

  if (loading) return <Loader fullScreen text="Loading catalog..." />;

  if (!catalog) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Catalog Not Found</h2>
        <p className="text-gray-500 mt-2">The catalog you requested could not be loaded.</p>
        <button 
          onClick={() => navigate('/dashboard/catalogs')}
          className="mt-6 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Back to Catalogs
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard/catalogs')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-500" />
          </button>
          <div>
            <div className="flex items-center gap-3">
               <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{catalog.name}</h1>
               <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${
                  catalog.status === 'published' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
               }`}>
                 {catalog.status}
               </span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              {products.length} products • Created on {new Date(catalog.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={copyShareLink}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors shadow-sm"
          >
            <Copy className="w-4 h-4" />
            <span>Copy Link</span>
          </button>
          <button 
            onClick={() => window.open(`/catalog/${catalog.sharing?.shareableLink}`, '_blank')}
            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors shadow-sm"
          >
            <ExternalLink className="w-4 h-4" />
            <span>Preview</span>
          </button>
          <button 
            onClick={() => setShowPicker(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg shadow-primary-600/20 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            <span>Add Products</span>
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <div 
            key={product._id} 
            className="group bg-white dark:bg-zinc-950 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-lg transition-all"
          >
            <div className="relative aspect-square bg-gray-100 dark:bg-zinc-900 overflow-hidden">
               {product.images?.[0]?.url ? (
                 <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-gray-300">
                   <Package className="w-10 h-10" />
                 </div>
               )}
               <button 
                 onClick={() => setRemoveTarget(product)}
                 className="absolute top-2 right-2 p-2 bg-white/90 text-red-500 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50"
                 title="Remove from catalog"
               >
                 <Trash2 className="w-4 h-4" />
               </button>
            </div>
            <div className="p-4">
              <h4 className="font-bold text-gray-900 dark:text-white truncate">{product.name}</h4>
              <p className="text-gray-500 text-sm mt-1">{formatCurrency(product.price)}</p>
            </div>
          </div>
        ))}
        
        {/* Empty Catalog State */}
        {products.length === 0 && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-white dark:bg-zinc-950 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
             <div className="w-16 h-16 bg-gray-50 dark:bg-zinc-900 rounded-full flex items-center justify-center mb-4">
               <Package className="w-8 h-8 text-gray-400" />
             </div>
             <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Build your catalog</h3>
             <p className="text-gray-500 max-w-sm mb-6">Start adding products to create a stunning collection for your customers.</p>
             <button 
               onClick={() => setShowPicker(true)}
               className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-full font-bold shadow-lg shadow-primary-600/20 transition-all"
             >
               Add Products
             </button>
          </div>
        )}
      </div>

      {/* Product Picker Modal */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Add Products</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Select products to add to your catalog</p>
              </div>
              <button
                onClick={() => { setShowPicker(false); setSelectedProductIds([]); setPickerSearch(''); }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-zinc-900/50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search available products..."
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Picker Content */}
            <div className="flex-1 overflow-y-auto p-4 min-h-[300px]">
              {pickerLoading ? (
                <div className="flex justify-center py-10"><Loader /></div>
              ) : pickerProducts.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  {pickerSearch ? 'No matching products found' : 'No available products to add'}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pickerProducts.map(product => {
                    const isSelected = selectedProductIds.includes(product._id);
                    return (
                      <div 
                        key={product._id}
                        onClick={() => toggleProductSelection(product._id)}
                        className={`relative rounded-xl border cursor-pointer transition-all p-3 flex gap-3 ${
                          isSelected 
                           ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10 dark:border-primary-500 ring-1 ring-primary-500' 
                           : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'
                        }`}
                      >
                         <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-lg overflow-hidden shrink-0">
                           {product.images?.[0]?.url ? (
                             <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center"><Package className="w-6 h-6 text-gray-300" /></div>
                           )}
                         </div>
                         <div className="flex flex-col justify-center min-w-0">
                           <h5 className="font-bold text-sm text-gray-900 dark:text-white truncate">{product.name}</h5>
                           <p className="text-sm text-gray-500">{formatCurrency(product.price)}</p>
                         </div>
                         {isSelected && (
                           <div className="absolute top-2 right-2 text-primary-600">
                             <CheckCircle2 className="w-5 h-5 fill-primary-100" />
                           </div>
                         )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-zinc-900 flex justify-between items-center rounded-b-2xl">
              <span className="text-sm text-gray-500 font-medium">
                {selectedProductIds.length} product{selectedProductIds.length !== 1 && 's'} selected
              </span>
              <div className="flex gap-3">
                <button 
                  onClick={() => { setShowPicker(false); setSelectedProductIds([]); setPickerSearch(''); }}
                  className="px-5 py-2.5 text-gray-600 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-zinc-800 rounded-xl font-medium transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddProducts}
                  disabled={selectedProductIds.length === 0 || addingProducts}
                  className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold shadow-lg shadow-primary-600/20 transition-all active:scale-95"
                >
                  {addingProducts ? 'Adding...' : 'Add Selected'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Remove Confirmation */}
      <ConfirmDialog 
        isOpen={!!removeTarget} 
        onClose={() => setRemoveTarget(null)} 
        onConfirm={handleRemoveProduct}
        title="Remove Product" 
        message={`Are you sure you want to remove "${removeTarget?.name}" from this catalog?`} 
        confirmLabel="Remove" 
        loading={removing}
      />
    </div>
  );
}
