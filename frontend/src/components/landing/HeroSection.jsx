import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, PlayIcon, CheckCircleIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

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
            visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
          }}
          className="text-left"
        >
          <motion.h1
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-[1.1] tracking-tight mb-6"
          >
            Boost conversion rate from prospects and customers on <span className="text-[#25D366]">WhatsApp</span>
          </motion.h1>

          <motion.p
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl font-medium"
          >
            Create your e-commerce catalogue, website and app using only your phone or laptop.
          </motion.p>

          <motion.div
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            className="flex flex-wrap items-center gap-4 mb-10"
          >
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl shadow-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-all scale-100 hover:scale-105"
            >
              BOOK DEMO
              <ArrowRightIcon className="ml-2 w-5 h-5" />
            </Link>
            
            <a 
              href="#"
              className="inline-flex items-center justify-center px-8 py-4 bg-[#25D366] text-white font-bold rounded-xl shadow-lg hover:bg-[#128C7E] transition-all scale-100 hover:scale-105"
            >
              GET STARTED FREE
            </a>
          </motion.div>

          {/* Feature checks */}
          <motion.div
            variants={{
              hidden: { y: 20, opacity: 0 },
              visible: { y: 0, opacity: 1 },
            }}
            className="flex flex-wrap items-center gap-4 text-sm font-medium text-gray-600 dark:text-gray-400"
          >
            <div className="flex items-center">
              <CheckCircleIcon className="w-5 h-5 text-[#25D366] mr-2" />
              B2B Ready
            </div>
            <div className="flex items-center">
              <CheckCircleIcon className="w-5 h-5 text-[#25D366] mr-2" />
              B2C Optimized
            </div>
            <div className="flex items-center">
              <CheckCircleIcon className="w-5 h-5 text-[#25D366] mr-2" />
              No coding required
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column: Hero Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, x: 20 }}
          whileInView={{ opacity: 1, scale: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative lg:h-[600px] flex items-center justify-center"
        >
          <div className="relative w-full max-w-lg aspect-square">
            {/* Background decorative glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-[#25D366]/20 to-blue-500/20 rounded-[3rem] blur-3xl" />
            
            {/* Main Phone Mockup */}
            <div className="relative z-10 w-[280px] h-[580px] mx-auto bg-white dark:bg-gray-900 rounded-[3rem] border-[8px] border-gray-900 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col">
              {/* iPhone Notch */}
              <div className="absolute top-0 inset-x-0 h-6 bg-gray-900 dark:bg-gray-800 rounded-b-2xl mx-16 z-20" />
              
              {/* Fake App UI */}
              <div className="flex-1 bg-gray-50 dark:bg-gray-900 w-full flex flex-col">
                <div className="p-4 pt-8 bg-[#25D366] text-white">
                  <h3 className="font-bold text-lg">CommerceHub</h3>
                  <p className="text-xs opacity-90">Manage your catalogues</p>
                </div>
                <div className="p-4 flex-1 space-y-4 overflow-hidden">
                  <div className="w-full h-32 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex p-3 gap-3">
                    <div className="w-24 h-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-4 w-1/3 bg-[#25D366]/50 rounded mt-auto animate-pulse" />
                    </div>
                  </div>
                  <div className="w-full h-32 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex p-3 gap-3">
                    <div className="w-24 h-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                      <div className="h-4 w-1/3 bg-[#25D366]/50 rounded mt-auto animate-pulse" />
                    </div>
                  </div>
                </div>
                
                {/* Bottom Nav Fake */}
                <div className="h-16 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex justify-around items-center px-4">
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                  <div className="w-8 h-8 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center"><ShoppingBagIcon className="w-4 h-4"/></div>
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
            </div>

            {/* Floating Elements (WhatsApp Notification) */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -right-8 top-32 z-20 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 flex items-center gap-3 w-64"
            >
              <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center flex-shrink-0">
                <ShoppingBagIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">New Order Received!</p>
                <p className="text-xs text-gray-500">From WhatsApp • Just now</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
