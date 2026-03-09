import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  TrendingUp, ShoppingCart, Users, DollarSign,
  BarChart2, ChevronDown, RefreshCw
} from 'lucide-react';
import { analyticsService } from '../services/analyticsService';
import Loader from '../components/common/Loader';
import { formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';

/* ── Polaris tokens ──────────────────────────────────────────── */
const CARD = 'bg-white dark:bg-[#1a1a24] rounded-xl shadow-[0_0_0_1px_rgba(26,26,26,0.13),0_1px_0_0_rgba(26,26,26,0.07)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.10),0_1px_0_0_rgba(0,0,0,0.32)]';
const DIV  = 'border-[#e1e3e5] dark:border-white/[0.08]';
const SUB  = 'text-[#6d7175] dark:text-[#9898b8]';

const COLORS = ['#DC2626', '#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

const PERIODS = [
  { id: '7d',  label: 'Last 7 days'  },
  { id: '30d', label: 'Last 30 days' },
  { id: '90d', label: 'Last 90 days' },
  { id: '1y',  label: 'Last year'    },
];

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className={`${CARD} p-3 text-xs`}>
      <p className="font-bold text-[#1a1a1a] dark:text-[#e3e3e3] mb-1.5">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className={SUB}>{p.name}:</span>
          <span className="font-semibold text-[#303030] dark:text-[#d4d4d4]">
            {typeof p.value === 'number' && p.name?.toLowerCase().includes('revenue')
              ? formatCurrency(p.value) : p.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function PeriodPicker({ period, onChange }) {
  const [open, setOpen] = useState(false);
  const current = PERIODS.find(p => p.id === period) || PERIODS[1];
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(p => !p)}
        className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold text-[#1a1a1a] dark:text-[#d4d4d4]
          shadow-[0_0_0_1px_rgba(26,26,26,0.13),0_1px_0_0_rgba(26,26,26,0.07)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.10)]
          bg-white dark:bg-[#1a1a24] rounded-lg hover:bg-[#f6f6f7] dark:hover:bg-white/[0.06] transition-colors`}
      >
        {current.label}<ChevronDown className="w-3.5 h-3.5 text-[#6d7175]" />
      </button>
      {open && (
        <div className={`absolute right-0 top-10 z-20 w-44 ${CARD} py-1`}>
          {PERIODS.map(p => (
            <button key={p.id} onClick={() => { onChange(p.id); setOpen(false); }}
              className={`flex items-center w-full px-3 py-2 text-sm transition-colors ${p.id === period ? 'text-[#DC2626] font-semibold bg-red-50 dark:bg-[#DC2626]/10' : `text-[#303030] dark:text-[#d4d4d4] hover:bg-[#f6f6f7] dark:hover:bg-white/[0.05]`}`}>
              {p.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── KPI card ────────────────────────────────────────────────── */
function KpiCard({ icon: Icon, label, value, change, color }) {
  const up = typeof change === 'number' ? change >= 0 : null;
  return (
    <div className={`${CARD} p-5`}>
      <div className="flex items-center justify-between mb-3">
        <div className={`w-9 h-9 rounded-lg bg-[#f6f6f7] dark:bg-white/[0.05] flex items-center justify-center ${color}`}>
          <Icon className="w-4.5 h-4.5 w-[18px] h-[18px]" />
        </div>
        {up !== null && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${up ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'}`}>
            {up ? '+' : ''}{change}%
          </span>
        )}
      </div>
      <p className="text-2xl font-black text-[#1a1a1a] dark:text-[#e3e3e3]">{value}</p>
      <p className={`text-xs ${SUB} mt-0.5`}>{label}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
export default function Analytics() {
  const [period,    setPeriod]    = useState('30d');
  const [salesData, setSalesData] = useState(null);
  const [custData,  setCustData]  = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [refresh,   setRefresh]   = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      analyticsService.getSalesAnalytics({ period }).catch(() => null),
      analyticsService.getCustomerAnalytics({ period }).catch(() => null),
    ]).then(([s, c]) => {
      if (!cancelled) {
        setSalesData(s?.data || s || null);
        setCustData(c?.data  || c || null);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [period, refresh]);

  const kpis = [
    { icon: DollarSign,  label: 'Total revenue',  value: formatCurrency(salesData?.totalRevenue  || 0), change: salesData?.revenueGrowth,  color: 'text-[#DC2626]'     },
    { icon: ShoppingCart,label: 'Total orders',   value: salesData?.totalOrders   || 0,                  change: salesData?.orderGrowth,    color: 'text-indigo-500'    },
    { icon: Users,       label: 'Total customers',value: custData?.totalCustomers  || 0,                  change: custData?.customerGrowth,  color: 'text-emerald-500'   },
    { icon: TrendingUp,  label: 'Avg order value', value: formatCurrency(salesData?.avgOrderValue || 0), change: salesData?.avgOrderGrowth, color: 'text-amber-500'     },
  ];

  const revenueChart    = salesData?.revenueOverTime  || salesData?.dailyRevenue || [];
  const orderChart      = salesData?.ordersOverTime   || salesData?.dailyOrders  || [];
  const categoryChart   = salesData?.salesByCategory  || [];
  const customerChart   = custData?.customerSegments  || custData?.segments      || [];

  return (
    <div className="max-w-[1200px] mx-auto space-y-5 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <h1 className="text-[1.375rem] font-bold text-[#1a1a1a] dark:text-[#e3e3e3]">Analytics</h1>
        <div className="flex items-center gap-2.5">
          <button onClick={() => setRefresh(r => r + 1)}
            className={`p-2 rounded-lg text-[#6d7175] shadow-[0_0_0_1px_rgba(26,26,26,0.13)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.10)] bg-white dark:bg-[#1a1a24] hover:bg-[#f6f6f7] dark:hover:bg-white/[0.06] transition-colors`}>
            <RefreshCw className="w-4 h-4" />
          </button>
          <PeriodPicker period={period} onChange={setPeriod} />
        </div>
      </div>

      {loading ? (
        <div className={`${CARD} py-32 flex justify-center`}><Loader text="Loading analytics..." /></div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {kpis.map(k => <KpiCard key={k.label} {...k} />)}
          </div>

          {/* Revenue area chart */}
          <div className={`${CARD} p-5`}>
            <div className={`flex items-center justify-between pb-4 mb-4 border-b ${DIV}`}>
              <p className="text-sm font-bold text-[#1a1a1a] dark:text-[#e3e3e3]">Revenue over time</p>
              <BarChart2 className={`w-4 h-4 ${SUB}`} />
            </div>
            {revenueChart.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={revenueChart} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#DC2626" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#DC2626" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6d7175' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#6d7175' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} width={44} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#DC2626" strokeWidth={2} fill="url(#revGrad)" dot={false} activeDot={{ r: 4, fill: '#DC2626' }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-60 flex items-center justify-center">
                <p className={`text-sm ${SUB}`}>No revenue data for this period</p>
              </div>
            )}
          </div>

          {/* Orders bar + Customer pie */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Orders bar */}
            <div className={`${CARD} p-5`}>
              <p className={`text-sm font-bold text-[#1a1a1a] dark:text-[#e3e3e3] pb-4 mb-4 border-b ${DIV}`}>Orders by day</p>
              {orderChart.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={orderChart} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#6d7175' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#6d7175' }} axisLine={false} tickLine={false} width={32} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="orders" name="Orders" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-56 flex items-center justify-center">
                  <p className={`text-sm ${SUB}`}>No order data for this period</p>
                </div>
              )}
            </div>

            {/* Customer segments pie */}
            <div className={`${CARD} p-5`}>
              <p className={`text-sm font-bold text-[#1a1a1a] dark:text-[#e3e3e3] pb-4 mb-4 border-b ${DIV}`}>Customer segments</p>
              {customerChart.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={customerChart} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                      dataKey="value" nameKey="name" paddingAngle={2}>
                      {customerChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-xs text-[#303030] dark:text-[#d4d4d4]">{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-56 flex items-center justify-center">
                  <p className={`text-sm ${SUB}`}>No segment data for this period</p>
                </div>
              )}
            </div>
          </div>

          {/* Top categories */}
          {categoryChart.length > 0 && (
            <div className={`${CARD} p-5`}>
              <p className={`text-sm font-bold text-[#1a1a1a] dark:text-[#e3e3e3] pb-4 mb-4 border-b ${DIV}`}>Sales by category</p>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={categoryChart} layout="vertical" margin={{ top: 4, right: 12, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11, fill: '#6d7175' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <YAxis type="category" dataKey="category" tick={{ fontSize: 11, fill: '#6d7175' }} axisLine={false} tickLine={false} width={80} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="revenue" name="Revenue" radius={[0, 4, 4, 0]}>
                    {categoryChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </>
      )}
    </div>
  );
}