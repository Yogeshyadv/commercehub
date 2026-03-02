import { HiOfficeBuilding, HiShoppingCart, HiTrendingUp, HiUsers } from 'react-icons/hi';

export default function TrustedBy() {
  const stats = [
    { icon: HiOfficeBuilding, value: '1000+', label: 'Businesses Trust Us' },
    { icon: HiShoppingCart, value: '50K+', label: 'Products Managed' },
    { icon: HiTrendingUp, value: '₹10Cr+', label: 'Revenue Processed' },
    { icon: HiUsers, value: '100K+', label: 'Active Users' },
  ];

  return (
    <section className="py-16 bg-white border-y border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-gray-600 text-lg font-medium">
            Powering businesses across India
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-xl mb-3">
                <stat.icon className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Industry badges */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {['Fashion', 'Electronics', 'FMCG', 'Pharma', 'Automotive', 'Textiles'].map((industry, i) => (
            <div key={i} className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-full text-gray-600 text-sm font-medium">
              {industry}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
