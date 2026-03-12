import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightIcon, CheckIcon, ZapIcon, TrendingUpIcon, ShieldCheckIcon, CodeIcon, DollarSignIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

/* ─────────────────────────────────────────
   ASSETS
───────────────────────────────────────── */

const CDN = 'https://cdn.shopify.com/b/shopify-brochure2-assets';
const CLFT = 'https://dwtqm09zovi8z.cloudfront.net/assets';

// Rotating hero background store screenshots
const storeImgs = [
  `${CDN}/c65bc0c2daf1df2c109d1f9c14444a57.webp`,
  `${CDN}/f11495397635517ec5ee47c2b360dd04.webp`,
  `${CDN}/d1d0f12159bedd0521717f23600c1beb.webp`,
  `${CDN}/afdceeca27acf0af45372d782b36a153.webp`,
  `${CDN}/268717f14ffc87467a9aeb1e6f5a7719.webp`,
  `${CDN}/92b0585e60e00efb6ceaf2aec6a66027.webp`,
];

// Tabbed advantages data with screenshots
const advantageTabs = [
  {
    id: 'innovation',
    icon: <ZapIcon className="w-5 h-5" />,
    heading: 'Accelerate innovation',
    desc: "Innovate and launch at lightning speed on the only platform that's consistently first-to-market with new capabilities. Hundreds of platform updates every year.",
    img: `${CLFT}/catalogue_e_commerce.webp`,
  },
  {
    id: 'revenue',
    icon: <TrendingUpIcon className="w-5 h-5" />,
    heading: 'Increase revenue',
    desc: 'Increase top-line revenue with the best-converting checkout on the planet. Reach more customers on more channels without changing your stack.',
    img: `${CLFT}/whatsapp_ordering.webp`,
  },
  {
    id: 'performance',
    icon: <ShieldCheckIcon className="w-5 h-5" />,
    heading: 'Optimise performance',
    desc: 'Handle the highest volumes possible. Always stay connected with 99.9% uptime and <50ms response time across 300 global points of presence.',
    img: `${CLFT}/boost_personal_commerce_3.webp`,
  },
  {
    id: 'flexibility',
    icon: <CodeIcon className="w-5 h-5" />,
    heading: 'Build with flexibility',
    desc: 'Evolve your commerce architecture your way — full-stack, headless, or composable. Robust APIs, CLI tools, and world-class developer documentation.',
    img: `${CLFT}/boost_personal_commerce_1.webp`,
  },
  {
    id: 'cost',
    icon: <DollarSignIcon className="w-5 h-5" />,
    heading: 'Lower cost of ownership',
    desc: "CommerceHub's TCO is on average 33% better than competitors'. Invest in growth, not infrastructure — the most cost-effective enterprise platform available.",
    img: `${CLFT}/boost_personal_commerce_3.webp`,
  },
];

const brandLogos = [
  { name: 'Dollar Shave Club', src: 'https://cdn.shopify.com/b/shopify-brochure2-assets/051a3bf5099b5d86263c261e91ab4a7f.svg' },
  { name: 'Everlane',          src: 'https://cdn.shopify.com/b/shopify-brochure2-assets/1833f9c87c49fb37614863bc02b5089e.svg' },
  { name: 'Glossier',          src: 'https://cdn.shopify.com/b/shopify-brochure2-assets/3c798485a9fe643bbe7e8cbfb3605190.svg' },
  { name: 'Mattel',            src: 'https://cdn.shopify.com/b/shopify-brochure2-assets/4a4a4459ee243adbcc34035a5ceccd43.svg' },
  { name: 'Staples',           src: 'https://cdn.shopify.com/b/shopify-brochure2-assets/8cbd746b0831274d5ef0b082fc99b886.svg' },
  { name: 'JB Hi-Fi',          src: 'https://cdn.shopify.com/b/shopify-brochure2-assets/da2fc343d9a4c64f3a692188ba1bd630.svg' },
  { name: 'Quicksilver',       src: 'https://cdn.shopify.com/b/shopify-brochure2-assets/e3843bc2fce12ce17d52f8fc35aba620.svg' },
];

const recognitions = [
  {
    tag: 'PARTNERSHIPS',
    heading: 'Oracle & CommerceHub launch new partnership',
    desc: "New partnership pairs Oracle's market-leading finance and supply chain applications with CommerceHub's powerful unified commerce platform.",
    cta: 'Read the announcement',
  },
  {
    tag: 'IDC RECOGNITION',
    heading: 'Named Leader in IDC B2C Commerce Platforms, 2024',
    desc: "CommerceHub was recognised as a leader in IDC's evaluation of commerce solutions for retailers from $100 million and beyond.",
    cta: 'Read the report',
  },
  {
    tag: 'ANALYST RECOGNITION',
    heading: 'Named a Leader in the 2025 Gartner® Magic Quadrant™',
    desc: 'CommerceHub named a Leader for Digital Commerce for the 3rd consecutive year and positioned highest for Ability to Execute.',
    cta: 'Read the report',
  },
];

const solutions = [
  {
    label: 'B2C',
    heading: 'Direct-to-consumer at scale',
    desc: 'Launch, iterate, and grow your direct consumer business with the platform purpose-built for conversion.',
  },
  {
    label: 'B2B',
    heading: 'Wholesale & business selling',
    desc: 'Manage complex wholesale relationships, custom pricing, and buyer portals — all from one platform.',
  },
  {
    label: 'Retail',
    heading: 'Unified commerce, in-store & online',
    desc: 'Bridge your physical and digital channels with real-time synced inventory, orders, and customer data.',
  },
];

const advantages = [
  {
    icon: <ZapIcon className="w-6 h-6" />,
    heading: 'Accelerate innovation',
    desc: "Innovate and launch at lightning speed on the only platform that's consistently first-to-market with new capabilities.",
  },
  {
    icon: <TrendingUpIcon className="w-6 h-6" />,
    heading: 'Increase revenue',
    desc: 'Increase top-line revenue with the best-converting checkout on the planet and reach more customers on more channels.',
  },
  {
    icon: <ShieldCheckIcon className="w-6 h-6" />,
    heading: 'Optimise performance',
    desc: 'Handle the highest volumes possible and always stay connected with 99.9% uptime and <50ms response time.',
  },
  {
    icon: <CodeIcon className="w-6 h-6" />,
    heading: 'Build with flexibility',
    desc: 'Evolve your commerce architecture and transform customer experiences with a flexible commerce operating system.',
  },
  {
    icon: <DollarSignIcon className="w-6 h-6" />,
    heading: 'Lower cost of ownership',
    desc: "CommerceHub's TCO is on average 33% better than competitors', making it the industry's most cost-effective platform.",
  },
];

const stats = [
  { value: '₹8.5T+', label: 'in global commerce GMV since inception' },
  { value: 'Millions', label: 'of businesses in 175+ countries rely on CommerceHub' },
  { value: '99.9%', label: 'uptime SLA with <50ms global response time' },
];

const whyUs = [
  {
    heading: 'Lightning-fast innovation',
    desc: 'Innovate faster with hundreds of platform updates every year. Stay ahead of customer expectations without the overhead.',
  },
  {
    heading: 'Enterprise scale',
    desc: 'Always perform on the platform that powers billions of transactions. Burst capacity, global CDN, zero-downtime deploys.',
  },
  {
    heading: 'Unparalleled efficiency',
    desc: 'Streamline collaboration with an intuitive admin that empowers both your commerce and development teams.',
  },
];

const checkoutStats = [
  { value: '₹1.1T+', label: 'in global commerce since inception' },
  { value: '875M+', label: 'unique online shoppers from Shopify merchants in 2024' },
  { value: '12%+', label: 'of all US ecommerce powered by our platform' },
];

const partnerLogos = [
  { name: 'Deloitte',        src: `${CDN}/a551a050d894829dd43386853d572d62.svg` },
  { name: 'IBM',             src: `${CDN}/91ed1346a3f20ddd61ce72d15e8aecb4.svg` },
  { name: 'Domaine',         src: `${CDN}/e37d470cc4984075efc1fb2bfac1ba83.svg` },
  { name: 'KPMG',            src: `${CDN}/d8c03117248fb89a56219136b341772e.svg` },
  { name: 'VML',             src: `${CDN}/d104a81256b3dbe74bd4f5d5981f1cc2.svg` },
  { name: 'WPP',             src: `${CDN}/0459c07be623435135ee6b2601b835d2.svg` },
  { name: 'We Make Websites',src: `${CDN}/5d84112f88e82fe802f0757fadc2512f.svg` },
  { name: 'Accenture',       src: `${CDN}/edf5595fa59a8a915a48ff5aa52a29d1.svg` },
  { name: 'EY',              src: `${CDN}/819ac927dec0ff0c8248f02d5cfe7765.svg` },
  { name: 'Anatta',          src: `${CDN}/33b506521b1bf0d476d6a39a4309890d.svg` },
  { name: 'Cognizant',       src: `${CDN}/77c557400f1f0c0b8ce77f2605159544.svg` },
  { name: 'CQL',             src: `${CDN}/66b614e440990995f88fca75b36ba67d.svg` },
];

/* ─────────────────────────────────────────
   CONTACT MODAL
───────────────────────────────────────── */
function ContactModal({ onClose }) {
  const [form, setForm] = useState({ name: '', company: '', email: '', message: '' });
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));
  const inputCls = 'w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-black placeholder-gray-400 focus:outline-none focus:border-red-500 transition-all text-sm font-medium';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25 }}
        className="bg-[#111] border border-white/[0.08] rounded-3xl p-8 w-full max-w-lg shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-white font-black text-2xl mb-2">Get in touch</h3>
        <p className="text-gray-400 text-sm font-medium mb-7">Our enterprise team will reach out within 1 business day.</p>
        <div className="space-y-3">
          <input placeholder="Full name" value={form.name} onChange={set('name')} className={inputCls} />
          <input placeholder="Company name" value={form.company} onChange={set('company')} className={inputCls} />
          <input type="email" placeholder="Work email" value={form.email} onChange={set('email')} className={inputCls} />
          <textarea placeholder="Tell us about your business goals..." value={form.message} onChange={set('message')} rows={4} className={`${inputCls} resize-none`} />
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-xl border border-white/[0.1] text-gray-400 font-bold text-sm hover:border-white/30 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-xl bg-[#DC2626] text-white font-bold text-sm hover:bg-[#B91C1C] active:scale-95 transition-all"
          >
            Submit
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function EnterprisePage() {
  const navigate = useNavigate();
  const [showContact, setShowContact] = useState(false);
  const [activeTab, setActiveTab] = useState('innovation');
  const [heroImgIdx, setHeroImgIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setHeroImgIdx(i => (i + 1) % storeImgs.length), 4200);
    return () => clearInterval(t);
  }, []);

  const currentTab = advantageTabs.find(t => t.id === activeTab);

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <AnimatePresence>{showContact && <ContactModal onClose={() => setShowContact(false)} />}</AnimatePresence>

      {/* ══ 1. HERO — cinematic full-screen with rotating store screenshots ══ */}
      <section className="relative min-h-screen flex flex-col justify-center bg-gray-50 text-black overflow-hidden">

        {/* Rotating store screenshot background */}
        <AnimatePresence mode="wait">
          <motion.div
            key={heroImgIdx}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4 }}
            className="absolute inset-0 z-0"
          >
            <img src={storeImgs[heroImgIdx]} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gray-900/40" />
          </motion.div>
        </AnimatePresence>

        {/* Red glow */}
        <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#DC2626]/14 rounded-full blur-[140px] z-0" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 pt-40 pb-32">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
            <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-[#DC2626] mb-8">
              <span className="w-6 h-[2px] bg-[#DC2626] shrink-0" />
              CommerceHub for Enterprise
            </span>
            <h1 className="text-[clamp(3rem,8vw,6.5rem)] font-black leading-[0.93] tracking-[-0.02em] text-white mb-8 max-w-5xl">
              Unlock unprecedented<br />growth at scale
            </h1>
            <p className="text-gray-300 text-xl font-medium max-w-2xl mb-12 leading-relaxed">
              The platform that keeps enterprises ahead — built for performance, flexibility, and revenue growth without limits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowContact(true)}
                className="px-9 py-4 bg-white text-black font-black rounded-2xl hover:bg-gray-100 active:scale-[0.98] transition-all text-sm tracking-wide"
              >
                Get in touch
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-9 py-4 bg-[#DC2626] text-white font-black rounded-2xl hover:bg-[#B91C1C] active:scale-[0.98] transition-all text-sm tracking-wide flex items-center gap-2 group"
              >
                Try for free <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          {/* Brand logos — brighter, left-aligned */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.9 }}
            className="mt-24 border-t border-white/[0.1] pt-10"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-8">
              Trusted by the world's largest brands
            </p>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
              {brandLogos.map(b => (
                <img
                  key={b.name}
                  src={b.src}
                  alt={b.name}
                  loading="lazy"
                  className="h-7 opacity-50 brightness-0 invert hover:opacity-100 transition-all duration-300 object-contain"
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-gray-50 to-transparent z-10" />
      </section>

      {/* ══ 2. RECOGNITION CARDS — editorial, mixed light/dark ══ */}
      <section className="bg-white py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              tag: 'PARTNERSHIPS',
              badge: '2024',
              heading: 'Oracle & CommerceHub launch new partnership',
              desc: "Pairs Oracle's market-leading finance, supply chain, and customer experience applications with CommerceHub's powerful unified platform.",
              cta: 'Read the announcement',
              dark: false,
            },
            {
              tag: 'IDC RECOGNITION',
              badge: 'Leader',
              heading: 'Named Leader in IDC B2C Commerce Platforms',
              desc: "CommerceHub was recognised as a leader in IDC's evaluation of commerce solutions for retailers from $100 million and beyond.",
              cta: 'Read the report',
              dark: true,
            },
            {
              tag: 'ANALYST RECOGNITION',
              badge: '3rd year',
              heading: 'Named Leader in 2025 Gartner® Magic Quadrant™',
              desc: 'CommerceHub named a Leader for Digital Commerce for the 3rd consecutive year, positioned highest for Ability to Execute.',
              cta: 'Read the report',
              dark: false,
            },
          ].map((r, i) => (
            <motion.div
              key={i}
              {...fadeUp(i * 0.1)}
              className={`relative rounded-3xl p-8 overflow-hidden group cursor-pointer ${
                r.dark ? 'bg-black text-white' : 'bg-[#f5f5f5] text-gray-900'
              }`}
            >
              {r.dark && <div className="absolute inset-0 bg-gradient-to-br from-[#DC2626]/20 to-transparent pointer-events-none" />}
              <div className="relative">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#DC2626]">{r.tag}</span>
                  <span className={`text-xs font-black px-3 py-1 rounded-full ${
                    r.dark ? 'bg-white/10 text-white' : 'bg-black/8 text-gray-600'
                  }`}>{r.badge}</span>
                </div>
                <h3 className={`font-black text-xl leading-snug mb-4 ${
                  r.dark ? 'text-white' : 'text-gray-900'
                }`}>{r.heading}</h3>
                <p className={`text-sm font-medium leading-relaxed mb-6 ${
                  r.dark ? 'text-gray-400' : 'text-gray-500'
                }`}>{r.desc}</p>
                <button className={`text-sm font-bold flex items-center gap-1.5 group-hover:gap-3 transition-all ${
                  r.dark ? 'text-white' : 'text-gray-900'
                }`}>
                  {r.cta} <ArrowRightIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ══ 3. SOLUTIONS — cards with real screenshot images ══ */}
      <section className="bg-[#f5f5f5] py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="mb-16">
            <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-[#DC2626] mb-5">Solutions</span>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight max-w-xl">
                One platform for every way you sell
              </h2>
              <p className="text-gray-500 text-base font-medium max-w-sm leading-relaxed">
                Operate your B2C, B2B, and retail channels with software built for customisation, productivity, and revenue growth.
              </p>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { label: 'B2C', heading: 'Direct-to-consumer at scale', desc: 'Launch, iterate, and grow your direct consumer business with the platform purpose-built for conversion and scale.', img: `${CLFT}/catalogue_e_commerce.webp` },
              { label: 'B2B', heading: 'Wholesale & business selling', desc: 'Manage complex wholesale relationships, custom pricing, and buyer portals from one unified platform.', img: `${CLFT}/boost_personal_commerce_1.webp` },
              { label: 'Retail', heading: 'Unified online & in-store', desc: 'Bridge physical and digital channels with real-time inventory, orders, and customer data — everywhere.', img: `${CLFT}/whatsapp_ordering.webp` },
            ].map((s, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.1)}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow group"
              >
                <div className="relative overflow-hidden h-56">
                  <img src={s.img} alt={s.heading} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute top-4 left-4 bg-[#DC2626] text-white text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">{s.label}</span>
                </div>
                <div className="p-7">
                  <h3 className="text-gray-900 font-black text-lg mb-2">{s.heading}</h3>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed mb-5">{s.desc}</p>
                  <button className="text-sm font-bold text-[#DC2626] flex items-center gap-1 group-hover:gap-3 transition-all">
                    Explore {s.label} <ArrowRightIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 4. ADVANTAGES — tabbed with big live screenshot ══ */}
      <section className="bg-gray-50 py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-[#DC2626] mb-5">
              CommerceHub advantages
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-black leading-tight">
              The platform built for future-proofing
            </h2>
            <p className="mt-5 text-gray-600 text-lg font-medium leading-relaxed">
              Designed to optimise resources and maximise returns — keeping you ahead of shifting customer needs.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
            {/* Tab buttons */}
            <div className="flex flex-col gap-2">
              {advantageTabs.map((tab, i) => (
                <motion.button
                  key={tab.id}
                  {...fadeUp(i * 0.06)}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left rounded-2xl p-5 transition-all border ${
                    activeTab === tab.id
                      ? 'bg-gray-100 border-red-500/60 shadow-lg shadow-red-500/10'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <span className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                      activeTab === tab.id ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {tab.icon}
                    </span>
                    <div>
                      <p className={`font-black text-sm mb-1 ${
                        activeTab === tab.id ? 'text-black' : 'text-gray-700'
                      }`}>{tab.heading}</p>
                      {activeTab === tab.id && (
                        <motion.p
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="text-gray-600 text-xs font-medium leading-relaxed"
                        >
                          {tab.desc}
                        </motion.p>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}

              {/* R&D stat inline */}
              <motion.div {...fadeUp(0.35)} className="bg-[#DC2626] rounded-2xl p-6 mt-1">
                <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-2">R&D spend 2024</p>
                <p className="text-white font-black text-4xl leading-none mb-2">₹1.4B</p>
                <p className="text-white/70 text-xs font-medium leading-relaxed">
                  Invested into the future of commerce.
                </p>
              </motion.div>
            </div>

            {/* Screenshot viewer */}
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              className="sticky top-24 rounded-3xl overflow-hidden bg-[#111] border border-white/[0.07] shadow-2xl"
            >
              <div className="bg-[#1a1a1a] px-5 py-3.5 flex items-center gap-2 border-b border-white/[0.06]">
                <span className="w-3 h-3 rounded-full bg-[#DC2626]/70" />
                <span className="w-3 h-3 rounded-full bg-white/20" />
                <span className="w-3 h-3 rounded-full bg-white/20" />
                <div className="ml-3 h-5 bg-white/[0.05] rounded w-52" />
              </div>
              <img
                src={currentTab.img}
                alt={currentTab.heading}
                loading="lazy"
                className="w-full object-cover"
                style={{ maxHeight: '500px' }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══ 5. STATS — dramatic numbers on white ══ */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
            {[
              { value: '₹8.5T+', label: 'in global commerce GMV since inception', sub: 'Platform processing power at scale' },
              { value: 'Millions', label: 'of businesses worldwide', sub: 'In more than 175 countries' },
              { value: '99.9%', label: 'platform uptime', sub: 'With <50ms global response time' },
            ].map((s, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} className="px-10 py-10 text-center first:pl-0 last:pr-0">
                <p className="text-6xl md:text-7xl font-black text-gray-900 leading-none mb-3">{s.value}</p>
                <p className="text-gray-900 font-black text-base mb-2">{s.label}</p>
                <p className="text-gray-400 text-sm font-medium">{s.sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 6. ARCHITECTURE — dark, with code blocks ══ */}
      <section className="bg-[#0a0a0a] py-28 px-6 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="max-w-2xl mb-14">
            <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-[#DC2626] mb-5">
              Cost-effective operations
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-5">
              Where flexibility meets performance
            </h2>
            <p className="text-gray-400 text-lg font-medium leading-relaxed">
              No matter your building approach, you are supported by a reliable commerce operating system that fuels performance and innovation.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                title: 'Optionality',
                desc: 'Architect your tech stack as precisely as you need. Opt for a full-stack approach, headless architecture, or individual composable components.',
                pills: ['Full-stack', 'Headless', 'Composable'],
                code: `// Deploy headless storefront\nconst client = createStorefrontClient({\n  storeDomain: store.domain,\n  publicAccessToken: env.TOKEN,\n});`,
              },
              {
                title: 'Composability',
                desc: 'Integrate native CommerceHub components with custom code and third-party systems. Designed for interoperability — connects how you want it to.',
                pills: ['Custom APIs', 'Third-party', 'Native SDKs'],
                code: `// Extend checkout logic\nexport async function run(input) {\n  const discounts = await applyRules(\n    input.cart, input.customer\n  );\n  return { discounts };\n}`,
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.1)}
                className="bg-white/[0.03] border border-white/[0.07] rounded-3xl overflow-hidden hover:border-[#DC2626]/25 transition-all"
              >
                <div className="p-10">
                  <h3 className="text-white font-black text-2xl mb-4">{card.title}</h3>
                  <p className="text-gray-400 text-base font-medium leading-relaxed mb-6">{card.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {card.pills.map(p => (
                      <span key={p} className="px-4 py-1.5 bg-white/[0.06] border border-white/[0.08] text-gray-300 text-xs font-bold rounded-full">{p}</span>
                    ))}
                  </div>
                </div>
                <div className="border-t border-white/[0.06] bg-[#080808] px-6 py-5 font-mono text-xs text-emerald-400/80 leading-relaxed whitespace-pre">{card.code}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 7. WHY COMMERCEHUB — alternating image rows on light bg ══ */}
      <section className="bg-[#f5f5f5] py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="text-center max-w-2xl mx-auto mb-20">
            <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-[#DC2626] mb-5">Why CommerceHub</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">Commerce to the core</h2>
            <p className="mt-5 text-gray-500 text-lg font-medium leading-relaxed">
              Named a Leader for Digital Commerce for the 3rd consecutive year, positioned highest for Ability to Execute.
            </p>
          </motion.div>

          {[
            {
              tag: 'Lightning-fast innovation',
              heading: "The world's best-converting checkout",
              desc: "CommerceHub's conversion rate outpaces the competition by up to 36%. Build powerful, customisable checkout experiences designed to maximise every transaction at enterprise scale.",
              bullets: ['Customisable checkout flows', 'One-click accelerated checkout', 'B2B wholesale checkout support', 'Fraud protection built-in'],
              img: `${CLFT}/catalogue_e_commerce.webp`,
              imgRight: true,
            },
            {
              tag: 'Enterprise scale',
              heading: 'Fast and immersive global storefronts',
              desc: 'With 300 global points of presence, your customers get sub-50ms load times anywhere on the planet. Always-on infrastructure powers billions of transactions without a hiccup.',
              bullets: ['99.9% uptime SLA', '300 global PoPs', 'Auto-scaling infrastructure', 'Zero-maintenance upgrades'],
              img: `${CLFT}/boost_personal_commerce_3.webp`,
              imgRight: false,
            },
            {
              tag: 'Unparalleled efficiency',
              heading: 'Tools by developers, for developers',
              desc: 'World-class developer experience with robust documentation, a powerful CLI, and flexible APIs. Use your developer resources to drive growth, not manage infrastructure.',
              bullets: ['GraphQL & REST APIs', 'CLI tooling & local dev', 'Custom functions & extensions', 'Headless storefront support'],
              img: `${CLFT}/boost_personal_commerce_1.webp`,
              imgRight: true,
            },
          ].map((row, i) => (
            <motion.div
              key={i}
              {...fadeUp(0.1)}
              className={`flex flex-col ${
                row.imgRight ? 'lg:flex-row' : 'lg:flex-row-reverse'
              } gap-12 lg:gap-20 items-center mb-28 last:mb-0`}
            >
              <div className="flex-1 space-y-6">
                <span className="inline-block bg-[#DC2626]/10 text-[#DC2626] text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest">
                  {row.tag}
                </span>
                <h3 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">{row.heading}</h3>
                <p className="text-gray-600 text-base font-medium leading-relaxed">{row.desc}</p>
                <ul className="space-y-3">
                  {row.bullets.map(b => (
                    <li key={b} className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#DC2626] flex items-center justify-center shrink-0">
                        <CheckIcon className="w-2.5 h-2.5 text-white" strokeWidth={3.5} />
                      </span>
                      <span className="text-gray-700 font-semibold text-sm">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex-1 w-full">
                <div className="rounded-3xl overflow-hidden shadow-2xl">
                  <img src={row.img} alt={row.heading} loading="lazy" className="w-full object-cover" />
                </div>
              </div>
            </motion.div>
          ))}

          {/* Global stat chips */}
          <motion.div {...fadeUp(0.1)} className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { value: '₹1.1T+', label: 'in global commerce since inception' },
              { value: '875M+', label: 'unique online shoppers from merchants in 2024' },
              { value: '12%+', label: 'of all US ecommerce powered by CommerceHub' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
                <p className="text-4xl font-black text-[#DC2626] mb-3">{s.value}</p>
                <p className="text-gray-600 text-sm font-medium leading-relaxed">{s.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ 8. PARTNER ECOSYSTEM — white bg, full-brightness logos ══ */}
      <section className="bg-white py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-[#DC2626] mb-5">Partner ecosystem</span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight mb-5">
              Established partnerships with<br />the best in commerce
            </h2>
            <p className="text-gray-500 text-base font-medium leading-relaxed">
              Work with top organisations that consult on implementation, build, and delivery for the world's biggest brands.
            </p>
          </motion.div>

          {/* Logo grid — clearly visible on white */}
          <motion.div {...fadeUp(0.1)} className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 items-center mb-16">
            {partnerLogos.map(p => (
              <div key={p.name} className="flex items-center justify-center p-5 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <img
                  src={p.src}
                  alt={p.name}
                  loading="lazy"
                  className="h-8 grayscale opacity-55 hover:opacity-100 hover:grayscale-0 transition-all duration-300 object-contain max-w-full"
                />
              </div>
            ))}
          </motion.div>

          <motion.div {...fadeUp(0.15)} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[
              {
                type: 'Service partners',
                tag: 'Agencies & SIs',
                desc: "Launch quickly and innovate at scale with the world's best agencies and system integrators who know CommerceHub inside-out.",
                cta: 'Find a service partner',
              },
              {
                type: 'Technology partners',
                tag: 'Apps & Integrations',
                desc: 'Leverage our app ecosystem and enterprise partners to work with your existing tech stack or build powerful new functionality.',
                cta: 'Explore technology partners',
              },
            ].map((p, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.1)}
                className="bg-[#f5f5f5] rounded-3xl p-8 hover:bg-[#eeeeee] transition-colors group"
              >
                <span className="inline-block bg-[#DC2626]/10 text-[#DC2626] text-xs font-black px-3 py-1 rounded-full uppercase tracking-widest mb-5">{p.tag}</span>
                <h4 className="text-gray-900 font-black text-xl mb-3">{p.type}</h4>
                <p className="text-gray-500 text-sm font-medium leading-relaxed mb-6">{p.desc}</p>
                <button className="text-sm font-bold text-gray-900 flex items-center gap-2 group-hover:gap-3 transition-all">
                  {p.cta} <ArrowRightIcon className="w-3.5 h-3.5 text-[#DC2626]" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ 9. FINAL CTA — immersive with store image collage strip ══ */}
      <section className="relative bg-black py-36 px-6 text-center overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#DC2626]/16 rounded-full blur-[120px]" />

        {/* Store image collage strip */}
        <div className="absolute inset-0 overflow-hidden opacity-[0.13]">
          <div className="flex gap-3 h-full">
            {[...storeImgs, ...storeImgs].map((src, i) => (
              <img key={i} src={src} alt="" className="h-full w-56 object-cover shrink-0" loading="lazy" />
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60" />
        </div>

        <motion.div {...fadeUp()} className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            Powering enterprise<br />businesses at scale
          </h2>
          <p className="text-gray-400 text-xl font-medium mb-12 leading-relaxed">
            Speak with our enterprise team to bring CommerceHub into your tech stack.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setShowContact(true)}
              className="px-10 py-5 bg-white text-black font-black rounded-2xl hover:bg-gray-100 active:scale-[0.98] transition-all text-sm tracking-wide"
            >
              Get in touch
            </button>
            <button
              onClick={() => navigate('/register')}
              className="px-10 py-5 bg-[#DC2626] text-white font-black rounded-2xl hover:bg-[#B91C1C] active:scale-[0.98] transition-all text-sm tracking-wide flex items-center justify-center gap-2 group"
            >
              Try CommerceHub <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
