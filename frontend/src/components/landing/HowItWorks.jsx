import { HiUserAdd, HiCube, HiShare, HiTrendingUp } from 'react-icons/hi';

const steps = [
  {
    number: '01',
    icon: HiUserAdd,
    title: 'Sign Up',
    description: 'Create your account in seconds. No credit card required to start your free trial.'
  },
  {
    number: '02',
    icon: HiCube,
    title: 'Add Products',
    description: 'Upload your products manually or in bulk via CSV. AI will help generate descriptions.'
  },
  {
    number: '03',
    icon: HiShare,
    title: 'Share Catalogs',
    description: 'Create beautiful catalogs and share via WhatsApp, email, or QR codes instantly.'
  },
  {
    number: '04',
    icon: HiTrendingUp,
    title: 'Grow Business',
    description: 'Accept orders, process payments, track analytics, and scale your business effortlessly.'
  }
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase mb-2">
            How It Works
          </h2>
          <h3 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
            Get started in 4 simple steps
          </h3>
          <p className="max-w-2xl mx-auto text-xl text-gray-600">
            Launch your digital business in minutes, not months. It's that simple.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-200 to-purple-200 z-0"></div>
              )}

              {/* Step card */}
              <div className="relative bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-xl transition-shadow duration-300 z-10">
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="mt-4 mb-6 flex justify-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                    <step.icon className="w-10 h-10 text-blue-600" />
                  </div>
                </div>

                {/* Content */}
                <h4 className="text-xl font-bold text-gray-900 mb-3">
                  {step.title}
                </h4>
                <p className="text-gray-600">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
