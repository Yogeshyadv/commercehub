import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, ShoppingBagIcon, CheckCircleIcon } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="pt-24 pb-12 md:pt-32 md:pb-20 px-4 md:px-8 relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">
        {/* Left Column: Text Content */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
          className="text-left"
        >
          <motion.div
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            className="inline-flex items-center px-4 py-2 rounded-full bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/50 dark:border-white/10 shadow-sm mb-6 transition-colors"
          >
            <span className="text-xs sm:text-sm font-bold text-[#128C7E] dark:text-[#25D366]">
              🚀 #1 WhatsApp Commerce Platform
            </span>
          </motion.div>

          <motion.h1
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[#1a1a2e] dark:text-white leading-[1.15] mb-6 transition-colors"
          >
            Boost conversion rate from prospects and customers on{' '}
            <span className="text-[#25D366]">WhatsApp</span>
          </motion.h1>

          <motion.p
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl leading-relaxed transition-colors"
          >
            Turn WhatsApp conversations into revenue with smart catalogs,
            automated follow-ups, and seamless checkout experiences.
          </motion.p>

          <motion.div
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            className="flex flex-col sm:flex-row gap-4 mb-10"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 sm:px-8 sm:py-4 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold text-base sm:text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              Start Selling on WhatsApp
              <ArrowRightIcon className="w-5 h-5" />
            </motion.button>
          </motion.div>

          <motion.div
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            className="flex items-center gap-4"
          >
            <div className="h-11 w-32 sm:h-12 sm:w-36 bg-[#1a1a2e] dark:bg-white dark:text-black rounded-xl flex items-center justify-center cursor-pointer hover:opacity-90 transition-all border border-transparent dark:border-white/10 shadow-lg">
              <span className="text-white dark:text-black font-bold text-xs sm:text-sm">
                App Store
              </span>
            </div>
            <div className="h-11 w-32 sm:h-12 sm:w-36 bg-[#1a1a2e] dark:bg-white dark:text-black rounded-xl flex items-center justify-center cursor-pointer hover:opacity-90 transition-all border border-transparent dark:border-white/10 shadow-lg">
              <span className="text-white dark:text-black font-bold text-xs sm:text-sm">
                Google Play
              </span>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Glass UI Mockups */}
        <div className="relative h-auto lg:h-[600px] w-full flex items-center justify-center lg:justify-end mt-8 lg:mt-0">
          {/* Main Phone/Chat Interface Card */}
          <motion.div
            initial={{ y: 60, opacity: 0, rotate: -2 }}
            whileInView={{ y: 0, opacity: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative z-20 w-full max-w-md bg-white/40 dark:bg-gray-900/40 backdrop-blur-2xl border border-white/50 dark:border-white/10 rounded-[1.5rem] lg:rounded-[2.5rem] shadow-2xl overflow-hidden p-2 sm:p-4 transition-colors"
          >
            {/* Mock Header */}
            <div className="bg-[#075E54] dark:bg-[#1f2c34] rounded-t-xl lg:rounded-t-2xl p-3 sm:p-4 flex items-center gap-3 mb-4 shadow-md transition-colors">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs sm:text-base">
                CH
              </div>
              <div>
                <h3 className="text-white font-bold text-xs sm:text-sm">
                  CommerceHub Store
                </h3>
                <p className="text-green-100 dark:text-gray-400 text-[10px] sm:text-xs">
                  Business Account
                </p>
              </div>
            </div>

            {/* Chat Area */}
            <div className="space-y-3 sm:space-y-4 p-1 sm:p-2">
              {/* Received Message */}
              <div className="flex justify-start">
                <div className="bg-white dark:bg-[#202c33] rounded-tr-xl rounded-br-xl rounded-bl-xl p-2 sm:p-3 shadow-sm max-w-[85%] sm:max-w-[80%] transition-colors">
                  <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-100">
                    Hi! I'm interested in the summer collection. Do you have a
                    catalog?
                  </p>
                  <span className="text-[9px] sm:text-[10px] text-gray-400 block text-right mt-1">
                    10:42 AM
                  </span>
                </div>
              </div>

              {/* Sent Message (Catalog) */}
              <div className="flex justify-end">
                <div className="bg-[#dcf8c6] dark:bg-[#005c4b] rounded-tl-xl rounded-bl-xl rounded-br-xl p-2 sm:p-3 shadow-sm max-w-[90%] sm:max-w-[85%] transition-colors">
                  <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-100 mb-2">
                    Here is our latest catalog! 📱
                  </p>
                  <div className="bg-white dark:bg-[#202c33] rounded-lg overflow-hidden mb-2 shadow-sm transition-colors">
                    <div className="h-24 sm:h-32 bg-gray-200 dark:bg-gray-700 w-full relative transition-colors">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500">
                        <ShoppingBagIcon className="w-6 h-6 sm:w-8 sm:h-8" />
                      </div>
                    </div>
                    <div className="p-2">
                      <p className="font-bold text-xs sm:text-sm dark:text-white">
                        Summer Collection 2024
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400">
                        12 items • Up to 50% OFF
                      </p>
                    </div>
                  </div>
                  <button className="w-full py-1.5 bg-white dark:bg-[#202c33] dark:border dark:border-[#2a3942] rounded text-[#075E54] dark:text-[#00a884] text-[10px] sm:text-xs font-bold uppercase tracking-wide shadow-sm transition-colors">
                    View Catalog
                  </button>
                  <span className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-300 block text-right mt-1">
                    10:43 AM
                  </span>
                </div>
              </div>

              {/* Received Message - Hidden on very small screens to save space */}
              <div className="hidden sm:flex justify-start">
                <div className="bg-white dark:bg-[#202c33] rounded-tr-xl rounded-br-xl rounded-bl-xl p-3 shadow-sm max-w-[80%] transition-colors">
                  <p className="text-sm text-gray-800 dark:text-gray-100">
                    I would like to order 2 items from the list.
                  </p>
                  <span className="text-[10px] text-gray-400 block text-right mt-1">
                    10:45 AM
                  </span>
                </div>
              </div>

              {/* Sent Message (Order Confirmation) */}
              <div className="flex justify-end">
                <div className="bg-[#dcf8c6] dark:bg-[#005c4b] rounded-tl-xl rounded-bl-xl rounded-br-xl p-2 sm:p-3 shadow-sm max-w-[90%] sm:max-w-[85%] transition-colors">
                  <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-100 flex items-center gap-1">
                    <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 dark:text-green-300" />
                    Order confirmed! Payment link sent.
                  </p>
                  <span className="text-[9px] sm:text-[10px] text-gray-500 dark:text-gray-300 block text-right mt-1">
                    10:46 AM
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating Elements for Depth - Hidden on mobile */}
          <motion.div
            initial={{ y: 80, opacity: 0, x: 20 }}
            whileInView={{ y: -40, opacity: 1, x: 40 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="hidden lg:block absolute top-1/2 right-0 z-30 w-48 bg-white/60 dark:bg-gray-800/80 backdrop-blur-xl border border-white/60 dark:border-white/10 rounded-2xl p-4 shadow-xl transition-colors"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-600 rounded-lg transition-colors"></div>
              <div>
                <div className="h-3 w-20 bg-gray-300 dark:bg-gray-500 rounded mb-1 transition-colors"></div>
                <div className="h-2 w-12 bg-gray-200 dark:bg-gray-600 rounded transition-colors"></div>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-[#1a1a2e] dark:text-white transition-colors">$49.00</span>
              <button className="px-3 py-1 bg-[#25D366] text-white text-xs rounded-full font-bold shadow-sm">
                Add
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6, type: 'spring' }}
            className="hidden lg:flex absolute top-20 left-10 z-30 w-16 h-16 bg-gradient-to-br from-[#25D366] to-[#128C7E] rounded-2xl shadow-lg items-center justify-center text-white font-bold text-xl rotate-12"
          >
            +125%
          </motion.div>
        </div>
      </div>
    </section>
  );
}
