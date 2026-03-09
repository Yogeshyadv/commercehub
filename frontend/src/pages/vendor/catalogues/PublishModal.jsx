import React, { useState } from 'react';
import { X, Globe, Lock, Link as LinkIcon, Smartphone, CheckCircle2, Loader2 } from 'lucide-react';
import { catalogService } from '../../../services/catalogService';
import toast from 'react-hot-toast';

export default function PublishModal({ isOpen = true, onClose, catalog, onPublished }) {
  const [visibility, setVisibility] = useState('public');
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);

  if (!isOpen) return null;

  const shareableLink = catalog?.sharing?.shareableLink || '';
  const url = shareableLink
    ? window.location.origin + '/catalog/' + shareableLink
    : window.location.origin + '/catalog/...';

  const copyLink = () => {
    if (!shareableLink) return;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOnWhatsApp = () => {
    if (!shareableLink) return;
    window.open('https://wa.me/?text=' + encodeURIComponent('Check out my catalog: ' + url), '_blank');
  };

  const handlePublish = async () => {
    if (!catalog?._id) return;
    setSaving(true);
    try {
      await catalogService.updateCatalog(catalog._id, {
        status: 'published',
        'sharing.isPublic': visibility === 'public',
      });
      toast.success('Catalog is now live!');
      if (onPublished) onPublished();
      onClose();
    } catch {
      toast.error('Failed to publish catalog.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] bg-gray-900/60 flex items-center justify-center p-4 backdrop-blur-sm font-sans">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Publish Catalogue</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          
          {/* URL Display */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Public Catalog URL</label>
            <div className="flex border border-gray-300 rounded-lg overflow-hidden bg-gray-50 px-3 py-2.5">
              <span className="text-sm text-gray-700 truncate flex-1 font-mono">{url}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Customers will use this link to access your catalog.</p>
          </div>

          {/* Visibility Options */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Visibility</label>
            <div className="space-y-3">
              <label className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${visibility === 'public' ? 'border-[#008060] bg-[#008060]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="vis" checked={visibility === 'public'} onChange={() => setVisibility('public')} className="mt-1 w-4 h-4 text-[#008060] focus:ring-[#008060]" />
                <div>
                  <div className="flex items-center gap-2 font-bold text-sm text-gray-900"><Globe className="w-4 h-4 text-gray-500"/> Public</div>
                  <p className="text-xs text-gray-500 mt-1">Anyone on the internet can find and access.</p>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${visibility === 'password' ? 'border-[#008060] bg-[#008060]/5' : 'border-gray-200 hover:border-gray-300'}`}>
                <input type="radio" name="vis" checked={visibility === 'password'} onChange={() => setVisibility('password')} className="mt-1 w-4 h-4 text-[#008060] focus:ring-[#008060]" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-bold text-sm text-gray-900"><Lock className="w-4 h-4 text-gray-500"/> Password Protected</div>
                  <p className="text-xs text-gray-500 mt-1 mb-3">Only visitors with the password can access.</p>
                  {visibility === 'password' && (
                    <input type="text" placeholder="Enter password..." className="w-full text-sm border border-gray-300 rounded px-3 py-2 outline-none focus:border-[#008060]" />
                  )}
                </div>
              </label>
            </div>
          </div>

          {/* Share Block Preview */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 flex items-center justify-between gap-4">
            <div className="flex-1 truncate">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Preview Link</p>
              <a href={url} className="text-sm font-medium text-blue-600 hover:underline truncate block">{url}</a>
            </div>
            <div className="flex gap-2 flex-shrink-0">
               <button onClick={copyLink} className="p-2 bg-white border border-gray-200 shadow-sm rounded-lg hover:bg-gray-100 text-gray-600 transition-colors" title="Copy Link">
                 {copied ? <CheckCircle2 className="w-5 h-5 text-red-600" /> : <LinkIcon className="w-5 h-5" />}
               </button>
               <button onClick={shareOnWhatsApp} className="p-2 bg-[#DC2626] shadow-sm rounded-lg hover:bg-[#1ebd5d] text-white transition-colors" title="Share on WhatsApp">
                 <Smartphone className="w-5 h-5" />
               </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-3 justify-end items-center">
          <button onClick={onClose} className="w-full sm:w-auto px-5 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-200 rounded-lg transition-colors">
            Cancel
          </button>
          <button
            onClick={handlePublish}
            disabled={saving || !catalog?._id}
            className="w-full sm:w-auto px-6 py-2.5 bg-[#008060] hover:bg-[#006e52] text-white text-sm font-bold rounded-lg shadow-md transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {saving ? 'Publishing...' : 'Publish Now'}
          </button>
        </div>

      </div>
    </div>
  );
}
