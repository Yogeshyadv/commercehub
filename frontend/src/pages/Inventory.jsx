import { useState, useEffect } from 'react';
import { HiOutlineCube, HiOutlineExclamationCircle, HiOutlineRefresh } from 'react-icons/hi';
import { productService } from '../services/productService';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Badge from '../components/common/Badge';
import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import { useDebounce } from '../hooks/useDebounce';
import { formatCurrency } from '../utils/formatters';
import Button from '../components/common/Button';
import toast from 'react-hot-toast';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pg, setPg] = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [search, setSearch] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const ds = useDebounce(search, 400);

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);
      const params = { page, limit: 20, sort: 'stock' };
      if (ds) params.search = ds;
      if (stockFilter === 'low') params.maxPrice = undefined; // we'll filter client-side
      const r = await productService.getProducts(params);
      let data = r.data || [];
      if (stockFilter === 'low') data = data.filter(p => p.stock <= 10);
      if (stockFilter === 'out') data = data.filter(p => p.stock === 0);
      setProducts(data);
      setPg(r.pagination || { page: 1, limit: 20, total: 0, pages: 0 });
    } catch { toast.error('Failed to load inventory'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, [ds, stockFilter]);

  const getStockBadge = (stock) => {
    if (stock === 0) return <Badge color="red">Out of Stock</Badge>;
    if (stock <= 10) return <Badge color="yellow">Low Stock ({stock})</Badge>;
    return <Badge color="green">In Stock ({stock})</Badge>;
  };

  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const lowStockCount = products.filter(p => p.stock <= 10 && p.stock > 0).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-gray-500 mt-1">Track and manage your stock levels</p>
        </div>
        <Button variant="secondary" icon={HiOutlineRefresh} onClick={() => fetchProducts()}>Refresh</Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Products</p>
          <p className="text-2xl font-bold text-gray-900">{pg.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Inventory Value</p>
          <p className="text-2xl font-bold text-green-600">{formatCurrency(totalValue)}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl shadow-sm border border-yellow-200 p-4">
          <p className="text-sm text-yellow-700">Low Stock</p>
          <p className="text-2xl font-bold text-yellow-600">{lowStockCount}</p>
        </div>
        <div className="bg-red-50 rounded-xl shadow-sm border border-red-200 p-4">
          <p className="text-sm text-red-700">Out of Stock</p>
          <p className="text-2xl font-bold text-red-600">{outOfStockCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <SearchBar value={search} onChange={setSearch} placeholder="Search by name or SKU..." className="flex-1" />
          <select className="w-full sm:w-44 px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={stockFilter} onChange={e => setStockFilter(e.target.value)}>
            <option value="">All Stock Levels</option>
            <option value="low">Low Stock (≤10)</option>
            <option value="out">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* Table */}
      {loading ? <Loader /> : products.length === 0 ? (
        <EmptyState icon={HiOutlineCube} title="No products in inventory" description="Add products to start tracking inventory" />
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {products.map(p => (
                    <tr key={p._id} className={`hover:bg-gray-50 transition-colors ${p.stock === 0 ? 'bg-red-50/50' : p.stock <= 10 ? 'bg-yellow-50/50' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {p.images?.[0]?.url ? (
                            <img src={p.images[0].url} alt={p.name} className="h-10 w-10 rounded-lg object-cover" />
                          ) : (
                            <div className="h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              <HiOutlineCube className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                          <span className="font-medium text-sm text-gray-900 truncate max-w-[200px]">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{p.sku || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{p.category}</td>
                      <td className="px-6 py-4 text-sm font-medium">{formatCurrency(p.price)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {p.stock <= 10 && p.stock > 0 && <HiOutlineExclamationCircle className="h-4 w-4 text-yellow-500" />}
                          <span className={`font-bold text-sm ${p.stock === 0 ? 'text-red-600' : p.stock <= 10 ? 'text-yellow-600' : 'text-gray-900'}`}>
                            {p.stock}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{formatCurrency(p.price * p.stock)}</td>
                      <td className="px-6 py-4">{getStockBadge(p.stock)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination page={pg.page} totalPages={pg.pages} total={pg.total} limit={pg.limit} onPageChange={p => fetchProducts(p)} />
        </>
      )}
    </div>
  );
}

