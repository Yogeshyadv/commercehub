import { useNavigate } from 'react-router-dom';
import { HiOutlineShoppingCart, HiOutlineTrash, HiOutlineMinus, HiOutlinePlus, HiOutlineArrowLeft } from 'react-icons/hi';
import { useCart } from '../context/CartContext';
import EmptyState from '../components/common/EmptyState';
import Button from '../components/common/Button';
import { formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();

  const handleUpdateQuantity = (productId, newQuantity, stock) => {
    if (newQuantity > stock) {
      toast.error('Not enough stock available');
      return;
    }
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId, productName) => {
    removeItem(productId);
    toast.success(`${productName} removed from cart`);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <EmptyState
          icon={HiOutlineShoppingCart}
          title="Your cart is empty"
          description="Add some products to get started"
          actionLabel="Continue Shopping"
          onAction={() => navigate('/store')}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/store')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <HiOutlineArrowLeft className="w-5 h-5" />
              <span>Continue Shopping</span>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
        </div>
      </div>

      {/* Cart Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.product._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div
                    onClick={() => navigate(`/product/${item.product._id}`)}
                    className="flex-shrink-0 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden cursor-pointer"
                  >
                    {item.product.images?.[0]?.url ? (
                      <img
                        src={item.product.images[0].url}
                        alt={item.product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <HiOutlineShoppingCart className="w-8 h-8" />
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3
                      onClick={() => navigate(`/product/${item.product._id}`)}
                      className="font-semibold text-gray-900 mb-1 hover:text-blue-600 cursor-pointer truncate"
                    >
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-2">{item.product.category}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-gray-900">
                        {formatCurrency(item.product.price)}
                      </span>
                      {item.product.compareAtPrice > item.product.price && (
                        <span className="text-sm text-gray-400 line-through">
                          {formatCurrency(item.product.compareAtPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => handleRemoveItem(item.product._id, item.product.name)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove from cart"
                    >
                      <HiOutlineTrash className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity - 1, item.product.stock)}
                        disabled={item.quantity <= 1}
                        className="p-1.5 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <HiOutlineMinus className="w-4 h-4" />
                      </button>
                      <span className="text-lg font-semibold w-12 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.product._id, item.quantity + 1, item.product.stock)}
                        disabled={item.quantity >= item.product.stock}
                        className="p-1.5 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <HiOutlinePlus className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-gray-500">Subtotal</p>
                      <p className="text-xl font-bold text-gray-900">
                        {formatCurrency(item.product.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({items.length} items)</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (18%)</span>
                  <span>{formatCurrency(subtotal * 0.18)}</span>
                </div>
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatCurrency(subtotal * 1.18)}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => navigate('/checkout')}
                className="w-full mb-3"
              >
                Proceed to Checkout
              </Button>

              <button
                onClick={clearCart}
                className="w-full px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
