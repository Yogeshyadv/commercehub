import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderService } from '../services/orderService';
import { invoiceService } from '../services/invoiceService';
import { formatCurrency, formatDate } from '../utils/formatters';
import Loader from '../components/common/Loader';
import Badge from '../components/common/Badge';
import { 
  ArrowLeft, Download, Package, Calendar, MapPin, 
  CreditCard, Truck, CheckCircle, Clock, XCircle, AlertCircle, Phone, Mail, User
} from 'lucide-react';
import toast from 'react-hot-toast';

const STATUS_CONFIG = {
  pending: { color: 'yellow', icon: Clock, label: 'Order Placed', description: 'We have received your order.' },
  confirmed: { color: 'blue', icon: CheckCircle, label: 'Confirmed', description: 'Your order has been confirmed.' },
  processing: { color: 'indigo', icon: Package, label: 'Processing', description: 'We are preparing your order.' },
  shipped: { color: 'purple', icon: Truck, label: 'Shipped', description: 'Your order is on the way.' },
  delivered: { color: 'emerald', icon: CheckCircle, label: 'Delivered', description: 'Package delivered.' },
  cancelled: { color: 'red', icon: XCircle, label: 'Cancelled', description: 'This order has been cancelled.' },
  refunded: { color: 'gray', icon: AlertCircle, label: 'Refunded', description: 'This order has been refunded.' },
};

const ORDER_STEPS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await orderService.getOrder(id);
      setOrder(response.data);
    } catch (error) {
      console.error("Fetch order error", error);
      toast.error('Failed to load order details');
      navigate('/my-orders');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    setDownloading(true);
    try {
      await invoiceService.downloadInvoice(id);
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      toast.error('Failed to download invoice');
    } finally {
      setDownloading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) return;
    
    setCancelling(true);
    try {
      await orderService.cancelOrder(order._id);
      toast.success('Order cancelled successfully');
      fetchOrder(); // Refresh to update status
    } catch (error) {
      toast.error('Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <Loader text="Loading order details..." />;
  if (!order) return null;

  const statusConfig = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;
  const isTerminalState = ['cancelled', 'refunded'].includes(order.status);
  const currentStepIndex = ORDER_STEPS.indexOf(order.status);

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-[#000000] p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header navigation */}
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/my-orders')}
            className="group flex items-center gap-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm group-hover:border-gray-300 dark:group-hover:border-gray-600 transition-all">
               <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="font-medium">Back to Orders</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Left Column (Main Content) */}
           <div className="lg:col-span-2 space-y-8">
              
              {/* Order Status Card */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                 <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-800/50 flex flex-wrap gap-4 justify-between items-center">
                    <div>
                       <div className="flex items-center gap-3 mb-1">
                          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                             Order #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                          </h1>
                          <Badge color={statusConfig.color} className="flex items-center gap-1.5 px-2.5 py-0.5">
                             <StatusIcon className="w-3.5 h-3.5" />
                             {statusConfig.label}
                          </Badge>
                       </div>
                       <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Placed on {formatDate(order.createdAt)}
                       </p>
                    </div>
                    {/* Action Buttons (Desktop) */}
                    <div className="flex gap-3">
                       <button 
                          onClick={handleDownloadInvoice}
                          disabled={downloading}
                          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                       >
                          {downloading ? (
                             <div className="w-4 h-4 border-2 border-gray-400 border-t-red-600 rounded-full animate-spin" />
                          ) : (
                             <Download className="w-4 h-4" />
                          )}
                          Invoice
                       </button>

                       {(order.status === 'pending' || order.status === 'confirmed') && (
                          <button
                             onClick={handleCancelOrder}
                             disabled={cancelling}
                             className="flex items-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 rounded-xl text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-900/20 transition-all shadow-sm"
                          >
                             {cancelling ? 'Cancelling...' : 'Cancel Order'}
                          </button>
                       )}
                    </div>
                 </div>

                 {/* Stepper or Alert */}
                 <div className="p-8">
                    {!isTerminalState ? (
                       <div className="relative">
                          <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 dark:bg-gray-700 -translate-y-1/2 rounded-full" />
                          <div 
                             className="absolute top-1/2 left-0 h-1 bg-red-500 -translate-y-1/2 rounded-full transition-all duration-500"
                             style={{ width: `${(currentStepIndex / (ORDER_STEPS.length - 1)) * 100}%` }}
                          />
                          <div className="relative flex justify-between">
                             {ORDER_STEPS.map((step, index) => {
                                const isCompleted = index <= currentStepIndex;
                                const isCurrent = index === currentStepIndex;
                                const config = STATUS_CONFIG[step];
                                const StepIcon = config.icon;

                                return (
                                   <div key={step} className="flex flex-col items-center gap-2">
                                      <div className={`
                                         w-10 h-10 rounded-full flex items-center justify-center border-4 z-10 transition-all duration-300
                                         ${isCompleted 
                                            ? 'bg-red-500 border-red-100 dark:border-red-900 text-white shadow-lg shadow-red-500/30' 
                                            : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-300 dark:text-gray-600'
                                         }
                                         ${isCurrent ? 'ring-2 ring-red-500 ring-offset-2 dark:ring-offset-gray-900 scale-110' : ''}
                                      `}>
                                         <StepIcon className="w-5 h-5" />
                                      </div>
                                      <p className={`
                                         text-xs font-semibold uppercase tracking-wide hidden sm:block mt-1
                                         ${isCompleted ? 'text-red-600 dark:text-red-400' : 'text-gray-400 dark:text-gray-600'}
                                      `}>
                                         {config.label}
                                      </p>
                                   </div>
                                );
                             })}
                          </div>
                          <div className="mt-8 text-center sm:hidden">
                             <p className="font-semibold text-gray-900 dark:text-white mb-1">{statusConfig.label}</p>
                             <p className="text-sm text-gray-500 dark:text-gray-400">{statusConfig.description}</p>
                          </div>
                      </div>
                    ) : (
                       <div className={`rounded-xl p-4 border flex items-start gap-4 ${
                          order.status === 'cancelled' 
                             ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30' 
                             : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                       }`}>
                          <div className={`p-2 rounded-full ${
                             order.status === 'cancelled' ? 'bg-red-100 dark:bg-red-900/20 text-red-600' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                          }`}>
                             <StatusIcon className="w-5 h-5" />
                          </div>
                          <div>
                             <h3 className={`font-bold ${
                                order.status === 'cancelled' ? 'text-red-900 dark:text-red-200' : 'text-gray-900 dark:text-white'
                             }`}>
                                {statusConfig.label}
                             </h3>
                             <p className={`text-sm mt-1 ${
                                order.status === 'cancelled' ? 'text-red-700 dark:text-red-300' : 'text-gray-600 dark:text-gray-400'
                             }`}>
                                {statusConfig.description}
                             </p>
                          </div>
                       </div>
                    )}
                 </div>
              </div>

              {/* Order Items */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                 <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                       <Package className="w-5 h-5 text-gray-400" />
                       Items ({order.items.length})
                    </h2>
                 </div>
                 <div className="divide-y divide-gray-100 dark:divide-gray-700">
                    {order.items.map((item, idx) => (
                       <div key={idx} className="p-6 flex gap-6 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors">
                          <div className="w-24 h-24 bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 flex-shrink-0 overflow-hidden relative">
                             {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                             ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                   <Package className="w-8 h-8 text-gray-400" />
                                </div>
                             )}
                          </div>
                          <div className="flex-1 min-w-0 flex flex-col justify-center">
                             <div className="flex justify-between items-start gap-4">
                                <div>
                                   <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{item.name}</h3>
                                   <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                      Unit Price: {formatCurrency(item.price)}
                                   </p>
                                </div>
                                <p className="font-bold text-gray-900 dark:text-white text-lg">
                                   {formatCurrency(item.price * item.quantity)}
                                </p>
                             </div>
                             <div className="mt-4 flex items-center gap-4 text-sm">
                                <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-lg font-medium">
                                   Qty: {item.quantity}
                                </span>
                                {item.discount > 0 && (
                                   <span className="text-red-600 bg-red-50 dark:bg-red-900/30 px-3 py-1 rounded-lg font-medium border border-red-100 dark:border-red-900/50">
                                      Saved {item.discount}%
                                   </span>
                                )}
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Right Column (Sidebar) */}
           <div className="space-y-6">
              
              {/* Shipping Address */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                 <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    Delivery Details
                 </h3>
                 {order.shippingAddress ? (
                    <div className="space-y-4">
                       <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                             <User className="w-4 h-4 text-gray-500" />
                          </div>
                          <div>
                             <p className="text-sm text-gray-500 dark:text-gray-400 mb-0.5">Recipient</p>
                             <p className="font-semibold text-gray-900 dark:text-white">{order.shippingAddress.name}</p>
                          </div>
                       </div>
                       
                       <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                             <MapPin className="w-4 h-4 text-gray-500" />
                          </div>
                          <div>
                             <p className="text-sm text-gray-500 dark:text-gray-400 mb-0.5">Address</p>
                             <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                {order.shippingAddress.street}<br />
                                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
                                {order.shippingAddress.country}
                             </p>
                          </div>
                       </div>

                       <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-50 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                             <Phone className="w-4 h-4 text-gray-500" />
                          </div>
                          <div>
                             <p className="text-sm text-gray-500 dark:text-gray-400 mb-0.5">Contact</p>
                             <p className="font-medium text-gray-900 dark:text-white">{order.shippingAddress.phone}</p>
                          </div>
                       </div>
                    </div>
                 ) : (
                    <div className="text-center py-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-dashed border-gray-200 dark:border-gray-600">
                       <p className="text-sm text-gray-500 dark:text-gray-400">No details available</p>
                    </div>
                 )}
              </div>

              {/* Payment Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
                 <h3 className="font-bold text-gray-900 dark:text-white mb-5 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-gray-400" />
                    Payment Summary
                 </h3>
                 <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                       <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                       <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(order.subtotal || order.total)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                       <span className="text-gray-600 dark:text-gray-400">Tax</span>
                       <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(order.tax || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                       <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                       <span className="font-medium text-gray-900 dark:text-white">{formatCurrency(order.shippingCost || 0)}</span>
                    </div>
                    <div className="pt-4 mt-4 border-t border-gray-100 dark:border-gray-700">
                       <div className="flex justify-between items-end">
                          <span className="text-base font-bold text-gray-900 dark:text-white">Total</span>
                          <span className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(order.total)}</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Support Info */}
              <div className="bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30 p-6">
                  <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">Need help?</h4>
                  <p className="text-sm text-red-700 dark:text-red-300 mb-4">
                     If you have any questions about this order, please contact our support team.
                  </p>
                  <button className="text-sm font-semibold text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200 hover:underline">
                     Contact Support &rarr;
                  </button>
              </div>

           </div>
        </div>
      </div>
    </div>
  );
}
