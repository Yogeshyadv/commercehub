import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users, Mail, Phone, Search, TrendingUp,
  ShoppingBag, Crown, Filter, Plus, UserPlus,
  MoreVertical, Edit, Trash2, ArrowUpDown
} from 'lucide-react';
import { customerService } from '../services/customerService';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Pagination from '../components/common/Pagination';
import CustomerModal from '../components/customers/CustomerModal';
import StatsCard from '../components/dashboard/StatsCard';
import Badge from '../components/common/Badge';
import { useDebounce } from '../hooks/useDebounce';
import { formatCurrency, formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

const GROUP_CONFIG = {
  regular: { label: 'Regular', color: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' },
  vip: { label: 'VIP', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  wholesale: { label: 'Wholesale', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  new: { label: 'New', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
};

export default function Customers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pg, setPg] = useState({ page: 1, limit: 15, total: 0, pages: 0 });
  const [search, setSearch] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  
  // Action States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);

  const ds = useDebounce(search, 400);

  const fetchCustomers = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = { page, limit: 15 };
      if (ds) params.search = ds;
      if (groupFilter) params.group = groupFilter;
      const r = await customerService.getCustomers(params);
      setCustomers(r.data || []);
      setPg(r.pagination || { page: 1, limit: 15, total: 0, pages: 0 });
    } catch { toast.error('Failed to load customers'); }
    finally { setLoading(false); }
  }, [ds, groupFilter]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  // Close menus on click outside
  useEffect(() => {
    const handleClick = () => setActiveMenu(null);
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const handleSave = async (data) => {
    if (selectedCustomer) {
      await customerService.updateCustomer(selectedCustomer._id, data);
      toast.success('Customer updated successfully');
    } else {
      await customerService.createCustomer(data);
      toast.success('Customer created successfully');
    }
    fetchCustomers(pg.page);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await customerService.deleteCustomer(deleteTarget._id);
      toast.success('Customer deleted successfully');
      setDeleteTarget(null);
      fetchCustomers(pg.page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete customer');
    } finally {
      setDeleting(false);
    }
  };

  const groupTabs = [
    { key: '', label: 'All' },
    { key: 'vip', label: 'VIP', icon: Crown },
    { key: 'wholesale', label: 'Wholesale', icon: ShoppingBag },
    { key: 'regular', label: 'Regular', icon: Users },
    { key: 'new', label: 'New', icon: UserPlus },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#111827] dark:text-white tracking-tight">Customers</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base">
            Manage your customer base, track orders, and engagement.
          </p>
        </div>
        
        <button 
          onClick={() => { setSelectedCustomer(null); setIsModalOpen(true); }}
          className="flex items-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold shadow-lg shadow-[#25D366]/20 transition-all transform hover:scale-105 active:scale-95"
        >
          <Plus className="w-5 h-5" strokeWidth={2.5} />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard icon={Users} title="Total Customers" value={pg.total} color="blue" subtitle="Across all groups" />
        <StatsCard icon={Crown} title="VIP Customers" value={customers.filter(c => c.group === 'vip').length} color="purple" subtitle="High value clients" />
        <StatsCard icon={ShoppingBag} title="Wholesale" value={customers.filter(c => c.group === 'wholesale').length} color="yellow" subtitle="Bulk buyers" />
        <StatsCard icon={TrendingUp} title="New Customers" value={customers.filter(c => c.group === 'new').length} color="green" subtitle="Joined this month" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col xl:flex-row gap-4 bg-white dark:bg-zinc-950 p-2 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search customers by name, email, phone..."
            className="w-full pl-11 pr-4 py-3 bg-transparent border-none focus:ring-2 focus:ring-[#25D366]/20 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none rounded-xl"
          />
        </div>
        <div className="h-px xl:h-auto xl:w-px bg-gray-100 dark:bg-gray-700 mx-2" />
        <div className="flex gap-2 overflow-x-auto pb-2 xl:pb-0 no-scrollbar px-2 xl:px-0">
          {groupTabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setGroupFilter(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap border ${
                groupFilter === tab.key
                  ? 'bg-[#25D366] text-white border-transparent shadow-lg shadow-[#25D366]/20'
                  : 'bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-zinc-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {tab.icon && <tab.icon className="w-4 h-4" />}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-24"><Loader text="Loading customers..." /></div>
      ) : customers.length === 0 ? (
        <EmptyState 
          icon={Users} 
          title="No customers found" 
          description={search ? `No customers match "${search}"` : "Start by adding your first customer."} 
          actionLabel={!search ? "Add Customer" : undefined}
          onAction={!search ? () => setIsModalOpen(true) : undefined}
          actionIcon={Plus}
        />
      ) : (
        <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-zinc-900/50">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Group</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Orders / Spent</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Last Order</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/60">
                {customers.map(c => {
                  const groupCfg = GROUP_CONFIG[c.group] || GROUP_CONFIG.regular;
                  const initials = c.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';
                  return (
                    <tr 
                      key={c._id} 
                      onClick={() => navigate(`/dashboard/customers/${c._id}`)}
                      className="hover:bg-gray-50/50 dark:hover:bg-zinc-900/50 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-[#25D366]/10 dark:bg-[#25D366]/20 flex items-center justify-center shrink-0 text-[#128C7E] dark:text-[#25D366] font-bold text-sm">
                            {initials}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-[#25D366] transition-colors">{c.name}</p>
                            {c.company && <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{c.company}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {c.email && (
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                              <Mail className="h-3.5 w-3.5" /> {c.email}
                            </div>
                          )}
                          {c.phone && (
                            <div className="flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                              <Phone className="h-3.5 w-3.5" /> {c.phone}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ring-1 ring-inset ${groupCfg.color} bg-opacity-10 ring-opacity-20`}>
                          {groupCfg.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{formatCurrency(c.stats?.totalSpent || 0)}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{c.stats?.totalOrders || 0} orders</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                          {c.stats?.lastOrderDate ? (
                            <>
                              <ShoppingBag className="w-3.5 h-3.5" />
                              {formatDate(c.stats.lastOrderDate)}
                            </>
                          ) : (
                            <span className="text-gray-400 italic">Never</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="relative inline-block text-left">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenu(activeMenu === c._id ? null : c._id);
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          {activeMenu === c._id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-100 dark:border-zinc-800 z-10 py-1 animate-in zoom-in-95 duration-200">
                              <button
                                onClick={() => { setSelectedCustomer(c); setIsModalOpen(true); setActiveMenu(null); }}
                                className="w-full text-left px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800 flex items-center gap-2"
                              >
                                <Edit className="w-4 h-4" /> Edit Details
                              </button>
                              <button
                                onClick={() => { setDeleteTarget(c); setActiveMenu(null); }}
                                className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" /> Delete Customer
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pg.pages > 1 && (
            <div className="flex justify-center p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-zinc-900/30">
              <Pagination
                page={pg.page}
                totalPages={pg.pages}
                total={pg.total}
                limit={pg.limit}
                onPageChange={(p) => fetchCustomers(p)}
              />
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <CustomerModal 
        isOpen={isModalOpen} 
        onClose={() => { setIsModalOpen(false); setSelectedCustomer(null); }} 
        customer={selectedCustomer}
        onSuccess={handleSave}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
        loading={deleting}
      />
    </div>
  );
}
