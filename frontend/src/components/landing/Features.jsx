import {
  HiShoppingBag,
  HiChartBar,
  HiLightningBolt,
  HiCube,
  HiUserGroup,
  HiShieldCheck,
} from 'react-icons/hi';

const features = [
  {
    icon: HiShoppingBag,
    title: 'Product Management',
    description: 'Manage unlimited products with images, variants, and specifications. Bulk upload via CSV.',
    color: 'blue'
  },
  {
    icon: HiCube,
    title: 'Inventory Tracking',
    description: 'Real-time stock updates, low-stock alerts, and multi-warehouse management.',
    color: 'green'
  },
  {
    icon: HiChartBar,
    title: 'Advanced Analytics',
    description: 'Track sales, revenue, top products, and customer behavior with powerful dashboards.',
    color: 'purple'
  },
  {
    icon: HiLightningBolt,
    title: 'Fast Order Processing',
    description: 'Quick checkout, payment tracking, and automated order fulfillment workflows.',
    color: 'yellow'
  },
  {
    icon: HiUserGroup,
    title: 'Customer Portal',
    description: 'Let customers browse products, place orders, and track shipments in real-time.',
    color: 'pink'
  },
  {
    icon: HiShieldCheck,
    title: 'Secure & Reliable',
    description: 'Bank-grade security, automated backups, and 99.9% uptime guarantee.',
    color: 'indigo'
  },
];

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600',
  green: 'bg-red-50 text-red-600',
  purple: 'bg-purple-50 text-purple-600',
  yellow: 'bg-orange-50 text-orange-600',
  pink: 'bg-rose-50 text-rose-600',
  indigo: 'bg-teal-50 text-teal-600',
};

export default function Features() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 bg-red-100 text-red-700 rounded-full text-sm font-bold mb-4">
            POWERFUL FEATURES
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Everything you need to scale
          </h2>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            Built for modern B2B businesses. Simple to start, powerful to grow.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-red-300 hover:shadow-xl transition-all duration-300"
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-14 h-14 ${colorClasses[feature.color]} rounded-xl mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-7 h-7" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA below features */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-4 text-lg">Ready to transform your business?</p>
          <a
            href="#pricing"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-red-600 to-teal-600 text-white font-semibold rounded-xl hover:from-red-700 hover:to-teal-700 transition-all duration-200 shadow-xl shadow-red-500/25"
          >
            View Pricing Plans
          </a>
        </div>
      </div>
    </section>
  );
}
