import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

const steps = [
  {
    num: '01',
    title: 'Add your first product',
    desc: 'Upload products with images, prices, and descriptions in minutes. Import from WhatsApp, Excel, or add manually.',
  },
  {
    num: '02',
    title: 'Customise your store',
    desc: 'Choose from beautiful themes, set your brand colors, and make your catalogue uniquely yours â€” no coding needed.',
  },
  {
    num: '03',
    title: 'Start selling',
    desc: 'Share your catalogue on WhatsApp, social media, or your website. Customers order in 2 clicks.',
  },
];

export function GlobalReach() {
  return (
    <>
      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight">
              It's easy to start selling
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
              >
                <div className="text-[#DC2626] font-black text-sm tracking-[0.2em] mb-6 uppercase">
                  {step.num}
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 font-medium leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <Link
              to="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#DC2626] text-white font-bold rounded-xl hover:bg-[#B91C1C] transition-all shadow-lg text-sm"
            >
              Get started today <ArrowRightIcon className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-28 bg-black text-white text-center relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(ellipse 80% 55% at 50% 50%, rgba(220,38,38,0.18) 0%, transparent 70%)' }}
        />
        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl lg:text-8xl font-black leading-[0.95] tracking-tight mb-8"
          >
            Start your<br />free trial today
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 mb-12 text-lg font-medium"
          >
            No credit card required. Cancel anytime.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/register"
              className="inline-flex items-center gap-3 px-10 py-5 bg-[#DC2626] text-white font-black rounded-2xl hover:bg-[#B91C1C] active:scale-95 transition-all text-base shadow-[0_8px_40px_rgba(220,38,38,0.35)] hover:shadow-[0_8px_60px_rgba(220,38,38,0.5)]"
            >
              Get started free <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}