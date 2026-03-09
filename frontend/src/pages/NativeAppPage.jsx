import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRightIcon, SmartphoneIcon, ZapIcon, ShoppingBagIcon, StarIcon,
  RefreshCwIcon, BellIcon, UsersIcon, LockIcon, MapPinIcon, ChevronDownIcon,
  HeartIcon, ScanIcon, TruckIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

/* ───────────────────────────────────────── CDN */
const CDN = 'https://cdn.shopify.com/b/shopify-brochure2-assets';
const IMG = {
  phonesArray:  `${CDN}/3094f950310a0b5cc4cfa8fdbac50d8a.webp`,
  checkout:     `${CDN}/50d42025c783062d9932cc40b4dbc876.png`,
  ai:           `${CDN}/27e4cd83b4296c634951aec9deee6a91.png`,
  collab:       `${CDN}/73baf5efde53894bbe8620b107f5f4c6.png`,
  hydrogen:     `${CDN}/ad1e1746f969329119853ff117af96f1.png`,
  b2bStore:     `${CDN}/f9390182b37cab5910307e399a6a69d6.webp`,
  liveGlobe:    `${CDN}/2dbc48f43dded4e3e3d1ff7a7c34167f.png`,
  marketingCh:  `${CDN}/7a8822075c8c1b4a1d7c808d1c2d5ebd.png`,
};

/* ───────────────────────────────────────── DATA */
const heroStats = [
  { value: '250M+', label: 'Verified shoppers worldwide' },
  { value: '50%', label: 'Higher checkout conversion' },
  { value: '48%', label: 'First-time brand shoppers' },
  { value: '$0', label: 'Extra marketplace fees' },
];

const appFeatures = [
  {
    id: 'wallet',
    icon: <LockIcon className="w-5 h-5" />,
    tag: 'BUILT-IN WALLET',
    heading: 'Converts up to 50% higher',
    desc: "Customers checkout with Shop Pay, which remembers all their payment and shipping info. Just 2 taps and it's theirs — the world's fastest checkout experience.",
    img: IMG.checkout,
  },
  {
    id: 'personalisation',
    icon: <HeartIcon className="w-5 h-5" />,
    tag: 'PERSONALISATION',
    heading: 'Tailored for each shopper',
    desc: "When people find you on the app, they automatically see products they're likely to want, based on their unique taste profile and purchase history.",
    img: IMG.marketingCh,
  },
  {
    id: 'sync',
    icon: <RefreshCwIcon className="w-5 h-5" />,
    tag: 'SYNCED ACROSS PLATFORMS',
    heading: 'Remarkable retargeting',
    desc: "Each shopper's cart follows them from your online store to the app. And back again — eliminating abandoned carts and bringing buyers back to complete their order.",
    img: IMG.collab,
  },
  {
    id: 'tracking',
    icon: <TruckIcon className="w-5 h-5" />,
    tag: 'ORDER TRACKING',
    heading: 'More reasons to revisit',
    desc: "Customers track their packages in real time from the app, bringing them back on the regular — building habitual brand engagement that drives repeat sales.",
    img: IMG.liveGlobe,
  },
];

const customiseFeatures = [
  {
    icon: <SmartphoneIcon className="w-5 h-5" />,
    heading: 'Look and feel',
    desc: 'Add video, brand colours, and rich assets to make your app store page feel distinctly yours. Every pixel yours to control.',
  },
  {
    icon: <ShoppingBagIcon className="w-5 h-5" />,
    heading: 'Merchandising',
    desc: 'Add featured collections, subscription products, and limited-time offers — just like your online store, fully synced.',
  },
  {
    icon: <ZapIcon className="w-5 h-5" />,
    heading: 'One-tap checkout',
    desc: 'Let people buy right from the app with Shop Pay, or send them to your branded online store for a full shopping experience.',
  },
  {
    icon: <UsersIcon className="w-5 h-5" />,
    heading: 'Campaigns & acquire',
    desc: "Run performance campaigns to acquire new customers at a set cost-per-acquisition rate. Only pay for what converts — zero waste.",
  },
  {
    icon: <BellIcon className="w-5 h-5" />,
    heading: 'Push notifications',
    desc: "Send targeted push notifications for flash sales, back-in-stock alerts, and abandoned carts — re-engage at the right moment.",
  },
  {
    icon: <ScanIcon className="w-5 h-5" />,
    heading: 'AR & 3D try-on',
    desc: "Let shoppers virtually try on or place products in their space using augmented reality — dramatically reducing returns.",
  },
];

const appBenefits = [
  { icon: <MapPinIcon className="w-5 h-5" />, num: '300+', label: 'Global edge locations' },
  { icon: <ZapIcon className="w-5 h-5" />, num: '2 taps', label: 'To complete checkout' },
  { icon: <ShoppingBagIcon className="w-5 h-5" />, num: '1B+', label: 'Shop Pay transactions' },
  { icon: <StarIcon className="w-5 h-5" />, num: '4.9★', label: 'App Store rating' },
];

const testimonials = [
  {
    quote: "Since launching our native app with CommerceHub, our mobile conversion rate tripled. The Shop Pay wallet alone accounts for 40% of all our sales.",
    name: 'Jordan Lee',
    role: 'Head of E-commerce, Graza',
  },
  {
    quote: "The order tracking feature keeps our customers in the loop and brings them back to browse. Re-order rates went up 60% in the first quarter.",
    name: 'Sam Rivera',
    role: 'Growth Lead, Outdoor Voices',
  },
];

const faq = [
  { q: 'What is the native commerce app?', a: 'Our native app lets your customers shop your full catalogue directly from their phone — with personalised product feeds, one-tap checkout, live order tracking, and push notifications, all natively integrated.' },
  { q: 'How is this different from a mobile website?', a: "A native app runs directly on iOS and Android, giving access to device features like push notifications, Face ID, augmented reality, and the hardware camera — features a mobile website simply can't match." },
  { q: 'How does personalisation work?', a: "Our AI analyses each shopper's browsing, purchase, and wishlist history to surface the products they're most likely to want — increasing time-in-app and average order value." },
  { q: 'Is there a cost per transaction?', a: "No marketplace fees, ever. Unlike app marketplaces that take a cut, you keep 100% of your revenue. Your customers remain yours — their data, their loyalty, your business." },
  { q: 'Can I integrate with my existing store?', a: 'Yes — your app syncs in real time with your online store inventory, pricing, promotions, and collections. One admin, one source of truth for every channel.' },
];

/* ───────────────────────────────────────── HELPERS */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button onClick={() => setOpen(o => !o)} className="w-full text-left flex items-center justify-between py-5 group">
        <span className="font-black text-gray-900 text-base group-hover:text-[#DC2626] transition-colors pr-8">{q}</span>
        <ChevronDownIcon className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-[#DC2626]' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }} className="overflow-hidden">
            <p className="text-gray-500 text-sm font-medium leading-relaxed pb-5">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
});

/* ───────────────────────────────────────── PAGE */
export default function NativeAppPage() {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState('wallet');
  const current = appFeatures.find(f => f.id === activeFeature);

  // Auto-cycle feature tabs
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature(prev => {
        const idx = appFeatures.findIndex(f => f.id === prev);
        return appFeatures[(idx + 1) % appFeatures.length].id;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative bg-black text-white pt-36 pb-0 px-6 overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#DC2626]/8 rounded-full blur-[180px]" />
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
              <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-[#DC2626] mb-7">
                <span className="w-5 h-[2px] bg-[#DC2626]" />Native Commerce App
              </span>
              <h1 className="text-[clamp(2.8rem,5.5vw,4.8rem)] font-black leading-[1.0] tracking-tight text-white mb-6">
                Reach the world's best shoppers
              </h1>
              <p className="text-gray-400 text-lg font-medium leading-relaxed mb-10 max-w-lg">
                Sell to 250M+ high-intent shoppers on our native app — powered by the world's fastest checkout. Just by joining CommerceHub.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => navigate('/register')} className="px-8 py-4 bg-[#DC2626] text-white font-black rounded-2xl hover:bg-[#B91C1C] active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2 group">
                  Get more customers <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button onClick={() => navigate('/pricing')} className="px-8 py-4 bg-white/[0.06] border border-white/[0.12] text-white font-black rounded-2xl hover:bg-white/[0.12] transition-all text-sm">
                  View pricing
                </button>
              </div>
              {/* Stats row */}
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-5">
                {heroStats.map((s, i) => (
                  <div key={i} className="text-center bg-white/[0.04] rounded-2xl py-4 px-3 border border-white/[0.06]">
                    <p className="text-[#DC2626] font-black text-2xl leading-none mb-1">{s.value}</p>
                    <p className="text-gray-500 text-[10px] font-bold leading-tight">{s.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }} className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl shadow-black/60 border border-white/[0.07]">
                <img src={IMG.phonesArray} alt="Commerce app on multiple phones" className="w-full object-cover" loading="eager" />
              </div>
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9 }}
                className="absolute -top-5 right-6 bg-white text-black rounded-2xl px-5 py-4 shadow-xl z-10">
                <p className="text-[#DC2626] font-black text-2xl leading-none">4.9★</p>
                <p className="text-gray-600 text-xs font-semibold mt-0.5">App Store rating</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </section>

      {/* ── WHY APP IS GOOD FOR BUSINESS ── */}
      <section className="bg-[#0a0a0a] py-28 px-6 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-[#DC2626] mb-5">Why the app is so good for business</span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-5">Sell faster. Sell more. Sell again.</h2>
            <p className="text-gray-400 text-lg font-medium max-w-xl mx-auto leading-relaxed">
              Everything your shoppers love about mobile commerce, built into a single powerful app.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8 items-start">
            {/* Tab list */}
            <div className="flex flex-col gap-3">
              {appFeatures.map((feat) => (
                <button key={feat.id} onClick={() => setActiveFeature(feat.id)}
                  className={`text-left rounded-2xl px-5 py-4 border transition-all ${
                    activeFeature === feat.id ? 'bg-white/[0.08] border-[#DC2626]/50 shadow-lg' : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05]'
                  }`}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                      activeFeature === feat.id ? 'bg-[#DC2626] text-white' : 'bg-white/[0.07] text-gray-400'
                    }`}>{feat.icon}</div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-[#DC2626]">{feat.tag}</p>
                  </div>
                  <p className={`font-black text-base pl-11 ${activeFeature === feat.id ? 'text-white' : 'text-gray-400'}`}>{feat.heading}</p>
                  {/* Progress bar */}
                  {activeFeature === feat.id && (
                    <motion.div className="h-0.5 bg-white/[0.05] mt-3 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-[#DC2626] rounded-full" initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 4, ease: 'linear' }} />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>

            {/* Feature screenshot */}
            <AnimatePresence mode="wait">
              <motion.div key={activeFeature} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                className="sticky top-24 rounded-3xl overflow-hidden border border-white/[0.07] bg-[#111] shadow-2xl">
                <div className="bg-[#1a1a1a] flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]">
                  <span className="w-3 h-3 rounded-full bg-[#DC2626]/70" /><span className="w-3 h-3 rounded-full bg-white/20" /><span className="w-3 h-3 rounded-full bg-white/20" />
                  <div className="ml-3 h-4 w-44 bg-white/[0.04] rounded" />
                </div>
                <img src={current.img} alt={current.heading} className="w-full object-cover max-h-[440px]" loading="lazy" />
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-[#DC2626] text-white flex items-center justify-center shrink-0">{current.icon}</div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#DC2626]">{current.tag}</p>
                  </div>
                  <h3 className="text-white font-black text-2xl mb-3">{current.heading}</h3>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed">{current.desc}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── CUSTOMISE YOUR APP ── */}
      <section className="bg-white py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-[#DC2626] mb-5">Make it yours</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-5">Amp up your brand on the app</h2>
            <p className="text-gray-500 text-base font-medium max-w-xl mx-auto leading-relaxed">
              6 ways to choose exactly how your brand shows up — and converts — on the app.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {customiseFeatures.map((f, i) => (
              <motion.div key={i} {...fadeUp(i * 0.06)} className="group bg-[#f7f7f7] rounded-3xl p-9 hover:bg-[#f0f0f0] hover:-translate-y-1 transition-all">
                <div className="w-11 h-11 rounded-2xl bg-[#DC2626]/10 text-[#DC2626] flex items-center justify-center mb-6 group-hover:bg-[#DC2626] group-hover:text-white transition-all">
                  {f.icon}
                </div>
                <h3 className="text-gray-900 font-black text-lg mb-2.5">{f.heading}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── APP PLATFORM BENEFITS ── */}
      <section className="bg-black py-20 px-6 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {appBenefits.map((b, i) => (
              <motion.div key={i} {...fadeUp(i * 0.07)} className="bg-white/[0.04] border border-white/[0.07] rounded-3xl p-6 text-center">
                <div className="w-10 h-10 rounded-xl bg-[#DC2626]/15 text-[#DC2626] flex items-center justify-center mx-auto mb-4">
                  {b.icon}
                </div>
                <p className="text-white font-black text-3xl mb-1">{b.num}</p>
                <p className="text-gray-500 text-xs font-bold leading-tight">{b.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-[#f7f7f7] py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Loved by brands like yours</h2>
            <p className="text-gray-500 text-base font-medium">The biggest brands and fan-faves are all on the app.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow">
                <div className="flex mb-5">
                  {[...Array(5)].map((_, j) => (<StarIcon key={j} className="w-4 h-4 text-[#DC2626] fill-[#DC2626]" />))}
                </div>
                <blockquote className="text-gray-900 text-xl font-black leading-snug mb-6">"{t.quote}"</blockquote>
                <div>
                  <p className="text-gray-900 font-black text-sm">{t.name}</p>
                  <p className="text-gray-500 text-xs font-medium">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-white py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Common questions</h2>
            <p className="text-gray-500 text-base font-medium">Everything about the CommerceHub native app.</p>
          </motion.div>
          <motion.div {...fadeUp(0.1)} className="bg-white rounded-3xl border border-gray-100 px-8 shadow-sm">
            {faq.map((item, i) => <FaqItem key={i} {...item} />)}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative bg-black py-36 px-6 text-center overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#DC2626]/15 rounded-full blur-[130px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
        <motion.div {...fadeUp()} className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            Tap into 250M+ shoppers today
          </h2>
          <p className="text-gray-400 text-xl font-medium mb-12 leading-relaxed">
            Launch your native app and start converting mobile traffic into loyal customers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/register')} className="px-10 py-5 bg-[#DC2626] text-white font-black rounded-2xl hover:bg-[#B91C1C] transition-all text-sm flex items-center justify-center gap-2 group">
              Start for free <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => navigate('/b2b')} className="px-10 py-5 bg-white text-black font-black rounded-2xl hover:bg-gray-100 transition-all text-sm">
              Explore B2B features
            </button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
