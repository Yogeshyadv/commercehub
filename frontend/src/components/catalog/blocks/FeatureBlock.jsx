import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function FeatureBlock({ block, onChange, isEditor }) {
  const content = block.content || {};
  const settings = block.settings || {};

  const handleTextChange = (field, value) => {
    if (!isEditor || !onChange) return;
    onChange({
      ...block,
      content: { ...content, [field]: value }
    });
  };

  const isImageRight = settings.layout === 'image-right';

  // Use the block background or a stylish default
  const defaultImage = 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=2670&auto=format&fit=crop';
  const imgUrl = content.image || defaultImage;

  return (
    <div className="w-full bg-[#f9f9f9] dark:bg-[#111] overflow-hidden">
      <div className={`flex flex-col ${isImageRight ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-stretch w-full min-h-[600px] lg:min-h-[80vh]`}>
        
        {/* Full Bleed Image Half */}
        <div className="flex-1 relative min-h-[400px] lg:min-h-full">
          <div 
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url('${imgUrl}')` }}
          />
        </div>

        {/* Content Half */}
        <div className="flex-1 flex flex-col justify-center px-8 py-20 lg:px-20 xl:px-32 space-y-8 bg-white dark:bg-zinc-950">
          
          <div className="w-12 h-1 bg-black dark:bg-white mb-4"></div>

          {isEditor ? (
             <textarea
               className="text-4xl lg:text-5xl xl:text-6xl font-medium text-gray-900 dark:text-white bg-transparent border-none outline-none focus:ring-1 focus:ring-black dark:focus:ring-white rounded py-2 px-0 w-full leading-tight font-serif resize-none"
               value={content.heading || ''}
               onChange={(e) => handleTextChange('heading', e.target.value)}
               placeholder="Editorial Feature Heading"
               rows={2}
             />
          ) : (
            <h2 className="text-4xl lg:text-5xl xl:text-6xl font-medium text-gray-900 dark:text-white leading-[1.1] font-serif tracking-tight">
              {content.heading}
            </h2>
          )}

          {isEditor ? (
             <textarea
               className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 bg-transparent border-none outline-none focus:ring-1 focus:ring-black dark:focus:ring-white rounded py-2 px-0 w-full resize-none leading-relaxed font-light"
               value={content.description || ''}
               onChange={(e) => handleTextChange('description', e.target.value)}
               placeholder="Write a compelling story about your brand or collection..."
               rows={5}
             />
          ) : (
            <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-400 leading-relaxed font-light">
              {content.description}
            </p>
          )}

           <div className="pt-8">
              <button 
                className="group flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                DISCOVER MORE
                <span className="w-10 h-[1.5px] bg-black dark:bg-white group-hover:w-16 transition-all duration-300 relative">
                   <ArrowRight size={14} className="absolute -right-1 -top-[6px]" />
                </span>
              </button>
           </div>
        </div>

      </div>
    </div>
  );
}