import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Layout, Type, Palette, LayoutGrid, Eye } from 'lucide-react';
import { catalogService } from '../services/catalogService';
import toast from 'react-hot-toast';
import Loader from '../components/common/Loader';
import BlockCanvas from '../components/catalog/blocks/BlockCanvas';
import ProductSelectionModal from '../components/catalog/ProductSelectionModal';

const fonts = ['Inter', 'Roboto', 'Playfair Display', 'Merriweather', 'Open Sans', 'Montserrat', 'Poppins'];
const templates = ['grid', 'list', 'magazine', 'minimal', 'luxury', 'modern', 'classic', 'modern-blocks'];

export default function ThemeEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [catalog, setCatalog] = useState(null);
  const [saving, setSaving] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const response = await catalogService.getCatalog(id);
        const fetchedCatalog = response.data || response;
        if (!fetchedCatalog.design) fetchedCatalog.design = {};
        setCatalog(fetchedCatalog);
      } catch (err) {
        toast.error('Failed to load catalog');
      }
    };
    fetchCatalog();
  }, [id]);

  useEffect(() => {
    if (!catalog || !iframeRef.current) return;
    // Send message to internal iframe preview
    iframeRef.current.contentWindow.postMessage({
      type: 'UPDATE_PREVIEW',
      payload: catalog
    }, '*');
  }, [catalog]);

  const handleChange = (field, value, isDesign = true) => {
    setCatalog(prev => {
      if (isDesign) {
        return { ...prev, design: { ...prev.design, [field]: value } };
      } else {
         return { ...prev, [field]: value };
      }
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await catalogService.updateCatalog(id, {
        design: catalog.design, template: catalog.template, blocks: catalog.blocks
      });
      toast.success('Theme settings saved!');
    } catch (err) {
      toast.error('Failed to save theme settings');
    } finally {
      setSaving(false);
    }
  };

  if (!catalog) return <div className="h-screen flex items-center justify-center bg-gray-50"><Loader /></div>;

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans fixed inset-0 z-[100]">
      {/* Left Sidebar - Shopify Style Editor */}
      <div className="w-[320px] bg-[#f4f6f8] dark:bg-[#1f1f1f] border-r border-[#dfe3e8] dark:border-[#333] flex flex-col shadow-sm z-10 flex-shrink-0 relative h-full font-sans">
        <div className="px-5 py-4 border-b border-[#dfe3e8] dark:border-[#333] bg-white dark:bg-[#111] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(`/dashboard/catalogs`)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-gray-800 tracking-tight">Theme Editor</h1>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-[#008060] text-white text-sm font-semibold rounded hover:bg-[#006e52] disabled:opacity-50 transition-colors flex items-center gap-1.5 shadow-sm"
          >
            {saving ? <Loader className="w-4 h-4 text-white" /> : 'Save'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto w-full p-4 space-y-4 pb-20 bg-[#f4f6f8] dark:bg-[#1a1a1a]">

          {/* New Shopify Style Product Assignment Section */}
          <section className="bg-white dark:bg-[#212121] rounded-xl p-5 shadow-sm border border-gray-200 dark:border-[#333]">
            <div className="flex items-center gap-2 mb-2 text-gray-800 dark:text-gray-100">
              <LayoutGrid className="w-4 h-4 text-[#008060] dark:text-[#00a07a]" />
              <h2 className="text-sm font-semibold tracking-wide">Products</h2>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 leading-relaxed">
              Link the products you want to feature across the grid blocks in this theme.
            </p>
            <button 
              onClick={() => setIsProductModalOpen(true)}
              className="w-full py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 rounded font-semibold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors shadow-sm"
            >
              Manage Products
            </button>
          </section>
          {/* Section: Layout */}
          <section className="bg-white dark:bg-[#212121] rounded-xl p-5 shadow-sm border border-gray-200 dark:border-[#333]">
            <div className="flex items-center gap-2 mb-4 text-gray-800 dark:text-gray-100">
              <Layout className="w-4 h-4 text-gray-500" />
              <h2 className="text-sm font-semibold tracking-wide">Layout Style</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-2">Theme Template</label>
                <select 
                  className="w-full text-sm border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:border-transparent transition-all px-3 py-2 cursor-pointer outline-none"
                  value={catalog.template || 'grid'}
                  onChange={(e) => handleChange('template', e.target.value, false)}
                >
                  {templates.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
            </div>
          </section>

          {/* Section: Colors */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-gray-800">
              <Palette className="w-4 h-4 text-gray-500" />
              <h2 className="text-sm font-semibold tracking-wide">Colors</h2>
            </div>
            
            <div className="space-y-4">
              {[
                { label: 'Background Color', key: 'backgroundColor', default: '#ffffff' },
                { label: 'Text Color', key: 'textColor', default: '#000000' },
                { label: 'Accent / Brand Color', key: 'accentColor', default: '#3B82F6' },
              ].map(color => (
                <div key={color.key} className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-600 cursor-pointer" htmlFor={color.key}>{color.label}</label>
                  <label 
                    className="w-8 h-8 rounded-full border border-gray-200 shadow-sm overflow-hidden cursor-pointer flex-shrink-0"
                    style={{ backgroundColor: catalog.design[color.key] || color.default }}
                  >
                    <input 
                      id={color.key}
                      type="color" 
                      className="opacity-0 w-0 h-0"
                      value={catalog.design[color.key] || color.default}
                      onChange={(e) => handleChange(color.key, e.target.value)}
                    />
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* Section: Typography */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-gray-800">
              <Type className="w-4 h-4 text-gray-500" />
              <h2 className="text-sm font-semibold tracking-wide">Typography</h2>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-2">Base Font Family</label>
              <select 
                className="w-full text-sm border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:border-transparent transition-all px-3 py-2 cursor-pointer outline-none"
                value={catalog.design.fontFamily || 'Inter'}
                onChange={(e) => handleChange('fontFamily', e.target.value)}
              >
                {fonts.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </section>

          {/* Section: Product Grid */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-gray-800">
              <LayoutGrid className="w-4 h-4 text-gray-500" />
              <h2 className="text-sm font-semibold tracking-wide">Products View</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-600">Show Prices</label>
                <div className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors ${catalog.design.showPrices !== false ? 'bg-red-500' : 'bg-gray-300'}`}
                     onClick={() => handleChange('showPrices', catalog.design.showPrices === false)}>
                  <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${catalog.design.showPrices !== false ? 'translate-x-5' : ''}`} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-600">Show Stock Status</label>
                <div className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors ${catalog.design.showStock === true ? 'bg-red-500' : 'bg-gray-300'}`}
                     onClick={() => handleChange('showStock', !catalog.design.showStock)}>
                  <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${catalog.design.showStock === true ? 'translate-x-5' : ''}`} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-gray-600">Show Descriptions</label>
                <div className={`relative w-11 h-6 rounded-full cursor-pointer transition-colors ${catalog.design.showDescription !== false ? 'bg-red-500' : 'bg-gray-300'}`}
                     onClick={() => handleChange('showDescription', catalog.design.showDescription === false)}>
                  <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${catalog.design.showDescription !== false ? 'translate-x-5' : ''}`} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 flex flex-col bg-[#f4f6f8] h-full">
        <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-center gap-6 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-lg">
            <Eye className="w-4 h-4 text-gray-500" />
            <span className="text-xs font-semibold text-gray-600">Live Preview</span>
          </div>
          <p className="text-xs text-gray-400">Updates happen in real-time. Changes are isolated to this window until saved.</p>
        </div>
        <div className="flex-1 w-full p-4 overflow-y-auto hidden-scrollbar flex justify-center pb-8">
          <div className="w-full max-w-[1200px] h-max min-h-full bg-white rounded-xl shadow-xl overflow-visible border border-gray-200">
            {catalog ? (
              catalog.template === 'modern-blocks' ? (
                <BlockCanvas catalogDesign={catalog.design} 
                  blocks={catalog.blocks || []} 
                  onChange={(newBlocks) => setCatalog({ ...catalog, blocks: newBlocks })} 
                  isEditor={true} 
                  products={catalog.products?.map(p => p.product) || []}
                />
              ) : (
                <iframe
                  ref={iframeRef}
                  title="Theme Preview"
                  src={`/catalog/${catalog.sharing.shareableLink}?preview=true`}
                  className="w-full h-[800px] border-none"
                  onLoad={() => {
                    if (iframeRef.current && catalog) {
                      iframeRef.current.contentWindow.postMessage({
                        type: 'UPDATE_PREVIEW',
                        payload: catalog
                      }, '*');
                    }
                  }}
                />
              )
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center min-h-[400px]">
                <Loader className="w-8 h-8 text-gray-400 mb-2" />
                <p className="text-gray-500 font-medium">Booting preview...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ProductSelectionModal 
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        catalogProducts={catalog.products}
        onSave={async (selectedIds) => {
          try {
            const newProducts = selectedIds.map(id => ({ product: id }));
            const res = await catalogService.updateCatalog(id, { products: newProducts });
            setCatalog(prev => ({ ...prev, products: res.data?.products || newProducts }));
            toast.success('Products updated successfully');
            const fullCat = await catalogService.getCatalog(id);
            setCatalog(fullCat.data || fullCat);
          } catch (e) {
            toast.error('Failed to update products');
          }
        }}
      />
    </div>
  );
}
