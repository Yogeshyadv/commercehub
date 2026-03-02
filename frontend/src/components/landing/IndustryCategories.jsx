import React from 'react';
import { motion } from 'framer-motion';
import {
  Shirt, Sparkles, Smartphone, Armchair, Gamepad2, Palette, Wrench,
  Home, Gem, Stethoscope, Flower2, Package, Footprints, Utensils,
  BookOpen, Car, Music, Camera, Watch, Briefcase, ShoppingBag, ArrowRight
} from 'lucide-react';

const industries = [
  { name: 'Fashion & Apparel', icon: Shirt, count: '2.4k+' },
  { name: 'Beauty & Skincare', icon: Sparkles, count: '1.8k+' },
  { name: 'Electronics', icon: Smartphone, count: '3.2k+' },
  { name: 'Home & Furniture', icon: Armchair, count: '900+' },
  { name: 'Toys & Hobbies', icon: Gamepad2, count: '1.2k+' },
  { name: 'Arts & Crafts', icon: Palette, count: '850+' },
  { name: 'Hardware & Tools', icon: Wrench, count: '2k+' },
  { name: 'Home Decor', icon: Home, count: '1.5k+' },
  { name: 'Jewellery', icon: Gem, count: '600+' },
  { name: 'Health & Medical', icon: Stethoscope, count: '4k+' },
  { name: 'Garden & Outdoors', icon: Flower2, count: '700+' },
  { name: 'Packaging', icon: Package, count: '5k+' },
  { name: 'Footwear', icon: Footprints, count: '1.1k+' },
  { name: 'Food & Dining', icon: Utensils, count: '4.5k+' },
  { name: 'Books & Education', icon: BookOpen, count: '1.3k+' },
  { name: 'Automotive', icon: Car, count: '800+' },
  { name: 'Music & Audio', icon: Music, count: '500+' },
  { name: 'Photography', icon: Camera, count: '300+' },
  { name: 'Watches', icon: Watch, count: '400+' },
  { name: 'B2B Services', icon: Briefcase, count: '2.1k+' },
];

// Split industries into two rows for the marquee effect
const row1 = industries.slice(0, industries.length / 2);
const row2 = industries.slice(industries.length / 2);

const MarqueeRow = ({ items, direction = 'left', speed = 40 }) => {
  return (
    <div className="flex overflow-hidden relative w-full py-4 mask-gradient">
      <motion.div
        className="flex gap-6 whitespace-nowrap"
        initial={{ x: direction === 'left' ? 0 : '-50%' }}
        animate={{ x: direction === 'left' ? '-50%' : 0 }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: speed,
        }}
        style={{ width: "max-content" }}
      >
        {/* Quadruple items to ensure seamless loop */}
        {[...items, ...items, ...items, ...items].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={`${item.name}-${idx}`}
              className="
                group flex items-center gap-4 px-6 py-4
                bg-white/60 backdrop-blur-md rounded-2xl
                border border-white/40 shadow-sm
                hover:shadow-lg hover:shadow-[#25D366]/10 hover:border-[#25D366]/30
                transition-all duration-300 cursor-default
                min-w-[200px]
              "
            >
              <div className={`
                p-3 rounded-xl bg-[#25D366]/10 text-[#25D366]
                group-hover:bg-[#25D366] group-hover:text-white
                transition-colors duration-300
              `}>
                <Icon className="w-6 h-6" />
              </div>
              
              <div className="flex flex-col">
                <span className="font-semibold text-gray-800 group-hover:text-[#075E54] transition-colors">
                  {item.name}
                </span>
                <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full w-fit mt-1">
                  {item.count} Active
                </span>
              </div>
            </div>
          );
        })}
      </motion.div>
    </div>
  );
};

export function IndustryCategories() {
  return (
    <section className="py-24 overflow-hidden relative bg-gradient-to-b from-gray-50/50 via-white to-gray-50/30">
      
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#25D366]/5 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#128C7E]/5 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="container mx-auto px-4 mb-12 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block py-1.5 px-4 rounded-full bg-[#E8FFF3] text-[#128C7E] text-sm font-bold tracking-wide mb-6 border border-[#25D366]/20">
            VERSATILE & SCALABLE
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-[#1a1a2e] mb-6 tracking-tight">
            Empowering Every <span className="text-[#25D366]">Industry</span>
          </h2>
          <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            From local artisans to global brands, our platform adapts to your unique business needs with specialized tools and features.
          </p>
        </motion.div>
      </div>

      <div className="relative z-10 space-y-6">
        {/* Left side fade mask */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-20 pointer-events-none" />
        {/* Right side fade mask */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-20 pointer-events-none" />

        <MarqueeRow items={row1} direction="left" speed={50} />
        <MarqueeRow items={row2} direction="right" speed={50} />
      </div>

      <div className="mt-16 text-center relative z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold text-lg shadow-[0_10px_20px_-10px_rgba(37,211,102,0.5)] hover:shadow-[0_20px_30px_-10px_rgba(37,211,102,0.6)] transition-all duration-300 overflow-hidden"
        >
          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></span>
          
          <ShoppingBag className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
          <span>Explore All Categories</span>
          
          <motion.div
            animate={{ x: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowRight className="w-5 h-5" />
          </motion.div>
        </motion.button>
      </div>
    </section>
  );
}
