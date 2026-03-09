import React, { useState } from 'react';
import { X, Search, Filter, Check } from 'lucide-react';

const mockProducts = [
  { id: 1, title: 'Premium Cotton T-Shirt', sku: 'TS-001', price: 29.99, stock: 145, img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=150&q=80' },
  { id: 2, title: 'Classic Denim Jacket', sku: 'JK-002', price: 89.99, stock: 32, img: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=150&q=80' },
  { id: 3, title: 'Minimalist White Sneakers', sku: 'SN-003', price: 119.99, stock: 0, img: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=150&q=80' }
];

export default function ProductPicker({ isOpen = true, onClose }) {
  const [selected, setSelected] = useState(new Set([1]));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col h-[75vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900 tracking-tight">Select Products</h2>
            <p className="text-xs text-gray-500">Attach inventory to your template section.</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-200 rounded-md text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-gray-200 flex gap-3 bg-white flex-shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search by name, SKU..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-[#008060] focus:border-[#008060] outline-none" />
          </div>
          <select className="border border-gray-300 rounded-lg text-sm px-3 py-2 bg-white outline-none focus:ring-1 focus:ring-[#008060]">
            <option>All Categories</option>
            <option>Apparel</option>
            <option>Footwear</option>
          </select>
          <select className="border border-gray-300 rounded-lg text-sm px-3 py-2 bg-white outline-none focus:ring-1 focus:ring-[#008060]">
            <option>Status: All</option>
            <option>In Stock</option>
            <option>Out of Stock</option>
          </select>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2 bg-gray-50">
          <table className="w-full text-left border-collapse bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <thead className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider sticky top-0 z-10">
              <tr>
                <th className="p-3 w-12 text-center">
                   <input type="checkbox" className="rounded border-gray-300 text-[#008060] focus:ring-[#008060]" />
                </th>
                <th className="p-3">Product</th>
                <th className="p-3">Price</th>
                <th className="p-3 text-right">Inventory</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockProducts.map(p => {
                const isSelected = selected.has(p.id);
                return (
                  <tr 
                    key={p.id} 
                    onClick={() => {
                      const next = new Set(selected);
                      next.has(p.id) ? next.delete(p.id) : next.add(p.id);
                      setSelected(next);
                    }}
                    className={`cursor-pointer transition-colors ${isSelected ? 'bg-[#008060]/5 hover:bg-[#008060]/10' : 'hover:bg-gray-50'}`}
                  >
                    <td className="p-3 text-center align-middle">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center mx-auto ${isSelected ? 'bg-[#008060] border-[#008060]' : 'border-gray-300 bg-white'}`}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </td>
                    <td className="p-3 flex items-center gap-3">
                      <img src={p.img} alt="" className="w-10 h-10 rounded object-cover shadow-sm bg-gray-100" />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{p.title}</p>
                        <p className="text-xs text-gray-500 font-mono mt-0.5">{p.sku}</p>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-gray-900 font-medium">${p.price}</td>
                    <td className="p-3 text-right">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${p.stock > 0 ? 'bg-red-100 text-red-800' : 'bg-red-100 text-red-800'}`}>
                        {p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 bg-white flex justify-between items-center flex-shrink-0">
          <span className="text-sm font-medium text-gray-600">{selected.size} product{selected.size !== 1 && 's'} selected</span>
          <div className="flex gap-3">
            <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">Cancel</button>
            <button className="px-6 py-2 bg-[#008060] hover:bg-[#006e52] text-white text-sm font-bold rounded-lg shadow-sm transition-colors">
              Add to Template
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
