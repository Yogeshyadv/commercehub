import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Truck
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell,
} from 'recharts';
import StatsCard from '../components/dashboard/StatsCard';
import RecentOrders from '../components/dashboard/RecentOrders';
import LowStockAlert from '../components/dashboard/LowStockAlert';
import Loader from '../components/common/Loader';
import Badge from '../components/common/Badge';
import { analyticsService } from '../services/analyticsService';
import { orderService } from '../services/orderService';
import { productService } from '../services/productService';
import { formatCurrency } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const PIE_COLORS = ['#25D366', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [customerOrders, setCustomerOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { addItem } = useCart();

  const isVendor = user?.role === 'vendor' || user?.role === 'vendor_staff' || user?.role === 'super_admin';

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
          // Fetch customer orders and products
          const [ordersRes, productsRes] = await Promise.allSettled([
            orderService.getMyOrders(),
            productService.getPublicProducts({ limit: 8 })
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome, {user?.firstName}! 👋</h1>
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
                View All →
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
                View All →
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Check your store's performance and analytics.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            Export Report
          </button>
          <button className="px-4 py-2 bg-[#25D366] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#25D366]/20 hover:bg-[#20bd5a] transition-all">
            + Add Product
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value={formatCurrency(o.monthlyRevenue || 0)}
          change={o.revenueGrowth}
          changeType={o.revenueGrowth >= 0 ? 'increase' : 'decrease'}
          icon={IndianRupee}
          color="green"
          subtitle="Monthly earnings"
        />
        <StatsCard
          title="Total Orders"
          value={o.monthlyOrders || 0}
          change={o.orderGrowth}
          changeType={o.orderGrowth >= 0 ? 'increase' : 'decrease'}
          icon={ShoppingBag}
          color="blue"
          subtitle="Orders this month"
        />
        <StatsCard
          title="Active Products"
          value={o.activeProducts || 0}
          subtitle={`out of ${o.totalProducts || 0} total`}
          icon={Package}
          color="purple"
        />
        <StatsCard
          title="Total Customers"
          value={o.totalCustomers || 0}
          icon={Users}
          color="yellow"
          subtitle="Lifetime customers"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Revenue Analytics</h3>
            <select className="text-sm border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 rounded-lg text-gray-500 dark:text-gray-300 focus:ring-[#25D366] focus:border-[#25D366]">
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-80 w-full">
            {salesData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#25D366" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#25D366" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.2} vertical={false} />
                  <XAxis 
                    dataKey="_id" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    tickFormatter={v => { const d = new Date(v); return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`; }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    tickFormatter={(value) => `₹${value}`}
                  />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                    itemStyle={{ color: '#374151' }}
                    formatter={v => [formatCurrency(v), 'Revenue']} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#25D366" 
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
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
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
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                    itemStyle={{ color: '#374151' }}
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
       <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Daily Orders Trend</h3>
        <div className="h-64">
           {salesData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" strokeOpacity={0.2} vertical={false} />
                <XAxis 
                  dataKey="_id" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#9ca3af' }}
                  tickFormatter={v => { const d = new Date(v); return `${d.getDate()}`; }} 
                  dy={10}
                />
                <YAxis 
                   axisLine={false}
                   tickLine={false}
                   tick={{ fontSize: 12, fill: '#9ca3af' }}
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                  itemStyle={{ color: '#374151' }}
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

      {/* Lists Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentOrders orders={stats?.recentOrders || []} />
        <LowStockAlert products={stats?.lowStockProducts || []} />
      </div>
    </div>
  );
}