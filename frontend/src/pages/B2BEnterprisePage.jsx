import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRightIcon, CheckIcon, ChevronDownIcon, ChevronLeftIcon, ChevronRightIcon,
  ZapIcon, UsersIcon, BarChart2Icon, ShieldCheckIcon, LayersIcon, CodeIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

/* ─────────────────────────────────────────
   CDN CONSTANTS
───────────────────────────────────────── */
const CDN = 'https://cdn.shopify.com/b/shopify-brochure2-assets';

/* ─────────────────────────────────────────
   ASSETS
───────────────────────────────────────── */
const heroImg      = `${CDN}/73c03f454eff3abe3013bbbbc9b82501.png`;
const storefrontImg= `${CDN}/f9390182b37cab5910307e399a6a69d6.webp`;
const volumeImg    = `${CDN}/862647fb70323fa4084102359da26a95.webp`;
const variantImg   = `${CDN}/a887e144dd7d29e316c4add7f934e236.webp`;
const techStackImg = `${CDN}/b8fa2d372bb0994b0a8b4a26aab3d0a7.webp`;
const analystImg   = `${CDN}/ca127c8ace6e88cd56b2ee2a3a60e77e.webp`;
const brooklinenImg= `${CDN}/9c8a7be9c55bd11d1d75af682a4fbbda.webp`;

const brandLogos = [
  { name: 'Lulu and Georgia', src: `${CDN}/6adaead8fd2011447482b89ed109223e.svg` },
  { name: 'Brooklinen',       src: `${CDN}/2afdce3e8ce33e71ae84093645b6987a.svg` },
  { name: 'Who Gives a Crap', src: `${CDN}/90b58d8318e9ba7f8081e0a40df1d4e9.svg` },
  { name: 'YOUFOODZ',         src: `${CDN}/692a08cb29a26ddd0929ebd9748cee96.svg` },
  { name: 'Laura Mercier',    src: `${CDN}/769a74ae1d8bfdccaa088377c8dd2995.svg` },
];

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const buyerJourneyTabs = [
  {
    id: 'cater',
    label: 'Cater to every customer',
    heading: 'Cater to the needs of every customer',
    desc: "Represent companies with multiple buyers and locations, and manage purchasing permissions with ease. Offer an end-to-end experience with tailored pricing and product publishing, quantity rules, and payment terms.",
    img: storefrontImg,
  },
  {
    id: 'design',
    label: 'Design storefronts',
    heading: 'Design powerful storefront experiences',
    desc: "Personalise content for each B2B and B2C buyer with out-of-the-box themes, flexible Liquid-based customisations, or headless storefronts for complete control using our APIs — the choice is yours.",
    img: volumeImg,
  },
  {
    id: 'selfserve',
    label: 'Self-serve purchasing',
    heading: 'Delight customers with self-serve purchasing',
    desc: "Customers can easily place orders and manage their own accounts using an intuitive and customisable portal, increasing sales and margins.",
    img: variantImg,
  },
  {
    id: 'salesreps',
    label: 'Supercharge sales reps',
    heading: 'Supercharge sales reps',
    desc: "Unlock your sales team's ability to support their assigned customers, take their orders, and drive revenue with unique staff permissions.",
    img: storefrontImg,
  },
];

const speedCards = [
  {
    icon: <ZapIcon className="w-6 h-6" />,
    tag: 'Launch',
    heading: 'Fastest time to launch',
    desc: 'Go from zero to orders in weeks, not months, thanks to our globally scaled and composable platform for rapid innovation.',
  },
  {
    icon: <CodeIcon className="w-6 h-6" />,
    tag: 'Developer',
    heading: 'Loved by developers',
    desc: 'With incredible API breadth, powerful CLI, and an app model for building and deploying, CommerceHub is a go-to choice for developers.',
  },
  {
    icon: <LayersIcon className="w-6 h-6" />,
    tag: 'Unified',
    heading: 'B2B and B2C, in one place',
    desc: 'Run your B2B and B2C from a single platform to enhance brand consistency, streamline operations, and cut tech debt.',
  },
];

const featureCategories = [
  {
    label: 'Customised buying experience',
    desc: 'Personalise your storefront and checkout for each customer.',
    icon: <UsersIcon className="w-5 h-5" />,
    items: [
      { name: 'Company profiles', desc: 'Represent multiple buyers and locations with unique permission levels, payment terms, tax exemptions, and payment methods.' },
      { name: 'Customer-specific catalogs', badge: 'NEW', desc: 'Offer a curated buying experience with product catalogs assigned to a specific buyer or location.' },
      { name: 'Quantity rules', desc: 'Create customer-specific conditional rules for products and variants, including minimums and maximums, case packs, and increments.' },
      { name: 'Volume pricing', desc: 'Easily implement quantity price breaks to get your B2B customers buying in larger quantities.' },
      { name: 'Store personalisation', badge: 'NEW', desc: 'Optimise the experience for B2B customers by surfacing relevant content to the right audience in one store.' },
      { name: 'Headless storefronts', badge: 'NEW', desc: 'Gain total control over your buyer experience with CommerceHub APIs and developer tools along with your tech stack.' },
      { name: 'Custom B2B solutions', desc: 'Build the solution your business needs with our suite of B2B APIs and compatible apps.' },
    ],
  },
  {
    label: 'Optimised workflows',
    desc: 'Modernise your operations with powerful automation tools to streamline processes across all your brands and sites.',
    icon: <ZapIcon className="w-5 h-5" />,
    items: [
      { name: 'Workflow automations', badge: 'NEW', desc: 'CommerceHub Flow now does more for B2B with support for companies and company locations, so you can assign terms, send invoices, and more.' },
      { name: 'Company account requests', badge: 'NEW', desc: 'Using CommerceHub Forms, add an account request form to your store. Buyer information is automatically saved as a company so they can buy wholesale as soon as you approve.' },
      { name: 'Sales rep permissions', badge: 'NEW', desc: 'Add sales reps as staff in the admin with the permissions they need to only access assigned customers and place orders on their behalf.' },
      { name: 'Checkout to draft', desc: 'Simplify workflows and quotes with the ability to submit for review on your online store and approve before fulfilling.' },
      { name: 'B2B optimised theme', badge: 'NEW', desc: 'Accelerate your store setup with an out-of-the-box theme specifically designed for wholesale, and pre-built with advanced B2B features.' },
      { name: 'PO numbers', desc: 'Capture PO numbers on orders and at checkout, which are then visible in the admin, within customer accounts, and on the Orders API.' },
    ],
  },
  {
    label: 'Self-serve purchasing',
    desc: 'Scale your operations with online buyer purchasing and order tracking for hands-off account management.',
    icon: <BarChart2Icon className="w-5 h-5" />,
    items: [
      { name: 'Quick bulk ordering', badge: 'NEW', desc: 'Show buyers a list of all products and variants so they can easily order sizes, colors, and more from product pages or a separate order form.' },
      { name: 'Flexible payment options', desc: 'Streamline the order process with payment terms and the ability to send invoices for payment.' },
      { name: 'Easy reordering', desc: 'Encourage repeat orders by making it easy for buyers to reorder past purchases right from their customer account.' },
      { name: 'Vaulted credit cards', desc: 'Speed up payment by securely storing customer credit cards on file for use at checkout, on draft orders, and when paying invoices.' },
      { name: 'PayPal payments', badge: 'NEW', desc: 'B2B customers can now pay for orders and invoices with PayPal, with their payments automatically reconciled in the admin.' },
      { name: 'Custom discounts', badge: 'NEW', desc: 'Offer promotional discounts on top of wholesale prices, tailored to your B2B buyers.' },
    ],
  },
];

const whyUs = [
  {
    icon: <ShieldCheckIcon className="w-6 h-6" />,
    heading: 'Enterprise support',
    desc: 'Count on 300+ hours of technical launch inquiries and onsite activities.',
  },
  {
    icon: <BarChart2Icon className="w-6 h-6" />,
    heading: 'Boundless scalability',
    desc: 'With 20× admin API rate limits, you never have to worry about hitting the ceiling.',
  },
  {
    icon: <UsersIcon className="w-6 h-6" />,
    heading: 'Partner ecosystem',
    desc: 'Get the perfect solutions that differentiate you through our large partner agency and SI network.',
  },
];

/* ─────────────────────────────────────────
   CONTACT MODAL
───────────────────────────────────────── */
function ContactModal({ onClose }) {
  const [form, setForm] = useState({ name: '', company: '', email: '', message: '' });
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));
  const cls = 'w-full px-4 py-3.5 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white placeholder-gray-600 focus:outline-none focus:border-[#DC2626] transition-all text-sm font-medium';
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className="bg-[#0f0f0f] border border-white/[0.09] rounded-3xl p-8 w-full max-w-lg shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-white font-black text-2xl mb-1">Get in touch</h3>
        <p className="text-gray-500 text-sm font-medium mb-7">Our B2B team will reach out within 1 business day.</p>
        <div className="space-y-3">
          <input placeholder="Full name" value={form.name} onChange={set('name')} className={cls} />
          <input placeholder="Company name" value={form.company} onChange={set('company')} className={cls} />
          <input type="email" placeholder="Work email" value={form.email} onChange={set('email')} className={cls} />
          <textarea placeholder="Tell us about your B2B needs..." value={form.message} onChange={set('message')} rows={4} className={`${cls} resize-none`} />
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-3.5 rounded-xl border border-white/[0.1] text-gray-400 font-bold text-sm hover:border-white/30 hover:text-white transition-all">Cancel</button>
          <button onClick={onClose} className="flex-1 py-3.5 rounded-xl bg-[#DC2626] text-white font-bold text-sm hover:bg-[#B91C1C] active:scale-95 transition-all">Submit</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─────────────────────────────────────────
   FEATURE ACCORDION CATEGORY
───────────────────────────────────────── */
function FeatureCat({ cat, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  const [active, setActive] = useState(0);
  return (
    <div className="border-b border-white/[0.07] last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-6 group text-left"
      >
        <div className="flex items-center gap-4">
          <span className="w-10 h-10 rounded-xl bg-[#DC2626]/15 text-[#DC2626] flex items-center justify-center shrink-0 group-hover:bg-[#DC2626] group-hover:text-white transition-all">
            {cat.icon}
          </span>
          <div>
            <p className="text-white font-black text-lg">{cat.label}</p>
            {open && <p className="text-gray-400 text-sm font-medium mt-0.5">{cat.desc}</p>}
          </div>
        </div>
        <ChevronDownIcon className={`w-5 h-5 text-gray-500 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="pb-6 grid grid-cols-1 md:grid-cols-2 gap-3">
              {cat.items.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => setActive(i)}
                  className={`rounded-2xl p-5 cursor-pointer border transition-all ${
                    active === i
                      ? 'bg-white/[0.07] border-[#DC2626]/40'
                      : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.10]'
                  }`}
                >
                  <div className="flex items-start gap-2 mb-2">
                    <p className="text-white font-bold text-sm flex-1">{item.name}</p>
                    {item.badge && (
                      <span className="bg-[#DC2626] text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-xs font-medium leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function B2BEnterprisePage() {
  const navigate = useNavigate();
  const [showContact, setShowContact] = useState(false);
  const [activeTab, setActiveTab] = useState('cater');
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroImgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  const currentTab = buyerJourneyTabs.find(t => t.id === activeTab);

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
  });

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <Navbar />
      <AnimatePresence>{showContact && <ContactModal onClose={() => setShowContact(false)} />}</AnimatePresence>

      {/* ══════════════════════════════════════
          1. HERO
      ══════════════════════════════════════ */}
      <section ref={heroRef} className="relative bg-black text-white pt-36 pb-0 px-6 overflow-hidden">
        {/* Background radial glow */}
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#DC2626]/10 rounded-full blur-[160px]" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left text */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-[#DC2626] mb-8">
              <span className="w-6 h-[2px] bg-[#DC2626]" />
              B2B for Enterprise
            </span>
            <h1 className="text-[clamp(2.6rem,5.5vw,4.5rem)] font-black leading-[1.0] tracking-[-0.02em] text-white mb-6">
              Transform your wholesale commerce, delight your customers
            </h1>
            <p className="text-gray-400 text-lg font-medium leading-relaxed mb-10 max-w-lg">
              Design your B2B buying experiences on a customisable platform backed by the best-converting checkout.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowContact(true)}
                className="px-8 py-4 bg-white text-black font-black rounded-2xl hover:bg-gray-100 active:scale-[0.98] transition-all text-sm tracking-wide"
              >
                Get in touch
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-[#DC2626] text-white font-black rounded-2xl hover:bg-[#B91C1C] active:scale-[0.98] transition-all text-sm tracking-wide flex items-center gap-2 group"
              >
                Try for free <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Brand logos */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6, duration: 0.8 }} className="mt-14 border-t border-white/[0.08] pt-8">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-600 mb-6">Trusted by leading brands</p>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-5">
                {brandLogos.map(b => (
                  <img key={b.name} src={b.src} alt={b.name} loading="lazy"
                    className="h-6 opacity-40 brightness-0 invert hover:opacity-80 transition-all duration-300 object-contain" />
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Right — hero image with parallax */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="relative"
          >
            <motion.div style={{ y: heroImgY }} className="relative">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 pointer-events-none rounded-2xl" />
              <img
                src={heroImg}
                alt="B2B storefront experience"
                className="w-full rounded-2xl shadow-2xl shadow-black/60"
                loading="eager"
              />
            </motion.div>
            {/* Floating stat chip */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl px-5 py-4 z-20"
            >
              <p className="text-[#DC2626] font-black text-2xl leading-none mb-0.5">36%</p>
              <p className="text-gray-600 text-xs font-semibold">Better checkout conversion</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute -top-4 -right-4 bg-[#DC2626] rounded-2xl shadow-xl px-5 py-4 z-20"
            >
              <p className="text-white font-black text-2xl leading-none mb-0.5">200+</p>
              <p className="text-white/80 text-xs font-semibold">B2B features built-in</p>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </section>

      {/* ══════════════════════════════════════
          2. VALUE PROPS — three cards on white
      ══════════════════════════════════════ */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                num: '01',
                heading: 'Create customised buyer experiences',
                desc: 'Wholesale tailored to every customer with curated catalogs, personalised storefronts, flexible payment terms, and a customisable self-serve portal.',
              },
              {
                num: '02',
                heading: 'Bring all your tech together',
                desc: 'CommerceHub integrates with your ERPs and existing tech stack, giving you the power to create your own custom solutions.',
              },
              {
                num: '03',
                heading: 'Save time, reduce costs',
                desc: 'A powerful platform that lets you run your B2B and B2C business from one admin, and even one store, at a fraction of the cost.',
              },
            ].map((card, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.1)}
                className="group relative bg-[#f7f7f7] rounded-3xl p-9 hover:bg-[#f0f0f0] transition-colors overflow-hidden"
              >
                <span className="text-[80px] font-black leading-none text-gray-100 group-hover:text-gray-200 transition-colors absolute -right-3 -top-3 select-none">
                  {card.num}
                </span>
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-[#DC2626] flex items-center justify-center mb-7">
                    <CheckIcon className="w-5 h-5 text-white" strokeWidth={3} />
                  </div>
                  <h3 className="text-gray-900 font-black text-xl mb-4 leading-snug">{card.heading}</h3>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          3. SELLING B2B — tabbed screenshot viewer
      ══════════════════════════════════════ */}
      <section className="bg-black py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="mb-14">
            <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-[#DC2626] mb-5">Selling B2B</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight max-w-2xl">
              Exceptional buyer journey
            </h2>
            <p className="text-gray-400 text-lg font-medium mt-5 max-w-xl leading-relaxed">
              Create best-in-class wholesale experiences with powerful B2B features built directly into our core.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-8 items-start">
            {/* Tab list */}
            <div className="flex flex-col gap-2">
              {buyerJourneyTabs.map((tab, i) => (
                <motion.button
                  key={tab.id}
                  {...fadeUp(i * 0.07)}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left rounded-2xl px-5 py-4 transition-all border ${
                    activeTab === tab.id
                      ? 'bg-white/[0.08] border-[#DC2626]/50 shadow-lg shadow-[#DC2626]/10'
                      : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full shrink-0 transition-colors ${
                      activeTab === tab.id ? 'bg-[#DC2626]' : 'bg-white/20'
                    }`} />
                    <p className={`font-bold text-sm ${activeTab === tab.id ? 'text-white' : 'text-gray-400'}`}>
                      {tab.label}
                    </p>
                  </div>
                  {activeTab === tab.id && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="text-gray-400 text-xs font-medium leading-relaxed mt-3 pl-5"
                    >
                      {currentTab.desc}
                    </motion.p>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Screenshot */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
                className="sticky top-24 rounded-3xl overflow-hidden border border-white/[0.07] shadow-2xl bg-[#111]"
              >
                {/* Browser chrome */}
                <div className="bg-[#1a1a1a] px-5 py-3.5 flex items-center gap-2 border-b border-white/[0.06]">
                  <span className="w-3 h-3 rounded-full bg-[#DC2626]/70" />
                  <span className="w-3 h-3 rounded-full bg-white/20" />
                  <span className="w-3 h-3 rounded-full bg-white/20" />
                  <div className="ml-3 flex-1 h-5 bg-white/[0.04] rounded" />
                </div>
                <img
                  src={currentTab.img}
                  alt={currentTab.heading}
                  className="w-full object-cover"
                  style={{ maxHeight: '520px' }}
                  loading="lazy"
                />
                {/* Overlay heading */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8 pointer-events-none">
                  <h3 className="text-white font-black text-xl">{currentTab.heading}</h3>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          4. WHOLESALE OPERATIONS — 2-col with screenshot
      ══════════════════════════════════════ */}
      <section className="bg-[#f5f5f5] py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-[#DC2626] mb-5">Wholesale Operations</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight">
              Total control over your tech stack
            </h2>
            <p className="text-gray-500 text-lg font-medium mt-5 leading-relaxed">
              Integrate your existing commerce tech stack with as much or little of our platform as you need.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            {/* Left content */}
            <motion.div {...fadeUp()} className="space-y-8">
              {[
                {
                  heading: 'Integrations done seamlessly',
                  desc: 'Connect your CMS, OMS, ERP, and more to sync your content, orders, and inventory with robust integrations from leading partners like Acumatica, Microsoft Dynamics 365, Celigo, and more.',
                },
                {
                  heading: 'Powerful features at your fingertips',
                  desc: 'Access proven B2C features transformed for B2B including product bundles and promotions, workflow automation, and the largest app ecosystem in commerce.',
                },
                {
                  heading: 'Infinite customisation and flexibility',
                  desc: 'Go beyond headless storefronts with a fully extensible checkout and customer account portal, paired with custom data using metafields, and custom business logic using CommerceHub Functions.',
                },
              ].map((item, i) => (
                <motion.div key={i} {...fadeUp(i * 0.1)} className="flex gap-5">
                  <div className="w-8 h-8 rounded-xl bg-[#DC2626] flex items-center justify-center shrink-0 mt-1">
                    <CheckIcon className="w-4 h-4 text-white" strokeWidth={3} />
                  </div>
                  <div>
                    <h3 className="text-gray-900 font-black text-lg mb-2">{item.heading}</h3>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Right — tech stack image */}
            <motion.div {...fadeUp(0.15)} className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl">
                <img src={techStackImg} alt="Tech stack integration" className="w-full object-cover" loading="lazy" />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-4 -right-4 bg-black text-white rounded-2xl px-5 py-4 shadow-xl">
                <p className="font-black text-white text-sm">1,000+ integrations</p>
                <p className="text-gray-400 text-xs font-medium mt-0.5">App ecosystem</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          5. SPEED & EFFICIENCY
      ══════════════════════════════════════ */}
      <section className="bg-black py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="mb-16">
            <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-[#DC2626] mb-5">Speed and Efficiency</span>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight max-w-2xl">
                B2B commerce, designed for velocity
              </h2>
              <p className="text-gray-400 text-base font-medium max-w-sm leading-relaxed">
                Business moves fast — don't let outdated tech slow you down.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {speedCards.map((card, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.1)}
                className="group relative bg-white/[0.03] border border-white/[0.07] rounded-3xl p-9 hover:border-[#DC2626]/40 hover:bg-white/[0.05] transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#DC2626]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-[#DC2626]/15 text-[#DC2626] flex items-center justify-center mb-6 group-hover:bg-[#DC2626] group-hover:text-white transition-all">
                    {card.icon}
                  </div>
                  <span className="inline-block bg-white/[0.07] text-gray-400 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4">
                    {card.tag}
                  </span>
                  <h3 className="text-white font-black text-xl mb-3">{card.heading}</h3>
                  <p className="text-gray-500 text-sm font-medium leading-relaxed">{card.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          6. B2B FEATURES — accordion
      ══════════════════════════════════════ */}
      <section className="bg-[#0a0a0a] py-28 px-6 border-t border-white/[0.05]">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-[#DC2626] mb-5">B2B Features</span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-5">
              Enterprise wholesale features<br className="hidden md:block" /> built right into the core
            </h2>
            <p className="text-gray-400 text-lg font-medium max-w-xl mx-auto leading-relaxed">
              Everything you need to run a world-class wholesale operation, out of the box.
            </p>
          </motion.div>

          <motion.div {...fadeUp(0.1)} className="space-y-0">
            {featureCategories.map((cat, i) => (
              <FeatureCat key={i} cat={cat} defaultOpen={i === 0} />
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          7. CASE STUDY — Brooklinen
      ══════════════════════════════════════ */}
      <section className="bg-black py-0 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            {...fadeUp()}
            className="rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 min-h-[500px]"
          >
            {/* Image side */}
            <div className="relative overflow-hidden min-h-[360px] lg:min-h-0">
              <img
                src={brooklinenImg}
                alt="Brooklinen premium bedding"
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-black/0 lg:bg-gradient-to-r lg:from-transparent lg:to-black/10" />
            </div>

            {/* Content side */}
            <div className="bg-white p-12 lg:p-16 flex flex-col justify-center">
              <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-[#DC2626] mb-8">Case Study</span>
              <blockquote className="text-2xl md:text-3xl font-black text-gray-900 leading-snug mb-8">
                "Our B2B process was manual and time consuming. In order to scale, we needed an easier way to cater to these B2B customers. That's where B2B on CommerceHub comes in."
              </blockquote>
              <div className="flex items-center gap-4 mb-8">
                <div>
                  <p className="text-gray-900 font-black text-base">Kelly Hallinan</p>
                  <p className="text-gray-500 text-sm font-medium">SVP, Emerging Channels — Brooklinen</p>
                </div>
              </div>
              <button className="self-start flex items-center gap-2 text-[#DC2626] font-black text-sm group">
                Read case study <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          8. WHY COMMERCEHUB
      ══════════════════════════════════════ */}
      <section className="bg-white py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="mb-16">
            <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-[#DC2626] mb-5">Why CommerceHub</span>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 leading-tight max-w-2xl">
                Built to streamline enterprise complexity
              </h2>
              <p className="text-gray-500 text-base font-medium max-w-sm leading-relaxed">
                With 20+ years of commerce expertise, fast-growing B2B businesses trust CommerceHub.
              </p>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-16">
            {whyUs.map((item, i) => (
              <motion.div
                key={i}
                {...fadeUp(i * 0.1)}
                className="group bg-[#f7f7f7] rounded-3xl p-9 hover:bg-[#f0f0f0] transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#DC2626]/10 text-[#DC2626] flex items-center justify-center mb-7 group-hover:bg-[#DC2626] group-hover:text-white transition-all">
                  {item.icon}
                </div>
                <h3 className="text-gray-900 font-black text-xl mb-3">{item.heading}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Analyst recognition */}
          <motion.div {...fadeUp(0.1)} className="bg-black rounded-3xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
              <div className="p-12 lg:p-16">
                <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-[#DC2626] mb-5">Trusted by industry leaders</span>
                <h3 className="text-3xl md:text-4xl font-black text-white leading-tight mb-5">
                  A recognised B2B commerce leader
                </h3>
                <p className="text-gray-400 text-base font-medium leading-relaxed mb-8">
                  CommerceHub has helped leading businesses find their path to success, recognised by Forrester, IDC, Gartner, and G2 Crowd.
                </p>
                <button
                  onClick={() => setShowContact(true)}
                  className="inline-flex items-center gap-2 bg-[#DC2626] text-white font-black text-sm px-7 py-4 rounded-2xl hover:bg-[#B91C1C] active:scale-[0.98] transition-all group"
                >
                  Get in touch <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="p-12 lg:pr-16 flex items-center justify-center">
                <img
                  src={analystImg}
                  alt="Analyst recognition — Forrester, IDC, Gartner, G2 Crowd"
                  className="w-full max-w-md object-contain"
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          9. FINAL CTA
      ══════════════════════════════════════ */}
      <section className="relative bg-black py-36 px-6 text-center overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#DC2626]/16 rounded-full blur-[130px]" />

        {/* Subtle grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <motion.div {...fadeUp()} className="relative z-10 max-w-3xl mx-auto">
          <span className="inline-block text-[11px] font-black uppercase tracking-[0.3em] text-[#DC2626] mb-6">Make the next move count</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            Talk to a<br />B2B sales rep
          </h2>
          <p className="text-gray-400 text-xl font-medium mb-12 leading-relaxed max-w-xl mx-auto">
            Don't let enterprise challenges hold you back. Together, we can achieve better business results.
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
              Try for free <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
