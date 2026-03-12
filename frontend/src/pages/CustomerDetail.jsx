import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Mail, Phone, MapPin, Calendar, ShoppingBag,
  CreditCard, Package, Clock, ShieldCheck, Edit, Trash2,
  TrendingUp, Activity, ExternalLink, Star, MessageSquare,
  Heart, Bell, Award, Target, Zap, Users, DollarSign,
  ChartBar, Filter, Download, Send, FileText, Camera,
  Globe, MailOpen, PhoneCall, HeadphonesIcon, Settings, Gift
} from 'lucide-react';
import { customerService } from '../services/customerService';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import StatsCard from '../components/dashboard/StatsCard';
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

const INTERACTION_TYPES = {
  email: { icon: Mail, color: 'blue', label: 'Email' },
  phone: { icon: Phone, color: 'green', label: 'Phone Call' },
  sms: { icon: MessageSquare, color: 'purple', label: 'SMS' },
  support: { icon: HeadphonesIcon, color: 'orange', label: 'Support Ticket' },
  review: { icon: Star, color: 'yellow', label: 'Review' },
  wishlist: { icon: Heart, color: 'red', label: 'Wishlist' },
  return: { icon: Package, color: 'gray', label: 'Return' },
  refund: { icon: CreditCard, color: 'indigo', label: 'Refund' },
};

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [interactions, setInteractions] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        const [customerRes, interactionsRes, analyticsRes] = await Promise.all([
          customerService.getCustomer(id),
          customerService.getCustomerInteractions(id),
          customerService.getCustomerAnalytics(id)
        ]);
        
        setCustomer(customerRes.data);
        setInteractions(interactionsRes.data || []);
        setAnalytics(analyticsRes.data || {});
      } catch (err) {
        console.error('Failed to load customer data:', err);
        toast.error('Failed to load customer details');
        navigate('/dashboard/customers');
      } finally {
        setLoading(false);
      }
    };
    fetchCustomerData();
  }, [id, navigate]);

  if (loading) return <Loader text="Loading customer profile..." />;
  if (!customer) return <EmptyState title="Customer not found" />;

  const stats = customer.stats || {};
  const addresses = customer.addresses || [];
  const recentOrders = customer.recentOrders || [];
  const lifetimeValue = analytics.lifetimeValue || stats.totalSpent || 0;
  const churnRisk = analytics.churnRisk || 'low';
  const loyaltyScore = analytics.loyaltyScore || 0;
  const communicationPreference = analytics.communicationPreference || 'email';

  const getChurnRiskColor = (risk) => {
    switch (risk) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const getLoyaltyTier = (score) => {
    if (score >= 80) return { tier: 'Platinum', color: 'purple', icon: Award, benefits: ['Free Shipping', 'Early Access', 'Dedicated Support', 'Exclusive Deals'] };
    if (score >= 60) return { tier: 'Gold', color: 'yellow', icon: Star, benefits: ['Free Shipping', 'Early Access', 'Special Discounts'] };
    if (score >= 40) return { tier: 'Silver', color: 'gray', icon: ShieldCheck, benefits: ['Free Shipping', 'Special Discounts'] };
    return { tier: 'Bronze', color: 'orange', icon: Target, benefits: ['Standard Support'] };
  };

  const loyaltyTier = getLoyaltyTier(loyaltyScore);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Enhanced Header with Actions */}
      <div className="bg-gradient-to-r from-[#DC2626] to-[#128C7E] rounded-2xl p-8 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24" />
        </div>
        
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex items-center gap-6">
              <button 
                onClick={() => navigate('/dashboard/customers')}
                className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all text-white backdrop-blur-sm"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              <div className="relative">
                <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0 text-3xl font-bold border-2 border-white/30 shadow-xl">
                  {customer.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                </div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-4xl font-bold">{customer.name}</h1>
                  <Badge color={loyaltyTier.color} className="bg-white/20 text-white border-white/30 px-3 py-1">
                    {loyaltyTier.tier}
                  </Badge>
                  {customer.group === 'vip' && (
                    <Badge color="purple" className="bg-white/20 text-white border-white/30 px-3 py-1">
                      VIP
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm mb-2">
                  <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                    <Calendar className="w-4 h-4" />
                    Customer since {formatDate(customer.createdAt)}
                  </span>
                  <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                    <MapPin className="w-4 h-4" />
                    {addresses[0]?.city || 'Location unknown'}
                  </span>
                  <span className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full">
                    <Activity className="w-4 h-4" />
                    Last active {analytics.lastActivity ? formatDate(analytics.lastActivity) : 'Never'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/70 text-xs">
                  <Mail className="w-3 h-3" />
                  {customer.email}
                  {customer.phone && (
                    <>
                      <span className="mx-2">•</span>
                      <Phone className="w-3 h-3" />
                      {customer.phone}
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3">
              <div className="flex gap-3">
                <Button variant="outline" className="bg-white/20 border-white/30 text-white hover:bg-white/30 backdrop-blur-sm">
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                <Button className="bg-white text-[#DC2626] hover:bg-gray-100 shadow-lg">
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>
              <div className="text-center">
                <div className="text-xs text-white/70 mb-1">Customer ID</div>
                <div className="text-sm font-mono bg-white/10 px-2 py-1 rounded">#{customer._id?.slice(-8).toUpperCase()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard 
          title="Lifetime Value" 
          value={formatCurrency(lifetimeValue)} 
          icon={DollarSign} 
          color="green"
          subtitle={`+${analytics.growthRate || 0}% vs last period`}
        />
        <StatsCard 
          title="Total Orders" 
          value={stats.orderCount || 0} 
          icon={ShoppingBag} 
          color="blue"
          subtitle={`${analytics.ordersThisMonth || 0} this month`}
        />
        <StatsCard 
          title="Avg. Order Value" 
          value={formatCurrency(stats.totalSpent && stats.orderCount ? stats.totalSpent / stats.orderCount : 0)} 
          icon={TrendingUp} 
          color="purple"
          subtitle={`${analytics.frequency || 'N/A'} frequency`}
        />
        <StatsCard 
          title="Churn Risk" 
          value={churnRisk.charAt(0).toUpperCase() + churnRisk.slice(1)}
          icon={ShieldCheck} 
          color={getChurnRiskColor(churnRisk)}
          subtitle={`${loyaltyScore}/100 loyalty score`}
        />
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-2">
        <div className="flex space-x-1">
          {[
            { id: 'overview', label: 'Overview', icon: Users },
            { id: 'orders', label: 'Order History', icon: ShoppingBag },
            { id: 'interactions', label: 'Interactions', icon: MessageSquare },
            { id: 'analytics', label: 'Analytics', icon: ChartBar },
            { id: 'preferences', label: 'Preferences', icon: Settings }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all ${
                activeTab === tab.id
                  ? 'bg-[#DC2626] text-white shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Enhanced Contact Info */}
            <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#DC2626]" />
                Contact Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-zinc-900/50 group hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</p>
                    <a href={`mailto:${customer.email}`} className="text-gray-900 dark:text-white font-medium hover:text-blue-600 truncate block">
                      {customer.email || 'N/A'}
                    </a>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <MailOpen className="w-4 h-4 text-gray-400" />
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-zinc-900/50 group hover:bg-gray-100 dark:hover:bg-zinc-900 transition-colors cursor-pointer">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</p>
                    <a href={`tel:${customer.phone}`} className="text-gray-900 dark:text-white font-medium hover:text-green-600">
                      {customer.phone || 'N/A'}
                    </a>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <PhoneCall className="w-4 h-4 text-gray-400" />
                  </div>
                </div>

                {customer.company && (
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-zinc-900/50">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Company</p>
                      <p className="text-gray-900 dark:text-white font-medium">{customer.company}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-zinc-900/50">
                  <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center text-orange-600 dark:text-orange-400 shrink-0">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Communication</p>
                    <p className="text-gray-900 dark:text-white font-medium capitalize">{communicationPreference}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Loyalty Program */}
            <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-[#DC2626]" />
                Loyalty Program
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#DC2626]/5 to-[#128C7E]/5 rounded-xl border border-[#DC2626]/20">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full bg-${loyaltyTier.color}-100 dark:bg-${loyaltyTier.color}-900/20 flex items-center justify-center`}>
                      <loyaltyTier.icon className={`w-6 h-6 text-${loyaltyTier.color}-600 dark:text-${loyaltyTier.color}-400`} />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{loyaltyTier.tier} Member</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{loyaltyScore}/100 points</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 dark:text-gray-400">Next tier</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                      {loyaltyTier.tier === 'Platinum' ? 'Max' : `${100 - loyaltyScore} pts`}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Benefits:</p>
                  <div className="space-y-1">
                    {loyaltyTier.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <div className="w-1.5 h-1.5 bg-[#DC2626] rounded-full" />
                        {benefit}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Segments */}
            <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#DC2626]" />
                Customer Segments
              </h3>
              <div className="space-y-3">
                {[
                  { label: 'High Value', value: analytics.highValue || false, color: 'green' },
                  { label: 'Frequent Buyer', value: analytics.frequentBuyer || false, color: 'blue' },
                  { label: 'At Risk', value: churnRisk === 'high', color: 'red' },
                  { label: 'New Customer', value: analytics.newCustomer || false, color: 'purple' }
                ].map((segment, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-zinc-900/50">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{segment.label}</span>
                    <Badge color={segment.value ? segment.color : 'gray'}>
                      {segment.value ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Addresses */}
            <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#DC2626]" />
                Addresses ({addresses.length})
              </h3>
              {addresses.length > 0 ? (
                <div className="space-y-4">
                  {addresses.map((addr, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 relative group hover:border-[#DC2626]/30 transition-colors">
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

            {/* Quick Actions */}
            <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-[#DC2626]" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button className="w-full justify-start" variant="outline">
                  <Mail className="w-4 h-4 mr-3" />
                  Send Email Campaign
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Phone className="w-4 h-4 mr-3" />
                  Schedule Call
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Gift className="w-4 h-4 mr-3" />
                  Create Special Offer
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Download className="w-4 h-4 mr-3" />
                  Export Customer Data
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Dynamic Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {activeTab === 'overview' && (
              <>
                {/* Recent Orders */}
                <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <ShoppingBag className="w-5 h-5 text-[#DC2626]" />
                      Recent Orders
                    </h3>
                    {recentOrders.length > 0 && (
                      <Link to={`/dashboard/orders?customer=${customer._id}`} className="text-sm font-semibold text-[#128C7E] dark:text-[#DC2626] hover:underline flex items-center gap-1">
                        View All <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                  
                  {recentOrders.length > 0 ? (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                      {recentOrders.slice(0, 5).map((order) => (
                        <div key={order._id} className="p-4 sm:p-6 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors group">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                            <div>
                              <div className="flex items-baseline gap-3">
                                <Link to={`/dashboard/orders/${order._id}`} className="text-lg font-bold text-gray-900 dark:text-white hover:text-[#128C7E] dark:hover:text-[#DC2626] transition-colors">
                                  #{order.orderNumber || order._id.slice(-8)}
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
                          
                          {order.items && order.items.length > 0 && (
                            <div className="flex gap-2 mt-3">
                              {order.items.slice(0, 3).map((item, idx) => (
                                <div key={idx} className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-zinc-800 overflow-hidden">
                                  {item.image ? (
                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Package className="w-6 h-6 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                              ))}
                              {order.items.length > 3 && (
                                <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center">
                                  <span className="text-xs text-gray-500">+{order.items.length - 3}</span>
                                </div>
                              )}
                            </div>
                          )}
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

                {/* Recent Interactions */}
                <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-[#DC2626]" />
                      Recent Interactions
                    </h3>
                    <span className="text-sm text-gray-500">{interactions.length} total</span>
                  </div>
                  
                  {interactions.length > 0 ? (
                    <div className="divide-y divide-gray-100 dark:divide-gray-800">
                      {interactions.slice(0, 5).map((interaction) => {
                        const type = INTERACTION_TYPES[interaction.type];
                        const Icon = type?.icon || MessageSquare;
                        return (
                          <div key={interaction._id} className="p-4 hover:bg-gray-50 dark:hover:bg-zinc-900/50 transition-colors">
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-full bg-${type?.color}-100 dark:bg-${type?.color}-900/20 flex items-center justify-center text-${type?.color}-600 dark:text-${type?.color}-400 shrink-0 mt-1`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {type?.label || interaction.type}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {formatDateTime(interaction.createdAt)}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {interaction.description || interaction.subject || 'No description'}
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-400 dark:text-gray-500 text-sm">
                      No interactions recorded yet.
                    </div>
                  )}
                </div>
              </>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-[#DC2626]" />
                    Complete Order History
                  </h3>
                </div>
                <div className="p-6 text-center text-gray-500">
                  Full order history implementation coming soon...
                </div>
              </div>
            )}

            {activeTab === 'interactions' && (
              <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#DC2626]" />
                    Customer Interactions
                  </h3>
                </div>
                <div className="p-6 text-center text-gray-500">
                  Full interaction timeline coming soon...
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <ChartBar className="w-5 h-5 text-[#DC2626]" />
                    Customer Analytics
                  </h3>
                  <div className="p-6 text-center text-gray-500">
                    Advanced analytics dashboard coming soon...
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'preferences' && (
              <div className="bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-[#DC2626]" />
                  Customer Preferences
                </h3>
                <div className="p-6 text-center text-gray-500">
                  Customer preferences management coming soon...
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
