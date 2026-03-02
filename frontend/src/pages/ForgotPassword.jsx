import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import { MailIcon, ArrowRightIcon, CheckCircleIcon } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated gradient blobs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 -left-20 w-96 h-96 bg-[#25D366] rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-20 -right-20 w-96 h-96 bg-[#128C7E] rounded-full blur-3xl"
      />

      {/* Dot pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: 'radial-gradient(circle, #1a1a2e 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Glass card with premium shadows */}
        <div className="bg-white/80 backdrop-blur-2xl rounded-2xl shadow-[0_8px_32px_0_rgba(37,211,102,0.12),0_2px_8px_0_rgba(0,0,0,0.04)] border-2 border-gray-200/60 p-8 relative overflow-hidden">
          {!sent ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Header with gradient text */}
              <div className="text-center mb-8">
                <motion.h2 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl font-extrabold mb-3 tracking-tight bg-gradient-to-br from-[#25D366] via-[#1DB954] to-[#128C7E] bg-clip-text text-transparent"
                >
                  Forgot password?
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-gray-600 text-sm leading-relaxed"
                >
                  Enter your email and we'll send you a reset link
                </motion.p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Enhanced email input */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2 tracking-wide">
                    Email address
                  </label>
                  <div className="relative group">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10 transition-colors duration-300 group-focus-within:text-[#25D366]"
                    >
                      <MailIcon size={20} />
                    </motion.div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 
                                focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 focus:border-[#25D366] 
                                transition-all duration-300 shadow-sm hover:border-gray-300
                                shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.03)] focus:shadow-[0_0_0_3px_rgba(37,211,102,0.1),inset_0_2px_4px_0_rgba(0,0,0,0.03)]"
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                </motion.div>

                {/* Submit button with shimmer */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={loading}
                  className="group relative w-full bg-gradient-to-r from-[#25D366] to-[#1DB954] text-white py-3.5 rounded-xl font-semibold 
                            hover:from-[#1DB954] hover:to-[#128C7E] transition-all duration-300 
                            shadow-[0_4px_16px_0_rgba(37,211,102,0.3)] hover:shadow-[0_6px_20px_0_rgba(37,211,102,0.4)]
                            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-[#25D366] disabled:hover:to-[#1DB954]
                            overflow-hidden"
                >
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out shimmer" />
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send reset link
                        <motion.div
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <ArrowRightIcon size={18} />
                        </motion.div>
                      </>
                    )}
                  </span>
                </motion.button>

                {/* Back to sign in link */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center pt-4"
                >
                  <Link
                    to="/login"
                    className="inline-flex items-center gap-2 text-sm font-medium bg-gradient-to-r from-[#25D366] to-[#1DB954] bg-clip-text text-transparent hover:from-[#1DB954] hover:to-[#128C7E] transition-all duration-300 group"
                  >
                    <motion.svg
                      whileHover={{ x: -4 }}
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="url(#gradient1)"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <defs>
                        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#25D366" />
                          <stop offset="100%" stopColor="#1DB954" />
                        </linearGradient>
                      </defs>
                      <path d="M19 12H5M12 19l-7-7 7-7" />
                    </motion.svg>
                    Back to sign in
                  </Link>
                </motion.div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="text-center space-y-6"
            >
              {/* Success icon with gradient background */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="flex justify-center"
              >
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#25D366] to-[#1DB954] rounded-full flex items-center justify-center shadow-[0_8px_24px_0_rgba(37,211,102,0.3)]">
                    <motion.div
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.6, delay: 0.2 }}
                    >
                      <CheckCircleIcon className="text-white" size={40} strokeWidth={2.5} />
                    </motion.div>
                  </div>
                  {/* Pulse effect */}
                  <motion.div
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.5, 0, 0]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeOut"
                    }}
                    className="absolute inset-0 bg-[#25D366] rounded-full"
                  />
                </div>
              </motion.div>

              {/* Success heading */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-extrabold mb-2 bg-gradient-to-br from-[#25D366] via-[#1DB954] to-[#128C7E] bg-clip-text text-transparent">
                  Check your email
                </h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We've sent a password reset link to
                </p>
                <p className="font-semibold text-gray-900 mt-1">{email}</p>
              </motion.div>

              {/* Instructions */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="bg-gray-50/80 border border-gray-200/60 rounded-xl p-4"
              >
                <p className="text-sm text-gray-600 leading-relaxed">
                  Check your inbox and <span className="font-semibold text-gray-900">spam folder</span> for the password reset link.
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Didn't receive the email?
                </p>
              </motion.div>

              {/* Try again button */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setSent(false)}
                className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-xl font-semibold 
                          hover:border-[#25D366] hover:text-[#25D366] hover:bg-[#25D366]/5 
                          transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Try again
              </motion.button>

              {/* Back to sign in */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="pt-2"
              >
                <Link
                  to="/login"
                  className="inline-flex items-center gap-2 text-sm font-medium bg-gradient-to-r from-[#25D366] to-[#1DB954] bg-clip-text text-transparent hover:from-[#1DB954] hover:to-[#128C7E] transition-all duration-300"
                >
                  <motion.svg
                    whileHover={{ x: -4 }}
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="url(#gradient2)"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <defs>
                      <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#25D366" />
                        <stop offset="100%" stopColor="#1DB954" />
                      </linearGradient>
                    </defs>
                    <path d="M19 12H5M12 19l-7-7 7-7" />
                  </motion.svg>
                  Back to sign in
                </Link>
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}