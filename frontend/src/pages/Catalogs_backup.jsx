import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Search, Filter, MoreVertical, Share2, Eye, Copy, Trash2,
  Image as ImageIcon, ShoppingBag, ExternalLink,
  Edit, QrCode, Upload, X, Package, CheckSquare, Wand2
} from 'lucide-react';
import { catalogService } from '../services/catalogService';
import { productService } from '../services/productService';
import { aiService } from '../services/aiService';
import Modal from '../components/common/Modal';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const templates = ['grid', 'list', 'magazine', 'minimal', 'luxury', 'modern', 'classic'];

export default function Catalogs() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isVendor = user?.role === 'vendor' || user?.role === 'vendor_staff' || user?.role === 'super_admin';

  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pg, setPg] = useState({ page: 1, limit: 12, total: 0, pages: 0 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [delTarget, setDelTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [shareModal, setShareModal] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  const EMPTY_FORM = {
    name: '', description: '', template: 'modern-blocks', status: 'draft',
    isPublic: true, tagsInput: '', categoriesInput: '', blocks: [],
    design: { backgroundColor: '#FFFFFF', textColor: '#000000', accentColor: '#DC2626', showPrices: true, showDescription: true, productsPerRow: 3 },
  };

  const [form, setForm] = useState(EMPTY_FORM);
  const [step, setStep] = useState(1);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState('');
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [productsList, setProductsList] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const coverInputRef = useRef(null);

  const [showAiModal, setShowAiModal] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingCatalog, setIsGeneratingCatalog] = useState(false);

  const ds = useDebounce(search, 400);

  const fetchCatalogs = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const params = { page, limit: 12 };
      if (ds) params.search = ds;
      if (statusFilter) params.status = statusFilter;
      const r = await catalogService.getCatalogs(params);
      setCatalogs(r.data || []);
      setPg(r.pagination || { page: 1, limit: 12, total: 0, pages: 0 });
    } catch { toast.error('Failed to load catalogs'); }
    finally { setLoading(false); }
  }, [ds, statusFilter]);

  useEffect(() => { fetchCatalogs(); }, [fetchCatalogs]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleModalClose = () => {
    setShowModal(false);
    setStep(1);
    setCoverImageFile(null);
    setCoverImagePreview('');
    setSelectedProductIds([]);
    setProductSearch('');
    setProductsList([]);
    setForm(EMPTY_FORM);
  };

  const handleGenerateCatalog = async () => {
    if (!aiPrompt.trim()) {
      toast.error('Please describe the catalog you want to generate');
      return;
    }
    setIsGeneratingCatalog(true);
    try {
      const { data } = await aiService.generateCatalog(aiPrompt);
      
      setForm({
        ...EMPTY_FORM,
        name: data.name || '',
        description: data.description || '',
        template: data.design?.template || 'modern-blocks',
        tagsInput: (data.tags || []).join(', '),
        categoriesInput: (data.categories || []).join(', '),
        blocks: data.blocks || [],
        design: data.design ? {
          ...EMPTY_FORM.design,
          backgroundColor: data.design.backgroundColor || '#FFFFFF',
          textColor: data.design.textColor || '#000000',
          accentColor: data.design.accentColor || '#DC2626'
        } : EMPTY_FORM.design
      });

      if (data.suggestedProducts && data.suggestedProducts.length > 0) {
        setProductsList(data.suggestedProducts);
        setSelectedProductIds(data.suggestedProducts.map(p => p._id));
      }

      setShowAiModal(false);
      setAiPrompt('');
      setShowModal(true);
      setStep(1);
      toast.success('Catalog generated! Review and click Create.');
    } catch (error) {
      toast.error('Failed to auto-generate catalog. Please try again.');
    } finally {
      setIsGeneratingCatalog(false);
    }
  };

  const fetchProductsPicker = async (search = '') => {
    setLoadingProducts(true);
    try {
      const r = await productService.getProducts({ limit: 100, ...(search ? { search } : {}) });
      setProductsList(r.data || []);
    } catch {}
    finally { setLoadingProducts(false); }
  };

  const handleCoverFile = (file) => {
    if (!file || !file.type.startsWith('image/')) { toast.error('Please select an image file'); return; }
    setCoverImageFile(file);
    const reader = new FileReader();
    reader.onload = e => setCoverImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleCreate = async () => {
    if (!form.name.trim()) { toast.error('Catalog name is required'); return; }
    setCreating(true);
    try {
      const submitData = {
        ...form,
        tags: form.tagsInput ? form.tagsInput.split(',').map(t => t.trim()).filter(Boolean) : [],
        categories: form.categoriesInput ? form.categoriesInput.split(',').map(c => c.trim()).filter(Boolean) : [],
      };
      delete submitData.tagsInput;
      delete submitData.categoriesInput;

      const res = await catalogService.createCatalog(submitData);
      const catalogId = res.data._id;

      if (coverImageFile) {
        try { await catalogService.uploadCoverImage(catalogId, coverImageFile); }
        catch { toast.error('Catalog created but cover image upload failed'); }
      }
      if (selectedProductIds.length > 0) {
        try { await catalogService.addProducts(catalogId, selectedProductIds); }
        catch { toast.error('Catalog created but some products could not be added'); }
      }

      toast.success(`Catalog created${selectedProductIds.length > 0 ? ` with ${selectedProductIds.length} product${selectedProductIds.length > 1 ? 's' : ''}` : ''}!`);
      handleModalClose();
      fetchCatalogs();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create catalog'); }
    finally { setCreating(false); }
  };

  const handleDelete = async () => {
    if (!delTarget) return;
    setDeleting(true);
    try {
      await catalogService.deleteCatalog(delTarget._id);
      toast.success('Catalog deleted');
      setDelTarget(null);
      fetchCatalogs();
    } catch { toast.error('Failed to delete'); }
    finally { setDeleting(false); }
  };

  const copyShareLink = (catalog) => {
    const link = `${window.location.origin}/catalog/${catalog.sharing?.shareableLink}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copied to clipboard!');
  };

  const toggleStatus = async (catalog) => {
    const newStatus = catalog.status === 'published' ? 'draft' : 'published';
    try {
      // Optimistic update
      setCatalogs(catalogs.map(c => c._id === catalog._id ? { ...c, status: newStatus } : c));
      await catalogService.updateCatalog(catalog._id, { status: newStatus });
      toast.success(`Catalog ${newStatus === 'published' ? 'published' : 'unpublished'}`);
    } catch (error) {
      // Revert on failure
      setCatalogs(catalogs.map(c => c._id === catalog._id ? { ...c, status: catalog.status } : c));
      toast.error('Failed to update status');
    }
  };

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const totalCatalogs = catalogs.length;
  const publishedCatalogs = catalogs.filter(c => c.status === 'published').length;
  const totalProducts = catalogs.reduce((sum, c) => sum + (c.products?.length || 0), 0);
  const totalViews = catalogs.reduce((sum, c) => sum + (c.analytics?.viewCount || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-[#111827] dark:text-white tracking-tight">Catalogs</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base">
            Create and manage shareable product catalogs for your customers.
          </p>
        </div>
        
        {isVendor && (
          <div className="flex flex-col sm:flex-row gap-3">
            <button 
              onClick={() => setShowAiModal(true)}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Wand2 className="w-5 h-5" strokeWidth={2.5} />
              <span>Generate with AI</span>
            </button>
            <button 
              onClick={() => setShowModal(true)}
              className="flex items-center justify-center gap-2 px-5 py-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-xl font-bold shadow-lg shadow-[#DC2626]/20 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Plus className="w-5 h-5" strokeWidth={2.5} />
              <span>Create New Catalog</span>
            </button>
          </div>
        )}
      </div>

      {/* Catalog Overview Stats */}
      {!loading && catalogs.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Catalogs</span>
              <ShoppingBag className="w-4 h-4 text-[#DC2626]" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalCatalogs}</p>
          </div>
          <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Published</span>
              <CheckSquare className="w-4 h-4 text-[#DC2626]" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{publishedCatalogs}</p>
          </div>
          <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Products in Catalogs</span>
              <Package className="w-4 h-4 text-[#DC2626]" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalProducts}</p>
          </div>
          <div className="bg-white dark:bg-zinc-950 p-4 rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">Total Views</span>
              <Eye className="w-4 h-4 text-[#DC2626]" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalViews}</p>
          </div>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-zinc-950 p-2 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search your catalogs..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-transparent border-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
          />
        </div>
        <div className="h-px sm:h-auto sm:w-px bg-gray-100 dark:bg-gray-700 mx-2" />
        <div className="relative min-w-[180px]">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            className="w-full pl-10 pr-4 py-3 bg-transparent border-none focus:ring-0 text-gray-600 dark:text-gray-300 font-medium cursor-pointer appearance-none focus:outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Catalogs Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader text="Loading catalogs..." />
        </div>
      ) : catalogs.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No catalogs found"
          description={isVendor ? 'Create your first catalog to start sharing products with your customers.' : 'No catalogs available yet.'}
          actionLabel={isVendor ? 'Create Catalog' : undefined}
          onAction={() => setShowModal(true)}
          actionIcon={Plus}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Create New Card (First Item) */}
            {isVendor && (
              <button 
                onClick={() => setShowModal(true)}
                className="group flex flex-col items-center justify-center h-full min-h-[320px] bg-gray-50 dark:bg-zinc-900/50 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl hover:border-[#DC2626] hover:bg-[#DC2626]/5 transition-all duration-300 text-center p-6 cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 mb-4 group-hover:shadow-md">
                  <Plus className="w-8 h-8 text-gray-400 group-hover:text-[#DC2626] transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#DC2626] transition-colors">Create New Catalog</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Start a new collection</p>
              </button>
            )}

            {/* Catalog Cards */}
            {catalogs.map((catalog) => (
              <div 
                key={catalog._id} 
                className="group relative bg-white dark:bg-zinc-950 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col cursor-pointer"
                onClick={() => navigate(`/dashboard/catalogs/${catalog._id}`)}
              >
                {/* Cover Image Area */}
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-zinc-900 group">
                  {catalog.coverImage?.url ? (
                    <img 
                      src={catalog.coverImage.url} 
                      alt={catalog.name} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-900">
                      <ImageIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-2" />
                      <span className="text-xs font-medium text-gray-400 dark:text-gray-500">No cover image</span>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2.5 py-1 rounded-lg text-xs font-bold text-white backdrop-blur-md ${
                      catalog.status === 'published' ? 'bg-[#DC2626]/90' : 'bg-[#DC2626]/50'
                    }`}>
                      {catalog.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  {/* Quick Actions Overlay (Visible on Hover) */}
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md">
                    <button 
                      onClick={() => window.open(`/catalog/${catalog.sharing?.shareableLink}`, '_blank')}
                      className="p-2 bg-white rounded-full text-gray-700 hover:text-[#DC2626] shadow-lg hover:scale-110 transition-all cursor-pointer"
                      title="Preview"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setShareModal(catalog)}
                      className="p-2 bg-[#DC2626] rounded-full text-white shadow-lg hover:bg-[#B91C1C] hover:scale-110 transition-all cursor-pointer"
                      title="Share"
                    >
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate pr-2" title={catalog.name}>
                      {catalog.name}
                    </h3>
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === catalog._id ? null : catalog._id);
                        }}
                        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>
                      
                      {/* Dropdown Menu */}
                      {activeMenu === catalog._id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-100 dark:border-gray-800 z-50 py-1 animate-in fade-in zoom-in-95 duration-200">
                          <button 
                            onClick={(e) => {
                          e.stopPropagation();
                          copyShareLink(catalog); 
                          setActiveMenu(null); 
                        }}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 cursor-pointer"
                          >
                            <Copy className="w-4 h-4" /> Copy Link
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/catalogs/${catalog._id}`); setActiveMenu(null); }}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 cursor-pointer"
                          >
                            <Edit className="w-4 h-4" /> Manage Products
                          </button>
                          <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />
                          <button 
                            onClick={() => { setDelTarget(catalog); setActiveMenu(null); }}
                            className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 flex items-center gap-2 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 h-10">
                    {catalog.description || 'No description provided.'}
                  </p>

                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                        <ShoppingBag className="w-4 h-4 text-[#DC2626]" />
                        <span>{catalog.products?.length || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                        <Eye className="w-4 h-4 text-blue-500" />
                        <span>{catalog.analytics?.viewCount || 0}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/catalogs/${catalog._id}`); }}
                        className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                      >
                        <Edit className="w-3 h-3" />
                        <span>Manage</span>
                      </button>

                      {/* Simple Toggle Switch */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleStatus(catalog); }}
                        className={`relative w-10 h-6 rounded-full transition-colors duration-200 flex items-center cursor-pointer ${
                          catalog.status === 'published' ? 'bg-[#DC2626]' : 'bg-gray-300 dark:bg-gray-600'
                        }`}
                        title={catalog.status === 'published' ? 'Deactivate' : 'Activate'}
                      >
                        <span className={`absolute left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${
                          catalog.status === 'published' ? 'translate-x-4' : 'translate-x-0'
                        }`} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination page={pg.page} totalPages={pg.pages} total={pg.total} limit={pg.limit} onPageChange={p => fetchCatalogs(p)} />
        </>
      )}

      {/* AI Generate  Modal */}
      <Modal isOpen={showAiModal} onClose={() => setShowAiModal(false)} title="Generate Catalog with AI" size="md">
        <div className="space-y-6">
          <div className="flex items-center justify-center p-6 bg-blue-50 dark:bg-zinc-900 rounded-2xl border-2 border-dashed border-blue-200 dark:border-blue-900/50 text-center">
            <div>
               <Wand2 className="w-12 h-12 text-blue-500 mx-auto animate-bounce mb-3" />
               <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Assistant</h3>
               <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Describe the catalog you want, and AI will do the heavy lifting: selecting products, creating descriptions, and designing the theme.</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
              What kind of catalog do you need?
            </label>
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="e.g. 'A winter festival sale catalog featuring outdoor electronics and cold weather gear under $100'"
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-zinc-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <button
              type="button"
              onClick={() => setShowAiModal(false)}
              className="px-5 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerateCatalog}
              disabled={isGeneratingCatalog || !aiPrompt.trim()}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 disabled:opacity-50"
            >
              {isGeneratingCatalog ? (
                <>
                  <Loader size="sm" />
                  <span>Generating Catalog...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-5 h-5" />
                  <span>Generate Catalog</span>
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Create Modal */}
      <Modal isOpen={showModal} onClose={handleModalClose} title="" size="xl">
        <div className="space-y-0 -mt-3">
          {/* Step header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {step === 1 ? 'Basic Information' : step === 2 ? 'Cover & Design' : 'Add Products'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {step === 1 ? 'Name and describe your catalog' : step === 2 ? 'Customize appearance and add a cover image' : 'Choose products to include in this catalog'}
                </p>
              </div>
              <span className="text-xs font-bold text-gray-400 bg-gray-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full">Step {step} of 3</span>
            </div>
            <div className="flex gap-1.5">
              {[1,2,3].map(s => (
                <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-[#DC2626]' : 'bg-gray-200 dark:bg-gray-700'}`} />
              ))}
            </div>
          </div>

          {/* Step 1: Basics */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">Catalog Name <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => f('name', e.target.value)}
                  placeholder="e.g. Summer Collection 2026"
                  autoFocus
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DC2626] transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={e => f('description', e.target.value)}
                  placeholder="Describe what's in this catalog..."
                  className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DC2626] resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">Template</label>
                  <select value={form.template} onChange={e => f('template', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#DC2626]">
                    {templates.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">Status</label>
                  <select value={form.status} onChange={e => f('status', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#DC2626]">
                    <option value="draft">Draft (Hidden)</option>
                    <option value="published">Published (Visible)</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">Tags <span className="text-xs font-normal text-gray-400">(comma-separated)</span></label>
                  <input type="text" value={form.tagsInput} onChange={e => f('tagsInput', e.target.value)}
                    placeholder="summer, sale, new"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DC2626] text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">Categories <span className="text-xs font-normal text-gray-400">(comma-separated)</span></label>
                  <input type="text" value={form.categoriesInput} onChange={e => f('categoriesInput', e.target.value)}
                    placeholder="clothing, accessories"
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DC2626] text-sm" />
                </div>
              </div>
              <label className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-zinc-800 cursor-pointer hover:border-[#DC2626] transition-colors">
                <input type="checkbox" checked={form.isPublic} onChange={e => f('isPublic', e.target.checked)}
                  className="w-5 h-5 text-[#DC2626] rounded focus:ring-[#DC2626] border-gray-300" />
                <div>
                  <span className="block text-sm font-bold text-gray-900 dark:text-white">Public Access</span>
                  <span className="block text-xs text-gray-500">Anyone with the link can view this catalog</span>
                </div>
              </label>
            </div>
          )}

          {/* Step 2: Cover & Design */}
          {step === 2 && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Cover Image</label>
                {coverImagePreview ? (
                  <div className="relative rounded-2xl overflow-hidden h-44 bg-gray-100 dark:bg-zinc-800 group">
                    <img src={coverImagePreview} alt="Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                      <button type="button" onClick={() => coverInputRef.current?.click()}
                        className="px-4 py-2 bg-white text-gray-900 rounded-xl font-bold text-sm flex items-center gap-1.5">
                        <Upload className="w-4 h-4" /> Change
                      </button>
                      <button type="button" onClick={() => { setCoverImageFile(null); setCoverImagePreview(''); }}
                        className="px-4 py-2 bg-red-500 text-white rounded-xl font-bold text-sm flex items-center gap-1.5">
                        <X className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => coverInputRef.current?.click()}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); handleCoverFile(e.dataTransfer.files[0]); }}
                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl h-44 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#DC2626] hover:bg-[#DC2626]/5 transition-all"
                  >
                    <div className="w-14 h-14 bg-gray-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center">
                      <ImageIcon className="w-7 h-7 text-gray-400" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300">Drop an image or click to upload</p>
                      <p className="text-xs text-gray-400 mt-0.5">JPEG, PNG, WebP · Max 10MB</p>
                    </div>
                  </div>
                )}
                <input ref={coverInputRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files[0]) handleCoverFile(e.target.files[0]); }} />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Brand Colors</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { key: 'backgroundColor', label: 'Background' },
                    { key: 'textColor', label: 'Text' },
                    { key: 'accentColor', label: 'Accent' },
                  ].map(c => (
                    <div key={c.key} className="flex items-center gap-2.5 p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-zinc-800">
                      <input type="color" value={form.design[c.key]}
                        onChange={e => setForm(p => ({ ...p, design: { ...p.design, [c.key]: e.target.value } }))}
                        className="h-9 w-9 rounded-lg border-0 cursor-pointer p-0.5 bg-transparent" />
                      <div>
                        <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{c.label}</p>
                        <p className="text-xs text-gray-400 font-mono">{form.design[c.key]}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-1.5">Products Per Row</label>
                  <select value={form.design.productsPerRow}
                    onChange={e => setForm(p => ({ ...p, design: { ...p.design, productsPerRow: +e.target.value } }))}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#DC2626]">
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} column{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
                <div className="space-y-3 pt-7">
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={form.design.showPrices}
                      onChange={e => setForm(p => ({ ...p, design: { ...p.design, showPrices: e.target.checked } }))}
                      className="w-4 h-4 text-[#DC2626] rounded" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Show prices</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={form.design.showDescription}
                      onChange={e => setForm(p => ({ ...p, design: { ...p.design, showDescription: e.target.checked } }))}
                      className="w-4 h-4 text-[#DC2626] rounded" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Show descriptions</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Products */}
          {step === 3 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedProductIds.length > 0
                    ? <span className="text-[#DC2626] font-bold">{selectedProductIds.length} product{selectedProductIds.length > 1 ? 's' : ''} selected</span>
                    : 'Select products to include (you can also add them later)'}
                </p>
                {selectedProductIds.length > 0 && (
                  <button type="button" onClick={() => setSelectedProductIds([])} className="text-xs text-red-500 hover:text-red-600 font-bold">Clear all</button>
                )}
              </div>

              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search products..."
                  value={productSearch} onChange={e => setProductSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DC2626] text-sm" />
              </div>

              <div className="h-72 overflow-y-auto space-y-1.5 pr-1">
                {loadingProducts ? (
                  <div className="flex items-center justify-center h-full text-gray-400 text-sm">Loading products...</div>
                ) : (() => {
                  const filtered = productsList.filter(p => !productSearch || p.name?.toLowerCase().includes(productSearch.toLowerCase()));
                  return filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <Package className="w-10 h-10 mb-2 opacity-30" />
                      <p className="text-sm">{productSearch ? 'No products match your search' : 'No products yet'}</p>
                    </div>
                  ) : filtered.map(product => {
                    const selected = selectedProductIds.includes(product._id);
                    return (
                      <div key={product._id}
                        onClick={() => setSelectedProductIds(prev => selected ? prev.filter(id => id !== product._id) : [...prev, product._id])}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${
                          selected
                            ? 'border-[#DC2626] bg-[#DC2626]/5 dark:bg-[#DC2626]/10'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-zinc-900'
                        }`}>
                        <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-zinc-800 overflow-hidden shrink-0">
                          {product.images?.[0]?.url
                            ? <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center"><Package className="w-5 h-5 text-gray-300" /></div>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{product.name}</p>
                          <p className="text-xs text-gray-400">₹{Number(product.price || 0).toLocaleString('en-IN')} · {product.category || 'Uncategorized'}</p>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          selected ? 'bg-[#DC2626] border-[#DC2626]' : 'border-gray-300 dark:border-gray-600'
                        }`}>
                          {selected && <CheckSquare className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between items-center pt-5 mt-5 border-t border-gray-100 dark:border-gray-800">
            <button type="button"
              onClick={step === 1 ? handleModalClose : () => setStep(s => s - 1)}
              className="px-5 py-2.5 text-sm font-bold text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-xl transition-colors">
              {step === 1 ? 'Cancel' : '← Back'}
            </button>
            {step < 3 ? (
              <button type="button"
                onClick={() => {
                  if (step === 1 && !form.name.trim()) { toast.error('Catalog name is required'); return; }
                  if (step === 2) fetchProductsPicker();
                  setStep(s => s + 1);
                }}
                className="px-6 py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold rounded-xl shadow-lg shadow-[#DC2626]/20 transition-all active:scale-95">
                Next →
              </button>
            ) : (
              <button type="button" onClick={handleCreate} disabled={creating}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-[#DC2626]/20 transition-all active:scale-95">
                {creating ? 'Creating...' : '✓ Create Catalog'}
              </button>
            )}
          </div>
        </div>
      </Modal>

      {/* Share Modal */}
      <Modal isOpen={!!shareModal} onClose={() => setShareModal(null)} title="Share Catalog" size="md">
        {shareModal && (
          <div className="space-y-6">
            <div className="flex items-center justify-center p-6 bg-gray-50 dark:bg-zinc-900 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
               {shareModal.sharing?.qrCode ? (
                 <img src={shareModal.sharing.qrCode} alt="QR Code" className="w-48 h-48 rounded-lg shadow-sm" />
               ) : (
                 <QrCode className="w-32 h-32 text-gray-300" />
               )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Shareable Link</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  readOnly
                  value={`${window.location.origin}/catalog/${shareModal.sharing?.shareableLink}`}
                  className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-sm font-mono text-gray-600 dark:text-gray-300 focus:outline-none" 
                />
                <button 
                  onClick={() => copyShareLink(shareModal)}
                  className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-white font-medium rounded-xl hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                >
                  <Copy className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`Check out our catalog: ${window.location.origin}/catalog/${shareModal.sharing?.shareableLink}`)}`, '_blank')}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#DC2626] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
              >
                <Share2 className="w-5 h-5" /> Share on WhatsApp
              </button>
              <button 
                onClick={() => window.open(`/catalog/${shareModal.sharing?.shareableLink}`, '_blank')}
                className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:opacity-90 transition-all"
              >
                <ExternalLink className="w-5 h-5" /> Open Link
              </button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog 
        isOpen={!!delTarget} 
        onClose={() => setDelTarget(null)} 
        onConfirm={handleDelete}
        title="Delete Catalog" 
        message={`Are you sure you want to delete "${delTarget?.name}"? This action cannot be undone.`} 
        confirmLabel="Delete Catalog" 
        loading={deleting} 
      />
    </div>
  );
}
