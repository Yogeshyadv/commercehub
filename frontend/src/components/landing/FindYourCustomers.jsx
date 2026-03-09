import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    tag: 'Email & SMS',
    heading: 'Turn browsers into buyers',
    desc: "Recover lost sales with automated abandoned cart emails and targeted SMS campaigns. Reach customers at the right moment with personalised messages that convert.",
    bullets: [
      'Abandoned cart recovery',
      'Automated email sequences',
      'SMS & WhatsApp campaigns',
      'Customer segmentation',
    ],
    img: 'https://cdn.shopify.com/b/shopify-brochure2-assets/e1010611f256636f75afa0685076a18a.png',
    imgAlt: 'Abandoned cart email automation',
    imgRight: true,
  },
  {
    tag: 'Loyalty & Discounts',
    heading: 'Keep them coming back',
    desc: "Build lasting customer relationships with loyalty programmes, personalised discounts, and B2B pricing tiers. Make every customer feel like a VIP.",
    bullets: [
      'Custom discount codes',
      'B2B tiered pricing',
      'Loyalty rewards system',
      'Referral programmes',
    ],
    img: 'https://cdn.shopify.com/b/shopify-brochure2-assets/ed5d6ca764ace99791108a304dd99049.png',
    imgAlt: 'B2B discount management',
    imgRight: false,
  },
];

export function FindYourCustomers() {
  const navigate = useNavigate();

  return (
    <section className="bg-white py-28">
      <div className="max-w-7xl mx-auto px-6">

        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.05]">
            Find your forever<br className="hidden md:block" /> customers
          </h2>
          <p className="mt-5 text-gray-500 text-lg font-medium max-w-xl mx-auto">
            Build meaningful relationships that drive repeat purchases and lasting loyalty.
          </p>
        </motion.div>

        {/* Feature rows */}
        <div className="space-y-28">
          {features.map((feature, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={`flex flex-col ${feature.imgRight ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-20 items-center`}
            >
              {/* Text */}
              <div className="flex-1 space-y-6">
                <span className="inline-block px-3 py-1 rounded-full bg-[#DC2626]/10 text-[#DC2626] text-xs font-bold uppercase tracking-widest">
                  {feature.tag}
                </span>
                <h3 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
                  {feature.heading}
                </h3>
                <p className="text-lg text-gray-600 font-medium leading-relaxed">
                  {feature.desc}
                </p>
                <ul className="space-y-3 pt-2">
                  {feature.bullets.map((b, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#DC2626] flex items-center justify-center shrink-0">
                        <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      <span className="text-gray-800 font-semibold text-sm">{b}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => navigate('/register')}
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#DC2626] hover:text-[#B91C1C] transition-colors group"
                >
                  Learn more
                  <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Image */}
              <div className="flex-1 w-full">
                <div className="relative bg-[#f8f8f8] rounded-3xl overflow-hidden shadow-xl p-2">
                  <img
                    src={feature.img}
                    alt={feature.imgAlt}
                    loading="lazy"
                    className="w-full rounded-2xl object-cover"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
