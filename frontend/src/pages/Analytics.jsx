import { useState, useEffect } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { HiOutlineChartBar, HiOutlineTrendingUp } from 'react-icons/hi';
import { analyticsService } from '../services/analyticsService';
import Loader from '../components/common/Loader';
import Badge from '../components/common/Badge';
import { formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

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

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Track your business performance</p>
        </div>
        <select className="w-40 px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          value={period} onChange={e => setPeriod(e.target.value)}>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Total Revenue</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{formatCurrency(summary.totalRevenue || 0)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{summary.totalOrders || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Avg Order Value</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">{formatCurrency(summary.averageOrderValue || 0)}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
          <p className="text-sm text-gray-500">Total Tax</p>
          <p className="text-2xl font-bold text-orange-600 mt-1">{formatCurrency(summary.totalTax || 0)}</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
        <div className="h-80">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="_id" tick={{ fontSize: 11 }}
                  tickFormatter={v => { const d = new Date(v); return `${d.getDate()}/${d.getMonth() + 1}`; }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip formatter={v => [formatCurrency(v), 'Revenue']} />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="#93c5fd" fillOpacity={0.3} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <div className="text-center"><HiOutlineTrendingUp className="h-12 w-12 mx-auto mb-2" /><p>No data for this period</p></div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Products</h3>
          {topProducts.length > 0 ? (
            <div className="space-y-3">
              {topProducts.map((p, i) => (
                <div key={p._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="h-7 w-7 rounded-full bg-primary-100 text-primary-700 text-xs font-bold flex items-center justify-center">{i + 1}</span>
                    <div>
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.totalQuantity} units sold</p>
                    </div>
                  </div>
                  <span className="font-semibold text-sm">{formatCurrency(p.totalRevenue)}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No product data yet</p>
          )}
        </div>

        {/* Customer Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Total Customers</span>
              <span className="font-bold text-lg">{customerData?.totalCustomers || 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-sm text-green-700">New This Month</span>
              <span className="font-bold text-lg text-green-600">{customerData?.newThisMonth || 0}</span>
            </div>

            {customerData?.customerGroups?.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">By Group</p>
                <div className="space-y-2">
                  {customerData.customerGroups.map(g => (
                    <div key={g._id} className="flex justify-between items-center">
                      <Badge color={g._id === 'vip' ? 'purple' : g._id === 'wholesale' ? 'blue' : 'gray'}>{g._id}</Badge>
                      <span className="text-sm font-medium">{g.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {customerData?.topCustomers?.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Top Spenders</p>
                <div className="space-y-2">
                  {customerData.topCustomers.slice(0, 5).map(c => (
                    <div key={c._id} className="flex justify-between items-center text-sm">
                      <span className="text-gray-700">{c.name}</span>
                      <span className="font-medium">{formatCurrency(c.stats?.totalSpent || 0)}</span>
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