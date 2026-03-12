import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

const CDN = 'https://cdn.shopify.com/b/shopify-brochure2-assets';
const CF  = 'https://dwtqm09zovi8z.cloudfront.net/assets';

const storeImages = [
  { src: CDN + '/c65bc0c2daf1df2c109d1f9c14444a57.webp', alt: 'Glossier',            portrait: false },
  { src: CDN + '/82f295147d6f32cd1533aa843f68b0c2.webp',  alt: 'The Sill',            portrait: true  },
  { src: CDN + '/92b0585e60e00efb6ceaf2aec6a66027.webp',  alt: 'Vacation Inc',        portrait: false },
  { src: CDN + '/e919a4c2c7484b87699b2e6f5d020690.webp',  alt: 'Aura Bora',           portrait: true  },
  { src: CDN + '/268717f14ffc87467a9aeb1e6f5a7719.webp',  alt: 'Kit and Ace',         portrait: false },
  { src: CDN + '/f11495397635517ec5ee47c2b360dd04.webp',  alt: 'Super Smalls',        portrait: false },
  { src: CDN + '/c10c68f8cde3ae725cb4286678280226.webp',  alt: 'Happy Monday Coffee', portrait: true  },
  { src: CDN + '/365260f1127ed2d9c4d6185512d63983.webp',  alt: 'OnlyNY',              portrait: false },
  { src: CDN + '/2cc9891ed1b544cdbd548c289d1632cb.jpg',   alt: 'Bonaventura',         portrait: false },
  { src: CDN + '/afdceeca27acf0af45372d782b36a153.webp',  alt: 'Rowing Blazers',      portrait: false },
  { src: CDN + '/b3a10e2014c5b6cd44f2bc4a893ffc75.webp',  alt: 'Kirrin Finch',        portrait: true  },
  { src: CDN + '/d1d0f12159bedd0521717f23600c1beb.webp',  alt: 'Brooklinen',          portrait: false },
  { src: CDN + '/25528b246857074708e006916a5b77a6.jpg',   alt: 'A-morir',             portrait: false },
  { src: CDN + '/f478c242ac029c5f9116252ae2a8e2e1.webp',  alt: 'Caraway',             portrait: true  },
  { src: CDN + '/e103a64d117a2736cc4ff269828fe5ef.webp',  alt: 'Thirsty Turtl',       portrait: false },
];

const merchantStories = [
  {
    tag: 'Get started quickly',
    name: 'Summer Solace Tallow',
    desc: 'Solo founder Megan Bre Camp launched Summer Solace Tallow to sell her organic candles and skincare online and in person at local markets.',
    img: CDN + '/f11495397635517ec5ee47c2b360dd04.webp',
  },
  {
    tag: 'Grow as much as you want',
    name: 'Gymshark',
    desc: 'Athleisure brand Gymshark started small and scaled into a global business, with over US$500 million in annual sales.',
    img: CDN + '/b3a10e2014c5b6cd44f2bc4a893ffc75.webp',
  },
  {
    tag: 'Grow your brand',
    name: 'Mattel',
    desc: 'With CommerceHub for enterprise, Mattel sells its iconic toys directly to customers worldwide.',
    img: CDN + '/d1d0f12159bedd0521717f23600c1beb.webp',
  },
];

const storeWindowTabs = [
  { id: 'store',    label: 'Online store',  img: CF + '/catalogue_e_commerce.webp' },
  { id: 'pos',      label: 'In-person POS', img: CDN + '/82f295147d6f32cd1533aa843f68b0c2.webp' },
  { id: 'checkout', label: 'Checkout',      img: CDN + '/268717f14ffc87467a9aeb1e6f5a7719.webp' },
];

const sellAnywherePoints = [
  { heading: 'Get a stunning store',           desc: "Get a beautiful store that's designed to sell. Design quickly with AI, choose a stylish theme, or build completely custom for full control." },
  { heading: 'In-person point of sale',        desc: 'Sell in person and keep offline and online sales in sync with CommerceHub POS.' },
  { heading: 'Publish across channels',        desc: 'Reach shoppers wherever they browse, search, and shop — Instagram, TikTok, Google, and more.' },
  { heading: 'Powered by the best checkout',   desc: 'CommerceHub Checkout is fast, fully customisable, and optimised to close more sales.' },
];

const customerRelPoints = [
  {
    img: CDN + '/e1010611f256636f75afa0685076a18a.png',
    imgAlt: 'Abandoned cart email with 9% sales improvement graph',
    heading: 'Reach the right customers for less',
    desc: 'Acquire new customers and keep them returning for more with integrated marketing tools and insightful analytics.',
  },
  {
    img: CDN + '/ed5d6ca764ace99791108a304dd99049.png',
    imgAlt: 'B2B discounts — cost per item decreases as quantity increases',
    heading: 'Unlock new growth with B2B',
    desc: 'Create custom experiences for wholesale buyers with flexible pricing, discounts, and payment terms.',
  },
];

const managePoints = [
  { heading: 'Manage everything in one place', desc: 'From back office to front of store, you are always in control with the fully centralised CommerceHub Admin.' },
  { heading: 'Run your store from anywhere',    desc: 'Manage everything on the go with the full-featured CommerceHub mobile app.' },
];

const trustedStats = [
  {
    stat: '15%',   label: 'HIGHER CONVERSIONS',
    extra: '150M+', extraLabel: 'HIGH-INTENT SHOPPERS',
    heading: 'The best-converting checkout',
    desc: 'CommerceHub Checkout converts 15% higher on average than other commerce platforms and exposes your brand to 150 million buy-ready shoppers.',
    source: 'Based on external study with a Big Three global consulting firm, April 2023.',
  },
  {
    stat: '50ms', label: 'GLOBAL LATENCY',
    heading: 'Rock steady and blazing fast',
    desc: 'CommerceHub puts your store within 50 milliseconds of every shopper on the planet, with the capacity to handle even the most epic product drops.',
    speedBar: true,
  },
  {
    stat: '4,000+', label: 'WORLD-CLASS DEVELOPERS',
    extra: '150+',   extraLabel: 'NEW FEATURES EVERY 6 MONTHS',
    heading: 'CommerceHub never stops innovating',
    desc: 'Our team of 4,000+ world-class developers continuously uses the latest technology to make your business stronger, faster, and more successful.',
    subHeadings: [
      { heading: 'AI designed for commerce',  desc: 'CommerceHub Magic harnesses the power of AI to save you time, generating product content or suggesting ways to grow your store.' },
      { heading: 'Continuous innovation',     desc: 'Every 6 months, CommerceHub releases 150+ new features and upgrades, designed to keep your business ahead.' },
    ],
  },
];

const steps = [
  { num: '01', title: 'Add your first product',  desc: 'Upload photos, write a description, and set a price. CommerceHub AI helps you write copy that converts.',                         img: CDN + '/c65bc0c2daf1df2c109d1f9c14444a57.webp' },
  { num: '02', title: 'Customise your store',    desc: 'Choose from hundreds of professional themes — or build completely custom. Your brand, your way.',                                 img: CDN + '/92b0585e60e00efb6ceaf2aec6a66027.webp' },
  { num: '03', title: 'Set up payments',         desc: 'Accept cards, UPI, wallets, and buy-now-pay-later with CommerceHub Payments. Start selling in minutes.',                        img: CDN + '/268717f14ffc87467a9aeb1e6f5a7719.webp' },
];

const globalStats = [
  { value: '175+', label: 'countries & territories' },
  { value: '133+', label: 'currencies supported'    },
  { value: '110+', label: 'payment providers'       },
  { value: '20+',  label: 'language translations'   },
];

const sellPills = [
  'Sell online and in person',
  'Sell in India and worldwide',
  'Sell direct and wholesale',
  'Sell on desktop and mobile',
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

const fadeUp = (delay = 0) => ({
  initial:     { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0  },
  viewport:    { once: true        },
  transition:  { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
});

/* ─────────────────────── COMPONENT ─────────────────────── */

export default function Home() {
  const navigate = useNavigate();
  const [email,          setEmail]   = useState('');
  const [heroImgIdx,  setHeroImgIdx] = useState(0);
  const [activeStoreTab, setActiveStoreTab] = useState('store');
  const [activePill,  setActivePill] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setHeroImgIdx(i  => (i  + 1) % storeImages.length);
      setActivePill(i  => (i  + 1) % sellPills.length);
    }, 4200);
    return () => clearInterval(t);
  }, []);

  const activeWindowTab = storeWindowTabs.find(t => t.id === activeStoreTab);
  const mosaicItems = [...storeImages, ...storeImages]; // doubled for seamless loop

  const handleStart = (e) => { e.preventDefault(); navigate('/register'); };

  return (
    <div className="bg-white min-h-screen w-full overflow-x-hidden text-black">
      <Navbar />

      {/* ══════════════════════════ HERO ══════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center bg-black overflow-hidden">

        {/* Rotating store background */}
        <AnimatePresence mode="wait">
          <motion.div
            key={heroImgIdx}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            className="absolute inset-0 z-0"
          >
            <img src={storeImages[heroImgIdx].src} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
          </motion.div>
        </AnimatePresence>

        {/* Red ambient glow */}
        <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[900px] h-[480px] bg-[#DC2626]/12 rounded-full blur-[140px] z-0" />

        {/* Hero content */}
        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-40 pb-32">

          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center gap-2 border border-white/20 rounded-full px-4 py-1.5 text-xs font-bold text-gray-300 mb-8 bg-white/[0.04] backdrop-blur-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse" />
            Trusted by millions of businesses worldwide
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 36 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.18 }}
            className="text-white text-[clamp(4rem,11vw,8rem)] font-black leading-[0.93] tracking-tight mb-8"
          >
            Be the next<br />big thing
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }}
            className="text-gray-300 text-xl md:text-2xl font-medium mb-10 max-w-xl mx-auto leading-relaxed"
          >
            Dream big, build fast, and grow your business with CommerceHub.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }}
            onSubmit={handleStart}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-5"
          >
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Email address"
              className="flex-1 px-5 py-4 rounded-xl bg-white/[0.08] border border-white/[0.12] text-white placeholder-gray-500 focus:outline-none focus:border-white/35 transition-colors text-sm backdrop-blur-sm"
            />
            <button type="submit"
              className="px-7 py-4 bg-white text-black font-black rounded-xl text-sm hover:bg-gray-100 transition-all whitespace-nowrap shadow-xl shadow-white/10">
              Start for free
            </button>
          </motion.form>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.52 }}
            className="text-gray-600 text-xs font-medium mb-14"
          >
            No credit card required &middot; 14-day free trial &middot; Cancel anytime
          </motion.p>

          {/* Trusted brands strip */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65, duration: 0.9 }}
            className="mt-16 border-t border-white/[0.1] pt-8"
          >
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-7">
              Trusted by the world&apos;s largest brands
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-5">
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

          {/* Slideshow indicator dots */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
            className="flex justify-center gap-1.5 mt-10"
          >
            {storeImages.map((_, i) => (
              <button key={i} onClick={() => setHeroImgIdx(i)}
                className={`rounded-full transition-all duration-500 ${i === heroImgIdx ? 'w-6 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/25 hover:bg-white/50'}`}
              />
            ))}
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent z-10" />
      </section>

      {/* ══════════════════════════ SELL PILLS ══════════════════════════ */}
      <section className="bg-white border-t border-red-500 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-x-10 gap-y-2">
          {sellPills.map((label, i) => (
            <motion.span key={i}
              animate={{ opacity: i === activePill ? 1 : 0.28 }} transition={{ duration: 0.5 }}
              className="text-sm font-bold text-red-600 select-none cursor-default"
            >
              {label}
            </motion.span>
          ))}
        </div>
      </section>

      {/* ══════════════════════════ STORE MOSAIC — infinite auto-scroll ══════════════════════════ */}
      <section className="bg-gray-50 py-8 overflow-hidden">
        <style>{`
          @keyframes mosaicScroll {
            from { transform: translateX(0); }
            to   { transform: translateX(-50%); }
          }
          .mosaic-track { animation: mosaicScroll 42s linear infinite; }
          .mosaic-track:hover { animation-play-state: paused; }
        `}</style>
        <div className="mosaic-track flex gap-3" style={{ width: 'max-content' }}>
          {mosaicItems.map((img, i) => (
            <div key={i}
              className="relative flex-shrink-0 rounded-2xl overflow-hidden border border-white/[0.06] group cursor-pointer"
              style={{ width: img.portrait ? '188px' : '488px', height: '368px' }}
            >
              <img src={img.src} alt={img.alt}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
              <p className="absolute bottom-3.5 left-4 text-white text-[11px] font-black tracking-wide opacity-80 group-hover:opacity-100 transition-opacity">{img.alt}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════ THE ONE COMMERCE PLATFORM ══════════════════════════ */}
      <section className="bg-white py-28 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <motion.p {...fadeUp()} className="text-[#DC2626] text-xs font-black uppercase tracking-[0.25em] mb-4">
            From first-time entrepreneurs to enterprise businesses
          </motion.p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <motion.h2 {...fadeUp(0.06)} className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.0] max-w-xl text-black">
              The one commerce<br />platform behind it all
            </motion.h2>
            <motion.p {...fadeUp(0.1)} className="text-gray-600 text-base font-medium max-w-sm leading-relaxed">
              Millions of businesses of every size have collectively made over US$1 trillion in sales on CommerceHub.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12">
            {merchantStories.map((s, i) => (
              <motion.div key={i} {...fadeUp(i * 0.09)}
                className="group border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-all duration-300 cursor-pointer shadow-lg"
                onClick={() => navigate('/register')}
              >
                <div className="aspect-[16/10] overflow-hidden bg-[#0a0a0a]">
                  <img src={s.img} alt={s.name} loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-7">
                  <p className="text-[#DC2626] text-[10px] font-black uppercase tracking-[0.22em] mb-3">{s.tag}</p>
                  <h3 className="text-black font-black text-lg mb-3 leading-tight">{s.name}</h3>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div {...fadeUp(0.2)}>
            <button onClick={() => navigate('/register')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-red-500 text-white font-black rounded-xl text-sm hover:bg-red-600 transition-all shadow-xl">
              Pick a plan that fits your business <ArrowRightIcon className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════ SELL ANYWHERE ══════════════════════════ */}
      <section className="bg-gray-50 py-28 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <motion.div {...fadeUp()}>
            <p className="text-gray-600 text-xs font-black uppercase tracking-[0.22em] mb-5">Online and in person</p>
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-12 text-black">
              Sell anywhere<br />and everywhere
            </h2>
            <div className="space-y-8">
              {sellAnywherePoints.map((pt, i) => (
                <motion.div key={i} {...fadeUp(0.07 + i * 0.07)} className="flex gap-5">
                  <div className="mt-1 w-0.5 flex-shrink-0 rounded-full bg-gradient-to-b from-[#DC2626] to-transparent" style={{ minHeight: '64px' }} />
                  <div>
                    <h3 className="text-black font-black text-base mb-1.5">{pt.heading}</h3>
                    <p className="text-gray-600 text-sm font-medium leading-relaxed">{pt.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Sticky browser mockup */}
          <motion.div {...fadeUp(0.1)} className="lg:sticky lg:top-24">
            <div className="rounded-2xl overflow-hidden border border-white/[0.09] bg-[#0e0e0e] shadow-2xl shadow-black/80">
              <div className="bg-[#181818] px-4 py-3 flex items-center gap-2 border-b border-white/[0.05]">
                <span className="w-3 h-3 rounded-full bg-[#DC2626]/55" />
                <span className="w-3 h-3 rounded-full bg-white/10" />
                <span className="w-3 h-3 rounded-full bg-white/10" />
                <div className="flex-1 ml-4 bg-white/[0.04] rounded-md h-5 max-w-[220px] flex items-center px-3">
                  <span className="text-[9px] text-gray-700 font-mono">commerce-hub.com/store</span>
                </div>
              </div>
              <div className="bg-[#131313] border-b border-white/[0.05] flex">
                {storeWindowTabs.map(t => (
                  <button key={t.id} onClick={() => setActiveStoreTab(t.id)}
                    className={`px-5 py-3 text-xs font-bold transition-all border-b-2 ${
                      activeStoreTab === t.id
                        ? 'text-white border-[#DC2626] bg-white/[0.03]'
                        : 'text-gray-400 border-transparent hover:text-gray-300'
                    }`}>
                    {t.label}
                  </button>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeStoreTab} src={activeWindowTab.img} alt={activeWindowTab.label}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full object-cover" loading="lazy"
                />
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════ CUSTOMER RELATIONSHIPS ══════════════════════════ */}
      <section className="bg-white py-28 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <motion.p {...fadeUp()} className="text-gray-600 text-xs font-black uppercase tracking-[0.22em] mb-4">Direct and wholesale</motion.p>
            <motion.h2 {...fadeUp(0.07)} className="text-4xl md:text-5xl font-black leading-tight text-black">
              Build lasting customer<br />relationships
            </motion.h2>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
            {customerRelPoints.map((item, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)}
                className="rounded-2xl overflow-hidden border border-gray-200 group hover:border-gray-300 transition-all duration-300 shadow-lg">
                <div className="overflow-hidden bg-gray-100">
                  <img src={item.img} alt={item.imgAlt} loading="lazy"
                    className="w-full object-cover group-hover:scale-[1.025] transition-transform duration-700" />
                </div>
                <div className="p-8 bg-white">
                  <h3 className="text-black font-black text-xl mb-3">{item.heading}</h3>
                  <p className="text-gray-600 text-sm font-medium leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════ QUOTE ══════════════════════════ */}
      <section className="bg-gray-50 py-24 px-6 border-t border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeUp()}>
            <p className="text-[#DC2626] font-black text-8xl leading-none mb-4 opacity-50 select-none">&ldquo;</p>
            <blockquote className="text-2xl md:text-3xl font-black text-gray-800 leading-snug mb-10">
              Since we started on CommerceHub, we&apos;ve gone from a bedroom operation to a global brand doing over half a billion in annual sales.
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              <img
                src={CDN + '/b3a10e2014c5b6cd44f2bc4a893ffc75.webp'}
                alt="Gymshark" loading="lazy"
                className="w-11 h-11 rounded-full object-cover border border-gray-300"
              />
              <div className="text-left">
                <p className="text-black font-black text-sm">Ben Francis</p>
                <p className="text-gray-600 text-xs font-medium">Founder, Gymshark</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════ EXPAND GLOBALLY ══════════════════════════ */}
      <section className="bg-white py-28 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div {...fadeUp()}>
            <p className="text-gray-600 text-xs font-black uppercase tracking-[0.22em] mb-5">Local and global</p>
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-7 text-black">
              Expand across<br />the globe
            </h2>
            <h3 className="text-black font-black text-lg mb-3">Sell and ship everywhere</h3>
            <p className="text-gray-600 text-sm font-medium leading-relaxed mb-10">
              CommerceHub takes the complexity out of international selling — from delivering products faster and more
              affordably to localising your experience with CommerceHub Markets.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {globalStats.map((s, i) => (
                <motion.div key={i} {...fadeUp(0.06 + i * 0.06)}
                  className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors bg-white shadow-sm">
                  <p className="text-black font-black text-2xl">{s.value}</p>
                  <p className="text-gray-600 text-xs font-semibold mt-1">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div {...fadeUp(0.1)} className="flex items-center justify-center">
            {/* ── Rotating Earth ── */}
            <div className="relative w-[340px] h-[340px] md:w-[420px] md:h-[420px]">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full bg-[#1a3a6b]/30 blur-[48px]" />
              {/* Orbit ring */}
              <div className="absolute inset-[-18px] rounded-full border border-white/[0.06]" />
              <div className="absolute inset-[-36px] rounded-full border border-white/[0.03]" />

              {/* Globe sphere */}
              <div className="absolute inset-0 rounded-full overflow-hidden shadow-2xl shadow-[#0a2a5e]/80" style={{ background: 'radial-gradient(circle at 35% 35%, #1a6fd4 0%, #0b3fa8 35%, #042480 65%, #020f3d 100%)' }}>

                {/* Animated land masses — CSS keyframe scroll */}
                <style>{`
                  @keyframes globeSpin {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-50%); }
                  }
                  .globe-land { animation: globeSpin 18s linear infinite; }
                `}</style>

                {/* Repeating SVG continent silhouettes scrolling across */}
                <div className="globe-land absolute inset-y-0 flex" style={{ width: '200%', top: 0 }}>
                  <svg viewBox="0 0 800 420" className="flex-shrink-0" style={{ width: '50%', height: '100%' }} preserveAspectRatio="xMidYMid slice">
                    {/* Americas */}
                    <path d="M160,80 Q175,65 195,75 Q215,85 210,110 Q220,140 205,165 Q195,195 180,210 Q165,240 160,270 Q150,300 155,330 Q145,310 138,280 Q130,250 135,220 Q125,190 130,160 Q128,130 140,105 Z" fill="#2dd4bf" opacity="0.35" />
                    <path d="M175,180 Q195,170 210,185 Q225,200 215,225 Q205,255 185,265 Q165,270 158,250 Q148,225 155,205 Z" fill="#2dd4bf" opacity="0.3" />
                    {/* Europe/Africa */}
                    <path d="M380,60 Q400,50 415,65 Q425,80 420,100 Q415,125 405,135 Q395,120 385,105 Q372,85 380,60 Z" fill="#2dd4bf" opacity="0.35" />
                    <path d="M375,145 Q395,138 410,150 Q425,165 420,200 Q415,240 400,270 Q385,300 370,295 Q355,285 355,255 Q350,220 358,190 Q362,165 375,145 Z" fill="#2dd4bf" opacity="0.35" />
                    {/* Asia */}
                    <path d="M480,55 Q520,40 560,55 Q600,68 615,95 Q625,120 610,145 Q590,165 565,158 Q540,150 520,165 Q500,155 488,135 Q472,110 475,85 Z" fill="#2dd4bf" opacity="0.35" />
                    <path d="M545,165 Q570,158 590,170 Q608,185 600,210 Q590,235 570,240 Q550,242 538,225 Q525,205 530,185 Z" fill="#2dd4bf" opacity="0.3" />
                    {/* Australia */}
                    <path d="M580,270 Q605,260 625,275 Q642,293 635,318 Q622,338 600,335 Q578,330 570,310 Q562,290 580,270 Z" fill="#2dd4bf" opacity="0.3" />
                    {/* Duplicate for seamless loop — Americas */}
                    <path d="M960,80 Q975,65 995,75 Q1015,85 1010,110 Q1020,140 1005,165 Q995,195 980,210 Q965,240 960,270 Q950,300 955,330 Q945,310 938,280 Q930,250 935,220 Q925,190 930,160 Q928,130 940,105 Z" fill="#2dd4bf" opacity="0.35" />
                    <path d="M975,180 Q995,170 1010,185 Q1025,200 1015,225 Q1005,255 985,265 Q965,270 958,250 Q948,225 955,205 Z" fill="#2dd4bf" opacity="0.3" />
                    {/* Duplicate Europe/Africa */}
                    <path d="M1180,60 Q1200,50 1215,65 Q1225,80 1220,100 Q1215,125 1205,135 Q1195,120 1185,105 Q1172,85 1180,60 Z" fill="#2dd4bf" opacity="0.35" />
                    <path d="M1175,145 Q1195,138 1210,150 Q1225,165 1220,200 Q1215,240 1200,270 Q1185,300 1170,295 Q1155,285 1155,255 Q1150,220 1158,190 Q1162,165 1175,145 Z" fill="#2dd4bf" opacity="0.35" />
                    {/* Duplicate Asia */}
                    <path d="M1280,55 Q1320,40 1360,55 Q1400,68 1415,95 Q1425,120 1410,145 Q1390,165 1365,158 Q1340,150 1320,165 Q1300,155 1288,135 Q1272,110 1275,85 Z" fill="#2dd4bf" opacity="0.35" />
                    {/* Duplicate Australia */}
                    <path d="M1380,270 Q1405,260 1425,275 Q1442,293 1435,318 Q1422,338 1400,335 Q1378,330 1370,310 Q1362,290 1380,270 Z" fill="#2dd4bf" opacity="0.3" />
                  </svg>
                  {/* second copy for seamlessness */}
                  <svg viewBox="0 0 800 420" className="flex-shrink-0" style={{ width: '50%', height: '100%' }} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
                    <path d="M160,80 Q175,65 195,75 Q215,85 210,110 Q220,140 205,165 Q195,195 180,210 Q165,240 160,270 Q150,300 155,330 Q145,310 138,280 Q130,250 135,220 Q125,190 130,160 Q128,130 140,105 Z" fill="#2dd4bf" opacity="0.35" />
                    <path d="M175,180 Q195,170 210,185 Q225,200 215,225 Q205,255 185,265 Q165,270 158,250 Q148,225 155,205 Z" fill="#2dd4bf" opacity="0.3" />
                    <path d="M380,60 Q400,50 415,65 Q425,80 420,100 Q415,125 405,135 Q395,120 385,105 Q372,85 380,60 Z" fill="#2dd4bf" opacity="0.35" />
                    <path d="M375,145 Q395,138 410,150 Q425,165 420,200 Q415,240 400,270 Q385,300 370,295 Q355,285 355,255 Q350,220 358,190 Q362,165 375,145 Z" fill="#2dd4bf" opacity="0.35" />
                    <path d="M480,55 Q520,40 560,55 Q600,68 615,95 Q625,120 610,145 Q590,165 565,158 Q540,150 520,165 Q500,155 488,135 Q472,110 475,85 Z" fill="#2dd4bf" opacity="0.35" />
                    <path d="M545,165 Q570,158 590,170 Q608,185 600,210 Q590,235 570,240 Q550,242 538,225 Q525,205 530,185 Z" fill="#2dd4bf" opacity="0.3" />
                    <path d="M580,270 Q605,260 625,275 Q642,293 635,318 Q622,338 600,335 Q578,330 570,310 Q562,290 580,270 Z" fill="#2dd4bf" opacity="0.3" />
                  </svg>
                </div>

                {/* Latitude lines */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 420 420" preserveAspectRatio="xMidYMid meet">
                  {[95,140,180,210,240,280,325].map((cy, i) => (
                    <ellipse key={i} cx="210" cy={cy} rx="205" ry="6" fill="none" stroke="white" strokeWidth="0.4" opacity="0.08" />
                  ))}
                  {/* Vertical longitude arcs */}
                  {[210].map((cx, i) => (
                    <ellipse key={i} cx={cx} cy="210" rx="6" ry="205" fill="none" stroke="white" strokeWidth="0.4" opacity="0.08" />
                  ))}
                </svg>

                {/* Atmosphere sheen */}
                <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 30% 28%, rgba(255,255,255,0.14) 0%, transparent 60%)' }} />
                <div className="absolute inset-0 rounded-full" style={{ background: 'radial-gradient(circle at 70% 75%, rgba(0,0,60,0.5) 0%, transparent 55%)' }} />
              </div>

              {/* City ping dots */}
              {[
                { top: '28%', left: '42%', label: 'London'    },
                { top: '32%', left: '58%', label: 'Mumbai'    },
                { top: '38%', left: '22%', label: 'New York'  },
                { top: '55%', left: '70%', label: 'Sydney'    },
                { top: '30%', left: '66%', label: 'Tokyo'     },
                { top: '46%', left: '30%', label: 'São Paulo' },
              ].map((dot, i) => (
                <div key={i} className="absolute flex flex-col items-center" style={{ top: dot.top, left: dot.left, transform: 'translate(-50%,-50%)' }}>
                  <div className="relative">
                    <div className="w-2 h-2 rounded-full bg-[#2dd4bf] shadow-[0_0_8px_2px_rgba(45,212,191,0.7)]" style={{ animationDelay: `${i * 0.4}s` }} />
                    <div className="absolute inset-0 rounded-full bg-[#2dd4bf]/40 animate-ping" style={{ animationDelay: `${i * 0.4}s` }} />
                  </div>
                  <span className="mt-1 text-[8px] text-[#2dd4bf]/70 font-bold whitespace-nowrap hidden md:block">{dot.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════ MANAGE BUSINESS ══════════════════════════ */}
      <section className="bg-gray-50 py-28 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: multi-image block */}
          <motion.div {...fadeUp()}>
            <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white mb-4 shadow-lg">
              <img src={CDN + '/3b04a0eb77b3f64a5f90673f9e4afad7.png'}
                alt="CommerceHub Admin" loading="lazy" className="w-full object-cover" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl overflow-hidden border border-gray-200 aspect-square bg-white shadow-sm">
                <img src={CDN + '/c10c68f8cde3ae725cb4286678280226.webp'} alt="POS terminal" loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div className="rounded-xl overflow-hidden border border-gray-200 aspect-square bg-white shadow-sm">
                <img src={CDN + '/82f295147d6f32cd1533aa843f68b0c2.webp'} alt="Mobile" loading="lazy" className="w-full h-full object-cover" />
              </div>
            </div>
          </motion.div>

          {/* Right: text */}
          <motion.div {...fadeUp(0.1)}>
            <p className="text-gray-600 text-xs font-black uppercase tracking-[0.22em] mb-5">Desktop and mobile</p>
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-10 text-black">
              Manage your<br />business with ease
            </h2>
            <div className="space-y-8 mb-10">
              {managePoints.map((pt, i) => (
                <motion.div key={i} {...fadeUp(0.12 + i * 0.08)} className="flex gap-5">
                  <div className="mt-1 w-0.5 flex-shrink-0 rounded-full bg-gradient-to-b from-[#DC2626] to-transparent" style={{ minHeight: '56px' }} />
                  <div>
                    <h3 className="text-black font-black text-base mb-1.5">{pt.heading}</h3>
                    <p className="text-gray-600 text-sm font-medium leading-relaxed">{pt.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-8 mb-8">
              <h3 className="text-black font-black text-base mb-2">Apps for your business needs</h3>
              <p className="text-gray-600 text-sm font-medium leading-relaxed">
                CommerceHub offers all the essentials built in. The CommerceHub App Store has 13,000+ apps for whatever specialised feature you need.
              </p>
            </div>
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-black font-black text-base mb-2">By developers, for developers</h3>
              <p className="text-gray-600 text-sm font-medium leading-relaxed">
                APIs, primitives, and tools empower devs and partners to build the apps, themes, and custom storefronts your business needs.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════ TRUSTED PLATFORM ══════════════════════════ */}
      <section className="bg-white py-28 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <motion.p {...fadeUp()} className="text-[#DC2626] text-xs font-black uppercase tracking-[0.25em] mb-4">Proven at every scale</motion.p>
          <motion.h2 {...fadeUp(0.07)} className="text-4xl md:text-6xl font-black mb-20 leading-[1.0] max-w-xl text-black">
            A trusted platform<br />to build your business
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trustedStats.map((item, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)}
                className="border border-gray-200 rounded-2xl p-9 hover:border-gray-300 transition-colors bg-white shadow-lg">
                <p className="text-[#DC2626] text-[10px] font-black uppercase tracking-[0.22em] mb-2">{item.label}</p>
                <p className="text-black font-black leading-none text-[4.5rem] mb-1">{item.stat}</p>
                {item.extra && (
                  <div className="mt-7">
                    <p className="text-[#DC2626] text-[10px] font-black uppercase tracking-[0.22em] mb-1">{item.extraLabel}</p>
                    <p className="text-black font-black text-4xl leading-none">{item.extra}</p>
                  </div>
                )}
                {item.speedBar && (
                  <div className="mt-7">
                    <div className="flex justify-between text-[9px] text-gray-700 font-bold mb-2">
                      <span>Response time</span><span>Global avg: 200ms</span>
                    </div>
                    <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-[#DC2626] to-[#DC2626]/60 rounded-full"
                        initial={{ width: '0%' }}
                        whileInView={{ width: '25%' }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.4, delay: 0.3 }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] font-bold mt-1.5">
                      <span className="text-[#DC2626]">50ms ◀</span>
                      <span className="text-gray-700">500ms</span>
                    </div>
                    <div className="mt-5 grid grid-cols-3 gap-2">
                      {['Americas', 'Europe', 'Asia-Pac'].map(r => (
                        <div key={r} className="text-center bg-white/[0.03] rounded-xl py-3 border border-white/[0.05]">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#DC2626] mx-auto mb-1.5 animate-pulse" />
                          <p className="text-[8px] text-gray-500 font-bold">{r}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="border-t border-white/[0.06] mt-8 pt-8">
                  <h3 className="text-white font-black text-lg mb-3">{item.heading}</h3>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                  {item.source && <p className="text-gray-700 text-xs mt-3 leading-relaxed">{item.source}</p>}
                  {item.subHeadings && (
                    <div className="mt-6 space-y-5">
                      {item.subHeadings.map((sh, j) => (
                        <div key={j}>
                          <h4 className="text-white font-bold text-sm mb-1.5">{sh.heading}</h4>
                          <p className="text-gray-600 text-xs font-medium leading-relaxed">{sh.desc}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════ CHECKOUT WINDOW ══════════════════════════ */}
      <section className="bg-black py-28 px-6 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <motion.div {...fadeUp()}>
            <p className="text-gray-600 text-xs font-black uppercase tracking-[0.22em] mb-5">The best-converting checkout</p>
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-7">
              One-click to<br />more sales
            </h2>
            <p className="text-gray-500 text-sm font-medium leading-relaxed mb-10">
              CommerceHub Checkout is the highest-converting checkout on the internet — 15% higher on average
              than other platforms. Shop Pay autofills payment and shipping details so 150 million high-intent
              shoppers can buy in one tap.
            </p>
            <div className="flex flex-col gap-5">
              {[
                { stat: '15%',   label: 'higher conversion on average vs. other platforms' },
                { stat: '150M+', label: 'high-intent shoppers already on Shop Pay' },
                { stat: '1-tap', label: 'checkout — no passwords, no re-entering card details' },
              ].map((item, i) => (
                <motion.div key={i} {...fadeUp(0.06 + i * 0.07)} className="flex items-start gap-4">
                  <span className="text-white font-black text-xl min-w-[58px]">{item.stat}</span>
                  <span className="text-gray-500 text-sm font-medium leading-relaxed">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — checkout UI mockup */}
          <motion.div {...fadeUp(0.1)}>
            <div className="rounded-2xl overflow-hidden border border-white/[0.09] bg-[#0e0e0e] shadow-2xl shadow-black/80">
              {/* Browser bar */}
              <div className="bg-[#181818] px-4 py-3 flex items-center gap-2 border-b border-white/[0.05]">
                <span className="w-3 h-3 rounded-full bg-[#DC2626]/55" />
                <span className="w-3 h-3 rounded-full bg-white/10" />
                <span className="w-3 h-3 rounded-full bg-white/10" />
                <div className="flex-1 ml-4 bg-white/[0.04] rounded-md h-5 max-w-[240px] flex items-center px-3">
                  <span className="text-[9px] text-gray-600 font-mono">🔒 checkout.commerce-hub.com</span>
                </div>
              </div>

              {/* Checkout body */}
              <div className="p-6 grid grid-cols-5 gap-5">

                {/* Left col — form */}
                <div className="col-span-3 space-y-4">
                  {/* Express pay */}
                  <div className="space-y-2">
                    <p className="text-[9px] text-gray-600 font-bold uppercase tracking-widest mb-2">Express checkout</p>
                    <div className="flex gap-2">
                      <div className="flex-1 h-9 bg-[#1a1a2e] border border-[#5865F2]/40 rounded-lg flex items-center justify-center">
                        <span className="text-[10px] font-black text-[#5865F2]" style={{ fontStyle: 'italic' }}>Shop Pay</span>
                      </div>
                      <div className="flex-1 h-9 bg-[#1a1a1a] border border-white/10 rounded-lg flex items-center justify-center">
                        <span className="text-[10px] font-bold text-gray-400">GPay</span>
                      </div>
                      <div className="flex-1 h-9 bg-[#1a1a1a] border border-white/10 rounded-lg flex items-center justify-center">
                        <span className="text-[10px] font-bold text-gray-400">Apple Pay</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 my-3">
                      <div className="flex-1 h-px bg-white/[0.06]" />
                      <span className="text-[9px] text-gray-700 font-medium">or pay manually</span>
                      <div className="flex-1 h-px bg-white/[0.06]" />
                    </div>
                  </div>

                  {/* Contact */}
                  <div>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-2">Contact</p>
                    <div className="h-8 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 flex items-center">
                      <span className="text-[10px] text-gray-600">hello@example.com</span>
                    </div>
                  </div>

                  {/* Delivery */}
                  <div>
                    <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mb-2">Delivery</p>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div className="h-8 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 flex items-center">
                        <span className="text-[10px] text-gray-600">First name</span>
                      </div>
                      <div className="h-8 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 flex items-center">
                        <span className="text-[10px] text-gray-600">Last name</span>
                      </div>
                    </div>
                    <div className="h-8 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 flex items-center mb-2">
                      <span className="text-[10px] text-gray-600">Address</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-8 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 flex items-center">
                        <span className="text-[10px] text-gray-600">City</span>
                      </div>
                      <div className="h-8 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 flex items-center">
                        <span className="text-[10px] text-gray-600">State</span>
                      </div>
                      <div className="h-8 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 flex items-center">
                        <span className="text-[10px] text-gray-600">PIN</span>
                      </div>
                    </div>
                  </div>

                  {/* Pay button */}
                  <button className="w-full h-10 rounded-lg bg-[#DC2626] text-white text-xs font-black tracking-wide hover:bg-[#b91c1c] transition-colors">
                    Pay now — ₹2,499.00
                  </button>
                  <p className="text-center text-[8px] text-gray-700">
                    🔒 Secured by CommerceHub
                  </p>
                </div>

                {/* Right col — order summary */}
                <div className="col-span-2 border-l border-white/[0.05] pl-5 space-y-4">
                  <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">Order summary</p>

                  {/* Product rows */}
                  {[
                    { name: 'Wireless headphones', qty: 1, price: '₹1,999' },
                    { name: 'Phone case',           qty: 2, price: '₹500'  },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className="w-8 h-8 flex-shrink-0 rounded bg-white/[0.06] border border-white/[0.06]" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] text-gray-300 font-semibold truncate">{item.name}</p>
                        <p className="text-[8px] text-gray-600">Qty {item.qty}</p>
                      </div>
                      <p className="text-[9px] text-gray-400 font-bold flex-shrink-0">{item.price}</p>
                    </div>
                  ))}

                  <div className="border-t border-white/[0.06] pt-3 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-[9px] text-gray-600">Subtotal</span>
                      <span className="text-[9px] text-gray-400">₹2,499</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[9px] text-gray-600">Shipping</span>
                      <span className="text-[9px] text-[#3fb950]">Free</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[9px] text-gray-600">Taxes</span>
                      <span className="text-[9px] text-gray-400">₹0</span>
                    </div>
                  </div>

                  <div className="border-t border-white/[0.06] pt-3 flex justify-between">
                    <span className="text-[10px] text-white font-black">Total</span>
                    <span className="text-[10px] text-white font-black">₹2,499.00</span>
                  </div>

                  {/* Trust badges */}
                  <div className="pt-2 grid grid-cols-2 gap-2">
                    {['256-bit SSL', 'PCI DSS', 'UPI', 'EMI'].map(b => (
                      <div key={b} className="h-6 bg-white/[0.03] border border-white/[0.06] rounded flex items-center justify-center">
                        <span className="text-[7px] text-gray-600 font-bold">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════ EASY TO START ══════════════════════════ */}
      <section className="bg-gray-50 py-28 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto">
          <motion.p {...fadeUp()} className="text-gray-600 text-xs font-black uppercase tracking-[0.22em] mb-4">Get started in minutes</motion.p>
          <motion.h2 {...fadeUp(0.07)} className="text-4xl md:text-5xl font-black mb-16 leading-tight text-black">
            It&apos;s easy to start selling
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
            {steps.map((s, i) => (
              <motion.div key={i} {...fadeUp(i * 0.09)}
                className="group border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 transition-all duration-300 shadow-lg bg-white">
                <div className="aspect-[16/9] overflow-hidden bg-gray-100">
                  <img src={s.img} alt={s.title} loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-7 bg-white">
                  <p className="text-[#DC2626] font-black text-xs tracking-[0.22em] uppercase mb-3">{s.num}</p>
                  <h3 className="text-black font-black text-xl mb-3 leading-tight">{s.title}</h3>
                  <p className="text-gray-600 text-sm font-medium leading-relaxed">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div {...fadeUp(0.25)}>
            <button onClick={() => navigate('/register')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-red-500 text-white font-black rounded-xl text-sm hover:bg-red-600 transition-all shadow-xl">
              Get started today <ArrowRightIcon className="w-4 h-4" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════ DEVELOPER TERMINAL ══════════════════════════ */}
      <section className="bg-white py-28 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — heading & copy */}
          <motion.div {...fadeUp()}>
            <p className="text-gray-600 text-xs font-black uppercase tracking-[0.25em] mb-5">For developers</p>
            <h2 className="text-4xl md:text-5xl font-black leading-tight mb-7 text-black">
              There&apos;s no better<br />place for you to build
            </h2>
            <p className="text-gray-600 text-base font-medium leading-relaxed mb-10">
              Build apps, themes, and custom storefronts on CommerceHub. Access powerful APIs,
              primitives, and tools to create exactly what your business needs — with 13,000+ partners
              already building on the platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#DC2626] text-white font-black rounded-xl text-sm hover:bg-[#b91c1c] transition-all"
              >
                Explore the platform <ArrowRightIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/register')}
                className="inline-flex items-center gap-2 px-6 py-3.5 border border-white/[0.18] text-white font-black rounded-xl text-sm hover:bg-white/[0.05] transition-all"
              >
                View documentation <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          </motion.div>

          {/* Right — terminal window */}
          <motion.div {...fadeUp(0.1)}>
            <div className="rounded-2xl overflow-hidden border border-white/[0.09] shadow-2xl shadow-black/80">
              {/* Title bar */}
              <div className="bg-[#111111] px-4 py-3 flex items-center gap-2 border-b border-white/[0.06]">
                <span className="w-3 h-3 rounded-full bg-[#DC2626]/70" />
                <span className="w-3 h-3 rounded-full bg-white/10" />
                <span className="w-3 h-3 rounded-full bg-white/10" />
                <span className="ml-4 text-[10px] text-gray-700 font-mono select-none">commercehub — ch dev — 80×24</span>
              </div>

              {/* Terminal body */}
              <div className="bg-[#0a0a0a] px-6 py-6 font-mono text-sm leading-relaxed min-h-[340px]">
                {/* Prompt line */}
                <div className="flex items-center gap-1.5 mb-5">
                  <span className="text-[#DC2626]">➜</span>
                  <span className="text-[#DC2626]/60">~/my-store</span>
                  <span className="text-white ml-1">ch dev</span>
                  <span className="inline-block w-[7px] h-[15px] bg-white/75 ml-0.5 animate-pulse" />
                </div>

                {/* Output lines */}
                <div className="space-y-1 text-[13px]">
                  <p className="text-gray-600">CommerceHub CLI v3.56.0</p>
                  <p className="text-white/[0.05] pb-2">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>

                  <p>
                    <span className="text-[#DC2626]">✔</span>
                    <span className="text-gray-400"> Logged in as </span>
                    <span className="text-gray-300">hello@mystore.com</span>
                  </p>
                  <p>
                    <span className="text-[#DC2626]">✔</span>
                    <span className="text-gray-400"> Connected to </span>
                    <span className="text-gray-300">my-store.mycommercehub.io</span>
                  </p>
                  <p>
                    <span className="text-[#DC2626]">✔</span>
                    <span className="text-gray-400"> Tunnel created: </span>
                    <span className="text-gray-300">https://tunnel.commercehub.io</span>
                  </p>
                  <p>
                    <span className="text-[#DC2626]">✔</span>
                    <span className="text-gray-400"> Theme: [1] </span>
                    <span className="text-white font-semibold">Dawn</span>
                    <span className="text-gray-600"> (live)</span>
                  </p>

                  <p className="text-white/[0.05] pt-2 pb-2">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>

                  <p>
                    <span className="text-gray-600">Preview: </span>
                    <span className="text-gray-400 underline underline-offset-2">https://my-store.mycommercehub.io/?preview_theme_id=…</span>
                  </p>
                  <p>
                    <span className="text-gray-600">Editor:  </span>
                    <span className="text-gray-400 underline underline-offset-2">https://my-store.mycommercehub.io/admin/themes/…</span>
                  </p>

                  <p className="text-white/[0.05] pt-2 pb-3">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>

                  <p className="text-white font-semibold">Your development store is ready to use.</p>

                  <p className="text-gray-700 mt-5 flex items-center gap-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" />
                    Watching for file changes…
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════ FINAL CTA ══════════════════════════ */}
      <section className="relative bg-black py-44 px-6 border-t border-white/[0.06] text-center overflow-hidden">
        {/* Faint 5-image background grid */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="grid grid-cols-5 h-full opacity-[0.07]">
            {storeImages.slice(0, 5).map((img, i) => (
              <img key={i} src={img.src} alt="" className="w-full h-full object-cover" />
            ))}
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black" />
        </div>
        {/* Red glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#DC2626]/10 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <motion.h2 {...fadeUp()} className="text-white text-5xl md:text-7xl font-black mb-6 leading-[0.92] tracking-tight">
            Be the next<br />big thing.
          </motion.h2>
          <motion.p {...fadeUp(0.09)} className="text-gray-400 text-xl font-medium mb-10">
            Dream big, build fast, and grow your business with CommerceHub.
          </motion.p>
          <motion.form {...fadeUp(0.14)} onSubmit={handleStart}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Email address"
              className="flex-1 px-5 py-4 rounded-xl bg-white/[0.07] border border-white/[0.10] text-white placeholder-gray-500 focus:outline-none focus:border-white/30 transition-colors text-sm"
            />
            <button type="submit"
              className="px-7 py-4 bg-white text-black font-black rounded-xl text-sm hover:bg-gray-100 transition-all whitespace-nowrap">
              Start for free
            </button>
          </motion.form>
          <motion.p {...fadeUp(0.2)} className="text-gray-700 text-xs font-medium mt-5">
            No credit card required &middot; 14-day free trial &middot; Cancel anytime
          </motion.p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
