import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag, Users, IndianRupee, Package, Clock, Plus,
  ArrowUpRight, ArrowDownRight, ChevronRight, ChevronDown,
  ExternalLink, AlertCircle, Sparkles, Activity, BookOpen,
  BarChart2, ShoppingCart, TrendingUp, Store
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts';
import Loader from '../components/common/Loader';
import Badge from '../components/common/Badge';
import { analyticsService } from '../services/analyticsService';
import { orderService } from '../services/orderService';
import { aiService } from '../services/aiService';
import { formatCurrency, formatNumber, formatRelativeTime } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useSocket } from '../context/SocketContext';
import toast from 'react-hot-toast';

/* ─────────────────────────────────────────────────────────────────
   EXACT SHOPIFY POLARIS TOKENS
   Card shadow (no border CSS — shadow creates the outline):
     light: 0 0 0 1px rgba(26,26,26,.13), 0 1px 0 0 rgba(26,26,26,.07)
     dark:  0 0 0 1px rgba(255,255,255,.12), 0 1px 0 0 rgba(0,0,0,.32)
   Radius: 12px  ·  Page bg: #f6f6f7  ·  Text: #1a1a1a
   Subdued: #6d7175  ·  Border divider: #e1e3e5
───────────────────────────────────────────────────────────────── */
const CARD = [
  'bg-white dark:bg-[#1a1a24]',
  'rounded-xl',
  'shadow-[0_0_0_1px_rgba(26,26,26,0.13),0_1px_0_0_rgba(26,26,26,0.07)]',
  'dark:shadow-[0_0_0_1px_rgba(255,255,255,0.10),0_1px_0_0_rgba(0,0,0,0.32)]',
].join(' ');

const DIVIDER = 'border-[#e1e3e5] dark:border-white/[0.08]';
const H1      = 'text-[1.375rem] font-bold leading-snug text-[#1a1a1a] dark:text-[#e3e3e3]';
const SUBDUED = 'text-[#6d7175] dark:text-[#9898b8]';

const STATUS_COLOR = {
  pending: 'yellow', confirmed: 'blue', processing: 'indigo',
  shipped: 'purple', delivered: 'green', cancelled: 'red', refunded: 'gray',
};

const PERIOD_OPTS = [
  { v: '1d',  l: 'Today'        },
  { v: '7d',  l: 'Last 7 days'  },
  { v: '30d', l: 'Last 30 days' },
  { v: '90d', l: 'Last 90 days' },
  { v: '1y',  l: 'This year'    },
];

const MANAGE_LINKS = [
  { icon: Package,     label: 'Products',  sub: 'Manage your catalog',    to: '/dashboard/products'  },
  { icon: Users,       label: 'Customers', sub: 'View customer list',     to: '/dashboard/customers' },
  { icon: ShoppingBag, label: 'Orders',    sub: 'Manage and fulfill',     to: '/dashboard/orders'    },
  { icon: BarChart2,   label: 'Analytics', sub: 'Reports and insights',   to: '/dashboard/analytics' },
  { icon: BookOpen,    label: 'Catalogs',  sub: 'Manage catalogs',        to: '/dashboard/catalogs'  },
  { icon: Package,     label: 'Inventory', sub: 'Stock management',       to: '/dashboard/inventory' },
];

/* ── Period dropdown ─────────────────────────────────────────── */
function PeriodPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const label = PERIOD_OPTS.find(o => o.v === value)?.l || 'Today';

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(p => !p)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-[#303030] dark:text-[#d4d4d4]
          bg-white dark:bg-[#23233a]
          shadow-[0_0_0_1px_rgba(26,26,26,0.13),0_1px_0_0_rgba(26,26,26,0.07)]
          dark:shadow-[0_0_0_1px_rgba(255,255,255,0.10)]
          rounded-lg hover:bg-[#f6f6f7] dark:hover:bg-white/[0.06] transition-colors"
      >
        {label}
        <ChevronDown className="w-4 h-4 text-[#6d7175]" />
      </button>
      {open && (
        <div className={`absolute right-0 top-full mt-1 w-40 z-20 ${CARD} overflow-hidden`}>
          {PERIOD_OPTS.map(o => (
            <button
              key={o.v}
              onClick={() => { onChange(o.v); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                o.v === value
                  ? 'bg-[#f1f8f5] dark:bg-[#DC2626]/10 text-[#DC2626] font-semibold'
                  : 'text-[#303030] dark:text-[#d4d4d4] hover:bg-[#f6f6f7] dark:hover:bg-white/[0.05]'
              }`}
            >
              {o.l}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Mini metric cell (bottom of performance card) ──────────── */
function MiniMetric({ label, value, change, icon: Icon }) {
  const isUp = change >= 0;
  return (
    <div className="flex-1 px-5 py-4 min-w-0">
      <p className={`text-xs ${SUBDUED} mb-1.5`}>{label}</p>
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-[0.9375rem] font-bold text-[#1a1a1a] dark:text-[#e3e3e3]">{value}</span>
        {change !== undefined && (
          <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold rounded-md px-1.5 py-0.5 ${
            isUp
              ? 'bg-[#f1f8f5] dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
              : 'bg-[#fff4f4] dark:bg-red-500/10 text-red-600 dark:text-red-400'
          }`}>
            {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Chart tooltip (Shopify style) ──────────────────────────── */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#1a1a1a] dark:bg-[#0d0d0d] text-white rounded-xl px-3.5 py-2.5 text-xs shadow-xl">
      <p className={`${SUBDUED} mb-0.5 text-[10px]`}>{label}</p>
      <p className="font-bold text-white text-sm">{formatCurrency(payload[0]?.value || 0)}</p>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════════════ */
export default function Dashboard() {
  const [stats, setStats]               = useState(null);
  const [salesData, setSalesData]       = useState([]);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [products, setProducts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [period, setPeriod]             = useState('30d');
  const [periodLoading, setPeriodLoading] = useState(false);
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const socket      = useSocket();
  const { addItem } = useCart();
  const isVendor    = user?.role === 'vendor' || user?.role === 'vendor_staff' || user?.role === 'super_admin';

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  };

  useEffect(() => {
    if (socket && isVendor) {
      socket.on('new_order', () => {
        setStats(prev =>
          prev ? { ...prev, overview: { ...prev.overview, totalOrders: (prev.overview?.totalOrders || 0) + 1 } } : prev
        );
      });
      return () => { socket.off('new_order'); };
    }
  }, [socket, isVendor]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (isVendor) {
          const [d, a] = await Promise.allSettled([
            analyticsService.getDashboardStats(),
            analyticsService.getSalesAnalytics({ period: '30d' }),
          ]);
          if (d.status === 'fulfilled') setStats(d.value.data);
          if (a.status === 'fulfilled') setSalesData(a.value.data?.salesData || []);
        } else {
          const [ordersRes, productsRes] = await Promise.allSettled([
            orderService.getMyOrders(),
            aiService.getRecommendations(),
          ]);
          if (ordersRes.status === 'fulfilled') setCustomerOrders(ordersRes.value.data || []);
          if (productsRes.status === 'fulfilled') setProducts(productsRes.value.data || []);
        }
      } catch {
        toast.error('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isVendor]);

  const handlePeriodChange = async (v) => {
    setPeriod(v);
    setPeriodLoading(true);
    try {
      const r = await analyticsService.getSalesAnalytics({ period: v });
      setSalesData(r.data?.salesData || []);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setPeriodLoading(false);
    }
  };

  if (loading) return <Loader text="Loading dashboard..." />;

  /* ═══════════════════════════════════════════════════════════════
     CUSTOMER DASHBOARD
  ═══════════════════════════════════════════════════════════════ */
  if (!isVendor) {
    const totalSpent   = customerOrders.reduce((s, o) => s + (o.total || 0), 0);
    const pendingCount = customerOrders.filter(o => ['pending', 'confirmed'].includes(o.status)).length;

    return (
      <div className="max-w-[960px] mx-auto space-y-5 pb-12">

        {/* Header */}
        <div className="flex items-center justify-between pt-2 pb-1">
          <div>
            <h1 className={H1}>{greeting()}, {user?.firstName}!</h1>
            <p className={`text-sm mt-0.5 ${SUBDUED}`}>Track your orders and discover products.</p>
          </div>
          <Link to="/store" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-[#DC2626] rounded-lg hover:bg-[#b91c1c] transition-colors shadow-[0_1px_0_rgba(0,0,0,0.2)]">
            <Store className="w-4 h-4" /> View store
          </Link>
        </div>

        {/* Performance card */}
        <div className={CARD}>
          {/* Metric header */}
          <div className="px-5 pt-5 pb-0">
            <div className="flex items-start justify-between mb-1">
              <p className={`text-sm ${SUBDUED}`}>Total spent</p>
            </div>
            <p className="text-[2rem] font-bold tracking-tight text-[#1a1a1a] dark:text-[#e3e3e3] font-[feature-settings:'tnum']">
              {formatCurrency(totalSpent)}
            </p>
          </div>
          {/* Divider + mini metrics */}
          <div className={`mt-5 flex divide-x ${DIVIDER} border-t ${DIVIDER}`}>
            <MiniMetric label="Total orders"   value={String(customerOrders.length)} />
            <MiniMetric label="Pending orders" value={String(pendingCount)} />
            <MiniMetric label="Delivered"      value={String(customerOrders.filter(o => o.status === 'delivered').length)} />
          </div>
        </div>

        {/* Recent orders */}
        <div className={CARD}>
          <div className={`flex items-center justify-between px-5 py-4 border-b ${DIVIDER}`}>
            <h2 className="text-sm font-semibold text-[#1a1a1a] dark:text-[#e3e3e3]">Recent orders</h2>
            <Link to="/my-orders" className="text-xs font-semibold text-[#DC2626] hover:underline">View all</Link>
          </div>
          {customerOrders.length > 0 ? (
            <div className={`divide-y ${DIVIDER}`}>
              {customerOrders.slice(0, 6).map(order => (
                <div key={order._id} className="flex items-center justify-between px-5 py-4 hover:bg-[#f6f6f7] dark:hover:bg-white/[0.03] transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 bg-[#f6f6f7] dark:bg-white/[0.06] rounded-lg flex items-center justify-center shrink-0 text-xs font-bold text-[#6d7175]">
                      #{order._id.slice(-4)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1a1a1a] dark:text-[#e3e3e3] truncate">Order #{order._id.slice(-8)}</p>
                      <p className={`text-xs ${SUBDUED} mt-0.5`}>{new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })} · {order.items?.length ?? 0} items</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <p className="text-sm font-bold text-[#1a1a1a] dark:text-[#e3e3e3]">{formatCurrency(order.total)}</p>
                    <Badge color={STATUS_COLOR[order.status] || 'gray'}>{order.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 flex flex-col items-center justify-center gap-3 text-center">
              <div className="w-14 h-14 bg-[#f6f6f7] dark:bg-white/[0.05] rounded-full flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-[#b5b5b5] dark:text-[#5a5a7a]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#1a1a1a] dark:text-[#e3e3e3]">No orders yet</p>
                <p className={`text-xs ${SUBDUED} mt-0.5`}>When you place an order, it will show here.</p>
              </div>
              <Link to="/store" className="mt-1 px-4 py-2 text-sm font-semibold text-white bg-[#DC2626] rounded-lg hover:bg-[#b91c1c] transition-colors shadow-[0_1px_0_rgba(0,0,0,0.2)]">
                Browse products
              </Link>
            </div>
          )}
        </div>

        {/* Recommended products */}
        {products.length > 0 && (
          <div className={CARD}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${DIVIDER}`}>
              <h2 className="text-sm font-semibold text-[#1a1a1a] dark:text-[#e3e3e3] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#DC2626]" /> Recommended for you
              </h2>
              <Link to="/store" className="text-xs font-semibold text-[#DC2626] hover:underline">View all</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-0">
              {products.slice(0, 4).map((product, i) => (
                <div key={product._id} className={`group p-4 ${i < 3 ? `border-r ${DIVIDER}` : ''}`}>
                  <Link to={`/product/${product._id}`} className="block aspect-square bg-[#f6f6f7] dark:bg-white/[0.04] rounded-lg overflow-hidden mb-3">
                    {product.images?.[0]?.url
                      ? <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      : <div className="w-full h-full flex items-center justify-center"><Package className="w-8 h-8 text-[#c9cccf] dark:text-[#4a4a6a]" /></div>}
                  </Link>
                  <p className="text-xs font-semibold text-[#1a1a1a] dark:text-[#e3e3e3] truncate mb-0.5">{product.name}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-[#1a1a1a] dark:text-[#e3e3e3]">{formatCurrency(product.price)}</p>
                    <button onClick={() => { addItem(product, 1); toast.success('Added!'); }} className="p-1.5 rounded-lg bg-[#f6f6f7] dark:bg-white/[0.06] hover:bg-[#DC2626] hover:text-white text-[#6d7175] transition-all">
                      <ShoppingCart className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════════
     VENDOR DASHBOARD  —  Shopify Admin exact replica
  ═══════════════════════════════════════════════════════════════ */
  const o               = stats?.overview       || {};
  const recentOrders    = stats?.recentOrders   || [];
  const lowStock        = stats?.lowStockProducts || [];

  /* Mini-metric change values */
  const avgOrderValue   = o.totalOrders > 0 ? Math.round((o.totalRevenue || 0) / o.totalOrders) : 0;
  const convRate        = o.totalCustomers > 0 ? Number(((o.totalOrders || 0) / (o.totalCustomers || 1) * 100).toFixed(1)) : 0;

  /* Chart data – normalise for display */
  const chartData = salesData.map(d => ({
    date:    d._id,
    revenue: d.revenue || 0,
    orders:  d.orders  || 0,
  }));

  const AXIS_TICK = { fontSize: 11, fill: '#9ca3af' };

  return (
    <div className="max-w-[960px] mx-auto space-y-5 pb-12">

      {/* ── Page header ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between pt-2 pb-1">
        <h1 className={H1}>Home</h1>
        <div className="flex items-center gap-2">
          {lowStock.length > 0 && (
            <Link
              to="/dashboard/inventory"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 rounded-lg"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              {lowStock.length} low stock
            </Link>
          )}
          <Link
            to="/store"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-[#1a1a1a] dark:text-[#e3e3e3]
              shadow-[0_0_0_1px_rgba(26,26,26,0.13),0_1px_0_0_rgba(26,26,26,0.07)]
              dark:shadow-[0_0_0_1px_rgba(255,255,255,0.10)]
              bg-white dark:bg-[#1a1a24] rounded-lg hover:bg-[#f6f6f7] dark:hover:bg-white/[0.06] transition-colors"
          >
            View your store <ExternalLink className="w-3.5 h-3.5 text-[#6d7175]" />
          </Link>
        </div>
      </div>

      {/* ── Performance card ("Today" equivalent) ───────────────── */}
      <div className={CARD}>
        {/* Header: metric label + period picker */}
        <div className="px-5 pt-5 pb-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className={`text-sm ${SUBDUED} mb-1`}>Total sales</p>
              <div className="flex items-baseline gap-3">
                <p className="text-[2.25rem] font-bold tracking-tight text-[#1a1a1a] dark:text-[#e3e3e3] leading-none">
                  {formatCurrency(o.totalRevenue || 0)}
                </p>
                {o.revenueGrowth !== undefined && (
                  <span className={`inline-flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-md ${
                    o.revenueGrowth >= 0
                      ? 'bg-[#f1f8f5] dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                      : 'bg-[#fff4f4] dark:bg-red-500/10 text-red-600 dark:text-red-400'
                  }`}>
                    {o.revenueGrowth >= 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                    {Math.abs(o.revenueGrowth)}%
                  </span>
                )}
              </div>
              <p className={`text-xs ${SUBDUED} mt-1`}>{formatCurrency(o.monthlyRevenue || 0)} this month</p>
            </div>
            <PeriodPicker value={period} onChange={handlePeriodChange} />
          </div>
        </div>

        {/* Chart */}
        <div className="h-[180px] mt-5 px-1">
          {periodLoading ? (
            <div className="h-full flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#DC2626] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="polarisFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#DC2626" stopOpacity={0.12} />
                    <stop offset="100%" stopColor="#DC2626" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="0" stroke="#f0f0f0" className="dark:stroke-white/[0.04]" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={AXIS_TICK} dy={8}
                  tickFormatter={v => { const d = new Date(v); return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`; }} />
                <YAxis axisLine={false} tickLine={false} tick={AXIS_TICK}
                  tickFormatter={v => `₹${v >= 1000 ? Math.round(v / 1000) + 'k' : v}`} />
                <Tooltip content={<ChartTooltip />} cursor={{ stroke: '#DC2626', strokeWidth: 1, strokeDasharray: '4 4' }} />
                <Area type="monotone" dataKey="revenue" stroke="#DC2626" strokeWidth={2}
                  fill="url(#polarisFill)" dot={false}
                  activeDot={{ r: 4, stroke: '#DC2626', strokeWidth: 2, fill: 'white' }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-2">
              <TrendingUp className="w-8 h-8 text-[#c9cccf] dark:text-[#4a4a6a]" />
              <p className={`text-sm ${SUBDUED}`}>No sales data for this period</p>
            </div>
          )}
        </div>

        {/* Mini-metrics footer row */}
        <div className={`flex divide-x ${DIVIDER} border-t ${DIVIDER} mt-2`}>
          <MiniMetric
            label="Orders"
            value={formatNumber(o.totalOrders || 0)}
            change={o.orderGrowth}
          />
          <MiniMetric
            label="Sessions"
            value={formatNumber(o.totalCustomers || 0)}
          />
          <MiniMetric
            label="Avg. order value"
            value={formatCurrency(avgOrderValue)}
          />
          <MiniMetric
            label="Conversion rate"
            value={`${convRate}%`}
          />
        </div>
      </div>

      {/* ── Recent orders ────────────────────────────────────────── */}
      <div className={CARD}>
        <div className={`flex items-center justify-between px-5 py-4 border-b ${DIVIDER}`}>
          <h2 className="text-sm font-semibold text-[#1a1a1a] dark:text-[#e3e3e3]">Recent orders</h2>
          <Link to="/dashboard/orders" className="flex items-center gap-1 text-xs font-semibold text-[#DC2626] hover:underline">
            View all <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className={`divide-y ${DIVIDER}`}>
            {recentOrders.slice(0, 7).map(order => (
              <div key={order._id} className="flex items-center justify-between px-5 py-3.5 hover:bg-[#f6f6f7] dark:hover:bg-white/[0.03] transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  {/* Order number badge */}
                  <div className="w-9 h-9 bg-[#f6f6f7] dark:bg-white/[0.06] rounded-lg flex items-center justify-center shrink-0">
                    <span className="text-[11px] font-bold text-[#6d7175]">
                      #{(order.orderNumber || order._id).slice(-4)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#1a1a1a] dark:text-[#e3e3e3] truncate">
                      {order.customer?.firstName} {order.customer?.lastName}
                    </p>
                    <p className={`text-xs ${SUBDUED} mt-0.5`}>
                      {typeof formatRelativeTime === 'function'
                        ? formatRelativeTime(order.createdAt)
                        : new Date(order.createdAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <p className="text-sm font-bold text-[#1a1a1a] dark:text-[#e3e3e3]">
                    {formatCurrency(order.total)}
                  </p>
                  <Badge color={STATUS_COLOR[order.status] || 'gray'}>{order.status}</Badge>
                </div>
              </div>
            ))}
            {/* Footer link */}
            <div className={`px-5 py-3 bg-[#fafafa] dark:bg-white/[0.02]`}>
              <Link to="/dashboard/orders" className="text-xs font-semibold text-[#DC2626] hover:underline flex items-center gap-1">
                View all orders <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-14 h-14 bg-[#f6f6f7] dark:bg-white/[0.05] rounded-full flex items-center justify-center">
              <ShoppingBag className="w-7 h-7 text-[#b5b5b5] dark:text-[#5a5a7a]" />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#1a1a1a] dark:text-[#e3e3e3]">No orders yet</p>
              <p className={`text-xs ${SUBDUED} mt-0.5`}>When you get an order, it will show here.</p>
            </div>
            <button
              onClick={() => navigate('/dashboard/products')}
              className="mt-1 px-4 py-2 text-sm font-semibold text-white bg-[#DC2626] rounded-lg hover:bg-[#b91c1c] transition-colors shadow-[0_1px_0_rgba(0,0,0,0.2)]"
            >
              View products
            </button>
          </div>
        )}
      </div>

      {/* ── Low stock alert (inline, only when there are items) ─── */}
      {lowStock.length > 0 && (
        <div className={CARD}>
          <div className={`flex items-center justify-between px-5 py-4 border-b ${DIVIDER}`}>
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-semibold text-[#1a1a1a] dark:text-[#e3e3e3]">Low inventory</h2>
            </div>
            <Link to="/dashboard/inventory" className="text-xs font-semibold text-[#DC2626] hover:underline">Manage</Link>
          </div>
          <div className={`divide-y ${DIVIDER}`}>
            {lowStock.slice(0, 5).map(p => (
              <div key={p._id} className="flex items-center justify-between px-5 py-3 hover:bg-[#f6f6f7] dark:hover:bg-white/[0.03] transition-colors">
                <p className="text-sm text-[#303030] dark:text-[#d4d4d4] truncate">{p.name}</p>
                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-full ml-3 shrink-0">
                  {p.stock} left
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Manage your store ────────────────────────────────────── */}
      <div className={CARD}>
        <div className={`px-5 py-4 border-b ${DIVIDER}`}>
          <h2 className="text-sm font-semibold text-[#1a1a1a] dark:text-[#e3e3e3]">Manage your store</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3">
          {MANAGE_LINKS.map(({ icon: Icon, label, sub, to }, i) => (
            <Link
              key={to}
              to={to}
              className={`group flex items-center gap-3.5 px-5 py-4 hover:bg-[#f6f6f7] dark:hover:bg-white/[0.03] transition-colors
                ${i % 3 < 2 ? `border-r ${DIVIDER}` : ''}
                ${i < 3      ? `border-b ${DIVIDER}` : ''}
              `}
            >
              <div className="w-9 h-9 bg-[#f6f6f7] dark:bg-white/[0.06] rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#DC2626]/10 transition-colors">
                <Icon className="w-4 h-4 text-[#6d7175] group-hover:text-[#DC2626] transition-colors" strokeWidth={2} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[#1a1a1a] dark:text-[#e3e3e3] group-hover:text-[#DC2626] transition-colors">{label}</p>
                <p className={`text-xs ${SUBDUED} truncate mt-0.5`}>{sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}