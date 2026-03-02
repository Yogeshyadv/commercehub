import { Link } from 'react-router-dom';
import { HiArrowRight, HiCheckCircle } from 'react-icons/hi';

export default function CTA() {
  return (
    <section className="py-24 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Ready to grow your business?
        </h2>
        <p className="text-xl text-emerald-100 mb-10 max-w-2xl mx-auto">
          Join 1000+ businesses using our platform to manage and grow their operations.
        </p>

        {/* CTA button */}
        <Link
          to="/register"
          className="inline-flex items-center gap-2 px-10 py-5 bg-white text-emerald-700 text-lg font-bold rounded-xl hover:bg-gray-50 transition-all duration-200 shadow-2xl group hover:scale-105"
        >
          Get Started Free
          <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>

        {/* Trust indicators */}
        <div className="mt-8 flex flex-wrap justify-center items-center gap-6 text-emerald-100 text-sm">
          <div className="flex items-center gap-2">
            <HiCheckCircle className="w-5 h-5" />
            <span>Free 14-day trial</span>
          </div>
          <div className="flex items-center gap-2">
            <HiCheckCircle className="w-5 h-5" />
            <span>No credit card</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
