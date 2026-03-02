import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  ArrowRight
} from 'lucide-react';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';
import { formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

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

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist');
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
        className="px-6 py-2.5 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors font-medium mt-4"
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
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 font-sans pb-20">
      
      {/* Navbar Placeholder/Breadcrumbs */}
      <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/80 dark:bg-zinc-900/80 supports-[backdrop-filter]:bg-white/60">
        
        {/* Preview Banner */}
        {product.status !== 'active' && (
          <div className="bg-amber-100/80 dark:bg-amber-900/40 text-amber-800 dark:text-amber-200 text-center py-2 text-xs font-bold border-b border-amber-200/50 dark:border-amber-800/30 backdrop-blur-sm">
             PREVIEW MODE • This product is {product.status} and not visible to customers
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <button onClick={() => navigate(-1)} className="hover:text-primary-600 flex items-center gap-1 transition-colors font-medium">
                <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <span className="text-gray-300">/</span>
            <span className="capitalize text-gray-900 dark:text-white font-medium truncate max-w-[150px] sm:max-w-xs">{product.name}</span>
          </div>
          
          <div className="flex items-center gap-2">
             <button onClick={handleShare} className="p-2.5 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-gray-500">
                 <Share2 className="w-5 h-5" />
             </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        
        {/* Main Product Grid */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                
                {/* Visuals Column (Span 7) */}
                <div className="lg:col-span-7 p-6 lg:p-10 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-900/50">
                    <div className="flex flex-col-reverse lg:flex-row gap-6 h-full"> 
                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto no-scrollbar lg:w-20 lg:max-h-[600px] shrink-0 pb-2 lg:pb-0">
                                {images.map((img, idx) => (
                                    <button
                                        key={idx}
                                        onMouseEnter={() => setSelectedImageIndex(idx)}
                                        onClick={() => setSelectedImageIndex(idx)}
                                        className={`relative w-16 h-16 lg:w-20 lg:h-20 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                                            selectedImageIndex === idx 
                                            ? 'border-primary-600 ring-4 ring-primary-50 dark:ring-primary-900/20 scale-105' 
                                            : 'border-transparent hover:border-gray-300 dark:hover:border-zinc-600 bg-white dark:bg-zinc-800 grayscale hover:grayscale-0'
                                        }`}
                                    >
                                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Main Image */}
                        <div className="flex-1 bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 flex items-center justify-center p-8 relative group overflow-hidden min-h-[400px] lg:min-h-[500px]">
                             {currentImage.url ? (
                                <img
                                    src={currentImage.url}
                                    alt={currentImage.alt || product.name}
                                    className="w-full h-full object-contain max-h-[500px] transition-transform duration-700 ease-out group-hover:scale-110" 
                                />
                            ) : (
                                <div className="text-gray-300 flex flex-col items-center">
                                    <Package className="w-24 h-24 mb-4 text-gray-200" />
                                    <span className="text-gray-400 font-medium">No Image Available</span>
                                </div>
                            )}

                             {/* Floating Discount Tag */}
                             {discountPercentage > 0 && (
                                <div className="absolute top-6 left-6 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg shadow-red-500/30 tracking-wide">
                                    -{discountPercentage}% OFF
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Details Column (Span 5) */}
                <div className="lg:col-span-5 p-8 lg:p-12 flex flex-col h-full bg-white dark:bg-zinc-900">
                    
                    {/* Brand & Rating */}
                    <div className="flex items-center justify-between mb-6">
                        {product.brand ? (
                            <span className="text-primary-600 font-bold uppercase tracking-widest text-xs border-b-2 border-primary-100 dark:border-primary-900 pb-1">
                                {product.brand}
                            </span>
                        ) : (
                            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs pb-1">Generic</span>
                        )}
                        
                        <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-800 px-3 py-1.5 rounded-full">
                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-bold text-gray-900 dark:text-white">4.8</span>
                            <span className="text-xs text-gray-400 dark:text-gray-500 border-l border-gray-200 dark:border-zinc-700 pl-2 ml-1">128 reviews</span>
                        </div>
                    </div>

                    <h1 className="text-3xl lg:text-4xl font-black text-gray-900 dark:text-white leading-[1.1] tracking-tight mb-6">
                        {product.name}
                    </h1>

                    {/* Price Block */}
                    <div className="mb-8 p-5 bg-gray-50 dark:bg-zinc-800/30 rounded-2xl border border-gray-100 dark:border-zinc-800">
                        <div className="flex items-center gap-4 flex-wrap">
                             <span className="text-4xl lg:text-5xl font-black text-gray-900 dark:text-white tracking-tighter">
                                {formatCurrency(product.price)}
                             </span>
                             {product.compareAtPrice > product.price && (
                                <div className="flex flex-col">
                                    <span className="text-lg text-gray-400 line-through font-medium decoration-2 decoration-red-300">
                                        {formatCurrency(product.compareAtPrice)}
                                    </span>
                                    <span className="text-xs text-red-500 font-bold">You save {formatCurrency(product.compareAtPrice - product.price)}</span>
                                </div>
                             )}
                        </div>
                        <p className="text-sm text-gray-500 mt-2 font-medium flex items-center gap-1.5">
                             <Info className="w-4 h-4 text-blue-500" />
                             Inclusive of all taxes & duties
                        </p>
                    </div>

                    {/* Key Attributes Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-4 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-700 hover:border-primary-200 dark:hover:border-primary-900 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-colors group">
                            <Truck className="w-6 h-6 text-gray-400 group-hover:text-primary-600 mb-2 transition-colors" />
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Free Shipping</h4>
                            <p className="text-xs text-gray-500 mt-0.5">On orders over $100</p>
                        </div>
                        <div className="p-4 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-700 hover:border-primary-200 dark:hover:border-primary-900 hover:bg-primary-50/50 dark:hover:bg-primary-900/10 transition-colors group">
                            <ShieldCheck className="w-6 h-6 text-gray-400 group-hover:text-primary-600 mb-2 transition-colors" />
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">Warranty</h4>
                            <p className="text-xs text-gray-500 mt-0.5">2 Years Coverage</p>
                        </div>
                    </div>

                    <div className="mt-auto space-y-4">
                        {/* Selector Row */}
                        <div className="flex gap-4">
                             {/* Quantity */}
                             <div className="w-24">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Qty</label>
                                <div className="relative">
                                    <select 
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        disabled={product.stock <= 0}
                                        className="w-full h-12 appearance-none bg-gray-50 dark:bg-zinc-800 border-2 border-transparent hover:border-gray-200 dark:hover:border-zinc-700 rounded-xl text-center font-bold text-gray-900 dark:text-white focus:ring-0 focus:border-primary-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        {[...Array(Math.min(10, product.stock)).keys()].map(i => (
                                            <option key={i+1} value={i+1}>{i+1}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                             </div>

                             {/* Stock Status Box */}
                             <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Availability</label>
                                <div className={`h-12 flex items-center px-4 rounded-xl border ${
                                    product.stock > 0 
                                    ? 'bg-green-50 dark:bg-green-900/10 border-green-100 dark:border-green-900/30 text-green-700 dark:text-green-400' 
                                    : 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-900/30 text-red-700 dark:text-red-400'
                                }`}>
                                    {product.stock > 0 ? (
                                        <div className="flex items-center gap-2 font-bold text-sm">
                                            <span className="relative flex h-2.5 w-2.5">
                                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                                            </span>
                                            In Stock
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 font-bold text-sm">
                                            <AlertTriangle className="w-4 h-4" />
                                            Sold Out
                                        </div>
                                    )}
                                </div>
                             </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-[1fr_auto] gap-3 pt-2">
                             <button 
                                onClick={handleAddToCart}
                                disabled={product.stock <= 0}
                                className="h-14 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold text-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none flex items-center justify-center gap-2"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                Add to Cart
                            </button>
                            
                            <button 
                                onClick={toggleWishlist}
                                className={`w-14 h-14 flex items-center justify-center rounded-xl border-2 transition-all ${
                                    isWishlisted 
                                    ? 'bg-red-50 border-red-200 text-red-500 dark:bg-red-900/20 dark:border-red-900/50' 
                                    : 'border-gray-100 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-600 text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            >
                                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
                            </button>
                        </div>

                        <button 
                           onClick={handleBuyNow}
                           disabled={product.stock <= 0}
                           className="w-full h-14 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-700 shadow-xl shadow-primary-600/20 hover:shadow-primary-600/30 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            Buy Now <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        {/* Tabbed Info Section - Clean & Modern */}
        <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-sm border border-gray-100 dark:border-zinc-800 p-8 lg:p-12">
            <div className="flex flex-col lg:flex-row gap-10">
                 {/* Tabs Navigation */}
                 <div className="w-full lg:w-64 flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0 shrink-0 border-b lg:border-b-0 lg:border-r border-gray-100 dark:border-zinc-800">
                    {[
                        { id: 'description', label: 'Description' },
                        { id: 'specifications', label: 'Specifications' },
                        { id: 'reviews', label: 'Reviews' }
                    ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`px-5 py-4 rounded-xl text-left font-bold text-sm transition-all whitespace-nowrap flex items-center justify-between group ${
                              activeTab === tab.id
                              ? 'bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-400' 
                              : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                          }`}
                        >
                            {tab.label}
                            {activeTab === tab.id && <div className="w-2 h-2 rounded-full bg-primary-600" />}
                        </button>
                    ))}
                 </div>

                 {/* Tab Content */}
                 <div className="flex-1 min-h-[400px]">
                      {activeTab === 'description' && (
                          <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Product Overview</h3>
                                <p className="whitespace-pre-line leading-relaxed">{product.description || 'No detailed description available for this product.'}</p>
                          </div>
                      )}

                      {activeTab === 'specifications' && (
                          <div>
                               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Technical Specifications</h3>
                               <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                                   {product.attributes && Object.keys(product.attributes).length > 0 ? (
                                       Object.entries(product.attributes).map(([key, value]) => (
                                           <div key={key} className="flex flex-col border-b border-gray-100 dark:border-zinc-800 pb-4">
                                               <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{key}</span>
                                               <span className="font-semibold text-gray-900 dark:text-white text-lg">{value}</span>
                                           </div>
                                        ))
                                   ) : (
                                       <div className="col-span-2 py-12 flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-700">
                                           <Info className="w-8 h-8 mb-2 opacity-50" />
                                           <span className="font-medium">No specifications specified.</span>
                                       </div>
                                   )}
                               </div>
                          </div>
                      )}

                      {activeTab === 'reviews' && (
                          <div>
                              <div className="flex items-center justify-between mb-8">
                                  <div>
                                     <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Reviews</h3>
                                     <p className="text-gray-500 mt-1">Based on 128 verified reviews</p>
                                  </div>
                                  <button className="px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full font-bold hover:opacity-90 transition-opacity">Write a Review</button>
                              </div>
                              
                              {/* Summary Card */}
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10 p-6 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl">
                                  <div className="flex flex-col items-center justify-center border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-zinc-700 pb-6 sm:pb-0">
                                      <span className="text-5xl font-black text-gray-900 dark:text-white">4.8</span>
                                      <div className="flex text-yellow-400 my-2 gap-1">
                                           {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-current" />)}
                                      </div>
                                      <span className="text-sm font-medium text-gray-500">Overall Rating</span>
                                  </div>
                                  <div className="flex items-center justify-center">
                                      <div className="space-y-2 w-full max-w-xs">
                                          {[5,4,3,2,1].map((rating, idx) => (
                                              <div key={rating} className="flex items-center gap-3 text-xs font-bold text-gray-500">
                                                  <span className="w-3">{rating}</span>
                                                  <div className="flex-1 h-2 bg-gray-200 dark:bg-zinc-700 rounded-full overflow-hidden">
                                                      <div className="h-full bg-primary-500 rounded-full" style={{width: `${idx === 0 ? 80 : idx === 1 ? 15 : 5}%`}}></div>
                                                  </div>
                                                  <span className="w-8 text-right">{idx === 0 ? '80%' : idx === 1 ? '15%' : '5%'}</span>
                                              </div>
                                          ))}
                                      </div>
                                  </div>
                              </div>
                              
                              <div className="space-y-6">
                                  {/* Mock Review Item */}
                                  <div className="border-b border-gray-100 dark:border-zinc-800 pb-8 last:border-0">
                                      <div className="flex items-start justify-between mb-4">
                                          <div className="flex items-center gap-3">
                                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-white flex items-center justify-center font-bold shadow-lg shadow-primary-500/30">JD</div>
                                              <div>
                                                  <h5 className="font-bold text-gray-900 dark:text-white">John Doe</h5>
                                                  <div className="flex items-center gap-2 mt-0.5">
                                                      <div className="flex text-yellow-400 text-xs">
                                                            <Star className="w-3 h-3 fill-current" />
                                                            <Star className="w-3 h-3 fill-current" />
                                                            <Star className="w-3 h-3 fill-current" />
                                                            <Star className="w-3 h-3 fill-current" />
                                                            <Star className="w-3 h-3 fill-current" />
                                                      </div>
                                                      <span className="text-xs text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded">Verified Purchase</span>
                                                  </div>
                                              </div>
                                          </div>
                                          <span className="text-xs font-medium text-gray-400">2 months ago</span>
                                      </div>
                                      <h6 className="font-bold text-gray-900 dark:text-white mb-2">Better than expected!</h6>
                                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                          I was skeptical at first, but the quality is actually distinctively premium. 2-day delivery was spot on. Highly recommend!
                                      </p>
                                  </div>
                              </div>
                          </div>
                      )}
                 </div>
            </div>
        </div>

      </main>
    </div>
  );
}
