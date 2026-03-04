import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  ShoppingCart,
  Trash2, 
  Minus, 
  Plus, 
  ChevronLeft, 
  ChevronDown,
  ShieldCheck, 
  Truck,
  Zap,
  Star,
  Package,
  ArrowRight,
  User,
  LogOut,
  Menu
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/layout/Footer';
import { formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, subtotal, clearCart, itemCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Calculations
  // Assuming a static discount structure for now if not present in product data
  // We'll calculate "Original Price" total vs "Selling Price" total to show savings
  const totalOriginalPrice = items.reduce((acc, item) => {
    const originalPrice = item.product.compareAtPrice || item.product.price;
    return acc + (originalPrice * item.quantity);
  }, 0);
  
  const totalSellingPrice = items.reduce((acc, item) => {
    return acc + (item.product.price * item.quantity);
  }, 0);

  const totalDiscount = totalOriginalPrice - totalSellingPrice;
  
  // Extras
  const packagingFee = items.length * 59; // ₹59 per item as seen in product detail mockup
  const deliveryCharges = totalSellingPrice > 500 ? 0 : 40;
  const deliveryStatus = deliveryCharges === 0 ? 'Free' : formatCurrency(deliveryCharges);
  
  const finalAmount = totalSellingPrice + packagingFee + deliveryCharges;

  const handleUpdateQuantity = (productId, newQuantity, stock) => {
    if (newQuantity > stock) {
      toast.error(`Only ${stock} units available`);
      return;
    }
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId, productName) => {
    removeItem(productId);
    toast.success(`${productName} removed`);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F1F2F4] flex flex-col font-sans">
        {/* Navbar (Unified) */}
      <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6">
          <div className="flex h-[72px] items-center justify-between gap-6">
            
            {/* Logo area */}
            <div className="flex items-center gap-4">
                <div onClick={() => navigate('/')} className="cursor-pointer flex items-center gap-2 select-none">
                  <span className="text-2xl font-bold tracking-tight text-emerald-600 italic">
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
                        className="flex items-center gap-2 py-1 px-3 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-100"
                      >
                         <User className="w-5 h-5 text-gray-700" />
                         <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">{user?.firstName || 'Account'}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-2 bg-white text-emerald-600 text-sm font-bold border border-emerald-200 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                      >
                        Login
                      </button>
                    )}

                    {/* Dropdown Menu */}
                     {isProfileOpen && isAuthenticated && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setIsProfileOpen(false)} />
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-[0_8px_16px_0_rgba(0,0,0,0.2)] border border-gray-100 z-40 py-1 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                           <div className="px-5 py-3 border-b border-gray-100 bg-emerald-50/50">
                             <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                             <p className="text-sm font-bold text-gray-900 truncate">{user?.email}</p>
                           </div>
                           <button onClick={() => navigate('/dashboard')} className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 font-medium border-b border-gray-50"><Package className="w-4 h-4 text-emerald-600" /> Orders</button>
                           <button onClick={() => { logout(); setIsProfileOpen(false); }} className="w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 font-medium"><LogOut className="w-4 h-4" /> Logout</button>
                        </div>
                      </>
                    )}
                </div>

                {/* Cart */}
                <button 
                    onClick={() => navigate('/cart')}
                    className="relative flex items-center gap-2 text-gray-700 hover:text-emerald-600 font-semibold text-sm group"
                >
                    <div className="relative">
                      <ShoppingCart className="w-5 h-5" />
                      {itemCount > 0 && (
                        <span className="absolute -top-2 -right-2 min-w-[16px] h-[16px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white">
                          {itemCount}
                        </span>
                      )}
                    </div>
                </button>
            </div>
          </div>
        </div>
      </nav>

        <div className="flex-1 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded shadow-sm text-center max-w-md w-full">
                <div className="w-48 h-48 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
                    <img 
                        src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90" 
                        alt="Empty Cart" 
                        className="w-40 opacity-80"
                    />
                </div>
                <h2 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty!</h2>
                <p className="text-sm text-gray-500 mb-6">Explore our wide selection and find something you like</p>
                <button 
                    onClick={() => navigate('/')}
                    className="bg-[#25D366] text-white px-8 py-3 font-medium text-sm rounded-sm shadow hover:bg-[#128C7E] transition-colors uppercase"
                >
                    Shop Now
                </button>
            </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F2F4] font-sans text-gray-800 flex flex-col">
       {/* Navbar (Unified) */}
      <nav className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6">
          <div className="flex h-[72px] items-center justify-between gap-6">
            
            {/* Logo area */}
            <div className="flex items-center gap-4">
                <div onClick={() => navigate('/')} className="cursor-pointer flex items-center gap-2 select-none">
                  <span className="text-2xl font-bold tracking-tight text-emerald-600 italic">
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
                        className="flex items-center gap-2 py-1 px-3 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-100"
                      >
                         <User className="w-5 h-5 text-gray-700" />
                         <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">{user?.firstName || 'Account'}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-2 bg-white text-emerald-600 text-sm font-bold border border-emerald-200 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                      >
                        Login
                      </button>
                    )}

                    {/* Dropdown Menu */}
                     {isProfileOpen && isAuthenticated && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setIsProfileOpen(false)} />
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-[0_8px_16px_0_rgba(0,0,0,0.2)] border border-gray-100 z-40 py-1 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                           <div className="px-5 py-3 border-b border-gray-100 bg-emerald-50/50">
                             <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                             <p className="text-sm font-bold text-gray-900 truncate">{user?.email}</p>
                           </div>
                           <button onClick={() => navigate('/dashboard')} className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 font-medium border-b border-gray-50"><Package className="w-4 h-4 text-emerald-600" /> Orders</button>
                           <button onClick={() => { logout(); setIsProfileOpen(false); }} className="w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 font-medium"><LogOut className="w-4 h-4" /> Logout</button>
                        </div>
                      </>
                    )}
                </div>

                {/* Cart */}
                <button 
                    onClick={() => navigate('/cart')}
                    className="relative flex items-center gap-2 text-gray-700 hover:text-emerald-600 font-semibold text-sm group"
                >
                    <div className="relative">
                      <ShoppingCart className="w-5 h-5" />
                      {itemCount > 0 && (
                        <span className="absolute -top-2 -right-2 min-w-[16px] h-[16px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white">
                          {itemCount}
                        </span>
                      )}
                    </div>
                </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 max-w-[1200px] mx-auto w-full px-4 lg:px-0 py-8">
        <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Left Column: Cart Items (Approx 66%) */}
            <div className="flex-1">
                
                {/* Address Strip (Mock) */}
                {user && (
                    <div className="bg-white p-4 rounded-sm shadow-sm border border-gray-100 mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-500">Deliver to:</span>
                            <span className="font-bold text-gray-900">{user.firstName} {user.lastName}, 560102</span>
                            <span className="bg-gray-100 text-gray-500 text-[10px] px-1.5 py-0.5 rounded uppercase font-medium">Home</span>
                        </div>
                        <button className="text-[#128C7E] border border-gray-200 px-4 py-1.5 rounded-sm text-sm font-medium hover:shadow-sm">Change</button>
                    </div>
                )}

                {/* Cart Items List */}
                <div className="bg-white rounded-sm shadow-sm border border-gray-100 divide-y divide-gray-100">
                    {items.map((item) => (
                        <div key={item.product._id} className="p-6 flex gap-6 group relative">
                            
                            {/* Image */}
                            <div className="w-28 h-28 shrink-0 flex items-center justify-center p-2">
                                <img
                                    src={item.product.images?.[0]?.url || ''}
                                    alt={item.product.name}
                                    className="max-h-full max-w-full object-contain"
                                    onClick={() => navigate(`/product/${item.product._id}`)}
                                />
                            </div>

                            {/* Details */}
                            <div className="flex-1">
                                <h3 className="text-base font-medium text-gray-900 mb-1 hover:text-[#25D366] cursor-pointer transition-colors"
                                    onClick={() => navigate(`/product/${item.product._id}`)}
                                >
                                    {item.product.name}
                                </h3>
                                
                                <p className="text-sm text-gray-500 mb-3 flex items-center gap-2">
                                    <span>Seller: SuperComNet</span>
                                    {item.product.brand && (
                                        <span className="flex items-center gap-1 bg-gray-100 px-1 rounded">
                                            <img src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="" className="h-3" />
                                        </span>
                                    )}
                                </p>

                                <div className="flex items-baseline gap-3 mb-4">
                                     {item.product.compareAtPrice > item.product.price && (
                                        <span className="text-sm text-gray-500 line-through">
                                            {formatCurrency(item.product.compareAtPrice)}
                                        </span>
                                     )}
                                     <span className="text-lg font-bold text-gray-900">
                                        {formatCurrency(item.product.price)}
                                     </span>
                                     {item.product.compareAtPrice > item.product.price && (
                                        <span className="text-sm text-[#25D366] font-bold">
                                            {Math.round(((item.product.compareAtPrice - item.product.price) / item.product.compareAtPrice) * 100)}% Off
                                        </span>
                                     )}
                                </div>
                                
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <button 
                                            disabled={item.quantity <= 1}
                                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1, item.product.stock)}
                                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-800 disabled:opacity-30 disabled:hover:border-gray-300 transition-colors"
                                        >
                                            <Minus className="w-3 h-3" />
                                        </button>
                                        <div className="w-10 text-center font-medium border-gray-200 border bg-white py-0.5 text-sm">
                                            {item.quantity}
                                        </div>
                                        <button 
                                            disabled={item.quantity >= item.product.stock}
                                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1, item.product.stock)}
                                            className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:border-gray-800 disabled:opacity-30 disabled:hover:border-gray-300 transition-colors"
                                        >
                                            <Plus className="w-3 h-3" />
                                        </button>
                                    </div>
                                    
                                    <button className="text-base font-medium text-gray-900 hover:text-[#25D366] uppercase text-sm">Save for later</button>
                                    <button 
                                        onClick={() => handleRemoveItem(item.product._id, item.product.name)}
                                        className="text-base font-medium text-gray-900 hover:text-red-500 uppercase text-sm"
                                    >
                                        Remove
                                    </button>
                                </div>

                            </div>

                            {/* Delivery Date */}
                            <div className="text-sm hidden md:block w-48 shrink-0">
                                <div className="text-gray-900 mb-1">Delivery by Tomorrow, Sun | <span className="text-[#25D366]">Free</span> <span className="line-through text-gray-400">₹40</span></div>
                            </div>
                        </div>
                    ))}

                    <div className="p-4 border-t border-gray-100 flex justify-end bg-white sticky bottom-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10 lg:static lg:shadow-none">
                         <button 
                            onClick={() => navigate('/checkout')}
                            className="bg-emerald-600 text-white px-10 py-3.5 text-base font-bold shadow-lg shadow-emerald-200 rounded-lg uppercase hover:bg-emerald-700 transition-all transform hover:-translate-y-0.5"
                         >
                            Place Order
                         </button>
                    </div>
                </div>
            </div>

            {/* Right Column: Price Details (Approx 33%) */}
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
                                <span className="text-[#25D366]">{deliveryStatus}</span>
                            </span>
                        </div>
                        <div className="flex justify-between text-base text-gray-800">
                            <span>Secured Packaging Fee</span>
                            <span>{formatCurrency(packagingFee)}</span>
                        </div>
                        
                        <div className="border-t border-gray-200 border-dashed my-4 pt-4">
                             <div className="flex justify-between text-lg font-bold text-gray-900">
                                <span>Total Amount</span>
                                <span>{formatCurrency(finalAmount)}</span>
                            </div>
                        </div>

                         <div className="text-[#25D366] font-medium text-sm pt-2">
                            You will save {formatCurrency(totalDiscount + (deliveryCharges === 0 ? 40 : 0))} on this order
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
