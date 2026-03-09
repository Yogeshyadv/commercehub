import React from 'react';

export default function HeroBlock({ block, onChange, isEditor }) {
  const content = block.content || {};
  const settings = block.settings || {};

  const handleTextChange = (field, value) => {
    if (!isEditor || !onChange) return;
    onChange({
      ...block,
      content: { ...content, [field]: value }
    });
  };

  const alignClass = settings.alignment === 'left' ? 'text-left items-start' :
                     settings.alignment === 'right' ? 'text-right items-end' :
                     'text-center items-center';

  const alignText = settings.alignment === 'left' ? 'left' :
                    settings.alignment === 'right' ? 'right' : 'center';

  // Use the user's background image or a high-end fashion/lifestyle Unsplash placeholder
  const bgImage = content.backgroundImage || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2670&auto=format&fit=crop';
  
  // Opacity setting
  const overlayOpacity = settings.overlayOpacity !== undefined ? settings.overlayOpacity : 0.35;

  return (
    <div 
      className={`relative w-full flex flex-col justify-center min-h-[85vh] md:min-h-[90vh] overflow-hidden bg-zinc-900 group`}
    >
      {/* Background Image with subtle zoom on hover */}
      <div 
        className={`absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-[20s] ${isEditor ? '' : 'group-hover:scale-105'}`}
        style={{ backgroundImage: `url('${bgImage}')` }}
      />
      
      {/* Dark Overlay for Text Readability */}
      <div 
        className="absolute inset-0 bg-black transition-opacity duration-700"
        style={{ opacity: overlayOpacity }}
      />

      <div className={`relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 xl:px-24 flex flex-col ${alignClass} space-y-6 md:space-y-10`}>
        {isEditor ? (
          <input
            type="text"
            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white bg-transparent border-none outline-none focus:ring-1 focus:ring-white/50 rounded p-0 w-full tracking-tight drop-shadow-md placeholder-white/30 transition-all font-sans"
            value={content.title || ''}
            onChange={(e) => handleTextChange('title', e.target.value)}
            placeholder="Hero Title"
            style={{ textAlign: alignText }}
          />
        ) : (
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight drop-shadow-md leading-[1.1] font-sans">
            {content.title}
          </h1>
        )}

        {isEditor ? (
          <textarea
            className="text-lg md:text-2xl text-white/90 font-light bg-transparent border-none outline-none focus:ring-1 focus:ring-white/50 rounded p-0 w-full resize-none max-w-3xl drop-shadow placeholder-white/30 transition-all"
            value={content.subtitle || ''}
            onChange={(e) => handleTextChange('subtitle', e.target.value)}
            placeholder="Enter a captivating subtitle..."
            style={{ textAlign: alignText }}
            rows={2}
          />
        ) : (
          <p className="text-lg md:text-2xl text-white/90 font-light max-w-3xl drop-shadow leading-relaxed">
            {content.subtitle}
          </p>
        )}

        {content.buttonText && (
          <div className="pt-4 md:pt-8 w-full max-w-3xl">
            {isEditor ? (
               <div style={{ textAlign: alignText }}>
                 <input
                  type="text"
                  className="inline-block px-10 py-4 lg:px-12 lg:py-5 bg-white text-black font-semibold text-sm lg:text-base uppercase tracking-widest cursor-text outline-none focus:ring-2 focus:ring-black transition-colors min-w-[200px]"
                  value={content.buttonText}
                  onChange={(e) => handleTextChange('buttonText', e.target.value)}
                  style={{ textAlign: 'center' }}
                 />
               </div>
            ) : (
              <div style={{ textAlign: alignText }}>
                <button 
                  className="inline-block px-10 py-4 lg:px-12 lg:py-5 bg-white text-black font-semibold text-sm lg:text-base uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300 shadow-xl border border-transparent hover:border-white"
                >
                  {content.buttonText}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}