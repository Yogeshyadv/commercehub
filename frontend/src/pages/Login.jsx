import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon, ArrowRightIcon } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    setNeedsVerification(false);
    try {
      const response = await login(formData);
      toast.success(response.message || 'Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.needsVerification) {
        setNeedsVerification(true);
        toast.error('Please verify your email before logging in');
      } else {
        toast.error(errorData?.message || 'Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!formData.email) {
      toast.error('Please enter your email address');
      return;
    }
    setResendingEmail(true);
    try {
      await authService.resendVerification(formData.email);
      toast.success('Verification email sent! Please check your inbox.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send verification email');
    } finally {
      setResendingEmail(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-[#E8FFF3]/30 to-white overflow-hidden relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div 
          className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-[#25D366]/30 to-[#1DB954]/20 rounded-full blur-3xl animate-pulse"
        />
        <div
          className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-gradient-to-tr from-[#128C7E]/30 to-blue-100/30 rounded-full blur-3xl animate-pulse delay-1000"
        />
      </div>

      {/* Subtle Dot Pattern Overlay */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.025]" 
        style={{
          backgroundImage: 'radial-gradient(circle, #1a1a2e 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Login Card */}
      <div
        className="relative z-10 w-full max-w-md animate-in slide-in-from-bottom-5 fade-in duration-500"
      >
        {/* Logo/Back Link */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-[#1a1a2e] hover:text-[#25D366] transition-all duration-200 mb-4 group">
            <ArrowRightIcon className="w-5 h-5 mr-2 rotate-180 group-hover:-translate-x-1 transition-transform" />
            <span className="font-bold text-2xl tracking-tight">
              Commerce<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#25D366] to-[#1DB954]">Hub</span>
            </span>
          </Link>
        </div>

        <div 
          className="bg-white/80 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-[0_8px_32px_0_rgba(37,211,102,0.12),0_2px_8px_0_rgba(0,0,0,0.04)] p-8 sm:p-10 animate-in zoom-in-95 duration-500 delay-100"
        >
          <div className="text-center mb-8">
            <h2
              className="text-4xl font-extrabold mb-3 tracking-tight animate-in slide-in-from-bottom-2 fade-in duration-500 delay-200"
              style={{ 
                background: 'linear-gradient(135deg, #1a1a2e 0%, #25D366 50%, #1DB954 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: '1.2',
                letterSpacing: '-0.02em'
              }}
            >
              Welcome back
            </h2>
            <p
              className="text-gray-600 text-base leading-relaxed animate-in slide-in-from-bottom-2 fade-in duration-500 delay-300"
            >
              Sign in to continue to your dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="animate-in slide-in-from-left-4 fade-in duration-500 delay-300">
              <label htmlFor="email" className="block text-sm font-bold text-[#1a1a2e] mb-2.5 tracking-wide">
                Email address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <div className="transform transition-transform group-hover:scale-110">
                    <MailIcon className="h-5 w-5 text-gray-400 group-focus-within:text-[#25D366] transition-all duration-200" />
                  </div>
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-4 py-4 bg-white/60 border-2 border-gray-200/60 rounded-2xl text-[#1a1a2e] placeholder-gray-400 shadow-inner focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 focus:border-[#25D366] focus:bg-white focus:shadow-[0_0_0_3px_rgba(37,211,102,0.1),0_8px_16px_rgba(37,211,102,0.15)] transition-all duration-300"
                  placeholder="you@example.com"
                  style={{ letterSpacing: '0.01em' }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="animate-in slide-in-from-right-4 fade-in duration-500 delay-400">
              <label htmlFor="password" className="block text-sm font-bold text-[#1a1a2e] mb-2.5 tracking-wide">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <div className="transform transition-transform group-hover:scale-110">
                    <LockIcon className="h-5 w-5 text-gray-400 group-focus-within:text-[#25D366] transition-all duration-200" />
                  </div>
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-12 py-4 bg-white/60 border-2 border-gray-200/60 rounded-2xl text-[#1a1a2e] placeholder-gray-400 shadow-inner focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 focus:border-[#25D366] focus:bg-white focus:shadow-[0_0_0_3px_rgba(37,211,102,0.1),0_8px_16px_rgba(37,211,102,0.15)] transition-all duration-300"
                  placeholder="Enter your password"
                  style={{ letterSpacing: '0.01em' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#1DB954] transition-colors z-10 hover:scale-110 transform"
                >
                  {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
              {/* Trust Badge */}
              <div className="flex items-center mt-2 text-xs text-gray-500 animate-in fade-in delay-500">
                <svg className="w-3.5 h-3.5 text-[#25D366] mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>256-bit encryption • Your data is secure</span>
              </div>
            </div>

            {/* Email Verification Alert */}
            {needsVerification && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl animate-in fade-in zoom-in-95">
                <div className="flex items-start">
                  <svg className="h-5 w-5 text-yellow-600 mt-0.5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-yellow-800 mb-1">Email Not Verified</h4>
                    <p className="text-sm text-yellow-700 mb-2">
                      Please verify your email address before logging in.
                    </p>
                    <button
                      type="button"
                      onClick={handleResendVerification}
                      disabled={resendingEmail}
                      className="text-sm font-semibold text-yellow-800 hover:text-yellow-900 underline disabled:opacity-50"
                    >
                      {resendingEmail ? 'Sending...' : 'Resend verification email'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between animate-in fade-in delay-500">
              <label className="flex items-center cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#25D366] focus:ring-[#1DB954] border-gray-300 rounded transition-all duration-200"
                />
                <span className="ml-2.5 text-sm font-medium text-gray-600 group-hover:text-[#1a1a2e] transition-colors">
                  Remember me
                </span>
              </label>
              <Link
                to="/forgot-password"
                className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#25D366] to-[#1DB954] hover:from-[#1DB954] hover:to-[#128C7E] transition-all duration-200"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="relative w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#25D366] via-[#1DB954] to-[#128C7E] text-white font-bold text-base shadow-[0_4px_16px_rgba(37,211,102,0.3),0_8px_32px_rgba(37,211,102,0.15)] hover:shadow-[0_8px_24px_rgba(37,211,102,0.4),0_12px_48px_rgba(37,211,102,0.2)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center overflow-hidden group transform hover:scale-[1.02] active:scale-[0.98] animate-in slide-in-from-bottom-2 fade-in delay-500"
              style={{ letterSpacing: '0.02em' }}
            >
              {/* Shimmer Effect */}
              <span className="absolute inset-0 w-1/3 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-20deg] group-hover:animate-[shimmer_1.5s_ease-in-out] -translate-x-full" />
              
              {/* Subtle pulse on hover */}
              <span className="absolute inset-0 bg-gradient-to-r from-[#1DB954] to-[#25D366] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white relative z-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="relative z-10">Signing in...</span>
                </>
              ) : (
                <>
                  <span className="relative z-10">Sign in</span>
                  <ArrowRightIcon className="ml-2 w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 pt-6 border-t border-gray-200/60 text-center animate-in fade-in delay-700">
            <p className="text-sm text-gray-600 leading-relaxed">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#25D366] to-[#1DB954] hover:from-[#1DB954] hover:to-[#25D366] transition-all duration-200 inline-flex items-center"
              >
                Sign up for free
                <svg className="w-4 h-4 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" style={{ stroke: 'url(#gradient)' }} />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#25D366" />
                      <stop offset="100%" stopColor="#1DB954" />
                    </linearGradient>
                  </defs>
                </svg>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}