import { useState, useEffect, useCallback } from 'react';
import {
  Plus, Search, Filter, MoreVertical, Share2, Eye, Copy, Trash2, 
  Image as ImageIcon, ShoppingBag, ExternalLink,
  Edit, QrCode
} from 'lucide-react';
import { catalogService } from '../services/catalogService';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import Pagination from '../components/common/Pagination';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { useDebounce } from '../hooks/useDebounce';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const templates = ['grid', 'list', 'magazine', 'minimal', 'luxury', 'modern', 'classic'];

export default function Catalogs() {
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

  const [form, setForm] = useState({
    name: '', description: '', template: 'grid', status: 'draft',
    isPublic: true,
    design: { backgroundColor: '#FFFFFF', textColor: '#000000', accentColor: '#3B82F6', showPrices: true, showDescription: true, productsPerRow: 3 },
  });

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

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name) { toast.error('Catalog name is required'); return; }
    setCreating(true);
    try {
      await catalogService.createCatalog(form);
      toast.success('Catalog created!');
      setShowModal(false);
      setForm({ name: '', description: '', template: 'grid', status: 'draft', isPublic: true, design: { backgroundColor: '#FFFFFF', textColor: '#000000', accentColor: '#3B82F6', showPrices: true, showDescription: true, productsPerRow: 3 } });
      fetchCatalogs();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
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
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-5 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-bold shadow-lg shadow-[#25D366]/20 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Plus className="w-5 h-5" strokeWidth={2.5} />
            <span>Create New Catalog</span>
          </button>
        )}
      </div>

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
                className="group flex flex-col items-center justify-center h-full min-h-[320px] bg-gray-50 dark:bg-zinc-900/50 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl hover:border-[#25D366] hover:bg-[#25D366]/5 transition-all duration-300 text-center p-6 cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 mb-4 group-hover:shadow-md">
                  <Plus className="w-8 h-8 text-gray-400 group-hover:text-[#25D366] transition-colors" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-[#25D366] transition-colors">Create New Catalog</h3>
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
                  {catalog.coverImage?.url || catalog.products?.[0]?.images?.[0]?.url ? (
                    <img 
                      src={catalog.coverImage?.url || catalog.products?.[0]?.images?.[0]?.url} 
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
                      catalog.status === 'published' ? 'bg-[#25D366]/90' : 'bg-yellow-500/90'
                    }`}>
                      {catalog.status === 'published' ? 'Published' : 'Draft'}
                    </span>
                  </div>

                  {/* Quick Actions Overlay (Visible on Hover) */}
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md">
                    <button 
                      onClick={() => window.open(`/catalog/${catalog.sharing?.shareableLink}`, '_blank')}
                      className="p-2 bg-white rounded-full text-gray-700 hover:text-[#25D366] shadow-lg hover:scale-110 transition-all cursor-pointer"
                      title="Preview"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setShareModal(catalog)}
                      className="p-2 bg-[#25D366] rounded-full text-white shadow-lg hover:bg-[#20bd5a] hover:scale-110 transition-all cursor-pointer"
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
                        <ShoppingBag className="w-4 h-4 text-[#25D366]" />
                        <span>{catalog.products?.length || 0}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400">
                        <Eye className="w-4 h-4 text-blue-500" />
                        <span>{catalog.analytics?.viewCount || 0}</span>
                      </div>
                    </div>

                    {/* Simple Toggle Switch */}
                    <button 
                      onClick={() => toggleStatus(catalog)}
                      className={`relative w-10 h-6 rounded-full transition-colors duration-200 flex items-center cursor-pointer ${
                        catalog.status === 'published' ? 'bg-[#25D366]' : 'bg-gray-300 dark:bg-gray-600'
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
            ))}
          </div>

          <Pagination page={pg.page} totalPages={pg.pages} total={pg.total} limit={pg.limit} onPageChange={p => fetchCatalogs(p)} />
        </>
      )}

      {/* Create Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Catalog" size="lg">
        <form onSubmit={handleCreate} className="space-y-6">
          <Input label="Catalog Name" required value={form.name} onChange={e => f('name', e.target.value)} placeholder="e.g. Summer Collection 2026" />

          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Description</label>
            <textarea 
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#25D366] bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white transition-all resize-none"
              rows="4" 
              value={form.description} 
              onChange={e => f('description', e.target.value)} 
              placeholder="Describe what's in this catalog..." 
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Template</label>
              <select 
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                value={form.template} 
                onChange={e => f('template', e.target.value)}
              >
                {templates.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">Initial Status</label>
              <select 
                className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#25D366]"
                value={form.status} 
                onChange={e => f('status', e.target.value)}
              >
                <option value="draft">Draft (Hidden)</option>
                <option value="published">Published (Visible)</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-zinc-800 cursor-pointer hover:border-[#25D366] transition-colors">
            <input 
              type="checkbox" 
              checked={form.isPublic} 
              onChange={e => f('isPublic', e.target.checked)}
              className="w-5 h-5 text-[#25D366] rounded focus:ring-[#25D366] border-gray-300" 
            />
            <div className="flex-1">
              <span className="block text-sm font-bold text-gray-900 dark:text-white">Public Access</span>
              <span className="block text-xs text-gray-500">Anyone with the link can view this catalog</span>
            </div>
          </label>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowModal(false)} type="button">Cancel</Button>
            <Button type="submit" loading={creating}>Create Catalog</Button>
          </div>
        </form>
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
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
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
