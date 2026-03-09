import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

export default function PlaceholderPage() {
  const location = useLocation();
  const pageName = location.pathname
    .replace('/', '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase()) || 'Page';

  return (
    <div className="min-h-screen w-full bg-white dark:bg-[#050c14] overflow-x-hidden relative font-sans transition-colors duration-300">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-red-100/50 dark:bg-red-500/5 rounded-full blur-3xl opacity-60 mix-blend-multiply dark:mix-blend-normal filter"></div>
        <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] bg-blue-50/50 dark:bg-blue-500/5 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-normal filter"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow pt-32 pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full text-center flex flex-col items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-24 h-24 bg-[#DC2626]/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <span className="text-4xl">🚧</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-[1.1] tracking-tight mb-6">
              {pageName} <span className="text-[#DC2626]">Coming Soon</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl font-medium mx-auto">
              We are working hard to bring you this page. Please check back later!
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl shadow-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-all scale-100 hover:scale-105"
            >
              BACK TO HOME
            </Link>
          </motion.div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
