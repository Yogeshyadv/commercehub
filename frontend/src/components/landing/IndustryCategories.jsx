import React from 'react';
import { motion } from 'framer-motion';
import { ZapIcon, TrendingUpIcon, UsersIcon } from 'lucide-react';

const stats = [
  {
    value: '3×',
    label: 'Higher conversion',
    highlight: 'CONVERSION RATE',
    desc: 'CommerceHub catalogues convert 3× higher on average than traditional product listings and WhatsApp broadcasts.',
    Icon: TrendingUpIcon,
  },
  {
    value: '10M+',
    label: 'Orders processed',
    highlight: 'ORDERS TO DATE',
    desc: 'Over 10 million orders placed through CommerceHub stores across India and 100+ countries.',
    Icon: UsersIcon,
  },
  {
    value: '50ms',
    label: 'Catalogue load time',
    highlight: 'GLOBAL LATENCY',
    desc: 'Your catalogue loads in under 50ms for every customer on the planet with our global CDN infrastructure.',
    Icon: ZapIcon,
  },
];

export function IndustryCategories() {
  return (
    <section className="py-24 bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#DC2626]/6 rounded-full blur-3xl" />
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            A trusted platform to<br className="hidden md:block" /> build your business
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="border border-white/[0.08] rounded-3xl p-10 hover:border-[#DC2626]/40 transition-colors duration-300"
            >
              <div className="flex items-center gap-2 mb-6">
                <s.Icon className="w-5 h-5 text-[#DC2626]" />
                <span className="text-[11px] font-black tracking-[0.2em] uppercase text-[#DC2626]">{s.highlight}</span>
              </div>
              <div className="text-7xl font-black text-white mb-3 tracking-tight">{s.value}</div>
              <div className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">{s.label}</div>
              <p className="text-gray-600 text-sm leading-relaxed font-medium">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
