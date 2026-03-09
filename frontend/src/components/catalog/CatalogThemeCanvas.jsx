import React, { useState, useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────────────────────
   TEMPLATE THEME DEFINITIONS
   Each template gets: colors, fonts, layout rules
───────────────────────────────────────────────────────────── */
export const TEMPLATE_THEMES = {
  'minimal-luxe': {
    name: 'Minimal Luxe',
    bg: '#ffffff', text: '#111111', accent: '#111111', accent2: '#888888',
    cardBg: '#fafafa', cardBorder: '#f0f0f0', headerBg: '#ffffff',
    btnBg: '#111111', btnText: '#ffffff', fontHeading: 'Georgia, serif',
    fontBody: 'system-ui, sans-serif', badge: '#111', badgeText: '#fff',
    priceColor: '#111111', oldPriceColor: '#aaaaaa',
    headerStyle: 'bordered', gridCols: 4, layout: 'classic',
    heroGradient: 'linear-gradient(135deg, #f8f8f8 0%, #ebebeb 100%)',
  },
  'dark-premium': {
    name: 'Dark Premium',
    bg: '#0a0a0a', text: '#f0f0e8', accent: '#c9a84c', accent2: '#8a6f2e',
    cardBg: '#131313', cardBorder: '#1e1e1e', headerBg: '#0a0a0a',
    btnBg: '#c9a84c', btnText: '#0a0a0a', fontHeading: 'Georgia, serif',
    fontBody: 'system-ui, sans-serif', badge: '#c9a84c', badgeText: '#0a0a0a',
    priceColor: '#c9a84c', oldPriceColor: '#555555',
    headerStyle: 'solid', gridCols: 2, layout: 'editorial',
    heroGradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1206 50%, #0a0a0a 100%)',
  },
  'bold-commerce': {
    name: 'Bold Commerce',
    bg: '#ffffff', text: '#202124', accent: '#1a73e8', accent2: '#fa7c17',
    cardBg: '#ffffff', cardBorder: '#e8eaed', headerBg: '#1a73e8',
    btnBg: '#fa7c17', btnText: '#ffffff', fontHeading: '-apple-system, sans-serif',
    fontBody: '-apple-system, sans-serif', badge: '#dc2626', badgeText: '#ffffff',
    priceColor: '#202124', oldPriceColor: '#80868b',
    headerStyle: 'colored', gridCols: 4, layout: 'commerce',
    heroGradient: 'linear-gradient(135deg, #1557b0 0%, #1a73e8 100%)',
  },
  'tech-specs': {
    name: 'Tech Specs',
    bg: '#0a1628', text: '#c8e4f0', accent: '#00d4ff', accent2: '#0090b8',
    cardBg: '#0d2137', cardBorder: '#1a3a56', headerBg: '#0a1628',
    btnBg: '#00d4ff', btnText: '#0a1628', fontHeading: "'SF Pro Display', system-ui, sans-serif",
    fontBody: "'SF Pro Text', system-ui, sans-serif", badge: '#00d4ff', badgeText: '#0a1628',
    priceColor: '#00d4ff', oldPriceColor: '#3a6070',
    headerStyle: 'dark', gridCols: 3, layout: 'specs',
    heroGradient: 'linear-gradient(135deg, #0a1628 0%, #0d2137 100%)',
  },
  'artisan-market': {
    name: 'Artisan Market',
    bg: '#faf3e0', text: '#3d1f0a', accent: '#6b3a1f', accent2: '#c4956a',
    cardBg: '#ffffff', cardBorder: '#e8d4b8', headerBg: '#faf3e0',
    btnBg: '#6b3a1f', btnText: '#ffffff', fontHeading: 'Georgia, serif',
    fontBody: 'Georgia, serif', badge: '#6b3a1f', badgeText: '#fffaf0',
    priceColor: '#6b3a1f', oldPriceColor: '#c4956a',
    headerStyle: 'craft', gridCols: 3, layout: 'masonry',
    heroGradient: 'linear-gradient(135deg, #8b5e3c 0%, #c4a47c 100%)',
  },
  'flash-sale': {
    name: 'Flash Sale',
    bg: '#ffffff', text: '#1f2937', accent: '#dc2626', accent2: '#fbbf24',
    cardBg: '#ffffff', cardBorder: '#fee2e2', headerBg: '#dc2626',
    btnBg: '#dc2626', btnText: '#ffffff', fontHeading: 'system-ui, sans-serif',
    fontBody: 'system-ui, sans-serif', badge: '#dc2626', badgeText: '#ffffff',
    priceColor: '#dc2626', oldPriceColor: '#9ca3af',
    headerStyle: 'sale', gridCols: 4, layout: 'sale',
    heroGradient: 'linear-gradient(90deg, #7f1d1d, #dc2626, #7f1d1d)',
  },
  'fresh-grocery': {
    name: 'Fresh Grocery',
    bg: '#ffffff', text: '#14532d', accent: '#16a34a', accent2: '#86efac',
    cardBg: '#f0fdf4', cardBorder: '#dcfce7', headerBg: '#16a34a',
    btnBg: '#16a34a', btnText: '#ffffff', fontHeading: 'system-ui, sans-serif',
    fontBody: 'system-ui, sans-serif', badge: '#16a34a', badgeText: '#ffffff',
    priceColor: '#15803d', oldPriceColor: '#9ca3af',
    headerStyle: 'green', gridCols: 4, layout: 'grocery',
    heroGradient: 'linear-gradient(135deg, #16a34a 0%, #4ade80 100%)',
  },
  'corporate-b2b': {
    name: 'Corporate B2B',
    bg: '#f8fafc', text: '#0f172a', accent: '#0a2540', accent2: '#2563eb',
    cardBg: '#ffffff', cardBorder: '#e2e8f0', headerBg: '#0a2540',
    btnBg: '#0a2540', btnText: '#ffffff', fontHeading: "'Inter', system-ui, sans-serif",
    fontBody: "'Inter', system-ui, sans-serif", badge: '#2563eb', badgeText: '#ffffff',
    priceColor: '#0f172a', oldPriceColor: '#94a3b8',
    headerStyle: 'corporate', gridCols: 3, layout: 'table',
    heroGradient: 'linear-gradient(135deg, #0a2540 0%, #0f3460 100%)',
  },
  'editorial': {
    name: 'Editorial Focus',
    bg: '#fefefe', text: '#111111', accent: '#e83e3e', accent2: '#888888',
    cardBg: '#fefefe', cardBorder: '#e8e8e8', headerBg: '#fefefe',
    btnBg: '#111111', btnText: '#ffffff', fontHeading: "'Times New Roman', Georgia, serif",
    fontBody: "Georgia, serif", badge: '#e83e3e', badgeText: '#ffffff',
    priceColor: '#111111', oldPriceColor: '#aaaaaa',
    headerStyle: 'masthead', gridCols: 3, layout: 'editorial',
    heroGradient: 'linear-gradient(180deg, #f0ece4 0%, #e8e0d4 100%)',
  },
  'neon-street': {
    name: 'Neon Street',
    bg: '#0f0225', text: '#ffffff', accent: '#f72585', accent2: '#4cc9f0',
    cardBg: '#1a0635', cardBorder: '#2d0d50', headerBg: '#0f0225',
    btnBg: '#f72585', btnText: '#ffffff', fontHeading: "'Inter', system-ui, sans-serif",
    fontBody: "system-ui, sans-serif", badge: '#f72585', badgeText: '#ffffff',
    priceColor: '#f72585', oldPriceColor: '#4cc9f0',
    headerStyle: 'neon', gridCols: 3, layout: 'street',
    heroGradient: 'linear-gradient(135deg, #0f0225 0%, #2d0550 100%)',
  },
  'pastel-beauty': {
    name: 'Pastel Beauty',
    bg: '#fef6f9', text: '#3d1a2e', accent: '#d63f7c', accent2: '#f9a8d4',
    cardBg: '#fff', cardBorder: '#fce7f3', headerBg: '#fef6f9',
    btnBg: '#d63f7c', btnText: '#fff', fontHeading: "'Georgia', serif",
    fontBody: "'system-ui', sans-serif", badge: '#d63f7c', badgeText: '#fff',
    priceColor: '#be185d', oldPriceColor: '#f9a8d4',
    headerStyle: 'beauty', gridCols: 3, layout: 'beauty',
    heroGradient: 'linear-gradient(135deg, #fce7f3 0%, #fdf2f8 100%)',
  },
  'sports-fitness': {
    name: 'Sports & Fitness',
    bg: '#0f172a', text: '#f1f5f9', accent: '#f97316', accent2: '#fb923c',
    cardBg: '#1e293b', cardBorder: '#334155', headerBg: '#0f172a',
    btnBg: '#f97316', btnText: '#fff', fontHeading: "'system-ui', sans-serif",
    fontBody: "'system-ui', sans-serif", badge: '#f97316', badgeText: '#fff',
    priceColor: '#fb923c', oldPriceColor: '#475569',
    headerStyle: 'sports', gridCols: 3, layout: 'sports',
    heroGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
  },
  'real-estate': {
    name: 'Real Estate',
    bg: '#f9fafb', text: '#111827', accent: '#B91C1C', accent2: '#6b7280',
    cardBg: '#fff', cardBorder: '#e5e7eb', headerBg: '#fff',
    btnBg: '#B91C1C', btnText: '#fff', fontHeading: "'Georgia', serif",
    fontBody: "'system-ui', sans-serif", badge: '#B91C1C', badgeText: '#fff',
    priceColor: '#B91C1C', oldPriceColor: '#9ca3af',
    headerStyle: 'realestate', gridCols: 2, layout: 'realestate',
    heroGradient: 'linear-gradient(135deg, #064e3b 0%, #B91C1C 100%)',
  },
  'kids-playful': {
    name: 'Kids & Playful',
    bg: '#fffbeb', text: '#1c1917', accent: '#ea580c', accent2: '#fbbf24',
    cardBg: '#fff', cardBorder: '#fed7aa', headerBg: '#fff7ed',
    btnBg: '#ea580c', btnText: '#fff', fontHeading: "'Georgia', serif",
    fontBody: "'system-ui', sans-serif", badge: '#ea580c', badgeText: '#fff',
    priceColor: '#c2410c', oldPriceColor: '#fbbf24',
    headerStyle: 'kids', gridCols: 4, layout: 'kids',
    heroGradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
  },
  'pharmacy-health': {
    name: 'Pharmacy & Health',
    bg: '#f0f9ff', text: '#0c4a6e', accent: '#0284c7', accent2: '#38bdf8',
    cardBg: '#fff', cardBorder: '#bae6fd', headerBg: '#0284c7',
    btnBg: '#0284c7', btnText: '#fff', fontHeading: "'system-ui', sans-serif",
    fontBody: "'system-ui', sans-serif", badge: '#0284c7', badgeText: '#fff',
    priceColor: '#0369a1', oldPriceColor: '#7dd3fc',
    headerStyle: 'pharmacy', gridCols: 4, layout: 'pharmacy',
    heroGradient: 'linear-gradient(135deg, #0284c7 0%, #38bdf8 100%)',
  },
  'jewellery-gold': {
    name: 'Jewellery & Gold',
    bg: '#1a0e00', text: '#f5e6c8', accent: '#d4a017', accent2: '#a07808',
    cardBg: '#241400', cardBorder: '#3a2200', headerBg: '#1a0e00',
    btnBg: '#d4a017', btnText: '#1a0e00', fontHeading: "'Georgia', serif",
    fontBody: "'Georgia', serif", badge: '#d4a017', badgeText: '#1a0e00',
    priceColor: '#d4a017', oldPriceColor: '#a07808',
    headerStyle: 'jewel', gridCols: 3, layout: 'jewel',
    heroGradient: 'linear-gradient(135deg, #1a0e00 0%, #2e1a00 50%, #1a0e00 100%)',
  },
  'auto-parts': {
    name: 'Auto & Parts',
    bg: '#18181b', text: '#f4f4f5', accent: '#ef4444', accent2: '#dc2626',
    cardBg: '#27272a', cardBorder: '#3f3f46', headerBg: '#09090b',
    btnBg: '#ef4444', btnText: '#fff', fontHeading: "'system-ui', sans-serif",
    fontBody: "'system-ui', sans-serif", badge: '#ef4444', badgeText: '#fff',
    priceColor: '#ef4444', oldPriceColor: '#71717a',
    headerStyle: 'auto', gridCols: 3, layout: 'auto',
    heroGradient: 'linear-gradient(135deg, #09090b 0%, #18181b 100%)',
  },
  'furniture-home': {
    name: 'Furniture & Home',
    bg: '#fafaf9', text: '#1c1917', accent: '#a16207', accent2: '#78350f',
    cardBg: '#fff', cardBorder: '#e7e5e4', headerBg: '#fafaf9',
    btnBg: '#a16207', btnText: '#fff', fontHeading: "'Georgia', serif",
    fontBody: "'system-ui', sans-serif", badge: '#a16207', badgeText: '#fff',
    priceColor: '#a16207', oldPriceColor: '#a8a29e',
    headerStyle: 'furniture', gridCols: 3, layout: 'furniture',
    heroGradient: 'linear-gradient(135deg, #fef9c3 0%, #fef3c7 100%)',
  },
  'pet-store': {
    name: 'Pet Store',
    bg: '#f0fdf4', text: '#14532d', accent: '#15803d', accent2: '#4ade80',
    cardBg: '#fff', cardBorder: '#bbf7d0', headerBg: '#15803d',
    btnBg: '#15803d', btnText: '#fff', fontHeading: "'system-ui', sans-serif",
    fontBody: "'system-ui', sans-serif", badge: '#15803d', badgeText: '#fff',
    priceColor: '#166534', oldPriceColor: '#86efac',
    headerStyle: 'pet', gridCols: 3, layout: 'pet',
    heroGradient: 'linear-gradient(135deg, #15803d 0%, #4ade80 100%)',
  },
  // Fallback / legacy
  'grid':         { name: 'Grid',          bg:'#fff',text:'#111',accent:'#008060',accent2:'#aaa',cardBg:'#fafafa',cardBorder:'#eee',headerBg:'#fff',btnBg:'#008060',btnText:'#fff',fontHeading:'system-ui',fontBody:'system-ui',badge:'#008060',badgeText:'#fff',priceColor:'#111',oldPriceColor:'#aaa',headerStyle:'bordered',gridCols:3,layout:'classic',heroGradient:'linear-gradient(135deg,#f0f0f0,#e0e0e0)' },
  'minimal':      { name: 'Minimal',       bg:'#fff',text:'#111',accent:'#111',accent2:'#888',cardBg:'#fafafa',cardBorder:'#f0f0f0',headerBg:'#fff',btnBg:'#111',btnText:'#fff',fontHeading:'Georgia,serif',fontBody:'system-ui',badge:'#111',badgeText:'#fff',priceColor:'#111',oldPriceColor:'#aaa',headerStyle:'bordered',gridCols:3,layout:'classic',heroGradient:'linear-gradient(135deg,#f8f8f8,#ebebeb)' },
  'luxury':       { name: 'Luxury',        bg:'#0a0a0a',text:'#f0f0e8',accent:'#c9a84c',accent2:'#8a6f2e',cardBg:'#131313',cardBorder:'#1e1e1e',headerBg:'#0a0a0a',btnBg:'#c9a84c',btnText:'#0a0a0a',fontHeading:'Georgia,serif',fontBody:'system-ui',badge:'#c9a84c',badgeText:'#0a0a0a',priceColor:'#c9a84c',oldPriceColor:'#555',headerStyle:'solid',gridCols:2,layout:'editorial',heroGradient:'linear-gradient(135deg,#0a0a0a,#1a1206)' },
  'modern':       { name: 'Modern',        bg:'#fff',text:'#1a1a1a',accent:'#6366f1',accent2:'#a5b4fc',cardBg:'#fff',cardBorder:'#e5e7eb',headerBg:'#6366f1',btnBg:'#6366f1',btnText:'#fff',fontHeading:'system-ui',fontBody:'system-ui',badge:'#6366f1',badgeText:'#fff',priceColor:'#6366f1',oldPriceColor:'#9ca3af',headerStyle:'colored',gridCols:3,layout:'classic',heroGradient:'linear-gradient(135deg,#6366f1,#8b5cf6)' },
  'magazine':     { name: 'Magazine',      bg:'#fefefe',text:'#111',accent:'#e83e3e',accent2:'#888',cardBg:'#fefefe',cardBorder:'#e8e8e8',headerBg:'#fefefe',btnBg:'#111',btnText:'#fff',fontHeading:"'Times New Roman',serif",fontBody:'Georgia,serif',badge:'#e83e3e',badgeText:'#fff',priceColor:'#111',oldPriceColor:'#aaa',headerStyle:'masthead',gridCols:3,layout:'editorial',heroGradient:'linear-gradient(180deg,#f0ece4,#e8e0d4)' },
  'classic':      { name: 'Classic',       bg:'#fffdf7',text:'#2d1f0a',accent:'#8b4513',accent2:'#c4956a',cardBg:'#fff',cardBorder:'#e8d4b8',headerBg:'#fffdf7',btnBg:'#8b4513',btnText:'#fff',fontHeading:'Georgia,serif',fontBody:'Georgia,serif',badge:'#8b4513',badgeText:'#fffaf0',priceColor:'#8b4513',oldPriceColor:'#c4956a',headerStyle:'craft',gridCols:3,layout:'classic',heroGradient:'linear-gradient(135deg,#8b6347,#c4a47c)' },
  'modern-blocks':{ name: 'Modern Blocks', bg:'#f9fafb',text:'#111827',accent:'#7c3aed',accent2:'#ddd6fe',cardBg:'#fff',cardBorder:'#e5e7eb',headerBg:'#7c3aed',btnBg:'#7c3aed',btnText:'#fff',fontHeading:'system-ui',fontBody:'system-ui',badge:'#7c3aed',badgeText:'#fff',priceColor:'#111827',oldPriceColor:'#9ca3af',headerStyle:'colored',gridCols:4,layout:'commerce',heroGradient:'linear-gradient(135deg,#7c3aed,#a855f7)' },
  'list':         { name: 'List',          bg:'#f8fafc',text:'#0f172a',accent:'#0a2540',accent2:'#2563eb',cardBg:'#fff',cardBorder:'#e2e8f0',headerBg:'#0a2540',btnBg:'#0a2540',btnText:'#fff',fontHeading:'system-ui',fontBody:'system-ui',badge:'#2563eb',badgeText:'#fff',priceColor:'#0f172a',oldPriceColor:'#94a3b8',headerStyle:'corporate',gridCols:1,layout:'table',heroGradient:'linear-gradient(135deg,#0a2540,#0f3460)' },
};

export const getTheme = (templateId) =>
  TEMPLATE_THEMES[templateId] || TEMPLATE_THEMES['grid'];

const DEFAULT_TEXTS = {
  announcement: '🎉 Free shipping on orders above ₹999 · Use code WELCOME10 for 10% off',
  heroBadge: 'New Collection',
  heroHeading: '',
  heroSubheading: 'Browse our curated collection of premium products, handpicked just for you.',
  heroPrimaryBtn: 'Browse Collection',
  heroSecondaryBtn: 'Learn More',
  headerCta: 'Shop Now',
  productsHeading: 'Featured Products',
  footerTagline: 'Curated products, delivered with care.',
};

/* ─────────────────────────────────────────────────────────────
   CATALOG CANVAS
   isPublic=false  → editor mode (section rings, placeholder products)
   isPublic=true   → live view (no rings, real products, enquire CTAs)
───────────────────────────────────────────────────────────── */
export function CatalogCanvas({
  catalog,
  theme,
  products,
  onSectionClick,
  activeSection,
  texts = {},
  onProductClick,
  onAddToCart,
  isPublic = false,
}) {
  const t = theme;
  const tx = { ...DEFAULT_TEXTS, ...texts };
  const hasProducts = products && products.length > 0;
  const displayProducts = isPublic
    ? (hasProducts ? products : [])
    : (hasProducts ? products.slice(0, 12) : Array(6).fill(null));

  const [menuOpen, setMenuOpen] = useState(false);
  const [vw, setVw] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1200));
  useEffect(() => {
    const handler = () => setVw(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const isMobile  = vw < 640;
  const isTablet  = vw < 1024;
  const px        = isMobile ? '16px' : isTablet ? '24px' : '40px';

  const tenant = catalog?.tenant || {};
  const logoUrl = tenant?.logo?.url;
  const storeName = tenant?.name || catalog.name || 'My Store';
  const phone = tenant?.contactInfo?.phone || tenant?.socialLinks?.whatsapp || '';
  const whatsapp = phone.replace(/\D/g, '');
  const instagram = tenant?.socialLinks?.instagram || '';
  const email = tenant?.contactInfo?.email || '';

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const G = isPublic ? '' : 'group ';

  const sectionCls = (id) => {
    if (isPublic) return '';
    return 'relative cursor-pointer transition-all duration-200 ' +
      (activeSection === id
        ? 'ring-2 ring-[#008060] ring-offset-2'
        : 'hover:ring-2 hover:ring-blue-400 hover:ring-offset-1');
  };

  const SectionLabel = ({ label }) => {
    if (isPublic) return null;
    return (
      <div className="absolute top-1.5 right-2 z-10 bg-[#008060] text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {label}
      </div>
    );
  };

  /* ── HEADER ─────────────────────────────────────────────── */
  const renderHeader = () => {
    const st = t.headerStyle;
    const isDark = st === 'colored' || st === 'sale' || st === 'green' || st === 'dark' || st === 'corporate' || st === 'neon' || st === 'pharmacy' || st === 'sports' || st === 'auto' || st === 'pet';
    const textOnHeader = isDark ? '#ffffff' : t.text;
    const subOnHeader  = isDark ? 'rgba(255,255,255,0.75)' : t.accent2;

    if (st === 'masthead') {
      return (
        <div id="catalog-header" className={G + sectionCls('header')} onClick={() => !isPublic && onSectionClick && onSectionClick('header')} style={{ background: t.bg, borderBottom: '3px solid ' + t.text }}>
          <SectionLabel label="Header" />
          {/* top bar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `16px ${px} 10px`, gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {logoUrl && <img src={logoUrl} alt={storeName} style={{ height: 36, width: 36, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />}
              <div>
                <div style={{ fontFamily: t.fontHeading, fontSize: isMobile ? 20 : 28, fontWeight: 900, color: t.text, letterSpacing: -0.5 }}>{catalog.name || storeName}</div>
                {!isMobile && <div style={{ fontFamily: t.fontBody, fontSize: 11, color: t.accent2 }}>{storeName}</div>}
              </div>
            </div>
            {!isMobile && (
              <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                {[['Products', 'catalog-products'], ['About', null], ['Contact', null]].map(([n, target]) => (
                  <span key={n} onClick={() => target && scrollToSection(target)} style={{ fontFamily: t.fontBody, fontSize: 13, color: t.accent2, cursor: 'pointer', fontWeight: 500, transition: 'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = t.accent}
                    onMouseLeave={e => e.currentTarget.style.color = t.accent2}>{n}</span>
                ))}
              </div>
            )}
            {isMobile && isPublic && (
              <button onClick={() => setMenuOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                <div style={{ width: 22, height: 2, background: t.text, margin: '4px 0' }} />
                <div style={{ width: 22, height: 2, background: t.text, margin: '4px 0' }} />
                <div style={{ width: 22, height: 2, background: t.text, margin: '4px 0' }} />
              </button>
            )}
          </div>
          <div style={{ height: 1, background: '#e8e8e8', margin: `0 ${px}` }} />
          {menuOpen && isMobile && (
            <div style={{ background: t.bg, padding: `12px ${px}` }}>
              {['Home', 'Collection', 'New In', 'Sale', 'About'].map(n => (
                <div key={n} style={{ fontFamily: t.fontBody, fontSize: 14, color: t.accent2, padding: '8px 0', borderBottom: '1px solid ' + t.cardBorder }}>{n}</div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (st === 'craft') {
      return (
        <div id="catalog-header" className={G + sectionCls('header')} onClick={() => !isPublic && onSectionClick && onSectionClick('header')} style={{ background: t.headerBg, padding: `14px ${px}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid ' + t.cardBorder, flexWrap: 'wrap', gap: 10 }}>
          <SectionLabel label="Header" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {logoUrl && <img src={logoUrl} alt={storeName} style={{ height: 38, width: 38, borderRadius: '50%', objectFit: 'cover', border: '2px solid ' + t.cardBorder }} />}
            <div style={{ fontFamily: t.fontHeading, fontSize: isMobile ? 17 : 21, fontWeight: 700, color: t.accent }}>✦ {catalog.name || storeName}</div>
          </div>
          {!isMobile && (
            <div style={{ display: 'flex', gap: 22, alignItems: 'center' }}>
              {[['Shop', 'catalog-products'], ['Collections', 'catalog-products'], ['About', null], ['Contact', null]].map(([n, target]) => (
                <span key={n} onClick={() => target && scrollToSection(target)} style={{ fontFamily: t.fontBody, fontSize: 13, color: t.accent2, fontWeight: 500, cursor: 'pointer', transition: 'color 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.color = t.accent}
                  onMouseLeave={e => e.currentTarget.style.color = t.accent2}>{n}</span>
              ))}
            </div>
          )}
          {isMobile && isPublic && (
            <button onClick={() => setMenuOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: 'auto' }}>
              <div style={{ width: 20, height: 2, background: t.accent, margin: '4px 0' }} />
              <div style={{ width: 20, height: 2, background: t.accent, margin: '4px 0' }} />
              <div style={{ width: 20, height: 2, background: t.accent, margin: '4px 0' }} />
            </button>
          )}
          {menuOpen && isMobile && (
            <div style={{ width: '100%', background: t.headerBg, paddingBottom: 8 }}>
              {['Shop', 'Collections', 'About', 'Contact'].map(n => (
                <div key={n} style={{ fontFamily: t.fontBody, fontSize: 14, color: t.accent2, padding: '9px 0', borderBottom: '1px solid ' + t.cardBorder }}>{n}</div>
              ))}
            </div>
          )}
        </div>
      );
    }

    /* colored / sale / green / dark / corporate / neon / pharmacy / sports / auto / pet */
    if (isDark) {
      return (
        <div
          id="catalog-header"
          className={G + sectionCls('header')}
          style={{ background: t.headerBg, padding: `14px ${px}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}
          onClick={() => !isPublic && onSectionClick && onSectionClick('header')}
        >
          <SectionLabel label="Header" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            {logoUrl
              ? <img src={logoUrl} alt={storeName} style={{ height: 38, width: 38, borderRadius: 8, objectFit: 'cover', flexShrink: 0, border: '2px solid rgba(255,255,255,0.2)' }} />
              : <div style={{ height: 38, width: 38, borderRadius: 8, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: t.fontHeading, fontWeight: 800, color: '#fff', fontSize: 16, flexShrink: 0 }}>{storeName[0]}</div>
            }
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: t.fontHeading, fontWeight: 800, fontSize: isMobile ? 15 : 18, color: '#ffffff', letterSpacing: -0.3, textShadow: st === 'neon' ? '0 0 16px ' + t.accent : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {catalog.name || storeName}
              </div>
              {!isMobile && storeName !== catalog.name && (
                <div style={{ fontFamily: t.fontBody, fontSize: 11, color: 'rgba(255,255,255,0.65)' }}>{storeName}</div>
              )}
            </div>
          </div>
          <div style={{ display: 'flex', gap: isMobile ? 8 : 14, alignItems: 'center' }}>
            {!isMobile && (
              <div style={{ display: 'flex', gap: 18, alignItems: 'center', marginRight: 6 }}>
                {[['Products', 'catalog-products'], ['About', null], ['Contact', null]].map(([n, target]) => (
                  <span key={n} onClick={() => target && scrollToSection(target)} style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontFamily: t.fontBody, fontWeight: 500, cursor: 'pointer', transition: 'color 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}>{n}</span>
                ))}
              </div>
            )}
            {whatsapp && isPublic ? (
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
                style={{ height: 34, padding: '0 16px', background: '#DC2626', borderRadius: 30, display: 'flex', alignItems: 'center', fontFamily: t.fontBody, fontSize: 12, fontWeight: 700, color: '#fff', textDecoration: 'none', gap: 6, flexShrink: 0 }}>
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 14, height: 14 }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.558 4.112 1.531 5.836L.057 23.737a.5.5 0 00.614.629l6.083-1.595A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.896 0-3.67-.513-5.192-1.41l-.373-.22-3.867 1.014 1.032-3.764-.242-.389A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                {!isMobile && 'Chat'}
              </a>
            ) : (
              <div style={{ height: 32, padding: '0 14px', background: st === 'colored' ? t.accent2 : 'rgba(255,255,255,0.18)', borderRadius: 30, display: 'flex', alignItems: 'center', fontFamily: t.fontBody, fontSize: 12, fontWeight: 700, color: '#fff', boxShadow: st === 'neon' ? '0 0 14px ' + t.accent : 'none', cursor: 'pointer' }}>
                {tx.headerCta}
              </div>
            )}
          </div>
        </div>
      );
    }

    /* default bordered / jewel / realestate / kids / furniture / beauty */
    return (
      <div id="catalog-header" className={G + sectionCls('header')} onClick={() => !isPublic && onSectionClick && onSectionClick('header')} style={{ background: t.headerBg, borderTop: '3px solid ' + t.accent }}>       <div style={{ padding: `13px ${px}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid ' + t.cardBorder, flexWrap: 'wrap', gap: 10 }}>
        <SectionLabel label="Header" />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          {logoUrl
            ? <img src={logoUrl} alt={storeName} style={{ height: 36, width: 36, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} />
            : <div style={{ height: 36, width: 36, borderRadius: 8, background: t.accent + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: t.fontHeading, fontWeight: 800, color: t.accent, fontSize: 15, flexShrink: 0 }}>{storeName[0]}</div>
          }
          <div style={{ minWidth: 0 }}>
            <div style={{ fontFamily: t.fontHeading, fontSize: isMobile ? 15 : 19, fontWeight: 800, color: t.text, letterSpacing: -0.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {catalog.name || storeName}
            </div>
            {!isMobile && storeName !== catalog.name && (
              <div style={{ fontFamily: t.fontBody, fontSize: 11, color: t.accent2 }}>{storeName}</div>
            )}
          </div>
        </div>
          <div style={{ display: 'flex', gap: isMobile ? 8 : 20, alignItems: 'center' }}>
            {!isMobile && [['Products', 'catalog-products'], ['About', null], ['Contact', null]].map(([n, target]) => (
              <span key={n} onClick={() => target && scrollToSection(target)}
                style={{ fontFamily: t.fontBody, fontSize: 13, color: t.accent2, fontWeight: 500, cursor: 'pointer', padding: '4px 0', borderBottom: '2px solid transparent', transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.color = t.accent; e.currentTarget.style.borderBottomColor = t.accent; }}
                onMouseLeave={e => { e.currentTarget.style.color = t.accent2; e.currentTarget.style.borderBottomColor = 'transparent'; }}>{n}</span>
            ))}
            {whatsapp && isPublic ? (
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
                style={{ height: 34, padding: '0 16px', background: '#DC2626', borderRadius: 20, display: 'flex', alignItems: 'center', fontFamily: t.fontBody, fontSize: 12, fontWeight: 700, color: '#fff', textDecoration: 'none', gap: 6, flexShrink: 0, boxShadow: '0 2px 8px rgba(220,38,38,0.3)' }}>
                <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 13, height: 13 }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.558 4.112 1.531 5.836L.057 23.737a.5.5 0 00.614.629l6.083-1.595A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.896 0-3.67-.513-5.192-1.41l-.373-.22-3.867 1.014 1.032-3.764-.242-.389A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                {!isMobile && 'Chat'}
              </a>
            ) : (
              <div onClick={() => scrollToSection('catalog-products')} style={{ height: 32, padding: '0 16px', background: t.btnBg, borderRadius: 20, display: 'flex', alignItems: 'center', fontFamily: t.fontBody, fontSize: 12, fontWeight: 700, color: t.btnText, cursor: 'pointer', flexShrink: 0 }}>
                {tx.headerCta}
              </div>
            )}
            {isMobile && isPublic && (
              <button onClick={() => setMenuOpen(v => !v)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'center' }}>
                <div style={{ width: 22, height: 2, background: menuOpen ? t.accent : t.text, borderRadius: 2, transition: 'all 0.2s', transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
                <div style={{ width: 22, height: 2, background: menuOpen ? t.accent : t.text, borderRadius: 2, transition: 'all 0.2s', opacity: menuOpen ? 0 : 1 }} />
                <div style={{ width: 22, height: 2, background: menuOpen ? t.accent : t.text, borderRadius: 2, transition: 'all 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(4px, -4px)' : 'none' }} />
              </button>
            )}
          </div>
        </div>
        {menuOpen && isMobile && (
          <div style={{ background: t.headerBg, borderTop: '1px solid ' + t.cardBorder }}>
            {[['Products', 'catalog-products'], ['About', null], ['Contact', null]].map(([n, target]) => (
              <div key={n} onClick={() => { target && scrollToSection(target); setMenuOpen(false); }}
                style={{ fontFamily: t.fontBody, fontSize: 14, color: t.text, padding: `11px ${px}`, borderBottom: '1px solid ' + t.cardBorder, display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                {n}
                <span style={{ color: t.accent, fontSize: 12 }}>›</span>
              </div>
            ))}
            {whatsapp && (
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: `12px ${px}`, textDecoration: 'none', fontFamily: t.fontBody, fontSize: 14, color: '#DC2626', fontWeight: 600 }}>
                💬 Chat on WhatsApp
              </a>
            )}
          </div>
        )}
      </div>
    );
  };

  /* ── HERO ────────────────────────────────────────────────── */
  const renderHero = () => (
    <div
      className={G + sectionCls('hero')}
      style={{ background: t.heroGradient, padding: isMobile ? '36px 16px 28px' : isTablet ? '44px 24px 36px' : '56px 48px 44px', position: 'relative', overflow: 'hidden' }}
      onClick={() => !isPublic && onSectionClick && onSectionClick('hero')}
    >
      <SectionLabel label="Hero Banner" />
      <div style={{ position: 'absolute', right: -60, top: -60, width: isMobile ? 180 : 280, height: isMobile ? 180 : 280, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 1, maxWidth: isMobile ? '100%' : 520 }}>
        <div style={{ display: 'inline-block', background: t.badge, color: t.badgeText, fontSize: 10, fontWeight: 700, padding: '4px 12px', borderRadius: 20, letterSpacing: 1, marginBottom: 14, fontFamily: t.fontBody, textTransform: 'uppercase', boxShadow: t.headerStyle === 'neon' ? '0 0 12px ' + t.accent : 'none' }}>
          {tx.heroBadge}
        </div>
        <h1 style={{ fontFamily: t.fontHeading, fontSize: isMobile ? 28 : isTablet ? 36 : 46, fontWeight: 900, color: t.text, lineHeight: 1.15, marginBottom: 14, letterSpacing: isMobile ? -0.5 : -1, textShadow: t.headerStyle === 'neon' ? '0 0 20px ' + t.accent : 'none' }}>
          {tx.heroHeading || catalog.name || 'Untitled Catalog'}
        </h1>
        <p style={{ fontFamily: t.fontBody, fontSize: isMobile ? 13 : 15, color: t.accent2 || (t.bg === '#0a0a0a' || t.bg === '#0a1628' || t.bg === '#0f0225' ? 'rgba(255,255,255,0.5)' : '#888'), lineHeight: 1.65, marginBottom: 24, maxWidth: isMobile ? '100%' : 400 }}>
          {tx.heroSubheading}
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <div onClick={() => scrollToSection('catalog-products')} style={{ height: isMobile ? 42 : 46, padding: isMobile ? '0 20px' : '0 28px', background: t.btnBg, borderRadius: 8, display: 'inline-flex', alignItems: 'center', fontFamily: t.fontBody, fontSize: isMobile ? 13 : 14, fontWeight: 700, color: t.btnText, cursor: 'pointer', boxShadow: t.headerStyle === 'neon' ? '0 0 18px ' + t.accent : '0 4px 14px rgba(0,0,0,0.2)' }}>
            {tx.heroPrimaryBtn}
          </div>
          {whatsapp && isPublic ? (
            <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ height: isMobile ? 42 : 46, padding: isMobile ? '0 16px' : '0 22px', border: '1.5px solid ' + t.accent, borderRadius: 8, display: 'inline-flex', alignItems: 'center', fontFamily: t.fontBody, fontSize: isMobile ? 13 : 14, fontWeight: 600, color: t.accent, cursor: 'pointer', textDecoration: 'none' }}>
              {tx.heroSecondaryBtn}
            </a>
          ) : (
            <div style={{ height: isMobile ? 42 : 46, padding: isMobile ? '0 16px' : '0 22px', border: '1.5px solid ' + t.accent, borderRadius: 8, display: 'inline-flex', alignItems: 'center', fontFamily: t.fontBody, fontSize: isMobile ? 13 : 14, fontWeight: 600, color: t.accent, cursor: 'pointer' }}>
              {tx.heroSecondaryBtn}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  /* ── ANNOUNCEMENT ────────────────────────────────────────── */
  const renderAnnouncement = () => (
    <div
      className={G + sectionCls('announcement')}
      style={{ background: t.accent, padding: isMobile ? '8px 12px' : '9px 32px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
      onClick={() => !isPublic && onSectionClick && onSectionClick('announcement')}
    >
      <SectionLabel label="Announcement" />
      <span style={{ fontFamily: t.fontBody, fontSize: isMobile ? 11 : 12, fontWeight: 600, color: t.btnText, letterSpacing: 0.3 }}>
        {tx.announcement}
      </span>
    </div>
  );

  /* ── PRODUCT GRID ────────────────────────────────────────── */
  const renderProductGrid = () => {
    const baseCols = t.gridCols;
    const cols = isMobile ? Math.min(2, baseCols) : isTablet ? Math.min(3, baseCols) : baseCols;
    const isTable = t.layout === 'table';
    const isGrocery = t.layout === 'grocery';

    if (isTable) {
      return (
        <div id="catalog-products" className={G + sectionCls('products')} onClick={() => !isPublic && onSectionClick && onSectionClick('products')} style={{ background: t.bg, padding: `20px ${px}` }}>
          <SectionLabel label="Product List" />
          <h2 style={{ fontFamily: t.fontHeading, fontSize: isMobile ? 16 : 18, fontWeight: 700, color: t.text, marginBottom: 16 }}>Product Catalog</h2>
          {isMobile ? (
            /* Mobile: card list instead of table */
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {displayProducts.map((p, i) => (
                <div key={i} style={{ background: t.cardBg, border: '1px solid ' + t.cardBorder, borderRadius: 10, padding: 12, display: 'flex', alignItems: 'center', gap: 12, cursor: onProductClick && p ? 'pointer' : 'default' }} onClick={() => onProductClick && p && onProductClick(p)}>
                  <div style={{ width: 48, height: 48, borderRadius: 8, background: t.cardBorder, flexShrink: 0, overflow: 'hidden' }}>
                    {p?.images?.[0] ? <img src={p.images[0].url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>📦</div>}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: t.fontBody, fontSize: 14, fontWeight: 600, color: t.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p ? p.name : 'Product ' + (i + 1)}</div>
                    <div style={{ fontFamily: t.fontBody, fontSize: 12, color: t.oldPriceColor }}>{p?.category || 'Category'}</div>
                  </div>
                  <div>
                    <div style={{ fontFamily: t.fontBody, fontSize: 15, fontWeight: 800, color: t.accent2 }}>₹{p ? (p.price?.toLocaleString('en-IN') || '—') : (999 + i * 100)}</div>
                    {isPublic && onProductClick && p && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 4 }}>
                        {onAddToCart && p.stock !== 0 && (
                          <div style={{ width: 26, height: 26, background: '#DC2626', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 6px rgba(220,38,38,0.4)' }} onClick={e => { e.stopPropagation(); onAddToCart(p); }} title="Add to cart">
                            <span style={{ color: '#fff', fontSize: 15, lineHeight: 1 }}>+</span>
                          </div>
                        )}
                        <div style={{ height: 26, padding: '0 10px', background: t.btnBg, borderRadius: 5, display: 'inline-flex', alignItems: 'center', fontFamily: t.fontBody, fontSize: 11, fontWeight: 700, color: t.btnText, cursor: 'pointer' }} onClick={e => { e.stopPropagation(); onProductClick(p); }}>View</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ background: t.cardBg, border: '1px solid ' + t.cardBorder, borderRadius: 10, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              <div style={{ display: 'flex', background: t.accent, padding: '10px 16px' }}>
                {['Product', 'SKU', 'Category', 'Price', 'MOQ', ''].map((h, i) => (
                  <div key={i} style={{ flex: [3,1.5,2,1.5,1,1.5][i], fontFamily: t.fontBody, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.88)', textTransform: 'uppercase', letterSpacing: 0.8 }}>{h}</div>
                ))}
              </div>
              {displayProducts.map((p, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderTop: '1px solid ' + t.cardBorder, background: i % 2 === 0 ? t.cardBg : t.bg, cursor: onProductClick && p ? 'pointer' : 'default' }} onClick={() => onProductClick && p && onProductClick(p)}>
                  <div style={{ flex: 3, display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 6, background: t.cardBorder, flexShrink: 0, overflow: 'hidden' }}>
                      {p?.images?.[0] ? <img src={p.images[0].url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', background: t.accent2 + '33', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>📦</div>}
                    </div>
                    <div>
                      <div style={{ fontFamily: t.fontBody, fontSize: 13, fontWeight: 600, color: t.text }}>{p ? p.name : 'Product ' + (i + 1)}</div>
                      <div style={{ fontFamily: t.fontBody, fontSize: 11, color: t.oldPriceColor }}>{p?.category || 'Category'}</div>
                    </div>
                  </div>
                  <div style={{ flex: 1.5, fontFamily: t.fontBody, fontSize: 11, color: t.oldPriceColor }}>SKU-{String(i + 1).padStart(4, '0')}</div>
                  <div style={{ flex: 2, fontFamily: t.fontBody, fontSize: 12, color: t.text }}>{p?.category || '—'}</div>
                  <div style={{ flex: 1.5, fontFamily: t.fontBody, fontSize: 14, fontWeight: 700, color: t.accent2 }}>₹{p ? (p.price?.toLocaleString('en-IN') || '—') : (999 + i * 100)}</div>
                  <div style={{ flex: 1, fontFamily: t.fontBody, fontSize: 11, color: t.oldPriceColor }}>10+</div>
                  <div style={{ flex: 1.5 }}>
                    {isPublic && onProductClick && p ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        {onAddToCart && p.stock !== 0 && (
                          <div style={{ width: 28, height: 28, background: '#DC2626', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 6px rgba(220,38,38,0.4)', flexShrink: 0 }} onClick={e => { e.stopPropagation(); onAddToCart(p); }} title="Add to cart">
                            <span style={{ color: '#fff', fontSize: 16, lineHeight: 1 }}>+</span>
                          </div>
                        )}
                        <div style={{ height: 28, padding: '0 10px', background: t.btnBg, borderRadius: 5, display: 'inline-flex', alignItems: 'center', fontFamily: t.fontBody, fontSize: 11, fontWeight: 700, color: t.btnText, cursor: 'pointer' }} onClick={e => { e.stopPropagation(); onProductClick(p); }}>View</div>
                      </div>
                    ) : (
                      <div style={{ height: 28, padding: '0 12px', background: t.btnBg, borderRadius: 5, display: 'inline-flex', alignItems: 'center', fontFamily: t.fontBody, fontSize: 11, fontWeight: 700, color: t.btnText }}>Request</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (displayProducts.length === 0 && isPublic) {
      return (
        <div style={{ background: t.bg, padding: isMobile ? '48px 16px' : '80px 40px', textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🛍️</div>
          <p style={{ fontFamily: t.fontBody, fontSize: 16, color: t.oldPriceColor, fontWeight: 600 }}>No products in this catalog yet.</p>
          <p style={{ fontFamily: t.fontBody, fontSize: 13, color: t.oldPriceColor, marginTop: 4 }}>Check back soon or enquire via WhatsApp.</p>
        </div>
      );
    }

    return (
      <div id="catalog-products" className={G + sectionCls('products')} onClick={() => !isPublic && onSectionClick && onSectionClick('products')} style={{ background: t.bg, padding: isMobile ? `20px ${px}` : `28px ${px}` }}>
        <SectionLabel label="Product Grid" />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: isMobile ? 14 : 20 }}>
          <h2 style={{ fontFamily: t.fontHeading, fontSize: isMobile ? 18 : 22, fontWeight: 800, color: t.text, letterSpacing: -0.5 }}>
            {tx.productsHeading || (isGrocery ? '🥦 Fresh Products' : 'Featured Products')}
          </h2>
          <span style={{ fontFamily: t.fontBody, fontSize: 12, color: t.accent, fontWeight: 600, whiteSpace: 'nowrap', marginLeft: 8 }}>
            {displayProducts.filter(Boolean).length} items
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: isMobile ? 10 : 16 }}>
          {displayProducts.map((p, i) => (
            <div
              key={i}
              style={{ background: t.cardBg, border: '1px solid ' + t.cardBorder, borderRadius: t.layout === 'street' ? 8 : 10, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,0,0,0.07)', transition: 'box-shadow 0.2s, transform 0.2s', position: 'relative', cursor: onProductClick && p ? 'pointer' : 'default' }}
              onClick={() => onProductClick && p && onProductClick(p)}
              onMouseEnter={e => { if (isPublic && !isMobile) { e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.14)'; e.currentTarget.style.transform = 'translateY(-3px)'; } }}
              onMouseLeave={e => { if (isPublic && !isMobile) { e.currentTarget.style.boxShadow = '0 1px 6px rgba(0,0,0,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; } }}
            >
              {/* Product image */}
              <div style={{ position: 'relative', paddingTop: '85%', background: t.cardBorder + '55', overflow: 'hidden' }}>
                {p?.images?.[0]
                  ? <img src={p.images[0].url} alt={p.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s' }}
                      onMouseEnter={e => { if (isPublic && !isMobile) e.currentTarget.style.transform = 'scale(1.06)'; }}
                      onMouseLeave={e => { if (isPublic && !isMobile) e.currentTarget.style.transform = 'scale(1)'; }}
                    />
                  : (
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: isMobile ? 22 : 28 }}>
                      {['👗','👟','💍','🎧','🧴','🍵','📷','🛍️','🎨','📚','⌚','🌸'][i % 12]}
                    </div>
                  )
                }
                {t.layout === 'street' && (
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: [t.accent, t.accent2, '#b5e853'][i % 3], boxShadow: '0 0 10px ' + [t.accent, t.accent2, '#b5e853'][i % 3] }} />
                )}
                {isPublic && p && p.stock === 0 && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ background: '#fff', color: '#222', fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 8 }}>Out of Stock</span>
                  </div>
                )}
                {(isPublic ? (p && p.compareAtPrice > p.price) : i % 3 === 0) && (
                  <div style={{ position: 'absolute', top: 7, left: 7, background: t.badge, color: t.badgeText, fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 0.5, boxShadow: t.layout === 'neon' ? '0 0 8px ' + t.accent : 'none' }}>
                    {isPublic && p && p.compareAtPrice > p.price
                      ? Math.round((1 - p.price / p.compareAtPrice) * 100) + '% OFF'
                      : (t.layout === 'sale' ? '30% OFF' : t.layout === 'grocery' ? 'Fresh' : 'New')}
                  </div>
                )}
              </div>

              {/* Product info */}
              <div style={{ padding: isMobile ? '8px 10px' : '12px 14px' }}>
                {p?.category && isPublic && (
                  <p style={{ fontFamily: t.fontBody, fontSize: 10, fontWeight: 700, color: t.accent, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>{p.category}</p>
                )}
                <div style={{ fontFamily: t.fontBody, fontSize: isMobile ? 12 : 13, fontWeight: 600, color: t.text, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {p ? p.name : 'Product ' + (i + 1)}
                </div>
                {!isPublic && t.layout !== 'corporate' && (
                  <div style={{ display: 'flex', gap: 2, marginBottom: 5 }}>
                    {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 10, color: '#fbbf24' }}>★</span>)}
                    <span style={{ fontSize: 10, color: t.oldPriceColor, marginLeft: 2 }}>(24)</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 }}>
                  <div>
                    <span style={{ fontFamily: t.fontBody, fontSize: isMobile ? 14 : 15, fontWeight: 800, color: t.priceColor, textShadow: t.layout === 'street' ? '0 0 8px ' + t.accent + '66' : 'none' }}>
                      ₹{p ? (p.price?.toLocaleString('en-IN') || '—') : (999 + i * 200)}
                    </span>
                    {(isPublic ? (p && p.compareAtPrice > p.price) : i % 2 === 0) && (
                      <span style={{ fontFamily: t.fontBody, fontSize: 11, color: t.oldPriceColor, textDecoration: 'line-through', marginLeft: 4 }}>
                        ₹{p?.compareAtPrice ? p.compareAtPrice.toLocaleString('en-IN') : Math.round((p?.price || 999) * 1.3).toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                  {isPublic && onProductClick && p ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
                      {onAddToCart && p.stock !== 0 && (
                        <div
                          style={{ width: 30, height: 30, background: '#DC2626', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(220,38,38,0.4)', flexShrink: 0 }}
                          onClick={e => { e.stopPropagation(); onAddToCart(p); }}
                          title="Add to cart"
                        >
                          <span style={{ color: '#fff', fontSize: 18, lineHeight: 1 }}>+</span>
                        </div>
                      )}
                      <div
                        style={{ height: 30, padding: '0 12px', background: t.btnBg, borderRadius: t.layout === 'street' ? 6 : 20, display: 'flex', alignItems: 'center', fontSize: 11, fontWeight: 700, color: t.btnText, cursor: 'pointer', boxShadow: t.layout === 'street' ? '0 0 10px ' + t.accent + '55' : '0 2px 8px rgba(0,0,0,0.18)', flexShrink: 0 }}
                        onClick={e => { e.stopPropagation(); onProductClick(p); }}
                      >
                        View
                      </div>
                    </div>
                  ) : (
                    <div style={{ width: 28, height: 28, background: t.btnBg, borderRadius: t.layout === 'street' ? 6 : '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 6px rgba(0,0,0,0.18)', cursor: 'pointer', flexShrink: 0 }}>
                      <span style={{ fontSize: 14, color: t.btnText }}>+</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  /* ── FOOTER ──────────────────────────────────────────────── */
  const renderFooter = () => {
    const isDark = t.bg === '#0a0a0a' || t.bg === '#0f0225' || t.bg === '#0a1628' || t.bg === '#0f172a' || t.bg === '#18181b' || t.bg === '#1a0e00';
    const footerBg = isDark ? 'rgba(0,0,0,0.5)' : t.headerBg === '#ffffff' || t.headerBg === t.bg ? '#f3f4f6' : t.headerBg;
    const footerText = isDark ? 'rgba(255,255,255,0.85)' : t.text;
    const footerSub  = isDark ? 'rgba(255,255,255,0.45)' : t.oldPriceColor;

    return (
      <div
        className={G + sectionCls('footer')}
        onClick={() => !isPublic && onSectionClick && onSectionClick('footer')}
        style={{ background: footerBg, padding: isMobile ? `28px ${px} 20px` : `40px ${px} 28px`, borderTop: '1px solid ' + t.cardBorder }}
      >
        <SectionLabel label="Footer" />

        {/* Main footer content */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : isTablet ? '1fr 1fr' : '2fr 1fr 1fr 1fr', gap: isMobile ? 24 : 32, marginBottom: 28 }}>

          {/* Brand column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              {logoUrl
                ? <img src={logoUrl} alt={storeName} style={{ height: 40, width: 40, borderRadius: 10, objectFit: 'cover' }} />
                : <div style={{ height: 40, width: 40, borderRadius: 10, background: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', color: t.btnText, fontFamily: t.fontHeading, fontWeight: 800, fontSize: 18 }}>{storeName[0]}</div>
              }
              <div>
                <div style={{ fontFamily: t.fontHeading, fontSize: 16, fontWeight: 800, color: footerText }}>{storeName}</div>
                <div style={{ fontFamily: t.fontBody, fontSize: 11, color: footerSub }}>{catalog.name}</div>
              </div>
            </div>
            <div style={{ fontFamily: t.fontBody, fontSize: 13, color: footerSub, lineHeight: 1.65, maxWidth: 240 }}>{tx.footerTagline}</div>

            {/* Contact info */}
            <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
              {phone && (
                <a href={`tel:${phone}`} style={{ fontFamily: t.fontBody, fontSize: 13, color: t.accent, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14 }}>📞</span> {phone}
                </a>
              )}
              {whatsapp && (
                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: t.fontBody, fontSize: 13, color: '#DC2626', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14 }}>💬</span> Chat on WhatsApp
                </a>
              )}
              {email && (
                <a href={`mailto:${email}`} style={{ fontFamily: t.fontBody, fontSize: 13, color: footerSub, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14 }}>✉️</span> {email}
                </a>
              )}
              {instagram && (
                <a href={`https://instagram.com/${instagram.replace(/^@/, '')}`} target="_blank" rel="noopener noreferrer" style={{ fontFamily: t.fontBody, fontSize: 13, color: '#E1306C', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14 }}>📸</span> Instagram
                </a>
              )}
            </div>
          </div>

          {/* Links columns — hidden on mobile unless expanded */}
          {!isMobile && (
            <>
              {[
                ['Catalog', [
                  { label: 'Browse Products', action: () => scrollToSection('catalog-products') },
                  { label: 'New Arrivals', action: () => scrollToSection('catalog-products') },
                  { label: 'Best Sellers', action: () => scrollToSection('catalog-products') },
                  { label: 'Offers', action: () => scrollToSection('catalog-products') },
                ]],
                ['Support', [
                  { label: 'Contact Us', action: () => whatsapp ? window.open(`https://wa.me/${whatsapp}`, '_blank') : phone ? window.open(`tel:${phone}`) : null },
                  { label: 'Order Enquiry', action: () => whatsapp ? window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent('Hi, I have an order enquiry for ' + catalog.name)}`, '_blank') : null },
                  { label: 'Returns', action: () => whatsapp ? window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent('Hi, I have a return request for ' + catalog.name)}`, '_blank') : null },
                  { label: 'FAQs', action: () => whatsapp ? window.open(`https://wa.me/${whatsapp}`, '_blank') : null },
                ]],
              ].map(([heading, links]) => (
                <div key={heading}>
                  <div style={{ fontFamily: t.fontBody, fontSize: 11, fontWeight: 700, color: t.accent, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.8 }}>{heading}</div>
                  {links.map(({ label, action }) => (
                    <div key={label} onClick={action}
                      style={{ fontFamily: t.fontBody, fontSize: 13, color: footerSub, marginBottom: 10, cursor: 'pointer', lineHeight: 1.4, display: 'flex', alignItems: 'center', gap: 4, transition: 'color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.color = footerText}
                      onMouseLeave={e => e.currentTarget.style.color = footerSub}>
                      {label}
                    </div>
                  ))}
                </div>
              ))}

              {/* Share / Social column */}
              <div>
                <div style={{ fontFamily: t.fontBody, fontSize: 11, fontWeight: 700, color: t.accent, marginBottom: 14, textTransform: 'uppercase', letterSpacing: 0.8 }}>Share</div>
                {isPublic && (
                  <a href={`https://wa.me/?text=${encodeURIComponent(catalog.name + ' — Browse our catalog: ' + window.location.href)}`} target="_blank" rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 8, height: 36, padding: '0 14px', background: '#DC2626', borderRadius: 8, marginBottom: 12, fontFamily: t.fontBody, fontSize: 12, fontWeight: 700, color: '#fff', textDecoration: 'none', width: 'fit-content', boxShadow: '0 2px 8px rgba(220,38,38,0.25)' }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 14, height: 14 }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.558 4.112 1.531 5.836L.057 23.737a.5.5 0 00.614.629l6.083-1.595A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.896 0-3.67-.513-5.192-1.41l-.373-.22-3.867 1.014 1.032-3.764-.242-.389A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                    Share on WhatsApp
                  </a>
                )}
                <div onClick={() => navigator.clipboard?.writeText(window.location.href).then(() => {})}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, height: 34, padding: '0 14px', background: footerText + '11', border: '1px solid ' + t.cardBorder, borderRadius: 8, marginBottom: 10, fontFamily: t.fontBody, fontSize: 12, fontWeight: 600, color: footerText, cursor: 'pointer', width: 'fit-content' }}>
                  🔗 Copy Link
                </div>
                <div style={{ fontFamily: t.fontBody, fontSize: 12, color: footerSub, marginTop: 4 }}>
                  {displayProducts.filter(Boolean).length} product{displayProducts.filter(Boolean).length !== 1 ? 's' : ''} available
                </div>
              </div>
            </>
          )}

          {/* Mobile: compact contact row */}
          {isMobile && (whatsapp || phone) && (
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {whatsapp && (
                <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer"
                  style={{ flex: 1, minWidth: 130, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#DC2626', borderRadius: 10, fontFamily: t.fontBody, fontSize: 13, fontWeight: 700, color: '#fff', textDecoration: 'none' }}>
                  💬 WhatsApp
                </a>
              )}
              {phone && (
                <a href={`tel:${phone}`}
                  style={{ flex: 1, minWidth: 130, height: 42, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: t.accent, borderRadius: 10, fontFamily: t.fontBody, fontSize: 13, fontWeight: 700, color: t.btnText, textDecoration: 'none' }}>
                  📞 Call Us
                </a>
              )}
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div style={{ paddingTop: 16, borderTop: '1px solid ' + t.cardBorder, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontFamily: t.fontBody, fontSize: 12, color: footerSub }}>
            © {new Date().getFullYear()} {storeName} · All rights reserved
          </div>
          <div style={{ fontFamily: t.fontBody, fontSize: 11, color: footerSub }}>
            Powered by <span style={{ color: t.accent, fontWeight: 600 }}>CatalogApp</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ background: t.bg, minHeight: '100%', fontFamily: t.fontBody }}>
      {renderAnnouncement()}
      {renderHeader()}
      {renderHero()}
      {renderProductGrid()}
      {renderFooter()}
    </div>
  );
}
