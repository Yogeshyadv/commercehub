import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  MailIcon, 
  LockIcon, 
  UserIcon, 
  PhoneIcon, 
  BuildingIcon, 
  EyeIcon, 
  EyeOffIcon, 
  ArrowRightIcon,
  CheckCircleIcon 
} from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '',
    confirmPassword: '', role: 'vendor', businessName: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    if (formData.role === 'vendor' && !formData.businessName.trim()) {
      toast.error('Business name is required');
      return;
    }

    setLoading(true);
    try {
      const response = await register(formData);
      toast.success(response.message || 'Account created successfully!');
      setRegisteredEmail(formData.email);
      setRegistered(true);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  // Show success message after registration
  if (registered) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-white via-[#E8FFF3]/30 to-white overflow-hidden relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        {/* Decorative Background Blobs */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-[#25D366]/30 to-[#1DB954]/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              opacity: [0.2, 0.4, 0.2]
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
            className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-gradient-to-tr from-[#128C7E]/30 to-green-100/30 rounded-full blur-3xl"
          />
        </div>

        {/* Subtle Dot Pattern */}
        <div 
          className="fixed inset-0 z-0 opacity-[0.025]" 
          style={{
            backgroundImage: 'radial-gradient(circle, #1a1a2e 1px, transparent 1px)',
            backgroundSize: '32px 32px'
          }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="bg-white/80 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-[0_8px_32px_0_rgba(37,211,102,0.12),0_2px_8px_0_rgba(0,0,0,0.04)] p-8 sm:p-10">
            <div className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#25D366]/20 to-[#1DB954]/20 rounded-full mb-6 shadow-lg"
              >
                <CheckCircleIcon className="w-10 h-10 text-[#25D366]" />
              </motion.div>
              
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-extrabold mb-3 tracking-tight"
                style={{ 
                  background: 'linear-gradient(135deg, #1a1a2e 0%, #25D366 50%, #1DB954 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.02em'
                }}
              >
                Check your email
              </motion.h3>
              
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-6"
              >
                We've sent a verification link to <strong className="text-[#1a1a2e]">{registeredEmail}</strong>. 
                Click the link to verify your account.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6"
              >
                <p className="text-sm text-green-800">
                  💡 Check your spam folder if you don't see the email
                </p>
              </motion.div>
              
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setRegistered(false);
                  setFormData({
                    firstName: '', lastName: '', email: '', phone: '', password: '',
                    confirmPassword: '', role: 'vendor', businessName: '',
                  });
                }}
                className="text-[#25D366] hover:text-[#128C7E] font-semibold transition-colors"
              >
                Register with a different email
              </motion.button>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Link
                  to="/login"
                  className="text-sm text-gray-600 hover:text-[#1a1a2e] transition-colors"
                >
                  Already verified? <span className="font-semibold text-[#25D366]">Sign in</span>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-[#E8FFF3]/30 to-white overflow-hidden relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-[#25D366]/30 to-[#1DB954]/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-gradient-to-tr from-[#128C7E]/30 to-green-100/30 rounded-full blur-3xl"
        />
      </div>

      {/* Subtle Dot Pattern */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.025]" 
        style={{
          backgroundImage: 'radial-gradient(circle, #1a1a2e 1px, transparent 1px)',
          backgroundSize: '32px 32px'
        }}
      />

      {/* Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-2xl"
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

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="bg-white/80 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-[0_8px_32px_0_rgba(37,211,102,0.12),0_2px_8px_0_rgba(0,0,0,0.04)] p-8 sm:p-10"
        >
          <div className="text-center mb-8">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-4xl font-extrabold mb-3 tracking-tight"
              style={{ 
                background: 'linear-gradient(135deg, #1a1a2e 0%, #25D366 50%, #1DB954 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                lineHeight: '1.2',
                letterSpacing: '-0.02em'
              }}
            >
              Create your account
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-gray-600 text-base leading-relaxed"
            >
              Start selling on WhatsApp in minutes
            </motion.p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Account Type */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25 }}
            >
              <label className="block text-sm font-bold text-[#1a1a2e] mb-3 tracking-wide">
                I am a
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'vendor', label: 'Business / Vendor', icon: '🏪' },
                  { value: 'customer', label: 'Customer', icon: '🛒' },
                ].map(({ value, label, icon }) => (
                  <motion.label
                    key={value}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative flex items-center justify-center px-4 py-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                      formData.role === value
                        ? 'border-[#25D366] bg-gradient-to-br from-[#25D366]/10 to-[#1DB954]/5 text-[#1a1a2e] shadow-lg shadow-[#25D366]/20'
                        : 'border-gray-200/60 hover:border-[#25D366]/40 hover:bg-white/80'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={value}
                      checked={formData.role === value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="text-2xl mr-2">{icon}</span>
                    <span className="text-sm font-bold tracking-wide">{label}</span>
                  </motion.label>
                ))}
              </div>
            </motion.div>

            {/* Name Fields */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div>
                <label htmlFor="firstName" className="block text-sm font-bold text-[#1a1a2e] mb-2.5 tracking-wide">
                  First name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <UserIcon className="h-5 w-5 text-gray-400 group-focus-within:text-[#25D366] transition-all duration-200" />
                    </motion.div>
                  </div>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 bg-white/60 border-2 border-gray-200/60 rounded-2xl text-[#1a1a2e] placeholder-gray-400 shadow-inner focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 focus:border-[#25D366] focus:bg-white focus:shadow-[0_0_0_3px_rgba(37,211,102,0.1),0_8px_16px_rgba(37,211,102,0.15)] transition-all duration-300"
                    placeholder="John"
                    style={{ letterSpacing: '0.01em' }}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-bold text-[#1a1a2e] mb-2.5 tracking-wide">
                  Last name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <UserIcon className="h-5 w-5 text-gray-400 group-focus-within:text-[#25D366] transition-all duration-200" />
                    </motion.div>
                  </div>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 bg-white/60 border-2 border-gray-200/60 rounded-2xl text-[#1a1a2e] placeholder-gray-400 shadow-inner focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 focus:border-[#25D366] focus:bg-white focus:shadow-[0_0_0_3px_rgba(37,211,102,0.1),0_8px_16px_rgba(37,211,102,0.15)] transition-all duration-300"
                    placeholder="Doe"
                    style={{ letterSpacing: '0.01em' }}
                  />
                </div>
              </div>
            </motion.div>

            {/* Email Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
            >
              <label htmlFor="email" className="block text-sm font-bold text-[#1a1a2e] mb-2.5 tracking-wide">
                Email address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <MailIcon className="h-5 w-5 text-gray-400 group-focus-within:text-[#25D366] transition-all duration-200" />
                  </motion.div>
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
            </motion.div>

            {/* Phone Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.55 }}
            >
              <label htmlFor="phone" className="block text-sm font-bold text-[#1a1a2e] mb-2.5 tracking-wide">
                Phone number <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    transition={{ type: "spring", stiffness: 400 }}
                  >
                    <PhoneIcon className="h-5 w-5 text-gray-400 group-focus-within:text-[#25D366] transition-all duration-200" />
                  </motion.div>
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="block w-full pl-12 pr-4 py-4 bg-white/60 border-2 border-gray-200/60 rounded-2xl text-[#1a1a2e] placeholder-gray-400 shadow-inner focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 focus:border-[#25D366] focus:bg-white focus:shadow-[0_0_0_3px_rgba(37,211,102,0.1),0_8px_16px_rgba(37,211,102,0.15)] transition-all duration-300"
                  placeholder="+91 98765 43210"
                  style={{ letterSpacing: '0.01em' }}
                />
              </div>
            </motion.div>

            {/* Business Name (Vendor only) */}
            {formData.role === 'vendor' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <label htmlFor="businessName" className="block text-sm font-bold text-[#1a1a2e] mb-2.5 tracking-wide">
                  Business name
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <BuildingIcon className="h-5 w-5 text-gray-400 group-focus-within:text-[#25D366] transition-all duration-200" />
                    </motion.div>
                  </div>
                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 bg-white/60 border-2 border-gray-200/60 rounded-2xl text-[#1a1a2e] placeholder-gray-400 shadow-inner focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 focus:border-[#25D366] focus:bg-white focus:shadow-[0_0_0_3px_rgba(37,211,102,0.1),0_8px_16px_rgba(37,211,102,0.15)] transition-all duration-300"
                    placeholder="Your Business Name"
                    style={{ letterSpacing: '0.01em' }}
                  />
                </div>
              </motion.div>
            )}

            {/* Password Fields */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.65 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              <div>
                <label htmlFor="password" className="block text-sm font-bold text-[#1a1a2e] mb-2.5 tracking-wide">
                  Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: -5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <LockIcon className="h-5 w-5 text-gray-400 group-focus-within:text-[#25D366] transition-all duration-200" />
                    </motion.div>
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-12 py-4 bg-white/60 border-2 border-gray-200/60 rounded-2xl text-[#1a1a2e] placeholder-gray-400 shadow-inner focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 focus:border-[#25D366] focus:bg-white focus:shadow-[0_0_0_3px_rgba(37,211,102,0.1),0_8px_16px_rgba(37,211,102,0.15)] transition-all duration-300"
                    placeholder="Min 8 characters"
                    style={{ letterSpacing: '0.01em' }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#1DB954] transition-colors z-10"
                  >
                    {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </motion.button>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-bold text-[#1a1a2e] mb-2.5 tracking-wide">
                  Confirm password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400 }}
                    >
                      <LockIcon className="h-5 w-5 text-gray-400 group-focus-within:text-[#25D366] transition-all duration-200" />
                    </motion.div>
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-12 py-4 bg-white/60 border-2 border-gray-200/60 rounded-2xl text-[#1a1a2e] placeholder-gray-400 shadow-inner focus:outline-none focus:ring-4 focus:ring-[#25D366]/30 focus:border-[#25D366] focus:bg-white focus:shadow-[0_0_0_3px_rgba(37,211,102,0.1),0_8px_16px_rgba(37,211,102,0.15)] transition-all duration-300"
                    placeholder="Confirm password"
                    style={{ letterSpacing: '0.01em' }}
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-[#1DB954] transition-colors z-10"
                  >
                    {showConfirmPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Terms & Conditions */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-start"
            >
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                className="h-4 w-4 text-[#25D366] focus:ring-[#1DB954] border-gray-300 rounded mt-1 transition-all duration-200"
              />
              <label htmlFor="terms" className="ml-3 block text-sm font-medium text-gray-600 leading-relaxed">
                I agree to the{' '}
                <a href="#" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#25D366] to-[#1DB954] hover:from-[#1DB954] hover:to-[#25D366] transition-all duration-200">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#25D366] to-[#1DB954] hover:from-[#1DB954] hover:to-[#25D366] transition-all duration-200">
                  Privacy Policy
                </a>
              </label>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="relative w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#25D366] via-[#1DB954] to-[#128C7E] text-white font-bold text-base shadow-[0_4px_16px_rgba(37,211,102,0.3),0_8px_32px_rgba(37,211,102,0.15)] hover:shadow-[0_8px_24px_rgba(37,211,102,0.4),0_12px_48px_rgba(37,211,102,0.2)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center overflow-hidden group"
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
                  <span className="relative z-10">Creating account...</span>
                </>
              ) : (
                <>
                  <span className="relative z-10">Create account</span>
                  <ArrowRightIcon className="ml-2 w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform duration-200" />
                </>
              )}
            </motion.button>
          </form>

          {/* Sign In Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.95 }}
            className="mt-8 pt-6 border-t border-gray-200/60 text-center"
          >
            <p className="text-sm text-gray-600 leading-relaxed">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#25D366] to-[#1DB954] hover:from-[#1DB954] hover:to-[#25D366] transition-all duration-200 inline-flex items-center"
              >
                Sign in
                <svg className="w-4 h-4 ml-1 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" style={{ stroke: 'url(#gradient2)' }} />
                  <defs>
                    <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#25D366" />
                      <stop offset="100%" stopColor="#1DB954" />
                    </linearGradient>
                  </defs>
                </svg>
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}