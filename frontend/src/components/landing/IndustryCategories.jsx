import React from 'react';
import { motion } from 'framer-motion';

export function IndustryCategories() {
  const cards = [
    {
      title: 'Curate catalogues for customers',
      subtitle: 'Create customer specific, price specifc, or theme specific catalogues',
      img: 'https://dwtqm09zovi8z.cloudfront.net/assets/boost_personal_commerce_1.webp'
    },
    {
      title: 'Get notified in real-time when buyer opens',
      subtitle: 'Get notified in real-time on your phone when buyers open your catalogue',
      img: 'https://dwtqm09zovi8z.cloudfront.net/assets/boost_personal_commerce_2.webp'
    },
    {
      title: 'Read your customers mind and close sales faster',
      subtitle: 'Track customer activity live and boost conversion rate by calling customers at the right time',
      img: 'https://dwtqm09zovi8z.cloudfront.net/assets/boost_personal_commerce_3.webp'
    }
  ];

  return (
    <section className="py-20 bg-white dark:bg-gray-900 relative z-10">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight"
          >
            Boost conversion rate with <span className="text-[#25D366]">Personal Commerce</span>
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-gray-50 dark:bg-gray-800 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700"
            >
              <div className="h-64 overflow-hidden bg-white flex items-center justify-center p-4">
                <img src={card.img} alt={card.title} className="w-full h-full object-contain" />
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{card.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed">{card.subtitle}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
