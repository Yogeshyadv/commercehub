import React from 'react';
import { motion } from 'framer-motion';

export const SectionWrapper = ({ 
  children, 
  className = "", 
  variant = "primary", 
  containerClassName = "max-w-7xl mx-auto px-6",
  id 
}) => {
  const variants = {
    primary: "bg-white",
    secondary: "bg-[#f8fafc]",
    dark: "bg-black text-white",
    hero: "bg-white pt-32 pb-20",
    cta: "bg-black text-white py-24 sm:py-32"
  };

  return (
    <section 
      id={id}
      className={`relative overflow-hidden ${variants[variant] || "bg-white"} ${className}`}
    >
      <div className={containerClassName}>
        {children}
      </div>
    </section>
  );
};

export const PremiumCard = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className={`bg-white p-8 rounded-2xl border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.01] ${className}`}
  >
    {children}
  </motion.div>
);

export const SectionHeading = ({ title, subtitle, centered = true, dark = false }) => (
  <div className={`mb-16 ${centered ? 'text-center' : ''}`}>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`text-4xl sm:text-5xl font-extrabold mb-6 tracking-tight leading-tight ${dark ? 'text-white' : 'text-black'}`}
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className={`text-lg sm:text-xl max-w-3xl mx-auto leading-relaxed ${dark ? 'text-gray-400' : 'text-gray-600'}`}
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);
