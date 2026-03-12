import React from 'react';
import { motion } from 'framer-motion';

export const FeatureCard = ({ icon: Icon, title, desc, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex flex-col group"
  >
    {Icon && (
      <div className="w-14 h-14 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
        <Icon size={28} />
      </div>
    )}
    <h3 className="text-xl font-bold text-black mb-3 tracking-tight">{title}</h3>
    <p className="text-gray-600 leading-relaxed font-medium">{desc}</p>
  </motion.div>
);

export const FeatureGrid = ({ items = [], columns = 3 }) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  };

  return (
    <div className={`grid ${gridCols[columns]} gap-8`}>
      {items.map((item, i) => (
        <FeatureCard key={i} {...item} delay={i * 0.1} />
      ))}
    </div>
  );
};
