import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search, X, Package, MoreHorizontal, AlertTriangle,
  TrendingDown, CheckCircle2, Edit, Eye, ArrowUpDown
} from 'lucide-react';
import { productService } from '../services/productService';
import Loader from '../components/common/Loader';
import Badge from '../components/common/Badge';
import Pagination from '../components/common/Pagination';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useDebounce } from '../hooks/useDebounce';
import { formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';

/* ── Polaris tokens ──────────────────────────────────────────── */
const CARD = 'bg-white dark:bg-[#1a1a24] rounded-xl shadow-[0_0_0_1px_rgba(26,26,26,0.13),0_1px_0_0_rgba(26,26,26,0.07)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.10),0_1px_0_0_rgba(0,0,0,0.32)]';
const DIV  = 'border-[#e1e3e5] dark:border-white/[0.08]';
const SUB  = 'text-[#6d7175] dark:text-[#9898b8]';

const STOCK_TABS = [
  { id: '',          label: 'All'          },
  { id: 'low_stock', label: 'Low stock'    },
  { id: 'out_stock', label: 'Out of stock' },
];

function StockBadge({ qty, threshold = 10 }) {
  if (qty <= 0)          return <Badge color="red">Out of stock</Badge>;
  if (qty <= threshold)  return <Badge color="yellow">Low stock</Badge>;
  return <Badge color="green">In stock</Badge>;
}

/* ── Quick stock editor modal ────────────────────────────────── */
function StockEditor({ product, onClose, onSaved }) {
  const [qty, setQty] = useState(String(product.stock ?? 0));
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const newQty = parseInt(qty, 10);
    if (isNaN(newQty) || newQty < 0) { toast.error('Invalid quantity'); return; }
    setSaving(true);
    try {
      await productService.updateProduct(product._id, { stock: newQty });
      toast.success('Stock updated');
      onSaved?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally { setSaving(false); }
  };

  const adj = delta => setQty(v => String(Math.max(0, (parseInt(v, 10) || 0) + delta)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-sm ${CARD} p-6 z-10`}>
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-bold text-[#1a1a1a] dark:text-[#e3e3e3]">Update stock</p>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#f6f6f7] dark:hover:bg-white/[0.06] transition-colors">
            <X className="w-4 h-4 text-[#6d7175]" />
          </button>
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-10 h-10 bg-[#f6f6f7] dark:bg-white/[0.05] rounded-lg overflow-hidden shrink-0">
            {product.images?.[0]
              ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center"><Package className="w-5 h-5 text-[#c9cccf]" /></div>}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#1a1a1a] dark:text-[#e3e3e3] truncate">{product.name}</p>
            <p className={`text-xs ${SUB}`}>{product.sku || 'No SKU'}</p>
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-xs font-semibold text-[#6d7175] dark:text-[#9898b8] mb-2">Quantity on hand</label>
          <div className="flex items-center gap-2">
            <button onClick={() => adj(-1)} className={`w-9 h-9 flex items-center justify-center rounded-lg border ${DIV} text-[#303030] dark:text-[#d4d4d4] hover:bg-[#f6f6f7] dark:hover:bg-white/[0.06] font-bold text-lg transition-colors`}>−</button>
            <input
              type="number" min="0" value={qty} onChange={e => setQty(e.target.value)}
              className={`flex-1 px-3 py-2 text-center text-sm font-bold border ${DIV} bg-white dark:bg-[#23233a] text-[#1a1a1a] dark:text-[#e3e3e3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20`}
            />
            <button onClick={() => adj(1)} className={`w-9 h-9 flex items-center justify-center rounded-lg border ${DIV} text-[#303030] dark:text-[#d4d4d4] hover:bg-[#f6f6f7] dark:hover:bg-white/[0.06] font-bold text-lg transition-colors`}>+</button>
          </div>
        </div>
        <div className="flex gap-2.5 mt-5">
          <button onClick={onClose} className={`flex-1 py-2 text-sm font-semibold text-[#1a1a1a] dark:text-[#d4d4d4] border ${DIV} rounded-lg hover:bg-[#f6f6f7] dark:hover:bg-white/[0.05] transition-colors`}>Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-2 text-sm font-semibold text-white bg-[#DC2626] rounded-lg hover:bg-[#b91c1c] disabled:opacity-50 transition-colors shadow-[0_1px_0_rgba(0,0,0,0.2)]">
            {saving ? 'Saving…' : 'Update stock'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Row action menu ─────────────────────────────────────────── */
function RowMenu({ onEdit, onDetails }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div ref={ref} className="relative flex justify-end">
      <button onClick={e => { e.stopPropagation(); setOpen(p => !p); }}
        className="p-1.5 rounded-lg text-[#6d7175] hover:bg-[#f6f6f7] dark:hover:bg-white/[0.06] transition-colors">
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <div className={`absolute right-0 top-8 z-20 w-40 ${CARD} py-1`}>
          {[
            { icon: Edit, label: 'Update stock', fn: onEdit   },
            { icon: Eye,  label: 'View details', fn: onDetails },
          ].map(({ icon: Icon, label, fn }) => (
            <button key={label} onClick={e => { e.stopPropagation(); setOpen(false); fn?.(); }}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#303030] dark:text-[#d4d4d4] hover:bg-[#f6f6f7] dark:hover:bg-white/[0.05] transition-colors">
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
export default function Inventory() {
  const [products,    setProducts]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [pg,          setPg]          = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [search,      setSearch]      = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [editTarget,  setEditTarget]  = useState(null);

  const ds = useDebounce(search, 400);

  const fetchProducts = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 20, inventory: true };
      if (stockFilter) params.stockStatus = stockFilter;
      if (ds) params.search = ds;
      const r = await productService.getProducts(params);
      setProducts(r.data?.products || r.data || []);
      setPg(r.data?.pagination || r.pagination || { page: 1, limit: 20, total: 0, pages: 0 });
    } catch { toast.error('Failed to load inventory'); }
    finally { setLoading(false); }
  }, [stockFilter, ds]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const totals = products.reduce((acc, p) => {
    acc.total++;
    if ((p.stock || 0) <= 0) acc.out++;
    else if ((p.stock || 0) <= 10) acc.low++;
    return acc;
  }, { total: 0, low: 0, out: 0 });

  const KPIS = [
    { label: 'Total products', val: pg.total,   icon: Package,       color: 'text-indigo-500'  },
    { label: 'Low stock',      val: totals.low,  icon: TrendingDown,  color: 'text-amber-500'   },
    { label: 'Out of stock',   val: totals.out,  icon: AlertTriangle, color: 'text-red-500'     },
    { label: 'In stock',       val: totals.total - totals.low - totals.out, icon: CheckCircle2, color: 'text-emerald-500' },
  ];

  return (
    <div className="max-w-[1200px] mx-auto space-y-5 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <h1 className="text-[1.375rem] font-bold text-[#1a1a1a] dark:text-[#e3e3e3]">Inventory</h1>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {KPIS.map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className={`${CARD} p-4`}>
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-lg bg-[#f6f6f7] dark:bg-white/[0.05] flex items-center justify-center ${k.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className={`text-xs font-semibold ${SUB}`}>{k.label}</p>
              </div>
              <p className="text-2xl font-black text-[#1a1a1a] dark:text-[#e3e3e3] mt-2.5">{k.val}</p>
            </div>
          );
        })}
      </div>

      {/* Main card */}
      <div className={CARD}>
        {/* Tabs */}
        <div className={`flex gap-0 border-b ${DIV} overflow-x-auto scrollbar-hide`}>
          {STOCK_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setStockFilter(tab.id)}
              className={`px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                stockFilter === tab.id
                  ? 'border-[#DC2626] text-[#DC2626]'
                  : `border-transparent ${SUB} hover:text-[#1a1a1a] dark:hover:text-[#e3e3e3]`
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className={`flex items-center gap-3 px-4 py-3 border-b ${DIV}`}>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d7175]" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products"
              className={`w-full pl-9 pr-9 py-2 text-sm rounded-lg border ${DIV} bg-white dark:bg-[#23233a] text-[#1a1a1a] dark:text-[#e3e3e3] placeholder-[#6d7175] focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 transition-all`}
            />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7175]"><X className="w-3.5 h-3.5" /></button>}
          </div>
          <span className="ml-auto text-xs text-[#6d7175] dark:text-[#9898b8] whitespace-nowrap">{pg.total} item{pg.total !== 1 ? 's' : ''}</span>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-20 flex justify-center"><Loader text="Loading inventory..." /></div>
        ) : products.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-[#f6f6f7] dark:bg-white/[0.05] rounded-full flex items-center justify-center">
              <Package className="w-7 h-7 text-[#c9cccf] dark:text-[#4a4a6a]" />
            </div>
            <p className="text-sm font-semibold text-[#1a1a1a] dark:text-[#e3e3e3]">No products found</p>
            <p className={`text-xs ${SUB}`}>{search || stockFilter ? 'Try changing your filters.' : 'Add products to track inventory.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className={`border-b ${DIV} bg-[#fafafa] dark:bg-white/[0.02]`}>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6d7175] dark:text-[#9898b8] uppercase tracking-wider">Product</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6d7175] dark:text-[#9898b8] uppercase tracking-wider hidden sm:table-cell">SKU</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-[#6d7175] dark:text-[#9898b8] uppercase tracking-wider">
                    <span className="flex items-center justify-center gap-1"><ArrowUpDown className="w-3 h-3" />Stock</span>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6d7175] dark:text-[#9898b8] uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[#6d7175] dark:text-[#9898b8] uppercase tracking-wider hidden md:table-cell">Price</th>
                  <th className="w-12" />
                </tr>
              </thead>
              <tbody className={`divide-y ${DIV}`}>
                {products.map(product => (
                  <tr key={product._id} className="group hover:bg-[#f6f6f7] dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#f6f6f7] dark:bg-white/[0.05] rounded-lg overflow-hidden shrink-0">
                          {product.images?.[0]
                            ? <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center"><Package className="w-5 h-5 text-[#c9cccf]" /></div>}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#1a1a1a] dark:text-[#e3e3e3] truncate max-w-[10rem] sm:max-w-[16rem]">{product.name}</p>
                          <p className={`text-xs ${SUB}`}>{product.category || 'Uncategorized'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 hidden sm:table-cell">
                      <span className={`text-xs font-mono ${SUB}`}>{product.sku || '—'}</span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`text-sm font-black ${(product.stock || 0) <= 0 ? 'text-red-500' : (product.stock || 0) <= 10 ? 'text-amber-500' : 'text-[#1a1a1a] dark:text-[#e3e3e3]'}`}>
                        {product.stock ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-3.5"><StockBadge qty={product.stock ?? 0} /></td>
                    <td className="px-4 py-3.5 text-right hidden md:table-cell">
                      <span className="text-sm font-bold text-[#1a1a1a] dark:text-[#e3e3e3]">{formatCurrency(product.price)}</span>
                    </td>
                    <td className="pr-3">
                      <RowMenu
                        onEdit={() => setEditTarget(product)}
                        onDetails={() => setEditTarget(product)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pg.pages > 1 && (
          <div className={`px-4 py-3.5 border-t ${DIV} flex items-center justify-between`}>
            <p className="text-xs text-[#6d7175] dark:text-[#9898b8]">
              Showing {((pg.page - 1) * pg.limit) + 1}–{Math.min(pg.page * pg.limit, pg.total)} of {pg.total}
            </p>
            <Pagination currentPage={pg.page} totalPages={pg.pages} onPageChange={p => fetchProducts(p)} />
          </div>
        )}
      </div>

      {editTarget && (
        <StockEditor
          product={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={() => fetchProducts(pg.page)}
        />
      )}
    </div>
  );
}