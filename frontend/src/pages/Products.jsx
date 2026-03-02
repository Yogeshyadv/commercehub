import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Filter, MoreVertical, Edit, Trash2, 
  ShoppingBag, Package, TrendingUp, AlertCircle, 
  LayoutGrid, List as ListIcon, Check, X,
  ChevronLeft, ChevronRight, ArrowUpDown, Eye
} from 'lucide-react';
import { productService } from '../services/productService';
import Button from '../components/common/Button';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useDebounce } from '../hooks/useDebounce';
import { formatCurrency } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Products() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid');
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, pages: 0 });
  
  // Filter States
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categories, setCategories] = useState([]);
  
  // Action States
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const debouncedSearch = useDebounce(search, 400);

  const fetchProducts = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = { page, limit: viewMode === 'list' ? 20 : 12 };
      if (debouncedSearch) params.search = debouncedSearch;
      if (categoryFilter) params.category = categoryFilter;
      if (statusFilter) params.status = statusFilter;
      if (stockFilter) params.stockStatus = stockFilter; // Assuming backend supports this

      const response = await productService.getProducts(params);
      setProducts(response.data || []);
      setPagination(response.pagination || { page: 1, limit: 12, total: 0, pages: 0 });
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  }, [debouncedSearch, categoryFilter, statusFilter, stockFilter, viewMode]);

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
    return { label: 'In Stock', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
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
            onClick={() => navigate('/dashboard/products/new')}
            className="flex items-center gap-2 px-5 py-3 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all transform hover:scale-105 active:scale-95"
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Stats Cards (Optional - nice for UX) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 mb-1">
            <Package className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">Total Products</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{pagination.total}</p>
        </div>
        <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 mb-1">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-xs font-medium uppercase tracking-wider">Low Stock</span>
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">-</p> 
        </div>
        {/* Add more stats if data available */}
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col xl:flex-row gap-4 bg-white dark:bg-zinc-950 p-2 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search products by name, SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
          />
        </div>
        <div className="h-px xl:h-auto xl:w-px bg-gray-100 dark:bg-gray-700 mx-2" />
        <div className="flex overflow-x-auto gap-4 pb-2 xl:pb-0 no-scrollbar">
            <div className="relative min-w-[160px]">
                <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <select
                    className="w-full pl-10 pr-4 py-3 bg-transparent border-none focus:ring-0 text-gray-600 dark:text-gray-300 font-medium cursor-pointer appearance-none focus:outline-none"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
            <div className="w-px bg-gray-100 dark:bg-gray-700" />
            <div className="relative min-w-[140px]">
                <select
                    className="w-full px-4 py-3 bg-transparent border-none focus:ring-0 text-gray-600 dark:text-gray-300 font-medium cursor-pointer appearance-none focus:outline-none"
                    value={stockFilter}
                    onChange={(e) => setStockFilter(e.target.value)}
                >
                    <option value="">All Stock</option>
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                </select>
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
                const stockStatus = getStockStatus(product.stock);
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
                      
                      {/* Stock Badge */}
                      <div className="absolute top-3 left-3">
                         <span className={`px-2 py-1 rounded-full text-xs font-bold backdrop-blur-md ${stockStatus.color}`}>
                           {stockStatus.label}
                         </span>
                      </div>

                      {/* Quick Actions Actions */}
                      <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                         <button 
                          onClick={(e) => { e.stopPropagation(); navigate(`/product/${product._id}`); }}
                          className="p-2 bg-white dark:bg-zinc-800 rounded-full shadow-lg text-gray-600 dark:text-gray-300 hover:text-primary-600 hover:scale-110 transition-all"
                          title="View Product Page"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/products/edit/${product._id}`); }}
                          className="p-2 bg-white dark:bg-zinc-800 rounded-full shadow-lg text-gray-600 dark:text-gray-300 hover:text-blue-600 hover:scale-110 transition-all"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); setDeleteTarget(product); }}
                          className="p-2 bg-white dark:bg-zinc-800 rounded-full shadow-lg text-gray-600 dark:text-gray-300 hover:text-red-500 hover:scale-110 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4 flex flex-col flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                          {product.category || 'Uncategorized'}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-400">
                           <Package className="w-3 h-3" />
                           <span>{product.stock} units</span>
                        </div>
                      </div>
                      
                      <h3 className="font-bold text-gray-900 dark:text-white truncate mb-2" title={product.name}>
                        {product.name}
                      </h3>
                      
                      <div className="mt-auto flex items-center justify-between">
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
                           <label className="flex items-center gap-2 cursor-pointer">
                             <input 
                               type="checkbox" 
                               checked={product.stock > 0} 
                               onChange={(e) => toggleStock(product, e)}
                               className="sr-only peer"
                             />
                             <div className="w-9 h-5 bg-gray-200 dark:bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2563EB] relative"></div>
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
                   <thead className="bg-gray-50 dark:bg-zinc-900 border-b border-gray-100 dark:border-gray-800">
                     <tr>
                       <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product</th>
                       <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                       <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock</th>
                       <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                       <th className="px-6 py-4 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                       <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                     {products.map((product) => (
                       <tr 
                         key={product._id} 
                         onClick={() => navigate(`/dashboard/products/edit/${product._id}`)}
                         className="hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer group"
                       >
                         <td className="px-6 py-4">
                           <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0">
                               {product.images?.[0]?.url ? (
                                 <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                               ) : (
                                 <div className="w-full h-full flex items-center justify-center">
                                   <ShoppingBag className="w-5 h-5 text-gray-300" />
                                 </div>
                               )}
                             </div>
                             <div>
                               <p className="font-medium text-gray-900 dark:text-white dark:group-hover:text-[#2563EB] transition-colors">{product.name}</p>
                               <p className="text-xs text-gray-500">SKU: {product.sku || 'N/A'}</p>
                             </div>
                           </div>
                         </td>
                         <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                           {product.category || '-'}
                         </td>
                         <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{product.stock}</span>
                            </div>
                         </td>
                         <td className="px-6 py-4 text-sm font-bold text-gray-900 dark:text-white">
                           {formatCurrency(product.price)}
                         </td>
                         <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                              product.status === 'active' || product.status === 'published' 
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                              : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                            }`}>
                              {product.status === 'active' || product.status === 'published' ? 'Active' : 'Draft'}
                            </span>
                         </td>
                         <td className="px-6 py-4 text-right">
                           <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                             <button
                                onClick={() => navigate(`/product/${product._id}`)}
                                className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all"
                                title="View Product Page"
                             >
                               <Eye className="w-4 h-4" />
                             </button>
                             <button 
                               onClick={() => navigate(`/dashboard/products/edit/${product._id}`)}
                               className="p-2 text-gray-400 hover:text-[#2563EB] hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                             >
                               <Edit className="w-4 h-4" />
                             </button>
                             <button 
                               onClick={() => setDeleteTarget(product)}
                               className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
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