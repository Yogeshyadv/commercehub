import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { catalogService } from '../services/catalogService';
import { orderService } from '../services/orderService';
import { formatCurrency } from '../utils/formatters';
import BlockCanvas from '../components/catalog/blocks/BlockCanvas';
import { CatalogCanvas, getTheme } from '../components/catalog/CatalogThemeCanvas';
import toast from 'react-hot-toast';
import ProductImageSearch from '../components/products/ProductImageSearch';

/* ── QR Code Share Panel ────────────────────────────────────────────────── */
const QRShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
    <rect x="3" y="3" width="7" height="7" rx="1"/>
    <rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/>
    <path d="M14 14h2v2h-2zM18 14h3v3h-3zM14 18h3v3h-3z"/>
  </svg>
);

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
  const [cart, setCart] = useState({});
  const [cartOpen, setCartOpen] = useState(false);

  const [requiresPassword, setRequiresPassword] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  
  /* Image Search */
  const [showImageSearch, setShowImageSearch] = useState(false);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await catalogService.getPublicCatalog(shareableLink);
        if (response.requiresPassword) {
          setRequiresPassword(true);
          setCatalog(response.data); // minimal data (name, coverImage)
        } else {
          setCatalog(response.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Catalog not found');
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, [shareableLink]);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;
    setPasswordLoading(true);
    setPasswordError('');
    try {
      const response = await catalogService.getPublicCatalog(shareableLink, passwordInput);
      setCatalog(response.data);
      setRequiresPassword(false);
    } catch (err) {
      setPasswordError(err.response?.data?.message || 'Incorrect password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnWhatsApp = () => {
    const text = `Check out ${catalog.name}: ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
    catalogService.trackEvent(shareableLink, 'share').catch(() => {});
  };

  const enquireProduct = (product) => {
    const tenant = catalog?.tenant || {};
    const phone = (tenant.socialLinks?.whatsapp || tenant.contactInfo?.phone || tenant.owner?.phone || '').replace(/\D/g, '');
    const msg = `Hi! I'm interested in *${product.name}* (${formatCurrency(product.price)}) from your catalog *${catalog.name}*.\n\nCatalog link: ${window.location.href}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    // Track WhatsApp click
    catalogService.trackEvent(shareableLink, 'whatsapp_click', product._id).catch(() => {});
  };

  const addToCart = (product) => {
    setCart(prev => {
      const qty = (prev[product._id]?.qty || 0) + 1;
      toast.success(`${product.name} added to cart`, { duration: 1500 });
      return { ...prev, [product._id]: { product, qty } };
    });
  };

  const handleImageSelect = (image) => {
    toast.success('Image selected! You can use this for your products.');
    setShowImageSearch(false);
  };

  const updateQty = (productId, delta) => {
    setCart(prev => {
      const entry = prev[productId];
      if (!entry) return prev;
      const qty = entry.qty + delta;
      if (qty <= 0) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return { ...prev, [productId]: { ...entry, qty } };
    });
  };

  const cartItems = Object.values(cart);
  const cartCount = cartItems.reduce((s, e) => s + e.qty, 0);
  const cartTotal = cartItems.reduce((s, e) => s + e.product.price * e.qty, 0);

  const handleWhatsAppOrder = async () => {
    const tenant = catalog?.tenant || {};
    const phone = (catalog?.design?.customTexts?.whatsappPhone || tenant?.socialLinks?.whatsapp || tenant?.contactInfo?.phone || tenant?.owner?.phone || '').replace(/\D/g, '');
    if (!phone) { toast.error('No WhatsApp number configured for this store.'); return; }
    const lines = cartItems.map(({ product, qty }) => `• ${product.name} × ${qty}  →  ${formatCurrency(product.price * qty)}`).join('\n');
    const msg = `Hi! I'd like to place an order from *${catalog.name}*:\n\n${lines}\n\n*Order Total: ${formatCurrency(cartTotal)}*\n\nPlease confirm availability. Thank you!\n${window.location.href}`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');

    // Record the order in the vendor dashboard (fire-and-forget)
    const tenantId = typeof catalog.tenant === 'object' ? catalog.tenant._id : catalog.tenant;
    if (tenantId) {
      orderService.createWhatsAppOrder({
        tenantId,
        catalogName: catalog.name,
        items: cartItems.map(({ product, qty }) => ({ productId: product._id, quantity: qty })),
      }).catch(() => { /* non-fatal */ });
    }
    // Track WhatsApp order click (cart level)
    catalogService.trackEvent(shareableLink, 'whatsapp_click').catch(() => {});
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%)' }}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#DC2626] border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium">Loading catalog�</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center max-w-sm">
          <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <span className="text-4xl">??</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Catalog Not Found</h2>
          <p className="text-gray-500 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (requiresPassword) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center">
          {catalog?.coverImage?.url && (
            <img src={catalog.coverImage.url} alt={catalog.name} className="w-20 h-20 object-cover rounded-xl mx-auto mb-4" />
          )}
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-1">{catalog?.name || 'Protected Catalog'}</h2>
          <p className="text-sm text-gray-500 mb-6">This catalog is password protected. Enter the password to view it.</p>
          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <input
              type="password"
              value={passwordInput}
              onChange={e => { setPasswordInput(e.target.value); setPasswordError(''); }}
              placeholder="Enter password"
              autoFocus
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:border-transparent"
            />
            {passwordError && <p className="text-sm text-red-600 text-left">{passwordError}</p>}
            <button
              type="submit"
              disabled={passwordLoading}
              className="w-full py-2.5 bg-[#DC2626] hover:bg-[#b91c1c] text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {passwordLoading && <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
              {passwordLoading ? 'Verifying...' : 'Access Catalog'}
            </button>
          </form>
        </div>
      </div>
    );
  }


  const tenant = catalog?.tenant || {};
  const products = catalog?.products?.map(p => p.product || p).filter(Boolean) || [];

  if (catalog.template === 'modern-blocks') {
    return (
      <div className="min-h-screen flex flex-col w-full" style={{
        backgroundColor: catalog?.design?.backgroundColor || '#f4f4f5',
        fontFamily: `"${catalog.design?.fontFamily || 'Inter'}", sans-serif`
      }}>
        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {tenant?.logo?.url ? (
                <img src={tenant.logo.url} alt={tenant.name} className="h-10 w-10 rounded-xl object-cover" />
              ) : (
                <div className="h-10 w-10 rounded-xl flex items-center justify-center bg-blue-600 text-white font-bold text-lg">
                  {tenant?.name?.[0] || 'S'}
                </div>
              )}
              <div>
                <p className="font-bold text-gray-900 text-sm">{tenant?.name || 'Store'}</p>
                <p className="text-xs text-gray-500">{catalog.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowImageSearch(true)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors">
                Search Images
              </button>
              <button onClick={copyLink} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors">
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
              {catalog.isWhatsAppEnabled && (
                <button onClick={() => window.open(`https://wa.me/${tenant.contactInfo?.phone?.replace(/\D/g, '')}`, '_blank')} className="px-4 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-xl text-sm font-bold shadow-sm transition-all focus:ring-4 focus:ring-[#DC2626]/20">
                  <span className="flex items-center gap-2"><WhatsAppIcon/> Chat</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Render Blocks */}
        <div className="flex-1 w-full relative">
          <BlockCanvas 
            blocks={catalog.blocks || []} 
            isEditor={false} 
            products={products} 
          />
        </div>
      </div>
    );
  }


  // Merge saved design overrides into the base theme
  const savedDesign = catalog.design || {};
  const baseTheme = getTheme(catalog.template);
  const theme = {
    ...baseTheme,
    bg: savedDesign.backgroundColor || baseTheme.bg,
    text: savedDesign.textColor || baseTheme.text,
    accent: savedDesign.accentColor || baseTheme.accent,
    fontBody: savedDesign.fontFamily || baseTheme.fontBody,
  };
  const texts = savedDesign.customTexts || {};

  return (
    <div style={{ minHeight: '100vh', overflowX: 'hidden' }}>
      {/* Template canvas � renders full template design */}
      <CatalogCanvas
        catalog={catalog}
        theme={theme}
        products={products}
        texts={texts}
        isPublic={true}
        onProductClick={(product) => {
          setSelectedProduct(product);
          catalogService.trackEvent(shareableLink, 'product_click', product._id).catch(() => {});
        }}
        onAddToCart={addToCart}
      />

      {/* Floating share bar � sticky bottom on mobile, bottom-right on desktop */}
      <div style={{ position: 'fixed', bottom: 20, right: 16, zIndex: 50, display: 'flex', flexDirection: 'column', gap: 8 }}>
        {cartCount > 0 && (
          <button
            onClick={() => setCartOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 18px', background: '#111827', color: '#fff', border: 'none', borderRadius: 50, fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', whiteSpace: 'nowrap', position: 'relative' }}
          >
            ?? Cart
            <span style={{ background: '#DC2626', color: '#fff', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0 }}>{cartCount > 9 ? '9+' : cartCount}</span>
          </button>
        )}
        <button
          onClick={shareOnWhatsApp}
          style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 18px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: 50, fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 20px rgba(220,38,38,0.4)', whiteSpace: 'nowrap' }}
        >
          <WhatsAppIcon /> Share
        </button>
        <button
          onClick={copyLink}
          style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', background: '#fff', color: '#374151', border: '1.5px solid #e5e7eb', borderRadius: 50, fontSize: 12, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', whiteSpace: 'nowrap' }}
        >
          {copied ? '✓ Copied!' : '📋 Copy'}
        </button>
        {catalog?.sharing?.qrCode && (
          <button
            onClick={() => setShareOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px', background: '#fff', color: '#374151', border: '1.5px solid #e5e7eb', borderRadius: 50, fontSize: 12, fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', whiteSpace: 'nowrap' }}
          >
            📱 QR Code
          </button>
        )}
      </div>

      {/* QR Share Panel */}
      {shareOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShareOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-7 text-center" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-1">Share Catalog</h3>
            <p className="text-sm text-gray-500 mb-5">Scan or share the link</p>
            {catalog.sharing?.qrCode && (
              <img src={catalog.sharing.qrCode} alt="QR Code" className="w-48 h-48 mx-auto rounded-xl border border-gray-100 mb-5" />
            )}
            <div className="text-xs text-gray-400 bg-gray-50 rounded-xl px-4 py-2.5 mb-5 break-all font-mono">
              {window.location.origin}/catalog/{catalog.sharing?.shareableLink}
            </div>
            <div className="flex gap-2">
              <button onClick={async () => { await copyLink(); setShareOpen(false); }}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-colors cursor-pointer">
                {copied ? '✓ Copied!' : 'Copy Link'}
              </button>
              <button onClick={() => { shareOnWhatsApp(); setShareOpen(false); }}
                className="flex-1 py-2.5 bg-[#DC2626] hover:bg-[#b91c1c] text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer flex items-center justify-center gap-1.5">
                <WhatsAppIcon /> Share
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedProduct(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}>
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
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: theme.accent }}>{selectedProduct.category}</p>
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
                <span className="inline-block mt-2 px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-lg">
                  {selectedProduct.stock > 0 ? selectedProduct.stock + ' in stock' : 'In Stock'}
                </span>
              )}
              {selectedProduct.description && (
                <p className="text-gray-600 mt-4 text-sm leading-relaxed">{selectedProduct.description}</p>
              )}
              <div className="mt-6 flex gap-3 flex-wrap">
                {selectedProduct.stock !== 0 && (
                  <button onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold hover:brightness-110 transition-all text-white"
                    style={{ backgroundColor: theme.accent, boxShadow: `0 4px 20px ${theme.accent}55`, minWidth: 120 }}>
                    ?? Add to Cart
                  </button>
                )}
                <button onClick={() => enquireProduct(selectedProduct)}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 text-white rounded-xl font-bold hover:brightness-110 transition-all"
                  style={{ backgroundColor: '#DC2626', boxShadow: '0 4px 20px rgba(220,38,38,0.35)', minWidth: 120 }}>
                  <WhatsAppIcon />
                  Enquire
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
      {/* Cart Drawer */}
      {cartOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60 }}>
          {/* Backdrop */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={() => setCartOpen(false)} />
          {/* Drawer */}
          <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 420, background: '#fff', boxShadow: '-8px 0 40px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 800, color: '#111827', margin: 0 }}>Your Order</h2>
                <p style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>{cartCount} item{cartCount !== 1 ? 's' : ''}</p>
              </div>
              <button onClick={() => setCartOpen(false)} style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>�</button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
              {cartItems.length === 0 ? (
                <div style={{ textAlign: 'center', paddingTop: 60, color: '#9ca3af' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>??</div>
                  <p style={{ fontWeight: 600 }}>Your cart is empty</p>
                </div>
              ) : (
                cartItems.map(({ product, qty }) => (
                  <div key={product._id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #f9fafb' }}>
                    {product.images?.[0]?.url ? (
                      <img src={product.images[0].url} alt={product.name} style={{ width: 56, height: 56, borderRadius: 10, objectFit: 'cover', flexShrink: 0, background: '#f3f4f6' }} />
                    ) : (
                      <div style={{ width: 56, height: 56, borderRadius: 10, background: '#f3f4f6', flexShrink: 0 }} />
                    )}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, color: '#111827', fontSize: 14, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{product.name}</p>
                      <p style={{ color: '#6b7280', fontSize: 12, margin: '2px 0 0' }}>{formatCurrency(product.price)} each</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                      <button onClick={() => updateQty(product._id, -1)} style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid #e5e7eb', background: '#fff', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>-</button>
                      <span style={{ fontWeight: 700, minWidth: 20, textAlign: 'center', fontSize: 14 }}>{qty}</span>
                      <button onClick={() => updateQty(product._id, 1)} style={{ width: 28, height: 28, borderRadius: '50%', border: '1.5px solid #DC2626', background: '#DC2626', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>+</button>
                    </div>
                    <p style={{ fontWeight: 800, color: '#111827', fontSize: 14, minWidth: 64, textAlign: 'right', flexShrink: 0 }}>{formatCurrency(product.price * qty)}</p>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div style={{ padding: '20px 24px', borderTop: '1px solid #f3f4f6' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontWeight: 700, fontSize: 16, color: '#111827' }}>Total</span>
                  <span style={{ fontWeight: 800, fontSize: 18, color: '#111827' }}>{formatCurrency(cartTotal)}</span>
                </div>
                <button onClick={handleWhatsAppOrder}
                  style={{ width: '100%', padding: '14px 0', background: '#DC2626', color: '#fff', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 4px 20px rgba(220,38,38,0.4)' }}>
                  <WhatsAppIcon /> Send Order via WhatsApp
                </button>
                <button onClick={() => setCart({})}
                  style={{ width: '100%', marginTop: 8, padding: '10px 0', background: 'transparent', color: '#9ca3af', border: 'none', borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                  Clear cart
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Image Search Modal */}
      {showImageSearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-600">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Search Product Images</h2>
              <button
                onClick={() => setShowImageSearch(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              <ProductImageSearch onSelectImage={handleImageSelect} maxResults={20} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
