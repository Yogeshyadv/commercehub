import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function HeroSection() {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleStart = (e) => {
    e.preventDefault();
    navigate('/register');
  };

  return (
    <section className="bg-black text-white overflow-hidden">
      {/* Main hero */}
      <div className="max-w-4xl mx-auto px-6 text-center pt-36 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          <h1 className="text-[clamp(3rem,10vw,6rem)] font-black leading-[1.0] tracking-tight text-white mb-8">
            Be the next<br />big thing
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-md mx-auto font-medium leading-relaxed">
            Dream big, build fast, and grow your business with CommerceHub.
          </p>
          <form onSubmit={handleStart} className="flex flex-col sm:flex-row gap-3 max-w-[500px] mx-auto">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-5 py-4 rounded-xl bg-white/[0.07] border border-white/[0.1] text-white placeholder-gray-600 focus:outline-none focus:border-[#DC2626] focus:bg-white/[0.10] transition-all text-sm font-medium"
            />
            <button
              type="submit"
              className="px-7 py-4 bg-[#DC2626] text-white font-bold rounded-xl hover:bg-[#B91C1C] active:scale-95 transition-all text-sm flex items-center justify-center gap-2 shrink-0 shadow-lg"
            >
              Start for free <ArrowRightIcon className="w-4 h-4" />
            </button>
          </form>
          <p className="text-gray-700 text-xs mt-4 font-semibold tracking-wide">
            No credit card required. Try free for 14 days.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
