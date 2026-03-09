import React, { useState, useEffect } from 'react';
import { X, Search } from 'lucide-react';
import { productService } from '../../services/productService';
import Loader from '../common/Loader';
import EmptyState from '../common/EmptyState';

export default function ProductSelectionModal({ isOpen, onClose, catalogProducts, onSave }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set(catalogProducts?.map(p => p.product._id || p.product) || []));

  useEffect(() => {
    if (isOpen) {
      loadProducts();
      setSelectedIds(new Set(catalogProducts?.map(p => p.product._id || p.product) || []));
    }
  }, [isOpen, catalogProducts]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await productService.getProducts({ limit: 50 });
      setProducts(response.data?.products || response.products || response.data || []);
    } catch (err) {
      console.error('Failed to load products', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleProduct = (id) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleSave = () => {
    onSave(Array.from(selectedIds));
    onClose();
  };

  const filtered = products.filter(p => p.title?.toLowerCase().includes(search.toLowerCase()));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white dark:bg-[#1f1f1f] rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-[#333] flex items-center justify-between bg-gray-50 dark:bg-[#111]">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white tracking-tight">Select Products</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-gray-100 dark:border-[#222]">
          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-[#111] text-sm text-gray-800 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-[#008060] focus:border-[#008060]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="flex justify-center p-8"><Loader /></div>
          ) : filtered.length === 0 ? (
             <EmptyState title="No products found" description="Try a different search term." />
          ) : (
            filtered.map((prod) => (
              <label key={prod._id} className="cursor-pointer flex items-center gap-4 p-3 rounded border border-gray-200 dark:border-[#333] hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors">
                <input
                  type="checkbox"
                  checked={selectedIds.has(prod._id)}
                  onChange={() => toggleProduct(prod._id)}
                  className="w-4 h-4 text-[#008060] rounded border-gray-300 focus:ring-[#008060]"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{prod.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">${prod.price}</p>
                </div>
              </label>
            ))
          )}
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-[#333] bg-gray-50 dark:bg-[#111] flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 rounded transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} className="px-4 py-2 bg-[#008060] hover:bg-[#006e52] text-white text-sm font-bold rounded shadow-sm transition-colors">
            Add {selectedIds.size > 0 && `(${selectedIds.size})`}
          </button>
        </div>
      </div>
    </div>
  );
}
