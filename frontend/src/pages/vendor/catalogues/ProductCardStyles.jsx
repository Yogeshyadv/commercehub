import React from 'react';
import { ShoppingCart, Star, Heart } from 'lucide-react';

const placeholderImg = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80";

export default function ProductCardStyles() {
  return (
    <div className="p-10 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Product Card Styles Showcase</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">

        {/* Style 1: Basic (Image + Title + Price) */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">1. Basic / Standard</h2>
          <div className="group">
            <div className="aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden mb-3">
              <img src={placeholderImg} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
            </div>
            <h3 className="font-semibold text-gray-900 text-sm">Nike Air Max 270</h3>
            <p className="text-gray-500 text-sm mt-1">$129.99</p>
          </div>
        </div>

        {/* Style 2: With Rating */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">2. E-Commerce Detailed</h2>
          <div className="group bg-white p-3 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4">
              <img src={placeholderImg} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" alt="" />
            </div>
            <div className="flex items-center gap-1 mb-1">
               <div className="flex text-yellow-400"><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 fill-current"/><Star className="w-3 h-3 text-gray-300"/></div>
               <span className="text-[10px] text-gray-400">(42)</span>
            </div>
            <h3 className="font-bold text-gray-900 text-sm truncate">Nike Air Max 270 React</h3>
            <div className="flex items-baseline gap-2 mt-1">
              <p className="font-extrabold text-[#008060]">$129.99</p>
              <p className="text-xs text-gray-400 line-through">$159.99</p>
            </div>
          </div>
        </div>

        {/* Style 3: Action Heavy */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">3. Action Heavy</h2>
          <div className="group border border-gray-200 rounded-xl overflow-hidden bg-white flex flex-col h-full">
            <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
              <img src={placeholderImg} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
              <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full text-gray-600 hover:text-red-500 hover:bg-white transition-colors opacity-0 group-hover:opacity-100 shadow-sm">
                <Heart className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="font-bold text-gray-900 text-[15px] mb-1">Premium Runner</h3>
              <p className="text-xs text-gray-500 line-clamp-2 mb-4 flex-1">Constructed with high-quality aerodynamic mesh and superior sole padding.</p>
              <div className="flex items-center justify-between mt-auto">
                <span className="font-bold text-lg text-gray-900">$129.99</span>
                <button className="bg-black hover:bg-gray-800 text-white p-2.5 rounded-lg transition-colors">
                  <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Style 4: Minimal */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">4. Ultra Minimal</h2>
          <div className="group cursor-pointer">
            <div className="aspect-square bg-gray-100 overflow-hidden">
              <img src={placeholderImg} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="" />
            </div>
            <div className="mt-4 flex justify-between items-start">
              <div>
                <h3 className="font-medium text-black">Nike Runner</h3>
                <p className="text-gray-500 text-sm mt-0.5">Men's Shoes</p>
              </div>
              <span className="font-medium text-black">$129</span>
            </div>
          </div>
        </div>

        {/* Style 5: Premium Shadow */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">5. Premium Floating</h2>
          <div className="group bg-white rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-50 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer">
            <div className="bg-gray-50 aspect-square rounded-2xl overflow-hidden mb-6 relative">
               <div className="absolute top-3 left-3 bg-black text-white text-xs font-bold px-2 py-1 rounded">NEW</div>
               <img src={placeholderImg} className="w-full h-full object-cover mix-blend-multiply" alt="" />
            </div>
            <h3 className="font-extrabold text-xl tracking-tight text-gray-900">Nike Air Max</h3>
            <p className="text-gray-500 text-sm mt-1 mb-4">Color: Glacier White</p>
            <div className="flex items-center justify-between">
              <span className="font-black text-xl">$129.99</span>
              <button className="px-5 py-2 bg-black text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors">Add</button>
            </div>
          </div>
        </div>

        {/* Style 6: Rounded Full Bleed */}
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wider">6. Full Bleed Card</h2>
          <div className="relative group rounded-2xl overflow-hidden aspect-[4/5] cursor-pointer">
            <img src={placeholderImg} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
               <h3 className="font-bold text-white text-xl drop-shadow-md">Nike Off-White</h3>
               <div className="flex justify-between items-end mt-2">
                 <p className="text-gray-200 font-medium">$129.99</p>
                 <button className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-xl hover:bg-gray-100">
                   <ShoppingCart className="w-4 h-4" />
                 </button>
               </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
