import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShoppingBag, 
  Users, 
  IndianRupee, 
  TrendingUp, 
  Package, 
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Plus,
  BookOpen,
  BarChart2,
  ArrowRight,
  Sparkles,
  RefreshCw,
  Trophy,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';
import StatsCard from '../components/dashboard/StatsCard';
import RecentOrders from '../components/dashboard/RecentOrders';
import LowStockAlert from '../components/dashboard/LowStockAlert';
import RecentNotifications from '../components/dashboard/RecentNotifications';
import Loader from '../components/common/Loader';
import Badge from '../components/common/Badge';
import { analyticsService } from '../services/analyticsService';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import { aiService } from '../services/aiService';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useSocket } from '../context/SocketContext';
import { useTheme } from '../context/ThemeContext';
import toast from 'react-hot-toast';

const PIE_COLORS = ['#25D366', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartPeriod, setChartPeriod] = useState('30d');
  const [aiInsight, setAiInsight] = useState(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const socket = useSocket();
  const { addItem } = useCart();
  const { theme } = useTheme();

  const isDark = theme === 'dark';

  // Chart tooltip style that adapts to theme
  const tooltipStyle = {
    contentStyle: {
      borderRadius: '12px',
      border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
      boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 4px 16px rgba(0,0,0,0.08)',
      backgroundColor: isDark ? '#111111' : 'rgba(255,255,255,0.98)',
      color: isDark ? '#e0e0e0' : '#374151',
    },
    itemStyle: { color: isDark ? '#c8c8e0' : '#374151' },
    labelStyle: { color: isDark ? '#8888a8' : '#6b7280', fontWeight: 600 },
  };

  const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.07)';
  const axisTickColor = isDark ? '#5a5a7a' : '#9ca3af';

  const isVendor = user?.role === 'vendor' || user?.role === 'vendor_staff' || user?.role === 'super_admin';

  useEffect(() => {
    if (socket && isVendor) {
      socket.on('new_order', (data) => {
        // Increment order count locally or refresh data
        setStats(prev => prev ? ({ ...prev, totalOrders: (prev.totalOrders || 0) + 1 }) : prev);
        
        // Optionally refresh recent orders if we had that function exposed or call fetch again
        // For now, simpler to just update the aggregate stat
      });

      return () => {
        socket.off('new_order');
      };
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
          if (a.status === 'fulfilled') {
            setSalesData(a.value.data?.salesData || []);
            setTopProducts(a.value.data?.topProducts || []);
          }
        } else {
          // Fetch customer orders and recommended products
          const [ordersRes, productsRes] = await Promise.allSettled([
            orderService.getMyOrders(),
            aiService.getRecommendations()
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

  // AI insight � fetched separately so it doesn't block the main load
  const fetchInsight = useCallback(async () => {
    setInsightLoading(true);
    try {
      const res = await aiService.chat([{
        role: 'user',
        content: 'In 1-2 short sentences, give me ONE specific, actionable insight about my store performance right now.',
      }]);
      setAiInsight(res.data?.reply || null);
    } catch {
      // non-fatal
    } finally {
      setInsightLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isVendor) fetchInsight();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isVendor]);

  if (loading) return <Loader text="Loading dashboard..." />;

  // Customer Dashboard
  if (!isVendor) {
    const totalSpent = customerOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const pendingOrders = customerOrders.filter(o => o.status === 'pending' || o.status === 'confirmed').length;
    
    const getStatusColor = (status) => {
      const colors = {
        pending: 'yellow',
        confirmed: 'blue',
        processing: 'purple',
        shipped: 'indigo',
        delivered: 'green',
        cancelled: 'red',
      };
      return colors[status] || 'gray';
    };

    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, {user?.firstName}! =���</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Track your orders and find new products.</p>
          </div>
          <Link to="/store" className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white rounded-xl font-medium shadow-lg shadow-[#25D366]/20 hover:bg-[#20bd5a] transition-all">
            <ShoppingBag className="w-5 h-5" />
            Start Shopping
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <StatsCard 
            title="Total Orders" 
            value={customerOrders.length.toString()} 
            icon={Package} 
            color="blue" 
          />
          <StatsCard 
            title="Pending Orders" 
            value={pendingOrders.toString()} 
            icon={Clock} 
            color="yellow" 
          />
          <StatsCard 
            title="Total Spent" 
            value={formatCurrency(totalSpent)} 
            icon={IndianRupee} 
            color="green" 
          />
        </div>

        {/* Recent Orders */}
        {customerOrders.length > 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-6 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between bg-gray-50/50 dark:bg-gray-700/50">
              <h3 className="font-bold text-gray-900 dark:text-white">Recent Orders</h3>
              <Link to="/my-orders" className="text-sm text-[#128C7E] dark:text-[#25D366] hover:text-[#25D366] font-semibold transition-colors">
                View All G��
              </Link>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-gray-700">
              {customerOrders.slice(0, 5).map((order) => (
                <div key={order._id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors group">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white group-hover:text-[#128C7E] dark:group-hover:text-[#25D366] transition-colors">Order #{order._id.slice(-8)}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(order.total)}</p>
                      <div className="mt-1">
                        <Badge color={getStatusColor(order.status)}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    {order.items.length} item{order.items.length > 1 ? 's' : ''}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-12 text-center">
            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Start Shopping</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
              Browse products, add items to cart, and place your first order.
            </p>
            <Link 
              to="/store" 
              className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-[#25D366] text-white rounded-xl font-bold hover:bg-[#20bd5a] transition-all shadow-lg shadow-[#25D366]/20"
            >
              <ShoppingBag className="w-5 h-5" />
              Browse Products
            </Link>
          </div>
        )}

        {/* Available Products */}
        {products.length > 0 && (
          <div className="space-y-6">
             <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Recommended For You</h3>
              <Link to="/store" className="text-sm text-[#128C7E] dark:text-[#25D366] hover:text-[#25D366] font-semibold transition-colors">
                View All G��
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div 
                  key={product._id} 
                  className="group bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-gray-200/50 dark:hover:shadow-black/20 hover:border-[#25D366]/30 dark:hover:border-[#25D366]/30 transition-all duration-300"
                >
                  <Link to={`/product/${product._id}`} className="block relative overflow-hidden">
                    <div className="aspect-square bg-gray-50 dark:bg-gray-700">
                      {product.images?.[0]?.url ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300 dark:text-gray-500 bg-gray-50 dark:bg-gray-700">
                          <Package className="w-12 h-12" />
                        </div>
                      )}
                    </div>
                    {product.stock < 10 && product.stock > 0 && (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-orange-500/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider rounded-lg">
                        Low Stock
                      </div>
                    )}
                  </Link>
                  <div className="p-4">
                    <p className="text-xs font-semibold text-[#128C7E] dark:text-[#25D366] uppercase tracking-wide mb-1">{product.category}</p>
                    <Link to={`/product/${product._id}`}>
                      <h4 className="font-bold text-gray-900 dark:text-white truncate hover:text-[#25D366] dark:hover:text-[#25D366] transition-colors mb-2">
                        {product.name}
                      </h4>
                    </Link>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(product.price)}</p>
                        {product.compareAtPrice > product.price && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 line-through">
                            {formatCurrency(product.compareAtPrice)}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => {
                          addItem(product, 1);
                          toast.success(`${product.name} added to cart!`);
                        }}
                        className="p-2.5 bg-gray-900 dark:bg-gray-700 text-white rounded-xl hover:bg-[#25D366] dark:hover:bg-[#25D366] transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
                        title="Add to cart"
                      >
                        <ShoppingBag className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Vendor Dashboard
  const o = stats?.overview || {};
  const orderStatusData = stats?.orderStatusDistribution
    ? Object.entries(stats.orderStatusDistribution).map(([name, value]) => ({ name, value }))
    : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <p className="text-[13px] font-semibold text-[#dc2626] uppercase tracking-widest mb-1">Dashboard</p>
          <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Overview</h1>
          <p className="text-sm text-gray-500 dark:text-[#6868a0] mt-1">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('/dashboard/products/new')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-bold
              bg-[#dc2626] text-white hover:bg-[#b91c1c] shadow-[0_2px_12px_rgba(220,38,38,0.35)]
              hover:shadow-[0_2px_16px_rgba(220,38,38,0.45)] transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            New Product
          </button>
          <button
            onClick={() => navigate('/dashboard/catalogs')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold
              bg-white dark:bg-white/[0.06] border border-gray-200 dark:border-white/[0.08]
              text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.1]
              hover:border-gray-300 dark:hover:border-white/[0.14] transition-all active:scale-95"
          >
            <BookOpen className="w-4 h-4" />
            Catalogs
          </button>
          <button
            onClick={() => navigate('/dashboard/analytics')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold
              bg-white dark:bg-white/[0.06] border border-gray-200 dark:border-white/[0.08]
              text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.1]
              hover:border-gray-300 dark:hover:border-white/[0.14] transition-all active:scale-95"
          >
            <BarChart2 className="w-4 h-4" />
            Analytics
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Lifetime Sales"
          value={formatCurrency(o.totalRevenue || 0)}
          change={o.revenueGrowth}
          changeType={o.revenueGrowth >= 0 ? 'increase' : 'decrease'}
          icon={IndianRupee}
          color="green"
          subtitle={`?${formatNumber(o.monthlyRevenue || 0)} this month`}
          to="/dashboard/analytics"
        />
        <StatsCard
          title="Total Orders"
          value={o.totalOrders || 0}
          change={o.orderGrowth}
          changeType={o.orderGrowth >= 0 ? 'increase' : 'decrease'}
          icon={ShoppingBag}
          color="blue"
          subtitle={`${o.monthlyOrders || 0} orders this month`}
          to="/dashboard/orders"
        />
        <StatsCard
          title="Active Products"
          value={o.activeProducts || 0}
          subtitle={`out of ${o.totalProducts || 0} total`}
          icon={Package}
          color="purple"
          to="/dashboard/products"
        />
        <StatsCard
          title="Total Customers"
          value={o.totalCustomers || 0}
          icon={Users}
          color="yellow"
          subtitle="Lifetime customers"
          to="/dashboard/customers"
        />
      </div>

      {/* AI Insights Banner */}
      <div className="rounded-2xl p-4 flex items-start gap-4 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, rgba(220,38,38,0.08) 0%, rgba(220,38,38,0.03) 100%)',
          border: '1px solid rgba(220,38,38,0.18)',
        }}>
        {/* shimmer stripe */}
        <div className="absolute inset-y-0 left-0 w-1 rounded-l-2xl" style={{ background: '#dc2626' }} />
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'rgba(220,38,38,0.12)' }}>
          <Sparkles className="w-4.5 h-4.5 text-[#dc2626]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-bold uppercase tracking-widest text-[#dc2626] mb-1">AI Insight</p>
          {insightLoading
            ? <div className="skeleton h-4 rounded w-3/4" />
            : aiInsight
              ? <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{aiInsight}</p>
              : <p className="text-sm text-gray-400 dark:text-gray-500">Click refresh to get a personalized insight.</p>
          }
        </div>
        <button
          onClick={fetchInsight}
          disabled={insightLoading}
          className="shrink-0 p-2 rounded-lg transition-all hover:bg-[#dc2626]/10 disabled:opacity-40"
          title="Refresh insight"
        >
          <RefreshCw className={`w-4 h-4 text-[#dc2626] ${insightLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#0d0d0d] rounded-2xl
          border border-gray-100 dark:border-white/[0.07]
          shadow-sm dark:shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Sales Analytics</h3>
            <select 
              value={chartPeriod}
              onChange={(e) => {
                setChartPeriod(e.target.value);
                analyticsService.getSalesAnalytics({ period: e.target.value })
                  .then(res => setSalesData(res.data?.salesData || []))
                  .catch(() => toast.error('Failed to load chart data'));
              }}
              className="text-sm border-gray-200 dark:border-white/[0.08] bg-white dark:bg-white/[0.05]
                rounded-lg text-gray-500 dark:text-gray-300 focus:ring-[#dc2626]/30
                focus:border-[#dc2626]/40 px-3 py-1.5 cursor-pointer outline-none"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">This Year</option>
            </select>
          </div>
          <div className="h-80 w-full">
            {salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={gridColor} strokeOpacity={1} vertical={false} />
                  <XAxis 
                    dataKey="_id" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: axisTickColor }}
                    tickFormatter={v => { const d = new Date(v); return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`; }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: axisTickColor }}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip 
                    contentStyle={tooltipStyle.contentStyle}
                    itemStyle={tooltipStyle.itemStyle}
                    labelStyle={tooltipStyle.labelStyle}
                    formatter={v => [formatCurrency(v), 'Sales']} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#dc2626" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-full mb-3">
                  <TrendingUp className="h-8 w-8 text-gray-300 dark:text-gray-500" />
                </div>
                <p>No sales data available yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Order Status Pie */}
        <div className="bg-white dark:bg-[#0d0d0d] rounded-2xl
          border border-gray-100 dark:border-white/[0.07]
          shadow-sm dark:shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Order Status</h3>
          <div className="h-64 relative">
            {orderStatusData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={orderStatusData} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80} 
                    paddingAngle={5}
                  >
                    {orderStatusData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={tooltipStyle.contentStyle}
                    itemStyle={tooltipStyle.itemStyle}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                 <p>No orders yet</p>
              </div>
            )}
            {orderStatusData.length > 0 && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{o.monthlyOrders || 0}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-semibold">Total</p>
                </div>
              </div>
            )}
          </div>
          <div className="mt-6 space-y-2">
            {orderStatusData.map((entry, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                  <span className="text-gray-600 dark:text-gray-400 capitalize">{entry.name}</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Bar Chart */}
       <div className="bg-white dark:bg-[#0d0d0d] rounded-2xl
          border border-gray-100 dark:border-white/[0.07]
          shadow-sm dark:shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Daily Orders Trend</h3>
        <div className="h-64">
           {salesData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} strokeOpacity={1} vertical={false} />
                <XAxis 
                  dataKey="_id" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: axisTickColor }}
                  tickFormatter={v => { const d = new Date(v); return `${d.getDate()}`; }} 
                  dy={10}
                />
                <YAxis 
                   axisLine={false}
                   tickLine={false}
                   tick={{ fontSize: 12, fill: axisTickColor }}
                />
                <Tooltip 
                  cursor={{ fill: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)' }}
                  contentStyle={tooltipStyle.contentStyle}
                  itemStyle={tooltipStyle.itemStyle}
                  labelStyle={tooltipStyle.labelStyle}
                />
                <Bar 
                  dataKey="orders" 
                  fill="#3b82f6" 
                  radius={[4, 4, 4, 4]} 
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
             <div className="h-full flex items-center justify-center text-gray-400 dark:text-gray-500">No order data yet</div>
          )}
        </div>
       </div>

      {/* Lists Grid � 2�2 symmetric layout with explicit placement */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* [R1,C1] Recent Orders */}
        <div className="lg:col-start-1 lg:row-start-1">
          <RecentOrders orders={stats?.recentOrders || []} />
        </div>

        {/* [R1,C2] Top Products � stretches to match the height of Recent Orders */}
        <div className="lg:col-start-2 lg:row-start-1 flex flex-col h-full">
          {topProducts.length > 0 ? (
            <div
              className="rounded-2xl overflow-hidden flex flex-col h-full"
              style={{
                background: 'var(--surface-0)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <div
                className="flex items-center justify-between px-5 py-4 shrink-0"
                style={{ borderBottom: '1px solid var(--border)' }}
              >
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <p className="text-sm font-bold" style={{ color: 'var(--text-1)' }}>Top Products</p>
                </div>
                <Link
                  to="/dashboard/analytics"
                  className="text-[11px] font-semibold text-[#dc2626] hover:opacity-80 transition-opacity"
                >
                  View all ?
                </Link>
              </div>
              <div className="flex-1 divide-y overflow-y-auto custom-scrollbar" style={{ borderColor: 'var(--border)' }}>
                {topProducts.slice(0, 5).map((p, i) => {
                  const maxRev = topProducts[0]?.totalRevenue || 1;
                  const pct = ((p.totalRevenue / maxRev) * 100).toFixed(0);
                  return (
                    <div key={p._id || i} className="px-5 py-4 hover:bg-[var(--surface-1)] transition-colors">
                      <div className="flex items-center gap-3">
                        <span
                          className="text-[11px] font-bold tabular-nums w-4"
                          style={{ color: i === 0 ? '#f59e0b' : 'var(--text-3)' }}
                        >
                          #{i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold truncate" style={{ color: 'var(--text-1)' }}>{p.name}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <div className="flex-1 h-1.5 rounded-full" style={{ background: 'var(--surface-2)' }}>
                              <div className="h-1.5 rounded-full" style={{ width: `${pct}%`, background: '#dc2626' }} />
                            </div>
                            <span className="text-[11px] tabular-nums shrink-0" style={{ color: 'var(--text-2)' }}>
                              {p.totalQuantity ?? p.qty ?? 0} sold
                            </span>
                          </div>
                        </div>
                        <p className="text-[13px] font-bold shrink-0" style={{ color: 'var(--text-1)' }}>
                          {formatCurrency(p.totalRevenue)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* No top products � empty spacer so Low Stock stays in R2 */
            <div />
          )}
        </div>

        {/* [R2,C1] Recent Notifications */}
        <div className="lg:col-start-1 lg:row-start-2">
          <RecentNotifications notifications={stats?.notifications || []} />
        </div>

        {/* [R2,C2] Low Stock Alert � aligned with Recent Notifications */}
        <div className="lg:col-start-2 lg:row-start-2">
          <LowStockAlert products={stats?.lowStockProducts || []} />
        </div>

      </div>
    
    </div>
  );
}
