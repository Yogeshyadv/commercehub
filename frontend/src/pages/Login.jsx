import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import { MailIcon, LockIcon, EyeIcon, EyeOffIcon } from 'lucide-react';

function SocialButton({ icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm font-medium text-gray-300 hover:bg-white/[0.08] hover:border-white/[0.14] transition-all"
    >
      {icon}
      {label}
    </button>
  );
}

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendingEmail, setResendingEmail] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) { toast.error('Please fill in all fields'); return; }
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
    if (!formData.email) { toast.error('Please enter your email address'); return; }
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
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-4 py-12">
      {/* Subtle top glow */}
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[260px]" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(220,38,38,0.13) 0%, transparent 70%)' }} />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 w-full max-w-[420px]">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="text-2xl font-black tracking-tight text-white">Commerce<span className="text-[#DC2626]">Hub</span></span>
          </Link>
        </div>

        {/* Heading */}
        <div className="text-center mb-7">
          <h1 className="text-[1.65rem] font-black text-white tracking-tight mb-1.5">Log in to your account</h1>
          <p className="text-sm text-gray-500">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-semibold text-gray-400 mb-1.5">Email address</label>
            <div className="relative">
              <MailIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
              <input
                id="email" name="email" type="email" autoComplete="email" required
                value={formData.email} onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-[#141414] border border-white/[0.1] rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#DC2626]/60 focus:ring-2 focus:ring-[#DC2626]/10 transition-all"
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-gray-400">Password</label>
              <Link to="/forgot-password" className="text-xs text-[#DC2626] hover:text-red-400 transition-colors font-medium">Forgot password?</Link>
            </div>
            <div className="relative">
              <LockIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
              <input
                id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required
                value={formData.password} onChange={handleChange}
                className="w-full pl-10 pr-11 py-2.5 bg-[#141414] border border-white/[0.1] rounded-lg text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#DC2626]/60 focus:ring-2 focus:ring-[#DC2626]/10 transition-all"
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors">
                {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Email not verified warning */}
          {needsVerification && (
            <div className="p-3 bg-amber-500/8 border border-amber-500/20 rounded-lg">
              <p className="text-xs text-amber-400 mb-1.5">Your email address has not been verified.</p>
              <button type="button" onClick={handleResendVerification} disabled={resendingEmail} className="text-xs font-semibold text-amber-400 hover:underline disabled:opacity-50">
                {resendingEmail ? 'Sending...' : 'Resend verification email'}
              </button>
            </div>
          )}

          {/* Remember me */}
          <label className="flex items-center gap-2.5 cursor-pointer pt-0.5">
            <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} className="w-3.5 h-3.5 accent-[#DC2626]" />
            <span className="text-xs text-gray-500">Keep me logged in</span>
          </label>

          {/* Submit */}
          <button
            type="submit" disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[#DC2626] hover:bg-[#c41f1f] text-white font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-1"
          >
            {loading
              ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Logging in...</>
              : 'Log in'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-white/[0.06]" />
          <span className="text-xs text-gray-600">or</span>
          <div className="flex-1 h-px bg-white/[0.06]" />
        </div>

        {/* Social */}
        <div className="space-y-2.5">
          <SocialButton
            label="Continue with Google"
            icon={<svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>}
          />
          <SocialButton
            label="Continue with Apple"
            icon={<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>}
          />
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-600 mt-7">
          Don't have an account?{' '}
          <Link to="/register" className="text-white font-semibold hover:text-[#DC2626] transition-colors">Create account</Link>
        </p>
      </motion.div>
    </div>
  );
}