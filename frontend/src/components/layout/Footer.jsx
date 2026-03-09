import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-zinc-900 text-white pt-16 pb-8 border-t border-zinc-800">
      <div className="max-w-[1600px] mx-auto px-4 lg:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About Section */}
          <div>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <span className="text-red-500">Commerce</span>Hub
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Your one-stop destination for premium products. We connect millions of buyers and sellers around the world, empowering people & creating economic opportunity for all.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-red-600 hover:text-white transition-all">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-red-600 hover:text-white transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-red-600 hover:text-white transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-red-600 hover:text-white transition-all">
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm text-zinc-400">
              <li><Link to="/" className="hover:text-red-500 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-red-500 transition-colors">About Us</Link></li>
              <li><Link to="/products" className="hover:text-red-500 transition-colors">Shop</Link></li>
              <li><Link to="/contact" className="hover:text-red-500 transition-colors">Contact Us</Link></li>
              <li><Link to="/blog" className="hover:text-red-500 transition-colors">Blog</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Customer Service</h4>
            <ul className="space-y-4 text-sm text-zinc-400">
              <li><Link to="/faq" className="hover:text-red-500 transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="hover:text-red-500 transition-colors">Shipping Policy</Link></li>
              <li><Link to="/returns" className="hover:text-red-500 transition-colors">Returns & Refunds</Link></li>
              <li><Link to="/privacy" className="hover:text-red-500 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-red-500 transition-colors">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-sm text-zinc-400">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
                <span>123 Commerce Blvd, Business District, Tech City, TC 90210</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-red-500 shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-red-500 shrink-0" />
                <span>support@commercehub.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-zinc-500 text-sm text-center md:text-left">
            © {new Date().getFullYear()} CommerceHub. All rights reserved.
          </p>
          <div className="flex gap-4 opacity-70 grayscale hover:grayscale-0 transition-all">
             <div className="h-8 w-12 bg-white rounded flex items-center justify-center"><span className="text-xs text-black font-bold">VISA</span></div>
             <div className="h-8 w-12 bg-white rounded flex items-center justify-center"><span className="text-xs text-black font-bold">MC</span></div>
             <div className="h-8 w-12 bg-white rounded flex items-center justify-center"><span className="text-xs text-black font-bold">AMEX</span></div>
             <div className="h-8 w-12 bg-white rounded flex items-center justify-center"><span className="text-xs text-black font-bold">PAYPAL</span></div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
