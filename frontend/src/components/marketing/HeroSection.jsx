import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const HeroSection = ({ 
  title, 
  subtitle, 
  primaryCTA, 
  secondaryCTA, 
  visual,
  badge,
  dark = false
}) => {
  return (
    <div className={`relative pt-32 pb-20 sm:pt-48 sm:pb-32 overflow-hidden ${dark ? 'bg-black text-white' : 'bg-white text-black'}`}>
      {/* Background Decor */}
      {!dark && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 origin-top">
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2调节 w-[800px] h-[500px] bg-red-50 blur-[100px] rounded-full opacity-60" />
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {badge && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-8 ${dark ? 'bg-white/10 border-white/10 text-red-400' : 'bg-red-50 border-red-100 text-red-600 border'}`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
                </span>
                {badge}
              </motion.div>
            )}
            
            <h1 className={`text-5xl sm:text-7xl font-extrabold leading-[1.1] tracking-tight mb-8 ${dark ? 'text-white' : 'text-black'}`}>
              {title}
            </h1>
            
            <p className={`text-xl leading-relaxed mb-10 max-w-xl ${dark ? 'text-gray-400' : 'text-gray-600 font-medium'}`}>
              {subtitle}
            </p>

            <div className="flex flex-wrap gap-4">
              {primaryCTA && (
                <Link
                  to={primaryCTA.path}
                  className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-red-500/10 hover:-translate-y-0.5"
                >
                  {primaryCTA.text}
                </Link>
              )}
              {secondaryCTA && (
                <Link
                  to={secondaryCTA.path}
                  className={`px-8 py-4 font-bold rounded-xl transition-all border hover:-translate-y-0.5 ${dark ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white' : 'bg-white hover:bg-gray-50 border-gray-200 text-black shadow-sm'}`}
                >
                  {secondaryCTA.text}
                </Link>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative flex items-center justify-center lg:justify-end"
          >
            {visual ? (
              <div className="relative w-full">
                {!dark && <div className="absolute inset-0 bg-red-100/50 blur-[100px] -z-10 rounded-full" />}
                {visual}
              </div>
            ) : (
              <div className="relative w-full aspect-[4/3] max-w-xl group">
                <div className={`absolute inset-0 rounded-3xl blur-2xl transition-opacity group-hover:opacity-60 ${dark ? 'bg-red-500/10' : 'bg-red-100'}`} />
                <div className="relative h-full w-full bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-2xl">
                  {/* Mock dashboard UI */}
                  <div className="h-10 border-b border-gray-100 bg-gray-50/50 flex items-center px-4 gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-100" />
                      <div className="w-3 h-3 rounded-full bg-gray-200" />
                      <div className="w-3 h-3 rounded-full bg-gray-200" />
                    </div>
                  </div>
                  <div className="p-8 space-y-6">
                    <div className="h-6 w-1/3 bg-gray-100 rounded-lg" />
                    <div className="grid grid-cols-3 gap-4">
                      <div className="h-28 bg-gray-50 rounded-2xl border border-gray-100" />
                      <div className="h-28 bg-gray-50 rounded-2xl border border-gray-100" />
                      <div className="h-28 bg-gray-50 rounded-2xl border border-gray-100" />
                    </div>
                    <div className="h-48 bg-gray-50 rounded-2xl border border-gray-100" />
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
