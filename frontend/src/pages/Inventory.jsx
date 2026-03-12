import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search, X, Package, MoreHorizontal, AlertTriangle,
  TrendingDown, CheckCircle2, Edit, Eye, ArrowUpDown,
  MapPin, Calendar, Clock, Plus
} from 'lucide-react';
import { productService } from '../services/productService';
import { inventoryService } from '../services/inventoryService';
import Loader from '../components/common/Loader';
import Badge from '../components/common/Badge';
import Pagination from '../components/common/Pagination';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useDebounce } from '../hooks/useDebounce';
import { formatCurrency, formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

/* -- Design tokens -------------------------------------------- */
const CARD = 'bg-white dark:bg-[#0d0d0d] rounded-2xl shadow-sm border border-gray-100 dark:border-white/[0.07]';
const DIV  = 'border-gray-100 dark:border-white/[0.07]';
const SUB  = 'text-gray-400 dark:text-[#5a5a7a]';

const STOCK_TABS = [
  { id: '',          label: 'Comprehensive' },
  { id: 'low_stock', label: 'Low Reserves'  },
  { id: 'out_stock', label: 'Depleted'      },
];

const VIEW_TABS = [
  { id: 'products',  label: 'Product View'  },
  { id: 'locations', label: 'Location View' },
];

function ExpiryBadge({ expiryDate, expiryStatus }) {
  if (!expiryDate) return null;
  if (expiryStatus === 'expired')
    return <Badge color="red">Expired</Badge>;
  if (expiryStatus === 'expiring_soon')
    return <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-100 dark:border-amber-500/20"><Clock className="w-3 h-3" />Expiring Soon</span>;
  return null;
}

function StockBadge({ qty, threshold = 10 }) {
  if (qty <= 0)          return <Badge color="red">Depleted</Badge>;
  if (qty <= threshold)  return <Badge color="yellow">Critical</Badge>;
  return <Badge color="green">Stocked</Badge>;
}

/* -- Quick stock editor modal ---------------------------------- */
function StockEditor({ product, onClose, onSaved }) {
  const [qty, setQty] = useState(String(product.stock ?? 0));
  const [batch, setBatch] = useState(product.batchNumber || '');
  const [expiry, setExpiry] = useState(product.expiryDate ? product.expiryDate.slice(0, 10) : '');
  const [mfg, setMfg] = useState(product.manufactureDate ? product.manufactureDate.slice(0, 10) : '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const newQty = parseInt(qty, 10);
    if (isNaN(newQty) || newQty < 0) { toast.error('Invalid quantity metrics'); return; }
    setSaving(true);
    try {
      await productService.updateProduct(product._id, {
        stock: newQty,
        batchNumber: batch || undefined,
        expiryDate: expiry || undefined,
        manufactureDate: mfg || undefined,
      });
      toast.success('Inventory metrics synchronized');
      onSaved?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Synchronization failed');
    } finally { setSaving(false); }
  };

  const adj = delta => setQty(v => String(Math.max(0, (parseInt(v, 10) || 0) + delta)));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`relative w-full max-w-sm ${CARD} p-7 z-10 shadow-2xl`}>
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Inventory Adjustment</p>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex items-center gap-3.5 mb-6 p-3 bg-gray-50/50 dark:bg-white/[0.03] rounded-xl border border-gray-100 dark:border-white/[0.05]">
          <div className="w-11 h-11 bg-gray-50 dark:bg-white/[0.03] rounded-xl border border-gray-100 dark:border-white/10 overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-300">
            {product.images?.[0]?.url
              ? <img 
                    src={product.images[0].url} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
              : <div className="w-full h-full flex items-center justify-center"><Package className="w-6 h-6 text-gray-200 dark:text-[#3a3a5a]" /></div>}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{product.name}</p>
            <p className={`text-[11px] font-bold ${SUB} uppercase tracking-tight`}>{product.sku || 'No Reference SKU'}</p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a] mb-2">Quantity Control</label>
            <div className="flex items-center gap-3">
              <button onClick={() => adj(-1)} className={`w-11 h-11 flex items-center justify-center rounded-xl border-2 ${DIV} text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 font-black text-xl transition-all active:scale-95`}>−</button>
              <input
                type="number" min="0" value={qty} onChange={e => setQty(e.target.value)}
                className={`flex-1 h-11 px-4 text-center text-base font-black border-2 ${DIV} bg-white dark:bg-white/[0.02] text-gray-900 dark:text-gray-300 rounded-xl focus:outline-none focus:border-[#dc2626]/40 transition-all`}
              />
              <button onClick={() => adj(1)} className={`w-11 h-11 flex items-center justify-center rounded-xl border-2 ${DIV} text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 font-black text-xl transition-all active:scale-95`}>+</button>
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a] mb-1.5">Batch Assignment</label>
            <input type="text" value={batch} onChange={e => setBatch(e.target.value)} placeholder="e.g. BATCH-2026-X"
              className={`w-full px-4 py-2.5 text-sm font-medium border ${DIV} bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-[#DC2626]/10`} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a] mb-1.5 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> MFG Date</label>
              <input type="date" value={mfg} onChange={e => setMfg(e.target.value)}
                className={`w-full px-3 py-2 text-xs font-bold border ${DIV} bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white rounded-xl focus:outline-none`} />
            </div>
            <div>
              <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a] mb-1.5 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Expiry</label>
              <input type="date" value={expiry} onChange={e => setExpiry(e.target.value)}
                className={`w-full px-3 py-2 text-xs font-bold border ${DIV} bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white rounded-xl focus:outline-none`} />
            </div>
          </div>
        </div>
        <div className="flex gap-3 mt-7">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-bold text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Cancel</button>
          <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 text-sm font-black text-white bg-[#DC2626] rounded-xl hover:bg-[#b91c1c] disabled:opacity-50 transition-all shadow-md active:scale-95">
            {saving ? 'Syncing...' : 'Update Records'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* -- Row action menu ------------------------------------------- */
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
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
        <MoreHorizontal className="w-5 h-5" />
      </button>
      {open && (
        <div className={`absolute right-0 top-full mt-1 z-30 w-44 ${CARD} shadow-xl py-1.5 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150`}>
          {[
            { icon: Edit, label: 'Adjust Reserves', fn: onEdit   },
            { icon: Eye,  label: 'Supply Metrics', fn: onDetails },
          ].map(({ icon: Icon, label, fn }) => (
            <button key={label} onClick={e => { e.stopPropagation(); setOpen(false); fn?.(); }}
              className="flex items-center gap-2.5 w-full px-4 py-2.5 text-[13px] font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/[0.04] transition-colors">
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------
   PAGE
--------------------------------------------------------------- */
export default function Inventory() {
  const [products,    setProducts]    = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [pg,          setPg]          = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [search,      setSearch]      = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [editTarget,  setEditTarget]  = useState(null);
  const [viewTab,     setViewTab]     = useState('products');
  const [invRecords,  setInvRecords]  = useState([]);
  const [invPg,       setInvPg]       = useState({ page: 1, limit: 25, total: 0, pages: 0 });
  const [invLoading,  setInvLoading]  = useState(false);

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
    } catch { toast.error('Inventory intelligence unavailable'); }
    finally { setLoading(false); }
  }, [stockFilter, ds]);

  const fetchInventoryRecords = useCallback(async (page = 1) => {
    setInvLoading(true);
    try {
      const r = await inventoryService.getAllInventory({ page, limit: 25 });
      setInvRecords(r.data?.inventory || r.data || []);
      setInvPg(r.data?.pagination || { page: 1, limit: 25, total: 0, pages: 0 });
    } catch { toast.error('Location data transmission interrupted'); }
    finally { setInvLoading(false); }
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { if (viewTab === 'locations') fetchInventoryRecords(); }, [viewTab, fetchInventoryRecords]);

  const totals = products.reduce((acc, p) => {
    acc.total++;
    if ((p.stock || 0) <= 0) acc.out++;
    else if ((p.stock || 0) <= 10) acc.low++;
    return acc;
  }, { total: 0, low: 0, out: 0 });

  const KPIS = [
    { label: 'Asset Count',    val: pg.total,   icon: Package,       color: 'text-indigo-500'  },
    { label: 'Critical Alert', val: totals.low,  icon: TrendingDown,  color: 'text-amber-500'   },
    { label: 'Out of Supply',  val: totals.out,  icon: AlertTriangle, color: 'text-[#dc2626]'     },
    { label: 'Healthy Stock',  val: totals.total - totals.low - totals.out, icon: CheckCircle2, color: 'text-emerald-500' },
  ];

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-end justify-between pt-4">
        <div>
          <p className="text-[13px] font-bold uppercase tracking-widest text-[#dc2626] mb-1">Global Logistics</p>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Inventory Control</h1>
        </div>
        <div className={`flex items-center gap-1.5 p-1.5 rounded-xl border ${DIV} bg-gray-50/50 dark:bg-white/[0.04]`}>
          {VIEW_TABS.map(t => (
            <button key={t.id} onClick={() => setViewTab(t.id)}
              className={`px-4 py-2 text-[11px] font-black uppercase tracking-wider rounded-lg transition-all ${
                viewTab === t.id ? 'bg-white dark:bg-[#0d0d0d] text-gray-900 dark:text-white shadow-md' : 'text-gray-400 dark:text-[#5a5a7a] hover:text-gray-900 dark:hover:text-[#a0a0c0]'
              }`}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPIS.map(k => {
          const Icon = k.icon;
          return (
            <div key={k.label} className={`${CARD} p-5 group hover:scale-[1.02] transition-all`}>
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl bg-gray-50 dark:bg-white/[0.04] flex items-center justify-center ${k.color}`}>
                  <Icon className="w-4.5 h-4.5" strokeWidth={2.5} />
                </div>
                <p className={`text-[11px] font-black uppercase tracking-widest ${SUB}`}>{k.label}</p>
              </div>
              <p className="text-[28px] font-black text-gray-900 dark:text-white mt-3.5 leading-none">{k.val}</p>
            </div>
          );
        })}
      </div>

      {/* Main card — By Product view */}
      {viewTab === 'products' && <div className={`${CARD} overflow-hidden`}>
        {/* Tabs */}
        <div className={`flex gap-2 px-2 border-b ${DIV} bg-gray-50/30 dark:bg-white/[0.01] overflow-x-auto scrollbar-hide`}>
          {STOCK_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setStockFilter(tab.id)}
              className={`px-4 py-3.5 text-sm font-bold whitespace-nowrap border-b-2 transition-all ${
                stockFilter === tab.id
                  ? 'border-[#DC2626] text-[#DC2626]'
                  : `border-transparent text-gray-400 dark:text-[#5a5a7a] hover:text-gray-900 dark:hover:text-[#a0a0c0]`
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className={`flex items-center gap-4 px-5 py-4 border-b ${DIV}`}>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#4a4a6e]" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Filter by SKU or variant..."
              className="w-full pl-10 pr-10 py-2.5 text-sm font-medium rounded-xl border border-gray-100 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.03] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#4a4a6e] focus:outline-none focus:ring-4 focus:ring-[#DC2626]/10 transition-all"
            />
            {search && <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 dark:hover:text-white"><X className="w-4 h-4" /></button>}
          </div>
          <span className="ml-auto text-xs font-bold text-gray-400 dark:text-[#5a5a7a] uppercase tracking-wider">{pg.total} Total Variants</span>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-24 flex justify-center"><Loader text="Synchronizing metrics..." /></div>
        ) : products.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center gap-5 text-center px-6">
            <div className="w-20 h-20 bg-gray-50 dark:bg-white/[0.04] rounded-full flex items-center justify-center">
              <Package className="w-10 h-10 text-gray-300 dark:text-[#3a3a5a]" />
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">No supply matches found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className={`border-b ${DIV} bg-gray-50/50 dark:bg-white/[0.03]`}>
                  <th className="w-20 pr-5 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a]">Image</th>
                  <th className="px-5 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a]">Asset Details</th>
                  <th className="px-4 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a] hidden sm:table-cell">Global SKU</th>
                  <th className="px-4 py-4 text-center text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a]">Quantity</th>
                  <th className="px-4 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a]">Condition</th>
                  <th className="px-4 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a] hidden lg:table-cell">Logistics Info</th>
                  <th className="px-4 py-4 text-right text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a] hidden md:table-cell">Valuation</th>
                  <th className="w-12 pr-5" />
                </tr>
              </thead>
              <tbody className={`divide-y ${DIV}`}>
                {products.map(product => (
                  <motion.tr 
                    key={product._id} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-all duration-150"
                  >
                    <td className="px-5 py-4">
                      <div className="w-20 h-20 bg-gray-50 dark:bg-white/[0.03] rounded-xl border border-gray-100 dark:border-white/10 overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-300">
                        {product.images?.[0]?.url
              ? <img 
                    src={product.images[0].url} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                          : <div className="w-full h-full flex items-center justify-center"><Package className="w-8 h-8 text-gray-200 dark:text-[#3a3a5a]" /></div>}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[14rem] group-hover:text-[#dc2626] transition-colors">{product.name}</p>
                            <p className={`text-[11px] font-bold ${SUB} uppercase mt-0.5 tracking-tight`}>{product.category || 'Standard'}</p>
                          </div>
                        </div>
                      </td>
                    <td className="px-4 py-4 hidden sm:table-cell">
                      <span className={`text-[11px] font-black font-mono tracking-wider ${SUB}`}>{product.sku || 'N/A'}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`text-[15px] font-black ${(product.stock || 0) <= 0 ? 'text-[#dc2626]' : (product.stock || 0) <= 10 ? 'text-amber-500' : 'text-gray-900 dark:text-white'}`}>
                        {product.stock ?? 0}
                      </span>
                    </td>
                    <td className="px-4 py-4"><StockBadge qty={product.stock ?? 0} /></td>
                    <td className="px-4 py-4 hidden lg:table-cell">
                      <div className="flex flex-col gap-1">
                        {product.batchNumber && <span className="text-[10px] font-bold font-mono text-gray-400 dark:text-[#5a5a7a] uppercase">Lot: {product.batchNumber}</span>}
                        <ExpiryBadge expiryDate={product.expiryDate} expiryStatus={product.expiryStatus} />
                        {product.expiryDate && !product.expiryStatus && <span className="text-[11px] font-bold text-gray-500 dark:text-[#8888a8]">{formatDate(product.expiryDate)}</span>}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right hidden md:table-cell">
                      <span className="text-sm font-black text-gray-900 dark:text-white">{formatCurrency(product.price)}</span>
                    </td>
                    <td className="pr-5 py-4">
                      <RowMenu
                        onEdit={() => setEditTarget(product)}
                        onDetails={() => setEditTarget(product)}
                      />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {pg.pages > 1 && (
          <div className={`px-6 py-4 border-t ${DIV} bg-gray-50/30 dark:bg-white/[0.01]`}>
            <Pagination 
                page={pg.page} 
                totalPages={pg.pages} 
                onPageChange={p => fetchProducts(p)} 
                total={pg.total}
                limit={pg.limit}
            />
          </div>
        )}
      </div>}

      {/* By Location view */}
      {viewTab === 'locations' && (
        <div className={`${CARD} overflow-hidden`}>
          <div className={`px-5 py-4 border-b ${DIV} bg-gray-50/30 dark:bg-white/[0.01] flex items-center justify-between`}>
            <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Storage Distribution</p>
            <span className="text-xs font-bold text-gray-400 dark:text-[#5a5a7a] uppercase tracking-wider">{invPg.total} Active Nodes</span>
          </div>
          {invLoading ? (
            <div className="py-24 flex justify-center"><Loader text="Scanning nodes..." /></div>
          ) : invRecords.length === 0 ? (
            <div className="py-24 flex flex-col items-center justify-center gap-5 text-center px-6">
              <MapPin className="w-10 h-10 text-gray-200 dark:text-[#3a3a5a]" />
              <p className="text-lg font-bold text-gray-900 dark:text-white">Coordinate mapping failed</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px]">
                <thead>
                  <tr className={`border-b ${DIV} bg-gray-50/50 dark:bg-white/[0.01]`}>
                    <th className="px-5 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a]">Target Asset</th>
                    <th className="px-4 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a]">Storage Node</th>
                    <th className="px-4 py-4 text-center text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a]">Capacity</th>
                    <th className="px-4 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a]">Lot Ref</th>
                    <th className="px-4 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a]">Lifecycle</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${DIV}`}>
                  {invRecords.map(rec => (
                    <motion.tr 
                        key={rec._id} 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="group hover:bg-gray-50/50 dark:hover:bg-white/[0.01] transition-all duration-150"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[14rem] group-hover:text-[#dc2626] transition-colors">{rec.product?.name || 'Unknown Asset'}</p>
                        <p className={`text-[10px] font-black font-mono ${SUB} mt-0.5`}>{rec.product?.sku || 'NO-REF'}</p>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-[#dc2626] shrink-0" />
                          <span className="text-[13px] font-bold text-gray-700 dark:text-[#a0a0c8]">{rec.location?.name || 'Primary Storage'}</span>
                          {rec.location?.code && <span className={`text-[11px] font-black font-mono ${SUB}`}>[{rec.location.code}]</span>}
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={`text-[15px] font-black ${
                          (rec.quantity || 0) <= 0 ? 'text-[#dc2626]' : (rec.quantity || 0) <= 10 ? 'text-amber-500' : 'text-gray-900 dark:text-white'
                        }`}>{rec.quantity ?? 0} units</span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`text-[11px] font-black font-mono tracking-widest ${SUB}`}>{rec.batchNumber || '—'}</span>
                      </td>
                      <td className="px-4 py-4">
                        {rec.expiryDate ? (
                          <div className="flex flex-col gap-1">
                            <span className="text-[11px] font-bold text-gray-500 dark:text-[#8888a8]">{formatDate(rec.expiryDate)}</span>
                            <ExpiryBadge expiryDate={rec.expiryDate} expiryStatus={rec.expiryStatus} />
                          </div>
                        ) : <span className={`text-[11px] font-black ${SUB}`}>Perpetual</span>}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {invPg.pages > 1 && (
            <div className={`px-6 py-4 border-t ${DIV} bg-gray-50/30 dark:bg-white/[0.01]`}>
              <Pagination 
                page={invPg.page} 
                totalPages={invPg.pages} 
                onPageChange={p => fetchInventoryRecords(p)} 
                total={invPg.total}
                limit={invPg.limit}
              />
            </div>
          )}
        </div>
      )}

      <AnimatePresence>
        {editTarget && (
          <StockEditor
            product={editTarget}
            onClose={() => setEditTarget(null)}
            onSaved={() => fetchProducts(pg.page)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}