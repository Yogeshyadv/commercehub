import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Share2, Search, Loader2, Eye, ExternalLink, LayoutGrid, List, Copy, CheckCircle2, Globe, FileText, Archive } from 'lucide-react';
import { catalogService } from '../../../services/catalogService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../../components/common/ConfirmDialog';

/* Template accent colors for the card top-stripe */
const TEMPLATE_ACCENTS = {
  'minimal-luxe': '#111111', 'dark-premium': '#c9a84c', 'bold-commerce': '#1a73e8',
  'tech-specs': '#00d4ff', 'artisan-market': '#6b3a1f', 'flash-sale': '#dc2626',
  'fresh-grocery': '#16a34a', 'corporate-b2b': '#0a2540', 'editorial': '#e83e3e',
  'neon-street': '#f72585', 'pastel-beauty': '#d63f7c', 'sports-fitness': '#f97316',
  'real-estate': '#B91C1C', 'kids-playful': '#ea580c', 'pharmacy-health': '#0284c7',
  'jewellery-gold': '#d4a017', 'auto-parts': '#ef4444', 'furniture-home': '#a16207',
  'pet-store': '#15803d', 'grid': '#008060', 'minimal': '#111', 'luxury': '#c9a84c',
  'modern': '#6366f1', 'magazine': '#e83e3e', 'classic': '#8b4513',
  'modern-blocks': '#7c3aed', 'list': '#0a2540',
};

export default function CatalogueList() {
  const navigate = useNavigate();
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [delTarget, setDelTarget] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const fetchCatalogs = useCallback(async () => {
    try {
      setLoading(true);
      const r = await catalogService.getCatalogs({ limit: 50 });
      setCatalogs(r.data || []);
    } catch {
      toast.error('Failed to load catalogs');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCatalogs(); }, [fetchCatalogs]);

  const handleDelete = async () => {
    if (!delTarget) return;
    try {
      await catalogService.deleteCatalog(delTarget);
      toast.success('Catalog deleted');
      setDelTarget(null);
      fetchCatalogs();
    } catch {
      toast.error('Failed to delete catalog');
    }
  };

  const copyShareLink = async (catalog) => {
    const link = window.location.origin + '/catalog/' + catalog.sharing?.shareableLink;
    await navigator.clipboard.writeText(link);
    setCopiedId(catalog._id);
    toast.success('Link copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = catalogs.filter(c => {
    const matchSearch = c.name?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || c.status === filter;
    return matchSearch && matchFilter;
  });

  const stats = {
    total: catalogs.length,
    published: catalogs.filter(c => c.status === 'published').length,
    draft: catalogs.filter(c => c.status === 'draft').length,
    archived: catalogs.filter(c => c.status === 'archived').length,
  };

  const accent = (template) => TEMPLATE_ACCENTS[template] || '#008060';

  const StatusBadge = ({ status }) => {
    const map = {
      published: { label: 'Published', cls: 'bg-red-100 text-red-700', Icon: Globe },
      draft: { label: 'Draft', cls: 'bg-amber-50 text-amber-600', Icon: FileText },
      archived: { label: 'Archived', cls: 'bg-red-50 text-red-500', Icon: Archive },
    };
    const { label, cls, Icon } = map[status] || map.draft;
    return (
      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${cls}`}>
        <Icon className="w-3 h-3" />{label}
      </span>
    );
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#f4f6f8] w-full">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">

        {/* ── Page Header ─────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Catalogues</h1>
            <p className="text-sm text-gray-500 mt-0.5">Your digital shopfronts and product collections.</p>
          </div>
          <button
            onClick={() => navigate('/dashboard/catalogues/templates')}
            className="inline-flex items-center gap-2 bg-[#008060] hover:bg-[#006e52] active:bg-[#00594a] text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create New Catalogue
          </button>
        </div>

        {/* ── Stats Row ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
          {[
            { label: 'Total', value: stats.total, color: 'text-gray-700', bg: 'bg-white', border: 'border-gray-200', dot: 'bg-gray-400', filter: 'all' },
            { label: 'Published', value: stats.published, color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-100', dot: 'bg-red-500', filter: 'published' },
            { label: 'Draft', value: stats.draft, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100', dot: 'bg-amber-400', filter: 'draft' },
            { label: 'Archived', value: stats.archived, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100', dot: 'bg-red-400', filter: 'archived' },
          ].map(s => (
            <button key={s.filter} onClick={() => setFilter(s.filter)}
              className={`${s.bg} border ${s.border} rounded-2xl px-4 py-3.5 text-left transition-all hover:scale-[1.02] active:scale-100 cursor-pointer shadow-sm ${filter === s.filter ? 'ring-2 ring-offset-1 ring-[#008060]' : ''}`}>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                <span className="text-xs font-semibold text-gray-500">{s.label}</span>
              </div>
              <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
            </button>
          ))}
        </div>

        {/* ── Toolbar ─────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-5 px-4 py-3 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-48">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search catalogues..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#008060]/20 focus:border-[#008060] bg-gray-50 transition-all"
            />
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            {['all', 'published', 'draft', 'archived'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all capitalize cursor-pointer ${filter === f ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}>
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
            <button onClick={() => setViewMode('grid')} className={`p-1.5 rounded cursor-pointer transition-colors ${viewMode === 'grid' ? 'bg-gray-100 text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setViewMode('list')} className={`p-1.5 rounded cursor-pointer transition-colors ${viewMode === 'list' ? 'bg-gray-100 text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Content ─────────────────────────────────────────────────── */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-[#008060]" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm py-20 text-center">
            <div className="text-5xl mb-4">🗂️</div>
            <h3 className="text-base font-bold text-gray-700 mb-1">
              {search || filter !== 'all' ? 'No catalogues match' : 'No catalogues yet'}
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              {search || filter !== 'all' ? 'Try adjusting your search or filter.' : "Create your first catalogue to showcase your products."}
            </p>
            {!search && filter === 'all' && (
              <button onClick={() => navigate('/dashboard/catalogues/templates')}
                className="inline-flex items-center gap-2 bg-[#008060] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#006e52] transition-colors cursor-pointer">
                <Plus className="w-4 h-4" /> Create Catalogue
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (

          /* ── GRID VIEW ─────────────────────────────────────────────── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map(catalog => {
              const a = accent(catalog.template);
              const productCount = catalog.products?.length || 0;
              const isCopied = copiedId === catalog._id;
              return (
                <div key={catalog._id}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col group">

                  {/* Cover / thumbnail */}
                  <div className="relative h-36 overflow-hidden cursor-pointer"
                    style={{ background: catalog.coverImage?.url ? undefined : a + '18' }}
                    onClick={() => navigate('/dashboard/catalogues/' + catalog._id + '/edit')}>
                    {catalog.coverImage?.url ? (
                      <img src={catalog.coverImage.url} alt={catalog.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl font-black text-white shadow-sm"
                          style={{ background: a }}>
                          {catalog.name?.charAt(0)?.toUpperCase() || 'C'}
                        </div>
                        <span className="text-[11px] font-semibold capitalize text-gray-400">{catalog.template?.replace(/-/g, ' ')}</span>
                      </div>
                    )}
                    {/* Accent stripe */}
                    <div className="absolute top-0 left-0 right-0 h-1" style={{ background: a }} />
                    {/* Status badge overlay */}
                    <div className="absolute top-3 right-3">
                      <StatusBadge status={catalog.status} />
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="px-4 py-3 flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1 truncate cursor-pointer hover:text-[#008060] transition-colors"
                      onClick={() => navigate('/dashboard/catalogues/' + catalog._id + '/edit')}>
                      {catalog.name}
                    </h3>
                    <div className="flex items-center gap-3 text-[11px] text-gray-400 mb-3">
                      <span>{productCount} product{productCount !== 1 ? 's' : ''}</span>
                      <span>·</span>
                      <span>{new Date(catalog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>
                    {/* Action row */}
                    <div className="flex items-center gap-1.5 mt-auto pt-2 border-t border-gray-100">
                      <button onClick={() => navigate('/dashboard/catalogues/' + catalog._id + '/edit')}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors cursor-pointer"
                        style={{ background: a }}>
                        <Edit2 className="w-3.5 h-3.5" /> Edit
                      </button>
                      {catalog.status === 'published' && catalog.sharing?.shareableLink && (
                        <a href={'/catalog/' + catalog.sharing.shareableLink} target="_blank" rel="noreferrer"
                          className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors cursor-pointer" title="View Live">
                          <Eye className="w-4 h-4" />
                        </a>
                      )}
                      <button onClick={() => copyShareLink(catalog)}
                        className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-gray-500 transition-colors cursor-pointer" title="Copy Link">
                        {isCopied ? <CheckCircle2 className="w-4 h-4 text-red-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button onClick={() => setDelTarget(catalog._id)}
                        className="p-1.5 rounded-lg border border-red-100 hover:bg-red-50 text-red-400 transition-colors cursor-pointer" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* + New card */}
            <button onClick={() => navigate('/dashboard/catalogues/templates')}
              className="bg-white rounded-2xl border-2 border-dashed border-gray-200 hover:border-[#008060] hover:bg-[#008060]/5 min-h-[220px] flex flex-col items-center justify-center gap-3 transition-all duration-200 cursor-pointer group">
              <div className="w-12 h-12 rounded-2xl bg-[#008060]/10 group-hover:bg-[#008060]/20 flex items-center justify-center transition-colors">
                <Plus className="w-6 h-6 text-[#008060]" />
              </div>
              <span className="text-sm font-semibold text-gray-400 group-hover:text-[#008060] transition-colors">New Catalogue</span>
            </button>
          </div>

        ) : (

          /* ── LIST VIEW ─────────────────────────────────────────────── */
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] uppercase tracking-wider text-gray-500 bg-gray-50">
                  <th className="px-5 py-3 font-semibold">Catalogue</th>
                  <th className="px-5 py-3 font-semibold hidden sm:table-cell">Template</th>
                  <th className="px-5 py-3 font-semibold hidden md:table-cell">Products</th>
                  <th className="px-5 py-3 font-semibold hidden lg:table-cell">Created</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(catalog => {
                  const a = accent(catalog.template);
                  const productCount = catalog.products?.length || 0;
                  const isCopied = copiedId === catalog._id;
                  return (
                    <tr key={catalog._id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-bold text-sm shadow-sm"
                            style={{
                              background: catalog.coverImage?.url ? undefined : a,
                              overflow: 'hidden',
                            }}>
                            {catalog.coverImage?.url
                              ? <img src={catalog.coverImage.url} alt={catalog.name} className="w-full h-full object-cover" />
                              : catalog.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <span className="font-semibold text-gray-900 text-sm truncate max-w-[180px]">{catalog.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        <span className="text-xs font-medium text-gray-500 capitalize">{catalog.template?.replace(/-/g, ' ') || '—'}</span>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <span className="text-sm text-gray-500">{productCount}</span>
                      </td>
                      <td className="px-5 py-3.5 hidden lg:table-cell">
                        <span className="text-sm text-gray-500">{new Date(catalog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' })}</span>
                      </td>
                      <td className="px-5 py-3.5"><StatusBadge status={catalog.status} /></td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => navigate('/dashboard/catalogues/' + catalog._id + '/edit')}
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors cursor-pointer" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {catalog.status === 'published' && catalog.sharing?.shareableLink && (
                            <a href={'/catalog/' + catalog.sharing.shareableLink} target="_blank" rel="noreferrer"
                              className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors" title="View Live">
                              <Eye className="w-4 h-4" />
                            </a>
                          )}
                          <button onClick={() => copyShareLink(catalog)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors cursor-pointer" title="Copy Link">
                            {isCopied ? <CheckCircle2 className="w-4 h-4 text-red-500" /> : <Copy className="w-4 h-4" />}
                          </button>
                          <button onClick={() => setDelTarget(catalog._id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg text-red-400 transition-colors cursor-pointer" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!delTarget}
        title="Delete Catalogue"
        message="Are you sure you want to delete this catalogue? This will unpublish the public link."
        onConfirm={handleDelete}
        onCancel={() => setDelTarget(null)}
        confirmLabel="Delete"
      />
    </div>
  );
}