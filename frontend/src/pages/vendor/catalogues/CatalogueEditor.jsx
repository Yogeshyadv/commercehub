import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Save, Eye, EyeOff, Settings, Layers, Package,
  Loader2, ChevronRight, ChevronDown, Pencil, Check, X,
  Palette, Type, Grid, AlignLeft, Star, Tag, Share2, ExternalLink,
  Plus, Trash2, GripVertical, Image, Globe, LayoutTemplate, Radio, CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { catalogService } from '../../../services/catalogService';
import { productService } from '../../../services/productService';
import { CatalogCanvas, getTheme } from '../../../components/catalog/CatalogThemeCanvas';

function SidebarSection({ title, icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
      <button
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold text-gray-800 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
        onClick={() => setOpen(o => !o)}
      >
        <span className="flex items-center gap-2">{icon}{title}</span>
        {open ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="p-4 space-y-3">{children}</div>}
    </div>
  );
}

function ColorRow({ label, value, onChange }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-gray-600 flex-1">{label}</span>
      <div className="flex items-center gap-2">
        <div
          className="w-6 h-6 rounded border border-gray-300 cursor-pointer shadow-inner"
          style={{ background: value }}
          onClick={() => document.getElementById('cp-' + label)?.click()}
        />
        <input
          type="color"
          id={'cp-' + label}
          value={value || '#ffffff'}
          onChange={e => onChange(e.target.value)}
          className="sr-only"
        />
        <input
          type="text"
          value={value || ''}
          onChange={e => onChange(e.target.value)}
          className="w-20 text-xs border border-gray-200 rounded px-2 py-1 font-mono focus:outline-none focus:ring-1 focus:ring-[#008060]"
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------
   MAIN EDITOR
------------------------------------------------------------- */
export default function CatalogueEditor() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [catalog, setCatalog] = useState(null);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [activeSection, setActiveSection] = useState(null);
  const [sidebarTab, setSidebarTab] = useState('sections');
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState('');
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [productSearch, setProductSearch] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [theme, setTheme] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [catalogStatus, setCatalogStatus] = useState('draft');
  const [publishSaving, setPublishSaving] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const coverInputRef = useRef(null);
  const [texts, setTexts] = useState({
    announcement: '?? Free shipping on orders above ?999 � Use code WELCOME10 for 10% off',
    heroBadge: 'New Collection',
    heroHeading: '',
    heroSubheading: 'Browse our curated collection of premium products, handpicked just for you.',
    heroPrimaryBtn: 'Browse Collection',
    heroSecondaryBtn: 'Learn More',
    headerCta: 'Shop Now',
    productsHeading: 'Featured Products',
    footerTagline: 'Curated products, delivered with care.',
    whatsappPhone: '',
  });
  const nameRef = useRef(null);

  const handleCoverUpload = async (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    setCoverUploading(true);
    try {
      const res = await catalogService.uploadCoverImage(id, file);
      // res.data = { public_id, url }
      const coverData = res?.data || res;
      setCatalog(prev => ({ ...prev, coverImage: coverData }));
      toast.success('Cover image updated!');
    } catch (err) {
      toast.error('Failed to upload cover image');
    } finally {
      setCoverUploading(false);
    }
  };

  /* Load catalog + products */
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [catRes, prodsRes] = await Promise.all([
          catalogService.getCatalog(id),
          productService.getProducts({ limit: 100 }),
        ]);
        const cat = catRes.data;
        setCatalog(cat);
        setTempName(cat.name);
        setCatalogStatus(cat.status || 'draft');

        const tTheme = getTheme(cat.template);
        // Override with saved design colors if present
        const savedDesign = cat.design || {};
        setTheme({
          ...tTheme,
          bg: savedDesign.backgroundColor || tTheme.bg,
          text: savedDesign.textColor || tTheme.text,
          accent: savedDesign.accentColor || tTheme.accent,
          fontBody: savedDesign.fontFamily || tTheme.fontBody,
        });
        const saved = savedDesign.customTexts || {};
        setTexts({
          announcement: saved.announcement || '?? Free shipping on orders above ?999 � Use code WELCOME10 for 10% off',
          heroBadge: saved.heroBadge || (cat.categories && cat.categories[0] ? cat.categories[0] : 'New Collection'),
          heroHeading: saved.heroHeading || cat.name || '',
          heroSubheading: saved.heroSubheading || 'Browse our curated collection of premium products, handpicked just for you.',
          heroPrimaryBtn: saved.heroPrimaryBtn || 'Browse Collection',
          heroSecondaryBtn: saved.heroSecondaryBtn || 'Learn More',
          headerCta: saved.headerCta || 'Shop Now',
          productsHeading: saved.productsHeading || 'Featured Products',
          footerTagline: saved.footerTagline || 'Curated products, delivered with care.',
          whatsappPhone: saved.whatsappPhone || '',
        });

        const allP = (prodsRes.data || []);
        setAllProducts(allP);

        // Resolve product objects
        const assignedIds = (cat.products || []).map(ep => typeof ep.product === 'object' ? ep.product._id : ep.product);
        setSelectedProductIds(assignedIds);
        const assigned = allP.filter(p => assignedIds.includes(p._id));
        setProducts(assigned);
      } catch (e) {
        toast.error('Failed to load catalogue.');
      } finally {
        setLoading(false);
      }
    };
    if (id) load();
  }, [id]);

  /* Save */
  const handleSave = useCallback(async () => {
    if (!catalog || !theme) return;
    setSaving(true);
    try {
      const payload = {
        name: catalog.name,
        description: catalog.description,
        status: catalogStatus,
        design: {
          backgroundColor: theme.bg,
          textColor: theme.text,
          accentColor: theme.accent,
          fontFamily: theme.fontBody,
          showPrices: true,
          customTexts: texts,
        },
      };
      // Run design save + product sync in parallel
      const [updated] = await Promise.all([
        catalogService.updateCatalog(id, payload),
        catalogService.syncProducts(id, selectedProductIds),
      ]);
      if (updated?.data) setCatalog(updated.data);
      setDirty(false);
      toast.success('Saved successfully!');
    } catch (e) {
      toast.error('Failed to save.');
    } finally {
      setSaving(false);
    }
  }, [catalog, theme, id, selectedProductIds, catalogStatus, texts]);

  /* Toggle publish status immediately */
  const handleTogglePublish = useCallback(async () => {
    if (!catalog) return;
    const newStatus = catalogStatus === 'published' ? 'draft' : 'published';
    setPublishSaving(true);
    try {
      await catalogService.updateCatalog(id, { status: newStatus });
      setCatalogStatus(newStatus);
      toast.success(newStatus === 'published' ? '?? Catalog is now live!' : 'Catalog set to draft.');
    } catch {
      toast.error('Failed to update status.');
    } finally {
      setPublishSaving(false);
    }
  }, [catalog, id, catalogStatus]);

  const updateTheme = (key, value) => {
    setTheme(prev => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const updateCatalog = (key, value) => {
    setCatalog(prev => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const updateText = (key, value) => {
    setTexts(prev => ({ ...prev, [key]: value }));
    setDirty(true);
  };

  const commitName = () => {
    updateCatalog('name', tempName);
    setEditingName(false);
  };

  const toggleProduct = (productId) => {
    setSelectedProductIds(prev => {
      const next = prev.includes(productId) ? prev.filter(pid => pid !== productId) : [...prev, productId];
      setProducts(allProducts.filter(p => next.includes(p._id)));
      setDirty(true);
      return next;
    });
  };

  const filteredAllProducts = allProducts.filter(p =>
    !productSearch || p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#f4f6f8] flex items-center justify-center z-[100]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-[#008060]" />
          <span className="text-gray-500 font-medium">Loading editor...</span>
        </div>
      </div>
    );
  }

  if (!catalog || !theme) return null;

  const templateLabel = theme.name || catalog.template;

  return (
    <div className="flex h-screen bg-[#eceff1] overflow-hidden fixed inset-0 z-[100]" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* ------------------ SIDEBAR ------------------*/}
      <aside className="w-[320px] bg-white border-r border-gray-200 flex flex-col shadow-sm z-10 flex-shrink-0">

        {/* Sidebar Top Bar */}
        <div className="h-14 px-4 border-b border-gray-200 flex items-center justify-between bg-white flex-shrink-0">
          <button
            className="flex items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors cursor-pointer"
            onClick={() => navigate('/dashboard/catalogs')}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Back</span>
          </button>

          {/* Template badge */}
          <div className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1">
            <LayoutTemplate className="w-3 h-3 text-[#008060]" />
            <span className="text-[11px] font-semibold text-gray-600">{templateLabel}</span>
          </div>
        </div>

        {/* Catalog name */}
        <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
          {editingName ? (
            <div className="flex items-center gap-2">
              <input
                ref={nameRef}
                autoFocus
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') commitName(); if (e.key === 'Escape') setEditingName(false); }}
                className="flex-1 text-sm font-semibold border border-[#008060] rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#008060]/20"
              />
              <button onClick={commitName} className="p-1.5 text-[#008060] hover:bg-red-50 rounded-lg cursor-pointer"><Check className="w-4 h-4" /></button>
              <button onClick={() => setEditingName(false)} className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-lg cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
          ) : (
            <button
              className="flex items-center gap-2 w-full group cursor-pointer"
              onClick={() => setEditingName(true)}
            >
              <span className="text-sm font-semibold text-gray-800 flex-1 text-left truncate">{catalog.name}</span>
              <Pencil className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}
          {dirty && (
            <div className="flex items-center gap-1 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              <span className="text-[10px] text-amber-600 font-medium">Unsaved changes</span>
            </div>
          )}
          {!dirty && (
            <div className="flex items-center gap-1 mt-1">
              <div className={`w-1.5 h-1.5 rounded-full ${catalogStatus === 'published' ? 'bg-red-500' : 'bg-gray-400'}`} />
              <span className={`text-[10px] font-medium ${catalogStatus === 'published' ? 'text-red-600' : 'text-gray-400'}`}>
                {catalogStatus === 'published' ? 'Live' : 'Draft'}
              </span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 flex-shrink-0">
          {[['sections', <Layers className="w-3.5 h-3.5" />, 'Sections'], ['theme', <Palette className="w-3.5 h-3.5" />, 'Theme'], ['text', <Type className="w-3.5 h-3.5" />, 'Text'], ['products', <Package className="w-3.5 h-3.5" />, 'Products']].map(([key, icon, label]) => (
            <button
              key={key}
              onClick={() => setSidebarTab(key)}
              className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 text-[11px] font-bold uppercase tracking-wide cursor-pointer transition-colors ${sidebarTab === key ? 'text-[#008060] border-b-2 border-[#008060]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              {icon}{label}
            </button>
          ))}
        </div>

        {/* Sidebar Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">

          {/* SECTIONS TAB */}
          {sidebarTab === 'sections' && (
            <div className="space-y-2">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-1 mb-2">Click a section to select it on canvas</p>
              {[
                { id: 'announcement', icon: <Tag className="w-4 h-4" />, label: 'Announcement Bar', desc: 'Top promo banner' },
                { id: 'header', icon: <AlignLeft className="w-4 h-4" />, label: 'Header & Nav', desc: 'Logo, nav links, CTA' },
                { id: 'hero', icon: <Image className="w-4 h-4" />, label: 'Hero Banner', desc: 'Main featured section' },
                { id: 'products', icon: <Grid className="w-4 h-4" />, label: 'Product Grid', desc: theme.gridCols + ' columns � ' + products.length + ' products' },
                { id: 'footer', icon: <Globe className="w-4 h-4" />, label: 'Footer', desc: 'Links, social, branding' },
              ].map(sec => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(activeSection === sec.id ? null : sec.id)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border cursor-pointer text-left transition-all ${activeSection === sec.id ? 'border-[#008060] bg-[#008060]/5 shadow-sm' : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'}`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${activeSection === sec.id ? 'bg-[#008060] text-white' : 'bg-gray-100 text-gray-500'}`}>
                    {sec.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-semibold ${activeSection === sec.id ? 'text-[#008060]' : 'text-gray-800'}`}>{sec.label}</div>
                    <div className="text-[11px] text-gray-400 truncate">{sec.desc}</div>
                  </div>
                  <ChevronRight className={`w-4 h-4 flex-shrink-0 transition-transform ${activeSection === sec.id ? 'rotate-90 text-[#008060]' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
          )}

          {/* THEME TAB */}
          {sidebarTab === 'theme' && (
            <div className="space-y-3">
              <SidebarSection title="Colors" icon={<Palette className="w-4 h-4 text-gray-400" />}>
                <ColorRow label="Background" value={theme.bg} onChange={v => updateTheme('bg', v)} />
                <ColorRow label="Text" value={theme.text} onChange={v => updateTheme('text', v)} />
                <ColorRow label="Accent" value={theme.accent} onChange={v => updateTheme('accent', v)} />
                <ColorRow label="Button BG" value={theme.btnBg} onChange={v => updateTheme('btnBg', v)} />
                <ColorRow label="Price" value={theme.priceColor} onChange={v => updateTheme('priceColor', v)} />
                <ColorRow label="Card BG" value={theme.cardBg} onChange={v => updateTheme('cardBg', v)} />
              </SidebarSection>

              <SidebarSection title="Typography" icon={<Type className="w-4 h-4 text-gray-400" />}>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 font-semibold">Heading Font</label>
                  <select
                    value={theme.fontHeading}
                    onChange={e => updateTheme('fontHeading', e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#008060]/20"
                  >
                    {['system-ui, sans-serif', 'Georgia, serif', "'Times New Roman', serif", "'Playfair Display', serif", "'Inter', system-ui", "'Montserrat', system-ui", 'monospace'].map(f => (
                      <option key={f} value={f}>{f.split(',')[0].replace(/'/g, '')}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 font-semibold">Body Font</label>
                  <select
                    value={theme.fontBody}
                    onChange={e => updateTheme('fontBody', e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#008060]/20"
                  >
                    {['system-ui, sans-serif', 'Georgia, serif', "'Inter', system-ui", "'Roboto', system-ui", 'monospace'].map(f => (
                      <option key={f} value={f}>{f.split(',')[0].replace(/'/g, '')}</option>
                    ))}
                  </select>
                </div>
              </SidebarSection>

              <SidebarSection title="Layout" icon={<Grid className="w-4 h-4 text-gray-400" />}>
                <div className="space-y-2">
                  <label className="text-xs text-gray-500 font-semibold">Product Columns</label>
                  <div className="flex gap-2">
                    {[2, 3, 4].map(n => (
                      <button
                        key={n}
                        onClick={() => updateTheme('gridCols', n)}
                        className={`flex-1 py-2 rounded-lg text-sm font-bold border cursor-pointer transition-all ${theme.gridCols === n ? 'bg-[#008060] text-white border-[#008060]' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              </SidebarSection>

              <SidebarSection title="Cover Image" icon={<Image className="w-4 h-4 text-gray-400" />} defaultOpen={false}>
                <div>
                  {catalog.coverImage?.url ? (
                    <div className="relative rounded-xl overflow-hidden border border-gray-200" style={{ height: 110 }}>
                      <img src={catalog.coverImage.url} alt="Cover" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 flex items-end gap-2 p-2">
                        <button
                          onClick={() => coverInputRef.current?.click()}
                          disabled={coverUploading}
                          className="flex-1 h-8 bg-white/90 hover:bg-white text-gray-800 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                        >
                          {coverUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : '??'} Change
                        </button>
                        <button
                          onClick={async () => {
                            try {
                              await catalogService.updateCatalog(id, { coverImage: null });
                              setCatalog(prev => ({ ...prev, coverImage: null }));
                              toast.success('Cover removed');
                            } catch { toast.error('Failed to remove cover'); }
                          }}
                          className="h-8 w-8 bg-red-500/80 hover:bg-red-600 text-white text-xs font-bold rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                        >
                          ?
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => !coverUploading && coverInputRef.current?.click()}
                      className="border-2 border-dashed border-gray-200 hover:border-[#008060] rounded-xl h-24 flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors group"
                    >
                      {coverUploading
                        ? <Loader2 className="w-5 h-5 animate-spin text-[#008060]" />
                        : <>
                          <span className="text-xl">???</span>
                          <span className="text-xs text-gray-400 group-hover:text-[#008060] font-medium transition-colors">Upload cover image</span>
                          <span className="text-[10px] text-gray-300">JPG, PNG, WEBP</span>
                        </>
                      }
                    </div>
                  )}
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={e => handleCoverUpload(e.target.files[0])}
                  />
                  <p className="text-[10px] text-gray-400 mt-2">Shows as the catalogue thumbnail on your dashboard.</p>
                </div>
              </SidebarSection>

              <SidebarSection title="Content" icon={<AlignLeft className="w-4 h-4 text-gray-400" />} defaultOpen={false}>
                <div>
                  <label className="text-xs text-gray-500 font-semibold block mb-1">Description</label>
                  <textarea
                    value={catalog.description || ''}
                    onChange={e => updateCatalog('description', e.target.value)}
                    rows={3}
                    className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#008060]/20 resize-none"
                    placeholder="Write a short description..."
                  />
                </div>
              </SidebarSection>

              <SidebarSection title="Sharing" icon={<Share2 className="w-4 h-4 text-gray-400" />} defaultOpen={false}>
                <div className="space-y-3">
                  {/* Status toggle */}
                  <div>
                    <label className="text-xs text-gray-500 font-semibold block mb-2">Catalog Status</label>
                    <div className="flex gap-2">
                      {['draft', 'published'].map(s => (
                        <button
                          key={s}
                          onClick={() => { setCatalogStatus(s); setDirty(true); }}
                          className={`flex-1 py-2 rounded-lg text-xs font-bold border cursor-pointer transition-all capitalize ${catalogStatus === s ? (s === 'published' ? 'bg-red-600 text-white border-red-600' : 'bg-amber-500 text-white border-amber-500') : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
                        >
                          {s === 'published' ? '?? Published' : '?? Draft'}
                        </button>
                      ))}
                    </div>
                    {catalogStatus === 'draft' && (
                      <p className="text-[10px] text-amber-600 mt-1.5">Draft catalogs are not visible to the public. Save then set to Published.</p>
                    )}
                  </div>
                  {catalog.sharing?.shareableLink && (
                    <>
                      <label className="text-xs text-gray-500 font-semibold">Public Link</label>
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                        <span className="text-xs text-gray-600 flex-1 truncate font-mono">
                          {window.location.origin + '/catalog/' + catalog.sharing.shareableLink}
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(window.location.origin + '/catalog/' + catalog.sharing.shareableLink);
                            toast.success('Link copied!');
                          }}
                          className="text-[#008060] text-xs font-bold flex-shrink-0 cursor-pointer hover:underline"
                        >
                          Copy
                        </button>
                      </div>
                    </>
                  )}
                  {/* WhatsApp Order Number */}
                  <div>
                    <label className="text-xs text-gray-500 font-semibold block mb-1">WhatsApp Order Number</label>
                    <input
                      type="tel"
                      value={texts.whatsappPhone}
                      onChange={e => updateText('whatsappPhone', e.target.value)}
                      placeholder="e.g. +919876543210"
                      className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-[#DC2626]/40 focus:border-[#DC2626]"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Customers will send their cart orders to this number via WhatsApp.</p>
                  </div>
                </div>
              </SidebarSection>
            </div>
          )}

          {/* PRODUCTS TAB */}
          {sidebarTab === 'products' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{selectedProductIds.length} selected</span>
                <button
                  onClick={() => setShowProductPicker(p => !p)}
                  className="flex items-center gap-1.5 bg-[#008060] text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-[#006e52] transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Products
                </button>
              </div>

              {/* Product picker dropdown */}
              {showProductPicker && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 space-y-2">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={productSearch}
                    onChange={e => setProductSearch(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#008060]"
                  />
                  <div className="max-h-48 overflow-y-auto space-y-1">
                    {filteredAllProducts.length === 0 ? (
                      <div className="text-xs text-gray-400 text-center py-3">No products found</div>
                    ) : filteredAllProducts.map(p => (
                      <label key={p._id} className="flex items-center gap-2.5 cursor-pointer p-2 rounded-lg hover:bg-white transition-colors">
                        <input
                          type="checkbox"
                          checked={selectedProductIds.includes(p._id)}
                          onChange={() => toggleProduct(p._id)}
                          className="accent-[#008060] w-4 h-4 cursor-pointer"
                        />
                        <div className="w-8 h-8 rounded bg-gray-200 flex-shrink-0 overflow-hidden">
                          {p.images && p.images[0]
                            ? <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center text-xs">??</div>
                          }
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-gray-800 truncate">{p.name}</div>
                          <div className="text-[10px] text-gray-400">?{p.price?.toLocaleString('en-IN')}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                  <button onClick={() => setShowProductPicker(false)} className="w-full text-xs text-center text-[#008060] font-semibold py-1 cursor-pointer hover:underline">
                    Done
                  </button>
                </div>
              )}

              {/* Selected products list */}
              {products.length > 0 ? (
                <div className="space-y-2">
                  {products.map(p => (
                    <div key={p._id} className="flex items-center gap-2.5 bg-white border border-gray-200 rounded-xl p-2.5">
                      <GripVertical className="w-4 h-4 text-gray-300 flex-shrink-0 cursor-grab" />
                      <div className="w-9 h-9 rounded-lg bg-gray-100 flex-shrink-0 overflow-hidden">
                        {p.images && p.images[0]
                          ? <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                          : <div className="w-full h-full flex items-center justify-center text-sm">??</div>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-gray-800 truncate">{p.name}</div>
                        <div className="text-[10px] text-gray-400">?{p.price?.toLocaleString('en-IN')}</div>
                      </div>
                      <button
                        onClick={() => toggleProduct(p._id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  <Package className="w-8 h-8 mx-auto mb-2 opacity-40" />
                  <p className="text-xs font-medium">No products added yet</p>
                  <p className="text-[10px] text-gray-300 mt-0.5">Click "Add Products" to get started</p>
                </div>
              )}
            </div>
          )}

          {/* TEXT TAB */}
          {sidebarTab === 'text' && (
            <div className="space-y-3">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest px-1 mb-2">Edit all text visible in your catalogue</p>

              <SidebarSection title="Announcement Bar" icon={<Tag className="w-4 h-4 text-gray-400" />}>
                <div>
                  <label className="text-xs text-gray-500 font-semibold block mb-1">Message</label>
                  <textarea
                    value={texts.announcement}
                    onChange={e => updateText('announcement', e.target.value)}
                    rows={2}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#008060]/20 resize-none"
                  />
                </div>
              </SidebarSection>

              <SidebarSection title="Header" icon={<AlignLeft className="w-4 h-4 text-gray-400" />}>
                <div>
                  <label className="text-xs text-gray-500 font-semibold block mb-1">CTA Button Label</label>
                  <input
                    type="text"
                    value={texts.headerCta}
                    onChange={e => updateText('headerCta', e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#008060]/20"
                  />
                </div>
              </SidebarSection>

              <SidebarSection title="Hero Banner" icon={<Image className="w-4 h-4 text-gray-400" />}>
                <div>
                  <label className="text-xs text-gray-500 font-semibold block mb-1">Badge Label</label>
                  <input
                    type="text"
                    value={texts.heroBadge}
                    onChange={e => updateText('heroBadge', e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#008060]/20"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-semibold block mb-1">Heading</label>
                  <input
                    type="text"
                    value={texts.heroHeading}
                    onChange={e => updateText('heroHeading', e.target.value)}
                    placeholder={catalog.name}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#008060]/20"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-semibold block mb-1">Subheading</label>
                  <textarea
                    value={texts.heroSubheading}
                    onChange={e => updateText('heroSubheading', e.target.value)}
                    rows={3}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#008060]/20 resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-gray-500 font-semibold block mb-1">Primary Button</label>
                    <input
                      type="text"
                      value={texts.heroPrimaryBtn}
                      onChange={e => updateText('heroPrimaryBtn', e.target.value)}
                      className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#008060]/20"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 font-semibold block mb-1">Secondary Button</label>
                    <input
                      type="text"
                      value={texts.heroSecondaryBtn}
                      onChange={e => updateText('heroSecondaryBtn', e.target.value)}
                      className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#008060]/20"
                    />
                  </div>
                </div>
              </SidebarSection>

              <SidebarSection title="Products Section" icon={<Grid className="w-4 h-4 text-gray-400" />}>
                <div>
                  <label className="text-xs text-gray-500 font-semibold block mb-1">Section Heading</label>
                  <input
                    type="text"
                    value={texts.productsHeading}
                    onChange={e => updateText('productsHeading', e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#008060]/20"
                  />
                </div>
              </SidebarSection>

              <SidebarSection title="Footer" icon={<Globe className="w-4 h-4 text-gray-400" />}>
                <div>
                  <label className="text-xs text-gray-500 font-semibold block mb-1">Tagline</label>
                  <textarea
                    value={texts.footerTagline}
                    onChange={e => updateText('footerTagline', e.target.value)}
                    rows={2}
                    className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#008060]/20 resize-none"
                  />
                </div>
              </SidebarSection>
            </div>
          )}
        </div>
      </aside>

      {/* ------------------ MAIN CANVAS ------------------*/}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top Toolbar */}
        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: theme.accent }}>
              <LayoutTemplate className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-gray-800">{catalog.name}</span>
              <span className="text-xs text-gray-400 ml-2">� {templateLabel}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Preview toggle */}
            <button
              onClick={() => setPreviewing(p => !p)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border cursor-pointer transition-all ${previewing ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'}`}
            >
              {previewing ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {previewing ? 'Exit Preview' : 'Preview'}
            </button>

            {/* Live link (only when published) */}
            {catalogStatus === 'published' && catalog.sharing?.shareableLink && (
              <a
                href={window.location.origin + '/catalog/' + catalog.sharing.shareableLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 bg-white text-gray-600 hover:border-gray-300 cursor-pointer transition-all"
              >
                <ExternalLink className="w-4 h-4" /> Live Link
              </a>
            )}

            {/* Publish / Unpublish toggle */}
            <button
              onClick={handleTogglePublish}
              disabled={publishSaving}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed ${
                catalogStatus === 'published'
                  ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              }`}
            >
              {publishSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : catalogStatus === 'published' ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Radio className="w-4 h-4" />
              )}
              {catalogStatus === 'published' ? 'Published' : 'Publish'}
            </button>

            {/* Save */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 bg-[#008060] hover:bg-[#006e52] text-white rounded-lg text-sm font-bold shadow cursor-pointer transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>

        {/* Canvas scroll area */}
        <div className="flex-1 overflow-auto bg-[#eceff1] py-8 px-12">
          {/* Device frame */}
          <div className="mx-auto max-w-5xl bg-white shadow-2xl rounded-xl overflow-hidden ring-1 ring-black/10">
            {/* Template canvas */}
            <CatalogCanvas
              catalog={catalog}
              theme={theme}
              products={products}
              onSectionClick={setActiveSection}
              activeSection={activeSection}
              texts={texts}
            />
          </div>

          {/* Bottom padding */}
          <div className="h-16" />
        </div>
      </div>
    </div>
  );
}
