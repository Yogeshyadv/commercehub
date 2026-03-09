import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductReviews from '../components/catalog/ProductReviews'; // Import Reviews
import { 
  ShoppingCart, 
  ArrowLeft, 
  Heart, 
  Share2, 
  ShieldCheck,
  Truck,
  Star,
  ChevronDown,
  Info,
  Package,
  ArrowRight,
  Menu,
  User,
  LogOut,
  Check,
  AlertTriangle,
  Tag
} from 'lucide-react';
import { productService } from '../services/productService';
import { aiService } from '../services/aiService';
import { wishlistService } from '../services/wishlistService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import Footer from '../components/layout/Footer';
import { formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem, itemCount } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');
  const [similarProducts, setSimilarProducts] = useState([]);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    fetchProduct();
    fetchSimilarProducts();
    if (isAuthenticated) {
      checkWishlistStatus();
    }
    window.scrollTo(0, 0);
  }, [id, isAuthenticated]);

  const checkWishlistStatus = async () => {
    try {
      const res = await wishlistService.checkStatus(id);
      setIsWishlisted(res.data.isWishlisted);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchSimilarProducts = async () => {
    try {
      const res = await aiService.getSimilarProducts(id);
      setSimilarProducts(res.data || []);
    } catch (err) {
      console.error('Failed to load similar products', err);
    }
  };

  const fetchProduct = async () => {
    try {
      setLoading(true);
      let data = null;

      if (user) {
        try {
          const res = await productService.getProduct(id);
          data = res.data;
        } catch (err) {
            // Protected fetch failed
        }
      }

      if (!data) {
        try {
          const response = await productService.getPublicProduct(id);
          data = response.data;
        } catch (publicErr) {
          throw publicErr; 
        }
      }

      setProduct(data);
    } catch (error) {
      console.error(error);
      toast.error('Product not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    toast.success(
      <div className="flex flex-col">
        <span className="font-medium">Added to cart!</span>
        <span className="text-sm text-gray-500">{quantity} × {product.name}</span>
      </div>
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  const toggleWishlist = async () => {
    if (!isAuthenticated) {
        toast.error('Please login to use wishlist');
        navigate('/login');
        return;
    }
    
    try {
        if (isWishlisted) {
            await wishlistService.removeFromWishlist(id);
            toast.success('Removed from wishlist');
        } else {
            await wishlistService.addToWishlist(id);
            toast.success('Added to wishlist');
        }
        setIsWishlisted(!isWishlisted);
    } catch (err) {
        toast.error('Failed to update wishlist');
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: product.name,
        text: product.shortDescription,
        url: window.location.href,
      });
    } catch (err) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
      <Loader />
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-zinc-950 p-4">
      <Package className="w-16 h-16 text-gray-300 dark:text-zinc-700 mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Product not found</h2>
      <button 
        onClick={() => navigate('/')}
        className="px-6 py-2.5 bg-[#DC2626] text-white rounded-full hover:bg-[#128C7E] transition-colors font-medium mt-4"
      >
        Return to Shop
      </button>
    </div>
  );

  const images = product.images?.length > 0 ? product.images : [{ url: '', alt: 'No image' }];
  const currentImage = images[selectedImageIndex];
  const discountPercentage = product.compareAtPrice > product.price 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-[#F1F2F4] font-sans text-gray-800 flex flex-col">
      
      {/* Navbar (Copied/Adapted from Store.jsx for consistency) */}
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
                        className="flex items-center gap-2 py-1 px-3 hover:bg-[#DC2626]/10 rounded-lg transition-colors border border-transparent hover:border-[#DC2626]/20"
                      >
                        <User className="w-5 h-5 text-gray-700" />
                         <span className="text-sm font-semibold text-gray-700 whitespace-nowrap">{user?.firstName || 'Account'}</span>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-2 bg-white text-[#128C7E] text-sm font-bold border border-[#DC2626]/30 rounded-lg hover:bg-[#DC2626] hover:text-white transition-all shadow-sm"
                      >
                        Login
                      </button>
                    )}

                    {/* Dropdown Menu */}
                     {isProfileOpen && isAuthenticated && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setIsProfileOpen(false)} />
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-[0_8px_16px_0_rgba(0,0,0,0.2)] border border-gray-100 z-40 py-1 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                           <div className="px-5 py-3 border-b border-gray-100 bg-[#DC2626]/10">
                             <p className="text-xs text-gray-500 font-medium">Signed in as</p>
                             <p className="text-sm font-bold text-gray-900 truncate">{user?.email}</p>
                           </div>
                           <button onClick={() => navigate('/dashboard')} className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 font-medium border-b border-gray-50"><Package className="w-4 h-4 text-[#128C7E]" /> Orders</button>
                           <button onClick={() => navigate('/wishlist')} className="w-full text-left px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 font-medium border-b border-gray-50"><Heart className="w-4 h-4 text-[#128C7E]" /> Wishlist</button>
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
                </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-[1600px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <button onClick={() => navigate('/')} className="hover:text-[#DC2626] transition-colors">Home</button>
            <span className="text-gray-300">/</span>
            <span className="text-[#128C7E] font-medium truncate max-w-[200px]">{product.name}</span>
        </div>

        <div className="bg-white rounded-sm shadow-sm border border-gray-100 mb-4">
            <div className="flex flex-col lg:flex-row">
                
                {/* Left Column: Visuals & Actions (Approx 40%) */}
                <div className="lg:w-[41.66%] p-4 lg:p-6 border-b lg:border-b-0 lg:border-r border-gray-100 relative min-h-[600px] flex flex-col">
                     <div className="sticky top-24 flex flex-col h-full"> 
                        <div className="flex gap-4 mb-6 flex-1 relative">
                            {/* Thumbnails (Vertical Strip) */}
                            {images.length > 1 && (
                                <div className="flex flex-col gap-2 w-16 shrink-0 h-[450px] overflow-y-auto no-scrollbar py-2">
                                    {images.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onMouseEnter={() => setSelectedImageIndex(idx)}
                                            onClick={() => setSelectedImageIndex(idx)}
                                            className={`relative w-16 h-16 shrink-0 rounded-sm overflow-hidden border-2 transition-all ${
                                                selectedImageIndex === idx 
                                                ? 'border-[#DC2626]' 
                                                : 'border-transparent hover:border-[#DC2626]'
                                            }`}
                                        >
                                            <img src={img.url} alt="" className="w-full h-full object-contain p-1" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Main Image */}
                            <div className="flex-1 flex items-center justify-center p-4 relative group min-h-[450px]">
                                {currentImage.url ? (
                                    <img
                                        src={currentImage.url}
                                        alt={currentImage.alt || product.name}
                                        className="w-full h-full max-h-[416px] object-contain transition-transform duration-300" 
                                    />
                                ) : (
                                    <div className="text-gray-300 flex flex-col items-center">
                                        <Package className="w-24 h-24 mb-4 text-gray-200" />
                                        <span className="text-gray-400 font-medium">No Image</span>
                                    </div>
                                )}
                                
                                <button onClick={toggleWishlist} className={`absolute top-2 right-2 p-2 rounded-full shadow-md bg-white border border-gray-100 z-10 ${isWishlisted ? 'text-red-500' : 'text-gray-300 hover:text-red-500'}`}>
                                     <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                                </button>
                            </div>
                        </div>

                        {/* Action Buttons (CommerceHub Style) */}
                        <div className="flex gap-3 mt-auto pt-4">
                            <button 
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0}
                                className="flex-1 h-14 bg-white text-[#128C7E] border-2 border-[#128C7E] font-bold text-[16px] rounded-sm shadow-sm hover:bg-[#DC2626]/10 transition-colors uppercase flex items-center justify-center gap-2"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Add to Cart
                            </button>
                            <button 
                                onClick={handleBuyNow}
                                disabled={product.stock <= 0}
                                className="flex-1 h-14 bg-[#DC2626] text-white font-bold text-[16px] rounded-sm shadow-sm hover:bg-[#128C7E] transition-colors uppercase flex items-center justify-center gap-2"
                            >
                                <ArrowRight className="w-5 h-5" />
                                Buy Now
                            </button>
                        </div>
                     </div>
                </div>

                {/* Right Column: Details (Approx 60%) */}
                <div className="lg:w-[58.34%] p-6 lg:p-8 flex flex-col bg-white">
                    
                    {/* Breadcrumb (Inline style) */}
                    <div className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                        Home <ChevronDown className="w-3 h-3 -rotate-90" /> {product.category || 'Product'} <ChevronDown className="w-3 h-3 -rotate-90" />
                    </div>

                    {/* Title */}
                    <h1 className="text-[18px] lg:text-[22px] font-normal text-gray-900 leading-tight mb-2">
                        {product.name}
                    </h1>

                    {/* Rating Badge */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex items-center gap-1 bg-[#128C7E] text-white px-2 py-0.5 rounded-[3px] text-xs font-bold shadow-sm">
                            <span className="mt-0.5">{product.rating ? product.rating.toFixed(1) : '0.0'}</span>
                            <Star className="w-3 h-3 fill-white" />
                        </div>
                        <span className="text-gray-500 text-sm font-medium">{product.numReviews || 0} Ratings & Reviews</span>
                        {product.brand && (
                             <div className="flex items-center gap-1 ml-2 bg-[#DC2626]/5 px-2 py-0.5 rounded border border-[#DC2626]/20">
                                <ShieldCheck className="w-3 h-3 text-[#128C7E]" />
                                <span className="text-xs font-bold text-[#128C7E]">CommerceHub Assured</span>
                             </div>
                        )}
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                        <div className="flex items-baseline gap-3">
                             <span className="text-[28px] font-medium text-gray-900">
                                {formatCurrency(product.price)}
                             </span>
                             {product.compareAtPrice > product.price && (
                                <span className="text-[16px] text-gray-500 line-through">
                                    {formatCurrency(product.compareAtPrice)}
                                </span>
                             )}
                             {discountPercentage > 0 && (
                                <span className="text-[16px] text-[#DC2626] font-bold">
                                    {discountPercentage}% off
                                </span>
                             )}
                        </div>
                         <div className="text-xs font-bold text-gray-700 mt-1">+ Packaging Fee: ₹59</div>
                    </div>

                    {/* Offers */}
                    <div className="mb-6">
                         <h3 className="text-sm font-bold text-gray-900 mb-2">Available offers</h3>
                         <ul className="space-y-2.5">
                            {[
                                "Bank Offer 5% Unlimited Cashback on CommerceHub Axis Bank Credit Card",
                                "Bank Offer 10% off up to ₹1,500 on HDFC Bank Credit Card EMI Txns",
                                "Special Price Get extra 20% off (price inclusive of cashback/coupon)",
                                "Partner Offer Sign up for CommerceHub Pay Later and get CommerceHub Gift Card worth up to ₹500*"
                            ].map((offer, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-gray-800">
                                    <Tag className="w-4 h-4 text-[#128C7E] mt-0.5 shrink-0" />
                                    <span><span className="font-medium">{offer}</span> <span className="text-[#128C7E] font-medium cursor-pointer ml-1">T&C</span></span>
                                </li>
                            ))}
                         </ul>
                    </div>

                    {/* Info Table */}
                    <div className="flex gap-16 mb-6">
                         <div className="w-24 text-gray-500 font-medium text-sm">Delivery</div>
                         <div className="flex-1">
                             <div className="border-b-2 border-[#DC2626] inline-block pb-1 mb-2">
                                <span className="text-sm font-medium text-gray-800 flex items-center gap-2">
                                    <Truck className="w-4 h-4 text-[#128C7E]" />
                                    Check Delivery
                                </span>
                             </div>
                             <p className="text-xs text-gray-500">Delivery by 11 PM, Tomorrow | <span className="text-[#DC2626]">Free</span> <span className="line-through text-gray-400">₹40</span></p>
                         </div>
                    </div>

                    <div className="flex gap-16 mb-6">
                         <div className="w-24 text-gray-500 font-medium text-sm">Highlights</div>
                         <ul className="flex-1 list-disc list-inside space-y-1">
                             {product.attributes && Object.entries(product.attributes).slice(0, 4).map(([k, v]) => (
                                 <li key={k} className="text-sm text-gray-800"><span className="text-gray-500 hidden">{k}:</span> {v}</li>
                             ))}
                             <li className="text-sm text-gray-800">1 Year Warranty for Phone and 6 Months for In-Box Accessories</li>
                             <li className="text-sm text-gray-800">All prices inclusive of taxes</li>
                         </ul>
                    </div>

                    <div className="flex gap-16 mb-6">
                         <div className="w-24 text-gray-500 font-medium text-sm">Seller</div>
                         <div className="flex-1">
                             <div className="flex gap-2 items-center mb-1">
                                <span className="text-sm font-medium text-[#128C7E]">SuperComNet</span>
                                <div className="bg-[#128C7E] text-white text-[10px] px-1.5 rounded-full flex items-center gap-0.5">
                                    4.9 <Star className="w-2.5 h-2.5 fill-white" />
                                </div>
                             </div>
                             <ul className="list-disc list-inside text-sm text-gray-800">
                                 <li>7 Days Service Center Replacement/Repair</li>
                                 <li>GST invoice available</li>
                             </ul>
                         </div>
                    </div>

                    {/* Description */}
                    <div className="border border-gray-200 mt-4 rounded-sm">
                         <div className="p-4 border-b border-gray-200 bg-white">
                             <h3 className="text-xl font-medium text-gray-800">Product Description</h3>
                         </div>
                         <div className="p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                            {product.description || product.shortDescription || 'No description available'}
                         </div>
                    </div>

                     {/* Specs */}
                     <div className="border border-gray-200 mt-4 rounded-sm">
                         <div className="p-4 border-b border-gray-200 bg-white">
                             <h3 className="text-xl font-medium text-gray-800">Specifications</h3>
                         </div>
                         <div className="p-4">
                             <div className="space-y-4">
                                 {product.attributes && Object.entries(product.attributes).map(([key, value]) => (
                                     <div key={key} className="flex border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                                         <div className="w-1/3 text-sm text-gray-500">{key}</div>
                                         <div className="w-2/3 text-sm text-gray-900">{value}</div>
                                     </div>
                                 ))}
                                 {!product.attributes && (
                                     <div className="text-gray-400 text-sm">No specifications listed.</div>
                                 )}
                             </div>
                         </div>
                     </div>
                     
                     {/* Reviews Section */}
                     <div className="border border-gray-200 mt-4 rounded-sm p-4">
                        <ProductReviews 
                          productId={product._id} 
                          averageRating={product.rating}
                          totalReviews={product.numReviews}
                          onReviewAdded={() => fetchProduct()} 
                        />
                     </div>

                </div>
            </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
            <div className="mb-16">
                <h2 className="text-2xl font-bold text-gray-900 mb-8 border-l-4 border-[#DC2626] pl-4">Similar Products</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {similarProducts.map((p) => (
                    <div key={p._id} className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
                        onClick={() => navigate(`/product/${p._id}`)}>
                        <div className="aspect-square bg-gray-50 relative overflow-hidden">
                        {p.images?.[0]?.url ? (
                            <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                            <Package className="w-8 h-8" />
                            </div>
                        )}
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-gray-900 text-sm mb-1 truncate hover:text-[#DC2626] transition-colors">{p.name}</h3>
                            <div className="flex items-center justify-between mt-2">
                                <span className="font-bold text-[#DC2626]">{formatCurrency(p.price)}</span>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        )}

      </main>

      <Footer />
    </div>
  );
}