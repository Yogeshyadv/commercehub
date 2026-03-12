import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Wand2, Sparkles, LayoutTemplate, 
  MoreVertical, Share2, Edit, Trash2, ExternalLink, Loader2,
  X, Layers, Globe, Clock
} from 'lucide-react';
import { catalogService } from '../services/catalogService';
import { aiService } from '../services/aiService';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Badge from '../components/common/Badge';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

/* -- Design tokens -------------------------------------------- */
const CARD = 'bg-white dark:bg-[#0d0d0d] rounded-2xl shadow-sm border border-gray-100 dark:border-white/[0.07]';
const DIV  = 'border-gray-100 dark:border-white/[0.07]';
const SUB  = 'text-gray-400 dark:text-[#5a5a7a]';

export default function Catalogs() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isVendor = user?.role === 'vendor' || user?.role === 'vendor_staff' || user?.role === 'super_admin';

  const [catalogs, setCatalogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  
  const [delTarget, setDelTarget] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);

  const fetchCatalogs = useCallback(async () => {
    try {
      setLoading(true);
      const r = await catalogService.getCatalogs({ limit: 50 });
      setCatalogs(r.data || []);
    } catch {
      toast.error('Sync error with catalog mainframe');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCatalogs(); }, [fetchCatalogs]);

  useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleGenerateCatalog = async (e) => {
    e.preventDefault();
    if (!aiPrompt.trim()) {
      toast.error('Prompt required for synthesis!');
      return;
    }
    
    setIsGenerating(true);
    try {
      setGenerationStep('✨ Analyzing semantic intent...');
      const { data } = await aiService.generateCatalog(aiPrompt);
      
      setGenerationStep('🎨 Constructing layout primitives...');
      
      const submitData = {
        name: data.name || 'AI Generated Catalog',
        description: data.description || '',
        template: 'modern-blocks',
        status: 'published',
        isPublic: true,
        tags: data.tags || [],
        categories: data.categories || [],
        blocks: data.blocks || [],
        design: data.design ? {
          backgroundColor: data.design.backgroundColor || '#f8f9fa',
          textColor: data.design.textColor || '#111827',
          accentColor: data.design.accentColor || '#4f46e5',
          fontFamily: data.design.fontFamily || 'Inter',
          showPrices: true,
          showDescription: true,
          productsPerRow: 3
        } : { backgroundColor: '#f8f9fa', textColor: '#111827', accentColor: '#4f46e5' }
      };

      setGenerationStep('🚀 Materializing catalog...');
      const res = await catalogService.createCatalog(submitData);
      const catalogId = res.data._id;
      
      toast.success('Catalog manifested successfully!');
      navigate(`/dashboard/catalogs/${catalogId}/theme`);
    } catch (error) {
      console.error(error);
      toast.error('AI synthesis failure. Retrying protocol...');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
      setAiPrompt('');
    }
  };

  const handleStartBlank = async () => {
    try {
      setIsGenerating(true);
      setGenerationStep('Initializing blank canvas...');
      const res = await catalogService.createCatalog({
        name: 'Untitled Collection',
        description: '',
        template: 'modern-blocks',
        status: 'draft',
        isPublic: true,
        blocks: [],
        design: { backgroundColor: '#f8f9fa', textColor: '#111827', accentColor: '#4f46e5', fontFamily: 'Inter' }
      });
      navigate(`/dashboard/catalogs/${res.data._id}/theme`);
    } catch {
      toast.error('Canvas initialization failed');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handleDelete = async () => {
    if (!delTarget) return;
    try {
      await catalogService.deleteCatalog(delTarget._id);
      toast.success('Catalog expunged');
      setDelTarget(null);
      fetchCatalogs();
    } catch {
      toast.error('Deletion failure');
    }
  };

  const copyShareLink = (catalog) => {
    const link = `${window.location.origin}/catalog/${catalog.sharing?.shareableLink}`;
    navigator.clipboard.writeText(link);
    toast.success('Public URL captured');
  };

  return (
    <div className="max-w-[1240px] mx-auto space-y-8 pb-12 animate-in fade-in duration-500">
      
      {/* AI Generator Hero Section */}
      <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-[#0a0a0d] via-[#1a1a2e] to-[#0a0a0d] text-white shadow-2xl border border-white/[0.05]">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#dc2626]/20 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]"></div>
        
        <div className="relative px-8 py-20 text-center">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-5 bg-clip-text text-transparent bg-gradient-to-r from-white via-red-100 to-indigo-100">
              Future of Visual Commerce
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12 font-medium">
              Describe your vision. Our neural engine will synthesize a stunning, reactive catalog for your brand in seconds.
            </p>
          </motion.div>

          <form onSubmit={handleGenerateCatalog} className="max-w-3xl mx-auto relative px-4">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#dc2626] to-indigo-600 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition duration-1000"></div>
              <div className="relative flex items-center bg-[#121216]/80 backdrop-blur-2xl rounded-2xl p-2 border border-white/[0.08] shadow-2xl">
                <Wand2 className="w-6 h-6 ml-4 text-[#dc2626]" />
                <input 
                  type="text"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="Describe your catalog theme... e.g. 'Luxury watch collection with obsidian aesthetic'"
                  className="w-full bg-transparent text-white placeholder-gray-500 px-5 py-4 text-base font-medium outline-none"
                  disabled={isGenerating}
                />
                <button
                  type="submit"
                  disabled={isGenerating || !aiPrompt.trim()}
                  className="px-8 py-3.5 bg-white text-black font-black rounded-xl hover:bg-red-50 transition-all shadow-xl disabled:opacity-50 flex items-center gap-2.5 active:scale-95"
                >
                  {isGenerating ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                  Synthesize
                </button>
              </div>
            </div>
            
            <AnimatePresence>
                {isGenerating && (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-6 text-[13px] font-black text-red-500 uppercase tracking-widest animate-pulse"
                >
                    {generationStep}
                </motion.div>
                )}
            </AnimatePresence>
          </form>
        </div>
      </div>

      {/* Projects Grid Container */}
      <div className="space-y-6">
        <div className="flex items-end justify-between px-2">
            <div>
                <p className="text-[13px] font-bold uppercase tracking-widest text-[#dc2626] mb-1">Canvas</p>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Project Directory</h2>
            </div>
            {isVendor && (
            <button 
                onClick={handleStartBlank} 
                className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-white/[0.04] text-gray-900 dark:text-gray-300 font-black text-sm rounded-xl border border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/[0.08] transition-all shadow-sm active:scale-95"
            >
                <Plus className="w-4 h-4" />
                Blank Canvas
            </button>
            )}
        </div>

        {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
                <div key={i} className="bg-white dark:bg-black/20 border border-gray-100 dark:border-white/[0.05] rounded-[24px] h-[360px] animate-pulse"></div>
            ))}
            </div>
        ) : catalogs.length === 0 ? (
            <div className="text-center py-24 bg-gray-50/50 dark:bg-white/[0.02] border border-dashed border-gray-200 dark:border-white/10 rounded-[32px]">
            <LayoutTemplate className="w-16 h-16 text-gray-200 dark:text-white/5 mx-auto mb-4" />
            <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2 uppercase tracking-wide">Digital Void</h3>
            <p className="text-gray-400 max-w-sm mx-auto font-medium">No catalogs found in system records. Initiate a synthesis request above to begin.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {catalogs.map(catalog => (
                <div key={catalog._id} className={`${CARD} group flex flex-col hover:shadow-2xl hover:shadow-black/10 dark:hover:shadow-black/40 transition-all duration-500 overflow-hidden`}>
                
                {/* Visual Interface */}
                <div 
                    onClick={() => navigate(`/dashboard/catalogs/${catalog._id}/theme`)}
                    className="h-[240px] relative cursor-pointer overflow-hidden bg-gray-50 dark:bg-white/[0.02]"
                >
                    {catalog.coverImage?.url ? (
                    <img src={catalog.coverImage.url} alt={catalog.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 dark:text-white/5 opacity-50">
                        <Layers className="w-12 h-12 mb-3" />
                        <span className="text-[11px] font-black uppercase tracking-widest">Asset Missing</span>
                    </div>
                    )}
                    
                    {/* Interaction Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                    <div className="px-6 py-3 bg-white text-black rounded-xl font-black text-sm shadow-2xl flex items-center gap-2.5 transform translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                        <Edit className="w-4 h-4" />
                        Visual Editor
                    </div>
                    </div>
                </div>

                {/* Information Node */}
                <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                    <div className="pr-4 min-w-0">
                        <h3 className="font-black text-lg text-gray-900 dark:text-white truncate uppercase tracking-tight">{catalog.name}</h3>
                        <p className={`text-xs font-bold ${SUB} truncate mt-1 tracking-wide`}>{catalog.description || 'Neural Composite Interface'}</p>
                    </div>
                    
                    <div className="relative shrink-0">
                        <button 
                        onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === catalog._id ? null : catalog._id); }}
                        className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                        >
                        <MoreVertical className="w-5 h-5" />
                        </button>
                        <AnimatePresence>
                            {activeMenu === catalog._id && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className={`absolute right-0 top-full mt-2 w-52 ${CARD} shadow-2xl py-2 z-50`}
                            >
                                <button onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/catalogs/${catalog._id}`); }} className="w-full px-4 py-2.5 text-left text-[13px] font-bold hover:bg-gray-50 dark:hover:bg-white/[0.04] text-gray-700 dark:text-gray-200 flex items-center gap-3">
                                <Plus className="w-4 h-4 text-gray-400" /> Catalog Config
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); copyShareLink(catalog); }} className="w-full px-4 py-2.5 text-left text-[13px] font-bold hover:bg-gray-50 dark:hover:bg-white/[0.04] text-gray-700 dark:text-gray-200 flex items-center gap-3">
                                <Share2 className="w-4 h-4 text-gray-400" /> Public Link
                                </button>
                                <div className={`h-px my-1.5 ${DIV}`} />
                                <button onClick={(e) => { e.stopPropagation(); setDelTarget(catalog); setActiveMenu(null); }} className="w-full px-4 py-2.5 text-left text-[13px] font-black text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 flex items-center gap-3">
                                <Trash2 className="w-4 h-4" /> Purge Project
                                </button>
                            </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    </div>
                    
                    <div className="mt-auto pt-5 flex items-center justify-between border-t border-gray-100 dark:border-white/[0.05]">
                    <Badge color={catalog.status === 'published' ? 'red' : 'yellow'}>
                        {catalog.status === 'published' ? 'Live Channel' : 'Staging'}
                    </Badge>
                    
                    {catalog.status === 'published' && catalog.sharing?.shareableLink && (
                        <a 
                        href={`/catalog/${catalog.sharing.shareableLink}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#dc2626] flex items-center gap-2 text-xs font-black uppercase tracking-widest hover:opacity-80 transition-opacity"
                        onClick={e => e.stopPropagation()}
                        >
                        <Globe className="w-3.5 h-3.5" />
                        Preview
                        </a>
                    )}
                    </div>
                </div>
                </div>
            ))}
            </div>
        )}
      </div>

      <ConfirmDialog 
        isOpen={!!delTarget} 
        onClose={() => setDelTarget(null)} 
        onConfirm={handleDelete} 
        title="Protocol: Deletion" 
        message={`Are you certain you wish to purge "${delTarget?.name}"? All visual assets and neural mappings will be lost forever.`}
        confirmLabel="Purge Permanently" 
        variant="danger" 
      />
    </div>
  );
}
