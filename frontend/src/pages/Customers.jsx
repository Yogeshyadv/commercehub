import { useState, useEffect, useCallback } from 'react';
import { HiOutlineUsers, HiOutlineMail, HiOutlinePhone } from 'react-icons/hi';
import { customerService } from '../services/customerService';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Badge from '../components/common/Badge';
import Pagination from '../components/common/Pagination';
import SearchBar from '../components/common/SearchBar';
import { useDebounce } from '../hooks/useDebounce';
import { formatCurrency, formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

const groupColors = { regular: 'gray', vip: 'purple', wholesale: 'blue', new: 'green' };

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pg, setPg] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [search, setSearch] = useState('');
  const ds = useDebounce(search, 400);

  const fetchCustomers = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (ds) params.search = ds;
      const r = await customerService.getCustomers(params);
      setCustomers(r.data || []);
      setPg(r.pagination || { page: 1, limit: 10, total: 0, pages: 0 });
    } catch { toast.error('Failed to load customers'); }
    finally { setLoading(false); }
  }, [ds]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-gray-500 mt-1">{pg.total} total customers</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search customers by name, email..." className="max-w-md" />
      </div>

      {loading ? <Loader /> : customers.length === 0 ? (
        <EmptyState icon={HiOutlineUsers} title="No customers yet" description="Customers will appear here once they place orders or sign up." />
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Group</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Order</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {customers.map(c => (
                    <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-primary-700 font-semibold text-sm">
                              {c.name?.[0]?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-900">{c.name}</p>
                            {c.company && <p className="text-xs text-gray-400">{c.company}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {c.email && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <HiOutlineMail className="h-3 w-3" />{c.email}
                            </div>
                          )}
                          {c.phone && (
                            <div className="flex items-center gap-1 text-xs text-gray-500">
                              <HiOutlinePhone className="h-3 w-3" />{c.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4"><Badge color={groupColors[c.group] || 'gray'}>{c.group}</Badge></td>
                      <td className="px-6 py-4 text-sm font-medium">{c.stats?.totalOrders || 0}</td>
                      <td className="px-6 py-4 text-sm font-medium">{formatCurrency(c.stats?.totalSpent || 0)}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{formatDate(c.stats?.lastOrderDate)}</td>
                      <td className="px-6 py-4"><Badge color="blue">{c.source || 'website'}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <Pagination page={pg.page} totalPages={pg.pages} total={pg.total} limit={pg.limit} onPageChange={p => fetchCustomers(p)} />
        </>
      )}
    </div>
  );
}