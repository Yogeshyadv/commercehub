import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  User as UserIcon, 
  Package, 
  CreditCard,
  Truck,
  ArrowLeft,
  ChevronDown,
  ShoppingCart,
  Menu,
  LogOut,
  Lock,
  Star
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { invoiceService } from '../services/invoiceService';
import { orderService } from '../services/orderService';
import { formatCurrency } from '../utils/formatters';
import Footer from '../components/layout/Footer';
import toast from 'react-hot-toast';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart, itemCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [activeStep, setActiveStep] = useState(2); // 1: Login (Auto), 2: Address, 3: Summary, 4: Payment
  const [invoiceLoading, setInvoiceLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.firstName ? `${user.firstName} ${user.lastName}` : (user?.name || ''),
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    notes: '',
  });

  // Pricing Logic (Matching Cart.jsx)
  const totalSellingPrice = items.reduce((acc, item) => {
    return acc + (item.product.price * item.quantity);
  }, 0);
  
  const totalOriginalPrice = items.reduce((acc, item) => {
    const originalPrice = item.product.compareAtPrice || item.product.price;
    return acc + (originalPrice * item.quantity);
  }, 0);

  const totalDiscount = totalOriginalPrice - totalSellingPrice;
  const packagingFee = items.length * 59;
  const deliveryCharges = totalSellingPrice > 500 ? 0 : 40;
  const finalAmount = totalSellingPrice + packagingFee + deliveryCharges;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.address || !formData.pincode || !formData.city || !formData.state) {
        toast.error('Please fill in all address fields');
        return;
    }
    setActiveStep(3);
    window.scrollTo(0, 0); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/store');
      return;
    }

    setLoading(true);
    try {
      const orderData = {
        items: items.map(item => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        shippingAddress: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.pincode,
          country: 'India',
        },
        paymentMethod: 'cod', // Defaulting to COD
        totalAmount: finalAmount, // Passing calculated amount
        customerNotes: formData.notes,
      };

      const response = await orderService.createCustomerOrder(orderData);
      setOrderId(response.data._id);
      setOrderPlaced(true);
      clearCart();
      toast.success('Order placed successfully!');
      window.scrollTo(0,0);
    } catch (error) {
       console.error("Order creation failed", error);
       toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  const handleDownloadInvoice = async (e) => {
    e.preventDefault();
    if (!orderId) return;
    setInvoiceLoading(true);
    try {
      await invoiceService.downloadInvoice(orderId);
      toast.success('Invoice downloaded successfully');
    } catch (error) {
      toast.error('Failed to download invoice. Please try again from My Orders page.');
    } finally {
      setInvoiceLoading(false);
    }
  };
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-[#F1F2F4] flex flex-col font-sans">
        {/* Navbar */}
        <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
            <div className="max-w-[1600px] mx-auto px-4 lg:px-6">
            <div className="flex h-[72px] items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div onClick={() => navigate('/')} className="cursor-pointer flex items-center gap-2 select-none">
                    <span className="text-2xl font-bold tracking-tight text-emerald-600 italic">
                        Commerce<span className="text-gray-800 not-italic">Hub</span>
                    </span>
                    </div>
                </div>
            </div>
            </div>
        </nav>

        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-sm shadow-sm border border-gray-200 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#25D366] to-[#128C7E]"></div>
            <div className="w-16 h-16 bg-[#25D366]/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-[#25D366]" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h2>
            <p className="text-gray-500 mb-6">Thank you for your purchase. Your order has been confirmed.</p>
            
            <div className="bg-gray-50 rounded p-4 mb-6 text-left border border-gray-100">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Order ID:</span>
                    <span className="font-mono font-medium text-gray-900">#{orderId?.toString().slice(-8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-sm mb-4">
                    <span className="text-gray-500">Amount Paid:</span>
                    <span className="font-bold text-[#128C7E]">{formatCurrency(finalAmount)}</span>
                </div>
                
                <button 
                  onClick={handleDownloadInvoice}
                  disabled={invoiceLoading}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-[#128C7E] font-bold rounded-sm shadow-sm transition-all text-sm uppercase tracking-wide group"
                >
                  <Package className="w-4 h-4 text-[#128C7E] group-hover:scale-110 transition-transform" />
                  {invoiceLoading ? 'Generating...' : 'Download Invoice'}
                </button>
            </div>

            <div className="space-y-3">
              <button 
                onClick={() => navigate('/my-orders')} 
                className="w-full h-12 bg-[#25D366] text-white font-bold rounded-sm shadow-sm hover:bg-[#128C7E] hover:shadow-md transition-all uppercase text-sm tracking-wide transform hover:-translate-y-0.5"
              >
                Track Order
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full h-12 bg-white text-[#128C7E] font-bold border-2 border-[#128C7E] rounded-sm hover:bg-[#25D366]/10 transition-colors uppercase text-sm tracking-wide"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (items.length === 0) {
    // If accessing checkout with empty cart, redirect
    // Use effect is better but simple return null + navigate works here
    setTimeout(() => navigate('/store'), 0);
    return null; 
  }

  return (
    <div className="min-h-screen bg-[#F1F2F4] font-sans text-gray-800 flex flex-col">
      {/* Navbar (Same as Cart) */}
      <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6">
          <div className="flex h-[72px] items-center justify-between gap-6">
            
            {/* Logo area */}
            <div className="flex items-center gap-4">
                <div onClick={() => navigate('/')} className="cursor-pointer flex items-center gap-2 select-none">
                  <span className="text-2xl font-bold tracking-tight text-[#128C7E] italic">
                    Commerce<span className="text-gray-800 not-italic">Hub</span>
                  </span>
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-6">
                
                {/* User Profile */}
                <div className="relative group">
                    {isAuthenticated ? (
                      <button 
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="flex items-center gap-2 py-1 px-3 hover:bg-[#25D366]/10 rounded-lg transition-colors border border-transparent hover:border-[#25D366]/20"
                      >
                         <UserIcon className="w-5 h-5 text-gray-700" />
                         <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">{user?.firstName || 'Account'}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-2 bg-white text-[#128C7E] text-sm font-bold border border-[#25D366]/30 rounded-lg hover:bg-[#25D366] hover:text-white transition-all shadow-sm"
                      >
                        Login
                      </button>
                    )}

                    {/* Dropdown Menu */}
                     {isProfileOpen && isAuthenticated && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setIsProfileOpen(false)} />
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-[0_8px_16px_0_rgba(0,0,0,0.2)] border border-gray-100 z-40 py-1 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                           <div className="px-5 py-3 border-b border-gray-100 bg-[#25D366]/10">
                             <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                             <p className="text-sm font-bold text-gray-900 truncate">{user?.email}</p>
                           </div>
                           <button onClick={() => navigate('/dashboard')} className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 font-medium border-b border-gray-50"><Package className="w-4 h-4 text-[#128C7E]" /> Orders</button>
                           <button onClick={() => navigate('/wishlist')} className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 font-medium border-b border-gray-50"><Menu className="w-4 h-4 text-[#128C7E]" /> Wishlist</button>
                           <button onClick={() => { logout(); setIsProfileOpen(false); }} className="w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 font-medium"><LogOut className="w-4 h-4" /> Logout</button>
                        </div>
                      </>
                    )}
                </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 max-w-[1200px] mx-auto w-full px-4 lg:px-0 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Left Column: Checkout Steps (Approx 66%) */}
            <div className="flex-1 space-y-4">
                
                {/* Step 1: Login (Completed) */}
                <div className="bg-white rounded-sm shadow-sm border border-gray-100">
                    <div className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="w-7 h-7 bg-gray-100 text-[#128C7E] text-xs font-bold flex items-center justify-center rounded-[2px]">1</span>
                            <div>
                                <h3 className="text-gray-500 font-bold uppercase text-sm">Login</h3>
                                <p className="text-sm font-bold text-gray-900 mt-1 flex items-center gap-2">
                                     <CheckCircle className="w-4 h-4 text-[#128C7E]" />
                                     {user?.firstName ? `${user.firstName} ${user.lastName}` : 'Guest User'} 
                                     <span className="text-gray-500 font-normal ml-1 text-xs">{user?.email}</span>
                                </p>
                            </div>
                        </div>
                        <button className="text-[#128C7E] border border-gray-200 px-4 py-1.5 rounded-sm text-sm font-medium hover:shadow-sm uppercase">Change</button>
                    </div>
                </div>

                {/* Step 2: Delivery Address (Active or Completed) */}
                <div className="bg-white rounded-sm shadow-sm border border-gray-100">
                    <div className={`p-4 ${activeStep === 2 ? 'bg-[#25D366] text-white' : 'bg-white text-gray-500'}`}>
                        <div className="flex items-center gap-3">
                            <span className={`w-7 h-7 ${activeStep === 2 ? 'bg-white text-[#128C7E]' : 'bg-gray-100 text-gray-500'} text-xs font-bold flex items-center justify-center rounded-[2px]`}>2</span>
                            <h3 className={`font-bold uppercase text-sm ${activeStep === 2 ? 'text-white' : 'text-gray-500'}`}>Delivery Address</h3>
                            {activeStep > 2 && <CheckCircle className="w-5 h-5 text-[#128C7E] ml-auto" />}
                        </div>
                    </div>
                    
                    {activeStep === 2 && (
                    <div className="p-6">
                         
                         {/* Saved Addresses Section */}
                         {user?.addresses && user.addresses.length > 0 && (
                            <div className="mb-8">
                                <h4 className="text-gray-800 font-bold mb-4 uppercase text-xs tracking-wide">Or Select Saved Address</h4>
                                <div className="grid grid-cols-1 gap-3">
                                    {user.addresses.map((addr, idx) => (
                                        <div 
                                            key={idx} 
                                            onClick={() => {
                                                setFormData(prev => ({
                                                    ...prev,
                                                    address: addr.street || '',
                                                    city: addr.city || '',
                                                    state: addr.state || '',
                                                    pincode: addr.postalCode || ''
                                                }));
                                            }}
                                            className="group border border-gray-200 rounded-sm p-4 hover:border-[#25D366] hover:bg-[#25D366]/10 cursor-pointer transition-all flex items-start gap-4"
                                        >
                                            <div className="mt-1">
                                                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.address === addr.street ? 'border-[#25D366]' : 'border-gray-300 group-hover:border-[#25D366]'}`}>
                                                    {formData.address === addr.street && <div className="w-2 h-2 rounded-full bg-[#25D366]" />}
                                                </div>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-1.5 py-0.5 rounded-[2px] uppercase">{addr.label || 'Home'}</span>
                                                    <span className="font-bold text-gray-900 text-sm">{user.firstName} {user.lastName}</span>
                                                    <span className="text-gray-500 text-sm">{user.phone}</span>
                                                </div>
                                                <p className="text-sm text-gray-600 leading-relaxed">
                                                    {addr.street}, {addr.city}, {addr.state} - <span className="font-medium text-gray-900">{addr.postalCode}</span>
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="relative flex items-center gap-4 my-8">
                                    <div className="h-px bg-gray-200 flex-1"></div>
                                    <span className="text-xs text-gray-400 font-bold uppercase tracking-wide">Add New Address</span>
                                    <div className="h-px bg-gray-200 flex-1"></div>
                                </div>
                            </div>
                         )}

                         <form id="address-form" onSubmit={handleAddressSubmit} className="space-y-6 max-w-2xl">
                              <div className="grid grid-cols-2 gap-6">
                                  <div className="group">
                                      <label className="text-xs font-bold text-gray-600 mb-1.5 block uppercase tracking-wide group-focus-within:text-[#25D366] transition-colors">Name</label>
                                      <input 
                                        type="text" name="name" value={formData.name} onChange={handleChange}
                                        required
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366] focus:outline-none text-sm transition-all duration-200 placeholder-gray-400"
                                        placeholder="Full Name"
                                      />
                                  </div>
                                  <div className="group">
                                      <label className="text-xs font-bold text-gray-600 mb-1.5 block uppercase tracking-wide group-focus-within:text-[#25D366] transition-colors">10-digit mobile number</label>
                                      <input 
                                        type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                        required pattern="[0-9]{10}"
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366] focus:outline-none text-sm transition-all duration-200 placeholder-gray-400"
                                        placeholder="Mobile Number"
                                      />
                                  </div>
                              </div>
                              <div className="grid grid-cols-2 gap-6">
                                  <div className="group">
                                      <label className="text-xs font-bold text-gray-600 mb-1.5 block uppercase tracking-wide group-focus-within:text-emerald-600 transition-colors">Pincode</label>
                                      <input 
                                        type="text" name="pincode" value={formData.pincode} onChange={handleChange}
                                        required
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none text-sm transition-all duration-200 placeholder-gray-400"
                                        placeholder="Pincode"
                                      />
                                  </div>
                                  <div className="group">
                                      <label className="text-xs font-bold text-gray-600 mb-1.5 block uppercase tracking-wide group-focus-within:text-emerald-600 transition-colors">Locality</label>
                                      <input 
                                        type="text" name="city" value={formData.city} onChange={handleChange}
                                        required
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none text-sm transition-all duration-200 placeholder-gray-400"
                                        placeholder="Locality"
                                      />
                                  </div>
                              </div>
                              <div className="group">
                                  <label className="text-xs font-bold text-gray-600 mb-1.5 block uppercase tracking-wide group-focus-within:text-emerald-600 transition-colors">Address (Area and Street)</label>
                                  <textarea 
                                    name="address" rows="3" value={formData.address} onChange={handleChange}
                                    required
                                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none text-sm transition-all duration-200 placeholder-gray-400 resize-none"
                                    placeholder="Address (Area and Street)"
                                  />
                              </div>
                              <div className="grid grid-cols-2 gap-6">
                                  <div className="group">
                                      <label className="text-xs font-bold text-gray-600 mb-1.5 block uppercase tracking-wide group-focus-within:text-emerald-600 transition-colors">City/District/Town</label>
                                      <input 
                                        type="text" name="city" value={formData.city} onChange={handleChange} // Reusing city state for simplicity
                                        required
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none text-sm transition-all duration-200 placeholder-gray-400"
                                        placeholder="City/District/Town"
                                      />
                                  </div>
                                  <div className="group">
                                      <label className="text-xs font-bold text-gray-600 mb-1.5 block uppercase tracking-wide group-focus-within:text-emerald-600 transition-colors">State</label>
                                      <input 
                                        type="text" name="state" value={formData.state} onChange={handleChange}
                                        required
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-md focus:bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none text-sm transition-all duration-200 placeholder-gray-400"
                                        placeholder="State"
                                      />
                                  </div>
                              </div>

                              <button 
                                type="submit"
                                className="bg-emerald-600 text-white px-8 py-3.5 text-sm font-bold shadow-lg shadow-emerald-200 rounded-lg uppercase hover:bg-emerald-700 hover:shadow-xl transition-all transform hover:-translate-y-0.5 mt-4"
                              >
                                Save and Deliver Here
                              </button>
                         </form>
                    </div>
                    )}
                </div>

                {/* Step 3: Order Summary */}
                <div className="bg-white rounded-sm shadow-sm border border-gray-100">
                    <div className={`p-4 ${activeStep === 3 ? 'bg-[#25D366] text-white' : 'bg-white'}`}>
                        <div className="flex items-center gap-3">
                            <span className={`w-7 h-7 ${activeStep === 3 ? 'bg-white text-[#128C7E]' : 'bg-gray-100 text-gray-500'} text-xs font-bold flex items-center justify-center rounded-[2px]`}>3</span>
                            <h3 className={`font-bold uppercase text-sm ${activeStep === 3 ? 'text-white' : 'text-gray-500'}`}>Order Summary</h3>
                            {activeStep > 3 && <CheckCircle className="w-5 h-5 text-[#128C7E] ml-auto" />}
                        </div>
                    </div>
                    {activeStep === 3 && (
                        <div className="p-4">
                            {items.map((item) => (
                            <div key={item.product._id} className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
                                <div className="w-20 h-20 shrink-0 border border-gray-100 p-1 rounded-sm">
                                    <img src={item.product.images?.[0]?.url || ''} alt="" className="w-full h-full object-contain" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 mb-1">{item.product.name}</h4>
                                    <p className="text-xs text-gray-500 mb-2">Seller: SuperComNet</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                                        <span className="font-bold text-gray-900">{formatCurrency(item.product.price * item.quantity)}</span>
                                    </div>
                                </div>
                            </div>
                            ))}
                            <div className="mt-4 flex justify-between items-center">
                                <span className="text-xs text-gray-500">Order confirmation email will be sent to <span className="font-bold text-gray-800">{formData.email}</span></span>
                                <button 
                                     onClick={() => setActiveStep(4)}
                                     className="bg-emerald-600 text-white px-8 py-3 text-sm font-bold shadow-lg shadow-emerald-200 rounded-lg uppercase hover:bg-emerald-700 hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                 {/* Step 4: Payment Options */}
                 <div className="bg-white rounded-sm shadow-sm border border-gray-100">
                    <div className={`p-4 ${activeStep === 4 ? 'bg-[#25D366] text-white' : 'bg-white'}`}>
                        <div className="flex items-center gap-3">
                            <span className={`w-7 h-7 ${activeStep === 4 ? 'bg-white text-[#128C7E]' : 'bg-gray-100 text-gray-500'} text-xs font-bold flex items-center justify-center rounded-[2px]`}>4</span>
                            <h3 className={`font-bold uppercase text-sm ${activeStep === 4 ? 'text-white' : 'text-gray-500'}`}>Payment Options</h3>
                        </div>
                    </div>
                    {activeStep === 4 && (
                        <div className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 border border-[#25D366]/20 bg-[#25D366]/5 rounded-sm">
                                    <input type="radio" checked readOnly className="w-4 h-4 text-[#128C7E] border-gray-300 focus:ring-[#25D366]" />
                                    <div className="flex-1">
                                        <span className="text-sm font-medium text-gray-900 block">Cash on Delivery</span>
                                        <span className="text-xs text-gray-500">Pay when you receive the order</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-4 border border-gray-200 rounded-sm opacity-60">
                                    <input type="radio" disabled className="w-4 h-4 text-[#128C7E] border-gray-300 focus:ring-[#25D366]" />
                                    <div className="flex-1">
                                        <span className="text-sm font-medium text-gray-900 block">Credit / Debit / ATM Card</span>
                                        <span className="text-xs text-gray-500">Add new card</span>
                                    </div>
                                    <CreditCard className="w-5 h-5 text-gray-400" />
                                </div>
                                
                                <button 
                                     onClick={handleSubmit} 
                                     disabled={loading}
                                     className="bg-emerald-600 text-white px-12 py-3.5 text-base font-bold shadow-lg shadow-emerald-200 rounded-lg uppercase hover:bg-emerald-700 hover:shadow-xl transition-all transform hover:-translate-y-0.5 mt-4 w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Processing...' : `Place Order`}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

            </div>

            {/* Right Column: Summaries (Approx 33%) */}
            <div className="lg:w-[360px] shrink-0 h-fit space-y-4">
                
                {/* Price Breakdown */}
                <div className="bg-white rounded-sm shadow-sm border border-gray-100">
                    <div className="p-4 border-b border-gray-100">
                        <h2 className="text-gray-500 font-bold uppercase text-base">Price Details</h2>
                    </div>
                    <div className="p-4 space-y-4">
                        <div className="flex justify-between text-base text-gray-800">
                            <span>Price ({itemCount} items)</span>
                            <span>{formatCurrency(totalOriginalPrice)}</span>
                        </div>
                        <div className="flex justify-between text-base text-gray-800">
                            <span>Discount</span>
                            <span className="text-[#25D366]">- {formatCurrency(totalDiscount)}</span>
                        </div>
                        <div className="flex justify-between text-base text-gray-800">
                            <span>Delivery Charges</span>
                            <span>
                                <span className="line-through text-gray-400 mr-1">₹40</span>
                                <span className="text-[#25D366]">Free</span>
                            </span>
                        </div>
                        <div className="flex justify-between text-base text-gray-800">
                            <span>Secured Packaging Fee</span>
                            <span>{formatCurrency(packagingFee)}</span>
                        </div>
                        
                        <div className="border-t border-gray-200 border-dashed my-4 pt-4">
                             <div className="flex justify-between text-lg font-bold text-gray-900">
                                <span>Total Payable</span>
                                <span>{formatCurrency(finalAmount)}</span>
                            </div>
                        </div>

                         <div className="text-[#25D366] font-medium text-sm pt-2">
                            You will save {formatCurrency(totalDiscount)} on this order
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 p-4 text-xs text-gray-500 font-bold uppercase">
                     <ShieldCheck className="w-8 h-8 text-gray-300" />
                     Safe and Secure Payments. Easy returns. 100% Authentic products.
                </div>
            </div>

        </div>
      </div>
      <Footer />
    </div>
  );
}
