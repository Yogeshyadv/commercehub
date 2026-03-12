import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CTASection = ({ 
  title = "Ready to transform your commerce?", 
  subtitle = "Join millions of businesses scaling with CommerceHub.",
  primaryCTA = { text: "Start your free trial", path: "/register" },
  dark = true
}) => {
  return (
    <div className={`relative py-24 sm:py-32 overflow-hidden ${dark ? 'bg-black text-white' : 'bg-gray-50'}`}>
      {dark && (
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-600/10 blur-[120px] rounded-full" />
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className={`text-4xl sm:text-6xl font-extrabold mb-8 tracking-tight ${dark ? 'text-white' : 'text-black'}`}>
            {title}
          </h2>
          <p className={`text-xl mb-12 max-w-2xl mx-auto leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-600 font-medium'}`}>
            {subtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to={primaryCTA.path}
              className="w-full sm:w-auto px-10 py-5 bg-red-600 text-white font-bold rounded-2xl hover:bg-red-700 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-red-500/20"
            >
              {primaryCTA.text}
            </Link>
            <Link
              to="/pricing"
              className={`w-full sm:w-auto px-10 py-5 font-bold rounded-2xl transition-all border hover:scale-105 active:scale-95 ${dark ? 'border-white/20 text-white hover:bg-white/5' : 'border-gray-200 text-black hover:bg-gray-50'}`}
            >
              View pricing
            </Link>
          </div>

          <p className={`mt-10 text-sm ${dark ? 'text-gray-500' : 'text-gray-400 font-medium'}`}>
            No credit card required &middot; 14-day free trial &middot; Cancel anytime
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default CTASection;
