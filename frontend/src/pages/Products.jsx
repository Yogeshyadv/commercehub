import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, MoreVertical, Edit, Trash2,
  Package, AlertCircle, Check, ChevronDown,
  Upload, Eye, X, Filter, ArrowUpDown
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

/* ── Design tokens (Polaris) ─────────────────────────────────── */
const CARD = 'bg-white dark:bg-[#1a1a24] rounded-xl shadow-[0_0_0_1px_rgba(26,26,26,0.13),0_1px_0_0_rgba(26,26,26,0.07)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.10),0_1px_0_0_rgba(0,0,0,0.32)]';
const DIV  = 'border-[#e1e3e5] dark:border-white/[0.08]';

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

/* ── Stock indicator ─────────────────────────────────────────── */
function StockBadge({ stock }) {
  if (stock <= 0)  return <span className="text-xs font-semibold text-red-600 dark:text-red-400">0 in stock</span>;
  if (stock <= 10) return <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">{stock} in stock</span>;
  return <span className="text-xs text-[#6d7175] dark:text-[#9898b8]">{stock} in stock</span>;
}

/* ── Row action menu ─────────────────────────────────────────── */
function RowMenu({ product, onEdit, onView, onDelete, open, onToggle }) {
  return (
    <div className="relative" onClick={e => e.stopPropagation()}>
      <button
        onClick={onToggle}
        className="p-1.5 rounded-lg text-[#6d7175] hover:bg-[#f6f6f7] dark:hover:bg-white/[0.06] hover:text-[#1a1a1a] dark:hover:text-white transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      {open && (
        <div className={`absolute right-0 top-full mt-1 w-40 z-30 ${CARD} overflow-hidden`}>
          <button onClick={onView} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-[#303030] dark:text-[#d4d4d4] hover:bg-[#f6f6f7] dark:hover:bg-white/[0.05] transition-colors">
            <Eye className="w-4 h-4 text-[#6d7175]" /> View
          </button>
          <button onClick={onEdit} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-[#303030] dark:text-[#d4d4d4] hover:bg-[#f6f6f7] dark:hover:bg-white/[0.05] transition-colors">
            <Edit className="w-4 h-4 text-[#6d7175]" /> Edit
          </button>
          <div className={`h-px mx-2 my-0.5 ${DIV} border-t`} />
          <button onClick={onDelete} className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/[0.08] transition-colors">
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
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

  /* Selection */
  const [selected, setSelected] = useState(new Set());
  const [activeMenu, setActiveMenu] = useState(null);

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
  const someChecked = selected.size > 0 && !allChecked;

  return (
    <div className="max-w-[1200px] mx-auto space-y-5 pb-12">

      {/* ── Page header ───────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-1">
        <h1 className="text-[1.375rem] font-bold text-[#1a1a1a] dark:text-[#e3e3e3]">Products</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBulkUpload(true)}
            className={`hidden sm:flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-[#1a1a1a] dark:text-[#d4d4d4]
              shadow-[0_0_0_1px_rgba(26,26,26,0.13),0_1px_0_0_rgba(26,26,26,0.07)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.10)]
              bg-white dark:bg-[#1a1a24] rounded-lg hover:bg-[#f6f6f7] dark:hover:bg-white/[0.06] transition-colors`}
          >
            <Upload className="w-4 h-4" /> Import
          </button>
          <button
            onClick={() => navigate('/dashboard/products/new')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#DC2626] rounded-lg hover:bg-[#b91c1c] transition-colors shadow-[0_1px_0_rgba(0,0,0,0.2)]"
          >
            <Plus className="w-4 h-4" /> Add product
          </button>
        </div>
      </div>

      {/* ── Main card ─────────────────────────────────────────── */}
      <div className={CARD}>

        {/* Tabs */}
        <div className={`flex items-center gap-0 border-b ${DIV} overflow-x-auto scrollbar-hide`}>
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSelected(new Set()); }}
              className={`px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                activeTab === tab.id
                  ? 'border-[#DC2626] text-[#DC2626]'
                  : 'border-transparent text-[#6d7175] dark:text-[#9898b8] hover:text-[#1a1a1a] dark:hover:text-[#e3e3e3]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filter/Search row */}
        <div className={`flex items-center gap-3 px-4 py-3 border-b ${DIV}`}>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d7175]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search products"
              className={`w-full pl-9 pr-9 py-2 text-sm rounded-lg
                border border-[#e1e3e5] dark:border-white/[0.1]
                bg-white dark:bg-[#23233a]
                text-[#1a1a1a] dark:text-[#e3e3e3] placeholder-[#6d7175]
                focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 focus:border-[#DC2626]/40
                transition-all`}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7175] hover:text-[#1a1a1a]">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className={`text-sm border border-[#e1e3e5] dark:border-white/[0.1] bg-white dark:bg-[#23233a] text-[#303030] dark:text-[#d4d4d4] rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 cursor-pointer`}
            >
              <option value="">All categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          )}

          <span className="ml-auto text-xs text-[#6d7175] dark:text-[#9898b8] whitespace-nowrap">
            {pagination.total} product{pagination.total !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Bulk action bar */}
        {selected.size > 0 && (
          <div className={`flex items-center gap-3 px-4 py-2.5 border-b ${DIV} bg-[#f6f6f7] dark:bg-white/[0.03]`}>
            <span className="text-sm font-semibold text-[#1a1a1a] dark:text-[#e3e3e3]">
              {selected.size} selected
            </span>
            <button
              onClick={handleBulkDelete}
              className="ml-2 flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/30 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete selected
            </button>
            <button
              onClick={() => setSelected(new Set())}
              className="ml-auto text-xs text-[#6d7175] hover:text-[#1a1a1a] dark:hover:text-[#e3e3e3] transition-colors"
            >
              Clear
            </button>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="py-20 flex justify-center"><Loader text="Loading products..." /></div>
        ) : products.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 bg-[#f6f6f7] dark:bg-white/[0.05] rounded-full flex items-center justify-center">
              <Package className="w-8 h-8 text-[#c9cccf] dark:text-[#4a4a6a]" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-[#1a1a1a] dark:text-[#e3e3e3]">No products found</p>
              <p className="text-xs text-[#6d7175] dark:text-[#9898b8] mt-0.5">
                {search ? 'Try adjusting your search or filters.' : 'Get started by adding your first product.'}
              </p>
            </div>
            {!search && (
              <button
                onClick={() => navigate('/dashboard/products/new')}
                className="px-4 py-2 text-sm font-semibold text-white bg-[#DC2626] rounded-lg hover:bg-[#b91c1c] transition-colors shadow-[0_1px_0_rgba(0,0,0,0.2)]"
              >
                Add product
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className={`border-b ${DIV} bg-[#fafafa] dark:bg-white/[0.02]`}>
                  <th className="w-10 pl-4 py-3">
                    <input
                      type="checkbox"
                      checked={allChecked}
                      ref={el => { if (el) el.indeterminate = someChecked; }}
                      onChange={toggleAll}
                      className="w-4 h-4 rounded border-[#c9cccf] text-[#DC2626] focus:ring-[#DC2626]/20 cursor-pointer"
                    />
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6d7175] dark:text-[#9898b8] uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6d7175] dark:text-[#9898b8] uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6d7175] dark:text-[#9898b8] uppercase tracking-wider">Inventory</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6d7175] dark:text-[#9898b8] uppercase tracking-wider hidden md:table-cell">Category</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[#6d7175] dark:text-[#9898b8] uppercase tracking-wider">Price</th>
                  <th className="w-12" />
                </tr>
              </thead>
              <tbody className={`divide-y ${DIV}`}>
                {products.map(product => {
                  const isChecked = selected.has(product._id);
                  const statusCfg = STATUS_BADGE[product.status] || STATUS_BADGE.draft;
                  return (
                    <tr
                      key={product._id}
                      className={`group transition-colors cursor-pointer
                        ${isChecked
                          ? 'bg-[#f1f8f5] dark:bg-[#DC2626]/[0.04]'
                          : 'hover:bg-[#f6f6f7] dark:hover:bg-white/[0.02]'}`}
                      onClick={() => navigate(`/dashboard/products/edit/${product._id}`)}
                    >
                      <td className="pl-4 py-3.5" onClick={e => { e.stopPropagation(); toggleOne(product._id); }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {}}
                          className="w-4 h-4 rounded border-[#c9cccf] text-[#DC2626] focus:ring-[#DC2626]/20 cursor-pointer"
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-[#f6f6f7] dark:bg-white/[0.05] overflow-hidden shrink-0">
                            {product.images?.[0]?.url
                              ? <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                              : <div className="w-full h-full flex items-center justify-center"><Package className="w-5 h-5 text-[#c9cccf] dark:text-[#4a4a6a]" /></div>}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#1a1a1a] dark:text-[#e3e3e3] truncate group-hover:text-[#DC2626] transition-colors">{product.name}</p>
                            {product.sku && <p className="text-xs text-[#6d7175] dark:text-[#9898b8] mt-0.5">{product.sku}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <Badge color={statusCfg.color}>{statusCfg.label}</Badge>
                      </td>
                      <td className="px-4 py-3.5">
                        <StockBadge stock={product.stock ?? 0} />
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <span className="text-xs text-[#6d7175] dark:text-[#9898b8]">{product.category || '—'}</span>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <p className="text-sm font-bold text-[#1a1a1a] dark:text-[#e3e3e3]">{formatCurrency(product.price)}</p>
                      </td>
                      <td className="pr-3 py-3.5">
                        <RowMenu
                          product={product}
                          open={activeMenu === product._id}
                          onToggle={() => setActiveMenu(activeMenu === product._id ? null : product._id)}
                          onView={() => navigate(`/product/${product._id}`)}
                          onEdit={() => navigate(`/dashboard/products/edit/${product._id}`)}
                          onDelete={() => { setDeleteTarget(product); setActiveMenu(null); }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className={`px-4 py-3.5 border-t ${DIV} flex items-center justify-between`}>
            <p className="text-xs text-[#6d7175] dark:text-[#9898b8]">
              Showing {((pagination.page - 1) * pagination.limit) + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
            </p>
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={p => fetchProducts(p)}
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <BulkUploadModal isOpen={showBulkUpload} onClose={() => setShowBulkUpload(false)} onSuccess={() => { setShowBulkUpload(false); fetchProducts(); }} />
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete product?"
        message={`"${deleteTarget?.name}" will be permanently removed.`}
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}