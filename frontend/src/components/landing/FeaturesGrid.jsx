import React from 'react';
import { motion } from 'framer-motion';

export function FeaturesGrid() {
  const b2bFeatures = [
    { title: 'Fast order booking', icon: '⚡' },
    { title: 'MOA, MOQ and Sets', icon: '📦' },
    { title: 'Private cataloguing', icon: '🔒' },
    { title: 'B2B pricing', icon: '💰' }
  ];

  const waFeatures = [
    { title: 'Catalogue brochure', icon: '📄' },
    { title: 'Quick WhatsApp Chat from Catalogue', icon: '💬' },
    { title: 'Automated WhatsApp order receipts', icon: '🧾' },
    { title: 'Create catalogue from WA chat', icon: '🤖' }
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-[#0a0a0a] relative z-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-32">
        
        {/* Catalogue E-commerce Section */}
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <motion.img 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              src="https://dwtqm09zovi8z.cloudfront.net/assets/catalogue_e_commerce.webp" 
              alt="Catalogue E-Commerce" 
              className="w-full h-auto drop-shadow-2xl rounded-2xl"
            />
          </div>
          <div className="lg:w-1/2 space-y-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white"
            >
              Catalogue e-commerce
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 dark:text-gray-400 font-medium"
            >
              Get started with an easy to use and powerful catalogue and allow customers to place an order easily
            </motion.p>
            <div className="grid grid-cols-2 gap-4 pt-6">
              {['Curated cataloguing', 'E-commerce website', 'Custom layout', 'Themes', '3 product layouts', 'Powerful search', '2 click checkout', 'Tags'].map((feat, i) => (
                <div key={i} className="flex items-center text-gray-800 dark:text-gray-300 font-semibold text-sm">
                  <span className="w-5 h-5 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center mr-3 text-xs flex-shrink-0">✓</span>
                  {feat}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scale Business on WhatsApp Section */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 space-y-6">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white"
            >
              Scale your business on WhatsApp
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-600 dark:text-gray-400 font-medium"
            >
              Take your WhatsApp Commerce to the next level with powerful features to boost your conversion rate on WhatsApp
            </motion.p>
            <div className="space-y-4 pt-6">
              {waFeatures.map((feat, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={i} className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <span className="text-2xl mr-4">{feat.icon}</span>
                  <span className="font-bold text-gray-800 dark:text-gray-200">{feat.title}</span>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="lg:w-1/2">
            <motion.img 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              src="https://dwtqm09zovi8z.cloudfront.net/assets/whatsapp_ordering.webp" 
              alt="WhatsApp Scale" 
              className="w-full h-auto drop-shadow-2xl rounded-2xl"
            />
          </div>
        </div>

        {/* Powerful features for B2B business */}
        <div className="text-center pt-8 border-t border-gray-200 dark:border-gray-800">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-6">Powerful features for B2B business</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 font-medium mb-12 max-w-2xl mx-auto">
            CommerceHub is built from the ground up for B2B businesses needs
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {b2bFeatures.map((f, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                key={i}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow border border-gray-100 dark:border-gray-700"
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h4 className="font-bold text-lg text-gray-900 dark:text-white">{f.title}</h4>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
