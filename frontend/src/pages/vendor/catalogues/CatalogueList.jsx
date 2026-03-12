import React, { useState, useEffect, useCallback } from 'react';
import { 
  Plus, Edit2, Trash2, Share2, Search, Loader2, Eye, 
  ExternalLink, LayoutGrid, List, Copy, CheckCircle2, 
  Globe, FileText, Archive, Sparkles, Wand2, BarChart2, 
  X, ChevronRight, Check, Layers, Zap, Clock, Terminal, Cpu
} from 'lucide-react';
import { catalogService } from '../../../services/catalogService';
import { aiService } from '../../../services/aiService';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import Badge from '../../../components/common/Badge';
import { motion, AnimatePresence } from 'framer-motion';

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

const EXAMPLE_PROMPTS = [
  'Summer clothing collection for women',
  'Gaming accessories and peripherals',
  'Organic skincare and beauty products',
  'Home décor and furniture',
  'Sports and fitness equipment',
  'Kids toys and educational games',
];

/* -- Design tokens -------------------------------------------- */
const CARD = 'bg-white dark:bg-[#0d0d0d] rounded-2xl shadow-sm border border-gray-100 dark:border-white/[0.07]';
const DIV  = 'border-gray-100 dark:border-white/[0.07]';
const SUB  = 'text-gray-400 dark:text-[#5a5a7a]';

/* ── AI Catalog Generator Modal ─────────────────────────────────────────── */
function AICatalogGenerator({ onClose, onCreated }) {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('input');   // input | loading | result
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [creating, setCreating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) { toast.error('Enter a prompt first'); return; }
    setPhase('loading');
    try {
      const res = await aiService.generateCatalog(prompt);
      setResult(res.data);
      setSelectedProducts((res.data?.suggestedProducts || []).map(p => p._id));
      setPhase('result');
    } catch {
      toast.error('AI generation failed. Check your API key or try again.');
      setPhase('input');
    }
  };

  const toggleProduct = (id) => {
    setSelectedProducts(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (!result) return;
    setCreating(true);
    try {
      const payload = {
        name:        result.name        || 'AI Generated Catalog',
        description: result.description || '',
        template:    result.design?.template || 'modern-blocks',
        design:      result.design      || {},
        categories:  result.categories  || [],
        tags:        result.tags        || [],
        blocks:      result.blocks      || [],
        status:      'draft',
      };
      const catalog = await catalogService.createCatalog(payload);
      const catalogId = catalog.data?._id;
      if (catalogId && selectedProducts.length > 0) {
        await catalogService.syncProducts(catalogId, selectedProducts).catch(() => {});
      }
      toast.success('Catalog created! Opening editor...');
      onCreated?.();
      onClose();
      navigate('/dashboard/catalogs/' + catalogId + '/edit');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create catalog');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-[#0d0d0d] rounded-[24px] shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden border border-gray-100 dark:border-white/[0.08]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-white/[0.07] flex items-center justify-between bg-gray-50/50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#dc2626] to-indigo-600 flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-[13px] font-black text-gray-900 dark:text-white uppercase tracking-wider leading-none">AI Synthesis Engine</h2>
              <p className="text-[11px] font-bold text-gray-500 dark:text-[#5a5a7a] mt-1.5 uppercase tracking-widest">Neural Catalog Construction Protocol</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-all cursor-pointer">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {/* ── INPUT PHASE ── */}
          {phase === 'input' && (
            <div className="p-8 space-y-6">
              <div>
                <label className="block text-[11px] font-black uppercase tracking-widest text-[#dc2626] mb-2.5 opacity-80">Synthesis Parameters</label>
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleGenerate())}
                  placeholder="e.g. A premium gaming accessories catalog with bold dark theme..."
                  rows={4}
                  autoFocus
                  className="w-full px-5 py-4 border border-gray-100 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.03] rounded-2xl text-sm font-medium text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-[#dc2626]/10 focus:border-[#dc2626]/30 resize-none transition-all"
                />
              </div>
              <div className="stagger">
                <p className="text-[10px] font-black text-gray-400 dark:text-[#3a3a5a] uppercase tracking-[0.2em] mb-3">Suggested Archetypes</p>
                <div className="flex flex-wrap gap-2">
                  {EXAMPLE_PROMPTS.map(ex => (
                    <button key={ex} onClick={() => setPrompt(ex)}
                      className="px-3.5 py-2 bg-white dark:bg-white/[0.03] hover:bg-gray-50 dark:hover:bg-white/[0.06] border border-gray-100 dark:border-white/[0.08] rounded-xl text-xs font-bold text-gray-500 dark:text-[#5a5a7a] transition-all cursor-pointer active:scale-95 shadow-sm">
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── LOADING PHASE ── */}
          {phase === 'loading' && (
            <div className="p-16 flex flex-col items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#dc2626] to-indigo-600 flex items-center justify-center shadow-2xl animate-pulse">
                  <Cpu className="w-10 h-10 text-white animate-spin-slow" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-[#dc2626] to-indigo-600 rounded-3xl blur-2xl opacity-40 animate-pulse" />
              </div>
              <div className="text-center">
                <p className="font-black text-gray-900 dark:text-white text-xl uppercase tracking-tight">Synthesizing Digital Assets</p>
                <p className="text-sm font-bold text-gray-400 dark:text-[#5a5a7a] mt-2">Selecting products, mapping neural nodes, choosing layout primitives…</p>
              </div>
              <div className="flex gap-3 mt-4">
                {['Analysis', 'Mapping', 'Rendering'].map((step, i) => (
                  <div key={step} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#dc2626] animate-pulse" style={{ animationDelay: i * 0.3 + 's' }}>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#dc2626]" />
                    {step}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── RESULT PHASE ── */}
          {phase === 'result' && result && (
            <div className="p-8 space-y-7">
              {/* AI Suggestion Card */}
              <div className="rounded-[24px] border-2 border-[#dc2626]/20 bg-[#dc2626]/[0.02] dark:bg-[#dc2626]/[0.05] p-6 space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <Zap className="w-4 h-4 text-[#dc2626]" />
                  <span className="text-[10px] font-black text-[#dc2626] uppercase tracking-[0.2em]">Neural Output</span>
                </div>
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1">
                    <h3 className="font-black text-gray-900 dark:text-white text-xl tracking-tight">{result.name}</h3>
                    <p className="text-sm font-medium text-gray-600 dark:text-[#a0a0c0] mt-1.5 leading-relaxed">{result.description}</p>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-3">
                    <span className="px-3 py-1 bg-white dark:bg-black/40 border border-[#dc2626]/20 text-[#dc2626] rounded-xl text-[10px] font-black uppercase tracking-widest">
                      {result.design?.template?.replace(/-/g, ' ') || 'modern-blocks'}
                    </span>
                    <div className="flex gap-2">
                      {[result.design?.backgroundColor, result.design?.accentColor, result.design?.textColor].filter(Boolean).map((c, i) => (
                        <div key={i} className="w-6 h-6 rounded-lg border border-white dark:border-white/10 shadow-lg" style={{ background: c }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Product selection */}
              {result.suggestedProducts?.length > 0 ? (
                <div className="stagger">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <p className="text-[10px] font-black text-gray-400 dark:text-[#5a5a7a] uppercase tracking-[0.2em]">
                      Asset Selection ({selectedProducts.length}/{result.suggestedProducts.length})
                    </p>
                    <button
                      onClick={() => setSelectedProducts(selectedProducts.length === result.suggestedProducts.length ? [] : result.suggestedProducts.map(p => p._id))}
                      className="text-[10px] font-black text-[#dc2626] uppercase tracking-widest hover:opacity-80 transition-opacity">
                      {selectedProducts.length === result.suggestedProducts.length ? 'Expunge All' : 'Select Network'}
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
                    {result.suggestedProducts.map(product => {
                      const isSelected = selectedProducts.includes(product._id);
                      return (
                        <button key={product._id} onClick={() => toggleProduct(product._id)}
                          className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer w-full group ${
                            isSelected 
                              ? 'border-[#dc2626] bg-[#dc2626]/[0.02] dark:bg-[#dc2626]/[0.05]' 
                              : 'border-gray-100 dark:border-white/[0.08] bg-white dark:bg-white/[0.02] hover:border-gray-200 dark:hover:border-white/[0.15]'
                          }`}>
                          <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 transition-all ${
                            isSelected ? 'bg-[#dc2626] border-[#dc2626]' : 'border-gray-200 dark:border-white/[0.15]'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={4} />}
                          </div>
                          {product.images?.[0]?.url ? (
                            <img src={product.images[0].url} alt={product.name} className="w-11 h-11 rounded-xl object-cover shrink-0 shadow-sm" />
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-gray-50 dark:bg-white/[0.05] flex items-center justify-center shrink-0">
                              <Package className="w-5 h-5 text-gray-300 dark:text-[#2a2a4a]" />
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className={`text-[13px] font-black truncate ${isSelected ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200'}`}>{product.name}</p>
                            <p className="text-[11px] font-bold text-gray-400 dark:text-[#5a5a7a] uppercase tracking-tight">{product.category}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 p-5 text-sm font-bold text-amber-700 dark:text-amber-400">
                  Telemetry Error: No matching product nodes found in local storage.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-gray-100 dark:border-white/[0.07] bg-gray-50/50 dark:bg-white/[0.02] flex justify-between items-center gap-4">
          {phase === 'result' ? (
            <>
              <button onClick={() => setPhase('input')} className="text-[11px] font-black text-gray-400 dark:text-[#5a5a7a] uppercase tracking-widest hover:text-[#dc2626] transition-colors flex items-center gap-2">
                ← Adjust Parameters
              </button>
              <div className="flex gap-3">
                <button onClick={onClose} className="px-5 py-2.5 text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">Abort</button>
                <button onClick={handleCreate} disabled={creating}
                  className="px-6 py-2.5 bg-[#dc2626] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-red-500/20 active:scale-95 disabled:opacity-40 flex items-center gap-2">
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                  Finalize Canvas
                </button>
              </div>
            </>
          ) : phase === 'input' ? (
            <>
              <button onClick={onClose} className="px-5 py-2.5 text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors">Abort</button>
              <button onClick={handleGenerate} disabled={!prompt.trim()}
                className="px-6 py-2.5 bg-[#dc2626] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-red-500/20 active:scale-95 disabled:opacity-40 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Execute Synthesis
              </button>
            </>
          ) : null}
        </div>
      </motion.div>
    </div>
  );
}

export default function CatalogueList() {
  const navigate = useNavigate();
  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  const [delTarget, setDelTarget] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [aiOpen, setAiOpen] = useState(false);

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
      toast.success('Catalog record purged');
      setDelTarget(null);
      fetchCatalogs();
    } catch {
      toast.error('Deletion protocol failed');
    }
  };

  const copyShareLink = async (catalog) => {
    const link = window.location.origin + '/catalog/' + catalog.sharing?.shareableLink;
    await navigator.clipboard.writeText(link);
    setCopiedId(catalog._id);
    toast.success('Public URL captured');
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
      published: { label: 'Live Channel', color: 'red', Icon: Globe },
      draft: { label: 'Staging', color: 'yellow', Icon: FileText },
      archived: { label: 'Vaulted', color: 'gray', Icon: Archive },
    };
    const { label, color, Icon } = map[status] || map.draft;
    return (
      <Badge color={color} className="flex gap-1 items-center">
        <Icon className="w-2.5 h-2.5" />{label}
      </Badge>
    );
  };

  return (
    <div className="max-w-[1240px] mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      
      {/* AI Generator Hero Section */}
      <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-[#0a0a0d] via-[#1a1a2e] to-[#0a0a0d] dark:from-[#000] dark:via-[#111] dark:to-[#000] text-white shadow-2xl border border-white/[0.05] ring-1 ring-white/10">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#dc2626]/20 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]"></div>
        
        <div className="relative px-8 py-20 text-center">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
            <p className="text-[11px] font-black uppercase tracking-[0.4em] text-[#dc2626] mb-4">Neural Nexus Component</p>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-5 bg-clip-text text-transparent bg-gradient-to-r from-white via-red-100 to-indigo-100">
              Visual Intelligence Synthesis
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12 font-medium">
              Describe your brand vision. Our neural engine will synthesize a stunning, reactive catalog for your enterprise in seconds.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto relative px-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#dc2626] to-indigo-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
              <div className="relative flex items-center bg-[#121216]/80 backdrop-blur-2xl rounded-2xl p-2 border border-white/[0.08] shadow-2xl">
                <Wand2 className="w-6 h-6 ml-4 text-[#dc2626]" />
                <input 
                  type="text"
                  placeholder="Execute neural command... e.g. 'Luxury watch collection with obsidian theme'"
                  className="w-full bg-transparent text-white placeholder-gray-500 px-5 py-4 text-sm font-bold outline-none"
                  onFocus={() => setAiOpen(true)}
                  readOnly
                />
                <button
                  onClick={() => setAiOpen(true)}
                  className="px-8 py-3.5 bg-white text-black font-black rounded-xl hover:bg-red-50 transition-all shadow-xl flex items-center gap-2.5 active:scale-95"
                >
                  <Sparkles className="w-5 h-5" />
                  Synthesize
                </button>
              </div>
            </div>
            
            <div className="mt-8 flex flex-wrap justify-center gap-6">
                {[
                    { icon: Terminal, label: 'Neural Mapping' },
                    { icon: Cpu, label: 'Asset Synthesis' },
                    { icon: Globe, label: 'Global Deployment' }
                ].map(item => (
                    <div key={item.label} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40">
                        <item.icon className="w-3.5 h-3.5" />
                        {item.label}
                    </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Interface */}
      <div className="space-y-7">
        
        {/* Navigation & Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
          <div className="stagger">
            <p className="text-[13px] font-bold uppercase tracking-widest text-[#dc2626] mb-1">Canvas</p>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Project Directory</h1>
          </div>
          
          <div className="flex items-center gap-3">
             <div className={`p-1 hidden sm:flex items-center rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.07] shadow-sm`}>
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white dark:bg-white/10 text-[#dc2626] shadow-sm' : 'text-gray-400 dark:text-[#3a3a5a] hover:text-gray-600'}`}>
                    <LayoutGrid className="w-5 h-5" />
                </button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white dark:bg-white/10 text-[#dc2626] shadow-sm' : 'text-gray-400 dark:text-[#3a3a5a] hover:text-gray-600'}`}>
                    <List className="w-5 h-5" />
                </button>
            </div>
            <button 
                onClick={() => navigate('/dashboard/catalogs/templates')} 
                className="flex items-center gap-2 px-6 py-3 bg-[#dc2626] text-white font-black text-xs uppercase tracking-widest rounded-xl hover:bg-[#b91c1c] transition-all shadow-lg shadow-red-500/20 active:scale-95"
            >
                <Plus className="w-4 h-4" />
                New Canvas
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className={`${CARD} px-5 py-4 flex flex-col sm:flex-row items-center gap-5`}>
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 dark:text-[#3a3a5a]" />
            <input
              type="text"
              placeholder="Search catalogues by name or status..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-11 pr-5 py-3 text-sm font-medium rounded-xl border border-gray-100 dark:border-white/[0.08] bg-gray-50/50 dark:bg-white/[0.02] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-[#3a3a5a] focus:outline-none focus:ring-4 focus:ring-[#dc2626]/10 transition-all"
            />
          </div>
          <div className="flex items-center gap-1.5 p-1 bg-gray-50 dark:bg-white/[0.03] rounded-xl border border-gray-100 dark:border-white/[0.07] overflow-x-auto scrollbar-hide">
            {['all', 'published', 'draft', 'archived'].map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${filter === f ? 'bg-white dark:bg-white/10 text-[#dc2626] shadow-md' : 'text-gray-400 dark:text-[#5a5a7a] hover:text-gray-700'}`}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Content Stream */}
        {loading ? (
          <div className="py-24 flex justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#dc2626]" /></div>
        ) : filtered.length === 0 ? (
          <div className={`${CARD} py-32 text-center flex flex-col items-center justify-center border-dashed`}>
            <div className="w-24 h-24 bg-gray-50 dark:bg-white/[0.04] rounded-full flex items-center justify-center mb-6">
                <Layers className="w-10 h-10 text-gray-200 dark:text-[#1a1a2a]" />
            </div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Empty Directory</h3>
            <p className="text-sm font-medium text-gray-400 dark:text-[#5a5a7a] mt-2 max-w-sm mx-auto">No digital catalogues detected in system memory. Initiate a synthesis request to begin.</p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(catalog => {
              const a = accent(catalog.template);
              const pCount = catalog.products?.length || 0;
              const isCopied = copiedId === catalog._id;
              return (
                <motion.div 
                    layout
                    key={catalog._id}
                    className={`${CARD} group hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/40 transition-all duration-500 overflow-hidden flex flex-col`}
                >
                  {/* Visual Interface */}
                  <div className="relative h-44 cursor-pointer overflow-hidden bg-gray-50 dark:bg-white/[0.02]"
                    onClick={() => navigate('/dashboard/catalogs/' + catalog._id)}>
                    {catalog.coverImage?.url ? (
                      <img src={catalog.coverImage.url} alt={catalog.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center opacity-40">
                         <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-lg" style={{ background: a }}>
                            {catalog.name?.charAt(0)?.toUpperCase()}
                         </div>
                         <span className="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-3">{catalog.template?.replace(/-/g, ' ')}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                        <div className="px-5 py-2.5 bg-white text-black rounded-xl text-xs font-black shadow-2xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all">
                            <Plus className="w-3.5 h-3.5" /> Visual Editor
                        </div>
                    </div>
                    <div className="absolute top-4 right-4">
                      <StatusBadge status={catalog.status} />
                    </div>
                  </div>

                  {/* Node Information */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="font-black text-gray-900 dark:text-white text-sm truncate uppercase tracking-tight group-hover:text-[#dc2626] transition-colors cursor-pointer"
                        onClick={() => navigate('/dashboard/catalogs/' + catalog._id)}>
                      {catalog.name}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5 text-[10px] font-bold text-gray-400 dark:text-[#5a5a7a] uppercase tracking-wider">
                      <span>{pCount} Assets</span>
                      <span>·</span>
                      <span>{new Date(catalog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>

                    <div className="flex items-center gap-1.5 mt-5 pt-4 border-t border-gray-100 dark:border-white/[0.05]">
                      <button onClick={() => navigate('/dashboard/catalogs/' + catalog._id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-md active:scale-95"
                        style={{ background: a }}>
                        <Eye className="w-3 h-3" /> View
                      </button>
                      <button onClick={() => navigate('/dashboard/catalogs/' + catalog._id + '/edit')}
                        className="p-2 rounded-xl border border-gray-100 dark:border-white/[0.1] text-gray-400 dark:text-[#3a3a5a] hover:text-[#dc2626] dark:hover:text-[#dc2626] hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-all" title="Edit Catalog">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => copyShareLink(catalog)}
                        className={`p-2 rounded-xl border border-gray-100 dark:border-white/[0.1] text-gray-400 dark:text-[#3a3a5a] hover:text-[#dc2626] dark:hover:text-[#dc2626] hover:bg-gray-50 dark:hover:bg-white/[0.05] transition-all`} title="Capture Link">
                        {isCopied ? <CheckCircle2 className="w-4 h-4 text-[#dc2626]" /> : <Share2 className="w-4 h-4" />}
                      </button>
                      <button onClick={() => setDelTarget(catalog._id)}
                        className="p-2 rounded-xl border border-gray-100 dark:border-white/[0.1] text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all" title="Purge Record">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className={`${CARD} overflow-hidden`}>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/[0.07] text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-[#5a5a7a] bg-gray-50/50 dark:bg-white/[0.02]">
                  <th className="px-6 py-4">Node Identity</th>
                  <th className="px-6 py-4 hidden sm:table-cell">Architecture</th>
                  <th className="px-6 py-4 hidden md:table-cell">Asset Vol</th>
                  <th className="px-6 py-4 hidden lg:table-cell">Manifest Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y border-gray-100 dark:border-white/[0.05] dark:divide-white/[0.05]">
                {filtered.map(catalog => {
                  const a = accent(catalog.template);
                  return (
                    <tr key={catalog._id} className="hover:bg-gray-50 dark:hover:bg-white/[0.01] transition-all group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center text-white font-black text-xs shadow-md"
                            style={{ background: catalog.coverImage?.url ? undefined : a, overflow: 'hidden' }}>
                            {catalog.coverImage?.url
                              ? <img src={catalog.coverImage.url} alt={catalog.name} className="w-full h-full object-cover" />
                              : catalog.name?.charAt(0)?.toUpperCase()}
                          </div>
                          <span className="font-black text-gray-900 dark:text-white text-[13px] uppercase tracking-tight">{catalog.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="text-[11px] font-bold text-gray-500 dark:text-[#5a5a7a] capitalize">{catalog.template?.replace(/-/g, ' ')}</span>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="text-sm font-black text-gray-700 dark:text-gray-300">{catalog.products?.length || 0}</span>
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">
                        <span className="text-xs font-bold text-gray-500 dark:text-[#5a5a7a]">{new Date(catalog.createdAt).toLocaleDateString()}</span>
                      </td>
                      <td className="px-6 py-4"><StatusBadge status={catalog.status} /></td>
                      <td className="px-6 py-4 flex justify-end gap-2 pr-6">
                        <button onClick={() => navigate('/dashboard/catalogs/' + catalog._id)} className="p-2 text-gray-400 hover:text-[#dc2626] transition-colors" title="View Catalog"><Eye className="w-4 h-4" /></button>
                        <button onClick={() => navigate('/dashboard/catalogs/' + catalog._id + '/edit')} className="p-2 text-gray-400 hover:text-[#dc2626] transition-colors" title="Edit Catalog"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => setDelTarget(catalog._id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Delete Catalog"><Trash2 className="w-4 h-4" /></button>
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
        title="Protocol: Deletion"
        message="Are you certain you wish to purge this catalogue? All visual assets and neural mappings will be lost forever."
        onConfirm={handleDelete}
        onClose={() => setDelTarget(null)}
        confirmLabel="Purge Record"
      />

      {aiOpen && (
        <AICatalogGenerator
          onClose={() => setAiOpen(false)}
          onCreated={fetchCatalogs}
        />
      )}
    </div>
  );
}