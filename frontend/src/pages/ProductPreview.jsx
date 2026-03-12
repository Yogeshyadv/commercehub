import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Edit, Copy, Archive, Trash2, ChevronLeft, ChevronRight,
  Package, Tag, BarChart2, History, AlertTriangle, CheckCircle2,
  TrendingUp, ShoppingCart, DollarSign, Eye, ZoomIn, X,
  ImageIcon, Star, Layers, RefreshCw
} from 'lucide-react';
import { productService } from '../services/productService';
import { analyticsService } from '../services/analyticsService';
import { formatCurrency, formatDate, formatDateTime, formatNumber } from '../utils/formatters';
import Badge from '../components/common/Badge';
import ConfirmDialog from '../components/common/ConfirmDialog';
import toast from 'react-hot-toast';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

/* ── Design tokens ─────────────────────────────────────────── */
const CARD = 'bg-white dark:bg-[#0d0d0d] rounded-2xl border border-[#e1e3e5] dark:border-white/[0.08] shadow-[0_1px_3px_rgba(0,0,0,0.06)]';
const SUB  = 'text-[#6d7175] dark:text-[#9898b8]';

/* ── Tabs config ─────────────────────────────────────────────── */
const TABS = [
  { id: 'overview',   label: 'Overview',   icon: Eye       },
  { id: 'inventory',  label: 'Inventory',  icon: Layers    },
  { id: 'sales',      label: 'Sales',      icon: BarChart2 },
  { id: 'activity',   label: 'Activity',   icon: History   },
];

/* ── Status config ───────────────────────────────────────────── */
const STATUS = {
  active:   { label: 'Active',   color: 'green'  },
  draft:    { label: 'Draft',    color: 'gray'   },
  inactive: { label: 'Inactive', color: 'yellow' },
  archived: { label: 'Archived', color: 'orange' },
};

/* ── Stat card ───────────────────────────────────────────────── */
function StatBox({ icon: Icon, label, value, sub, color = '#dc2626' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className={`${CARD} p-4 flex items-start gap-3`}
    >
      <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: `${color}18` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6d7175] dark:text-[#9898b8]">{label}</p>
        <p className="text-xl font-bold text-[#1a1a1a] dark:text-[#e8e8f0] leading-tight mt-0.5">{value}</p>
        {sub && <p className={`text-[11px] mt-0.5 ${SUB}`}>{sub}</p>}
      </div>
    </motion.div>
  );
}

/* ── Image lightbox ─────────────────────────────────────────── */
function Lightbox({ src, onClose }) {
  useEffect(() => {
    const h = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [onClose]);
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.img
          src={src}
          alt="Product zoom"
          className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain"
          style={{ maxHeight: '90vh', maxWidth: '90vw' }}
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', damping: 22, stiffness: 280 }}
          onClick={e => e.stopPropagation()}
        />
        <button
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white hover:bg-white/20 transition-colors"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════════════
   OVERVIEW TAB
═══════════════════════════════════════════════════════════════ */
function OverviewTab({ product }) {
  const [mainImg, setMainImg]     = useState(0);
  const [lightbox, setLightbox]   = useState(null);
  const images = product.images || [];
  const hasImages = images.length > 0;

  const prev = () => setMainImg(i => (i - 1 + images.length) % images.length);
  const next = () => setMainImg(i => (i + 1) % images.length);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      {/* ── Image gallery ── */}
      <div className="lg:col-span-3 space-y-3">
        <div className={`${CARD} overflow-hidden relative group`} style={{ aspectRatio: '4/3' }}>
          {hasImages ? (
            <>
              <AnimatePresence mode="wait">
                <motion.img
                  key={mainImg}
                  src={images[mainImg]?.url}
                  alt={product.name}
                  className="w-full h-full object-contain bg-[#f6f6f7] dark:bg-[#0a0a0a]"
                  initial={{ opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </AnimatePresence>
              {/* Navigation arrows */}
              {images.length > 1 && (
                <>
                  <button onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white dark:bg-[#0d0d0d] rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white dark:bg-[#0d0d0d] rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
              {/* Zoom */}
              <button
                onClick={() => setLightbox(images[mainImg]?.url)}
                className="absolute top-3 right-3 w-8 h-8 bg-white/80 dark:bg-[#0d0d0d]/80 backdrop-blur rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:scale-110"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              {/* Counter */}
              {images.length > 1 && (
                <span className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-black/50 text-white backdrop-blur">
                  {mainImg + 1} / {images.length}
                </span>
              )}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-[#f6f6f7] dark:bg-[#0a0a0a]">
              <ImageIcon className="w-14 h-14 text-[#c9cccf]" />
              <p className={`text-sm ${SUB}`}>No images</p>
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {images.map((img, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.92 }}
                onClick={() => setMainImg(i)}
                className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  i === mainImg
                    ? 'border-[#dc2626] shadow-md'
                    : 'border-[#e1e3e5] dark:border-white/[0.08] hover:border-[#c9cccf]'
                }`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* ── Product info ── */}
      <div className="lg:col-span-2 space-y-4">
        {/* Description */}
        <div className={`${CARD} p-5`}>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#6d7175] dark:text-[#9898b8] mb-3">Description</h3>
          <p className="text-sm text-[#303030] dark:text-[#d4d4d4] leading-relaxed">
            {product.description || <span className={SUB}>No description provided.</span>}
          </p>
        </div>

        {/* Pricing */}
        <div className={`${CARD} p-5`}>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#6d7175] dark:text-[#9898b8] mb-3">Pricing</h3>
          <div className="space-y-2.5">
            <div className="flex justify-between items-center">
              <span className={`text-sm ${SUB}`}>Selling price</span>
              <span className="text-base font-bold text-[#1a1a1a] dark:text-[#e8e8f0]">{formatCurrency(product.price)}</span>
            </div>
            {product.compareAtPrice > product.price && (
              <div className="flex justify-between items-center">
                <span className={`text-sm ${SUB}`}>Compare at</span>
                <span className="text-sm line-through text-[#6d7175]">{formatCurrency(product.compareAtPrice)}</span>
              </div>
            )}
            {product.costPrice && (
              <div className="flex justify-between items-center">
                <span className={`text-sm ${SUB}`}>Cost price</span>
                <span className="text-sm text-[#303030] dark:text-[#d4d4d4]">{formatCurrency(product.costPrice)}</span>
              </div>
            )}
            {product.costPrice && product.price && (
              <div className="flex justify-between items-center pt-2 border-t border-[#e1e3e5] dark:border-white/[0.06]">
                <span className={`text-sm ${SUB}`}>Margin</span>
                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                  {(((product.price - product.costPrice) / product.price) * 100).toFixed(1)}%
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Tags / Category */}
        <div className={`${CARD} p-5`}>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#6d7175] dark:text-[#9898b8] mb-3">Details</h3>
          <div className="space-y-2.5">
            {product.sku && (
              <div className="flex justify-between">
                <span className={`text-sm ${SUB}`}>SKU</span>
                <code className="text-xs font-mono bg-[#f6f6f7] dark:bg-white/[0.05] text-[#303030] dark:text-[#d4d4d4] px-2 py-0.5 rounded-md">{product.sku}</code>
              </div>
            )}
            {product.category && (
              <div className="flex justify-between">
                <span className={`text-sm ${SUB}`}>Category</span>
                <span className="text-sm font-medium text-[#303030] dark:text-[#d4d4d4] capitalize">{product.category}</span>
              </div>
            )}
            {product.unit && (
              <div className="flex justify-between">
                <span className={`text-sm ${SUB}`}>Unit</span>
                <span className="text-sm text-[#303030] dark:text-[#d4d4d4]">{product.unit}</span>
              </div>
            )}
            {product.weight && (
              <div className="flex justify-between">
                <span className={`text-sm ${SUB}`}>Weight</span>
                <span className="text-sm text-[#303030] dark:text-[#d4d4d4]">{product.weight}g</span>
              </div>
            )}
          </div>
          {product.tags?.length > 0 && (
            <div className="mt-3 pt-3 border-t border-[#e1e3e5] dark:border-white/[0.06]">
              <p className={`text-xs ${SUB} mb-2`}>Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {product.tags.map(tag => (
                  <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium bg-[#f6f6f7] dark:bg-white/[0.06] text-[#303030] dark:text-[#d4d4d4] border border-[#e1e3e5] dark:border-white/[0.08]">
                    <Tag className="w-3 h-3" />{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Variants */}
        {product.variants?.length > 0 && (
          <div className={`${CARD} p-5`}>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6d7175] dark:text-[#9898b8] mb-3">Variants ({product.variants.length})</h3>
            <div className="space-y-2">
              {product.variants.map((v, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-[#e1e3e5] dark:border-white/[0.06] last:border-0">
                  <span className="text-sm font-medium text-[#303030] dark:text-[#d4d4d4]">{v.name || v.title}</span>
                  <div className="flex items-center gap-2">
                    {v.price && <span className="text-sm font-semibold">{formatCurrency(v.price)}</span>}
                    <span className={`text-xs ${SUB}`}>{v.stock ?? 0} left</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   INVENTORY TAB
═══════════════════════════════════════════════════════════════ */
function InventoryTab({ product }) {
  const stock = product.stock ?? 0;
  const isLow = stock > 0 && stock <= 10;
  const isOut = stock <= 0;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatBox icon={Layers}       label="Current stock"  value={stock}                       sub="units available"   color="#3b82f6" />
        <StatBox icon={AlertTriangle} label="Low stock at"  value={product.lowStockThreshold ?? 10} sub="units threshold" color="#f59e0b" />
        <StatBox icon={CheckCircle2} label="Status"         value={isOut ? 'Out of stock' : isLow ? 'Low stock' : 'In stock'}  color={isOut ? '#dc2626' : isLow ? '#f59e0b' : '#16a34a'} />
      </div>

      <div className={`${CARD} p-5`}>
        <h3 className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: '#6d7175' }}>Stock level</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-xs mb-1.5">
              <span className={SUB}>Stock</span>
              <span className="font-semibold text-[#303030] dark:text-[#d4d4d4]">{stock} units</span>
            </div>
            <div className="h-3 bg-[#f6f6f7] dark:bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: isOut ? '#dc2626' : isLow ? '#f59e0b' : '#16a34a' }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((stock / Math.max(stock + 50, 100)) * 100, 100)}%` }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'SKU',      value: product.sku || 'N/A' },
            { label: 'Barcode',  value: product.barcode || 'N/A' },
            { label: 'Location', value: product.location || 'Default' },
            { label: 'Tracked',  value: product.trackInventory !== false ? 'Yes' : 'No' },
          ].map(({ label, value }) => (
            <div key={label} className="p-3 bg-[#f6f6f7] dark:bg-white/[0.04] rounded-xl">
              <p className="text-[11px] text-[#6d7175]">{label}</p>
              <p className="text-sm font-semibold text-[#1a1a1a] dark:text-[#e8e8f0] mt-0.5">{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   SALES TAB
═══════════════════════════════════════════════════════════════ */
function SalesTab({ product }) {
  const [salesData] = useState(() =>
    Array.from({ length: 12 }, (_, i) => ({
      month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
      revenue: Math.floor(Math.random() * 8000 + 1000),
      units:   Math.floor(Math.random() * 60 + 5),
    }))
  );

  const totalRevenue = salesData.reduce((s, d) => s + d.revenue, 0);
  const totalUnits   = salesData.reduce((s, d) => s + d.units,   0);
  const avgOrderVal  = totalUnits ? totalRevenue / totalUnits : 0;

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatBox icon={DollarSign}  label="Total revenue" value={formatCurrency(totalRevenue)} sub="all time" color="#dc2626" />
        <StatBox icon={ShoppingCart} label="Units sold"   value={formatNumber(totalUnits)}     sub="all time" color="#3b82f6" />
        <StatBox icon={TrendingUp}  label="Avg order val" value={formatCurrency(avgOrderVal)}  sub="per unit" color="#16a34a" />
      </div>

      <div className={`${CARD} p-5`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#6d7175] dark:text-[#9898b8]">Revenue — last 12 months</h3>
          <span className="text-xs text-[#6d7175]">Chart data is sample</span>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={salesData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#dc2626" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#dc2626" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9898b8' }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              contentStyle={{ background: 'var(--surface-0)', border: '1px solid var(--border)', borderRadius: 10, fontSize: 12 }}
              formatter={(v) => [formatCurrency(v), 'Revenue']}
            />
            <Area type="monotone" dataKey="revenue" stroke="#dc2626" strokeWidth={2} fill="url(#salesGrad)" dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   ACTIVITY TAB
═══════════════════════════════════════════════════════════════ */
function ActivityTab({ product }) {
  const events = [
    { icon: Package,    label: 'Product created',        time: product.createdAt, color: '#3b82f6'  },
    { icon: Edit,       label: 'Details updated',        time: product.updatedAt, color: '#f59e0b'  },
    { icon: CheckCircle2, label: 'Status set to active', time: product.updatedAt, color: '#16a34a' },
  ].filter(e => e.time);

  return (
    <div className={`${CARD} p-5`}>
      <h3 className="text-xs font-bold uppercase tracking-wider text-[#6d7175] dark:text-[#9898b8] mb-4">Activity timeline</h3>
      {events.length ? (
        <div className="relative pl-6">
          <div className="absolute left-2.5 top-0 bottom-0 w-px bg-[#e1e3e5] dark:bg-white/[0.08]" />
          <div className="space-y-5">
            {events.map((e, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: 0.2 }}
                className="relative flex items-start gap-3"
              >
                <div className="absolute -left-[18px] w-5 h-5 rounded-full flex items-center justify-center"
                  style={{ background: `${e.color}20`, border: `1.5px solid ${e.color}` }}>
                  <e.icon className="w-2.5 h-2.5" style={{ color: e.color }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1a1a1a] dark:text-[#e8e8f0]">{e.label}</p>
                  <p className={`text-xs ${SUB} mt-0.5`}>{formatDateTime(e.time)}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <p className={`text-sm ${SUB}`}>No activity recorded yet.</p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
export default function ProductPreview() {
  const { productId } = useParams();
  const navigate      = useNavigate();

  const [product,     setProduct]     = useState(null);
  const [loading,     setLoading]     = useState(true);
  const [activeTab,   setActiveTab]   = useState('overview');
  const [delConfirm,  setDelConfirm]  = useState(false);
  const [archConfirm, setArchConfirm] = useState(false);

  /* ── Fetch product ───────────────────────────────────────── */
  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await productService.getProduct(productId);
      setProduct(res.data || res);
    } catch {
      toast.error('Product not found');
      navigate('/dashboard/products');
    } finally {
      setLoading(false);
    }
  }, [productId, navigate]);

  useEffect(() => { load(); }, [load]);

  /* ── Actions ─────────────────────────────────────────────── */
  const handleDelete = async () => {
    try {
      await productService.deleteProduct(productId);
      toast.success('Product deleted');
      navigate('/dashboard/products');
    } catch {
      toast.error('Failed to delete product');
    }
  };

  const handleDuplicate = async () => {
    try {
      const { _id, createdAt, updatedAt, ...rest } = product;
      await productService.createProduct({ ...rest, name: `${product.name} (Copy)`, status: 'draft' });
      toast.success('Product duplicated as draft');
    } catch {
      toast.error('Failed to duplicate product');
    }
  };

  /* ── Loading skeleton ────────────────────────────────────── */
  if (loading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-8 w-40 skeleton rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3 skeleton rounded-2xl" style={{ aspectRatio: '4/3' }} />
          <div className="lg:col-span-2 space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-28 skeleton rounded-2xl" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const status = STATUS[product.status] || STATUS.draft;
  const stock  = product.stock ?? 0;

  return (
    <div className="space-y-5 max-w-[1200px]">

      {/* ── Breadcrumb + header ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-3">
        {/* Back + breadcrumb */}
        <div className="flex-1 min-w-0">
          <Link
            to="/dashboard/products"
            className="inline-flex items-center gap-1.5 text-sm text-[#6d7175] hover:text-[#1a1a1a] dark:hover:text-white transition-colors mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Products
          </Link>
          <h1 className="text-2xl font-bold text-[#1a1a1a] dark:text-[#e8e8f0] truncate">{product.name}</h1>
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <Badge color={status.color}>{status.label}</Badge>
            {stock <= 0
              ? <span className="text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Out of stock</span>
              : stock <= 10
              ? <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Low stock ({stock})</span>
              : <span className="text-xs text-[#6d7175]">{stock} in stock</span>
            }
            <span className="text-xs text-[#6d7175]">·</span>
            <span className="text-xs text-[#6d7175]">Added {formatDate(product.createdAt)}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={handleDuplicate}
            title="Duplicate"
            className="p-2.5 rounded-xl border border-[#e1e3e5] dark:border-white/[0.08] bg-white dark:bg-[#0d0d0d] text-[#6d7175] hover:text-[#1a1a1a] dark:hover:text-white hover:shadow-md transition-all"
          >
            <Copy className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setArchConfirm(true)}
            title="Archive"
            className="p-2.5 rounded-xl border border-[#e1e3e5] dark:border-white/[0.08] bg-white dark:bg-[#0d0d0d] text-[#6d7175] hover:text-[#1a1a1a] dark:hover:text-white hover:shadow-md transition-all"
          >
            <Archive className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setDelConfirm(true)}
            title="Delete"
            className="p-2.5 rounded-xl border border-red-200 dark:border-red-900/40 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 hover:shadow-md transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(`/dashboard/products/edit/${productId}`)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#dc2626] text-white text-sm font-semibold hover:bg-[#b91c1c] shadow-[0_1px_3px_rgba(220,38,38,0.3)] transition-all"
          >
            <Edit className="w-4 h-4" /> Edit
          </motion.button>
        </div>
      </div>

      {/* ── Quick stats ─────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatBox icon={DollarSign}  label="Price"       value={formatCurrency(product.price)} color="#dc2626" />
        <StatBox icon={Layers}      label="Stock"        value={stock}                         color="#3b82f6" />
        <StatBox icon={Star}        label="Rating"       value={product.avgRating ? product.avgRating.toFixed(1) : 'N/A'} color="#f59e0b" />
        <StatBox icon={RefreshCw}   label="Last updated" value={formatDate(product.updatedAt)} color="#8b5cf6" />
      </div>

      {/* ── Tabs ────────────────────────────────────────────── */}
      <div className="flex gap-1 p-1 bg-[#f6f6f7] dark:bg-[#0a0a0a] rounded-xl w-fit border border-[#e1e3e5] dark:border-white/[0.08]">
        {TABS.map(tab => (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-[#0d0d0d] text-[#1a1a1a] dark:text-[#e8e8f0] shadow-sm'
                : 'text-[#6d7175] hover:text-[#1a1a1a] dark:hover:text-[#e8e8f0]'
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* ── Tab content ─────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.18 }}
        >
          {activeTab === 'overview'  && <OverviewTab  product={product} />}
          {activeTab === 'inventory' && <InventoryTab product={product} />}
          {activeTab === 'sales'     && <SalesTab     product={product} />}
          {activeTab === 'activity'  && <ActivityTab  product={product} />}
        </motion.div>
      </AnimatePresence>

      {/* ── Confirm dialogs ─────────────────────────────────── */}
      <ConfirmDialog
        isOpen={delConfirm}
        onClose={() => setDelConfirm(false)}
        onConfirm={handleDelete}
        title="Delete product"
        message={`Are you sure you want to permanently delete "${product.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        confirmColor="red"
      />
      <ConfirmDialog
        isOpen={archConfirm}
        onClose={() => setArchConfirm(false)}
        onConfirm={async () => {
          try {
            await productService.updateProduct(productId, { status: 'inactive' });
            toast.success('Product archived');
            setArchConfirm(false);
            load();
          } catch { toast.error('Failed to archive'); }
        }}
        title="Archive product"
        message={`Archive "${product.name}"? It will be hidden from your store but not deleted.`}
        confirmLabel="Archive"
        confirmColor="orange"
      />
    </div>
  );
}
