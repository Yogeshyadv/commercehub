import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { catalogService } from '../services/catalogService';
import { formatCurrency } from '../utils/formatters';

const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.558 4.112 1.531 5.836L.057 23.737a.5.5 0 00.614.629l6.083-1.595A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.896 0-3.67-.513-5.192-1.41l-.373-.22-3.867 1.014 1.032-3.764-.242-.389A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
  </svg>
);

export default function CatalogPublic() {
  const { shareableLink } = useParams();
  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [copied, setCopied] = useState(false);

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

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnWhatsApp = () => {
    const text = `Check out ${catalog.name}: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const enquireProduct = (product) => {
    const tenant = catalog?.tenant || {};
    const phone = tenant.socialLinks?.whatsapp || tenant.contactInfo?.phone || '';
    const msg = `Hi! I'm interested in *${product.name}* (${formatCurrency(product.price)}) from your catalog *${catalog.name}*.\n\nCatalog link: ${window.location.href}`;
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#25D366] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading catalog…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <span className="text-4xl">📋</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Catalog Not Found</h2>
          <p className="text-gray-500 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const tenant = catalog?.tenant || {};
  const products = catalog?.products?.map(p => p.product || p).filter(Boolean) || [];
  const branding = tenant.branding || {};
  const accentColor = branding.primaryColor || '#25D366';
  const tags = catalog?.tags || [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: catalog?.design?.backgroundColor || '#f9fafb' }}>

      {/* Sticky Top Bar */}
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3 min-w-0">
            {tenant.logo?.url ? (
              <img src={tenant.logo.url} alt={tenant.name} className="h-9 w-9 rounded-xl object-cover shrink-0 shadow-sm" />
            ) : (
              <div className="h-9 w-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm"
                style={{ backgroundColor: accentColor }}>
                <span className="text-white font-bold text-sm">{tenant.name?.[0] || 'S'}</span>
              </div>
            )}
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">{tenant.name || 'Store'}</p>
              <p className="text-xs text-gray-400 truncate">{catalog.name}</p>
            </div>
          </div>
          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={copyLink}
              className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors">
              {copied ? (
                <><svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><span>Copied!</span></>
              ) : (
                <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg><span className="hidden sm:inline">Copy Link</span></>
              )}
            </button>
            <button onClick={shareOnWhatsApp}
              className="flex items-center gap-1.5 px-3 py-2 text-white rounded-xl text-sm font-semibold transition-all hover:brightness-110 shadow-sm"
              style={{ backgroundColor: '#25D366' }}>
              <WhatsAppIcon />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="relative w-full h-64 sm:h-80 overflow-hidden">
        {catalog.coverImage?.url ? (
          <img src={catalog.coverImage.url} alt={catalog.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ background: `linear-gradient(135deg, ${accentColor}30 0%, ${accentColor}10 100%)` }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6 max-w-6xl mx-auto">
          <div className="flex items-end justify-between gap-4">
            <div>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-3 ${
                catalog.status === 'published' ? 'bg-[#25D366]/90 text-white' : 'bg-amber-500/90 text-white'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                {catalog.status === 'published' ? 'Live' : 'Draft'}
              </span>
              <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight drop-shadow-lg">{catalog.name}</h1>
              {catalog.description && (
                <p className="text-white/70 text-sm mt-2 max-w-lg">{catalog.description}</p>
              )}
            </div>
            <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
              <span className="text-3xl font-bold text-white">{products.length}</span>
              <span className="text-white/60 text-xs font-medium uppercase tracking-wide">Products</span>
            </div>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map(tag => (
                <span key={tag} className="px-3 py-1 rounded-full text-xs font-semibold text-white/80 border border-white/20 bg-white/10 backdrop-blur-sm">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Products Section */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        {products.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
              <svg className="w-10 h-10 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-700">No products in this catalog yet</h3>
          </div>
        ) : (
          <div className={`grid gap-5 ${
            catalog.template === 'list' ? 'grid-cols-1' :
            catalog.template === 'magazine' ? 'grid-cols-1 sm:grid-cols-2' :
            'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
          }`}>
            {products.map(product => (
              <div key={product._id}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-gray-100"
                onClick={() => setSelectedProduct(product)}>

                {/* Image */}
                <div className={`relative overflow-hidden bg-gray-50 ${catalog.template === 'list' ? 'h-44 sm:h-52' : 'aspect-[4/3]'}`}>
                  {product.images?.[0]?.url ? (
                    <img src={product.images[0].url} alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                    </div>
                  )}
                  {product.compareAtPrice > product.price && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-lg font-bold shadow-md">
                      {Math.round((1 - product.price / product.compareAtPrice) * 100)}% OFF
                    </div>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <span className="bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg">Out of Stock</span>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Info */}
                <div className="p-3.5">
                  {product.category && (
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: accentColor }}>{product.category}</p>
                  )}
                  <h3 className="font-bold text-gray-900 text-sm line-clamp-2 leading-snug">{product.name}</h3>
                  {catalog.design?.showDescription && product.shortDescription && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.shortDescription}</p>
                  )}
                  {catalog.design?.showPrices !== false && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="font-bold text-gray-900 text-base">{formatCurrency(product.price)}</span>
                      {product.compareAtPrice > product.price && (
                        <span className="text-xs text-gray-400 line-through">{formatCurrency(product.compareAtPrice)}</span>
                      )}
                    </div>
                  )}
                  <button
                    onClick={e => { e.stopPropagation(); enquireProduct(product); }}
                    className="mt-3 w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110 active:scale-95"
                    style={{ backgroundColor: '#25D366' }}>
                    <WhatsAppIcon />
                    Enquire
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 mt-4">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              {tenant.logo?.url ? (
                <img src={tenant.logo.url} alt={tenant.name} className="h-10 w-10 rounded-xl object-cover" />
              ) : (
                <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: accentColor }}>
                  <span className="text-white font-bold">{tenant.name?.[0] || 'S'}</span>
                </div>
              )}
              <div>
                <p className="font-bold text-gray-900">{tenant.name || 'Store'}</p>
                <p className="text-xs text-gray-400">Powered by NextGen</p>
              </div>
            </div>
            {tenant.contactInfo && (
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-500">
                {tenant.contactInfo.phone && (
                  <a href={`tel:${tenant.contactInfo.phone}`} className="flex items-center gap-1.5 hover:text-gray-800 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    {tenant.contactInfo.phone}
                  </a>
                )}
                {tenant.contactInfo.email && (
                  <a href={`mailto:${tenant.contactInfo.email}`} className="flex items-center gap-1.5 hover:text-gray-800 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    {tenant.contactInfo.email}
                  </a>
                )}
                {tenant.contactInfo.website && (
                  <a href={tenant.contactInfo.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-gray-800 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" /></svg>
                    Website
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </footer>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedProduct(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
            style={{ animation: 'scaleIn 0.2s ease-out' }}>
            {selectedProduct.images?.[0]?.url && (
              <div className="relative h-64 overflow-hidden rounded-t-2xl bg-gray-50">
                <img src={selectedProduct.images[0].url} alt={selectedProduct.name} className="w-full h-full object-cover" />
                {selectedProduct.compareAtPrice > selectedProduct.price && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white text-xs px-2.5 py-1 rounded-lg font-bold">
                    {Math.round((1 - selectedProduct.price / selectedProduct.compareAtPrice) * 100)}% OFF
                  </div>
                )}
              </div>
            )}
            <div className="p-6">
              {selectedProduct.category && (
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: accentColor }}>{selectedProduct.category}</p>
              )}
              <h2 className="text-xl font-bold text-gray-900">{selectedProduct.name}</h2>
              {selectedProduct.brand && (
                <p className="text-sm text-gray-400 mt-0.5">{selectedProduct.brand}</p>
              )}
              <div className="flex items-baseline gap-3 mt-3">
                <span className="text-2xl font-bold text-gray-900">{formatCurrency(selectedProduct.price)}</span>
                {selectedProduct.compareAtPrice > selectedProduct.price && (
                  <span className="text-base text-gray-400 line-through">{formatCurrency(selectedProduct.compareAtPrice)}</span>
                )}
              </div>
              {selectedProduct.stock === 0 ? (
                <span className="inline-block mt-2 px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-lg">Out of Stock</span>
              ) : (
                <span className="inline-block mt-2 px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-lg">{selectedProduct.stock > 0 ? `${selectedProduct.stock} in stock` : 'In Stock'}</span>
              )}
              {selectedProduct.description && (
                <p className="text-gray-600 mt-4 text-sm leading-relaxed">{selectedProduct.description}</p>
              )}
              <div className="mt-6 flex gap-3">
                <button onClick={() => enquireProduct(selectedProduct)}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 text-white rounded-xl font-bold hover:brightness-110 transition-all shadow-lg"
                  style={{ backgroundColor: '#25D366', boxShadow: '0 4px 20px rgba(37,211,102,0.35)' }}>
                  <WhatsAppIcon />
                  Enquire on WhatsApp
                </button>
                <button onClick={() => setSelectedProduct(null)}
                  className="px-4 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-colors">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
