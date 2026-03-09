import React from 'react';
import { motion } from 'framer-motion';

const highlights = [
  { value: '50,000+', label: 'Active businesses' },
  { value: '100+', label: 'Countries served' },
  { value: '10M+', label: 'Orders processed' },
  { value: '3Ã—', label: 'Avg. conversion lift' },
];

export function TrustBar() {
  return (
    <section className="bg-white border-b border-gray-100 py-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
          {highlights.map((h, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="text-center px-4"
            >
              <div className="text-3xl md:text-4xl font-black text-gray-900 mb-1">{h.value}</div>
              <div className="text-xs text-gray-500 font-semibold uppercase tracking-widest">{h.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}