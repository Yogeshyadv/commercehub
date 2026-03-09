import { useState, useEffect, useCallback } from 'react';
import {
  Search, Clock, Truck, Package, CheckCircle2, XCircle,
  RotateCcw, Download, X, MapPin, CreditCard, ChevronRight,
  RefreshCw, Filter, Eye, ArrowRight
} from 'lucide-react';
import { orderService } from '../services/orderService';
import Loader from '../components/common/Loader';
import Badge from '../components/common/Badge';
import Pagination from '../components/common/Pagination';
import { useDebounce } from '../hooks/useDebounce';
import { formatCurrency, formatDate, formatDateTime } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { invoiceService } from '../services/invoiceService';
import toast from 'react-hot-toast';

/* ── Polaris tokens ──────────────────────────────────────────── */
const CARD = 'bg-white dark:bg-[#1a1a24] rounded-xl shadow-[0_0_0_1px_rgba(26,26,26,0.13),0_1px_0_0_rgba(26,26,26,0.07)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.10),0_1px_0_0_rgba(0,0,0,0.32)]';
const DIV  = 'border-[#e1e3e5] dark:border-white/[0.08]';
const SUB  = 'text-[#6d7175] dark:text-[#9898b8]';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    color: 'yellow', icon: Clock       },
  confirmed:  { label: 'Confirmed',  color: 'blue',   icon: CheckCircle2},
  processing: { label: 'Processing', color: 'indigo', icon: RefreshCw   },
  shipped:    { label: 'Shipped',    color: 'purple', icon: Truck       },
  delivered:  { label: 'Delivered',  color: 'green',  icon: CheckCircle2},
  cancelled:  { label: 'Cancelled',  color: 'red',    icon: XCircle     },
  refunded:   { label: 'Refunded',   color: 'gray',   icon: RotateCcw   },
  returned:   { label: 'Returned',   color: 'orange', icon: RotateCcw   },
};

const NEXT_STATUSES = {
  pending:    ['confirmed', 'cancelled'],
  confirmed:  ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped:    ['delivered', 'returned'],
  delivered:  ['returned', 'refunded'],
};

const STATUS_TABS = [
  { id: '', label: 'All' },
  { id: 'pending',    label: 'Pending'    },
  { id: 'confirmed',  label: 'Confirmed'  },
  { id: 'processing', label: 'Processing' },
  { id: 'shipped',    label: 'Shipped'    },
  { id: 'delivered',  label: 'Delivered'  },
  { id: 'cancelled',  label: 'Cancelled'  },
];

/* ── Status update modal ─────────────────────────────────────── */
function StatusModal({ order, onClose, onUpdated }) {
  const nexts = NEXT_STATUSES[order.status] || [];
  const [newStatus, setNewStatus] = useState(nexts[0] || '');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    if (!newStatus) return;
    setLoading(true);
    try {
      await orderService.updateOrderStatus(order._id, { status: newStatus, note });
      toast.success(`Order updated to ${STATUS_CONFIG[newStatus]?.label}`);
      onUpdated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative w-full max-w-sm ${CARD} p-6 z-10`}>
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-bold text-[#1a1a1a] dark:text-[#e3e3e3]">Update order status</p>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#f6f6f7] dark:hover:bg-white/[0.06] transition-colors">
            <X className="w-4 h-4 text-[#6d7175]" />
          </button>
        </div>
        <div className="space-y-3">
          {nexts.map(s => (
            <label key={s} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${newStatus === s ? `border-[#DC2626] bg-red-50 dark:bg-[#DC2626]/10` : `border-[#e1e3e5] dark:border-white/[0.08] hover:bg-[#f6f6f7] dark:hover:bg-white/[0.03]`}`}>
              <input type="radio" value={s} checked={newStatus === s} onChange={() => setNewStatus(s)} className="text-[#DC2626] focus:ring-[#DC2626]/20" />
              <span className="text-sm font-semibold text-[#1a1a1a] dark:text-[#e3e3e3]">{STATUS_CONFIG[s]?.label}</span>
            </label>
          ))}
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Add a note (optional)"
            rows={2}
            className={`w-full mt-2 px-3 py-2.5 text-sm border ${DIV} bg-white dark:bg-[#23233a] text-[#1a1a1a] dark:text-[#e3e3e3] placeholder-[#6d7175] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 resize-none`}
          />
        </div>
        <div className="flex items-center gap-2.5 mt-5">
          <button onClick={onClose} className={`flex-1 py-2 text-sm font-semibold text-[#1a1a1a] dark:text-[#d4d4d4] border ${DIV} rounded-lg hover:bg-[#f6f6f7] dark:hover:bg-white/[0.05] transition-colors`}>Cancel</button>
          <button onClick={handleUpdate} disabled={loading || !newStatus} className="flex-1 py-2 text-sm font-semibold text-white bg-[#DC2626] rounded-lg hover:bg-[#b91c1c] disabled:opacity-50 transition-colors shadow-[0_1px_0_rgba(0,0,0,0.2)]">
            {loading ? 'Saving…' : 'Update status'}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Order detail panel ──────────────────────────────────────── */
function DetailPanel({ order, isVendor, onClose, onStatusUpdate }) {
  const pct = { pending: 5, confirmed: 25, processing: 50, shipped: 75, delivered: 100 }[order.status] ?? 5;
  const nexts = NEXT_STATUSES[order.status] || [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-white dark:bg-[#13131f] h-full shadow-2xl flex flex-col border-l border-[#e1e3e5] dark:border-white/[0.08] animate-slide-in-right">
        {/* Head */}
        <div className={`shrink-0 flex items-center justify-between px-6 py-4 border-b ${DIV} bg-white dark:bg-[#13131f]`}>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-bold text-[#1a1a1a] dark:text-[#e3e3e3]">Order #{order.orderNumber}</h2>
              <Badge color={STATUS_CONFIG[order.status]?.color || 'gray'}>{STATUS_CONFIG[order.status]?.label || order.status}</Badge>
            </div>
            <p className={`text-xs ${SUB} mt-0.5`}>{formatDateTime(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-2">
            {isVendor && (
              <button onClick={() => invoiceService.downloadInvoice?.(order._id)} title="Download invoice" className={`p-2 rounded-lg text-[#6d7175] hover:bg-[#f6f6f7] dark:hover:bg-white/[0.06] hover:text-[#1a1a1a] dark:hover:text-white transition-colors`}>
                <Download className="w-4 h-4" />
              </button>
            )}
            <button onClick={onClose} className="p-2 rounded-lg text-[#6d7175] hover:bg-[#f6f6f7] dark:hover:bg-white/[0.06] transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Progress */}
          <div className={`${CARD} p-4`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-[#1a1a1a] dark:text-[#e3e3e3] uppercase tracking-wider">Fulfillment progress</p>
              <span className="text-xs font-semibold text-[#DC2626]">{pct}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#f6f6f7] dark:bg-white/[0.06] rounded-full overflow-hidden">
              <div className="h-full bg-[#DC2626] rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex justify-between mt-2">
              {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'].map(s => (
                <span key={s} className={`text-[10px] font-medium ${s.toLowerCase() === order.status ? 'text-[#DC2626]' : SUB}`}>{s}</span>
              ))}
            </div>
          </div>

          {/* Customer + Shipping */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`${CARD} p-4`}>
              <p className={`text-[10px] font-bold uppercase tracking-wider ${SUB} mb-3`}>Customer</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gradient-to-br from-[#DC2626] to-[#9b1c1c] rounded-lg flex items-center justify-center text-white text-xs font-black shrink-0">
                  {order.customer?.firstName?.[0] || 'G'}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#1a1a1a] dark:text-[#e3e3e3] truncate">{order.customer?.firstName} {order.customer?.lastName}</p>
                  <p className={`text-xs ${SUB} truncate`}>{order.customer?.email}</p>
                </div>
              </div>
            </div>
            <div className={`${CARD} p-4`}>
              <p className={`text-[10px] font-bold uppercase tracking-wider ${SUB} mb-3 flex items-center gap-1.5`}><MapPin className="w-3.5 h-3.5" />Shipping</p>
              <div className="text-xs text-[#303030] dark:text-[#d4d4d4] space-y-0.5">
                <p className="font-semibold">{order.shippingAddress?.name}</p>
                <p>{order.shippingAddress?.street}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className={`${CARD} p-4 flex items-center justify-between`}>
            <div className="flex items-center gap-2.5">
              <CreditCard className={`w-4 h-4 ${SUB}`} />
              <div>
                <p className="text-xs font-semibold text-[#1a1a1a] dark:text-[#e3e3e3] capitalize">{order.paymentMethod || 'Online payment'}</p>
                <p className={`text-xs ${SUB}`}>Payment status</p>
              </div>
            </div>
            <Badge color={order.paymentStatus === 'completed' ? 'green' : 'yellow'}>
              {order.paymentStatus === 'completed' ? 'Paid' : 'Unpaid'}
            </Badge>
          </div>

          {/* Items */}
          <div className={`${CARD} overflow-hidden`}>
            <p className={`text-[10px] font-bold uppercase tracking-wider ${SUB} px-4 py-3 border-b ${DIV}`}>Items</p>
            <div className={`divide-y ${DIV}`}>
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-3.5 px-4 py-3.5">
                  <div className="w-12 h-12 bg-[#f6f6f7] dark:bg-white/[0.05] rounded-lg overflow-hidden shrink-0">
                    {item.image
                      ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><Package className="w-5 h-5 text-[#c9cccf]" /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#1a1a1a] dark:text-[#e3e3e3] truncate">{item.name}</p>
                    <p className={`text-xs ${SUB}`}>{formatCurrency(item.price)} × {item.quantity}</p>
                  </div>
                  <p className="text-sm font-bold text-[#1a1a1a] dark:text-[#e3e3e3] shrink-0">{formatCurrency(item.total)}</p>
                </div>
              ))}
            </div>
            {/* Summary */}
            <div className={`px-4 py-3 bg-[#fafafa] dark:bg-white/[0.02] border-t ${DIV} space-y-1.5`}>
              {[
                ['Subtotal', order.subtotal],
                ['Shipping', order.shippingCost],
                ['Tax', order.taxAmount],
                ['Discount', -(order.discount || 0)],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between text-xs">
                  <span className={SUB}>{l}</span>
                  <span className="text-[#303030] dark:text-[#d4d4d4] font-medium">{formatCurrency(v || 0)}</span>
                </div>
              ))}
              <div className={`flex justify-between pt-2 mt-1 border-t ${DIV}`}>
                <span className="text-sm font-bold text-[#1a1a1a] dark:text-[#e3e3e3]">Total</span>
                <span className="text-sm font-bold text-[#1a1a1a] dark:text-[#e3e3e3]">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        {isVendor && nexts.length > 0 && (
          <div className={`shrink-0 p-4 border-t ${DIV} bg-white dark:bg-[#13131f]`}>
            <button
              onClick={onStatusUpdate}
              className="w-full py-2.5 text-sm font-semibold text-white bg-[#DC2626] rounded-lg hover:bg-[#b91c1c] transition-colors shadow-[0_1px_0_rgba(0,0,0,0.2)]"
            >
              Update status
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
export default function Orders() {
  const { user } = useAuth();
  const isVendor = ['vendor', 'vendor_staff', 'super_admin'].includes(user?.role);

  const [orders,        setOrders]        = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [pg,            setPg]            = useState({ page: 1, limit: 20, total: 0, pages: 0 });
  const [search,        setSearch]        = useState('');
  const [statusFilter,  setStatusFilter]  = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusModal,   setStatusModal]   = useState(null);

  const ds = useDebounce(search, 400);

  const fetchOrders = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (statusFilter) params.status = statusFilter;
      if (ds) params.search = ds;
      const r = await orderService.getOrders(params);
      setOrders(r.data || []);
      setPg(r.pagination || { page: 1, limit: 20, total: 0, pages: 0 });
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  }, [statusFilter, ds]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const openDetail = async (orderId) => {
    try {
      const r = await orderService.getOrder(orderId);
      setSelectedOrder(r.data);
    } catch { toast.error('Failed to load order'); }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-5 pb-12">

      {/* Header */}
      <div className="flex items-center justify-between pt-1">
        <h1 className="text-[1.375rem] font-bold text-[#1a1a1a] dark:text-[#e3e3e3]">
          {isVendor ? 'Orders' : 'My orders'}
        </h1>
        {isVendor && (
          <button className={`flex items-center gap-2 px-3.5 py-2 text-sm font-semibold text-[#1a1a1a] dark:text-[#d4d4d4]
            shadow-[0_0_0_1px_rgba(26,26,26,0.13),0_1px_0_0_rgba(26,26,26,0.07)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.10)]
            bg-white dark:bg-[#1a1a24] rounded-lg hover:bg-[#f6f6f7] dark:hover:bg-white/[0.06] transition-colors`}>
            <Download className="w-4 h-4" /> Export
          </button>
        )}
      </div>

      {/* Main card */}
      <div className={CARD}>

        {/* Status tabs */}
        <div className={`flex gap-0 border-b ${DIV} overflow-x-auto scrollbar-hide`}>
          {STATUS_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-3.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-colors ${
                statusFilter === tab.id
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
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search orders"
              className={`w-full pl-9 pr-9 py-2 text-sm rounded-lg border ${DIV} bg-white dark:bg-[#23233a] text-[#1a1a1a] dark:text-[#e3e3e3] placeholder-[#6d7175] focus:outline-none focus:ring-2 focus:ring-[#DC2626]/20 transition-all`}
            />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d7175]"><X className="w-3.5 h-3.5" /></button>}
          </div>
          <span className="ml-auto text-xs text-[#6d7175] dark:text-[#9898b8] whitespace-nowrap">{pg.total} order{pg.total !== 1 ? 's' : ''}</span>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-20 flex justify-center"><Loader text="Loading orders..." /></div>
        ) : orders.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-[#f6f6f7] dark:bg-white/[0.05] rounded-full flex items-center justify-center">
              <Package className="w-7 h-7 text-[#c9cccf] dark:text-[#4a4a6a]" />
            </div>
            <p className="text-sm font-semibold text-[#1a1a1a] dark:text-[#e3e3e3]">No orders</p>
            <p className={`text-xs ${SUB}`}>{search || statusFilter ? 'Try changing your filters.' : 'Orders will appear when customers purchase.'}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead>
                <tr className={`border-b ${DIV} bg-[#fafafa] dark:bg-white/[0.02]`}>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6d7175] dark:text-[#9898b8] uppercase tracking-wider">Order</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6d7175] dark:text-[#9898b8] uppercase tracking-wider hidden sm:table-cell">Date</th>
                  {isVendor && <th className="px-4 py-3 text-left text-xs font-semibold text-[#6d7175] dark:text-[#9898b8] uppercase tracking-wider">Customer</th>}
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6d7175] dark:text-[#9898b8] uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-[#6d7175] dark:text-[#9898b8] uppercase tracking-wider hidden md:table-cell">Payment</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-[#6d7175] dark:text-[#9898b8] uppercase tracking-wider">Total</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody className={`divide-y ${DIV}`}>
                {orders.map(order => {
                  const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                  return (
                    <tr
                      key={order._id}
                      onClick={() => openDetail(order._id)}
                      className="group cursor-pointer hover:bg-[#f6f6f7] dark:hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-bold text-[#1a1a1a] dark:text-[#e3e3e3] group-hover:text-[#DC2626] transition-colors">#{order.orderNumber || order._id.slice(-8)}</p>
                        <p className={`text-xs ${SUB}`}>{order.items?.length ?? 0} item{(order.items?.length ?? 0) !== 1 ? 's' : ''}</p>
                      </td>
                      <td className="px-4 py-3.5 hidden sm:table-cell">
                        <p className="text-sm text-[#303030] dark:text-[#d4d4d4]">{formatDate(order.createdAt)}</p>
                      </td>
                      {isVendor && (
                        <td className="px-4 py-3.5">
                          <p className="text-sm font-semibold text-[#303030] dark:text-[#d4d4d4] truncate max-w-[12rem]">{order.customer?.firstName} {order.customer?.lastName}</p>
                          <p className={`text-xs ${SUB} truncate max-w-[12rem]`}>{order.customer?.email}</p>
                        </td>
                      )}
                      <td className="px-4 py-3.5">
                        <Badge color={sc.color}>{sc.label}</Badge>
                      </td>
                      <td className="px-4 py-3.5 hidden md:table-cell">
                        <Badge color={order.paymentStatus === 'completed' ? 'green' : 'yellow'}>
                          {order.paymentStatus === 'completed' ? 'Paid' : 'Unpaid'}
                        </Badge>
                      </td>
                      <td className="px-4 py-3.5 text-right">
                        <p className="text-sm font-bold text-[#1a1a1a] dark:text-[#e3e3e3]">{formatCurrency(order.total)}</p>
                      </td>
                      <td className="pr-3">
                        <ChevronRight className="w-4 h-4 text-[#c9cccf] group-hover:text-[#DC2626] transition-colors" />
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
            <Pagination currentPage={pg.page} totalPages={pg.pages} onPageChange={p => fetchOrders(p)} />
          </div>
        )}
      </div>

      {/* Slide-over detail */}
      {selectedOrder && (
        <DetailPanel
          order={selectedOrder}
          isVendor={isVendor}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={() => { setStatusModal(selectedOrder); }}
        />
      )}

      {/* Status update modal */}
      {statusModal && (
        <StatusModal
          order={statusModal}
          onClose={() => setStatusModal(null)}
          onUpdated={() => {
            fetchOrders(pg.page);
            if (selectedOrder?._id === statusModal._id) {
              orderService.getOrder(statusModal._id).then(r => setSelectedOrder(r.data)).catch(() => {});
            }
          }}
        />
      )}
    </div>
  );
}