import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { invoiceService } from '../services/invoiceService';
import { formatCurrency, formatDate } from '../utils/formatters';
import Loader from '../components/common/Loader';
import Badge from '../components/common/Badge';
import { 
  Package, Search, Calendar, ChevronRight, Download, ArrowLeft, 
  ExternalLink, ShoppingBag, Clock, CheckCircle, Truck, XCircle, AlertCircle 
} from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  pending: { color: 'yellow', icon: Clock, label: 'Order Placed' },
  confirmed: { color: 'blue', icon: CheckCircle, label: 'Confirmed' },
  processing: { color: 'indigo', icon: Package, label: 'Processing' },
  shipped: { color: 'purple', icon: Truck, label: 'Shipped' },
  delivered: { color: 'emerald', icon: CheckCircle, label: 'Delivered' },
  cancelled: { color: 'red', icon: XCircle, label: 'Cancelled' },
  refunded: { color: 'gray', icon: AlertCircle, label: 'Refunded' },
};

export default function MyOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [downloadingId, setDownloadingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getMyOrders();
      setOrders(response.data || []);
    } catch (error) {
        console.error("Fetch orders error", error);
        toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async (orderId, e) => {
    e.stopPropagation();
    setDownloadingId(orderId);
    try {
      await invoiceService.downloadInvoice(orderId);
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      toast.error('Failed to download invoice');
    } finally {
      setDownloadingId(null);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.orderNumber || order._id).toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items?.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) return <Loader text="Loading your orders..." />;

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#09090b] p-4 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
             <button 
                onClick={() => navigate('/dashboard')}
                className="p-2.5 hover:bg-white dark:hover:bg-gray-800 rounded-xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all text-gray-500 dark:text-gray-400 group"
                title="Back to Dashboard"
             >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
             </button>
             <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">My Orders</h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Track pending orders and view your history</p>
             </div>
          </div>
          
          <div className="flex bg-white dark:bg-gray-800 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-x-auto max-w-full no-scrollbar">
            {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                <button 
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all capitalize whitespace-nowrap ${
                      statusFilter === status 
                        ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 shadow-sm ring-1 ring-red-200 dark:ring-red-800' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                >
                    {status}
                </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative group max-w-2xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search by Order ID, Product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-11 pr-4 py-3.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-red-500/10 focus:border-red-500 transition-all shadow-sm outline-none text-gray-900 dark:text-white placeholder-gray-400"
          />
        </div>

        {/* Orders List */}
        <div className="space-y-5">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
              const StatusIcon = status.icon;

              return (
                <div 
                  key={order._id}
                  onClick={() => navigate(`/orders/${order._id}`)}
                  className="group bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl hover:border-red-500/30 transition-all duration-300 cursor-pointer overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-50/0 via-transparent to-transparent dark:from-red-900/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                  {/* Desktop Layout */}
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center border-b border-gray-100 dark:border-gray-700/50 pb-5 mb-5">
                       <div className="flex items-start gap-4">
                          <div className="h-12 w-12 bg-gray-50 dark:bg-gray-700 rounded-xl flex items-center justify-center border border-gray-100 dark:border-gray-600 shadow-sm group-hover:scale-105 transition-transform">
                             <Package className="h-6 w-6 text-gray-400 dark:text-gray-300" />
                          </div>
                          <div>
                             <div className="flex items-center gap-3 mb-1">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                                  Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                                </h3>
                                <Badge color={status.color} className="flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide">
                                   <StatusIcon className="w-3.5 h-3.5" />
                                   {status.label}
                                </Badge>
                             </div>
                             <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                                <Calendar className="w-4 h-4" />
                                {formatDate(order.createdAt)}
                             </p>
                          </div>
                       </div>
                       
                       <div className="flex flex-col items-end gap-1">
                          <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Amount</span>
                          <span className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(order.total)}</span>
                       </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                       {/* Preview Items */}
                       <div className="flex-1 w-full space-y-3">
                          {order.items.slice(0, 2).map((item, idx) => (
                             <div key={idx} className="flex items-center gap-4 group/item">
                                <div className="h-10 w-10 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 overflow-hidden flex-shrink-0">
                                   {item.image ? (
                                      <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                   ) : (
                                      <div className="h-full w-full flex items-center justify-center">
                                         <Package className="h-4 w-4 text-gray-400" />
                                      </div>
                                   )}
                                </div>
                                <div className="min-w-0 flex-1">
                                   <p className="text-sm font-medium text-gray-900 dark:text-white truncate group-hover/item:text-red-600 transition-colors">
                                      {item.name}
                                   </p>
                                   <p className="text-xs text-gray-500 dark:text-gray-400">
                                      {item.quantity} × {formatCurrency(item.price)}
                                   </p>
                                </div>
                             </div>
                          ))}
                          {order.items.length > 2 && (
                             <p className="text-xs font-medium text-gray-500 dark:text-gray-400 pl-14">
                                +{order.items.length - 2} more items...
                             </p>
                          )}
                       </div>

                       {/* Action Buttons */}
                       <div className="flex w-full lg:w-auto items-center gap-3 pt-4 lg:pt-0 lg:pl-6 lg:border-l border-gray-100 dark:border-gray-700/50">
                          <button 
                             onClick={(e) => handleDownloadInvoice(order._id, e)}
                             disabled={downloadingId === order._id}
                             className="flex-1 lg:flex-none justify-center flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm group/btn"
                          >
                             {downloadingId === order._id ? (
                                <div className="h-4 w-4 border-2 border-gray-400 border-t-red-500 rounded-full animate-spin" />
                             ) : (
                                <Download className="h-4 w-4 text-gray-500 group-hover/btn:text-red-500 transition-colors" />
                             )}
                             Invoice
                          </button>
                          
                          <button className="flex-1 lg:flex-none justify-center flex items-center gap-2 px-5 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-xl text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-900/40 transition-all md:min-w-[140px] group/btn">
                             View Details
                             <ChevronRight className="h-4 w-4 group-hover/btn:translate-x-0.5 transition-transform" />
                          </button>
                       </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700 text-center px-4">
              <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6 shadow-sm ring-1 ring-red-100 dark:ring-red-800">
                <ShoppingBag className="w-10 h-10 text-red-500 dark:text-red-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No orders found</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
                {searchTerm ? 'Try adjusting your search terms or filters to find what you are looking for.' : "You haven't placed any orders yet. Start shopping and fill up your cart!"}
              </p>
              {!searchTerm && (
                  <button 
                    onClick={() => navigate('/store')}
                    className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl shadow-lg shadow-red-600/20 hover:bg-red-700 hover:shadow-red-600/30 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                  >
                    Start Shopping
                    <ChevronRight className="w-4 h-4" />
                  </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
