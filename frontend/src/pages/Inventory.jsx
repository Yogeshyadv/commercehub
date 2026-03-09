import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package, Search, RefreshCw, TrendingDown,
  Edit3, AlertTriangle
} from 'lucide-react';
import { productService } from '../services/productService';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { useDebounce } from '../hooks/useDebounce';
import { formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';
import StockDetailsModal from '../components/inventory/StockDetailsModal';

function StatsCard({ title, value, icon, color, subValue }) {
  return (
    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color.bg} ${color.text}`}>
          {icon}
        </div>
        {subValue && (
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${color.bg} ${color.text}`}>
            {subValue}
          </span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</h3>
      </div>
    </div>
  );
}

function StockEditor({ product, onManage }) {
  const isOut = product.stock <= 0;
  const isLow = product.stock > 0 && product.stock <= 10;
  
  const colorClass = isOut ? 'text-red-600 dark:text-red-400' : isLow ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-600 dark:text-red-400';
  const bgClass = isOut ? 'bg-red-50 dark:bg-red-900/10' : isLow ? 'bg-yellow-50 dark:bg-yellow-900/10' : 'bg-red-50 dark:bg-red-900/10';

  return (
    <div className="group flex items-center gap-3">
      <div className={`px-3 py-1 rounded-lg font-bold text-sm ${colorClass} ${bgClass} w-16 text-center shadow-sm`}>
        {product.stock}
      </div>
      <button
        onClick={() => onManage(product)}
        className="opacity-0 group-hover:opacity-100 p-1.5 text-[#DC2626] hover:bg-[#DC2626]/10 dark:hover:bg-[#DC2626]/20 rounded-lg transition-all"
        title="Manage Stock"
      >
        <Edit3 className="w-4 h-4" />
      </button>
    </div>
  );
}

const TABS = [
  { id: 'all', label: 'All Items' },
  { id: 'low_stock', label: 'Low Stock' },
  { id: 'out_of_stock', label: 'Out of Stock' },
];

export default function Inventory() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stats, setStats] = useState({ total: 0, low: 0, out: 0 });
  
  const debouncedSearch = useDebounce(search, 400);

  // Fetch quick stats independently
  useEffect(() => {
    Promise.all([
      productService.getProducts({ limit: 1 }),
      productService.getProducts({ stockStatus: 'low_stock', limit: 1 }),
      productService.getProducts({ stockStatus: 'out_of_stock', limit: 1 })
    ]).then(([all, low, out]) => {
      setStats({
        total: all.pagination?.total || 0,
        low: low.pagination?.total || 0,
        out: out.pagination?.total || 0
      });
    }).catch(() => {});
  }, []); // Run once on mount

  const fetchProducts = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = { page, limit: 20 };
      if (debouncedSearch) params.search = debouncedSearch;
      
      if (activeTab === 'low_stock') params.stockStatus = 'low_stock';
      if (activeTab === 'out_of_stock') params.stockStatus = 'out_of_stock';
      
      const response = await productService.getProducts(params);
      setProducts(response.data || []);
      setPagination(response.pagination || { page: 1, limit: 20, total: 0, pages: 0 });
    } catch {
      toast.error('Failed to load inventory');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, activeTab]);

  useEffect(() => {
    fetchProducts(1);
  }, [fetchProducts]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.pages) {
      fetchProducts(newPage);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <StockDetailsModal 
         isOpen={!!selectedProduct}
         onClose={() => setSelectedProduct(null)}
         product={selectedProduct}
         onUpdate={() => {
           fetchProducts(pagination.page);
           // Refresh stats slightly delayed or triggered separately
         }}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#111827] dark:text-white tracking-tight">Inventory Management</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base">
            Track stock levels, monitor low inventory, and manage adjustments.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => fetchProducts(pagination.page)}
            className="p-2.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-all"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/dashboard/products/new')}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-xl font-medium shadow-lg shadow-[#DC2626]/20 transition-all transform hover:scale-105 active:scale-95"
          >
            <Package className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard
          title="Total Items"
          value={stats.total}
          icon={<Package className="w-6 h-6" />}
          color={{ bg: 'bg-[#DC2626]/10 dark:bg-[#DC2626]/20', text: 'text-[#DC2626] dark:text-[#DC2626]' }}
        />
        <StatsCard
          title="Low Stock Items"
          value={stats.low}
          icon={<TrendingDown className="w-6 h-6" />}
          color={{ bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-600 dark:text-yellow-400' }}
        />
        <StatsCard
          title="Out of Stock"
          value={stats.out}
          icon={<AlertTriangle className="w-6 h-6" />}
          color={{ bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400' }}
        />
      </div>

      {/* Main Content Area */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-100 dark:border-zinc-800 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row gap-6 justify-between items-center bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl">
          {/* Tabs */}
          <div className="flex p-1 bg-gray-100 dark:bg-zinc-800 rounded-xl self-start sm:self-auto overflow-x-auto max-w-full">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${activeTab === tab.id
                    ? 'bg-[#DC2626] text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search inventory..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-[#DC2626]/20 focus:border-transparent outline-none transition-all placeholder:text-gray-400 text-sm"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-20 flex justify-center">
            <Loader text="Loading inventory data..." />
          </div>
        ) : products.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-zinc-900/50 border-b border-gray-100 dark:border-zinc-800">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Product Info</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">SKU</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock Level</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Unit Value</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-zinc-800/50">
                {products.map((product) => (
                  <tr 
                    key={product._id}
                    className="group hover:bg-gray-50/50 dark:hover:bg-zinc-800/50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 min-w-[2.5rem] rounded-lg overflow-hidden bg-gray-100 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700">
                          {product.images?.[0]?.url ? (
                            <img 
                              src={product.images[0].url} 
                              alt={product.name} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-gray-400">
                              <Package className="w-5 h-5" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-white truncate max-w-[200px]" title={product.name}>
                            {product.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-mono text-gray-500 dark:text-gray-400">
                      {product.sku || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md bg-gray-100 dark:bg-zinc-800 text-xs font-medium text-gray-600 dark:text-gray-400">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StockEditor product={product} onManage={setSelectedProduct} />
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 font-mono">
                      {formatCurrency(product.price * (product.stock || 0))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={Package}
            title={debouncedSearch ? "No products found" : "Your inventory is empty"}
            description={debouncedSearch ? "Try adjusting your search terms." : "Add products to start tracking inventory."}
            actionLabel="Add Product"
            onAction={() => navigate('/dashboard/products/new')}
          />
        )}
        
        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="border-t border-gray-100 dark:border-zinc-800 p-4 flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Page {pagination.page} of {pagination.pages}
            </span>
            <div className="flex gap-2">
              <button
                disabled={pagination.page === 1}
                onClick={() => handlePageChange(pagination.page - 1)}
                className="px-4 py-2 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <button
                disabled={pagination.page === pagination.pages}
                onClick={() => handlePageChange(pagination.page + 1)}
                className="px-4 py-2 border border-gray-200 dark:border-zinc-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
