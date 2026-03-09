import { Link } from 'react-router-dom';
import { HiCheck } from 'react-icons/hi';

const plans = [
  {
    name: 'Starter',
    price: '0',
    period: 'Forever Free',
    description: 'Perfect for getting started',
    features: [
      'Up to 50 products',
      '5 catalogs',
      'Basic analytics',
      '2 team members',
      'Email support',
    ],
    cta: 'Get Started',
    link: '/register',
    highlighted: false
  },
  {
    name: 'Professional',
    price: '999',
    period: 'per month',
    description: 'Most popular for growing teams',
    features: [
      'Unlimited products',
      'Unlimited catalogs',
      'Advanced analytics',
      '10 team members',
      'Priority support',
      'Custom branding',
      'API access',
    ],
    cta: 'Start 14-Day Trial',
    link: '/register',
    highlighted: true,
    badge: 'POPULAR'
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: 'Tailored to your needs',
    description: 'For large-scale operations',
    features: [
      'Everything in Professional',
      'Unlimited team members',
      'Dedicated account manager',
      'Custom integrations',
      '24/7 phone support',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    link: '/register',
    highlighted: false
  }
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-bold mb-4">
            PRICING
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            Start free, scale as you grow. No hidden fees.
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${
                plan.highlighted
                  ? 'bg-gradient-to-br from-red-600 to-teal-600 text-white shadow-2xl scale-105 border-2 border-red-500'
                  : 'bg-white border-2 border-gray-200 hover:border-red-300 hover:shadow-xl'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-orange-400 text-white px-4 py-1 rounded-full text-xs font-bold shadow-lg">
                  {plan.badge}
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <h3 className={`text-xl font-bold mb-2 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <div className="mb-3">
                  {plan.price !== 'Custom' ? (
                    <>
                      <span className={`text-5xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                        ₹{plan.price}
                      </span>
                      <span className={`text-base ml-2 ${plan.highlighted ? 'text-red-100' : 'text-gray-500'}`}>
                        {plan.period}
                      </span>
                    </>
                  ) : (
                    <span className={`text-4xl font-bold ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                      {plan.price}
                    </span>
                  )}
                </div>
                <p className={`text-sm ${plan.highlighted ? 'text-red-100' : 'text-gray-600'}`}>
                  {plan.description}
                </p>
              </div>

              {/* CTA button */}
              <Link
                to={plan.link}
                className={`block w-full text-center px-6 py-3 rounded-xl font-semibold transition-all duration-200 mb-6 ${
                  plan.highlighted
                    ? 'bg-white text-red-700 hover:bg-gray-50 shadow-lg'
                    : 'bg-gradient-to-r from-red-600 to-teal-600 text-white hover:from-red-700 hover:to-teal-700 shadow-lg shadow-red-500/25'
                }`}
              >
                {plan.cta}
              </Link>

              {/* Features list */}
              <ul className="space-y-3">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <HiCheck className={`w-5 h-5 flex-shrink-0 ${plan.highlighted ? 'text-red-200' : 'text-red-500'}`} />
                    <span className={`text-sm ${plan.highlighted ? 'text-white' : 'text-gray-700'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-2">All plans include 14-day free trial</p>
          <p className="text-sm text-gray-500">No credit card required • Cancel anytime</p>
        </div>
      </div>
    </section>
  );
}
