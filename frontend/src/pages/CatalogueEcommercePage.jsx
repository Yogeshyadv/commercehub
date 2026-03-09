import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRightIcon, CheckIcon, ShoppingBagIcon, ZapIcon, SearchIcon,
  SmartphoneIcon, StarIcon, LayoutIcon, GlobeIcon, SparklesIcon,
  ChevronDownIcon, PlayIcon, TrendingUpIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

/* ───────────────────────────────────────── CDN */
const CDN = 'https://cdn.shopify.com/b/shopify-brochure2-assets';
const IMG = {
  checkout:   `${CDN}/50d42025c783062d9932cc40b4dbc876.png`,
  ai:         `${CDN}/27e4cd83b4296c634951aec9deee6a91.png`,
  uptime:     `${CDN}/bb72ac6bae01033e0d9a1723883fc5d4.png`,
  editor:     `${CDN}/7a4eec77108a4be805d703953ac70c30.png`,
  liquid:     `${CDN}/2e07f1679ba8d4c3e7717a75a2e67613.png`,
  speed:      `${CDN}/ea7de41c67f060d0ea79aca7f25f2953.png`,
  collab:     `${CDN}/73baf5efde53894bbe8620b107f5f4c6.png`,
  storefront: `${CDN}/88be45c1ad280aaa06301e64dc9efddc.png`,
  pitch:      `${CDN}/1410e37520422053adfa8b2bed85aef1.png`,
  tinker:     `${CDN}/f531232ca65eb5c5de30fe72c6c24bf1.png`,
  heritage:   `${CDN}/a426ec8c1268225a1d42d1f736748793.jpg`,
  atelier:    `${CDN}/e2854b815a12775485d05c74b0d1beef.jpg`,
  fabric:     `${CDN}/09d6b6af898edbbab263cbf4cd210bbc.png`,
  ritual:     `${CDN}/3c42db66e376e7e488d1e6f629c1404f.jpg`,
  founder:    `${CDN}/b1f157025c97fe3d76e56ffee75fe9a7.jpg`,
};

/* ───────────────────────────────────────── DATA */
const stats = [
  { value: '15%',   label: 'Higher checkout conversion', desc: 'vs. industry benchmark',       icon: TrendingUpIcon },
  { value: '800+',  label: 'Store themes',               desc: 'Professional & customizable',   icon: LayoutIcon },
  { value: '99.9%', label: 'Platform uptime',            desc: 'Enterprise-grade reliability',  icon: ZapIcon },
  { value: '16k+',  label: 'Commerce apps',              desc: 'Extend any workflow',            icon: GlobeIcon },
];

const buildTabs = [
  {
    id: 'liquid',
    label: 'Go Liquid',
    tag: '01 — Low code',
    heading: 'Build fast with Liquid',
    desc: "With Liquid, Shopify's supercharged templating language, you can create a custom store with the exact look and feel you need. Works alongside HTML, CSS, JavaScript, and JSON — so you feel right at home.",
    img: IMG.liquid,
    cta: 'Explore Liquid docs',
  },
  {
    id: 'headless',
    label: 'Go Headless',
    tag: '02 — Full control',
    heading: 'Choose your own stack',
    desc: "Go headless with Hydrogen, Shopify's React-based toolkit. Use our battle-hardened Storefront API — deployed globally at the edge — with no rate limits, for snappy performance worldwide.",
    img: IMG.storefront,
    cta: 'Explore Hydrogen',
  },
];

const features = [
  {
    icon: <ShoppingBagIcon className="w-5 h-5" />,
    heading: "World's best checkout",
    desc: "Shopify's checkout converts 15% better on average than other platforms — more sales, more of the time.",
  },
  {
    icon: <SparklesIcon className="w-5 h-5" />,
    heading: 'Powerful AI at every turn',
    desc: 'Launch your store, manage and scale it — with built-in AI for product descriptions, images, and marketing copy.',
  },
  {
    icon: <PlayIcon className="w-5 h-5" />,
    heading: 'Videos and 3D models',
    desc: 'Help shoppers visualise products with rich media — videos, 3D models, and immersive augmented reality.',
  },
  {
    icon: <SearchIcon className="w-5 h-5" />,
    heading: 'Smart search & filtering',
    desc: 'Give shoppers a fast way to find exactly what they need with auto-suggest, facets, and smart autocomplete.',
  },
  {
    icon: <StarIcon className="w-5 h-5" />,
    heading: 'Product recommendations',
    desc: 'Encourage larger carts with intelligent cross-sell and upsell widgets powered by purchase analytics.',
  },
  {
    icon: <GlobeIcon className="w-5 h-5" />,
    heading: 'Languages & currencies',
    desc: 'Let customers shop in their country, language, and currency with fully localised storefronts.',
  },
  {
    icon: <SmartphoneIcon className="w-5 h-5" />,
    heading: 'Mobile-ready, always',
    desc: 'Every store is fully responsive out of the box — pixel-perfect on any device, from phone to tablet to desktop.',
  },
  {
    icon: <ZapIcon className="w-5 h-5" />,
    heading: 'Cheetah fast & reliable',
    desc: '99.9% uptime with 300 points of presence worldwide so your store never lets a customer down.',
  },
];

const themes = [
  { name: 'Pitch', desc: 'Bold layouts, bright visuals', img: IMG.pitch },
  { name: 'Tinker', desc: 'Clean, modern functionality', img: IMG.tinker },
  { name: 'Heritage', desc: 'Craftsmanship, authenticity', img: IMG.heritage },
  { name: 'Atelier', desc: 'Sleek, luxurious showcases', img: IMG.atelier },
  { name: 'Fabric', desc: 'Minimalist, lifestyle media', img: IMG.fabric },
  { name: 'Ritual', desc: 'Fashion-forward, refined', img: IMG.ritual },
];

const faq = [
  { q: 'What is catalogue e-commerce?', a: 'Catalogue e-commerce lets you showcase your full product range online — with pricing, variants, rich descriptions, images, and an instant checkout flow — turning browsers into buyers.' },
  { q: 'How quickly can I launch?', a: 'With a pre-built theme and our guided setup, you can launch your store in hours. Our AI tools can auto-generate product descriptions, brand copy, and store designs.' },
  { q: 'Can I sell across multiple channels?', a: 'Yes — your catalogue syncs seamlessly with social shops, marketplaces, wholesale portals, and in-person POS. One inventory, everywhere you sell.' },
  { q: 'Do I need coding experience?', a: 'Not at all. Our drag-and-drop editor and no-code theme customiser let anyone build a beautiful store. Developers can extend everything via Liquid or our APIs.' },
  { q: 'What payment methods are supported?', a: 'CommerceHub supports 100+ payment gateways — from Shopify Payments and PayPal to Stripe and regional providers worldwide. BNPL, wallets, and crypto all supported.' },
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
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28 }}
            className="overflow-hidden"
          >
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
export default function CatalogueEcommercePage() {
  const navigate = useNavigate();
  const [buildTab, setBuildTab] = useState('liquid');
  const [activeTheme, setActiveTheme] = useState(0);
  const bt = buildTabs.find(t => t.id === buildTab);

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative bg-black text-white pt-36 pb-0 px-6 overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[580px] bg-[#DC2626]/10 rounded-full blur-[160px]" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-[#DC2626] mb-7">
              <span className="w-5 h-[2px] bg-[#DC2626]" />Catalogue E-commerce
            </span>
            <h1 className="text-[clamp(2.8rem,5.5vw,4.8rem)] font-black leading-[1.0] tracking-tight text-white mb-6">
              The world's best online stores start here
            </h1>
            <p className="text-gray-400 text-lg font-medium leading-relaxed mb-10 max-w-lg">
              Showcase your catalogue, convert browsers into buyers, and sell everywhere — with the most powerful commerce platform on the planet.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => navigate('/register')} className="px-8 py-4 bg-[#DC2626] text-white font-black rounded-2xl hover:bg-[#B91C1C] active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2 group">
                Start for free <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate('/pricing')} className="px-8 py-4 bg-white/[0.06] border border-white/[0.12] text-white font-black rounded-2xl hover:bg-white/[0.12] active:scale-[0.98] transition-all text-sm">
                View pricing
              </button>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }} className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl shadow-black/60 border border-white/[0.07]">
              {/* Browser chrome */}
              <div className="bg-[#1a1a1a] flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]">
                <span className="w-3 h-3 rounded-full bg-[#DC2626]/70" />
                <span className="w-3 h-3 rounded-full bg-white/20" />
                <span className="w-3 h-3 rounded-full bg-white/20" />
                <div className="ml-3 h-5 flex-1 bg-white/[0.04] rounded" />
              </div>
              <img src={IMG.checkout} alt="Checkout experience" className="w-full object-cover" loading="eager" />
            </div>
            {/* Floating badges */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }}
              className="absolute -top-4 -right-4 bg-[#DC2626] text-white rounded-2xl px-5 py-4 shadow-xl z-10">
              <p className="font-black text-2xl leading-none">15%</p>
              <p className="text-white/80 text-xs font-semibold mt-0.5">Better conversion</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9 }}
              className="absolute -bottom-4 -left-4 bg-white text-black rounded-2xl px-5 py-4 shadow-xl z-10">
              <p className="font-black text-2xl leading-none text-[#DC2626]">800+</p>
              <p className="text-gray-600 text-xs font-semibold mt-0.5">Store themes</p>
            </motion.div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </section>

      {/* ── STATS BAR ── */}
      <section className="relative bg-gradient-to-b from-[#0a0a0a] to-black overflow-hidden border-y border-white/[0.05]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(220,38,38,0.06),transparent)]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#DC2626]/60 to-transparent" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={i} {...fadeUp(i * 0.1)}
                  className="group relative flex flex-col items-center text-center px-6 py-12 rounded-2xl hover:bg-white/[0.03] transition-all duration-300">
                  {i > 0 && (
                    <div className="hidden lg:block absolute left-0 inset-y-10 w-px bg-gradient-to-b from-transparent via-white/[0.07] to-transparent" />
                  )}
                  <div className="mb-5 relative w-12 h-12">
                    <div className="absolute -inset-3 rounded-3xl bg-[#DC2626]/15 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative w-full h-full bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-2xl flex items-center justify-center group-hover:border-[#DC2626]/50 group-hover:bg-[#DC2626]/15 transition-all duration-300">
                      <Icon className="w-5 h-5 text-[#DC2626]" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-white text-3xl md:text-4xl font-black leading-none tracking-tight group-hover:text-[#DC2626] transition-colors duration-300">{s.value}</p>
                  </div>
                  <p className="text-gray-300 text-sm font-bold mb-1">{s.label}</p>
                  <p className="text-gray-600 text-xs font-medium">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── BUILD OPTIONS TABS ── */}
      <section className="bg-black py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="mb-14">
            <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-[#DC2626] mb-5">How you want to build</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight max-w-2xl">
              Choose your path to a perfect store
            </h2>
          </motion.div>
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
            <div className="flex flex-col gap-3">
              {buildTabs.map(tab => (
                <motion.button key={tab.id} {...fadeUp(0.1)} onClick={() => setBuildTab(tab.id)}
                  className={`text-left rounded-2xl px-6 py-5 border transition-all ${
                    buildTab === tab.id ? 'bg-white/[0.08] border-[#DC2626]/50 shadow-lg' : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05]'
                  }`}>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#DC2626] mb-1">{tab.tag}</p>
                  <p className={`font-black text-lg ${buildTab === tab.id ? 'text-white' : 'text-gray-400'}`}>{tab.label}</p>
                  {buildTab === tab.id && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-400 text-xs font-medium mt-2 leading-relaxed">{tab.desc}</motion.p>
                  )}
                </motion.button>
              ))}
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={buildTab} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.4 }}
                className="rounded-3xl overflow-hidden border border-white/[0.07] bg-[#111] shadow-2xl">
                <div className="bg-[#1a1a1a] flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]">
                  <span className="w-3 h-3 rounded-full bg-[#DC2626]/70" /><span className="w-3 h-3 rounded-full bg-white/20" /><span className="w-3 h-3 rounded-full bg-white/20" />
                  <div className="ml-3 h-4 flex-1 bg-white/[0.04] rounded" />
                </div>
                <img src={bt.img} alt={bt.heading} className="w-full object-cover max-h-[460px]" loading="lazy" />
                <div className="p-8">
                  <h3 className="text-white font-black text-2xl mb-3">{bt.heading}</h3>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed mb-6">{bt.desc}</p>
                  <button className="inline-flex items-center gap-2 text-[#DC2626] font-black text-sm group">
                    {bt.cta} <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ── FEATURE GRID ── */}
      <section className="bg-[#f7f7f7] py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-[#DC2626] mb-5">Built into every store</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4">Everything you need, out of the box</h2>
            <p className="text-gray-500 text-lg font-medium max-w-xl mx-auto">No plugins, no cobbled-together tools — just one cohesive platform built for commerce.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <motion.div key={i} {...fadeUp(i * 0.05)} className="group bg-white rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100">
                <div className="w-11 h-11 rounded-2xl bg-[#DC2626]/10 text-[#DC2626] flex items-center justify-center mb-6 group-hover:bg-[#DC2626] group-hover:text-white transition-all">
                  {f.icon}
                </div>
                <h3 className="text-gray-900 font-black text-base mb-2.5">{f.heading}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SHOWCASE: AI + UPTIME ── */}
      <section className="bg-black py-28 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          {[
            { img: IMG.ai, tag: 'AI-Powered', heading: 'Powerful AI at every turn', desc: "From launching your store to managing and scaling it, boost every part of your business with built-in AI that's made for commerce.", cta: 'Explore Shopify Magic' },
            { img: IMG.uptime, tag: 'Infrastructure', heading: 'Cheetah fast. Ridiculously reliable.', desc: 'With a 99.9% uptime rate and 300 points of presence worldwide, our infrastructure won\'t leave your customers hanging — even on your biggest sales days.', cta: 'Learn about our platform' },
          ].map((item, i) => (
            <motion.div key={i} {...fadeUp(i * 0.1)} className="rounded-3xl overflow-hidden border border-white/[0.07] bg-[#111] group hover:border-[#DC2626]/30 transition-all">
              <img src={item.img} alt={item.heading} className="w-full object-cover max-h-[280px] group-hover:scale-[1.02] transition-transform duration-500" loading="lazy" />
              <div className="p-8">
                <span className="inline-block bg-[#DC2626]/15 text-[#DC2626] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4">{item.tag}</span>
                <h3 className="text-white font-black text-xl mb-3">{item.heading}</h3>
                <p className="text-gray-400 text-sm font-medium leading-relaxed mb-5">{item.desc}</p>
                <button className="inline-flex items-center gap-2 text-[#DC2626] font-black text-sm group/btn">
                  {item.cta} <ArrowRightIcon className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── THEMES SHOWCASE ── */}
      <section className="bg-white py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
            <div>
              <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-[#DC2626] mb-5">Creativity meets commerce</span>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight">Pick your perfect theme</h2>
              <p className="text-gray-500 text-base font-medium mt-4 max-w-lg leading-relaxed">
                Choose from 800+ proven themes, then customize with our easy-to-use visual editor — no coding required.
              </p>
            </div>
            <button onClick={() => navigate('/register')} className="shrink-0 px-7 py-4 bg-black text-white font-black text-sm rounded-2xl hover:bg-gray-900 transition-all flex items-center gap-2 group">
              Browse all themes <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {themes.map((t, i) => (
              <button key={i} onClick={() => setActiveTheme(i)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold border transition-all ${
                  activeTheme === i ? 'bg-black text-white border-black' : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-900'
                }`}>
                {t.name}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={activeTheme} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.35 }}
              className="rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
              <div className="bg-[#f5f5f5] flex items-center gap-2 px-5 py-3.5 border-b border-gray-200">
                <span className="w-3 h-3 rounded-full bg-[#DC2626]/60" /><span className="w-3 h-3 rounded-full bg-gray-300" /><span className="w-3 h-3 rounded-full bg-gray-300" />
                <div className="ml-3 h-4 w-48 bg-gray-200 rounded" />
              </div>
              <div className="relative">
                <img src={themes[activeTheme].img} alt={themes[activeTheme].name} className="w-full object-cover max-h-[520px] object-top" loading="lazy" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
                  <h3 className="text-white font-black text-2xl">{themes[activeTheme].name}</h3>
                  <p className="text-white/70 text-sm font-medium">{themes[activeTheme].desc}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── TESTIMONIAL ── */}
      <section className="bg-black py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="rounded-3xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
            <div className="relative min-h-[300px] md:min-h-0">
              <img src={IMG.founder} alt="OffLimits — Emily Miller" className="w-full h-full object-cover" loading="lazy" />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20 md:bg-gradient-to-r md:from-transparent md:to-black/30" />
            </div>
            <div className="bg-white p-12 flex flex-col justify-center">
              <div className="flex mb-5">
                {[...Array(5)].map((_, i) => (<StarIcon key={i} className="w-5 h-5 text-[#DC2626] fill-[#DC2626]" />))}
              </div>
              <blockquote className="text-2xl font-black text-gray-900 leading-snug mb-6">
                "CommerceHub allowed us to build the most playful customer experiences while maintaining complete control of our development process."
              </blockquote>
              <div>
                <p className="text-gray-900 font-black">Emily Miller</p>
                <p className="text-gray-500 text-sm font-medium">CEO &amp; Founder, OffLimits Cereal</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-white py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Common questions</h2>
            <p className="text-gray-500 text-base font-medium">Everything you need to know about catalogue e-commerce on CommerceHub.</p>
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
            Ready to build your catalogue?
          </h2>
          <p className="text-gray-400 text-xl font-medium mb-12 leading-relaxed">
            Join millions of merchants who sell more with CommerceHub.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/register')} className="px-10 py-5 bg-[#DC2626] text-white font-black rounded-2xl hover:bg-[#B91C1C] transition-all text-sm flex items-center justify-center gap-2 group">
              Start for free <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => navigate('/pricing')} className="px-10 py-5 bg-white text-black font-black rounded-2xl hover:bg-gray-100 transition-all text-sm">
              View pricing
            </button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
