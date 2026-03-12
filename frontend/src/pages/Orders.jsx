import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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

/* -- Design tokens -------------------------------------------- */
const CARD = 'bg-white dark:bg-[#0d0d0d] rounded-2xl shadow-sm border border-gray-100 dark:border-white/[0.07]';
const DIV  = 'border-gray-100 dark:border-white/[0.07]';
const SUB  = 'text-gray-400 dark:text-[#5a5a7a]';

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

/* -- Status update modal --------------------------------------- */
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative w-full max-w-sm ${CARD} p-6 shadow-2xl`}>
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">Update Order Status</p>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white dark:hover:bg-white/5 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-3">
          {nexts.map(s => (
            <label key={s} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${newStatus === s ? `border-[#DC2626] bg-red-50 dark:bg-[#DC2626]/10` : `border-gray-100 dark:border-white/[0.05] hover:bg-gray-50 dark:hover:bg-white/[0.02]`}`}>
              <input type="radio" value={s} checked={newStatus === s} onChange={() => setNewStatus(s)} className="w-4 h-4 text-[#DC2626] focus:ring-[#DC2626]/20 border-gray-300 dark:border-white/10 dark:bg-black" />
              <span className="text-sm font-bold text-gray-900 dark:text-white">{STATUS_CONFIG[s]?.label}</span>
            </label>
          ))}
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Add a note (optional)..."
            rows={3}
            className={`w-full mt-3 px-4 py-3 text-sm font-medium border ${DIV} bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#4a4a6a] rounded-xl focus:outline-none focus:ring-4 focus:ring-[#DC2626]/10 resize-none`}
          />
        </div>
        <div className="flex items-center gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 text-sm font-bold text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-white/10 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Cancel</button>
          <button onClick={handleUpdate} disabled={loading || !newStatus} className="flex-1 py-2.5 text-sm font-black text-white bg-[#DC2626] rounded-xl hover:bg-[#b91c1c] disabled:opacity-50 transition-all shadow-md active:scale-95">
            {loading ? 'Processing...' : 'Save Changes'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* -- Order detail panel ---------------------------------------- */
function DetailPanel({ order, isVendor, onClose, onStatusUpdate }) {
  const pct = { pending: 5, confirmed: 25, processing: 50, shipped: 75, delivered: 100 }[order.status] ?? 5;
  const nexts = NEXT_STATUSES[order.status] || [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="relative w-full max-w-xl bg-white dark:bg-[#090909] h-full shadow-2xl flex flex-col border-l border-gray-100 dark:border-white/[0.08]"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}>
        
        {/* Head */}
        <div className={`shrink-0 flex items-center justify-between px-6 py-5 border-b ${DIV} bg-white dark:bg-[#0d0d0d]`}>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-lg font-black text-gray-900 dark:text-white">Order #{order.orderNumber}</h2>
              <Badge color={STATUS_CONFIG[order.status]?.color || 'gray'}>{STATUS_CONFIG[order.status]?.label || order.status}</Badge>
            </div>
            <p className={`text-xs font-bold ${SUB} mt-1 uppercase tracking-wider`}>{formatDateTime(order.createdAt)}</p>
          </div>
          <div className="flex items-center gap-2">
            {isVendor && (
              <button 
                onClick={() => invoiceService.downloadInvoice?.(order._id)} 
                title="Download invoice" 
                className="p-2.5 rounded-xl text-gray-400 hover:text-[#dc2626] dark:hover:text-[#dc2626] hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
              >
                <Download className="w-5 h-5" />
              </button>
            )}
            <button onClick={onClose} className="p-2.5 rounded-xl text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
          {/* Progress */}
          <div className={`${CARD} p-5`}>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">Fulfillment Stage</p>
              <span className="text-xs font-black text-[#DC2626] bg-red-50 dark:bg-red-500/10 px-2.5 py-1 rounded-lg border border-red-100 dark:border-red-500/20">{pct}% Complete</span>
            </div>
            <div className="h-2 w-full bg-gray-100 dark:bg-white/[0.05] rounded-full overflow-hidden">
              <div className="h-full bg-[#DC2626] rounded-full shadow-[0_0_8px_rgba(220,38,38,0.4)] transition-all duration-1000 ease-out" style={{ width: `${pct}%` }} />
            </div>
            <div className="flex justify-between mt-3">
              {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered'].map(s => {
                const isActive = s.toLowerCase() === order.status;
                return (
                  <span key={s} className={`text-[10px] font-black uppercase tracking-wider ${isActive ? 'text-[#DC2626]' : SUB}`}>{s}</span>
                );
              })}
            </div>
          </div>

          {/* Customer + Shipping */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className={`${CARD} p-5`}>
              <p className={`text-[10px] font-black uppercase tracking-widest ${SUB} mb-4`}>Customer info</p>
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 bg-gradient-to-br from-[#DC2626] to-[#b91c1c] rounded-xl flex items-center justify-center shadow-lg transform rotate-3 group-hover:rotate-0 transition-transform">
                  <span className="text-white text-sm font-black uppercase">{order.customer?.firstName?.[0] || 'G'}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{order.customer?.firstName} {order.customer?.lastName}</p>
                  <p className={`text-xs font-semibold ${SUB} truncate mt-0.5`}>{order.customer?.email}</p>
                </div>
              </div>
            </div>
            <div className={`${CARD} p-5`}>
              <p className={`text-[10px] font-black uppercase tracking-widest ${SUB} mb-4 flex items-center gap-1.5`}><MapPin className="w-3.5 h-3.5" />Delivery address</p>
              <div className="text-[13px] text-gray-700 dark:text-[#a0a0c8] font-medium leading-relaxed">
                <p className="font-bold text-gray-900 dark:text-white">{order.shippingAddress?.name}</p>
                <p>{order.shippingAddress?.street}</p>
                <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} {order.shippingAddress?.zipCode}</p>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className={`${CARD} p-5 flex items-center justify-between group`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/[0.04] flex items-center justify-center text-gray-400 group-hover:bg-[#dc2626]/10 group-hover:text-[#dc2626] transition-colors">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white capitalize">{order.paymentMethod?.replace('_', ' ') || 'Credit Card'}</p>
                <p className={`text-[11px] font-bold ${SUB} uppercase mt-0.5`}>Payment Method</p>
              </div>
            </div>
            <Badge color={order.paymentStatus === 'completed' ? 'green' : 'yellow'}>
              {order.paymentStatus === 'completed' ? 'Fully Paid' : 'Awaiting Payment'}
            </Badge>
          </div>

          {/* Items */}
          <div className={`${CARD} overflow-hidden`}>
            <p className={`text-[10px] font-black uppercase tracking-widest ${SUB} px-5 py-3.5 border-b ${DIV}`}>Ordered Items</p>
            <div className={`divide-y ${DIV}`}>
              {order.items?.map((item, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 dark:hover:bg-white/[0.01] transition-colors">
                  <div className="w-14 h-14 bg-gray-50 dark:bg-white/[0.03] rounded-xl border border-gray-100 dark:border-white/10 overflow-hidden shrink-0">
                    {item.image
                      ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      : <div className="w-full h-full flex items-center justify-center"><Package className="w-6 h-6 text-gray-200 dark:text-[#3a3a5a]" /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-gray-900 dark:text-white truncate">{item.name}</p>
                    <p className={`text-xs font-bold ${SUB} mt-0.5`}>{formatCurrency(item.price)} × {item.quantity}</p>
                  </div>
                  <p className="text-sm font-black text-gray-900 dark:text-white shrink-0">{formatCurrency(item.total)}</p>
                </div>
              ))}
            </div>
            {/* Summary */}
            <div className={`px-5 py-4 bg-gray-50/50 dark:bg-white/[0.02] border-t ${DIV} space-y-2`}>
              {[
                ['Subtotal', order.subtotal],
                ['Shipping', order.shippingCost],
                ['Tax (estimated)', order.taxAmount],
                ['Discount applied', -(order.discount || 0)],
              ].map(([l, v]) => (
                <div key={l} className="flex justify-between text-[13px]">
                  <span className={`font-bold ${SUB}`}>{l}</span>
                  <span className="text-gray-900 dark:text-gray-300 font-bold">{formatCurrency(v || 0)}</span>
                </div>
              ))}
              <div className={`flex justify-between pt-3 mt-2 border-t-2 ${DIV} border-dashed`}>
                <span className="text-base font-black text-gray-900 dark:text-white">Amount Due</span>
                <span className="text-base font-black text-[#dc2626]">{formatCurrency(order.total)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        {isVendor && nexts.length > 0 && (
          <div className={`shrink-0 p-6 border-t ${DIV} bg-white dark:bg-[#0d0d0d]`}>
            <button
              onClick={onStatusUpdate}
              className="w-full py-3 text-sm font-black text-white bg-[#DC2626] rounded-xl hover:bg-[#b91c1c] transition-all shadow-[0_4px_12px_rgba(220,38,38,0.3)] active:scale-[0.98] uppercase tracking-wider"
            >
              Update Fullfillment Status
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ---------------------------------------------------------------
   PAGE
--------------------------------------------------------------- */
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
    <div className="max-w-[1200px] mx-auto space-y-6 pb-12 animate-in fade-in duration-500">

      {/* Header */}
      <div className="flex items-end justify-between pt-4">
        <div>
          <p className="text-[13px] font-bold uppercase tracking-widest text-[#dc2626] mb-1">Sales</p>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            {isVendor ? 'Order Management' : 'My Purchase History'}
          </h1>
        </div>
        {isVendor && (
          <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-200
            shadow-sm border border-gray-100 dark:border-white/[0.08]
            bg-white dark:bg-white/[0.04] rounded-xl hover:bg-gray-50 dark:hover:bg-white/[0.08] transition-all">
            <Download className="w-4 h-4" /> Export Data
          </button>
        )}
      </div>

      {/* Main card */}
      <div className={`${CARD} overflow-hidden`}>

        {/* Status tabs */}
        <div className={`flex gap-2 px-2 border-b ${DIV} bg-gray-50/30 dark:bg-white/[0.01] overflow-x-auto scrollbar-hide`}>
          {STATUS_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-4 py-3.5 text-sm font-bold whitespace-nowrap border-b-2 transition-all ${
                statusFilter === tab.id
                  ? 'border-[#DC2626] text-[#DC2626]'
                  : `border-transparent text-gray-400 dark:text-[#5a5a7a] hover:text-gray-900 dark:hover:text-[#a0a0c0]`
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className={`flex items-center gap-4 px-5 py-4 border-b ${DIV}`}>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-[#4a4a6e]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by ID, customer or items..."
              className="w-full pl-10 pr-10 py-2.5 text-sm font-medium rounded-xl border border-gray-100 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.03] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#4a4a6e] focus:outline-none focus:ring-4 focus:ring-[#DC2626]/10 transition-all"
            />
            {search && <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-900 dark:hover:text-white"><X className="w-4 h-4" /></button>}
          </div>
          <span className="ml-auto text-xs font-bold text-gray-400 dark:text-[#5a5a7a] uppercase tracking-wider">{pg.total} Total Orders</span>
        </div>

        {/* Table */}
        {loading ? (
          <div className="py-24 flex justify-center"><Loader text="Syncing orders..." /></div>
        ) : orders.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center gap-5 text-center px-6">
            <div className="w-20 h-20 bg-gray-50 dark:bg-white/[0.04] rounded-full flex items-center justify-center">
              <Package className="w-10 h-10 text-gray-300 dark:text-[#3a3a5a]" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">Empty order book</p>
              <p className={`text-sm ${SUB} mt-1 max-w-sm`}>{search || statusFilter ? 'Adjust your filters to find existing records.' : 'Fresh start! Orders will magically appear here as customers buy.'}</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px]">
              <thead>
                <tr className={`border-b ${DIV} bg-gray-50/50 dark:bg-white/[0.03]`}>
                  <th className="px-5 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a]">Ref ID</th>
                  <th className="px-4 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a] hidden sm:table-cell">Purchase Date</th>
                  {isVendor && <th className="px-4 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a]">Client Details</th>}
                  <th className="px-4 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a]">Shipment</th>
                  <th className="px-4 py-4 text-left text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a] hidden md:table-cell">Payment</th>
                  <th className="px-4 py-4 text-right text-[11px] font-black uppercase tracking-widest text-gray-400 dark:text-[#5a5a7a]">Total</th>
                  <th className="w-12 pr-5" />
                </tr>
              </thead>
              <tbody className={`divide-y ${DIV}`}>
                {orders.map(order => {
                  const sc = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                  return (
                    <motion.tr
                      key={order._id}
                      onClick={() => openDetail(order._id)}
                      className="group cursor-pointer hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-all duration-150"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-black text-gray-900 dark:text-white group-hover:text-[#DC2626] transition-colors">#{order.orderNumber || order._id.slice(-8)}</p>
                        <p className={`text-[11px] font-bold ${SUB} uppercase mt-0.5`}>{order.items?.length ?? 0} sku{(order.items?.length ?? 0) !== 1 ? 's' : ''}</p>
                      </td>
                      <td className="px-4 py-4 hidden sm:table-cell">
                        <p className="text-[13px] font-bold text-gray-700 dark:text-[#a0a0c8]">{formatDate(order.createdAt)}</p>
                      </td>
                      {isVendor && (
                        <td className="px-4 py-4">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[12rem]">{order.customer?.firstName} {order.customer?.lastName}</p>
                          <p className={`text-[11px] font-bold ${SUB} truncate max-w-[12rem] uppercase mt-0.5`}>{order.customer?.email}</p>
                        </td>
                      )}
                      <td className="px-4 py-4">
                        <Badge color={sc.color}>{sc.label}</Badge>
                      </td>
                      <td className="px-4 py-4 hidden md:table-cell">
                        <Badge color={order.paymentStatus === 'completed' ? 'green' : 'yellow'}>
                          {order.paymentStatus === 'completed' ? 'Paid' : 'Unpaid'}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <p className="text-[15px] font-black text-gray-900 dark:text-white">{formatCurrency(order.total)}</p>
                      </td>
                      <td className="pr-5 py-4">
                        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            <ArrowRight className="w-4 h-4 text-[#DC2626]" />
                        </div>
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
                onPageChange={p => fetchOrders(p)} 
                total={pg.total}
                limit={pg.limit}
            />
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <DetailPanel
            order={selectedOrder}
            isVendor={isVendor}
            onClose={() => setSelectedOrder(null)}
            onStatusUpdate={() => { setStatusModal(selectedOrder); }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
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
      </AnimatePresence>
    </div>
  );
}