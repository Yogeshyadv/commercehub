import React from 'react';
import { motion } from 'framer-motion';

export function TrustBar() {
  const logos = [
    { name: 'Pantaloons', url: 'https://dwtqm09zovi8z.cloudfront.net/assets/partner_logos/pantaloons.webp' },
    { name: 'Peter England', url: 'https://dwtqm09zovi8z.cloudfront.net/assets/partner_logos/peter_england.webp' },
    { name: 'Sabyasachi', url: 'https://dwtqm09zovi8z.cloudfront.net/assets/partner_logos/sabyasachi.webp' },
    { name: 'Gini & Jony', url: 'https://dwtqm09zovi8z.cloudfront.net/assets/partner_logos/gini_and_jony.webp' },
    { name: 'Tupperware', url: 'https://dwtqm09zovi8z.cloudfront.net/assets/partner_logos/tupperware.webp' },
    { name: 'Hamleys', url: 'https://dwtqm09zovi8z.cloudfront.net/assets/partner_logos/hamleys.webp' },
    { name: 'Miniso', url: 'https://dwtqm09zovi8z.cloudfront.net/assets/partner_logos/miniso.webp' }
  ];

  return (
    <section className="py-12 border-y border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 overflow-hidden relative z-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
            Trusted by millions of businesses from 100+ countries
          </h2>
        </motion.div>
        
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
          {logos.map((logo, idx) => (
            <motion.img
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              src={logo.url}
              alt={logo.name}
              className="h-8 md:h-12 object-contain"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
