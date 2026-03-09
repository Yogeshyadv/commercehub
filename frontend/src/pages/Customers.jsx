import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search, X, Users, MoreHorizontal, Plus,
  Eye, Edit, Trash2, Mail, Phone, ShoppingBag
} from 'lucide-react';
import { customerService } from '../services/customerService';
import Loader from '../components/common/Loader';
import Badge from '../components/common/Badge';
import Pagination from '../components/common/Pagination';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useDebounce } from '../hooks/useDebounce';
import { formatCurrency, formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

/* ── Polaris tokens ──────────────────────────────────────────── */
const CARD = 'bg-white dark:bg-[#1a1a24] rounded-xl shadow-[0_0_0_1px_rgba(26,26,26,0.13),0_1px_0_0_rgba(26,26,26,0.07)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.10),0_1px_0_0_rgba(0,0,0,0.32)]';
const DIV  = 'border-[#e1e3e5] dark:border-white/[0.08]';
const SUB  = 'text-[#6d7175] dark:text-[#9898b8]';

const GROUP_CONFIG = {
  regular:   { label: 'Regular',   color: 'gray'  },
  vip:       { label: 'VIP',       color: 'purple' },
  wholesale: { label: 'Wholesale', color: 'blue'   },
  new:       { label: 'New',       color: 'green'  },
};

const STATUS_TABS = [
  { id: '', label: 'All' },
  { id: 'vip',       label: 'VIP'       },
  { id: 'wholesale', label: 'Wholesale' },
  { id: 'new',       label: 'New'       },
];

/* ── Row action menu ─────────────────────────────────────────── */
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
        className="p-1.5 rounded-lg text-[#6d7175] hover:bg-[#f6f6f7] dark:hover:bg-white/[0.06] hover:text-[#1a1a1a] dark:hover:text-white transition-colors"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {open && (
        <div className={`absolute right-0 top-8 z-20 w-40 ${CARD} py-1 animate-scale-in`}>
          {[
            { icon: Eye,   label: 'View',   fn: onView,   cls: '' },
            { icon: Edit,  label: 'Edit',   fn: onEdit,   cls: '' },
            { icon: Trash2,label: 'Delete', fn: onDelete, cls: 'text-red-600' },
          ].map(({ icon: Icon, label, fn, cls }) => (
            <button
              key={label}
              onClick={e => { e.stopPropagation(); setOpen(false); fn?.(); }}
              className={`flex items-center gap-2 w-full px-3 py-2 text-sm hover:bg-[#f6f6f7] dark:hover:bg-white/[0.05] transition-colors ${cls || 'text-[#303030] dark:text-[#d4d4d4]'}`}
            >
              <Icon className="w-4 h-4" />{label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Customer modal ──────────────────────────────────────────── */
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
        toast.success('Customer updated');
      } else {
        await customerService.createCustomer(form);
        toast.success('Customer created');
      }
      onSaved?.();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    } finally { setSaving(false); }
  };

  const fields = [
    { key: 'firstName', label: 'First name',   type: 'text'  },
    { key: 'lastName',  label: 'Last name',    type: 'text'  },
    { key: 'email',     label: 'Email',        type: 'email' },
    { key: 'phone',     label: 'Phone',        type: 'tel'   },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-md ${CARD} p-6 z-10 max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-bold text-[#1a1a1a] dark:text-[#e3e3e3]">
            {mode === 'view' ? 'Customer details' : isEdit ? 'Edit customer' : 'Add customer'}
          </p>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#f6f6f7] dark:hover:bg-white/[0.06] transition-colors">
            <X className="w-4 h-4 text-[#6d7175]" />
          </button>
        </div>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            {fields.slice(0, 2).map(f => (
              <div key={f.key}>
                <label className="block text-xs font-semibold text-[#6d7175] dark:text-[#9898b8] mb-1">{f.label}</label>
                <input type={f.type} value={form[f.key]} onChange={up(f.key)} disabled={readOnly}
                  className={`w-full px-3 py-2 text-sm border ${DIV} bg-white dark:bg-[#23233a] text-[#1a1a1a] dark:text-[#e3e3e3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 transition-all disabled:opacity-60`} />
              </div>
            ))}
          </div>
          {fields.slice(2).map(f => (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-[#6d7175] dark:text-[#9898b8] mb-1">{f.label}</label>
              <input type={f.type} value={form[f.key]} onChange={up(f.key)} disabled={readOnly}
                className={`w-full px-3 py-2 text-sm border ${DIV} bg-white dark:bg-[#23233a] text-[#1a1a1a] dark:text-[#e3e3e3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 transition-all disabled:opacity-60`} />
            </div>
          ))}
          <div>
            <label className="block text-xs font-semibold text-[#6d7175] dark:text-[#9898b8] mb-1">Customer group</label>
            <select value={form.group} onChange={up('group')} disabled={readOnly}
              className={`w-full px-3 py-2 text-sm border ${DIV} bg-white dark:bg-[#23233a] text-[#1a1a1a] dark:text-[#e3e3e3] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 transition-all disabled:opacity-60`}>
              {Object.entries(GROUP_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </select>
          </div>

          {mode === 'view' && customer && (
            <div className={`grid grid-cols-2 gap-3 pt-2 mt-2 border-t ${DIV}`}>
              {[
                { icon: ShoppingBag, label: 'Orders',        val: customer.totalOrders ?? 0      },
                { icon: null,        label: 'Total spent',   val: formatCurrency(customer.totalSpent || 0) },
              ].map(({ icon: Ic, label, val }) => (
                <div key={label} className="bg-[#f6f6f7] dark:bg-white/[0.04] rounded-lg p-3">
                  <p className={`text-xs ${SUB} mb-0.5`}>{label}</p>
                  <p className="text-sm font-bold text-[#1a1a1a] dark:text-[#e3e3e3]">{val}</p>
                </div>
              ))}
            </div>
          )}
        </div>
        {!readOnly && (
          <div className="flex gap-2.5 mt-5">
            <button onClick={onClose} className={`flex-1 py-2 text-sm font-semibold text-[#1a1a1a] dark:text-[#d4d4d4] border ${DIV} rounded-lg hover:bg-[#f6f6f7] dark:hover:bg-white/[0.05] transition-colors`}>Cancel</button>
            <button onClick={handleSave} disabled={saving} className="flex-1 py-2 text-sm font-semibold text-white bg-[#DC2626] rounded-lg hover:bg-[#b91c1c] disabled:opacity-50 transition-colors shadow-[0_1px_0_rgba(0,0,0,0.2)]">
              {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Add customer'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════════ */
export default function Customers() {
  const [customers,    setCustomers]    = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [pg,           setPg]           = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [search,       setSearch]       = useState('');
  const [groupFilter,  setGroupFilter]  = useState('');
  const [modal,        setModal]        = useState(null); // { mode, customer }
  const [deleteTarget, setDeleteTarget] = useState(null);

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
    } catch { toast.error('Failed to load customers'); }
    finally { setLoading(false); }
  }, [groupFilter, ds]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await customerService.deleteCustomer(deleteTarget._id);
      toast.success('Customer deleted');
      fetchCustomers(pg.page);
    } catch { toast.error('Failed to delete customer'); }
    finally { setDeleteTarget(null); }
  };

  const initials = c => `${c.firstName?.[0] || ''}${c.lastName?.[0] || ''}`.toUpperCase() || 'U';
  const AVATAR_COLORS = ['from-[#DC2626] to-[#9b1c1c]','from-indigo-500 to-indigo-700','from-emerald-500 to-emerald-700','from-amber-500 to-amber-700','from-violet-500 to-violet-700'];
  const avatarColor = c => AVATAR_COLORS[(c.firstName?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

  return (
    <div className="max-w-[1200px] mx-auto space-y-5 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <h1 className="text-[1.375rem] font-bold text-[#1a1a1a] dark:text-[#e3e3e3]">Customers</h1>
        <button
          onClick={() => setModal({ mode: 'add', customer: null })}
          className="flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-white bg-[#DC2626] rounded-lg hover:bg-[#b91c1c] transition-colors shadow-[0_1px_0_rgba(0,0,0,0.2)]"
        >
          <Plus className="w-4 h-4" /> Add customer
        </button>
      </div>

      {/* Main card */}
      <div className={CARD}>
        {/* Group tabs */}
        <div className={`flex gap-0 border-b ${DIV} overflow-x-auto scrollbar-hide`}>
          {STATUS_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setGroupFilter(tab.id)}
              className={`px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                groupFilter === tab.id
                  ? 'border-[#DC2626] text-[#DC2626]'
                  : `border-transparent ${SUB} hover:text-[#1a1a1a] dark:hover:text-[#e3e3e3]`
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className={`flex items-center gap-3 px-4 py-3 border-b ${DIV}`}>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6d7175]" />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search customers"
              className={`w-full pl-9 pr-9 py-2 text-sm rounded-lg border ${DIV} bg-white dark:bg-[#23233a] text-[#1a1a1a] dark:text-[#e3e3e3] placeholder-[#6d7175] focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 transition-all`}
            />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7175]"><X className="w-3.5 h-3.5" /></button>}
          </div>
          <span className="ml-auto text-xs text-[#6d7175] dark:text-[#9898b8] whitespace-nowrap">{pg.total} customer{pg.total !== 1 ? 's' : ''}</span>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-20 flex justify-center"><Loader text="Loading customers..." /></div>
        ) : customers.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-[#f6f6f7] dark:bg-white/[0.05] rounded-full flex items-center justify-center">
              <Users className="w-7 h-7 text-[#c9cccf] dark:text-[#4a4a6a]" />
            </div>
            <p className="text-sm font-semibold text-[#1a1a1a] dark:text-[#e3e3e3]">No customers found</p>
            <p className={`text-xs ${SUB}`}>{search || groupFilter ? 'Try changing your filters.' : 'Customers will appear here after their first order.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className={`border-b ${DIV} bg-[#fafafa] dark:bg-white/[0.02]`}>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6d7175] dark:text-[#9898b8] uppercase tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6d7175] dark:text-[#9898b8] uppercase tracking-wider hidden sm:table-cell">Contact</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6d7175] dark:text-[#9898b8] uppercase tracking-wider">Group</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-[#6d7175] dark:text-[#9898b8] uppercase tracking-wider hidden md:table-cell">Orders</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[#6d7175] dark:text-[#9898b8] uppercase tracking-wider hidden lg:table-cell">Spent</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6d7175] dark:text-[#9898b8] uppercase tracking-wider hidden xl:table-cell">Joined</th>
                  <th className="w-12" />
                </tr>
              </thead>
              <tbody className={`divide-y ${DIV}`}>
                {customers.map(cust => {
                  const gc = GROUP_CONFIG[cust.group] || GROUP_CONFIG.regular;
                  return (
                    <tr key={cust._id} className="group hover:bg-[#f6f6f7] dark:hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 bg-gradient-to-br ${avatarColor(cust)} rounded-lg flex items-center justify-center text-white text-xs font-black shrink-0`}>
                            {initials(cust)}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#1a1a1a] dark:text-[#e3e3e3] truncate">{cust.firstName} {cust.lastName}</p>
                            <p className={`text-xs ${SUB} truncate`}>{cust.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        {cust.phone && (
                          <div className="flex items-center gap-1.5 text-xs text-[#303030] dark:text-[#d4d4d4]">
                            <Phone className="w-3 h-3 text-[#6d7175]" />{cust.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3.5"><Badge color={gc.color}>{gc.label}</Badge></td>
                      <td className="px-4 py-3.5 text-center hidden md:table-cell">
                        <span className="text-sm font-semibold text-[#303030] dark:text-[#d4d4d4]">{cust.totalOrders ?? 0}</span>
                      </td>
                      <td className="px-4 py-3.5 text-right hidden lg:table-cell">
                        <span className="text-sm font-bold text-[#1a1a1a] dark:text-[#e3e3e3]">{formatCurrency(cust.totalSpent || 0)}</span>
                      </td>
                      <td className="px-4 py-3.5 hidden xl:table-cell">
                        <span className={`text-xs ${SUB}`}>{formatDate(cust.createdAt)}</span>
                      </td>
                      <td className="pr-3">
                        <RowMenu
                          onView={() => setModal({ mode: 'view', customer: cust })}
                          onEdit={() => setModal({ mode: 'edit', customer: cust })}
                          onDelete={() => setDeleteTarget(cust)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {pg.pages > 1 && (
          <div className={`px-4 py-3.5 border-t ${DIV} flex items-center justify-between`}>
            <p className="text-xs text-[#6d7175] dark:text-[#9898b8]">
              Showing {((pg.page - 1) * pg.limit) + 1}–{Math.min(pg.page * pg.limit, pg.total)} of {pg.total}
            </p>
            <Pagination currentPage={pg.page} totalPages={pg.pages} onPageChange={p => fetchCustomers(p)} />
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

      {deleteTarget && (
        <ConfirmDialog
          isOpen
          title="Delete customer"
          message={`Delete ${deleteTarget.firstName} ${deleteTarget.lastName}? This cannot be undone.`}
          confirmLabel="Delete"
          confirmVariant="danger"
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}