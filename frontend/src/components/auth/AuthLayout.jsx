import { Link } from 'react-router-dom';
import { HiSparkles, HiCheckCircle } from 'react-icons/hi';

export default function AuthLayout({ children, title, subtitle, type = 'login' }) {
  const features = [
    'AI-powered product descriptions',
    'Real-time inventory tracking',
    'Beautiful digital catalogs',
    'Advanced analytics dashboard',
    'Multi-channel selling',
    'Secure payment processing'
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-20 xl:px-24 bg-white">
        <div className="mx-auto w-full max-w-sm lg:max-w-md">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">N</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NextGen B2B
            </span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
              {title}
            </h1>
            <p className="text-gray-600">
              {subtitle}
            </p>
          </div>

          {/* Content */}
          <div className="animate-fadeIn">
            {children}
          </div>

          {/* Footer */}
          <div className="mt-8">
            <p className="text-center text-sm text-gray-500">
              {type === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                    Sign up for free
                  </Link>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                    Sign in
                  </Link>
                </>
              )}
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <HiCheckCircle className="w-4 h-4 text-green-500" />
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center gap-1">
                <HiCheckCircle className="w-4 h-4 text-green-500" />
                <span>No credit card</span>
              </div>
              <div className="flex items-center gap-1">
                <HiCheckCircle className="w-4 h-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Brand/Features */}
      <div className="hidden lg:block relative w-0 flex-1 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Content */}
        <div className="relative h-full flex flex-col justify-center px-12 py-12 text-white">
          <div className="max-w-lg">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium mb-8">
              <HiSparkles className="w-4 h-4" />
              <span>Trusted by 1000+ businesses</span>
            </div>

            {/* Main Message */}
            <h2 className="text-4xl font-extrabold mb-6 leading-tight">
              Transform your business into a digital powerhouse
            </h2>
            <p className="text-xl text-blue-100 mb-12">
              Join thousands of businesses using NextGen to manage inventory, create catalogs, and sell across multiple channels.
            </p>

            {/* Features List */}
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3 animate-fadeIn" style={{ animationDelay: `${index * 0.1}s` }}>
                  <div className="flex-shrink-0 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <HiCheckCircle className="w-4 h-4" />
                  </div>
                  <span className="text-blue-50">{feature}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-12 pt-12 border-t border-white/20 grid grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold">1000+</div>
                <div className="text-sm text-blue-200 mt-1">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold">99.9%</div>
                <div className="text-sm text-blue-200 mt-1">Uptime</div>
              </div>
              <div>
                <div className="text-3xl font-bold">4.9/5</div>
                <div className="text-sm text-blue-200 mt-1">Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-pink-400/20 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
