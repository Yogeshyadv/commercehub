import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, ShoppingCart, Trash2, ArrowLeft, Heart } from 'lucide-react';
import { wishlistService } from '../services/wishlistService';
import { useCart } from '../context/CartContext';
import { formatCurrency } from '../utils/formatters';
import Loader from '../components/common/Loader';
import toast from 'react-hot-toast';

export default function Wishlist() {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const res = await wishlistService.getWishlist();
      setWishlist(res.data.data || []);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId, e) => {
    e.stopPropagation();
    try {
      await wishlistService.removeFromWishlist(productId);
      setWishlist((prev) => prev.filter((item) => item._id !== productId));
      toast.success('Removed from wishlist');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    if (product.stock <= 0) {
        toast.error('Out of stock');
        return;
    }
    addItem(product, 1);
    toast.success('Added to cart!');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
      <Loader />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 p-4 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500 fill-current" />
            My Wishlist ({wishlist.length})
          </h1>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
            <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm mx-auto">
              Save items you want to see later. They will show up here.
            </p>
            <button
              onClick={() => navigate('/')}
              className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div 
                key={product._id}
                onClick={() => navigate(`/product/${product._id}`)}
                className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden hover:shadow-md transition-shadow cursor-pointer group relative"
              >
                <button
                    onClick={(e) => removeFromWishlist(product._id, e)}
                    className="absolute top-3 right-3 p-2 bg-white/80 dark:bg-black/50 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-colors z-10"
                >
                    <Trash2 className="w-4 h-4" />
                </button>

                <div className="aspect-square bg-gray-50 dark:bg-zinc-800 relative">
                  {product.images?.[0]?.url ? (
                    <img 
                      src={product.images[0].url} 
                      alt={product.name}
                      className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Package className="w-12 h-12" />
                    </div>
                  )}
                  {product.stock <= 0 && (
                     <div className="absolute inset-0 bg-white/60 dark:bg-black/60 flex items-center justify-center backdrop-blur-[1px]">
                        <span className="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full border border-red-200 uppercase tracking-wide">
                            Out of Stock
                        </span>
                     </div>
                  )}
                </div>

                <div className="p-4">
                  <div className="mb-2">
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mb-1">
                      {product.category || 'General'}
                    </p>
                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 min-h-[40px] group-hover:text-emerald-600 transition-colors">
                      {product.name}
                    </h3>
                  </div>

                  <div className="flex items-end justify-between gap-2 mt-4">
                    <div className="flex flex-col">
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                            {formatCurrency(product.price)}
                        </span>
                        {product.rating > 0 && (
                            <div className="flex items-center gap-1 text-xs text-amber-500">
                                <span className="font-bold">{product.rating.toFixed(1)}</span>
                                <span className="text-gray-400">({product.numReviews})</span>
                            </div>
                        )}
                    </div>
                    
                    <button
                        onClick={(e) => handleAddToCart(product, e)}
                        disabled={product.stock <= 0}
                        className="p-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
