import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  HiOutlineShoppingBag, HiOutlinePhone, HiOutlineMail,
  HiOutlineGlobe, HiOutlineShare,
} from 'react-icons/hi';
import { catalogService } from '../services/catalogService';
import Loader from '../components/common/Loader';
import Badge from '../components/common/Badge';
import { formatCurrency } from '../utils/formatters';

export default function CatalogPublic() {
  const { shareableLink } = useParams();
  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await catalogService.getPublicCatalog(shareableLink);
        setCatalog(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Catalog not found');
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, [shareableLink]);

  const shareCatalog = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({ title: catalog.name, url });
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const shareOnWhatsApp = () => {
    const url = window.location.href;
    const text = `Check out ${catalog.name}: ${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (loading) return <Loader text="Loading catalog..." fullScreen />;

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">📋</div>
          <h2 className="text-2xl font-bold text-gray-900">Catalog Not Found</h2>
          <p className="text-gray-500 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const tenant = catalog?.tenant || {};
  const products = catalog?.products?.map(p => p.product).filter(Boolean) || [];
  const branding = tenant.branding || {};

  return (
    <div className="min-h-screen" style={{ backgroundColor: catalog?.design?.backgroundColor || '#f9fafb' }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {tenant.logo?.url ? (
              <img src={tenant.logo.url} alt={tenant.name} className="h-10 w-10 rounded-lg object-cover" />
            ) : (
              <div className="h-10 w-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: branding.primaryColor || '#2563eb' }}>
                <span className="text-white font-bold text-sm">{tenant.name?.[0] || 'N'}</span>
              </div>
            )}
            <div>
              <h1 className="font-bold text-gray-900">{tenant.name || 'Store'}</h1>
              <p className="text-xs text-gray-400">{catalog.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={shareOnWhatsApp}
              className="px-3 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center gap-1">
              <span>WhatsApp</span>
            </button>
            <button onClick={shareCatalog}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
              <HiOutlineShare className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Catalog Info */}
      {catalog.description && (
        <div className="max-w-6xl mx-auto px-4 py-6">
          <p className="text-gray-600">{catalog.description}</p>
          <p className="text-sm text-gray-400 mt-2">{products.length} products</p>
        </div>
      )}

      {/* Products Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        {products.length === 0 ? (
          <div className="text-center py-20">
            <HiOutlineShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No products in this catalog</h3>
          </div>
        ) : (
          <div className={`grid gap-4 ${
            catalog.template === 'list' ? 'grid-cols-1' :
            catalog.template === 'magazine' ? 'grid-cols-1 sm:grid-cols-2' :
            `grid-cols-2 sm:grid-cols-3 lg:grid-cols-${catalog.design?.productsPerRow || 3}`
          }`}>
            {products.map(product => (
              <div key={product._id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedProduct(product)}>

                {/* Image */}
                <div className={`bg-gray-100 ${catalog.template === 'list' ? 'h-32' : 'aspect-square'} relative`}>
                  {product.images?.[0]?.url ? (
                    <img src={product.images[0].url} alt={product.name}
                      className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <HiOutlineShoppingBag className="h-12 w-12" />
                    </div>
                  )}

                  {product.compareAtPrice > product.price && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                      {Math.round((1 - product.price / product.compareAtPrice) * 100)}% OFF
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-xs text-gray-400">{product.category}</p>
                  <h3 className="font-medium text-gray-900 text-sm mt-0.5 line-clamp-2">{product.name}</h3>

                  {catalog.design?.showDescription && product.shortDescription && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.shortDescription}</p>
                  )}

                  {catalog.design?.showPrices !== false && (
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="font-bold text-gray-900">{formatCurrency(product.price)}</span>
                      {product.compareAtPrice > product.price && (
                        <span className="text-xs text-gray-400 line-through">{formatCurrency(product.compareAtPrice)}</span>
                      )}
                    </div>
                  )}

                  {product.stock === 0 && (
                    <Badge color="red" className="mt-2">Out of Stock</Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Footer */}
      {tenant.contactInfo && (
        <footer className="bg-white border-t py-6">
          <div className="max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            {tenant.contactInfo.phone && (
              <a href={`tel:${tenant.contactInfo.phone}`} className="flex items-center gap-1 hover:text-gray-700">
                <HiOutlinePhone className="h-4 w-4" />{tenant.contactInfo.phone}
              </a>
            )}
            {tenant.contactInfo.email && (
              <a href={`mailto:${tenant.contactInfo.email}`} className="flex items-center gap-1 hover:text-gray-700">
                <HiOutlineMail className="h-4 w-4" />{tenant.contactInfo.email}
              </a>
            )}
            {tenant.contactInfo.website && (
              <a href={tenant.contactInfo.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-gray-700">
                <HiOutlineGlobe className="h-4 w-4" />{tenant.contactInfo.website}
              </a>
            )}
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">Powered by NextGen SaaS</p>
        </footer>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50" onClick={() => setSelectedProduct(null)} />
            <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full animate-scaleIn max-h-[90vh] overflow-y-auto">
              {/* Image */}
              {selectedProduct.images?.[0]?.url && (
                <img src={selectedProduct.images[0].url} alt={selectedProduct.name}
                  className="w-full h-64 object-cover rounded-t-xl" />
              )}

              <div className="p-6">
                <p className="text-sm text-gray-400">{selectedProduct.category}</p>
                <h2 className="text-xl font-bold text-gray-900 mt-1">{selectedProduct.name}</h2>

                {selectedProduct.brand && (
                  <p className="text-sm text-gray-500 mt-1">Brand: {selectedProduct.brand}</p>
                )}

                <div className="flex items-baseline gap-3 mt-3">
                  <span className="text-2xl font-bold text-gray-900">{formatCurrency(selectedProduct.price)}</span>
                  {selectedProduct.compareAtPrice > selectedProduct.price && (
                    <span className="text-lg text-gray-400 line-through">{formatCurrency(selectedProduct.compareAtPrice)}</span>
                  )}
                </div>

                {selectedProduct.description && (
                  <p className="text-gray-600 mt-4 text-sm leading-relaxed">{selectedProduct.description}</p>
                )}

                {selectedProduct.stock > 0 ? (
                  <Badge color="green" className="mt-3">In Stock</Badge>
                ) : (
                  <Badge color="red" className="mt-3">Out of Stock</Badge>
                )}

                {/* WhatsApp Enquiry */}
                <div className="mt-6 flex gap-3">
                  <button
                    onClick={() => {
                      const msg = `Hi! I'm interested in "${selectedProduct.name}" (${formatCurrency(selectedProduct.price)}) from your catalog "${catalog.name}".`;
                      window.open(`https://wa.me/${tenant.socialLinks?.whatsapp || tenant.contactInfo?.phone || ''}?text=${encodeURIComponent(msg)}`, '_blank');
                    }}
                    className="flex-1 px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors text-center">
                    Enquire on WhatsApp
                  </button>
                  <button onClick={() => setSelectedProduct(null)}
                    className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}