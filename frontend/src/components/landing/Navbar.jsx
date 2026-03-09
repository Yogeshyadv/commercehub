import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MenuIcon, XIcon, ChevronDownIcon } from 'lucide-react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductOpen, setIsProductOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const productLinks = [
    { name: 'Catalogue e-commerce', path: '/product/catalogue' },
    { name: 'Native App', path: '/product/native-app' },
    { name: 'Cataloguing', path: '/product/cataloguing' },
    { name: 'Live Analytics', path: '/product/analytics' },
  ];

  const mainLinks = [
    { name: 'B2B', path: '/b2b' },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Customers', path: '/customers' },
    { name: 'Enterprise', path: '/enterprise' },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 transition-all duration-300 ${
        scrolled ? 'bg-black/95 backdrop-blur-xl border-b border-white/[0.06] py-3 shadow-xl' : 'bg-black py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-extrabold tracking-tight text-[22px] sm:text-[26px] text-white">
          Commerce<span className="text-[#DC2626]">Hub</span>
          <span className="inline-block w-1.5 h-1.5 bg-[#DC2626] rounded-full ml-0.5 mb-1"></span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center space-x-8">
          <div
            className="relative"
            onMouseEnter={() => setIsProductOpen(true)}
            onMouseLeave={() => setIsProductOpen(false)}
          >
            <button className="flex items-center text-sm font-bold text-gray-400 hover:text-white transition-colors py-2">
              Product <ChevronDownIcon className="ml-1 w-4 h-4" />
            </button>
            <AnimatePresence>
              {isProductOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute top-full left-0 w-56 bg-[#111] border border-white/[0.08] rounded-2xl shadow-2xl py-3 mt-2 overflow-hidden"
                >
                  {productLinks.map(link => (
                    <Link
                      key={link.name}
                      to={link.path}
                      className="block px-5 py-3 text-sm font-semibold text-gray-400 hover:bg-white/[0.06] hover:text-white transition-colors"
                      onClick={() => setIsProductOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {mainLinks.map(item => (
            <Link
              key={item.name}
              to={item.path}
              className="text-sm font-bold text-gray-400 hover:text-white transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/login" className="text-sm font-bold text-gray-400 hover:text-white transition-colors px-4 py-2">
            Login
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 rounded-full bg-[#DC2626] text-white text-sm font-bold hover:bg-[#B91C1C] transition-all shadow-md"
          >
            Start for free
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/[0.06] transition-colors"
        >
          {isMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden mt-4 bg-[#111] rounded-2xl p-4 border border-white/[0.08] overflow-hidden"
          >
            <div className="flex flex-col space-y-2">
              <div className="text-xs font-black text-gray-700 uppercase tracking-widest px-4 pb-1">Products</div>
              {productLinks.map(item => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-bold text-gray-400 hover:text-white px-4 py-3 rounded-xl hover:bg-white/[0.06] transition-all"
                >
                  {item.name}
                </Link>
              ))}
              <div className="h-px bg-white/[0.06] my-1" />
              {mainLinks.map(item => (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-bold text-gray-400 hover:text-white px-4 py-3 rounded-xl hover:bg-white/[0.06] transition-all"
                >
                  {item.name}
                </Link>
              ))}
              <div className="h-px bg-white/[0.06] my-1" />
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-bold text-gray-400 hover:text-white px-4 py-3 rounded-xl hover:bg-white/[0.06] transition-all"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="text-sm font-bold text-white bg-[#DC2626] text-center px-4 py-3 rounded-xl hover:bg-[#B91C1C] transition-all"
              >
                Start for free
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
