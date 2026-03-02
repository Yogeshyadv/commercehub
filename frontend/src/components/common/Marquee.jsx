import React from 'react';
import { motion } from 'framer-motion';

export const Marquee = ({ children, direction = 'left', speed = 20, className = '' }) => {
  return (
    <div className={`overflow-hidden flex ${className}`}>
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: "-100%" }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: speed,
        }}
        className="flex flex-shrink-0 gap-8 min-w-full justify-around items-center"
      >
        {children}
      </motion.div>
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: "-100%" }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: speed,
        }}
        className="flex flex-shrink-0 gap-8 min-w-full justify-around items-center"
      >
        {children}
      </motion.div>
    </div>
  );
};

export const LogoMarquee = ({ logos }) => {
  return (
    <div className="py-12 bg-white/50 backdrop-blur-sm border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm font-semibold text-gray-500 uppercase tracking-wider mb-8">
          Trusted by leading innovative brands
        </p>
        <Marquee speed={40}>
          {logos.map((logo, index) => {
            const LogoComponent = logo.component;
            return (
              <div key={index} className="flex items-center justify-center h-12 w-32 opacity-70 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
                <LogoComponent className="h-8 w-auto max-w-full" />
              </div>
            );
          })}
        </Marquee>
      </div>
    </div>
  );
};
