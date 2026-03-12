import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { MailIcon, LockIcon, UserIcon, PhoneIcon, BuildingIcon, EyeIcon, EyeOffIcon, CheckCircleIcon } from 'lucide-react';

function Field({ label, id, icon, rightEl, children }) {
  return (
    <div>
      {(label || rightEl) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <label htmlFor={id} className="text-xs font-semibold text-gray-600">{label}</label>}
          {rightEl}
        </div>
      )}
      <div className="relative">
        {icon && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">{icon}</span>}
        {children}
      </div>
    </div>
  );
}

function SocialButton({ icon, label }) {
  return (
    <button type="button" className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg bg-white border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
      {icon}
      {label}
    </button>
  );
}

const inputCls = "w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-black text-sm placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all shadow-sm";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    password: '', confirmPassword: '', role: 'vendor', businessName: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [agreed, setAgreed] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreed) { toast.error('Please accept the terms and privacy policy'); return; }
    if (formData.password !== formData.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (formData.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    if (formData.role === 'vendor' && !formData.businessName.trim()) { toast.error('Business name is required for vendors'); return; }
    setLoading(true);
    try {
      await register(formData);
      setRegisteredEmail(formData.email);
      setRegistered(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
        <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[260px]" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(220,38,38,0.08) 0%, transparent 70%)' }} />
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} className="relative z-10 w-full max-w-[420px] text-center">
          <Link to="/" className="inline-block mb-8">
            <span className="text-2xl font-black tracking-tight text-black">Commerce<span className="text-[#DC2626]">Hub</span></span>
          </Link>
          <div className="flex items-center justify-center mb-5">
            <div className="w-14 h-14 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <CheckCircleIcon className="w-7 h-7 text-green-400" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-black mb-2">Check your inbox</h1>
          <p className="text-sm text-gray-600 mb-1.5">We sent a verification link to</p>
          <p className="text-sm font-semibold text-black mb-6">{registeredEmail}</p>
          <p className="text-xs text-gray-600 mb-6">Click the link in the email to activate your account. Check your spam folder if you don't see it.</p>
          <Link to="/login" className="inline-flex items-center justify-center w-full py-2.5 rounded-lg bg-[#DC2626] hover:bg-[#c41f1f] text-white font-bold text-sm transition-colors">
            Go to sign in
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12">
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[260px]" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(220,38,38,0.08) 0%, transparent 70%)' }} />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="relative z-10 w-full max-w-[480px]">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <span className="text-2xl font-black tracking-tight text-black">Commerce<span className="text-[#DC2626]">Hub</span></span>
          </Link>
        </div>

        {/* Heading */}
        <div className="text-center mb-7">
          <h1 className="text-[1.65rem] font-black text-black tracking-tight mb-1.5">Create your account</h1>
          <p className="text-sm text-gray-500">Start selling in minutes. No credit card required.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {/* Role toggle */}
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-2">Account type</p>
            <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 border border-gray-200 rounded-lg">
              {['vendor', 'customer'].map(r => (
                <button
                  key={r} type="button" onClick={() => setFormData(prev => ({ ...prev, role: r }))}
                  className={`py-2 rounded-md text-xs font-bold capitalize transition-all ${formData.role === r ? 'bg-red-500 text-white shadow' : 'text-gray-600 hover:text-gray-800'}`}
                >
                  {r === 'vendor' ? 'Vendor / Seller' : 'Customer / Buyer'}
                </button>
              ))}
            </div>
          </div>

          {/* First + Last name */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="First name" id="firstName" icon={<UserIcon className="w-4 h-4" />}>
              <input id="firstName" name="firstName" type="text" required value={formData.firstName} onChange={handleChange} className={inputCls} placeholder="Jane" />
            </Field>
            <Field label="Last name" id="lastName" icon={<UserIcon className="w-4 h-4" />}>
              <input id="lastName" name="lastName" type="text" required value={formData.lastName} onChange={handleChange} className={inputCls} placeholder="Smith" />
            </Field>
          </div>

          {/* Email */}
          <Field label="Email address" id="email" icon={<MailIcon className="w-4 h-4" />}>
            <input id="email" name="email" type="email" autoComplete="email" required value={formData.email} onChange={handleChange} className={inputCls} placeholder="you@example.com" />
          </Field>

          {/* Phone */}
          <Field label="Phone (optional)" id="phone" icon={<PhoneIcon className="w-4 h-4" />}>
            <input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} className={inputCls} placeholder="+1 (555) 000-0000" />
          </Field>

          {/* Business name (vendor only) */}
          {formData.role === 'vendor' && (
            <Field label="Business name" id="businessName" icon={<BuildingIcon className="w-4 h-4" />}>
              <input id="businessName" name="businessName" type="text" required value={formData.businessName} onChange={handleChange} className={inputCls} placeholder="Acme Co." />
            </Field>
          )}

          {/* Password + Confirm */}
          <div className="grid grid-cols-2 gap-3">
            <Field label="Password" id="password" icon={<LockIcon className="w-4 h-4" />}
              rightEl={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              }
            >
              <input id="password" name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" required value={formData.password} onChange={handleChange} className={inputCls + ' pr-4'} placeholder="Min 8 chars" />
            </Field>
            <Field label="Confirm password" id="confirmPassword" icon={<LockIcon className="w-4 h-4" />}
              rightEl={
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-xs text-gray-600 hover:text-gray-400 transition-colors">
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              }
            >
              <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} autoComplete="new-password" required value={formData.confirmPassword} onChange={handleChange} className={inputCls + ' pr-4'} placeholder="Repeat password" />
            </Field>
          </div>

          {/* Terms */}
          <label className="flex items-start gap-2.5 cursor-pointer pt-0.5">
            <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} className="mt-0.5 w-3.5 h-3.5 accent-[#DC2626] shrink-0" />
            <span className="text-xs text-gray-500 leading-relaxed">
              I agree to the{' '}
              <Link to="/terms-of-service" className="text-white hover:text-[#DC2626] transition-colors">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy-policy" className="text-white hover:text-[#DC2626] transition-colors">Privacy Policy</Link>
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit" disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[#DC2626] hover:bg-[#c41f1f] text-white font-bold text-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-1"
          >
            {loading
              ? <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Creating account...</>
              : 'Create account'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-600">or</span>
          <div className="flex-1 h-px bg-gray-200" />
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
          Already have an account?{' '}
          <Link to="/login" className="text-red-600 font-semibold hover:text-red-700 transition-colors">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}