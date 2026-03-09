import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon, XIcon, ChevronDownIcon, ArrowRightIcon, MinusIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

/* ─────────────────────────────────────────
   DATA
───────────────────────────────────────── */
const plans = [
  {
    id: 'basic',
    name: 'Basic',
    tagline: 'For solo entrepreneurs',
    monthlyPrice: '₹1,994',
    yearlyPrice: '₹1,499',
    highlight: false,
    features: [
      'Sell online and in person',
      '2% 3rd-party payment fees',
      "World's best checkout",
      'Built-in AI tools',
    ],
    credit: 'Earn up to ₹1,10,000 in credits',
    trialNote: '₹20/month for 3 months',
  },
  {
    id: 'grow',
    name: 'Grow',
    tagline: 'For small teams',
    monthlyPrice: '₹7,465',
    yearlyPrice: '₹5,599',
    highlight: false,
    badge: 'Most popular',
    features: [
      'Everything in Basic',
      '1% 3rd-party payment fees',
      'Up to 5 staff accounts',
      'Professional reports',
    ],
    credit: 'Earn up to ₹1,70,000 in credits',
    trialNote: '₹20/month for 3 months',
  },
  {
    id: 'advanced',
    name: 'Advanced',
    tagline: 'For global reach',
    monthlyPrice: '₹30,240',
    yearlyPrice: '₹22,680',
    highlight: false,
    features: [
      'Everything in Grow',
      '0.6% 3rd-party payment fees',
      'Live 3rd-party shipping rates',
      'Up to 15 staff accounts',
      'Tailor your store by region',
    ],
    credit: 'Earn up to ₹2,30,000 in credits',
    trialNote: '₹20/month for 3 months',
  },
  {
    id: 'plus',
    name: 'Plus',
    tagline: 'For complex businesses',
    monthlyPrice: '₹1,75,000',
    yearlyPrice: '₹1,75,000',
    pricePrefix: 'from',
    highlight: true,
    features: [
      'Everything in Advanced',
      '0.2% 3rd-party payment fees',
      'Fully customisable checkout',
      'Unlimited staff accounts',
      'Up to 200 POS Pro locations',
      'Unlimited B2B catalogues',
      'Priority 24/7 phone support',
    ],
    trialNote: null,
  },
];

const alwaysIncluded = [
  {
    img: 'https://cdn.shopify.com/b/shopify-brochure2-assets/ebc54e1da391c75a5a98649fa293484a.webp',
    heading: "World's best checkout",
    desc: 'Get the checkout that converts 36% better on average than other platforms.',
    tag: 'Best-in-class',
  },
  {
    img: 'https://cdn.shopify.com/b/shopify-brochure2-assets/4dd1cce5beb0f5dbb46115e31e300f80.webp',
    heading: 'Stunning store design',
    desc: 'Spin up your store from a simple prompt or with a pre-built template.',
    tag: 'AI-powered',
  },
  {
    heading: 'Built-in AI assistant',
    desc: 'Your commerce-obsessed AI is ready to help you sell, market, and grow.',
    icon: true,
    tag: 'Always on',
  },
  {
    img: 'https://cdn.shopify.com/b/shopify-brochure2-assets/df76ff36e4b8d539a1d839db7cfffdae.webp',
    heading: 'Easy in-person sales',
    desc: 'Sell from anywhere — your phone, a card reader, or the sales counter.',
    tag: 'POS ready',
  },
];

const CHECK = 'check';
const CROSS = 'cross';
const tableCategories = [
  {
    label: 'Core features',
    rows: [
      { label: 'Online store',               values: ['Full-featured', 'Full-featured', 'Full-featured', 'Full-featured'] },
      { label: 'Themes & templates',          values: [CHECK, CHECK, CHECK, CHECK] },
      { label: 'Sell unlimited products',     values: [CHECK, CHECK, CHECK, CHECK] },
      { label: 'World\'s best checkout',      values: [CHECK, CHECK, CHECK, CHECK] },
      { label: 'Sell on social & marketplaces', values: [CHECK, CHECK, CHECK, CHECK] },
      { label: 'Inventory management',        values: [CHECK, CHECK, CHECK, CHECK] },
      { label: 'Inventory locations',         values: ['10', '10', '15', '200'] },
      { label: 'Additional staff accounts',   values: [CROSS, '5', '15', 'Unlimited'] },
      { label: '3rd-party payment fees',      values: ['2%', '1%', '0.6%', '0.2%'] },
      { label: 'Advanced analytics & reports',values: [CROSS, CHECK, CHECK, CHECK] },
      { label: '24/7 support',                values: ['Live chat', 'Live chat', 'Live chat', 'Phone + chat'] },
    ],
  },
  {
    label: 'In-person sales',
    rows: [
      { label: 'Casual in-person sales',      values: [CHECK, CHECK, CHECK, CHECK] },
      { label: 'POS Pro (advanced retail)',    values: ['+₹7,000/mo', '+₹7,000/mo', '+₹7,000/mo', 'Up to 200 locations'] },
    ],
  },
  {
    label: 'AI features',
    rows: [
      { label: 'AI website builder',          values: [CHECK, CHECK, CHECK, CHECK] },
      { label: 'AI commerce assistant',       values: [CHECK, CHECK, CHECK, CHECK] },
    ],
  },
  {
    label: 'Hosting',
    rows: [
      { label: 'Unlimited web hosting',       values: [CHECK, CHECK, CHECK, CHECK] },
      { label: 'Custom domain name',          values: [CHECK, CHECK, CHECK, CHECK] },
      { label: 'Free SSL certificate',        values: [CHECK, CHECK, CHECK, CHECK] },
    ],
  },
  {
    label: 'Marketing',
    rows: [
      { label: 'Unlimited contacts',          values: [CHECK, CHECK, CHECK, CHECK] },
      { label: 'Customer segmentation',       values: [CHECK, CHECK, CHECK, CHECK] },
      { label: 'Email campaigns',             values: [CHECK, CHECK, CHECK, CHECK] },
      { label: 'SMS campaigns',               values: [CHECK, CHECK, CHECK, CHECK] },
      { label: 'Chat with customers',         values: [CHECK, CHECK, CHECK, CHECK] },
      { label: 'Marketing automations',       values: [CHECK, CHECK, CHECK, CHECK] },
      { label: 'Abandoned cart recovery',     values: [CHECK, CHECK, CHECK, CHECK] },
      { label: 'Discount codes & gift cards', values: [CHECK, CHECK, CHECK, CHECK] },
    ],
  },
  {
    label: 'Customisation',
    rows: [
      { label: 'Integrate 1000s of apps',     values: [CHECK, CHECK, CHECK, CHECK] },
      { label: 'Checkout customisation',      values: ['Limited', 'Limited', 'Limited', 'Full'] },
    ],
  },
  {
    label: 'Sell globally',
    rows: [
      { label: 'Integrated translations',     values: [CHECK, CHECK, CHECK, CHECK] },
      { label: 'Show prices in local currencies', values: [CHECK, CHECK, CHECK, CHECK] },
      { label: 'Accept local payment methods', values: [CHECK, CHECK, CHECK, CHECK] },
      { label: 'Estimate duties & taxes',     values: [CROSS, CROSS, CHECK, CHECK] },
    ],
  },
  {
    label: 'Exclusively Plus',
    rows: [
      { label: 'High volume checkout',        values: [CROSS, CROSS, CROSS, CHECK] },
      { label: 'Sell wholesale / B2B',        values: [CROSS, CROSS, CROSS, CHECK] },
      { label: 'Unlimited B2B catalogues',    values: [CROSS, CROSS, CROSS, CHECK] },
      { label: 'Free expansion stores',       values: [CROSS, CROSS, CROSS, CHECK] },
      { label: 'Custom user groups',          values: [CROSS, CROSS, CROSS, CHECK] },
      { label: 'Up to 500% higher API limits',values: [CROSS, CROSS, CROSS, CHECK] },
      { label: 'Priority 24/7 phone support', values: [CROSS, CROSS, CROSS, CHECK] },
    ],
  },
];

const faqs = [
  {
    q: 'What is CommerceHub and how does it work?',
    a: 'CommerceHub is an all-in-one commerce platform that lets you build an online store, sell on WhatsApp, manage B2B orders, and run analytics — all from a single dashboard. Sign up, pick a plan, and start selling within minutes.',
  },
  {
    q: 'How much does CommerceHub cost?',
    a: 'Plans start at ₹1,499/month (billed yearly). You can try any plan free for 14 days — no credit card required. During the trial you can also get 3 months at just ₹20/month.',
  },
  {
    q: 'Can I cancel or change my subscription anytime?',
    a: 'Yes. You can upgrade, downgrade, or cancel at any time from your account settings. If you cancel a yearly plan, you will continue to have access until the end of your billing period.',
  },
  {
    q: 'Are there any additional fees?',
    a: 'If you use a 3rd-party payment provider (not CommerceHub Payments), an additional transaction fee applies based on your plan (0.2%–2%). There are no fees when using CommerceHub Payments.',
  },
  {
    q: 'In what countries can I use CommerceHub?',
    a: 'CommerceHub is available worldwide. Our platform supports multiple currencies, languages, and local payment methods so you can sell globally from day one.',
  },
  {
    q: 'Is CommerceHub PCI compliant?',
    a: 'Yes. All CommerceHub stores are Level 1 PCI DSS compliant. Your customers\' payment data is always protected with bank-grade security.',
  },
  {
    q: 'Can I use my own domain name with CommerceHub?',
    a: 'Absolutely. You can connect an existing domain or purchase a new one directly through CommerceHub. Custom domains are included on all paid plans.',
  },
  {
    q: 'Do I get web hosting with CommerceHub?',
    a: 'Yes — unlimited, fully managed web hosting is included with every plan. We handle servers, updates, and security so you can focus on selling.',
  },
];

/* ─────────────────────────────────────────
   SMALL COMPONENTS
───────────────────────────────────────── */
function CellValue({ val }) {
  if (val === CHECK) return (
    <span className="flex justify-center">
      <span className="w-5 h-5 rounded-full bg-[#DC2626] flex items-center justify-center">
        <CheckIcon className="w-3 h-3 text-white" strokeWidth={3} />
      </span>
    </span>
  );
  if (val === CROSS) return (
    <span className="flex justify-center">
      <MinusIcon className="w-4 h-4 text-gray-300" strokeWidth={2} />
    </span>
  );
  return <span className="text-gray-600 text-sm font-medium">{val}</span>;
}

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-5 text-left group"
      >
        <span className="text-gray-900 font-bold text-base pr-4 group-hover:text-[#DC2626] transition-colors">{q}</span>
        <ChevronDownIcon className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-gray-600 font-medium leading-relaxed text-sm pr-8">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function PricingPage() {
  const [yearly, setYearly] = useState(true);
  const [email, setEmail] = useState('');
  const [openCat, setOpenCat] = useState(tableCategories.map(() => true));
  const navigate = useNavigate();

  const toggleCat = (i) => setOpenCat(prev => prev.map((v, idx) => idx === i ? !v : v));

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── 1. HERO ── */}
      <section className="bg-black text-white pt-32 pb-20 text-center px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="text-[clamp(2.6rem,7vw,5rem)] font-black leading-tight tracking-tight mb-4">
            Start for free, stay for ₹20
          </h1>
          <p className="text-gray-400 text-lg font-medium mb-10">
            Plus, earn up to ₹2,30,000 in credits as you sell.
          </p>
          <form
            onSubmit={e => { e.preventDefault(); navigate('/register'); }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-10"
          >
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="flex-1 px-5 py-4 rounded-xl bg-white/[0.07] border border-white/[0.1] text-white placeholder-gray-600 focus:outline-none focus:border-[#DC2626] transition-all text-sm font-medium"
            />
            <button
              type="submit"
              className="px-7 py-4 bg-[#DC2626] text-white font-bold rounded-xl hover:bg-[#B91C1C] active:scale-95 transition-all text-sm flex items-center justify-center gap-2 shrink-0"
            >
              Start for free <ArrowRightIcon className="w-4 h-4" />
            </button>
          </form>
          {/* Toggle */}
          <div className="inline-flex items-center gap-4 bg-white/[0.07] border border-white/[0.1] rounded-full px-2 py-1.5">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${!yearly ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
            >
              Pay monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${yearly ? 'bg-white text-black' : 'text-gray-400 hover:text-white'}`}
            >
              Pay yearly
              <span className="bg-[#DC2626] text-white text-[10px] font-black px-2 py-0.5 rounded-full">Save 25%</span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── 2. PLAN CARDS ── */}
      <section className="bg-black pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`relative rounded-3xl p-7 flex flex-col ${
                plan.highlight
                  ? 'bg-[#DC2626] text-white'
                  : 'bg-white text-gray-900'
              }`}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-6 bg-black text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                  {plan.badge}
                </span>
              )}
              <div className="mb-6">
                <h3 className={`font-black text-xl mb-1 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm font-medium ${plan.highlight ? 'text-white/70' : 'text-gray-500'}`}>
                  {plan.tagline}
                </p>
              </div>
              <div className="mb-6">
                <div className="flex items-end gap-1">
                  {plan.pricePrefix && (
                    <span className={`text-sm font-semibold mb-1 ${plan.highlight ? 'text-white/70' : 'text-gray-500'}`}>
                      {plan.pricePrefix}
                    </span>
                  )}
                  <span className={`text-4xl font-black leading-none ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>
                    {yearly ? plan.yearlyPrice : plan.monthlyPrice}
                  </span>
                </div>
                <p className={`text-xs font-semibold mt-1 ${plan.highlight ? 'text-white/60' : 'text-gray-400'}`}>
                  /mo {yearly ? '· billed yearly' : '· billed monthly'}
                </p>
              </div>
              <ul className="space-y-2.5 mb-8 flex-1">
                {plan.features.map((f, fi) => (
                  <li key={fi} className="flex items-start gap-2.5 text-sm font-medium">
                    <span className={`w-4.5 h-4.5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      plan.highlight ? 'bg-white/20' : 'bg-[#DC2626]/10'
                    }`}>
                      <CheckIcon className={`w-2.5 h-2.5 ${plan.highlight ? 'text-white' : 'text-[#DC2626]'}`} strokeWidth={3.5} />
                    </span>
                    <span className={plan.highlight ? 'text-white/90' : 'text-gray-700'}>{f}</span>
                  </li>
                ))}
              </ul>
              {plan.credit && (
                <p className={`text-xs font-semibold mb-4 ${plan.highlight ? 'text-white/70' : 'text-gray-500'}`}>
                  {plan.credit}
                </p>
              )}
              <button
                onClick={() => navigate('/register')}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all active:scale-95 ${
                  plan.highlight
                    ? 'bg-white text-[#DC2626] hover:bg-gray-100'
                    : 'bg-black text-white hover:bg-gray-900'
                }`}
              >
                {plan.id === 'plus' ? 'Try Plus' : 'Try for free'}
              </button>
              {plan.trialNote && (
                <p className={`text-center text-[11px] font-semibold mt-3 ${plan.highlight ? 'text-white/50' : 'text-gray-400'}`}>
                  {plan.trialNote}
                </p>
              )}
            </motion.div>
          ))}
        </div>
        <p className="text-center text-gray-600 text-sm font-medium mt-8">
          <button onClick={() => document.getElementById('compare-table').scrollIntoView({ behavior: 'smooth' })} className="underline underline-offset-2 hover:text-white transition-colors">
            Compare all features
          </button>
        </p>
      </section>

      {/* ── 3. ALWAYS INCLUDED ── */}
      <section className="bg-[#0a0a0a] text-white py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black mb-4">Always included</h2>
            <p className="text-gray-400 text-lg font-medium max-w-xl mx-auto leading-relaxed">
              Every plan comes with what you need to launch, sell, and grow — right out of the box.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {alwaysIncluded.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.09, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="group relative bg-white/[0.04] border border-white/[0.07] rounded-3xl overflow-hidden hover:border-white/[0.15] transition-all duration-300"
              >
                {/* Image / AI gradient area */}
                {item.img ? (
                  <div className="relative overflow-hidden" style={{ height: '300px' }}>
                    <img
                      src={item.img}
                      alt={item.heading}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    {/* Tag badge */}
                    <span className="absolute top-5 left-5 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      {item.tag}
                    </span>
                    {/* Bottom text overlay on image */}
                    <div className="absolute bottom-0 left-0 right-0 p-7">
                      <h3 className="text-white font-black text-2xl mb-1.5">{item.heading}</h3>
                      <p className="text-white/75 text-sm font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ) : (
                  /* AI card — rich illustrated gradient */
                  <div className="relative overflow-hidden" style={{ height: '300px' }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1a0a0a] via-[#2a0808] to-black" />
                    {/* Animated glow orbs */}
                    <div className="absolute top-8 left-8 w-40 h-40 bg-[#DC2626]/25 rounded-full blur-3xl" />
                    <div className="absolute bottom-8 right-8 w-32 h-32 bg-[#DC2626]/15 rounded-full blur-2xl" />
                    {/* Grid pattern */}
                    <div
                      className="absolute inset-0 opacity-[0.06]"
                      style={{
                        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
                        backgroundSize: '32px 32px',
                      }}
                    />
                    {/* Tag badge */}
                    <span className="absolute top-5 left-5 bg-[#DC2626]/20 border border-[#DC2626]/40 text-[#DC2626] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      {item.tag}
                    </span>
                    {/* AI icon */}
                    <div className="absolute top-1/2 right-8 -translate-y-1/2">
                      <div className="w-20 h-20 rounded-3xl bg-[#DC2626] flex items-center justify-center shadow-xl shadow-[#DC2626]/30 group-hover:scale-110 transition-transform duration-500">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                        </svg>
                      </div>
                    </div>
                    {/* Text */}
                    <div className="absolute bottom-0 left-0 right-0 p-7">
                      <h3 className="text-white font-black text-2xl mb-1.5">{item.heading}</h3>
                      <p className="text-white/75 text-sm font-medium leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. BUT WAIT, THERE'S MORE ── */}
      <section className="bg-[#f5f5f5] py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-12">
            But wait, there's more
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* POS Pro */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <span className="inline-block bg-black text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider mb-5">Add on</span>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-3xl font-black text-gray-900">+₹7,000</span>
                <span className="text-gray-500 text-sm font-semibold mb-1">/mo per location</span>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-1">POS Pro</h3>
              <p className="text-gray-500 text-sm font-medium mb-5">For physical storefronts</p>
              <p className="text-gray-700 text-sm font-semibold mb-3">Level up your stores with:</p>
              <ul className="space-y-2">
                {['Unlimited staff roles & permissions', 'In-store inventory management', 'In-store pickup & flexible delivery'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                    <CheckIcon className="w-4 h-4 text-[#DC2626] shrink-0" strokeWidth={3} />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
            {/* Starter */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-end gap-2 mb-1">
                <span className="text-3xl font-black text-gray-900">₹399</span>
                <span className="text-gray-500 text-sm font-semibold mb-1">/mo</span>
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-1">Starter plan</h3>
              <p className="text-gray-500 text-sm font-medium mb-5">For casual selling</p>
              <ul className="space-y-2">
                {['One-page online store', 'Sell on social & messaging apps', 'Accept online payments', 'Basic order management'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                    <CheckIcon className="w-4 h-4 text-[#DC2626] shrink-0" strokeWidth={3} />
                    {f}
                  </li>
                ))}
              </ul>
              <button onClick={() => navigate('/register')} className="mt-6 text-sm font-bold text-[#DC2626] hover:text-[#B91C1C] flex items-center gap-1 group">
                Learn more <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. WORD ON THE STREET ── */}
      <section className="bg-[#f5f5f5] py-20 px-6 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-12">Word on the street</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <blockquote className="text-2xl md:text-3xl font-black text-gray-900 leading-snug mb-6">
                "CommerceHub's platform has made it effortless to manage orders, inventory, marketing and analytics — all in one place."
              </blockquote>
              <p className="text-gray-500 font-semibold text-sm">— Priya Sharma, Founder, StyleNest India</p>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {[
                { stat: '₹1.1 trillion', desc: 'What thousands of merchants have collectively made in sales on CommerceHub.' },
                { stat: '26 seconds', desc: 'Every 26 seconds, an entrepreneur makes their first sale on CommerceHub.' },
              ].map(item => (
                <div key={item.stat} className="bg-white rounded-3xl p-7 border border-gray-100 shadow-sm">
                  <p className="text-3xl font-black text-[#DC2626] mb-3">{item.stat}</p>
                  <p className="text-gray-600 text-sm font-medium leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. COMPARE ALL FEATURES ── */}
      <section id="compare-table" className="bg-white py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-14">Compare all features</h2>

          {/* Sticky plan header */}
          <div className="sticky top-[64px] z-30 bg-white border-b border-gray-100 -mx-2 px-2">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr]">
              <div className="py-4" />
              {plans.map(plan => (
                <div key={plan.id} className={`py-4 text-center ${plan.highlight ? 'bg-[#DC2626]/5 rounded-t-xl' : ''}`}>
                  <p className="font-black text-gray-900 text-sm">{plan.name}</p>
                  <p className="text-[#DC2626] font-bold text-xs mt-0.5">{yearly ? plan.yearlyPrice : plan.monthlyPrice}/mo</p>
                </div>
              ))}
            </div>
          </div>

          {/* Category rows */}
          {tableCategories.map((cat, ci) => (
            <div key={ci} className="border-b border-gray-100 last:border-0">
              {/* Category header */}
              <button
                onClick={() => toggleCat(ci)}
                className="w-full grid grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center py-4 hover:bg-gray-50 transition-colors rounded-xl -mx-2 px-2"
              >
                <span className="flex items-center gap-2 text-left">
                  <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${openCat[ci] ? 'rotate-180' : ''}`} />
                  <span className="font-black text-sm text-gray-900">{cat.label}</span>
                </span>
                {plans.map(p => <span key={p.id} className={p.highlight ? 'bg-[#DC2626]/5' : ''} />)}
              </button>

              <AnimatePresence initial={false}>
                {openCat[ci] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    {cat.rows.map((row, ri) => (
                      <div
                        key={ri}
                        className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center py-3 border-t border-gray-50 hover:bg-gray-50/60 transition-colors"
                      >
                        <span className="text-gray-700 text-sm font-medium pl-6">{row.label}</span>
                        {row.values.map((val, vi) => (
                          <div key={vi} className={`flex justify-center ${plans[vi].highlight ? 'bg-[#DC2626]/5' : ''}`}>
                            <CellValue val={val} />
                          </div>
                        ))}
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {/* Try for free row */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] pt-8 gap-3">
            <div />
            {plans.map(plan => (
              <div key={plan.id} className="flex justify-center">
                <button
                  onClick={() => navigate('/register')}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 whitespace-nowrap ${
                    plan.highlight
                      ? 'bg-[#DC2626] text-white hover:bg-[#B91C1C]'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  {plan.id === 'plus' ? 'Try Plus' : 'Try free'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. FAQs ── */}
      <section className="bg-[#f5f5f5] py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 text-center mb-12">FAQs</h2>
          <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100">
            {faqs.map((faq, i) => (
              <div key={i} className="px-6">
                <FAQItem q={faq.q} a={faq.a} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 8. FINAL CTA ── */}
      <section className="bg-black text-white py-24 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-black mb-5 leading-tight">
            Turn plans into progress
          </h2>
          <p className="text-gray-400 text-lg font-medium mb-10">
            Start your free trial today. No credit card required.
          </p>
          <form
            onSubmit={e => { e.preventDefault(); navigate('/register'); }}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-5 py-4 rounded-xl bg-white/[0.07] border border-white/[0.1] text-white placeholder-gray-600 focus:outline-none focus:border-[#DC2626] transition-all text-sm font-medium"
            />
            <button
              type="submit"
              className="px-7 py-4 bg-[#DC2626] text-white font-bold rounded-xl hover:bg-[#B91C1C] active:scale-95 transition-all text-sm flex items-center justify-center gap-2 shrink-0"
            >
              Start for free <ArrowRightIcon className="w-4 h-4" />
            </button>
          </form>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
