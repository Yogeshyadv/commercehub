import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckIcon, XIcon, ArrowRightIcon, ZapIcon, TrendingUpIcon,
  ShieldCheckIcon, CodeIcon, DollarSignIcon, StarIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

/* ─────────────────────────────────────────
   ASSETS
───────────────────────────────────────── */
const CDN = 'https://cdn.shopify.com/b/shopify-brochure2-assets';
const CF  = 'https://dwtqm09zovi8z.cloudfront.net/assets';

const brandLogos = [
  { name: 'Dollar Shave Club', src: `${CDN}/051a3bf5099b5d86263c261e91ab4a7f.svg` },
  { name: 'Everlane',          src: `${CDN}/1833f9c87c49fb37614863bc02b5089e.svg` },
  { name: 'Glossier',          src: `${CDN}/3c798485a9fe643bbe7e8cbfb3605190.svg` },
  { name: 'Mattel',            src: `${CDN}/4a4a4459ee243adbcc34035a5ceccd43.svg` },
  { name: 'Staples',           src: `${CDN}/8cbd746b0831274d5ef0b082fc99b886.svg` },
  { name: 'JB Hi-Fi',          src: `${CDN}/da2fc343d9a4c64f3a692188ba1bd630.svg` },
  { name: 'Quicksilver',       src: `${CDN}/e3843bc2fce12ce17d52f8fc35aba620.svg` },
];

/* ─────────────────────────────────────────
   COMPARISON TABLE DATA
───────────────────────────────────────── */
const competitors = ['CommerceHub', 'WooCommerce', 'BigCommerce', 'Magento', 'Wix'];

// val: true = green check, false = red x, string = shown as text
const categories = [
  {
    label: 'Setup & Ease of Use',
    rows: [
      { feature: 'No coding required to launch',         vals: [true,  false, true,  false, true]  },
      { feature: 'Setup time to first sale',             vals: ['Minutes', 'Days', 'Hours', 'Weeks', 'Hours'] },
      { feature: 'Drag-and-drop store builder',          vals: [true,  false, true,  false, true]  },
      { feature: 'Free themes included',                 vals: [true,  true,  true,  false, true]  },
    ],
  },
  {
    label: 'Selling & Commerce',
    rows: [
      { feature: 'Sell on social media natively',        vals: [true,  false, true,  false, false] },
      { feature: 'Built-in abandoned cart recovery',     vals: [true,  false, true,  false, false] },
      { feature: 'Multi-currency checkout',              vals: [true,  false, true,  true,  false] },
      { feature: 'Unlimited products on all plans',      vals: [true,  true,  true,  true,  false] },
      { feature: 'Native POS system',                    vals: [true,  false, false, false, false] },
      { feature: 'B2B / wholesale tools built-in',       vals: [true,  false, true,  true,  false] },
    ],
  },
  {
    label: 'Performance & Reliability',
    rows: [
      { feature: '99.9%+ uptime SLA',                   vals: [true,  false, true,  false, true]  },
      { feature: 'Global CDN included',                  vals: [true,  false, true,  false, false] },
      { feature: 'Sub-50ms checkout response',           vals: [true,  false, false, false, false] },
      { feature: 'Handles flash sales / traffic spikes', vals: [true,  false, true,  false, false] },
    ],
  },
  {
    label: 'Payments & Fees',
    rows: [
      { feature: 'Built-in payment processor',          vals: [true,  false, false, false, true]  },
      { feature: 'No transaction fees on native pay',   vals: [true,  false, true,  false, true]  },
      { feature: '3rd-party gateway support',           vals: [true,  true,  true,  true,  true]  },
      { feature: 'Buy Now Pay Later built-in',          vals: [true,  false, true,  false, false] },
    ],
  },
  {
    label: 'Marketing & Growth',
    rows: [
      { feature: 'Built-in email marketing',            vals: [true,  false, false, false, true]  },
      { feature: 'SEO tools included',                  vals: [true,  true,  true,  true,  true]  },
      { feature: 'Native discount & promo engine',      vals: [true,  true,  true,  true,  true]  },
      { feature: 'App marketplace (1,000+ apps)',       vals: [true,  true,  true,  true,  false] },
    ],
  },
  {
    label: 'Support',
    rows: [
      { feature: '24/7 live chat & email support',      vals: [true,  false, true,  false, true]  },
      { feature: 'Phone support available',             vals: [true,  false, true,  false, false] },
      { feature: 'Dedicated success manager (Plus)',    vals: [true,  false, true,  false, false] },
      { feature: 'Comprehensive documentation',         vals: [true,  true,  true,  true,  true]  },
    ],
  },
];

/* ─────────────────────────────────────────
   WHY SWITCH REASONS
───────────────────────────────────────── */
const reasons = [
  {
    icon: <ZapIcon className="w-7 h-7" />,
    heading: 'Launch in minutes, not months',
    desc: 'CommerceHub removes every technical barrier. Pick a theme, add products, connect payments — you\'re live. No plugins, no patching, no DevOps.',
    img: `${CDN}/ebc54e1da391c75a5a98649fa293484a.webp`,
  },
  {
    icon: <TrendingUpIcon className="w-7 h-7" />,
    heading: '36% better checkout conversion',
    desc: 'Our checkout outperforms every major competitor — backed by real conversion data across millions of transactions. Every basis point matters at scale.',
    img: `${CDN}/4dd1cce5beb0f5dbb46115e31e300f80.webp`,
  },
  {
    icon: <DollarSignIcon className="w-7 h-7" />,
    heading: '33% lower total cost of ownership',
    desc: 'When you factor in plugins, hosting, security patches, and developer time — CommerceHub costs less. Invest those savings back into growth.',
    img: `${CF}/catalogue_e_commerce.webp`,
  },
  {
    icon: <ShieldCheckIcon className="w-7 h-7" />,
    heading: '99.99% uptime, 50ms everywhere',
    desc: 'Built on global infrastructure with 300 PoPs worldwide. Your store never sleeps — even during Black Friday, flash sales, or viral moments.',
    img: `${CF}/boost_personal_commerce_3.webp`,
  },
];

/* ─────────────────────────────────────────
   SWITCHER STORIES
───────────────────────────────────────── */
const stories = [
  {
    brand: 'Gymshark',
    logo: `${CDN}/051a3bf5099b5d86263c261e91ab4a7f.svg`,
    from: 'Magento',
    quote: 'Moving from Magento to CommerceHub was the best decision we made. Our site speed improved by 60% and we stopped spending money on infrastructure maintenance.',
    name: 'Ben Francis',
    title: 'Founder & CEO',
    img: `${CDN}/c65bc0c2daf1df2c109d1f9c14444a57.webp`,
    stats: [ { val: '60%', label: 'faster page loads' }, { val: '4×', label: 'team productivity' }, { val: '3 months', label: 'migration timeline' } ],
  },
  {
    brand: 'Allbirds',
    logo: `${CDN}/1833f9c87c49fb37614863bc02b5089e.svg`,
    from: 'WooCommerce',
    quote: 'WooCommerce worked when we were small, but the plugin management and hosting overhead was holding us back. CommerceHub lets us focus on products, not servers.',
    name: 'Tim Brown',
    title: 'Co-Founder',
    img: `${CDN}/f11495397635517ec5ee47c2b360dd04.webp`,
    stats: [ { val: '2×', label: 'conversion rate' }, { val: '0 plugins', label: 'to manage' }, { val: '99.99%', label: 'uptime' } ],
  },
];

/* ─────────────────────────────────────────
   FAQ
───────────────────────────────────────── */
const faqs = [
  {
    q: 'How long does migration take from another platform?',
    a: 'Most merchants complete migration in 2–8 weeks. CommerceHub provides free migration tools, partner support, and dedicated migration experts to move your products, customers, and order history seamlessly.',
  },
  {
    q: 'Will I lose my SEO rankings when switching?',
    a: 'No. CommerceHub\'s migration tools preserve your URL structure and automatically set up 301 redirects for any changed URLs, protecting your search rankings.',
  },
  {
    q: 'What happens to my existing data?',
    a: 'All your product data, customer records, and order history can be imported. We support CSV import and have dedicated importers for all major platforms.',
  },
  {
    q: 'Is CommerceHub suitable for large enterprises?',
    a: 'Yes. CommerceHub Plus powering brands like Glossier, Mattel, and Staples. It\'s built to handle millions of orders, complex B2B workflows, and global multi-storefront operations.',
  },
  {
    q: 'What are the real transaction costs vs. competitors?',
    a: 'When using CommerceHub Payments, there are zero additional transaction fees. Third-party gateway fees range from 0.2%–2% depending on plan. Competitors often charge the same rates plus platform surcharges.',
  },
];

/* ═══════════════════════════════════════
   COMPONENT
═══════════════════════════════════════ */
export default function ComparePage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <Navbar />

      {/* ────────────────────────────────────
          HERO
      ──────────────────────────────────── */}
      <section className="relative overflow-hidden bg-black pt-32 pb-24 text-center">
        {/* red ambient glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 55% at 50% -10%, rgba(220,38,38,0.28) 0%, transparent 70%)',
          }}
        />

        <div className="relative max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#DC2626] mb-6 px-3 py-1.5 rounded-full border border-[#DC2626]/30 bg-[#DC2626]/10">
              Platform Comparison
            </span>
            <h1 className="text-5xl sm:text-7xl font-black leading-[0.95] tracking-tight mb-6">
              Why merchants choose
              <br />
              <span className="text-[#DC2626]">CommerceHub</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
              See how CommerceHub stacks up against WooCommerce, BigCommerce, Magento, and Wix — across
              ease of use, performance, cost, and long-term growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center gap-2 bg-[#DC2626] hover:bg-[#b91c1c] text-white font-bold text-base px-8 py-4 rounded-full transition-all duration-200 shadow-lg shadow-red-900/30"
              >
                Start free trial
                <ArrowRightIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/pricing')}
                className="inline-flex items-center gap-2 border border-white/15 hover:border-white/40 text-white font-semibold text-base px-8 py-4 rounded-full transition-all duration-200"
              >
                View pricing
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ────────────────────────────────────
          BRAND LOGOS
      ──────────────────────────────────── */}
      <section className="border-y border-white/[0.06] py-10 bg-[#080808]">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-xs font-bold uppercase tracking-[0.18em] text-gray-600 mb-8">
            Trusted by the world's largest brands
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10">
            {brandLogos.map(({ name, src }) => (
              <img
                key={name}
                src={src}
                alt={name}
                className="h-7 opacity-40 brightness-0 invert hover:opacity-80 transition-opacity duration-300"
              />
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────
          KEY STATS BANNER
      ──────────────────────────────────── */}
      <section className="py-16 bg-black">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { val: '36%',   label: 'better checkout conversion vs. competitors' },
            { val: '33%',   label: 'lower total cost of ownership on average' },
            { val: '50ms',  label: 'checkout response time worldwide' },
            { val: '4,000+', label: 'apps & integrations in our marketplace' },
          ].map(({ val, label }) => (
            <motion.div
              key={val}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <p className="text-4xl sm:text-5xl font-black text-[#DC2626] leading-none mb-2">{val}</p>
              <p className="text-sm text-gray-500 leading-snug">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ────────────────────────────────────
          COMPARISON TABLE
      ──────────────────────────────────── */}
      <section className="py-20 bg-[#060606]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
              Feature-by-feature comparison
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              Every feature that matters — measured honestly.
            </p>
          </div>

          {/* Category pill tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map((cat, i) => (
              <button
                key={cat.label}
                onClick={() => setActiveCategory(i)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 border ${
                  activeCategory === i
                    ? 'bg-[#DC2626] border-[#DC2626] text-white'
                    : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-[#0a0a0a]">
                  <th className="text-left px-6 py-5 text-gray-500 font-semibold w-64">Feature</th>
                  {competitors.map((comp, i) => (
                    <th key={comp} className={`px-4 py-5 text-center font-black text-xs uppercase tracking-wide ${
                      i === 0 ? 'text-[#DC2626]' : 'text-gray-500'
                    }`}>
                      {comp}
                      {i === 0 && (
                        <span className="block text-[10px] font-medium text-[#DC2626]/60 normal-case tracking-normal mt-0.5">
                          Our platform
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories[activeCategory].rows.map((row, ri) => (
                  <tr
                    key={row.feature}
                    className={`border-b border-white/[0.04] transition-colors ${
                      ri % 2 === 0 ? 'bg-[#060606]' : 'bg-[#080808]'
                    } hover:bg-white/[0.02]`}
                  >
                    <td className="px-6 py-4 text-gray-300 font-medium">{row.feature}</td>
                    {row.vals.map((val, vi) => (
                      <td key={vi} className="px-4 py-4 text-center">
                        {val === true ? (
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${
                            vi === 0 ? 'bg-[#DC2626]/15 text-[#DC2626]' : 'bg-green-900/20 text-green-400'
                          }`}>
                            <CheckIcon className="w-4 h-4" strokeWidth={2.5} />
                          </span>
                        ) : val === false ? (
                          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/[0.04] text-gray-600">
                            <XIcon className="w-4 h-4" strokeWidth={2} />
                          </span>
                        ) : (
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            vi === 0
                              ? 'bg-[#DC2626]/15 text-[#DC2626]'
                              : 'bg-white/[0.06] text-gray-400'
                          }`}>
                            {val}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-center text-xs text-gray-700 mt-4">
            Data based on publicly available information and independent research. Updated March 2026.
          </p>
        </div>
      </section>

      {/* ────────────────────────────────────
          WHY SWITCH — 4 REASONS
      ──────────────────────────────────── */}
      <section className="py-24 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
              The reason 4.4 million merchants
              <br />
              <span className="text-[#DC2626]">chose us</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">
              It's not just features. It's the sum of a thousand small decisions made in your favour.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {reasons.map((r, i) => (
              <motion.div
                key={r.heading}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group relative bg-[#0a0a0a] border border-white/[0.06] rounded-3xl overflow-hidden hover:border-white/[0.12] transition-all duration-300"
              >
                <div className="aspect-[16/7] overflow-hidden">
                  <img
                    src={r.img}
                    alt={r.heading}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]" />
                </div>
                <div className="p-8 relative">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#DC2626]/10 text-[#DC2626] mb-5">
                    {r.icon}
                  </span>
                  <h3 className="text-xl font-black text-white mb-3">{r.heading}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm">{r.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────
          SWITCHER STORIES
      ──────────────────────────────────── */}
      <section className="py-24 bg-[#060606]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black mb-4">
              What merchants say after switching
            </h2>
            <p className="text-gray-500 text-lg">Real stories from real migrations.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {stories.map((s) => (
              <motion.div
                key={s.brand}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-[#0a0a0a] border border-white/[0.06] rounded-3xl overflow-hidden"
              >
                {/* top image */}
                <div className="h-48 overflow-hidden relative">
                  <img src={s.img} alt={s.brand} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-[#0a0a0a]" />
                  <span className="absolute top-4 left-5 text-xs font-bold uppercase tracking-[0.14em] text-gray-400 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                    Switched from {s.from}
                  </span>
                </div>

                <div className="p-8">
                  {/* stars */}
                  <div className="flex gap-0.5 mb-5">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 fill-[#DC2626] text-[#DC2626]" />
                    ))}
                  </div>

                  <blockquote className="text-gray-300 leading-relaxed text-base italic mb-6">
                    "{s.quote}"
                  </blockquote>

                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-full bg-[#DC2626]/20 flex items-center justify-center text-[#DC2626] font-black text-sm">
                      {s.name[0]}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{s.name}</p>
                      <p className="text-gray-600 text-xs">{s.title}, {s.brand}</p>
                    </div>
                  </div>

                  {/* mini stats */}
                  <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/[0.06]">
                    {s.stats.map(({ val, label }) => (
                      <div key={label} className="text-center">
                        <p className="text-xl font-black text-[#DC2626]">{val}</p>
                        <p className="text-xs text-gray-600 mt-0.5 leading-snug">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────
          MIGRATION CTA STRIP
      ──────────────────────────────────── */}
      <section className="py-16 bg-[#DC2626]/5 border-y border-[#DC2626]/10">
        <div className="max-w-4xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
              Ready to make the switch?
            </h3>
            <p className="text-gray-500 text-sm">
              Free migration assistance · No downtime · Keep your SEO rankings
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <button
              onClick={() => navigate('/register')}
              className="inline-flex items-center gap-2 bg-[#DC2626] hover:bg-[#b91c1c] text-white font-bold px-7 py-3.5 rounded-full transition-all duration-200 text-sm"
            >
              Start free trial
              <ArrowRightIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/enterprise')}
              className="inline-flex items-center border border-white/15 hover:border-white/30 text-white font-semibold px-7 py-3.5 rounded-full transition-all duration-200 text-sm"
            >
              Talk to sales
            </button>
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────
          FAQ
      ──────────────────────────────────── */}
      <section className="py-24 bg-black">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black mb-3">Common migration questions</h2>
            <p className="text-gray-500">Everything you need to know before switching.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl overflow-hidden"
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                >
                  <span className="font-semibold text-white text-sm pr-6">{faq.q}</span>
                  <span className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-200 ${
                    openFaq === i ? 'border-[#DC2626] text-[#DC2626]' : 'border-white/20 text-gray-500'
                  }`}>
                    <span className="text-lg leading-none font-light">{openFaq === i ? '−' : '+'}</span>
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/[0.06]">
                    <p className="pt-4">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────
          FINAL CTA
      ──────────────────────────────────── */}
      <section className="relative py-32 bg-[#060606] overflow-hidden text-center">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(220,38,38,0.22) 0%, transparent 70%)',
          }}
        />
        <div className="relative max-w-3xl mx-auto px-6">
          <h2 className="text-5xl sm:text-6xl font-black leading-tight mb-6">
            The best time to switch
            <br />
            <span className="text-[#DC2626]">is right now.</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed">
            Join 4.4 million merchants who chose CommerceHub. Start free — no credit card needed.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-black font-black text-lg px-10 py-4 rounded-full transition-all duration-200 shadow-xl shadow-white/5"
          >
            Start for free
            <ArrowRightIcon className="w-5 h-5" />
          </button>
          <p className="text-gray-700 text-sm mt-4">No credit card required · Free migration support</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
