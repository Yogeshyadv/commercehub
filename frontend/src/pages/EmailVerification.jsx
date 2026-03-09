import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';
import { CheckCircleIcon, XCircleIcon } from 'lucide-react';

export default function EmailVerification() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const response = await authService.verifyEmail(token);
        setStatus('success');
        setMessage(response.message || 'Email verified successfully!');
        toast.success('Email verified! Redirecting to login...');

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Email verification failed');
        toast.error(error.response?.data?.message || 'Verification failed');
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-[#E8FFF3]/30 to-white overflow-hidden relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-gradient-to-br from-[#DC2626]/30 to-[#1DB954]/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-gradient-to-tr from-[#128C7E]/30 to-red-100/30 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 w-full max-w-md animate-in slide-in-from-bottom-5 fade-in duration-500">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center text-[#1a1a2e] hover:text-[#DC2626] transition-all duration-200 mb-4 group">
            <span className="font-bold text-2xl tracking-tight">
              Commerce<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#DC2626] to-[#1DB954]">Hub</span>
            </span>
          </Link>
        </div>

        <div className="bg-white/80 backdrop-blur-2xl border border-white/60 rounded-3xl shadow-[0_8px_32px_0_rgba(220,38,38,0.12),0_2px_8px_0_rgba(0,0,0,0.04)] p-8 sm:p-10 text-center">
          {status === 'verifying' && (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-50 rounded-full mb-6 relative">
                <svg className="animate-spin h-10 w-10 text-[#DC2626]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Verifying your email...
              </h1>
              <p className="text-gray-500 text-sm">
                Please wait while we verify your email address.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                <CheckCircleIcon className="h-10 w-10 text-[#DC2626]" />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
                Email Verified!
              </h1>
              <p className="text-gray-500 text-sm mb-6">
                {message}
              </p>
              <div className="inline-flex items-center gap-2 text-sm font-semibold text-[#1DB954]">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Redirecting to login...</span>
              </div>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                <XCircleIcon className="h-10 w-10 text-red-500" />
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
                Verification Failed
              </h1>
              <p className="text-gray-500 text-sm mb-6">
                {message}
              </p>
              <div className="space-y-3">
                <Link
                  to="/login"
                  className="block w-full text-center bg-gradient-to-r from-[#DC2626] to-[#1DB954] hover:from-[#128C7E] hover:to-[#DC2626] text-white py-3.5 px-4 rounded-xl font-bold text-sm shadow-lg shadow-[#DC2626]/30 transition-all duration-300"
                >
                  Go to Login
                </Link>
                <Link
                  to="/register"
                  className="block w-full text-center py-3.5 px-4 rounded-xl font-bold text-sm text-gray-700 bg-gray-50 hover:bg-gray-100 transition-all border border-gray-200"
                >
                  Create New Account
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
