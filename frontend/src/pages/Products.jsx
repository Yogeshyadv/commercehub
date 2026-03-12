import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Plus, Search, MoreVertical, Edit, Trash2,
  Package, AlertCircle, Check, ChevronDown,
  Upload, Eye, X, Filter, ArrowUpDown,
  LayoutGrid, List
} from 'lucide-react';
import { productService } from '../services/productService';
import Loader from '../components/common/Loader';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Badge from '../components/common/Badge';
import Pagination from '../components/common/Pagination';
import { useDebounce } from '../hooks/useDebounce';
import { formatCurrency } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import BulkUploadModal from '../components/products/BulkUploadModal';
import ProductImageSearch from '../components/products/ProductImageSearch';

/* -- Design tokens -------------------------------------------- */
const CARD = 'bg-white dark:bg-[#0d0d0d] rounded-2xl shadow-sm border border-gray-100 dark:border-white/[0.07]';
const DIV  = 'border-gray-100 dark:border-white/[0.07]';

const TABS = [
  { id: 'all',          label: 'All'         },
  { id: 'active',       label: 'Active'      },
  { id: 'draft',        label: 'Draft'       },
  { id: 'low_stock',    label: 'Low stock'   },
  { id: 'out_of_stock', label: 'Out of stock'},
];

const STATUS_BADGE = {
  active:  { label: 'Active',  color: 'green'  },
  draft:   { label: 'Draft',   color: 'gray'   },
  inactive:{ label: 'Inactive',color: 'yellow' },
};

function StockBadge({ stock }) {
  if (stock <= 0)  return <span className="text-[12px] font-bold text-red-600 dark:text-red-400">0 in stock</span>;
  if (stock <= 10) return <span className="text-[12px] font-bold text-amber-600 dark:text-amber-400">{stock} in stock</span>;
  return <span className="text-[12px] text-gray-500 dark:text-[#a0a0c0] font-medium">{stock} in stock</span>;
}

function RowMenu({ product, onEdit, onView, onDelete, open, onToggle }) {
  return (
    <div className="relative" onClick={e => e.stopPropagation()}>
      <button
        onClick={onToggle}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div className={`absolute right-0 top-full mt-1 w-40 z-30 ${CARD} shadow-xl overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150`}>
          <button onClick={onView} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors">
            <Eye className="w-4 h-4 text-gray-400" /> View
          </button>
          <button onClick={onEdit} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors">
            <Edit className="w-4 h-4 text-gray-400" /> Edit
          </button>
          <div className={`h-px mx-2 my-0.5 ${DIV} border-t`} />
          <button onClick={onDelete} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/[0.08] transition-colors">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, onEdit, onView, onDelete }) {
  const statusCfg = STATUS_BADGE[product.status] || STATUS_BADGE.draft;
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`${CARD} group relative flex flex-col h-full hover:border-[#dc2626]/30 transition-all duration-300 cursor-pointer`}
      onClick={() => onView(product._id)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl bg-gray-50/50 dark:bg-white/5 border-b dark:border-white/[0.05]">
        {product.images?.[0]?.url ? (
          <img 
            src={product.images[0].url} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-10 h-10 text-gray-200 dark:text-[#2a2a4a]" />
          </div>
        )}
        
        {/* Badges on Image */}
        <div className="absolute top-2.5 right-2.5">
          <Badge color={statusCfg.color}>{statusCfg.label}</Badge>
        </div>

        {/* Action Overlay */}
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(product._id); }}
            className="p-2 bg-white dark:bg-[#1a1a1a] rounded-xl text-gray-700 dark:text-gray-200 hover:text-[#dc2626] transition-colors"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(product); }}
            className="p-2 bg-white dark:bg-[#1a1a1a] rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-[#dc2626] transition-colors">
              {product.name}
            </h3>
            {product.sku && (
              <p className="text-[10px] font-bold text-gray-400 dark:text-[#5a5a7a] uppercase tracking-wider mt-0.5">
                SKU: {product.sku}
              </p>
            )}
          </div>
        </div>

        <div className="mt-auto pt-3 border-t dark:border-white/[0.05] flex items-center justify-between">
          <div className="flex flex-col">
            <p className="text-sm font-black text-gray-900 dark:text-white">{formatCurrency(product.price)}</p>
            <StockBadge stock={product.stock ?? 0} />
          </div>
          {product.category && (
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-300 uppercase bg-gray-50 dark:bg-white/[0.04] px-2 py-1 rounded-lg">
              {product.category}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Products() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [products,    setProducts]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [pagination,  setPagination]  = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [showBulkUpload, setShowBulkUpload] = useState(false);

  /* Filters */
  const [search,         setSearch]         = useState('');
  const [activeTab,      setActiveTab]      = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [categories,     setCategories]     = useState([]);
  const [viewMode,       setViewMode]       = useState('list'); // 'list' or 'grid'

  /* Selection */
  const [selected, setSelected] = useState(new Set());
  const [activeMenu, setActiveMenu] = useState(null);
  
  /* Image Search */
  const [showImageSearch, setShowImageSearch] = useState(false);

  /* Actions */
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting,     setDeleting]     = useState(false);

  const ds = useDebounce(search, 400);

  const fetchProducts = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = { page, limit: 20 };
      if (ds) params.search = ds;
      if (categoryFilter) params.category = categoryFilter;
      if (activeTab === 'active')       params.status      = 'active';
      if (activeTab === 'draft')        params.status      = 'draft';
      if (activeTab === 'out_of_stock') params.stockStatus = 'out_of_stock';
      if (activeTab === 'low_stock')    params.stockStatus = 'low_stock';
      const r = await productService.getProducts(params);
      setProducts(r.data || []);
      setPagination(r.pagination || { page: 1, limit: 20, total: 0, pages: 0 });
      setSelected(new Set());
    } catch { toast.error('Failed to load products'); }
    finally { setLoading(false); }
  }, [ds, categoryFilter, activeTab]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => {
    productService.getCategories?.()
      .then(r => setCategories(r.data || []))
      .catch(() => setCategories([]));
  }, []);
  useEffect(() => {
    const h = () => setActiveMenu(null);
    document.addEventListener('click', h);
    return () => document.removeEventListener('click', h);
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await productService.deleteProduct(deleteTarget._id);
      toast.success('Product deleted');
      setDeleteTarget(null);
      fetchProducts(pagination.page);
    } catch { toast.error('Failed to delete'); }
    finally { setDeleting(false); }
  };

  const handleBulkDelete = async () => {
    if (!selected.size) return;
    try {
      await Promise.allSettled([...selected].map(id => productService.deleteProduct(id)));
      toast.success(`${selected.size} products deleted`);
      fetchProducts();
    } catch { toast.error('Bulk delete failed'); }
  };

  const toggleAll = () => {
    if (selected.size === products.length) setSelected(new Set());
    else setSelected(new Set(products.map(p => p._id)));
  };

  const toggleOne = (id) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const allChecked = products.length > 0 && selected.size === products.length;
  const someChecked = products.length > 0 && selected.size > 0 && selected.size < products.length;
  const handleImageSelect = (image) => {
    // This could be used to add the selected image to a product's image array
    // For now, we'll just show a success message
    toast.success('Image selected! You can now add this to your product images.');
    setShowImageSearch(false);
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-12 animate-in fade-in duration-500">

      {/* -- Page header ----------------------------------------- */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-4">
        <div>
          <p className="text-[13px] font-bold uppercase tracking-widest text-[#dc2626] mb-1">Catalog</p>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Products</h1>
          <p className="text-sm text-gray-500 dark:text-[#a0a0c0] mt-1">Manage your storefront inventory and catalogs.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setShowImageSearch(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-200
              shadow-sm border border-gray-100 dark:border-white/[0.08]
              bg-white dark:bg-white/[0.04] rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.08] transition-all"
          >
            <Search className="w-4 h-4" /> Search Images
          </button>
          <button
            onClick={() => setShowBulkUpload(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-200
              shadow-sm border border-gray-100 dark:border-white/[0.08]
              bg-white dark:bg-white/[0.04] rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.08] transition-all"
          >
            <Upload className="w-4 h-4" /> Import
          </button>
          <button
            onClick={() => navigate('/dashboard/products/new')}
            className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-[#dc2626] rounded-xl hover:bg-[#b91c1c] transition-all shadow-[0_2px_10px_rgba(220,38,38,0.3)] hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      {/* -- Main card ------------------------------------------- */}
      <div className={`${CARD} overflow-hidden`}>

        {/* Tabs */}
        <div className={`flex items-center gap-2 px-2 border-b ${DIV} bg-gray-50/30 dark:bg-white/[0.01] overflow-x-auto scrollbar-hide`}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSelected(new Set()); }}
              className={`px-4 py-3.5 text-sm font-bold whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-[#dc2626] text-[#dc2626]'
                  : 'border-transparent text-gray-400 dark:text-[#5a5a7a] hover:text-gray-900 dark:hover:text-[#a0a0c0]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filter/Search row */}
        <div className={`flex flex-col md:flex-row md:items-center gap-4 px-5 py-4 border-b ${DIV}`}>
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#4a4a6e]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, SKU or keyword..."
              className="w-full pl-10 pr-10 py-2.5 text-sm font-medium rounded-xl
                border border-gray-100 dark:border-white/[0.08]
                bg-gray-50/50 dark:bg-white/[0.03]
                text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#4a4a6e]
                focus:outline-none focus:ring-4 focus:ring-[#dc2626]/10 focus:border-[#dc2626]/40
                transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 dark:hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {categories.length > 0 && (
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="text-sm font-semibold border border-gray-100 dark:border-white/[0.08] bg-white dark:bg-white/5 text-gray-700 dark:text-gray-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-[#dc2626]/10 cursor-pointer appearance-none pr-10 relative"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280' stroke-width='2'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundPosition: 'right 12px center', backgroundRepeat: 'no-repeat', backgroundSize: '16px' }}
              >
                <option value="">All Categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            )}

            <div className="h-9 w-px bg-gray-100 dark:bg-white/10 hidden md:block" />

            <div className="flex items-center gap-1.5 bg-gray-100/50 dark:bg-white/[0.03] p-1 rounded-xl border border-gray-100 dark:border-white/[0.05]">
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'list' 
                    ? 'bg-white dark:bg-white/10 text-[#dc2626] shadow-sm' 
                    : 'text-gray-400 dark:text-[#5a5a7a] hover:text-gray-900 dark:hover:text-[#a0a0c0]'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid' 
                    ? 'bg-white dark:bg-white/10 text-[#dc2626] shadow-sm' 
                    : 'text-gray-400 dark:text-[#5a5a7a] hover:text-gray-900 dark:hover:text-[#a0a0c0]'
                }`}
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>

            <span className="text-[12px] font-bold text-gray-400 dark:text-[#5a5a7a] whitespace-nowrap uppercase tracking-wider ml-1">
              {pagination.total} Results
            </span>
          </div>
        </div>

        {/* Bulk action bar */}
        {selected.size > 0 && (
          <div className={`flex items-center gap-4 px-5 py-3 border-b ${DIV} bg-[#dc2626]/[0.02] dark:bg-[#dc2626]/[0.05] animate-in slide-in-from-top-2 duration-200`}>
            <span className="text-sm font-bold text-[#dc2626]">
              {selected.size} products selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 px-3 py-1.5 text-[12px] font-black uppercase tracking-wider text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" /> Bulk Delete
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="ml-auto text-xs font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Deselect All
            </button>
          </div>
        )}

        {/* Table / Loading / Empty */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4">
             <Loader text="Loading inventory..." />
          </div>
        ) : products.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center gap-5 text-center px-6">
            <div className="w-20 h-20 bg-gray-50 dark:bg-white/[0.04] rounded-full flex items-center justify-center">
              <Package className="w-10 h-10 text-gray-300 dark:text-[#3a3a5a]" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">Empty inventory</p>
              <p className="text-sm text-gray-400 dark:text-[#6a6a9a] mt-1 max-w-sm">
                {search ? 'Adjust your search filters to find what you are looking for.' : 'No products added yet. Start by creating your first product listing.'}
              </p>
            </div>
            {!search && (
              <button
                onClick={() => navigate('/dashboard/products/new')}
                className="px-6 py-2.5 text-sm font-bold text-white bg-[#dc2626] rounded-xl hover:bg-[#b91c1c] transition-all shadow-md"
              >
                Create Product
              </button>
            )}
          </div>
        ) : viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className={`border-b ${DIV} bg-gray-50/50 dark:bg-white/[0.03]`}>
                  <th className="w-14 px-5 py-4">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      ref={el => { if (el) el.indeterminate = someChecked; }}
                      onChange={toggleAll}
                      className="w-4.5 h-4.5 rounded-lg border-gray-200 dark:border-white/10 text-[#dc2626] focus:ring-[#dc2626]/20 cursor-pointer transition-all"
                    />
                  </th>
                  <th className="px-4 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a]">Product Info</th>
                  <th className="px-4 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a]">Status</th>
                  <th className="px-4 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a]">Inventory</th>
                  <th className="px-4 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a] hidden lg:table-cell">Category</th>
                  <th className="px-4 py-4 text-right text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a]">Price</th>
                  <th className="w-16 pr-5" />
                </tr>
              </thead>
              <tbody className={`divide-y ${DIV}`}>
                {products.map(product => {
                  const isChecked = selected.has(product._id);
                  const statusCfg = STATUS_BADGE[product.status] || STATUS_BADGE.draft;
                  return (
                    <motion.tr
                      key={product._id}
                      className={`group transition-all duration-150
                        ${isChecked ? 'bg-[#dc2626]/[0.03] dark:bg-[#dc2626]/[0.05]' : 'hover:bg-gray-50/50 dark:hover:bg-white/[0.01]'}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={() => navigate(`/dashboard/products/${product._id}`)}
                    >
                      <td className="px-5 py-4" onClick={e => { e.stopPropagation(); toggleOne(product._id); }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4.5 h-4.5 rounded-lg border-gray-200 dark:border-white/10 text-[#dc2626] focus:ring-[#dc2626]/20 cursor-pointer transition-all"
                        />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 overflow-hidden shrink-0">
                            {product.images?.[0]?.url
                              ? <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                              : <div className="w-full h-full flex items-center justify-center"><Package className="w-6 h-6 text-gray-300 dark:text-[#3a3a5a]" /></div>}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-[#dc2626] transition-colors">{product.name}</p>
                            {product.sku && <p className="text-[11px] font-bold text-gray-400 dark:text-[#5a5a7a] mt-0.5 uppercase tracking-wide">#{product.sku}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge color={statusCfg.color}>{statusCfg.label}</Badge>
                      </td>
                      <td className="px-4 py-4">
                        <StockBadge stock={product.stock ?? 0} />
                      </td>
                      <td className="px-4 py-4 hidden lg:table-cell">
                        <span className="text-[13px] font-medium text-gray-500 dark:text-[#8888a8]">{product.category || ''}</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="text-sm font-black text-gray-900 dark:text-white">{formatCurrency(product.price)}</p>
                      </td>
                      <td className="pr-5 py-4">
                        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            <RowMenu
                                product={product}
                                open={activeMenu === product._id}
                                onToggle={() => setActiveMenu(activeMenu === product._id ? null : product._id)}
                                onView={() => navigate(`/dashboard/products/${product._id}`)}
                                onEdit={() => navigate(`/dashboard/products/edit/${product._id}`)}
                                onDelete={() => { setDeleteTarget(product); setActiveMenu(null); }}
                            />
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-5">
            {products.map(product => (
              <ProductCard 
                key={product._id} 
                product={product}
                onView={(id) => navigate(`/dashboard/products/${id}`)}
                onEdit={(id) => navigate(`/dashboard/products/edit/${id}`)}
                onDelete={(p) => setDeleteTarget(p)}
              />
            ))}
          </div>
        )}

        {/* Pagination bar */}
        {pagination.pages > 1 && (
          <div className={`px-6 py-4 border-t ${DIV} bg-gray-50/30 dark:bg-white/[0.01]`}>
            <Pagination
              page={pagination.page}
              totalPages={pagination.pages}
              onPageChange={p => fetchProducts(p)}
              total={pagination.total}
              limit={pagination.limit}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <BulkUploadModal isOpen={showBulkUpload} onClose={() => setShowBulkUpload(false)} onSuccess={() => { setShowBulkUpload(false); fetchProducts(); }} />
      {showImageSearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Search Product Images</h2>
              <button
                onClick={() => setShowImageSearch(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <ProductImageSearch onSelectImage={handleImageSelect} maxResults={20} />
            </div>
          </div>
        </div>
      )}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete Product Listing"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Confirm Delete"
        variant="danger"
      />
    </div>
  );
}