import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import {
  TrendingUp, ShoppingCart, IndianRupee, Receipt,
  Users, Star, BarChart2, Package, MapPin, Tag
} from 'lucide-react';
import { analyticsService } from '../services/analyticsService';
import Loader from '../components/common/Loader';
import { formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';
import StatsCard from '../components/dashboard/StatsCard';

const COLORS = ['#25D366', '#128C7E', '#34B7F1', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#6366f1'];

const STATUS_MAP = {
  pending: { label: 'Pending', color: '#f59e0b' },
  confirmed: { label: 'Confirmed', color: '#3B82F6' },
  processing: { label: 'Processing', color: '#8b5cf6' },
  shipped: { label: 'Shipped', color: '#34B7F1' },
  delivered: { label: 'Delivered', color: '#25D366' },
  cancelled: { label: 'Cancelled', color: '#ef4444' },
  refunded: { label: 'Refunded', color: '#6b7280' },
  returned: { label: 'Returned', color: '#f97316' },
};



const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-xl shadow-xl px-4 py-3 text-sm z-50">
      <p className="text-gray-500 dark:text-gray-400 mb-1 text-xs">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="font-semibold" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' && (entry.name?.toLowerCase().includes('revenue') || typeof entry.value === 'number' && entry.value > 1000) // loose check for currency
            ? formatCurrency(entry.value)
            : entry.value}
        </p>
      ))}
    </div>
  );
};

export default function Analytics() {
  const [salesData, setSalesData] = useState(null);
  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [sales, customers] = await Promise.allSettled([
          analyticsService.getSalesAnalytics({ period }),
          analyticsService.getCustomerAnalytics(),
        ]);
        if (sales.status === 'fulfilled') setSalesData(sales.value.data);
        if (customers.status === 'fulfilled') setCustomerData(customers.value.data);
      } catch { toast.error('Failed to load analytics'); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [period]);

  if (loading) return <Loader text="Loading analytics..." />;

  const summary = salesData?.summary || {};
  const chartData = salesData?.salesData || [];
  const topProducts = salesData?.topProducts || [];
  const statusBreakdown = salesData?.orderStatusBreakdown || [];
  const salesByCategory = salesData?.salesByCategory || [];
  const salesByRegion = salesData?.salesByRegion || [];

  const pieData = statusBreakdown.length > 0
    ? statusBreakdown.map(s => ({ name: STATUS_MAP[s._id]?.label || s._id, value: s.count, color: STATUS_MAP[s._id]?.color || '#aaa' }))
    : [];

  const categoryData = salesByCategory.map((c, i) => ({
    name: c._id || 'Uncategorized',
    value: c.revenue,
    color: COLORS[i % COLORS.length]
  }));

  const regionData = salesByRegion.map((r, i) => ({
    name: r._id || 'Unknown',
    revenue: r.revenue,
    count: r.count
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#111827] dark:text-white tracking-tight">Analytics</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">Track your business performance</p>
        </div>
        <select
          value={period}
          onChange={e => setPeriod(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]/20 transition-colors cursor-pointer"
        >
          <option value="today">Today</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard icon={IndianRupee} title="Total Revenue" value={formatCurrency(summary.totalRevenue || 0)} color="green" />
        <StatsCard icon={ShoppingCart} title="Total Orders" value={summary.totalOrders || 0} color="blue" />
        <StatsCard icon={TrendingUp} title="Avg Order Value" value={formatCurrency(summary.averageOrderValue || 0)} color="purple" />
        <StatsCard icon={Receipt} title="Total Tax" value={formatCurrency(summary.totalTax || 0)} color="yellow" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart - Main Feature */}
        <div className="lg:col-span-2 bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Trend</h3>
          </div>
          <div className="h-80">
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,100,100,0.15)" vertical={false} />
                  <XAxis dataKey="_id" tick={{ fontSize: 11, fill: '#9ca3af' }}
                    tickFormatter={v => { try { const d = new Date(v); return `${d.getDate()}/${d.getMonth() + 1}`; } catch { return v; } }}
                    axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false}
                    tickFormatter={v => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3B82F6', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#3B82F6" fill="url(#revGrad)" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <TrendingUp className="w-12 h-12 mb-2 opacity-30" />
                <p className="text-sm">No revenue data for this period</p>
              </div>
            )}
          </div>
        </div>

        {/* Sales by Category (New) */}
        <div className="lg:col-span-1 bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Tag className="w-5 h-5 text-[#25D366]" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sales by Category</h3>
          </div>
          <div className="h-60 relative">
            {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={categoryData} 
                      cx="50%" cy="50%" 
                      innerRadius={60} 
                      outerRadius={80} 
                      paddingAngle={5} 
                      dataKey="value"
                      stroke="none"
                    >
                      {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
            ) : (
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">No category data</div>
            )}
             {/* Center Text for Donut */}
             {categoryData.length > 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-xs text-gray-500 font-medium">Top Category</span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white truncate max-w-[100px]">{categoryData[0]?.name}</span>
                </div>
             )}
          </div>
          <div className="mt-4 space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
            {categoryData.map((d, i) => (
               <div key={i} className="flex items-center justify-between text-sm">
                 <div className="flex items-center gap-2">
                   <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                   <span className="text-gray-600 dark:text-gray-400 truncate max-w-[120px]">{d.name}</span>
                 </div>
                 <span className="font-semibold text-gray-900 dark:text-white">{formatCurrency(d.value)}</span>
               </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Sales by Region (New) */}
         <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
           <div className="flex items-center gap-2 mb-5">
             <MapPin className="w-5 h-5 text-[#128C7E]" />
             <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Regions</h3>
           </div>
           {regionData.length > 0 ? (
             <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={regionData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="rgba(100,100,100,0.1)" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                    <Tooltip 
                        cursor={{fill: 'rgba(0,0,0,0.05)'}}
                        content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                            return (
                                <div className="bg-white dark:bg-zinc-900 p-2 border border-gray-200 dark:border-zinc-700 shadow-lg rounded-lg text-xs">
                                <p className="font-bold mb-1">{payload[0].payload.name}</p>
                                <p>Revenue: {formatCurrency(payload[0].value)}</p>
                                <p>Orders: {payload[0].payload.count}</p>
                                </div>
                            );
                            }
                            return null;
                        }}
                    />
                    <Bar dataKey="revenue" name="Revenue" fill="#25D366" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
             </div>
           ) : (
             <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                <MapPin className="w-10 h-10 mb-2 opacity-30" />
                <p className="text-sm">No location data available</p>
             </div>
           )}
         </div>

        {/* Top Products */}
        <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-5">
            <Package className="w-5 h-5 text-[#25D366]" />
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Top Products</h3>
          </div>
          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.slice(0, 6).map((p, i) => (
                <div key={p._id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-zinc-900 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors">
                  <span className="h-7 w-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ backgroundColor: COLORS[i % COLORS.length] + '20', color: COLORS[i % COLORS.length] }}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.totalQuantity} units sold</p>
                  </div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(p.totalRevenue)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <Package className="w-10 h-10 mb-2 opacity-30" />
              <p className="text-sm">No product data yet</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Order Status Pie */}
        <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="w-5 h-5 text-[#34B7F1]" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Order Status</h3>
            </div>
            <div className="flex items-center gap-4">
            <div className="h-48 w-48 shrink-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value" stroke="none">
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
                </ResponsiveContainer>
                {/* Center Stats */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{summary.totalOrders || 0}</span>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest">Orders</span>
                </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-2">
                {pieData.map(d => (
                <div key={d.name} className="flex items-center justify-between text-xs p-1.5 rounded-lg bg-gray-50 dark:bg-zinc-900/50">
                    <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                    <span className="text-gray-600 dark:text-gray-400 truncate max-w-[80px]">{d.name}</span>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white">{d.value}</span>
                </div>
                ))}
            </div>
            </div>
        </div>

        {/* Customer Overview */}
        <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-emerald-500" />
            <h3 className="text-base font-bold text-gray-900 dark:text-white">Customer Overview</h3>
        </div>
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20">
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium uppercase tracking-wider">Total Customers</span>
                    <p className="text-2xl font-bold text-blue-700 dark:text-blue-300 mt-1">{customerData?.totalCustomers || 0}</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20">
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium uppercase tracking-wider">New This Month</span>
                    <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300 mt-1">{customerData?.newThisMonth || 0}</p>
                </div>
            </div>

            {customerData?.topCustomers?.length > 0 && (
            <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-1">Top Spenders</p>
                <div className="space-y-2">
                {customerData.topCustomers.slice(0, 3).map((c, i) => (
                    <div key={c._id} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-900 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
                        style={{ background: `linear-gradient(135deg, ${COLORS[i % COLORS.length]}, ${COLORS[(i + 2) % COLORS.length]})` }}>
                        {c.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                             <p className="font-semibold text-gray-900 dark:text-white truncate max-w-[120px]">{c.name}</p>
                             <p className="text-xs text-gray-400">{c.email}</p>
                        </div>
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-zinc-800 px-2 py-1 rounded-md">{formatCurrency(c.stats?.totalSpent || 0)}</span>
                    </div>
                ))}
                </div>
            </div>
            )}
        </div>
        </div>
      </div>
    </div>
  );
}