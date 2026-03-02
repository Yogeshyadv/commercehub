import React from 'react';
import { motion } from 'framer-motion';
import { StarIcon, QuoteIcon } from 'lucide-react';

const reviews = [
  {
    id: 1,
    text: 'CommerceHub helped me take my boutique online in minutes. My customers love the catalog and ordering is so smooth now!',
    author: 'Priya Sharma',
    role: "Owner, Priya's Boutique",
    location: 'Mumbai',
    rating: 5,
  },
  {
    id: 2,
    text: 'Managing orders on WhatsApp was a mess before. Now everything is automated, from catalog sharing to payments.',
    author: 'Rahul Verma',
    role: 'Manager, TechZone Electronics',
    location: 'Delhi',
    rating: 5,
  },
  {
    id: 3,
    text: 'The best way to showcase my jewellery designs to clients globally. The zoom quality in catalogs is amazing.',
    author: 'Anjali Mehta',
    role: 'Founder, Royal Gems',
    location: 'Jaipur',
    rating: 5,
  },
];

export function CustomerReviews() {
  return (
    <section className="py-12 md:py-20 px-4 relative z-10 bg-white/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4"
          >
            What our customers say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Join thousands of satisfied business owners who have transformed
            their sales with CommerceHub.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg relative"
            >
              <QuoteIcon className="absolute top-4 right-4 md:top-6 md:right-6 w-6 h-6 md:w-8 md:h-8 text-green-100 fill-green-100" />

              <div className="flex gap-1 mb-4">
                {[...Array(review.rating)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>

              <p className="text-gray-700 text-base md:text-lg mb-6 leading-relaxed italic">
                "{review.text}"
              </p>

              <div className="mt-auto">
                <p className="font-bold text-[#1a1a2e]">{review.author}</p>
                <p className="text-sm text-gray-500">{review.role}</p>
                <p className="text-xs text-[#25D366] font-medium mt-1 uppercase tracking-wide">
                  {review.location}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
