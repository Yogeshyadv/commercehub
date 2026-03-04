import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Mail, Phone, MapPin, Calendar, ShoppingBag,
  CreditCard, Package, Clock, ShieldCheck, Edit, Trash2,
  TrendingUp, Activity, ExternalLink
} from 'lucide-react';
import { customerService } from '../services/customerService';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import StatsCard from '../components/dashboard/StatsCard'; // Reusing StatsCard for consistency
import { formatCurrency, formatDate, formatDateTime } from '../utils/formatters';
import toast from 'react-hot-toast';

const STATUS_COLORS = {
  pending: 'yellow',
  confirmed: 'blue',
  processing: 'purple',
  shipped: 'indigo',
  delivered: 'green',
  cancelled: 'red',
  refunded: 'gray',
  returned: 'orange',
};

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        setLoading(true);
        const data = await customerService.getCustomer(id);
        setCustomer(data.data);
      } catch (err) {
        toast.error('Failed to load customer details');
        navigate('/dashboard/customers');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomer();
  }, [id, navigate]);

  if (loading) return <Loader text="Loading customer profile..." />;
  if (!customer) return <EmptyState title="Customer not found" />;

  const stats = customer.stats || {};
  const addresses = customer.addresses || [];
  const recentOrders = customer.recentOrders || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/dashboard/customers')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl transition-colors text-gray-500 dark:text-gray-400"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          
          <div className="h-12 w-12 rounded-xl bg-[#25D366]/10 dark:bg-[#25D366]/20 flex items-center justify-center shrink-0 text-[#128C7E] dark:text-[#25D366] font-bold text-lg">
            {customer.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              {customer.name}
              {customer.group === 'vip' && (
                <span className="px-2 py-0.5 text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 rounded-full">
                  VIP
                </span>
              )}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">
              Customer since {formatDate(customer.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex gap-3">
            {/* Future: Add Edit/Delete buttons if needed, currently reusing the modal in main list is easier but distinct page edit is good too */}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Total Spent" 
          value={formatCurrency(stats.totalSpent || 0)} 
          icon={CreditCard} 
          color="green" 
        />
        <StatsCard 
          title="Total Orders" 
          value={stats.orderCount || 0} 
          icon={ShoppingBag} 
          color="blue" 
        />
        <StatsCard 
          title="Avg. Order Value" 
          value={formatCurrency(stats.totalSpent && stats.orderCount ? stats.totalSpent / stats.orderCount : 0)} 
          icon={TrendingUp} 
          color="purple" 
        />
        <StatsCard 
          title="Order Frequency" 
          value={stats.orderCount > 1 ? 'Repeating' : 'One-time'}
          subtitle={stats.lastOrder ? `Last: ${formatDate(stats.lastOrder)}` : 'No orders'}
          icon={Activity} 
          color="yellow" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Contact & Addresses */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Contact Info */}
          <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-gray-400" />
              Contact Details
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</p>
                  <a href={`mailto:${customer.email}`} className="text-gray-900 dark:text-white font-medium hover:text-blue-600 truncate block">
                    {customer.email || 'N/A'}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</p>
                  <a href={`tel:${customer.phone}`} className="text-gray-900 dark:text-white font-medium hover:text-green-600">
                    {customer.phone || 'N/A'}
                  </a>
                </div>
              </div>

              {customer.company && (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-50 dark:bg-zinc-800 flex items-center justify-center text-gray-600 dark:text-gray-400 shrink-0">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Company</p>
                    <p className="text-gray-900 dark:text-white font-medium">{customer.company}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Addresses */}
          <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-gray-400" />
              Addresses ({addresses.length})
            </h3>
            {addresses.length > 0 ? (
              <div className="space-y-4">
                {addresses.map((addr, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 relative group">
                    {addr.isDefault && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                        Default
                      </span>
                    )}
                    <p className="font-bold text-gray-900 dark:text-white text-sm mb-1">{addr.label || 'Address'}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                      {addr.street}<br/>
                      {addr.city}, {addr.state} {addr.zipCode}<br/>
                      {addr.country}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-400 dark:text-gray-500 text-sm">
                No addresses saved.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-gray-400" />
                Order History
              </h3>
             {/* If we implement full order history later, this link could go to filtered orders page */}
             {recentOrders.length > 0 && (
                <Link to={`/dashboard/orders?customer=${customer._id}`} className="text-sm font-semibold text-[#128C7E] dark:text-[#25D366] hover:underline flex items-center gap-1">
                    View All <ExternalLink className="w-3 h-3" />
                </Link>
             )}
            </div>
            
            {recentOrders.length > 0 ? (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {recentOrders.map((order) => (
                  <div key={order._id} className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors group">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-baseline gap-3">
                          <Link to={`/dashboard/order/${order._id}`} className="text-lg font-bold text-gray-900 dark:text-white hover:text-[#128C7E] dark:hover:text-[#25D366] transition-colors">
                            #{order.orderNumber} // Assume orderNumber exists or slice _id
                          </Link>
                          <Badge color={STATUS_COLORS[order.status]}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDateTime(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(order.total)}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {order.items?.length || 0} items
                        </p>
                      </div>
                    </div>
                    
                    {/* Order Items Preview (if available in summary) */}
                    {/* Assuming order object has simple summary or we fetching it. 
                        Usually stats endpoint returns lean order objects. 
                        Let's check controller. It returns Order.find()... so mostly full object. */}
                    
                  </div>
                ))}
              </div>
            ) : (
                <EmptyState 
                    icon={ShoppingBag} 
                    title="No orders yet" 
                    description="This customer hasn't placed any orders." 
                />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}