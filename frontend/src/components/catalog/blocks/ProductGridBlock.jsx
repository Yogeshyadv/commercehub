import React from 'react';
import { ShoppingCart, Eye } from 'lucide-react';

export default function ProductGridBlock({ block, onChange, isEditor, products = [] }) {
  const content = block.content || {};
  const settings = block.settings || {};

  const handleTextChange = (field, value) => {
    if (!isEditor || !onChange) return;
    onChange({
      ...block,
      content: { ...content, [field]: value }
    });
  };

  const gridCols = settings.columns === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' :
                   settings.columns === 2 ? 'grid-cols-1 sm:grid-cols-2' :
                   'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  // For visual builder preview, if no products, show skeletons
  const displayProducts = products.length > 0 ? products.slice(0, settings.columns || 3) : Array.from({ length: settings.columns || 3 });
  
  return (
    <div className="w-full py-24 px-6 md:px-12 bg-white dark:bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto space-y-16">
        <div className="text-center">
          {isEditor ? (
             <input
               type="text"
               className="text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white bg-transparent border-none outline-none focus:ring-1 focus:ring-black dark:focus:ring-white rounded py-2 text-center w-full max-w-2xl mx-auto tracking-tight font-serif"
               value={content.heading || ''}
               onChange={(e) => handleTextChange('heading', e.target.value)}
               placeholder="Featured Collection"
             />
          ) : (
            <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white tracking-tight font-serif">
              {content.heading}
            </h2>
          )}
          <div className="w-16 h-1 bg-black dark:bg-white mx-auto mt-6"></div>
        </div>

        <div className={`grid ${gridCols} gap-8 lg:gap-10`}>
          {displayProducts.map((prod, i) => (
            <div key={prod?._id || i} className="group relative flex flex-col h-full cursor-pointer">
              
              {/* Image Container */}
              <div className="relative aspect-[3/4] bg-gray-100 dark:bg-zinc-800 overflow-hidden mb-6">
                {prod?.images?.[0] ? (
                  <img 
                    src={prod.images[0].url} 
                    alt={prod.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                ) : (
                  <img
                    src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000&auto=format&fit=crop"
                    alt="Placeholder"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-80"
                  />
                )}
                
                {/* Hover overlay with Quick actions - Very Shopify-esque */}
                <div className="absolute inset-0 bg-black/5 dark:bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out flex gap-2">
                   <button className="flex-1 bg-white text-black font-semibold uppercase tracking-wider text-xs py-3.5 px-4 hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-2">
                     <ShoppingCart size={16} /> <span className="hidden sm:inline">Add</span>
                   </button>
                   <button className="bg-white text-black py-4 px-4 hover:bg-black hover:text-white transition-colors">
                     <Eye size={16} />
                   </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col text-center space-y-2">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white tracking-wide uppercase line-clamp-1">
                  {prod?.name || 'Minimalist Essential'}
                </h3>
                
                {(settings.showPrices ?? true) && (
                  <p className="text-base text-gray-600 dark:text-gray-400">
                    ${prod?.price || '89.00'}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}