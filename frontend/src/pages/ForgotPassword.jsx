import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import { MailIcon, KeyIcon, CheckCircleIcon, ArrowLeftIcon } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) { toast.error('Please enter your email address'); return; }
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4 py-12">
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[260px]" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(220,38,38,0.13) 0%, transparent 70%)' }} />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 w-full max-w-[420px]">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="text-2xl font-black tracking-tight text-white">Commerce<span className="text-[#DC2626]">Hub</span></span>
          </Link>
        </div>

        {sent ? (
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }} className="text-center">
            <div className="flex items-center justify-center mb-5">
              <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <CheckCircleIcon className="w-7 h-7 text-green-400" />
              </div>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight mb-2">Check your inbox</h1>
            <p className="text-sm text-gray-500 mb-1.5">We sent a password reset link to</p>
            <p className="text-sm font-semibold text-white mb-6">{email}</p>
            <p className="text-xs text-gray-600 mb-7">
              The link expires in 30 minutes. Check your spam folder if you don't see it.
            </p>
            <Link to="/login" className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-lg bg-[#DC2626] hover:bg-[#c41f1f] text-white font-bold text-sm transition-colors">
              <ArrowLeftIcon className="w-4 h-4" />
              Back to sign in
            </Link>
          </motion.div>
        ) : (
          <>
            {/* Icon + Heading */}
            <div className="text-center mb-7">
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-xl bg-[#DC2626]/10 border border-[#DC2626]/20 flex items-center justify-center">
                  <KeyIcon className="w-5 h-5 text-[#DC2626]" />
                </div>
              </div>
              <h1 className="text-[1.65rem] font-black text-white tracking-tight mb-1.5">Reset your password</h1>
              <p className="text-sm text-gray-500">Enter your email and we'll send you a reset link.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-xs font-semibold text-gray-400 mb-1.5">Email address</label>
                <div className="relative">
                  <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
                  <input
                    id="email" name="email" type="email" required
                    value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-[#141414] border border-white/[0.1] rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#DC2626]/60 focus:ring-2 focus:ring-[#DC2626]/10 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full py-2.5 rounded-lg bg-[#DC2626] hover:bg-[#c41f1f] text-white font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading
                  ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Sending...</>
                  : 'Send reset link'}
              </button>
            </form>

            <p className="text-center text-xs text-gray-600 mt-7">
              Remember it?{' '}
              <Link to="/login" className="text-white font-semibold hover:text-[#DC2626] transition-colors">Back to sign in</Link>
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}