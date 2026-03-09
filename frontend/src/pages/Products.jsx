import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Filter, MoreVertical, Edit, Trash2, 
  ShoppingBag, Package, TrendingUp, TrendingDown, AlertCircle, 
  LayoutGrid, List as ListIcon, Check, X,
  ChevronLeft, ChevronRight, ArrowUpDown, Eye, Upload,
  Tags, Archive
} from 'lucide-react';
import { productService } from '../services/productService';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Badge from '../components/common/Badge'; // Added Badge
import { useDebounce } from '../hooks/useDebounce';
import { formatCurrency } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import BulkUploadModal from '../components/products/BulkUploadModal';
import { analyticsService } from '../services/analyticsService';
import StatsCard from '../components/dashboard/StatsCard';

const TABS = [
  { id: 'all', label: 'All Products' },
  { id: 'active', label: 'Active' },
  { id: 'draft', label: 'Drafts' },
  { id: 'low_stock', label: 'Low Stock' },
  { id: 'out_of_stock', label: 'Out of Stock' },
];

export default function Products() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list'); // Default to list for better management
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 0 });
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  
  // Filter States
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories, setCategories] = useState([]);
  
  // Action States
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const [overview, setOverview] = useState(null);

  useEffect(() => {
    analyticsService.getDashboardStats().then(r => setOverview(r.data?.overview)).catch(() => {});
  }, []);

  const debouncedSearch = useDebounce(search, 400);

  const fetchProducts = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = { page, limit: viewMode === 'list' ? 20 : 12 };
      if (debouncedSearch) params.search = debouncedSearch;
      if (categoryFilter) params.category = categoryFilter;
      
      // Map tabs to API params
      if (activeTab === 'active') params.status = 'active';
      if (activeTab === 'draft') params.status = 'draft';
      if (activeTab === 'out_of_stock') params.stockStatus = 'out_of_stock';
      if (activeTab === 'low_stock') params.stockStatus = 'low_stock';

      const response = await productService.getProducts(params);
      setProducts(response.data || []);
      setPagination(response.pagination || { page: 1, limit: 12, total: 0, pages: 0 });
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  }, [debouncedSearch, categoryFilter, activeTab, viewMode]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  // Load Categories (Mock or API)
  useEffect(() => {
    productService.getCategories?.()
      .then(r => setCategories(r.data || []))
      .catch(() => setCategories(['Electronics', 'Fashion', 'Home', 'Beauty'])); // Fallback
  }, []);

  // Close menus on click outside
  useEffect(() => {
    const handleClick = () => setActiveMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await productService.deleteProduct(deleteTarget._id);
      toast.success('Product deleted successfully');
      setDeleteTarget(null);
      fetchProducts(pagination.page);
    } catch { toast.error('Failed to delete product'); }
    finally { setDeleting(false); }
  };

  const toggleStock = async (product, e) => {
    e?.stopPropagation();
    const newStock = product.stock > 0 ? 0 : 10; // Simple toggle for now
    const newStatus = product.stock > 0 ? 'out_of_stock' : 'active';
    
    // Optimistic Update
    setProducts(products.map(p => p._id === product._id ? { ...p, stock: newStock, status: newStatus } : p));
    
    try {
      await productService.updateProduct(product._id, { stock: newStock, status: newStatus });
      toast.success(`Product marked as ${newStock > 0 ? 'In Stock' : 'Out of Stock'}`);
    } catch {
      // Revert
      setProducts(products.map(p => p._id === product._id ? product : p));
      toast.error('Failed to update stock status');
    }
  };

  const getStockStatus = (stock) => {
    if (stock <= 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' };
    if (stock < 10) return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' };
    return { label: 'In Stock', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' };
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#111827] dark:text-white tracking-tight">Products</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base">
            Manage your inventory, pricing, and product details.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-zinc-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-zinc-700 shadow-sm text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'}`}
            >
              <ListIcon className="w-5 h-5" />
            </button>
          </div>

          <button 
            onClick={() => setShowBulkUpload(true)}
            className="hidden md:flex items-center gap-2 px-4 py-3 bg-white dark:bg-zinc-800 border-2 border-dashed border-gray-300 dark:border-zinc-600 text-gray-600 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-zinc-700 hover:border-gray-400 dark:hover:border-zinc-500 transition-all"
          >
            <Upload className="w-5 h-5" />
            <span>Import</span>
          </button>

          <button 
            onClick={() => navigate('/dashboard/products/new')}
            className="flex items-center gap-2 px-5 py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-xl font-bold shadow-lg shadow-[#DC2626]/20 transition-all transform hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <StatsCard icon={Package} title="Total Products" value={overview?.totalProducts || pagination.total} color="blue" />
        <StatsCard icon={Check} title="Active Listings" value={overview?.activeProducts || '-'} color="green" />
        <StatsCard icon={AlertCircle} title="Out of Stock" value={(overview?.totalProducts || 0) - (overview?.activeProducts || 0)} color="red" />
        <StatsCard icon={LayoutGrid} title="Categories" value={categories.length} color="purple" />
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col space-y-4">
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
             {TABS.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border ${
                        activeTab === tab.id
                        ? 'bg-[#DC2626] text-white border-transparent shadow-lg shadow-[#DC2626]/20 transform scale-105'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300 dark:bg-zinc-900 dark:text-gray-400 dark:border-zinc-800 dark:hover:bg-zinc-800'
                    }`}
                >
                    {tab.label}
                </button>
             ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input 
                    type="text" 
                    placeholder="Search products by name, SKU, or tags..." 
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 focus:ring-2 focus:ring-[#DC2626]/20 focus:border-gray-300 dark:focus:border-zinc-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none transition-all shadow-sm" 
                />
            </div>
            
            {/* Category Filter */}
            <div className="relative min-w-[200px]">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Filter className="h-5 w-5 text-gray-400" />
                </div>
                <select
                    className="w-full pl-11 pr-10 py-3.5 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 focus:ring-2 focus:ring-[#DC2626]/20 text-gray-700 dark:text-gray-300 font-medium appearance-none cursor-pointer focus:outline-none"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <ChevronRight className="h-4 w-4 text-gray-400 rotate-90" />
                </div>
            </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader text="Loading inventory..." />
        </div>
      ) : products.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No products found"
          description={search ? "We couldn't find any products matching your search." : "Start by adding your first product to the inventory."}
          actionLabel="Add Product"
          onAction={() => navigate('/dashboard/products/new')}
          actionIcon={Plus}
        />
      ) : (
        <>
          {viewMode === 'grid' ? (
            /* GRID VIEW */
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => {
                const isOutOfStock = product.stock <= 0;
                const isLowStock = product.stock > 0 && product.stock <= 10;
                
                return (
                  <div 
                    key={product._id} 
                    onClick={() => navigate(`/dashboard/products/edit/${product._id}`)}
                    className="group bg-white dark:bg-zinc-950 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer overflow-hidden"
                  >
                    {/* Image Area */}
                    <div className="relative aspect-square bg-gray-100 dark:bg-zinc-900 overflow-hidden">
                      {product.images?.[0]?.url ? (
                        <img 
                          src={product.images[0].url} 
                          alt={product.name} 
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-zinc-700">
                          <ShoppingBag className="w-12 h-12" />
                        </div>
                      )}
                      
                      {/* Status Badge */}
                      <div className="absolute top-3 left-3">
                         {isOutOfStock ? (
                             <Badge color="red" className="shadow-lg backdrop-blur-md bg-white/90 dark:bg-black/90">Out of Stock</Badge>
                         ) : isLowStock ? (
                             <Badge color="yellow" className="shadow-lg backdrop-blur-md bg-white/90 dark:bg-black/90">Low Stock</Badge>
                         ) : (
                             <Badge color="green" className="shadow-lg backdrop-blur-md bg-white/90 dark:bg-black/90">In Stock</Badge>
                         )}
                      </div>

                      {/* Quick Actions Actions */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 backdrop-blur-[2px]">
                         <button 
                          onClick={(e) => { e.stopPropagation(); navigate(`/product/${product._id}`); }}
                          className="p-3 bg-white dark:bg-zinc-800 rounded-full shadow-lg text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:scale-110 transition-all"
                          title="View Product Page"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/products/edit/${product._id}`); }}
                          className="p-3 bg-white dark:bg-zinc-800 rounded-full shadow-lg text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:scale-110 transition-all"
                          title="Edit Product"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setDeleteTarget(product); }}
                          className="p-3 bg-white dark:bg-zinc-800 rounded-full shadow-lg text-gray-600 dark:text-gray-300 hover:text-red-500 hover:scale-110 transition-all"
                          title="Delete Product"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider bg-gray-100 dark:bg-zinc-900 px-2 py-0.5 rounded-md">
                          {product.category || 'Uncategorized'}
                        </span>
                        <div className={`flex items-center gap-1.5 text-xs font-medium ${isOutOfStock ? 'text-red-500' : isLowStock ? 'text-yellow-600' : 'text-red-600'}`}>
                           <Package className="w-3.5 h-3.5" />
                           <span>{product.stock} units</span>
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-gray-900 dark:text-white truncate mb-1 text-lg group-hover:text-blue-600 transition-colors" title={product.name}>
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-4">{product.sku || 'No SKU'}</p>
                      
                      <div className="mt-auto flex items-center justify-between border-t border-gray-100 dark:border-gray-800 pt-4">
                        <div className="flex flex-col">
                           <span className="text-lg font-bold text-[#111827] dark:text-white">
                             {formatCurrency(product.price)}
                           </span>
                           {product.compareAtPrice > product.price && (
                             <span className="text-xs text-gray-400 line-through">
                               {formatCurrency(product.compareAtPrice)}
                             </span>
                           )}
                        </div>
                        
                        {/* Quick Stock Toggle */}
                        <div onClick={e => e.stopPropagation()}>
                           <label className="flex items-center gap-2 cursor-pointer" title={isOutOfStock ? "Mark as In Stock" : "Mark as Out of Stock"}>
                             <span className="text-xs font-medium text-gray-400 mr-2 hidden sm:inline">Active</span>
                             <input 
                               type="checkbox" 
                               checked={product.stock > 0} 
                               onChange={(e) => toggleStock(product, e)}
                               className="sr-only peer"
                             />
                             <div className="w-11 h-6 bg-gray-200 dark:bg-zinc-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#DC2626] relative transition-colors"></div>
                           </label>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* LIST VIEW (Table) */
            <div className="bg-white dark:bg-zinc-950 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
               <div className="overflow-x-auto">
                 <table className="w-full text-left">
                   <thead className="bg-gray-50/50 dark:bg-zinc-900/50 border-b border-gray-100 dark:border-gray-800">
                     <tr>
                       <th className="px-6 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Product</th>
                       <th className="px-6 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Category</th>
                       <th className="px-6 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Stock</th>
                       <th className="px-6 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Price</th>
                       <th className="px-6 py-4 text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Status</th>
                       <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-50/50 dark:divide-gray-800/50">
                     {products.map((product) => (
                       <tr 
                         key={product._id} 
                         onClick={() => navigate(`/dashboard/products/edit/${product._id}`)}
                         className="hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors cursor-pointer group"
                       >
                         <td className="px-6 py-4">
                           <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0 border border-gray-100 dark:border-zinc-700">
                               {product.images?.[0]?.url ? (
                                 <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                               ) : (
                                 <div className="w-full h-full flex items-center justify-center">
                                   <ShoppingBag className="w-5 h-5 text-gray-300" />
                                 </div>
                               )}
                             </div>
                             <div>
                               <p className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{product.name}</p>
                               <p className="text-xs text-gray-500 mt-0.5">SKU: {product.sku || 'N/A'}</p>
                             </div>
                           </div>
                         </td>
                         <td className="px-6 py-4">
                           <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-zinc-800 dark:text-gray-300">
                             {product.category || 'Uncategorized'}
                           </span>
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {product.stock <= 0 ? (
                                  <div className="flex items-center gap-1.5 text-red-600 dark:text-red-400">
                                      <AlertCircle className="w-4 h-4" />
                                      <span className="text-sm font-medium">Out of Stock</span>
                                  </div>
                              ) : product.stock <= 10 ? (
                                  <div className="flex items-center gap-1.5 text-yellow-600 dark:text-yellow-400">
                                      <TrendingDown className="w-4 h-4" />
                                      <span className="text-sm font-medium">{product.stock} (Low)</span>
                                  </div>
                              ) : (
                                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{product.stock}</span>
                              )}
                            </div>
                         </td>
                         <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                           {formatCurrency(product.price)}
                         </td>
                         <td className="px-6 py-4">
                            <Badge color={product.status === 'active' || product.status === 'published' ? 'green' : 'gray'}>
                                {product.status === 'active' || product.status === 'published' ? 'Active' : 'Draft'}
                            </Badge>
                         </td>
                         <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                             <button 
                               onClick={() => navigate(`/dashboard/products/edit/${product._id}`)}
                               className="px-3 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-200 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
                             >
                               Edit
                             </button>
                             <button 
                               onClick={() => setDeleteTarget(product)}
                               className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                               title="Delete"
                             >
                               <Trash2 className="w-4 h-4" />
                             </button>
                           </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          )}

          <div className="mt-8 flex justify-center">
             <Pagination 
               page={pagination.page} 
               totalPages={pagination.pages} 
               total={pagination.total} 
               limit={pagination.limit} 
               onPageChange={(p) => fetchProducts(p)} 
             />
          </div>
        </>
      )}

      <BulkUploadModal 
        isOpen={showBulkUpload} 
        onClose={() => setShowBulkUpload(false)} 
        onSuccess={() => fetchProducts(1)} 
      />
      
      {/* Delete Confirmation */}
      <ConfirmDialog 
        isOpen={!!deleteTarget} 
        onClose={() => setDeleteTarget(null)} 
        onConfirm={handleDelete}
        title="Delete Product" 
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This will permanently remove it from your inventory.`} 
        confirmLabel="Delete Product" 
        loading={deleting} 
      />
    </div>
  );
}