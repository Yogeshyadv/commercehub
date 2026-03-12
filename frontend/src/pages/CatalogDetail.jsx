import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Plus, Search, Trash2, ExternalLink,
  Check, X, Image as ImageIcon, Package,
  Share2, Copy, Edit3, Save, Eye, Layout,
  Palette, Upload, AlertCircle, Layers, Wand2, Sparkles } from 'lucide-react';
import { aiService } from '../services/aiService';
import { catalogService } from '../services/catalogService';
import { productService } from '../services/productService';
import Loader from '../components/common/Loader';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useDebounce } from '../hooks/useDebounce';
import { formatCurrency } from '../utils/formatters';
import toast from 'react-hot-toast';

const templates = ['grid', 'list', 'magazine', 'minimal', 'luxury', 'modern', 'classic'];

const FIELD = ({ label, children, hint }) => (
  <div>
    <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5">{label}</label>
    {children}
    {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
  </div>
);

export default function CatalogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [catalog, setCatalog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingTheme, setIsGeneratingTheme] = useState(false);

  const handleGenerateTheme = async () => {
    if (!aiPrompt) {
      toast.error('Please describe your desired theme');
      return;
    }
    setIsGeneratingTheme(true);
    try {
      const { data } = await aiService.generateTheme(aiPrompt);
      if (data && data.design) {
        setEditForm(prev => ({
          ...prev,
          template: data.template || prev.template,
          design: {
            ...prev.design,
            backgroundColor: data.design.backgroundColor || prev.design.backgroundColor,
            textColor: data.design.textColor || prev.design.textColor,
            accentColor: data.design.accentColor || prev.design.accentColor,
            fontFamily: data.design.fontFamily || prev.design.fontFamily,
          }
        }));
        toast.success(data.message || 'Theme generated successfully!');
        setAiPrompt('');
      }
    } catch (error) {
      toast.error('Failed to generate theme');
    } finally {
      setIsGeneratingTheme(false);
    }
  };
  const [saving, setSaving] = useState(false);
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [uploadingCover, setUploadingCover] = useState(false);
  const coverRef = useRef(null);

  const [showPicker, setShowPicker] = useState(false);
  const [pickerProducts, setPickerProducts] = useState([]);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [addingProducts, setAddingProducts] = useState(false);
  const debouncedPickerSearch = useDebounce(pickerSearch, 400);

  const [removeTarget, setRemoveTarget] = useState(null);
  const [removing, setRemoving] = useState(false);

  const fetchCatalog = useCallback(async () => {
    try {
      setLoading(true);
      const res = await catalogService.getCatalog(id);
      const data = res.data;
      setCatalog(data);
      const normalized = (data.products || []).map(e => e.product || e).filter(Boolean);
      setProducts(normalized);
      setEditForm({
        name: data.name || '',
        description: data.description || '',
        template: data.template || 'grid',
        status: data.status || 'draft',
        isPublic: data.sharing?.isPublic !== false,
        tagsInput: (data.tags || []).join(', '),
        design: {
          backgroundColor: data.design?.backgroundColor || '#FFFFFF',
          textColor: data.design?.textColor || '#000000',
          accentColor: data.design?.accentColor || '#3B82F6',
          showPrices: data.design?.showPrices !== false,
          showDescription: data.design?.showDescription !== false,
          productsPerRow: data.design?.productsPerRow || 3,
        },
      });
    } catch {
      toast.error('Failed to load catalog');
      navigate('/dashboard/catalogs');
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => { fetchCatalog(); }, [fetchCatalog]);

  const fetchPickerProducts = useCallback(async () => {
    try {
      setPickerLoading(true);
      const params = { limit: 50 };
      if (debouncedPickerSearch) params.search = debouncedPickerSearch;
      const res = await productService.getProducts(params);
      const currentIds = new Set(products.map(p => p._id));
      setPickerProducts((res.data || []).filter(p => !currentIds.has(p._id)));
    } catch { toast.error('Failed to load products'); }
    finally { setPickerLoading(false); }
  }, [debouncedPickerSearch, products]);

  useEffect(() => { if (showPicker) fetchPickerProducts(); }, [showPicker, fetchPickerProducts]);

  const handleSave = async () => {
    if (!editForm.name?.trim()) { toast.error('Catalog name is required'); return; }
    setSaving(true);
    try {
      const payload = {
        ...editForm,
        tags: editForm.tagsInput ? editForm.tagsInput.split(',').map(t => t.trim()).filter(Boolean) : [],
        sharing: { isPublic: editForm.isPublic },
      };
      delete payload.tagsInput;
      await catalogService.updateCatalog(id, payload);

      // If a new cover file was selected, upload it as part of saving
      if (coverFile) {
        try {
          await catalogService.uploadCoverImage(id, coverFile);
          setCoverFile(null);
          setCoverPreview('');
        } catch (err) {
          const msg = err?.response?.data?.message || 'Cover saved partially: catalog updated but cover upload failed';
          toast.error(msg);
        }
      }

      toast.success('Changes saved!');
      setEditOpen(false);
      fetchCatalog();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to save'); }
    finally { setSaving(false); }
  };

  const handleCoverFile = (file) => {
    if (!file?.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
    setCoverFile(file);
    const reader = new FileReader();
    reader.onload = e => setCoverPreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleCoverUpload = async () => {
    if (!coverFile) return;
    setUploadingCover(true);
    try {
      await catalogService.uploadCoverImage(id, coverFile);
      toast.success('Cover image updated!');
      setCoverFile(null);
      setCoverPreview('');
      fetchCatalog();
    } catch { toast.error('Failed to upload cover image'); }
    finally { setUploadingCover(false); }
  };

  const handleAddProducts = async () => {
    if (selectedProductIds.length === 0) return;
    setAddingProducts(true);
    try {
      await catalogService.addProducts(id, selectedProductIds);
      toast.success(`${selectedProductIds.length} product${selectedProductIds.length > 1 ? 's' : ''} added`);
      setShowPicker(false);
      setSelectedProductIds([]);
      setPickerSearch('');
      fetchCatalog();
    } catch { toast.error('Failed to add products'); }
    finally { setAddingProducts(false); }
  };

  const handleRemoveProduct = async () => {
    if (!removeTarget) return;
    setRemoving(true);
    try {
      await catalogService.removeProduct(id, removeTarget._id);
      toast.success('Product removed');
      setRemoveTarget(null);
      fetchCatalog();
    } catch { toast.error('Failed to remove product'); }
    finally { setRemoving(false); }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/catalog/${catalog.sharing?.shareableLink}`);
    toast.success('Link copied!');
  };

  const ef = (k, v) => setEditForm(p => ({ ...p, [k]: v }));
  const ed = (k, v) => setEditForm(p => ({ ...p, design: { ...p.design, [k]: v } }));

  if (loading) return <Loader fullScreen text="Loading catalog..." />;

  if (!catalog) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
      <h2 className="text-xl font-bold text-gray-900 dark:text-white">Catalog not found</h2>
      <button onClick={() => navigate('/dashboard/catalogs')} className="mt-4 px-6 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold">Back to Catalogs</button>
    </div>
  );

  const shareUrl = `${window.location.origin}/catalog/${catalog.sharing?.shareableLink}`;
  const accentColor = editForm.design?.accentColor || '#3B82F6';

  return (
    <div className="animate-in fade-in duration-500 pb-24">

      {/* Hero Header */}
      <div className="relative -mx-6 -mt-6 mb-8 h-56 overflow-hidden" style={{marginLeft:'-1.5rem',marginRight:'-1.5rem'}}>
        {catalog.coverImage?.url ? (
          <img src={catalog.coverImage.url} alt={catalog.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${accentColor}40 0%, ${accentColor}15 100%)` }}>
            <Layers className="w-24 h-24 opacity-10" style={{ color: accentColor }} />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        <button onClick={() => navigate('/dashboard/catalogs')}
          className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-2 bg-black/50 backdrop-blur-md text-white rounded-xl text-sm font-semibold hover:bg-black/70 transition-colors border border-white/20">
          <ArrowLeft className="w-4 h-4" /> Catalogs
        </button>

        <span className={`absolute top-4 right-4 px-3 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md border ${
          catalog.status === 'published'
            ? 'bg-[#DC2626]/80 text-white border-[#DC2626]/40'
            : 'bg-amber-500/80 text-white border-amber-400/40'
        }`}>
          {catalog.status === 'published' ? '? Live' : '? Draft'}
        </span>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="text-3xl font-bold text-white tracking-tight drop-shadow-lg">{catalog.name}</h1>
          {catalog.description && (
            <p className="text-white/65 text-sm mt-1 line-clamp-1">{catalog.description}</p>
          )}
        </div>
      </div>

      {/* Stats + Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-wrap gap-3">
          {[
            { icon: Package, label: `${products.length} Products`, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
            { icon: Eye, label: `${catalog.analytics?.viewCount || 0} Views`, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20' },
            { icon: Layers, label: catalog.template || 'grid', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
          ].map(s => (
            <div key={s.label} className={`flex items-center gap-2 px-3 py-2 rounded-xl ${s.bg} text-sm font-semibold ${s.color}`}>
              <s.icon className="w-4 h-4" />
              <span className="capitalize">{s.label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={copyShareLink}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors shadow-sm">
            <Copy className="w-4 h-4" /> Copy Link
          </button>
          <button onClick={() => window.open(`/catalog/${catalog.sharing?.shareableLink}`, '_blank')}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors shadow-sm">
            <ExternalLink className="w-4 h-4" /> Preview
          </button>            <button onClick={() => navigate(`/dashboard/catalogs/${catalog._id}/theme`)}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 rounded-xl text-sm font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors shadow-sm">
              <Layout className="w-4 h-4" /> Theme Editor
            </button>          <button onClick={() => setEditOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors shadow-sm">
            <Edit3 className="w-4 h-4" /> Edit Catalog
          </button>
          <button onClick={() => setShowPicker(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-xl font-bold shadow-lg shadow-[#DC2626]/20 transition-all active:scale-95">
            <Plus className="w-4 h-4" /> Add Products
          </button>
        </div>
      </div>

      {/* Products Section */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Products
          <span className="ml-2 text-base font-normal text-gray-400">({products.length})</span>
        </h2>
      </div>

      {products.length === 0 ? (
        <div className="py-24 flex flex-col items-center justify-center text-center bg-white dark:bg-zinc-950 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
          <div className="w-20 h-20 bg-gray-50 dark:bg-zinc-900 rounded-2xl flex items-center justify-center mb-5">
            <Package className="w-10 h-10 text-gray-200 dark:text-zinc-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">No products yet</h3>
          <p className="text-gray-400 max-w-xs mt-2 mb-6 text-sm">Add products to build your catalog for customers.</p>
          <button onClick={() => setShowPicker(true)}
            className="flex items-center gap-2 px-6 py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-2xl font-bold shadow-lg shadow-[#DC2626]/20 transition-all active:scale-95">
            <Plus className="w-5 h-5" /> Add Your First Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((product) => (
            <div key={product._id}
              className="group relative bg-white dark:bg-zinc-950 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="relative aspect-square bg-gray-50 dark:bg-zinc-900 overflow-hidden">
                {product.images?.[0]?.url ? (
                  <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-10 h-10 text-gray-200 dark:text-zinc-700" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-3">
                  <button onClick={() => setRemoveTarget(product)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold shadow-lg transition-all">
                    <Trash2 className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </div>
              <div className="p-3">
                <h4 className="font-bold text-sm text-gray-900 dark:text-white truncate">{product.name}</h4>
                <p className="text-[#DC2626] font-bold text-sm mt-0.5">{formatCurrency(product.price)}</p>
                {product.category && (
                  <span className="inline-block mt-1.5 px-2 py-0.5 bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 text-xs rounded-md">
                    {product.category}
                  </span>
                )}
              </div>
            </div>
          ))}

          <button onClick={() => setShowPicker(true)}
            className="group flex flex-col items-center justify-center bg-gray-50/80 dark:bg-zinc-900/50 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl hover:border-[#DC2626] hover:bg-[#DC2626]/5 transition-all cursor-pointer min-h-[180px]">
            <div className="w-12 h-12 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform mb-2">
              <Plus className="w-6 h-6 text-gray-400 group-hover:text-[#DC2626] transition-colors" />
            </div>
            <span className="text-sm font-bold text-gray-400 group-hover:text-[#DC2626] transition-colors">Add More</span>
          </button>
        </div>
      )}

      {/* Edit Slide Panel */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditOpen(false)} />
          <div className="relative w-full max-w-md bg-white dark:bg-zinc-950 h-full shadow-2xl flex flex-col border-l border-gray-200 dark:border-gray-800"
            style={{animation:'slideInRight 0.25s ease-out'}}>
            <div className="sticky top-0 z-10 bg-white dark:bg-zinc-950 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Catalog</h3>
                <p className="text-xs text-gray-400 mt-0.5">Update settings and design</p>
              </div>
              <button onClick={() => setEditOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl text-gray-400 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

              {/* Cover Image */}
              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Cover Image</label>
                {coverPreview || catalog.coverImage?.url ? (
                  <div className="relative rounded-2xl overflow-hidden h-36 group bg-gray-100 dark:bg-zinc-800">
                    <img src={coverPreview || catalog.coverImage.url} alt="Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button type="button" onClick={() => coverRef.current?.click()}
                        className="px-3 py-1.5 bg-white text-gray-900 rounded-xl text-xs font-bold flex items-center gap-1">
                        <Upload className="w-3.5 h-3.5" /> Change
                      </button>
                      {coverPreview && (
                        <button type="button" onClick={handleCoverUpload} disabled={uploadingCover}
                          className="px-3 py-1.5 bg-[#DC2626] text-white rounded-xl text-xs font-bold flex items-center gap-1 disabled:opacity-50">
                          <Save className="w-3.5 h-3.5" /> {uploadingCover ? 'Uploading...' : 'Save Cover'}
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div onClick={() => coverRef.current?.click()}
                    className="h-36 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#DC2626] hover:bg-[#DC2626]/5 transition-all">
                    <ImageIcon className="w-8 h-8 text-gray-300" />
                    <span className="text-xs font-bold text-gray-400">Click to upload cover</span>
                  </div>
                )}
                <input ref={coverRef} type="file" accept="image/*" className="hidden"
                  onChange={e => { if (e.target.files[0]) handleCoverFile(e.target.files[0]); }} />
                {coverPreview && !uploadingCover && (
                  <button onClick={handleCoverUpload}
                    className="mt-2 w-full py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" /> Upload Cover Image
                  </button>
                )}
              </div>

              <div className="h-px bg-gray-100 dark:bg-gray-800" />

              <FIELD label="Catalog Name">
                <input type="text" value={editForm.name || ''} onChange={e => ef('name', e.target.value)} placeholder="Catalog name"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DC2626] transition-colors" />
              </FIELD>

              <FIELD label="Description">
                <textarea value={editForm.description || ''} onChange={e => ef('description', e.target.value)} rows={3}
                  placeholder="Describe your catalog..."
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DC2626] resize-none transition-colors" />
              </FIELD>

              <div className="grid grid-cols-2 gap-3">
                <FIELD label="Template">
                  <select value={editForm.template || 'grid'} onChange={e => ef('template', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#DC2626]">
                    {templates.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </FIELD>
                <FIELD label="Status">
                  <select value={editForm.status || 'draft'} onChange={e => ef('status', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#DC2626]">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </select>
                </FIELD>
              </div>

              <FIELD label="Tags" hint="Comma-separated">
                <input type="text" value={editForm.tagsInput || ''} onChange={e => ef('tagsInput', e.target.value)} placeholder="summer, sale, trending"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DC2626]" />
              </FIELD>

              <label className="flex items-center justify-between p-3.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-900 cursor-pointer hover:border-[#DC2626] transition-colors">
                <div>
                  <span className="text-sm font-bold text-gray-900 dark:text-white block">Public Access</span>
                  <span className="text-xs text-gray-400">Anyone with the link can view</span>
                </div>
                <button type="button" onClick={() => ef('isPublic', !editForm.isPublic)}
                  className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${editForm.isPublic ? 'bg-[#DC2626]' : 'bg-gray-300 dark:bg-gray-600'}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${editForm.isPublic ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
              </label>

              <div className="h-px bg-gray-100 dark:bg-gray-800" />
                {/* AI Design Magic Wand */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30 mb-6 mt-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-bold text-blue-900 dark:text-blue-100">Design with AI</span>
                  </div>
                  <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
                    Describe your brand vibe, and AI will generate a color palette and layout for you.
                  </p>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="e.g. Minimalist luxury watches..." 
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-blue-200 dark:border-blue-800/50 bg-white dark:bg-zinc-900 text-sm outline-none focus:border-blue-400"
                      disabled={isGeneratingTheme}
                    />
                    <button 
                      type="button"
                      onClick={handleGenerateTheme}
                      disabled={isGeneratingTheme || !aiPrompt}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-1"
                    >
                       {isGeneratingTheme ? <Loader size="sm" /> : <Wand2 className="w-4 h-4" />}
                      Generate
                    </button>
                  </div>
                </div>
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Palette className="w-4 h-4 text-gray-400" />
                  <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Design</span>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {[{ k: 'backgroundColor', label: 'Background' }, { k: 'textColor', label: 'Text' }, { k: 'accentColor', label: 'Accent' }].map(c => (
                    <div key={c.k} className="relative">
                      <input type="color" value={editForm.design?.[c.k] || '#000000'} onChange={e => ed(c.k, e.target.value)}
                        className="sr-only" id={`color-${c.k}`} />
                      <label htmlFor={`color-${c.k}`}
                        className="block h-12 rounded-xl border border-gray-200 dark:border-zinc-700 cursor-pointer overflow-hidden shadow-sm hover:shadow-md transition-shadow relative"
                        style={{ backgroundColor: editForm.design?.[c.k] || '#000000' }}>
                        <span className="absolute inset-0 flex items-end justify-center pb-1.5">
                          <span className="text-[10px] font-bold bg-black/30 text-white px-1.5 py-0.5 rounded backdrop-blur-sm">{c.label}</span>
                        </span>
                      </label>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <FIELD label="Products / Row">
                    <select value={editForm.design?.productsPerRow || 3} onChange={e => ed('productsPerRow', +e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#DC2626]">
                      {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </FIELD>
                  <div className="pt-5 space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={!!editForm.design?.showPrices} onChange={e => ed('showPrices', e.target.checked)} className="w-4 h-4 text-[#DC2626] rounded" />
                      <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">Show prices</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={!!editForm.design?.showDescription} onChange={e => ed('showDescription', e.target.checked)} className="w-4 h-4 text-[#DC2626] rounded" />
                      <span className="text-xs text-gray-700 dark:text-gray-300 font-medium">Show descriptions</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100 dark:bg-gray-800" />

              <FIELD label="Share Link">
                <div className="flex gap-2">
                  <input readOnly value={shareUrl} className="flex-1 px-3 py-2.5 rounded-xl border border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 text-xs text-gray-400 font-mono truncate focus:outline-none" />
                  <button onClick={copyShareLink} className="px-3 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-600 dark:text-gray-300 rounded-xl transition-colors flex items-center">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </FIELD>

              {catalog.sharing?.qrCode && (
                <div className="flex justify-center p-4 bg-gray-50 dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <img src={catalog.sharing.qrCode} alt="QR" className="w-32 h-32 rounded-xl" />
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-white dark:bg-zinc-950 border-t border-gray-100 dark:border-gray-800 px-6 py-4 flex gap-3 shrink-0">
              <button onClick={() => setEditOpen(false)}
                className="flex-1 py-3 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm transition-colors">
                Cancel
              </button>
              <button onClick={handleSave} disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-50 text-white rounded-xl font-bold text-sm shadow-lg shadow-[#DC2626]/20 transition-all active:scale-95">
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Picker Modal */}
      {showPicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-3xl max-h-[88vh] flex flex-col shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between shrink-0">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white">Add Products</h3>
                <p className="text-sm text-gray-400 mt-0.5">
                  {selectedProductIds.length > 0
                    ? <span className="text-[#DC2626] font-bold">{selectedProductIds.length} selected</span>
                    : 'Click products to select them'}
                </p>
              </div>
              <button onClick={() => { setShowPicker(false); setSelectedProductIds([]); setPickerSearch(''); }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-xl text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search products..." value={pickerSearch}
                  onChange={e => setPickerSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl text-sm focus:ring-2 focus:ring-[#DC2626] focus:border-transparent outline-none text-gray-900 dark:text-white" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {pickerLoading ? (
                <div className="flex justify-center py-12"><Loader /></div>
              ) : pickerProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                  <Package className="w-12 h-12 mb-3 opacity-20" />
                  <p className="text-sm font-medium">{pickerSearch ? 'No matching products found' : 'All products are already in this catalog'}</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {pickerProducts.map(product => {
                    const isSelected = selectedProductIds.includes(product._id);
                    return (
                      <div key={product._id}
                        onClick={() => setSelectedProductIds(prev => isSelected ? prev.filter(i => i !== product._id) : [...prev, product._id])}
                        className={`relative rounded-xl border-2 cursor-pointer transition-all overflow-hidden group ${
                          isSelected ? 'border-[#DC2626] shadow-md shadow-[#DC2626]/10' : 'border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600'
                        }`}>
                        <div className="aspect-square bg-gray-50 dark:bg-zinc-800">
                          {product.images?.[0]?.url
                            ? <img src={product.images[0].url} alt="" className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center"><Package className="w-8 h-8 text-gray-200 dark:text-zinc-600" /></div>}
                        </div>
                        <div className="p-2.5">
                          <p className="text-xs font-bold text-gray-900 dark:text-white truncate">{product.name}</p>
                          <p className="text-xs font-bold text-[#DC2626] mt-0.5">{formatCurrency(product.price)}</p>
                        </div>
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-[#DC2626] rounded-full flex items-center justify-center shadow-lg">
                            <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
                          </div>
                        )}
                        {isSelected && <div className="absolute inset-0 ring-2 ring-[#DC2626] ring-inset rounded-xl pointer-events-none" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-5 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center shrink-0 bg-gray-50 dark:bg-zinc-900/50 rounded-b-2xl">
              <span className="text-sm text-gray-500">
                {selectedProductIds.length > 0
                  ? <><span className="font-bold text-[#DC2626]">{selectedProductIds.length}</span> selected</>
                  : 'None selected'}
              </span>
              <div className="flex gap-3">
                <button onClick={() => { setShowPicker(false); setSelectedProductIds([]); setPickerSearch(''); }}
                  className="px-4 py-2.5 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-gray-600 dark:text-gray-300 rounded-xl font-medium text-sm hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleAddProducts} disabled={selectedProductIds.length === 0 || addingProducts}
                  className="px-5 py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-sm shadow-lg shadow-[#DC2626]/20 transition-all active:scale-95">
                  {addingProducts ? 'Adding...' : `Add ${selectedProductIds.length > 0 ? selectedProductIds.length + ' ' : ''}Product${selectedProductIds.length !== 1 ? 's' : ''}`}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!removeTarget}
        onClose={() => setRemoveTarget(null)}
        onConfirm={handleRemoveProduct}
        title="Remove Product"
        message={`Remove "${removeTarget?.name}" from this catalog?`}
        confirmLabel="Remove"
        loading={removing}
      />
    </div>
  );
}



