import { Link } from 'react-router-dom';
import { HiArrowRight, HiCheckCircle } from 'react-icons/hi';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-red-50/30 to-white pt-24 pb-20">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#d1fae5_1px,transparent_1px),linear-gradient(to_bottom,#d1fae5_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div className="text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 border border-red-200 rounded-full text-red-700 text-sm font-medium mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
              </span>
              <span>Trusted by 1000+ businesses across India</span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Transform Your B2B
              <span className="block bg-gradient-to-r from-red-600 to-teal-600 bg-clip-text text-transparent">E-Commerce Business</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Complete platform to manage products, track inventory, process orders, and grow your business. Start selling in minutes with powerful automation.
            </p>

            {/* Key benefits */}
            <div className="space-y-3 mb-10">
              {['Quick 5-minute setup', 'No credit card required', 'Free 14-day trial'].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3 text-gray-700">
                  <HiCheckCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
                  <span className="text-lg">{benefit}</span>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-teal-600 text-white text-lg font-semibold rounded-xl hover:from-red-700 hover:to-teal-700 transition-all duration-200 shadow-xl shadow-red-500/25"
              >
                Get Started Free
                <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/store"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-xl border-2 border-gray-200 hover:border-red-300 hover:text-red-600 transition-all duration-200"
              >
                View Demo Store
              </Link>
            </div>

            {/* Social proof stats */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-8">
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-red-600 to-teal-600 bg-clip-text text-transparent">1000+</div>
                  <div className="text-sm text-gray-600 mt-2">Active Businesses</div>
                </div>
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-red-600 to-teal-600 bg-clip-text text-transparent">50K+</div>
                  <div className="text-sm text-gray-600 mt-2">Products Managed</div>
                </div>
                <div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-red-600 to-teal-600 bg-clip-text text-transparent">₹10Cr+</div>
                  <div className="text-sm text-gray-600 mt-2">Revenue Processed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Dashboard preview */}
          <div className="relative lg:block hidden">
            <div className="relative">
              {/* Floating cards */}
              <div className="absolute -top-10 -left-10 w-64 bg-white rounded-2xl shadow-2xl p-5 border border-gray-200 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                    <HiCheckCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 font-medium">New Order</div>
                    <div className="text-xl font-bold text-gray-900">₹12,450</div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-10 -right-10 w-72 bg-white rounded-2xl shadow-2xl p-5 border border-gray-200 animate-float animation-delay-2000">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500 font-medium">Revenue Growth</span>
                  <span className="text-sm text-red-600 font-bold px-2 py-1 bg-red-50 rounded-lg">+24%</span>
                </div>
                <div className="h-20 flex items-end gap-1.5">
                  {[40, 65, 45, 80, 60, 95, 75].map((height, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-red-600 to-teal-500 rounded-t-lg" style={{ height: `${height}%` }}></div>
                  ))}
                </div>
              </div>

              {/* Main dashboard mockup */}
              <div className="relative bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-br from-red-600 via-teal-600 to-cyan-600 h-36 p-6">
                  <div className="h-3 bg-white/20 rounded w-32 mb-2"></div>
                  <div className="h-2 bg-white/20 rounded w-24"></div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded-lg w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="h-28 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200"></div>
                    <div className="h-28 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200"></div>
                  </div>
                  <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
