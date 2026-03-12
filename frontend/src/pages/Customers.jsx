import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, X, Users, MoreHorizontal, Plus,
  Eye, Edit, Trash2, Phone, ShoppingBag
} from 'lucide-react';
import { customerService } from '../services/customerService';
import Loader from '../components/common/Loader';
import Badge from '../components/common/Badge';
import Pagination from '../components/common/Pagination';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useDebounce } from '../hooks/useDebounce';
import { formatCurrency, formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

/* -- Design tokens -------------------------------------------- */
const CARD = 'bg-white dark:bg-[#0d0d0d] rounded-2xl shadow-sm border border-gray-100 dark:border-white/[0.07]';
const DIV  = 'border-gray-100 dark:border-white/[0.07]';
const SUB  = 'text-gray-400 dark:text-[#5a5a7a]';

const GROUP_CONFIG = {
  regular:   { label: 'Regular',   color: 'gray'  },
  vip:       { label: 'VIP',       color: 'purple' },
  wholesale: { label: 'Wholesale', color: 'blue'   },
  new:       { label: 'New',       color: 'green'  },
};

const STATUS_TABS = [
  { id: '',          label: 'All Customers' },
  { id: 'vip',       label: 'VIP Members'    },
  { id: 'wholesale', label: 'Wholesale B2B'  },
  { id: 'new',       label: 'New Leads'     },
];

/* -- Row action menu ------------------------------------------- */
function RowMenu({ onView, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  return (
    <div ref={ref} className="relative flex justify-end">
      <button
        onClick={e => { e.stopPropagation(); setOpen(p => !p); }}
        className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
      >
        <MoreHorizontal className="w-5 h-5" />
      </button>
      {open && (
        <div className={`absolute right-0 top-full mt-1 z-30 w-40 ${CARD} shadow-xl py-1.5 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150`}>
          {[
            { icon: Eye,   label: 'View Profile', fn: onView,   cls: '' },
            { icon: Edit,  label: 'Edit Details', fn: onEdit,   cls: '' },
            { icon: Trash2,label: 'Delete Record',fn: onDelete, cls: 'text-red-600 dark:text-red-400 font-bold' },
          ].map(({ icon: Icon, label, fn, cls }) => (
            <button
              key={label}
              onClick={e => { e.stopPropagation(); setOpen(false); fn(e); }}
              className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors ${cls}`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* -- Customer modal -------------------------------------------- */
function CustomerModal({ customer, mode, onClose, onSaved }) {
  const isEdit = mode === 'edit' || mode === 'view';
  const readOnly = mode === 'view';
  const [form, setForm] = useState({
    firstName: customer?.firstName || '',
    lastName:  customer?.lastName  || '',
    email:     customer?.email     || '',
    phone:     customer?.phone     || '',
    group:     customer?.group     || 'regular',
  });
  const [saving, setSaving] = useState(false);

  const up = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isEdit && customer?._id) {
        await customerService.updateCustomer(customer._id, form);
        toast.success('Customer profile synchronized');
      } else {
        await customerService.createCustomer(form);
        toast.success('New customer profile created');
      }
      onSaved?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Synchronization failed');
    } finally { setSaving(false); }
  };

  const fields = [
    { key: 'firstName', label: 'First Name',   type: 'text'  },
    { key: 'lastName',  label: 'Last Name',    type: 'text'  },
    { key: 'email',     label: 'Email Address', type: 'email' },
    { key: 'phone',     label: 'Phone Contact', type: 'tel'   },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className={`relative w-full max-w-md ${CARD} shadow-2xl p-7 z-10 max-h-[90vh] overflow-y-auto custom-scrollbar`}>
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-black text-gray-900 dark:text-gray-300 uppercase tracking-wider">
            {mode === 'view' ? 'Client Profile' : isEdit ? 'Edit Relationship' : 'New Customer Intake'}
          </p>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 dark:hover:bg-white/5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {fields.slice(0, 2).map(f => (
              <div key={f.key}>
                <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a] mb-1.5">{f.label}</label>
                <input type={f.type} value={form[f.key]} onChange={up(f.key)} disabled={readOnly}
                  className={`w-full px-4 py-2.5 text-sm font-medium border ${DIV} bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-[#DC2626]/10 transition-all disabled:opacity-50`} />
              </div>
            ))}
          </div>
          {fields.slice(2).map(f => (
            <div key={f.key}>
              <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a] mb-1.5">{f.label}</label>
              <input type={f.type} value={form[f.key]} onChange={up(f.key)} disabled={readOnly}
                className={`w-full px-4 py-2.5 text-sm font-medium border ${DIV} bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-[#DC2626]/10 transition-all disabled:opacity-50`} />
            </div>
          ))}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a] mb-1.5">Segment Group</label>
            <select value={form.group} onChange={up('group')} disabled={readOnly}
              className={`w-full px-4 py-2.5 text-sm font-bold border ${DIV} bg-white dark:bg-white/[0.05] text-gray-900 dark:text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-[#DC2626]/10 transition-all cursor-pointer`}>
              {Object.entries(GROUP_CONFIG).map(([k, v]) => <option key={k} value={k} className="bg-white dark:bg-[#1a1a1a]">{v.label}</option>)}
            </select>
          </div>

          {mode === 'view' && customer && (
            <div className={`grid grid-cols-2 gap-4 pt-4 mt-4 border-t ${DIV}`}>
              {[
                { icon: ShoppingBag, label: 'Order Volume',    val: customer.totalOrders ?? 0      },
                { icon: null,        label: 'Lifetime Value',  val: formatCurrency(customer.totalSpent || 0) },
              ].map(({ icon: Ic, label, val }) => (
                <div key={label} className="bg-gray-50/50 dark:bg-white/[0.03] rounded-xl p-4 border border-gray-100 dark:border-white/[0.05]">
                  <p className={`text-[10px] font-black uppercase tracking-widest ${SUB} mb-1`}>{label}</p>
                  <p className="text-sm font-black text-gray-900 dark:text-white">{val}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        {!readOnly && (
          <div className="flex gap-3 mt-7">
            <button onClick={onClose} className="flex-1 py-2.5 text-sm font-bold text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Cancel</button>
            <button onClick={handleSave} disabled={saving} className="flex-1 py-2.5 text-sm font-black text-white bg-[#DC2626] rounded-xl hover:bg-[#b91c1c] disabled:opacity-50 transition-all shadow-md active:scale-95">
              {saving ? 'Processing...' : isEdit ? 'Update Client' : 'Add to Directory'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------
   PAGE
--------------------------------------------------------------- */
export default function Customers() {
  const navigate = useNavigate();
  const [customers,    setCustomers]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [pg,           setPg]           = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [search,       setSearch]       = useState('');
  const [groupFilter,  setGroupFilter]  = useState('');
  const [modal,        setModal]        = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [selected,     setSelected]     = useState(new Set());
  const [bulkGroup,    setBulkGroup]     = useState('vip');
  const [bulkLoading,  setBulkLoading]   = useState(false);

  const ds = useDebounce(search, 400);

  const fetchCustomers = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (groupFilter) params.group = groupFilter;
      if (ds) params.search = ds;
      const r = await customerService.getCustomers(params);
      setCustomers(r.data || []);
      setPg(r.pagination || { page: 1, limit: 20, total: 0, pages: 0 });
    } catch { toast.error('Communication error with customer database'); }
    finally { setLoading(false); }
  }, [groupFilter, ds]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const toggleSelect = id => setSelected(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const allSelected = customers.length > 0 && customers.every(c => selected.has(c._id));
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(customers.map(c => c._id)));

  const handleBulkGroup = async () => {
    if (selected.size === 0) return;
    setBulkLoading(true);
    try {
      await customerService.bulkUpdateGroup([...selected], bulkGroup);
      toast.success(`${selected.size} accounts relocated to "${GROUP_CONFIG[bulkGroup]?.label}"`);
      setSelected(new Set());
      fetchCustomers(pg.page);
    } catch { toast.error('Bulk reassignment failed'); }
    finally { setBulkLoading(false); }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await customerService.deleteCustomer(deleteTarget._id);
      toast.success('Customer record expunged');
      fetchCustomers(pg.page);
    } catch { toast.error('Deletion protocol failed'); }
    finally { setDeleteTarget(null); }
  };

  const initials = c => `${c.firstName?.[0] || ''}${c.lastName?.[0] || ''}`.toUpperCase() || 'U';
  const AVATAR_COLORS = ['from-[#DC2626] to-[#b91c1c]','from-indigo-500 to-indigo-700','from-emerald-500 to-emerald-700','from-amber-500 to-amber-700','from-violet-500 to-violet-700'];
  const avatarColor = c => AVATAR_COLORS[(c.firstName?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

  return (
    <div className="max-w-[1200px] mx-auto space-y-6 pb-12 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-end justify-between pt-4">
        <div>
          <p className="text-[13px] font-bold uppercase tracking-widest text-[#dc2626] mb-1">CRM</p>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Customer Intelligence</h1>
        </div>
        <button
          onClick={() => setModal({ mode: 'add', customer: null })}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-black text-white bg-[#DC2626] rounded-xl hover:bg-[#b91c1c] transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" /> New Customer
        </button>
      </div>

      {/* Main card */}
      <div className={`${CARD} overflow-hidden`}>
        {/* Group tabs */}
        <div className={`flex gap-2 px-2 border-b ${DIV} bg-gray-50/30 dark:bg-white/[0.01] overflow-x-auto scrollbar-hide`}>
          {STATUS_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setGroupFilter(tab.id)}
              className={`px-4 py-3.5 text-sm font-bold whitespace-nowrap border-b-2 transition-all ${
                groupFilter === tab.id
                  ? 'border-[#DC2626] text-[#DC2626]'
                  : `border-transparent text-gray-400 dark:text-[#5a5a7a] hover:text-gray-900 dark:hover:text-[#a0a0c0]`
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bulk action bar */}
        {selected.size > 0 && (
          <div className={`flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-3.5 bg-[#DC2626]/[0.02] dark:bg-[#DC2626]/[0.06] border-b ${DIV} animate-in slide-in-from-top-2 duration-200`}>
            <span className="text-sm font-black text-[#dc2626] uppercase tracking-wider">{selected.size} Accounts Selected</span>
            <div className="flex items-center gap-3 ml-auto">
              <label className="text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a] flex items-center gap-2">
                <Users className="w-3.5 h-3.5" /> Move to group:
              </label>
              <select
                value={bulkGroup}
                onChange={e => setBulkGroup(e.target.value)}
                className={`text-xs font-bold border ${DIV} bg-white dark:bg-white/5 text-gray-900 dark:text-white rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 transition-all cursor-pointer`}
              >
                {Object.entries(GROUP_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
              <button
                onClick={handleBulkGroup}
                disabled={bulkLoading}
                className="px-4 py-1.5 text-xs font-black text-white bg-[#dc2626] rounded-lg disabled:opacity-50 transition-all shadow-sm active:scale-95"
              >
                {bulkLoading ? 'Updating...' : 'Confirm'}
              </button>
              <div className="w-px h-6 bg-gray-200 dark:bg-white/10 mx-1" />
              <button onClick={() => setSelected(new Set())} className="text-xs font-bold text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">Dismiss</button>
            </div>
          </div>
        )}

        {/* Search */}
        <div className={`flex items-center gap-4 px-5 py-4 border-b ${DIV}`}>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#4a4a6e]" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Filter by name, ID or email..."
              className="w-full pl-10 pr-10 py-2.5 text-sm font-medium rounded-xl border border-gray-100 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.03] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#4a4a6e] focus:outline-none focus:ring-4 focus:ring-[#DC2626]/10 transition-all"
            />
            {search && <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 dark:hover:text-white"><X className="w-4 h-4" /></button>}
          </div>
          <span className="ml-auto text-xs font-bold text-gray-400 dark:text-[#5a5a7a] uppercase tracking-wider">{pg.total} Total Profiles</span>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-24 flex justify-center"><Loader text="Aggregating records..." /></div>
        ) : customers.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center gap-5 text-center px-6">
            <div className="w-20 h-20 bg-gray-50 dark:bg-white/[0.04] rounded-full flex items-center justify-center">
              <Users className="w-10 h-10 text-gray-300 dark:text-[#3a3a5a]" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">No matches found</p>
              <p className={`text-sm ${SUB} mt-1 max-w-sm`}>{search || groupFilter ? 'No accounts match the specified intelligence parameters.' : 'Your directory is empty. Client profiles will populate automatically after order fulfillment.'}</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className={`border-b ${DIV} bg-gray-50/50 dark:bg-white/[0.03]`}>
                  <th className="px-5 py-4 w-12 text-center">
                    <input type="checkbox" checked={allSelected} onChange={toggleAll}
                      className="w-4.5 h-4.5 rounded-lg border-gray-200 dark:border-white/10 text-[#dc2626] focus:ring-[#dc2626]/20 cursor-pointer transition-all" />
                  </th>
                  <th className="px-4 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a]">Full Identity</th>
                  <th className="px-4 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a] hidden sm:table-cell">Contact</th>
                  <th className="px-4 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a]">Classification</th>
                  <th className="px-4 py-4 text-center text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a] hidden md:table-cell">LVM</th>
                  <th className="px-4 py-4 text-right text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a] hidden lg:table-cell">LTV Value</th>
                  <th className="px-4 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a] hidden xl:table-cell">Acquired</th>
                  <th className="w-12 pr-5" />
                </tr>
              </thead>
              <tbody className={`divide-y ${DIV}`}>
                {customers.map((cust, idx) => {
                  const isSelected = selected.has(cust._id);
                  const grp = GROUP_CONFIG[cust.group] || GROUP_CONFIG.regular;
                  
                  const handleRowClick = () => {
                    console.log('Clicked customer:', cust._id);
                    navigate(`/dashboard/customers/${cust._id}`);
                  };
                  
                  return (
                    <motion.tr 
                      key={cust._id} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      onClick={handleRowClick}
                      className={`group transition-all duration-150 cursor-pointer ${isSelected ? 'bg-[#dc2626]/[0.03] dark:bg-[#dc2626]/[0.05]' : 'hover:bg-gray-50/50 dark:hover:bg-white/[0.01]'}`}
                    >
                      <td className="px-5 py-4 text-center">
                        <input type="checkbox" checked={selected.has(cust._id)} onChange={(e) => { e.stopPropagation(); toggleSelect(cust._id); }}
                          className="w-4.5 h-4.5 rounded-lg border-gray-200 dark:border-white/10 text-[#dc2626] focus:ring-[#dc2626]/20 cursor-pointer transition-all" />
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className={`w-10 h-10 bg-gradient-to-br ${avatarColor(cust)} rounded-xl flex items-center justify-center text-white text-[11px] font-black shadow-md shrink-0 group-hover:scale-105 transition-transform`}>
                            {initials(cust)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-[#dc2626] transition-colors">{cust.firstName} {cust.lastName}</p>
                            <p className={`text-[11px] font-bold ${SUB} truncate uppercase tracking-tight mt-0.5`}>{cust.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        {cust.phone && (
                          <div className="flex items-center gap-2 text-[13px] font-medium text-gray-600 dark:text-[#a0a0c8]">
                            <Phone className="w-3.5 h-3.5 text-gray-400" />{cust.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-4"><Badge color={grp.color}>{grp.label}</Badge></td>
                      <td className="px-4 py-4 text-center hidden md:table-cell">
                        <span className="text-sm font-black text-gray-900 dark:text-gray-300">{cust.totalOrders ?? 0}</span>
                      </td>
                      <td className="px-4 py-4 text-right hidden lg:table-cell">
                        <span className="text-sm font-black text-gray-900 dark:text-white">{formatCurrency(cust.totalSpent || 0)}</span>
                      </td>
                      <td className="px-4 py-4 hidden xl:table-cell">
                        <span className={`text-[13px] font-bold text-gray-600 dark:text-[#8888a8]`}>{formatDate(cust.createdAt)}</span>
                      </td>
                      <td className="pr-5 py-4">
                        <RowMenu
                          onView={(e) => { e.stopPropagation(); navigate(`/dashboard/customers/${cust._id}`); }}
                          onEdit={(e) => { e.stopPropagation(); setModal({ mode: 'edit', customer: cust }); }}
                          onDelete={(e) => { e.stopPropagation(); setDeleteTarget(cust); }}
                        />
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {pg.pages > 1 && (
          <div className={`px-6 py-4 border-t ${DIV} bg-gray-50/30 dark:bg-white/[0.01]`}>
            <Pagination 
                page={pg.page} 
                totalPages={pg.pages} 
                onPageChange={p => fetchCustomers(p)} 
                total={pg.total}
                limit={pg.limit}
            />
          </div>
        )}
      </div>

      {modal && (
        <CustomerModal
          mode={modal.mode}
          customer={modal.customer}
          onClose={() => setModal(null)}
          onSaved={() => fetchCustomers(pg.page)}
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Protocol: Deletion"
        message={`Are you certain you wish to purge the record of "${deleteTarget?.firstName} ${deleteTarget?.lastName}"? Information recovery will not be possible.`}
        confirmLabel="Expunge Record"
        variant="danger"
        onConfirm={handleDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}