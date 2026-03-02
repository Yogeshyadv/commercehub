import React from 'react';
import { motion } from 'framer-motion';
import brandLogos from '../common/BrandLogos';

export function TrustBar() {
  // Duplicate logos for seamless loop
  const logos = [...brandLogos, ...brandLogos];

  return (
    <section className="py-8 md:py-12 px-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto"
      >
        <div className="bg-white/40 backdrop-blur-xl border border-white/50 shadow-sm py-8 md:py-12 rounded-2xl overflow-hidden">
          <p className="text-center text-xs sm:text-sm font-bold text-gray-500 uppercase tracking-widest mb-8 md:mb-10">
            Trusted by millions of businesses from 100+ countries
          </p>

          <div className="relative w-full overflow-hidden mask-linear-gradient flex">
            <motion.div
              className="flex items-center gap-12 sm:gap-16 md:gap-24 px-4 min-w-full justify-around shrink-0"
              animate={{
                x: ["0%", "-100%"],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 40,
                  ease: 'linear',
                },
              }}
            >
              {logos.map((logo, index) => {
                const LogoComponent = logo.component;
                return (
                  <div 
                    key={`${logo.name}-${index}`} 
                    className="flex items-center justify-center h-20 w-40 opacity-100 hover:opacity-100 transition-all duration-300 transform hover:scale-110 cursor-pointer"
                    title={logo.name}
                  >
                    <LogoComponent className="h-12 md:h-14 w-auto max-w-full drop-shadow-sm" />
                  </div>
                );
              })}
            </motion.div>
            
            <motion.div
              className="flex items-center gap-12 sm:gap-16 md:gap-24 px-4 min-w-full justify-around shrink-0"
              animate={{
                x: ["0%", "-100%"],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: 'loop',
                  duration: 40,
                  ease: 'linear',
                },
              }}
            >
              {logos.map((logo, index) => {
                const LogoComponent = logo.component;
                return (
                  <div 
                    key={`${logo.name}-duplicate-${index}`} 
                    className="flex items-center justify-center h-20 w-40 opacity-100 hover:opacity-100 transition-all duration-300 transform hover:scale-110 cursor-pointer"
                    title={logo.name}
                  >
                    <LogoComponent className="h-12 md:h-14 w-auto max-w-full drop-shadow-sm" />
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
