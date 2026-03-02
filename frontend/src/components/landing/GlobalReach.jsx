import React from 'react';
import { motion } from 'framer-motion';
import { GlobeIcon } from 'lucide-react';

const stats = [
  { label: 'Countries', value: '100+' },
  { label: 'Businesses', value: '10M+' },
  { label: 'Messages Sent', value: '500M+' },
  { label: 'Industries', value: '50+' },
];

export function GlobalReach() {
  return (
    <section className="py-16 md:py-24 px-4 relative z-10 overflow-hidden">
      {/* Abstract Map Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-400 to-transparent opacity-20" />
        {/* Decorative dots representing locations */}
        <div className="absolute top-[30%] left-[20%] w-2 h-2 bg-green-500 rounded-full animate-ping" />
        <div className="absolute top-[40%] right-[30%] w-2 h-2 bg-blue-500 rounded-full animate-ping delay-700" />
        <div className="absolute bottom-[30%] left-[40%] w-2 h-2 bg-purple-500 rounded-full animate-ping delay-300" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-10 md:mb-16">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center justify-center p-3 bg-green-100 rounded-full mb-6"
          >
            <GlobeIcon className="w-6 h-6 text-[#25D366]" />
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#1a1a2e] mb-6"
          >
            From <span className="text-[#25D366]">Jaipur</span> to{' '}
            <span className="text-[#128C7E]">Johannesburg</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
          >
            CommerceHub is empowering small and medium businesses across the
            globe to digitize their catalogs and sell smarter on WhatsApp.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/40 backdrop-blur-xl border border-white/50 rounded-2xl p-4 sm:p-6 md:p-8 text-center shadow-lg"
            >
              <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold text-[#1a1a2e] mb-2 bg-clip-text text-transparent bg-gradient-to-r from-[#25D366] to-[#128C7E]">
                {stat.value}
              </h3>
              <p className="text-gray-600 font-medium uppercase tracking-wider text-xs sm:text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
