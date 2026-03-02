import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuIcon, XIcon } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = ['Products', 'Pricing', 'Resources', 'About'];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 py-4 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-white/30 dark:border-white/5 shadow-sm transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="font-extrabold tracking-tight text-[24px] sm:text-[28px] md:text-[32px] text-[#1a1a2e] dark:text-white transition-colors">
            Commerce<span className="text-[#25D366]">Hub</span>
            <span className="inline-block w-2 h-2 bg-[#25D366] rounded-full ml-1 mb-1"></span>
          </Link>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-gray-600 dark:text-gray-300 font-medium hover:text-[#25D366] dark:hover:text-[#25D366] transition-colors"
            >
              {item}
            </a>
          ))}
        </div>

        {/* CTA & Mobile Menu */}
        <div className="flex items-center space-x-4">
          <Link
            to="/login"
            className="hidden md:inline-block text-gray-600 dark:text-gray-300 font-medium hover:text-[#25D366] dark:hover:text-[#25D366] transition-colors"
          >
            Login
          </Link>
          <Link to="/register">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 py-2 sm:px-6 sm:py-2.5 rounded-full bg-gradient-to-r from-[#25D366] to-[#128C7E] font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-all text-[#FFFFFF]"
            >
              Get Started
            </motion.button>
          </Link>

          {/* Mobile Menu Icon */}
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <XIcon className="w-6 h-6" />
            ) : (
              <MenuIcon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-lg absolute top-full left-0 right-0"
          >
            <div className="flex flex-col p-6 space-y-4">
              {navLinks.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-800 font-medium text-lg py-2 border-b border-gray-100 hover:text-[#25D366] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <Link
                to="/login"
                className="text-gray-800 font-medium text-lg py-2 hover:text-[#25D366] transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
