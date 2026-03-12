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
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

/* -- Design tokens -------------------------------------------- */
const CARD = 'bg-white dark:bg-[#0d0d0d] rounded-2xl shadow-sm border border-gray-100 dark:border-white/[0.07]';
const DIV  = 'border-gray-100 dark:border-white/[0.07]';
const SUB  = 'text-gray-400 dark:text-[#5a5a7a]';

const COLORS = ['#DC2626', '#6366f1', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

const PERIODS = [
  { id: '7d',  label: 'Last 7 days'  },
  { id: '30d', label: 'Last 30 days' },
  { id: '90d', label: 'Last 90 days' },
  { id: '1y',  label: 'Last year'    },
];

function CustomTooltip({ active, payload, label }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  if (!active || !payload?.length) return null;
  
  return (
    <div className={`${CARD} p-3 shadow-xl backdrop-blur-md ${isDark ? 'bg-[#141414]/90' : 'bg-white/90'} border-none min-w-[140px]`}>
      <p className="font-black text-[12px] text-gray-900 dark:text-white mb-2 uppercase tracking-wider">{label}</p>
      <div className="space-y-1.5">
        {payload.map((p, i) => (
          <div key={i} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
              <span className="text-[11px] font-bold text-gray-500 dark:text-[#8080a8]">{p.name}</span>
            </div>
            <span className="text-[11px] font-black text-gray-900 dark:text-white">
              {typeof p.value === 'number' && p.name?.toLowerCase().includes('revenue')
                ? formatCurrency(p.value) : p.value}
            </span>
          </div>
        ))}
      </div>
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
        className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-200
          shadow-sm border border-gray-100 dark:border-white/[0.08]
          bg-white dark:bg-white/[0.04] rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.08] transition-all"
      >
        {current.label}<ChevronDown className="w-3.5 h-3.5 text-gray-400" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className={`absolute right-0 top-full mt-2 z-20 w-48 ${CARD} py-1.5 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200`}>
            {PERIODS.map(p => (
              <button key={p.id} onClick={() => { onChange(p.id); setOpen(false); }}
                className={`flex items-center w-full px-4 py-2 text-sm font-bold transition-colors ${p.id === period ? 'text-[#DC2626] bg-red-50 dark:bg-[#DC2626]/10' : `text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-white/[0.04]`}`}>
                {p.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function KpiCard({ icon: Icon, label, value, change, color }) {
  const up = typeof change === 'number' ? change >= 0 : null;
  return (
    <div className="group bg-white dark:bg-[#0d0d0d] rounded-2xl p-5
      border border-gray-100 dark:border-white/[0.07]
      shadow-sm hover:shadow-md dark:hover:shadow-black/30
      transition-all duration-300 relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="flex items-center justify-between mb-4">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center
          bg-gray-50 dark:bg-white/[0.04] group-hover:scale-105 transition-transform ${color}`}>
          <Icon className="w-5 h-5" strokeWidth={2.5} />
        </div>
        {up !== null && (
          <span className={`text-[11px] font-black px-2 py-0.5 rounded-lg border ${
            up
              ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400'
              : 'bg-red-50 dark:bg-red-500/10 border-red-100 dark:border-red-500/20 text-red-600 dark:text-[#f87171]'
          }`}>
            {up ? '↑' : '↓'} {Math.abs(change)}%
          </span>
        )}
      </div>
      <p className="text-[28px] font-black text-gray-900 dark:text-white tracking-tight leading-none">{value}</p>
      <p className="text-[12px] font-bold text-gray-400 dark:text-[#5a5a7a] mt-2 uppercase tracking-widest">{label}</p>
    </div>
  );
}

export default function Analytics() {
  const [period,    setPeriod]    = useState('30d');
  const [salesData, setSalesData] = useState(null);
  const [custData,  setCustData]  = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [refresh,   setRefresh]   = useState(0);
  const { theme } = useTheme();
  
  const isDark = theme === 'dark';
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)';
  const axisColor = isDark ? '#5a5a7a' : '#94a3b8';

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

  const sSummary = salesData?.summary || {};
  const sData = salesData?.salesData || [];

  const kpis = [
    { icon: DollarSign,  label: 'Total revenue',  value: formatCurrency(sSummary.totalRevenue || 0), change: sSummary.revenueGrowth,  color: 'text-[#DC2626]'     },
    { icon: ShoppingCart,label: 'Total orders',   value: sSummary.totalOrders || 0,                  change: sSummary.orderGrowth,    color: 'text-indigo-500'    },
    { icon: Users,       label: 'Total customers',value: custData?.totalCustomers || 0,             change: null,                      color: 'text-emerald-500'   },
    { icon: TrendingUp,  label: 'Avg order value', value: formatCurrency(sSummary.averageOrderValue || 0), change: sSummary.avgOrderGrowth, color: 'text-amber-500'     },
  ];

  const formattedChartData = sData.map(d => ({
    date: d._id,
    revenue: d.revenue || 0,
    orders: d.orders || 0
  }));

  const revenueChart  = formattedChartData;
  const orderChart    = formattedChartData;
  const customerChart = (custData?.customerGroups || []).map(g => ({ name: g._id || 'Unknown', value: g.count }));

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between pt-4">
        <div>
          <p className="text-[13px] font-bold uppercase tracking-widest text-[#dc2626] mb-1">Performance</p>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Analytics</h1>
        </div>
        <div className="flex items-center gap-2.5">
          <button onClick={() => setRefresh(r => r + 1)}
            className="p-2.5 rounded-xl text-gray-500 dark:text-gray-400 shadow-sm border border-gray-100 dark:border-white/[0.08] bg-white dark:bg-white/[0.04] hover:bg-gray-50 dark:hover:bg-white/[0.08] transition-all">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <PeriodPicker period={period} onChange={setPeriod} />
        </div>
      </div>

      {loading ? (
        <div className="py-40 flex flex-col items-center justify-center gap-4">
           <Loader text="Analyzing business data..." />
        </div>
      ) : (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {kpis.map(k => <KpiCard key={k.label} {...k} />)}
          </div>

          {/* Revenue area chart */}
          <div className={`${CARD} p-6`}>
            <div className={`flex items-center justify-between pb-5 mb-6 border-b ${DIV}`}>
              <div>
                <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Revenue Stream</p>
                <p className="text-[11px] font-bold text-gray-400 dark:text-[#5a5a7a] mt-0.5">Sales performance over time</p>
              </div>
              <BarChart2 className="w-5 h-5 text-gray-300 dark:text-[#3a3a5a]" />
            </div>
            <div className="h-[300px] w-full">
                {revenueChart.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor="#DC2626" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: axisColor, fontWeight: 700 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis tick={{ fontSize: 11, fill: axisColor, fontWeight: 700 }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} width={44} />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#dc2626', strokeWidth: 1, strokeDasharray: '4 4' }} />
                    <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#DC2626" strokeWidth={3} fill="url(#revGrad)" dot={false} activeDot={{ r: 5, fill: '#DC2626', stroke: isDark ? '#0d0d0d' : '#fff', strokeWidth: 2 }} animationDuration={1500} />
                    </AreaChart>
                </ResponsiveContainer>
                ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                    <BarChart2 className="w-10 h-10 text-gray-200 dark:text-white/5 mb-3" />
                    <p className={`text-sm font-bold ${SUB}`}>No revenue data available</p>
                </div>
                )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Orders bar */}
            <div className={`${CARD} p-6`}>
              <div className={`flex items-center justify-between pb-5 mb-6 border-b ${DIV}`}>
                <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Order Volume</p>
                <ShoppingCart className="w-5 h-5 text-gray-300 dark:text-[#3a3a5a]" />
              </div>
              <div className="h-[260px] w-full">
                {orderChart.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={orderChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                        <XAxis dataKey="date" tick={{ fontSize: 11, fill: axisColor, fontWeight: 700 }} axisLine={false} tickLine={false} dy={10} />
                        <YAxis tick={{ fontSize: 11, fill: axisColor, fontWeight: 700 }} axisLine={false} tickLine={false} width={32} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)' }} />
                        <Bar dataKey="orders" name="Orders" fill="#6366f1" radius={[6, 6, 0, 0]} />
                    </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center">
                    <p className={`text-sm font-bold ${SUB}`}>No order data available</p>
                    </div>
                )}
              </div>
            </div>

            {/* Customer segmented pie */}
            <div className={`${CARD} p-6`}>
              <div className={`flex items-center justify-between pb-5 mb-6 border-b ${DIV}`}>
                <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">User Segments</p>
                <Users className="w-5 h-5 text-gray-300 dark:text-[#3a3a5a]" />
              </div>
              <div className="h-[260px] w-full">
                {customerChart.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={customerChart} cx="50%" cy="45%" innerRadius={60} outerRadius={90}
                        dataKey="value" nameKey="name" paddingAngle={4} animationBegin={0} animationDuration={1200}>
                        {customerChart.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="transparent" />)}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" iconSize={10} formatter={(v) => <span className="text-[12px] font-bold text-gray-600 dark:text-[#a0a0c0] ml-1">{v}</span>} />
                    </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center">
                    <p className={`text-sm font-bold ${SUB}`}>No segment data available</p>
                    </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}