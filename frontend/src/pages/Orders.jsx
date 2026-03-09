import { useState, useEffect, useCallback } from 'react';
import {
  ClipboardList, Eye, Search, Truck, Package,
  ArrowLeft, FileText, Download, Clock, CheckCircle2,
  XCircle, RotateCcw, Filter, IndianRupee, MapPin,
  Calendar, CreditCard, ChevronRight, X, AlertCircle,
  RefreshCw, MoreVertical
} from 'lucide-react';
import { orderService } from '../services/orderService';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Badge from '../components/common/Badge';
import Pagination from '../components/common/Pagination';
import { useDebounce } from '../hooks/useDebounce';
import { formatCurrency, formatDate, formatDateTime } from '../utils/formatters';
import { useAuth } from '../context/AuthContext';
import { invoiceService } from '../services/invoiceService';
import toast from 'react-hot-toast';
import StatsCard from '../components/dashboard/StatsCard';

const STATUS_CONFIG = {
  pending: { label: 'Pending', color: 'yellow', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'blue', icon: CheckCircle2 },
  processing: { label: 'Processing', color: 'indigo', icon: RefreshCw },
  shipped: { label: 'Shipped', color: 'purple', icon: Truck },
  delivered: { label: 'Delivered', color: 'green', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: 'red', icon: XCircle },
  refunded: { label: 'Refunded', color: 'gray', icon: RotateCcw },
  returned: { label: 'Returned', color: 'orange', icon: RotateCcw },
};

const PAYMENT_CONFIG = {
  pending: { label: 'Unpaid', color: 'yellow', icon: Clock }, 
  completed: { label: 'Paid', color: 'green', icon: CheckCircle2 }, 
  failed: { label: 'Failed', color: 'red', icon: XCircle }, 
  refunded: { label: 'Refunded', color: 'gray', icon: RotateCcw }
};

export default function Orders() {
  const { user } = useAuth();
  const isVendor = ['vendor', 'vendor_staff', 'super_admin'].includes(user?.role);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pg, setPg] = useState({ page: 1, limit: 10, total: 0, pages: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Status Update State
  const [statusModal, setStatusModal] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const ds = useDebounce(search, 400);

  const fetchOrders = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      if (ds) params.search = ds;
      
      const r = await orderService.getOrders(params);
      setOrders(r.data || []);
      setPg(r.pagination || { page: 1, limit: 10, total: 0, pages: 0 });
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  }, [statusFilter, ds]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleStatusUpdate = async () => {
    if (!statusModal || !newStatus) return;
    setUpdating(true);
    try {
      await orderService.updateOrderStatus(statusModal._id, { status: newStatus, note: statusNote });
      toast.success(`Order updated to ${STATUS_CONFIG[newStatus]?.label || newStatus}`);
      setStatusModal(null);
      setNewStatus('');
      setStatusNote('');
      fetchOrders(pg.page);
      if (selectedOrder?._id === statusModal._id) {
          viewOrder(statusModal._id); // Refresh detail view if open
      }
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update status'); }
    finally { setUpdating(false); }
  };

  const getNextStatuses = (s) => {
    const t = { 
        pending: ['confirmed', 'cancelled'], 
        confirmed: ['processing', 'cancelled'], 
        processing: ['shipped', 'cancelled'], 
        shipped: ['delivered', 'returned'], 
        delivered: ['returned', 'refunded'] 
    };
    return t[s] || [];
  };

  const viewOrder = async (orderId) => {
    setIsDetailOpen(true);
    // Optimistic UI updates or fetch fresh data
    try {
      const r = await orderService.getOrder(orderId);
      setSelectedOrder(r.data);
    } catch { 
        toast.error('Failed to load order details'); 
        setIsDetailOpen(false);
    }
  };

  const handleInvoice = async (orderId, action) => {
    try {
      if (action === 'view') await invoiceService.viewInvoice(orderId);
      else if (action === 'download') await invoiceService.downloadInvoice(orderId);
      else if (action === 'email') {
        const promise = invoiceService.emailInvoice(orderId);
        toast.promise(promise, {
          loading: 'Sending invoice...',
          success: 'Invoice sent successfully',
          error: 'Failed to send invoice'
        });
      }
    } catch (err) {
      toast.error('Failed to process invoice');
    }
  };

  // Quick stats
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const activeCount = orders.filter(o => ['confirmed','processing','shipped'].includes(o.status)).length;
  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#111827] dark:text-white tracking-tight">
            {isVendor ? 'Orders & Fulfillment' : 'My Orders'}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base">
            {isVendor ? 'Manage customer orders, track shipments, and process refunds.' : 'Track your order history and status.'}
          </p>
        </div>
        {/* Export Button could go here */}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard icon={ClipboardList} title="Total Orders" value={pg.total} color="teal" subtitle="All time" />
        <StatsCard icon={Clock} title="Pending" value={pendingCount} color="yellow" subtitle="Needs attention" />
        <StatsCard icon={Truck} title="In Progress" value={activeCount} color="purple" subtitle="Processing or Shipped" />
        <StatsCard icon={IndianRupee} title="Revenue" value={formatCurrency(totalRevenue)} color="green" subtitle="Shown on page" />
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col space-y-4">
        {/* Status Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
             {['all', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                <button
                    key={status}
                    onClick={() => setStatusFilter(status === 'all' ? '' : status)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border ${
                        (statusFilter === status || (status === 'all' && !statusFilter))
                        ? 'bg-[#DC2626] text-white border-transparent shadow-lg shadow-[#DC2626]/20 transform scale-105'
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50 hover:border-gray-300 dark:bg-zinc-900 dark:text-gray-400 dark:border-zinc-800 dark:hover:bg-zinc-800'
                    }`}
                >
                    {status === 'all' ? 'All Orders' : STATUS_CONFIG[status]?.label || status}
                </button>
             ))}
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search orders by number, customer, or email..." 
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 focus:ring-2 focus:ring-[#DC2626]/20 focus:border-gray-300 dark:focus:border-zinc-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none transition-all shadow-sm" 
          />
        </div>
      </div>

      {/* Orders List / Table */}
      {loading ? (
        <div className="flex justify-center py-24"><Loader text="Loading orders..." /></div>
      ) : orders.length === 0 ? (
        <EmptyState 
            icon={ClipboardList} 
            title="No orders found" 
            description={search || statusFilter ? "Try adjusting your filters to find what you're looking for." : "New orders will appear here automatically."} 
            action={search || statusFilter ? <button onClick={() => {setSearch(''); setStatusFilter('');}} className="mt-4 text-blue-600 hover:text-blue-700 font-medium">Clear filters</button> : null}
        />
      ) : (
        <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-zinc-900/50">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Date</th>
                  {isVendor && <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Customer</th>}
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Payment</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800/60">
                {orders.map(order => {
                  const StatusIcon = STATUS_CONFIG[order.status]?.icon || Clock;
                  return (
                    <tr 
                        key={order._id} 
                        onClick={() => viewOrder(order._id)}
                        className="hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors group cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                            <span className="font-bold text-sm text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                                #{order.orderNumber}
                            </span>
                            <span className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                {order.items?.length || 0} items
                            </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{formatDate(order.createdAt)}</span>
                            <span className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                      </td>
                      {isVendor && (
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                             <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-gray-500 dark:text-gray-400">
                                {order.customer?.firstName?.[0] || 'G'}
                             </div>
                             <div>
                                <p className="text-sm font-medium text-gray-900 dark:text-white">{order.customer?.firstName} {order.customer?.lastName}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[150px]">{order.customer?.email}</p>
                             </div>
                          </div>
                        </td>
                      )}
                      
                      <td className="px-6 py-4">
                         <Badge color={STATUS_CONFIG[order.status]?.color || 'gray'} className="shadow-sm">
                             <div className="flex items-center gap-1.5">
                                 <StatusIcon className="w-3.5 h-3.5" />
                                 {STATUS_CONFIG[order.status]?.label || order.status}
                             </div>
                         </Badge>
                      </td>
                      <td className="px-6 py-4">
                        {/* Simplified Payment Status */}
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                            order.paymentStatus === 'completed' 
                            ? 'bg-red-50 text-red-700 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30'
                            : 'bg-gray-50 text-gray-600 border-gray-200 dark:bg-zinc-900 dark:text-gray-400 dark:border-zinc-700'
                        }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${order.paymentStatus === 'completed' ? 'bg-red-500' : 'bg-gray-400'}`} />
                            {PAYMENT_CONFIG[order.paymentStatus]?.label || order.paymentStatus}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-sm text-gray-900 dark:text-white">{formatCurrency(order.total)}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={(e) => { e.stopPropagation(); viewOrder(order._id); }}
                            className="px-3 py-1.5 text-xs font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-lg hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
                          >
                            View
                          </button>

                          {isVendor && getNextStatuses(order.status).length > 0 && (
                            <button 
                                onClick={(e) => { 
                                    e.stopPropagation(); 
                                    setStatusModal(order); 
                                    setNewStatus('');
                                }}
                                className="px-3 py-1.5 text-xs font-medium text-white bg-black dark:bg-white dark:text-black rounded-lg shadow-sm hover:opacity-90 transition-all flex items-center gap-1.5"
                            >
                              Update
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Footer Pagination */}
          <div className="border-t border-gray-100 dark:border-gray-800 p-4">
            <Pagination page={pg.page} totalPages={pg.pages} total={pg.total} limit={pg.limit} onPageChange={fetchOrders} />
          </div>
        </div>
      )}

      {/* Order Detail Slide-Over Panel */}
      {isDetailOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
             className="fixed inset-0 bg-gray-900/20 dark:bg-black/50 backdrop-blur-sm transition-opacity" 
             onClick={() => setIsDetailOpen(false)} 
          />
          
          {/* Panel */}
          <div className="relative w-full max-w-2xl bg-white dark:bg-zinc-950 h-full shadow-2xl flex flex-col border-l border-gray-200 dark:border-gray-800 animate-in slide-in-from-right duration-300">
            
            {/* Panel Content (Loader or Data) */}
            {!selectedOrder ? (
               <div className="flex-1 flex flex-col items-center justify-center gap-3">
                  <Loader />
                  <p className="text-gray-500 text-sm">Retrieving order details...</p>
               </div>
            ) : (
              <>
                {/* Header */}
                <div className="sticky top-0 z-10 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-4">
                     <button onClick={() => setIsDetailOpen(false)} className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                     </button>
                     <div>
                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            Order #{selectedOrder.orderNumber}
                            <Badge color={STATUS_CONFIG[selectedOrder.status].color} size="sm">{STATUS_CONFIG[selectedOrder.status].label}</Badge>
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2 mt-0.5">
                            <Clock className="w-3 h-3" />
                            Placed on {formatDateTime(selectedOrder.createdAt)}
                        </p>
                     </div>
                  </div>
                  
                  {isVendor && (
                      <div className="flex gap-2">
                        <button 
                            onClick={() => handleInvoice(selectedOrder._id, 'download')}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                            title="Download Invoice"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                        {getNextStatuses(selectedOrder.status).length > 0 && (
                            <button 
                                onClick={() => setStatusModal(selectedOrder)}
                                className="px-4 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-bold rounded-lg shadow-sm shadow-red-500/20 transition-all"
                            >
                                Update Status
                            </button>
                        )}
                      </div>
                  )}
                </div>

                {/* Body Scrollable */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    
                    {/* Status Tracker (Mini) */}
                    <div className="bg-gray-50 dark:bg-zinc-900/50 rounded-xl p-4 border border-gray-100 dark:border-gray-800">
                        <div className="flex items-center justify-between text-sm mb-4">
                            <span className="font-semibold text-gray-900 dark:text-white">Order Status</span>
                            {selectedOrder.status === 'delivered' ? (
                                <span className="text-red-600 flex items-center gap-1"><CheckCircle2 className="w-4 h-4"/> Completed</span>
                            ) : (
                                <span className="text-blue-600 flex items-center gap-1"><Truck className="w-4 h-4"/> In Progress</span>
                            )}
                        </div>
                        {/* Simple Progress Bar */}
                        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                                className={`h-full bg-[#DC2626] transition-all duration-500`} 
                                style={{ width: 
                                    selectedOrder.status === 'delivered' ? '100%' : 
                                    selectedOrder.status === 'shipped' ? '75%' : 
                                    selectedOrder.status === 'processing' ? '50%' : 
                                    selectedOrder.status === 'confirmed' ? '25%' : '5%' 
                                }}
                            />
                        </div>
                    </div>

                    {/* Customer & Shipping Info */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                             <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" /> Shipping Address
                             </h3>
                             <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-300 leading-relaxed shadow-sm">
                                <p className="font-bold text-gray-900 dark:text-white mb-1">{selectedOrder.shippingAddress?.name || 'N/A'}</p>
                                <p>{selectedOrder.shippingAddress?.street}</p>
                                <p>{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state}</p>
                                <p>{selectedOrder.shippingAddress?.zipCode}, {selectedOrder.shippingAddress?.country}</p>
                                <p className="mt-2 text-gray-500">{selectedOrder.shippingAddress?.phone}</p>
                             </div>
                        </div>
                        <div>
                             <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <CreditCard className="w-4 h-4 text-gray-400" /> Billing & Payment
                             </h3>
                             <div className="bg-white dark:bg-zinc-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-300 leading-relaxed shadow-sm">
                                <p className="mb-2"><span className="text-gray-500">Method:</span> <span className="font-medium text-gray-900 dark:text-white capitalize">{selectedOrder.paymentMethod}</span></p>
                                <p className="mb-2"><span className="text-gray-500">Status:</span> 
                                    <span className={`ml-2 px-2 py-0.5 rounded text-xs font-bold ${
                                        selectedOrder.paymentStatus === 'completed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {selectedOrder.paymentStatus.toUpperCase()}
                                    </span>
                                </p>
                                {isVendor && (
                                   <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                                      <p className="font-bold text-gray-900 dark:text-white mb-1">{selectedOrder.billingAddress?.name || 'Same as shipping'}</p>
                                   </div>
                                )}
                             </div>
                        </div>
                     </div>

                    {/* Order Items */}
                    <div>
                        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider mb-3 flex items-center gap-2">
                            <Package className="w-4 h-4 text-gray-400" /> Items Ordered
                        </h3>
                        <div className="bg-white dark:bg-zinc-900 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                            <div className="divide-y divide-gray-100 dark:divide-gray-800">
                                {selectedOrder.items?.map((item, idx) => (
                                    <div key={idx} className="p-4 flex items-center gap-4">
                                        <div className="h-16 w-16 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-gray-100 dark:border-zinc-700">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <Package className="w-6 h-6 text-gray-400" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-gray-900 dark:text-white truncate">{item.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">SKU: {item.sku || 'N/A'}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                {formatCurrency(item.price)} x {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900 dark:text-white">{formatCurrency(item.total)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            {/* Order Summary Footer */}
                            <div className="bg-gray-50 dark:bg-zinc-800/50 p-6 space-y-3 text-sm">
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(selectedOrder.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Shipping</span>
                                    <span>{formatCurrency(selectedOrder.shippingCost)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Tax</span>
                                    <span>{formatCurrency(selectedOrder.taxAmount)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>Discount</span>
                                    <span>-{formatCurrency(selectedOrder.discount)}</span>
                                </div>
                                <div className="pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                    <span className="font-bold text-lg text-gray-900 dark:text-white">Total</span>
                                    <span className="font-bold text-xl text-gray-900 dark:text-white">{formatCurrency(selectedOrder.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

              </>
            )}
           </div>
         </div>
      )}




      {/* Update Status Modal */}
      {statusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-md shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Update Order Status</h3>
              <p className="text-sm text-gray-400 mt-0.5">Order: <span className="font-bold text-gray-700 dark:text-gray-300">{statusModal.orderNumber}</span></p>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Current:</span>
                <Badge color={STATUS_CONFIG[statusModal.status]?.color || 'gray'}>{STATUS_CONFIG[statusModal.status]?.label || statusModal.status}</Badge>
                <ChevronRight className="w-4 h-4 text-gray-400" />
                {newStatus ? <Badge color={STATUS_CONFIG[newStatus]?.color || 'gray'}>{STATUS_CONFIG[newStatus]?.label || newStatus}</Badge> : <span className="text-sm text-gray-400">Select below</span>}
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">New Status</label>
                <div className="grid grid-cols-2 gap-2">
                  {getNextStatuses(statusModal.status).map(s => (
                    <button key={s} onClick={() => setNewStatus(s)}
                      className={`px-4 py-3 rounded-xl border-2 text-sm font-bold capitalize transition-all ${
                        newStatus === s
                          ? 'border-[#DC2626] bg-[#DC2626]/10 text-[#DC2626]'
                          : 'border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-zinc-600'
                      }`}>
                      {STATUS_CONFIG[s]?.label || s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Note (optional)</label>
                <textarea className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DC2626] resize-none"
                  rows="2" value={statusNote} onChange={e => setStatusNote(e.target.value)} placeholder="Add a note..." />
              </div>
            </div>
            <div className="p-5 border-t border-gray-100 dark:border-gray-800 flex gap-3">
              <button onClick={() => { setStatusModal(null); setNewStatus(''); setStatusNote(''); }}
                className="flex-1 py-3 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm transition-colors">
                Cancel
              </button>
              <button onClick={handleStatusUpdate} disabled={!newStatus || updating}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-lg shadow-[#DC2626]/20 transition-all active:scale-95">
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
