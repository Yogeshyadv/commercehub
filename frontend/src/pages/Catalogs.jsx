import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Wand2, Sparkles, LayoutTemplate, 
  MoreVertical, Share2, Edit, Trash2, ExternalLink, Loader2
} from 'lucide-react';
import { catalogService } from '../services/catalogService';
import { aiService } from '../services/aiService';
import { useAuth } from '../context/AuthContext';
import ConfirmDialog from '../components/common/ConfirmDialog';
import toast from 'react-hot-toast';

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
      toast.error('Failed to load catalogs');
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
      toast.error('Please describe what you want to create!');
      return;
    }
    
    setIsGenerating(true);
    try {
      setGenerationStep('✨ Analyzing your prompt...');
      const { data } = await aiService.generateCatalog(aiPrompt);
      
      setGenerationStep('🎨 Designing beautiful layout blocks...');
      
      const submitData = {
        name: data.name || 'AI Generated Catalog',
        description: data.description || '',
        template: 'modern-blocks',
        status: 'published', // Setting strictly to Published so it works right away!
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

      setGenerationStep('🚀 Finalizing catalog...');
      const res = await catalogService.createCatalog(submitData);
      const catalogId = res.data._id;
      
      toast.success('Catalog generated successfully!');
      
      // Auto redirect to Theme page visually building it!
      navigate(`/dashboard/catalogs/${catalogId}/theme`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to auto-generate catalog. Please try again.');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
      setAiPrompt('');
    }
  };

  const handleStartBlank = async () => {
    try {
      setIsGenerating(true);
      setGenerationStep('Creating blank canvas...');
      const res = await catalogService.createCatalog({
        name: 'Untitled Catalog',
        description: '',
        template: 'modern-blocks',
        status: 'draft',
        isPublic: true,
        blocks: [],
        design: { backgroundColor: '#f8f9fa', textColor: '#111827', accentColor: '#4f46e5', fontFamily: 'Inter' }
      });
      navigate(`/dashboard/catalogs/${res.data._id}/theme`);
    } catch {
      toast.error('Failed to create blank catalog');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const handleDelete = async () => {
    if (!delTarget) return;
    try {
      await catalogService.deleteCatalog(delTarget._id);
      toast.success('Catalog deleted');
      setDelTarget(null);
      fetchCatalogs();
    } catch {
      toast.error('Failed to delete');
    }
  };

  const copyShareLink = (catalog) => {
    const link = `${window.location.origin}/catalog/${catalog.sharing?.shareableLink}`;
    navigator.clipboard.writeText(link);
    toast.success('Public link copied to clipboard!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Venngage/Canva Style Hero Section */}
      <div className="relative mb-16 rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 text-white shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        
        <div className="relative px-8 py-16 md:py-24 md:px-16 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            What will you create today?
          </h1>
          <p className="text-lg md:text-xl text-indigo-200 max-w-2xl mx-auto mb-10">
            Describe your perfect catalog, portfolio, or showcase. Our AI will instantly build a stunning, interactive layout for you to customize.
          </p>

          <form onSubmit={handleGenerateCatalog} className="max-w-4xl mx-auto relative">
            <div className="relative flex items-center bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 shadow-inner focus-within:ring-2 focus-within:ring-white/50 transition-all">
              <div className="pl-4 text-indigo-300">
                <Wand2 className="w-6 h-6" />
              </div>
              <input 
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. 'A sleek modern portfolio for a minimalist furniture brand with dark mode'"
                className="w-full bg-transparent text-white placeholder-indigo-300 px-4 py-4 text-lg outline-none"
                disabled={isGenerating}
              />
              <button
                type="submit"
                disabled={isGenerating || !aiPrompt.trim()}
                className="absolute right-2 px-8 py-3 bg-white text-indigo-900 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg disabled:opacity-50 flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate
                  </>
                )}
              </button>
            </div>
            
            {/* Loading text under input when generating */}
            {isGenerating && (
              <div className="mt-4 text-sm font-medium text-indigo-200 animate-pulse">
                {generationStep}
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Your Catalogs Section */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Your Projects</h2>
        {isVendor && (
          <button 
            onClick={handleStartBlank} 
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            Start Blank Canvas
          </button>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white border border-gray-100 rounded-2xl h-80 animate-pulse"></div>
          ))}
        </div>
      ) : catalogs.length === 0 ? (
        <div className="text-center py-24 bg-white border border-dashed border-gray-300 rounded-3xl">
          <LayoutTemplate className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">No catalogs yet</h3>
          <p className="text-gray-500 max-w-sm mx-auto">Type a prompt above to instantly generate your first beautiful catalog, or start from scratch.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {catalogs.map(catalog => (
            <div key={catalog._id} className="group relative bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
              
              {/* Preview Thumbnail Area */}
              <div 
                onClick={() => navigate(`/dashboard/catalogs/${catalog._id}/theme`)}
                className="h-56 bg-gray-100 relative cursor-pointer overflow-hidden"
                style={{ backgroundColor: catalog.design?.backgroundColor || '#f4f4f5' }}
              >
                {catalog.coverImage?.url ? (
                  <img src={catalog.coverImage.url} alt={catalog.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 group-hover:scale-105 transition-transform duration-500">
                     <LayoutTemplate className="w-16 h-16 mb-3 opacity-30" />
                     <span className="text-sm font-medium">Visual Canvas</span>
                  </div>
                )}
                
                {/* Overlay edit button */}
                <div className="absolute inset-0 bg-indigo-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                  <div className="px-6 py-2.5 bg-white text-indigo-900 rounded-full font-bold shadow-xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <Edit className="w-4 h-4" />
                    Edit Design
                  </div>
                </div>
              </div>

              {/* Details Area */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div className="pr-6">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{catalog.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1 mt-1">{catalog.description || 'AI Generated Storefront'}</p>
                  </div>
                  
                  {/* Context Menu */}
                  <div className="relative">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setActiveMenu(activeMenu === catalog._id ? null : catalog._id); }}
                      className="p-1.5 text-gray-400 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </button>
                    {activeMenu === catalog._id && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-50">
                        <button onClick={(e) => { e.stopPropagation(); navigate(`/dashboard/catalogs/${catalog._id}`); }} className="w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-gray-50 text-gray-700 flex items-center">
                          <Edit className="w-4 h-4 mr-3 text-gray-400" /> Catalog Settings
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); copyShareLink(catalog); }} className="w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-gray-50 text-gray-700 flex items-center">
                          <Share2 className="w-4 h-4 mr-3 text-gray-400" /> Share Public Link
                        </button>
                        <hr className="my-1 border-gray-100" />
                        <button onClick={(e) => { e.stopPropagation(); setDelTarget(catalog); setActiveMenu(null); }} className="w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-red-50 text-red-600 flex items-center">
                          <Trash2 className="w-4 h-4 mr-3" /> Delete Project
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wide ${
                    catalog.status === 'published' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {catalog.status}
                  </span>
                  
                  {catalog.status === 'published' && catalog.sharing?.shareableLink && (
                    <a 
                      href={`/catalog/${catalog.sharing.shareableLink}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 text-sm font-semibold"
                      onClick={e => e.stopPropagation()}
                    >
                      <ExternalLink className="w-4 h-4" />
                      View Live
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog 
        isOpen={!!delTarget} 
        onClose={() => setDelTarget(null)} 
        onConfirm={handleDelete} 
        title="Delete Project" 
        message={`Are you sure you want to delete "${delTarget?.name}"? This action cannot be undone.`}
        confirmText="Delete Permanently" 
        isDestructive={true} 
      />
    </div>
  );
}
