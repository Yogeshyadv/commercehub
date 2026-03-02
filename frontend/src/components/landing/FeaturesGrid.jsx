import React from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquareIcon,
  ShoppingCartIcon,
  CreditCardIcon,
  BarChart3Icon,
  UsersIcon,
  SendIcon,
} from 'lucide-react';

export function FeaturesGrid() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 40 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 50,
      },
    },
  };

  return (
    <section className="py-12 md:py-20 px-4 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-[#1a1a2e] mb-4"
          >
            Everything you need to sell on WhatsApp
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            Powerful tools to convert conversations into customers with our
            comprehensive commerce suite.
          </motion.p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8"
        >
          {/* Feature 1 */}
          <motion.div
            variants={item}
            whileHover={{
              scale: 1.03,
              boxShadow:
                '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            }}
            className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg transition-all duration-300"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-4 md:mb-6 text-[#25D366]">
              <MessageSquareIcon className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-[#1a1a2e] mb-2 md:mb-3">
              Smart Catalog Sharing
            </h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Instantly share your products in WhatsApp conversations with
              beautiful, interactive catalog cards.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            variants={item}
            whileHover={{
              scale: 1.03,
              boxShadow:
                '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            }}
            className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg transition-all duration-300"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-4 md:mb-6 text-[#25D366]">
              <SendIcon className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-[#1a1a2e] mb-2 md:mb-3">
              Automated Follow-ups
            </h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Recover abandoned carts and re-engage customers with intelligent
              automated message sequences.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            variants={item}
            whileHover={{
              scale: 1.03,
              boxShadow:
                '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            }}
            className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg transition-all duration-300"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-4 md:mb-6 text-[#25D366]">
              <CreditCardIcon className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-[#1a1a2e] mb-2 md:mb-3">
              Payment Links
            </h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Generate and send secure payment links directly within the chat to
              close sales instantly.
            </p>
          </motion.div>

          {/* Feature 4 */}
          <motion.div
            variants={item}
            whileHover={{
              scale: 1.03,
              boxShadow:
                '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            }}
            className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg transition-all duration-300"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-4 md:mb-6 text-[#25D366]">
              <BarChart3Icon className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-[#1a1a2e] mb-2 md:mb-3">
              Real-time Analytics
            </h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Track conversions, response rates, and revenue with our
              comprehensive analytics dashboard.
            </p>
          </motion.div>

          {/* Feature 5 */}
          <motion.div
            variants={item}
            whileHover={{
              scale: 1.03,
              boxShadow:
                '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            }}
            className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg transition-all duration-300"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-4 md:mb-6 text-[#25D366]">
              <UsersIcon className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-[#1a1a2e] mb-2 md:mb-3">
              Multi-Agent Support
            </h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Enable your entire sales team to manage customer conversations
              from a shared inbox.
            </p>
          </motion.div>

          {/* Feature 6 */}
          <motion.div
            variants={item}
            whileHover={{
              scale: 1.03,
              boxShadow:
                '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
            }}
            className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-2xl p-5 sm:p-6 md:p-8 shadow-lg transition-all duration-300"
          >
            <div className="w-12 h-12 md:w-14 md:h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-4 md:mb-6 text-[#25D366]">
              <ShoppingCartIcon className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-[#1a1a2e] mb-2 md:mb-3">
              Broadcast Campaigns
            </h3>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed">
              Send personalized bulk messages to your customer base without
              getting blocked.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
