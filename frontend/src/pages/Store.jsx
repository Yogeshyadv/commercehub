import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, ShoppingCart, Filter, X, ChevronDown, 
  Tag, Star, Package, ArrowRight, Heart,
  SlidersHorizontal, Check, Zap, Truck, Menu, User, LogOut,
  ChevronLeft, ChevronRight, Gift, ShieldCheck, Smartphone, Watch, Monitor, Home, MoveRight
} from 'lucide-react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Footer from '../components/layout/Footer';
import { formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';

const HERO_SLIDES = [
  {
    id: 1,
    title: "Premium Tech",
    subtitle: "Next Gen Performance",
    image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=2000",
    cta: "Shop Electronics"
  },
  {
    id: 2,
    title: "Urban Fashion",
    subtitle: "New Streetwear Collection",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&q=80&w=2000",
    cta: "Discover Style"
  },
  {
    id: 3,
    title: "Modern Living",
    subtitle: "Elevate Your Home",
    image: "https://images.unsplash.com/photo-1616047006789-b7af5afb8c20?auto=format&fit=crop&q=80&w=2000",
    cta: "Browse Decor"
  },
  {
    id: 4,
    title: "Active Lifestyle",
    subtitle: "Gear for Champions",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=2000",
    cta: "Shop Sports"
  },
  {
    id: 5,
    title: "Ultimate Sound",
    subtitle: "Immersive Audio Experience",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=2000",
    cta: "View Headphones"
  },
  {
    id: 6,
    title: "Luxury Timepieces",
    subtitle: "Timeless Elegance",
    image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=2000",
    cta: "View Watches"
  }
];

// Simplified Category Icons for the top bar
// (Previous category code removed)

export default function Store() {
  const navigate = useNavigate();
  const { addItem, itemCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Filters
  const [search, setSearch] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortBy, setSortBy] = useState('popularity');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Auto-play slider
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 4000);
    return () => clearInterval(slideInterval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchProducts();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, selectedCategories, sortBy, priceRange.min, priceRange.max]);

  const fetchInitialData = async () => {
    try {
      const catsRes = await productService.getPublicCategories();
      setCategories(catsRes.data || []);
    } catch (error) {
      console.error('Failed to load categories');
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);

      // Map frontend sort option to backend field name
      let sortParam = '-viewCount';
      switch(sortBy) {
        case 'price_asc': sortParam = 'price'; break;
        case 'price_desc': sortParam = '-price'; break;
        case 'latest': sortParam = '-createdAt'; break;
        case 'popularity': sortParam = '-viewCount'; break;
        default: sortParam = '-viewCount';
      }

      const params = {
        search: search || undefined,
        category: selectedCategories.length > 0 ? selectedCategories.join(',') : undefined,
        sort: sortParam,
        minPrice: priceRange.min || undefined,
        maxPrice: priceRange.max || undefined
      };
      
      const response = await productService.getPublicProducts(params);
      // Ensure we only show valid products (basic client-side filtering)
      const validProducts = (response.data || []).filter(p => !p.isDeleted && p.status === 'active');
      setProducts(validProducts);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (cat) => {
    setSelectedCategories(prev => 
      prev.includes(cat) 
        ? prev.filter(c => c !== cat)
        : [...prev, cat]
    );
  };

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast.success('Added to cart!');
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);

  return (
    <div className="min-h-screen bg-[#F1F2F4] font-sans text-gray-800 flex flex-col">
      
      {/* 1. Header / Navbar */}
      <nav className="bg-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6">
          <div className="flex h-[72px] items-center justify-between gap-6">
            
            {/* Logo area */}
            <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowMobileFilters(true)}
                  className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <Menu className="w-6 h-6" />
                </button>
                
                <div onClick={() => navigate('/')} className="cursor-pointer flex items-center gap-2 select-none">
                  <span className="text-2xl font-bold tracking-tight text-[#128C7E] italic">
                    Commerce<span className="text-gray-800 not-italic">Hub</span>
                    <span className="text-xs text-gray-400 not-italic font-normal ml-1">Explore Plus</span>
                  </span>
                </div>
            </div>

            {/* Search Bar - Flipkart Style */}
            <div className="flex-1 max-w-2xl mx-auto hidden md:block">
                <div className="relative group">
                  <input
                      type="text"
                      className="w-full pl-5 pr-12 py-2.5 bg-[#25D366]/5 border border-transparent focus:border-white rounded-lg text-sm focus:ring-2 focus:ring-[#25D366]/20 focus:bg-white transition-all text-gray-700 placeholder-gray-400 shadow-inner"
                      placeholder="Search for products, brands and more"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                  />
                  <Search className="absolute right-4 top-2.5 w-5 h-5 text-[#128C7E]" />
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
                        <User className="w-5 h-5 text-gray-700" />
                         <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">{user?.firstName || 'My Account'}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate('/login')}
                        className="px-8 py-2 bg-white text-[#128C7E] text-sm font-bold border border-[#25D366]/30 rounded-lg hover:bg-[#25D366] hover:text-white transition-all shadow-sm"
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
                           <button onClick={() => navigate('/wishlist')} className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 font-medium border-b border-gray-50"><Heart className="w-4 h-4 text-[#128C7E]" /> Wishlist</button>
                           <button onClick={() => navigate('/settings')} className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 font-medium border-b border-gray-50"><User className="w-4 h-4 text-[#128C7E]" /> Profile</button>
                           <button onClick={() => { logout(); setIsProfileOpen(false); }} className="w-full text-left px-5 py-3 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 font-medium"><LogOut className="w-4 h-4" /> Logout</button>
                        </div>
                      </>
                    )}
                </div>

                {/* Cart */}
                <button 
                    onClick={() => navigate('/cart')}
                    className="relative flex items-center gap-2 text-gray-700 hover:text-[#128C7E] font-semibold text-sm group"
                >
                    <div className="relative">
                      <ShoppingCart className="w-5 h-5" />
                      {itemCount > 0 && (
                        <span className="absolute -top-2 -right-2 min-w-[16px] h-[16px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 border-2 border-white">
                          {itemCount}
                        </span>
                      )}
                    </div>
                    <span>Cart</span>
                </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 2. Service Promise / Trust Bar */}
      <div className="bg-white sticky top-[72px] z-40 border-b border-gray-100 mb-6 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-4 lg:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-50 py-4">
                <div className="flex items-center gap-4 justify-center md:justify-start px-4 group cursor-default">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 transition-transform group-hover:scale-110">
                        <Truck className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-800">Free Delivery</p>
                        <p className="text-xs text-gray-500 font-medium">Orders from $200</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 justify-center md:justify-start px-4 group cursor-default">
                    <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center text-[#128C7E] transition-transform group-hover:scale-110">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-800">Secure Payment</p>
                        <p className="text-xs text-gray-500 font-medium">100% Safe Payment</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 justify-center md:justify-start px-4 group cursor-default">
                    <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 transition-transform group-hover:scale-110">
                        <Check className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-800">Quality Guarantee</p>
                        <p className="text-xs text-gray-500 font-medium">Certified Products</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 justify-center md:justify-start px-4 group cursor-default">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 transition-transform group-hover:scale-110">
                        <Zap className="w-5 h-5" />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-gray-800">Guaranteed Savings</p>
                        <p className="text-xs text-gray-500 font-medium">Best Price Policy</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* 3. Main Split Layout */}
      <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6 flex gap-4 items-start flex-1 w-full pb-8">
        
        {/* LEFT SIDEBAR (Sticky) */}
        <aside className="hidden lg:block w-[280px] flex-shrink-0 bg-white shadow-sm rounded-lg overflow-hidden sticky top-[80px]">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">Filters</h2>
                {(selectedCategories.length > 0 || priceRange.min || priceRange.max) && (
                    <button 
                        onClick={() => { setSelectedCategories([]); setPriceRange({ min: '', max: '' }); setSearch(''); }}
                        className="text-xs font-bold text-[#25D366] hover:text-[#128C7E] uppercase"
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Filter Sections */}
            <div className="p-4 border-b border-gray-100">
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Price</h3>
                <div className="space-y-2">
                    <div className="flex gap-2 items-center">
                        <select 
                            value={priceRange.min}
                            onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                            className="w-full text-sm border-gray-200 rounded-md focus:ring-[#25D366] focus:border-[#25D366]"
                        >
                            <option value="">Min</option>
                            <option value="500">₹500</option>
                            <option value="1000">₹1000</option>
                            <option value="5000">₹5000</option>
                        </select>
                        <span className="text-gray-400 text-xs">to</span>
                        <select 
                             value={priceRange.max}
                             onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                             className="w-full text-sm border-gray-200 rounded-md focus:ring-[#25D366] focus:border-[#25D366]"
                        >
                            <option value="">Max</option>
                            <option value="2000">₹2000</option>
                            <option value="5000">₹5000</option>
                            <option value="10000">₹10000+</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-3">Categories</h3>
                <div className="flex flex-col gap-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar">
                    {categories.map((cat) => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group text-sm text-gray-700 hover:text-gray-900">
                             <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${selectedCategories.includes(cat) ? 'bg-[#25D366] border-[#25D366]' : 'border-gray-400 bg-white'}`}>
                                {selectedCategories.includes(cat) && <Check className="w-3 h-3 text-white" />}
                             </div>
                             <input type="checkbox" className="hidden" checked={selectedCategories.includes(cat)} onChange={() => toggleCategory(cat)} />
                             <span className={selectedCategories.includes(cat) ? 'font-bold' : 'font-normal'}>{cat}</span>
                        </label>
                    ))}
                </div>
            </div>
        </aside>

        {/* RIGHT MAIN CONTENT */}
        <main className="flex-1 min-w-0">
            
            {/* HERO SLIDER (Inside Content, Full Width) */}
            <div className="bg-white p-2 shadow-sm rounded-lg mb-4">
                <div className="relative w-full h-[280px] sm:h-[320px] rounded-md overflow-hidden group">
                     {HERO_SLIDES.map((slide, index) => (
                        <div 
                            key={slide.id}
                            className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                        >
                            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 text-white">
                                <h2 className="text-3xl md:text-5xl font-bold mb-2 drop-shadow-lg">{slide.title}</h2>
                                <p className="text-lg text-gray-200 mb-4">{slide.subtitle}</p>
                                <button className="bg-white text-gray-900 px-6 py-2 rounded-sm font-bold w-fit hover:bg-[#25D366]/20 transition-colors shadow-lg">
                                    {slide.cta}
                                </button>
                            </div>
                        </div>
                    ))}
                    {/* Controls */}
                    <button onClick={prevSlide} className="absolute left-0 top-0 bottom-0 px-4 z-20 hover:bg-white/10 transition-colors group-hover:opacity-100 opacity-0 flex items-center"><ChevronLeft className="w-8 h-8 text-white drop-shadow-md" /></button>
                    <button onClick={nextSlide} className="absolute right-0 top-0 bottom-0 px-4 z-20 hover:bg-white/10 transition-colors group-hover:opacity-100 opacity-0 flex items-center"><ChevronRight className="w-8 h-8 text-white drop-shadow-md" /></button>
                </div>
            </div>

            {/* SORTING BAR */}
            <div className="bg-white p-4 rounded-lg shadow-sm border-b border-gray-100 mb-4 flex items-center gap-6">
                <span className="text-sm font-bold text-gray-800">Sort By</span>
                <div className="flex items-center gap-6 text-sm">
                    {[
                        { id: 'popularity', label: 'Popularity' },
                        { id: 'price_asc', label: 'Price -- Low to High' },
                        { id: 'price_desc', label: 'Price -- High to Low' },
                        { id: 'latest', label: 'Newest First' },
                    ].map((opt) => (
                        <button 
                            key={opt.id} 
                            onClick={() => setSortBy(opt.id)}
                            className={`font-medium transition-colors border-b-2 py-1 ${sortBy === opt.id ? 'text-[#25D366] border-[#25D366]' : 'text-gray-500 border-transparent hover:text-gray-800'}`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* PRODUCT GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {products.length === 0 && !loading ? (
                    <div className="col-span-full bg-white p-12 rounded-lg text-center shadow-sm">
                        <EmptyState 
                            icon={Package} 
                            title="No products found" 
                            description="Adjust your filters or check back later." 
                            actionLabel="Reset Search"
                            onAction={() => { setSearch(''); setSelectedCategories([]); setPriceRange({ min: '', max: '' }); }}
                        />
                    </div>
                ) : (
                    products.map((product) => (
                        <div 
                            key={product._id} 
                            onClick={() => navigate(`/product/${product._id}`)}
                            className="bg-white border hover:shadow-[0_3px_16px_0_rgba(0,0,0,0.1)] rounded-lg p-4 cursor-pointer transition-shadow group flex flex-col relative"
                        >
                            {/* Wishlist */}
                            <button className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors z-10"><Heart className="w-5 h-5 fill-current" /></button>
                            
                            {/* Image */}
                            <div className="h-48 w-full flex items-center justify-center mb-4 relative overflow-hidden">
                                <img 
                                    src={product.images?.[0]?.url || 'https://via.placeholder.com/300?text=No+Image'} 
                                    alt={product.name} 
                                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex flex-col flex-1">
                                <h3 className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-[#25D366] transition-colors min-h-[40px]" title={product.name}>{product.name}</h3>
                                
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="bg-[#128C7E] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm flex items-center gap-0.5">
                                        4.4 <Star className="w-2.5 h-2.5 fill-current" />
                                    </div>
                                    <span className="text-gray-400 text-xs font-medium">({product.viewCount || Math.floor(Math.random() * 1000)})</span>
                                </div>

                                <div className="mt-2 flex items-center gap-2 flex-wrap">
                                    <span className="text-lg font-bold text-gray-900">{formatCurrency(product.price)}</span>
                                    {product.compareAtPrice > product.price && (
                                        <>
                                            <span className="text-sm text-gray-500 line-through">{formatCurrency(product.compareAtPrice)}</span>
                                            <span className="text-sm font-bold text-[#25D366]">
                                                {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% off
                                            </span>
                                        </>
                                    )}
                                </div>
                                
                                {/* Free Delivery Badge */}
                                {product.price > 500 && <div className="mt-2 text-[10px] font-bold text-gray-500 border border-gray-200 rounded px-1 w-fit">Free Delivery</div>}
                            </div>
                        </div>
                    ))
                )}

                {loading && [...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white p-4 rounded-lg shadow-sm h-80 animate-pulse border border-gray-100">
                        <div className="bg-gray-100 h-40 w-full mb-4 rounded"></div>
                        <div className="bg-gray-100 h-4 w-3/4 mb-2 rounded"></div>
                        <div className="bg-gray-100 h-4 w-1/2 mb-4 rounded"></div>
                    </div>
                ))}
            </div>
        </main>
      </div>
      
      {/* Mobile Wrapper for Sidebar (Hidden on Desktop) */}
      {showMobileFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/60" onClick={() => setShowMobileFilters(false)}></div>
              <div className="absolute inset-y-0 left-0 w-80 bg-white p-4 overflow-y-auto animate-in slide-in-from-left duration-200">
                  <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold">Filters</h2>
                      <button onClick={() => setShowMobileFilters(false)}><X className="w-6 h-6" /></button>
                  </div>
                   {/* Mobile Filters Content - Replicated for mobile convenience */}
                   <div className="space-y-6">
                        <div>
                            <h3 className="font-bold mb-2">Price</h3>
                            <div className="flex gap-2">
                                <input type="number" placeholder="Min" value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: e.target.value})} className="w-full border p-2 rounded" />
                                <input type="number" placeholder="Max" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: e.target.value})} className="w-full border p-2 rounded" />
                            </div>
                        </div>
                        <div>
                            <h3 className="font-bold mb-2">Categories</h3>
                            {categories.map(cat => (
                                <div key={cat} onClick={() => toggleCategory(cat)} className="flex items-center gap-2 py-2">
                                    <div className={`w-5 h-5 border flex items-center justify-center ${selectedCategories.includes(cat) ? 'bg-[#25D366] border-[#25D366]' : ''}`}>
                                        {selectedCategories.includes(cat) && <Check className="w-3 h-3 text-white" />}
                                    </div>
                                    <span>{cat}</span>
                                </div>
                            ))}
                        </div>
                   </div>
              </div>
          </div>
      )}
      
      {/* Footer */}
      <Footer />
    </div>
  );
}
