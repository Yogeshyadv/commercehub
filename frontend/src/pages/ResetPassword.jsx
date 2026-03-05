import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import { LockIcon, EyeIcon, EyeOffIcon, ArrowRightIcon, CheckCircleIcon } from 'lucide-react';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await authService.resetPassword(token, formData.password);
      setSuccess(true);
      toast.success('Password reset successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-white via-[#E8FFF3]/30 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl shadow-xl p-8 text-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="w-10 h-10 text-[#25D366]" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Password Reset!</h2>
          <p className="text-gray-500 mb-8">
            Your password has been successfully reset. You can now log in with your new password.
          </p>
          <Link
            to="/login"
            className="w-full bg-gradient-to-r from-[#25D366] to-[#1DB954] hover:from-[#128C7E] hover:to-[#25D366] text-white py-3.5 px-4 rounded-xl font-bold shadow-lg shadow-[#25D366]/20 transition-all duration-300 flex items-center justify-center gap-2"
          >
            Go to Login
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-[#E8FFF3]/30 to-white overflow-hidden relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-[#25D366]/30 to-[#1DB954]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-gradient-to-tr from-[#128C7E]/30 to-green-100/30 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-in slide-in-from-bottom-5 fade-in duration-500">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-[#1a1a2e] hover:text-[#25D366] transition-all duration-200 mb-4 group">
            <span className="font-bold text-2xl tracking-tight">
              Commerce<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#25D366] to-[#1DB954]">Hub</span>
            </span>
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-[0_8px_32px_0_rgba(37,211,102,0.12),0_2px_8px_0_rgba(0,0,0,0.04)] p-8 sm:p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold mb-3 tracking-tight text-gray-900">Set New Password</h2>
            <p className="text-gray-500 text-sm">Enter your new password below to regain access.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#25D366] transition-colors">
                  <LockIcon className="h-5 w-5" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="block w-full pl-11 pr-12 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#25D366]/20 focus:border-[#25D366] focus:bg-white transition-all shadow-sm outline-none"
                  placeholder="New password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#25D366] transition-colors">
                  <LockIcon className="h-5 w-5" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  className="block w-full pl-11 pr-12 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl text-gray-900 text-sm focus:ring-2 focus:ring-[#25D366]/20 focus:border-[#25D366] focus:bg-white transition-all shadow-sm outline-none"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden bg-gradient-to-r from-[#25D366] to-[#1DB954] hover:from-[#128C7E] hover:to-[#25D366] text-white py-3.5 px-4 rounded-xl font-bold text-sm shadow-lg shadow-[#25D366]/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
            >
              <div className="absolute inset-0 w-full h-full bg-white/20 scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />
              <span className="relative flex items-center justify-center">
                {loading ? (
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  'Reset Password'
                )}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}