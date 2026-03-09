import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon, MailIcon, ZapIcon, TrendingUpIcon, UsersIcon,
  BarChart2Icon, CheckIcon, StarIcon, PaletteIcon, TargetIcon,
  ClockIcon, ShieldCheckIcon, SplitIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

const CDN = 'https://cdn.shopify.com/b/shopify-brochure2-assets';
const CF  = 'https://dwtqm09zovi8z.cloudfront.net/assets';

/* ─── FEATURES ─── */
const features = [
  {
    icon: <PaletteIcon className="w-6 h-6" />,
    heading: 'Drag-and-drop email builder',
    desc: 'Design stunning emails in minutes with our visual editor. Choose from 100+ pre-built, mobile-optimised templates or start from scratch — no coding ever required.',
    img: `${CDN}/4dd1cce5beb0f5dbb46115e31e300f80.webp`,
    color: '#DC2626',
  },
  {
    icon: <ZapIcon className="w-6 h-6" />,
    heading: 'Automations that sell while you sleep',
    desc: 'Set up welcome sequences, abandoned cart flows, win-back campaigns, and post-purchase upsells once — then let them run forever. Average automation earns 320× its send cost.',
    img: `${CDN}/ebc54e1da391c75a5a98649fa293484a.webp`,
    color: '#7C3AED',
  },
  {
    icon: <TargetIcon className="w-6 h-6" />,
    heading: 'Smart segmentation & personalisation',
    desc: 'Segment your list by purchase history, location, browsing behaviour, and 30+ other filters. Every subscriber gets the right message at the right moment.',
    img: `${CF}/catalogue_e_commerce.webp`,
    color: '#0284C7',
  },
  {
    icon: <SplitIcon className="w-6 h-6" />,
    heading: 'A/B testing built right in',
    desc: 'Test subject lines, content, and send times. CommerceHub automatically sends the winning variant to the rest of your list once results are significant.',
    img: `${CF}/boost_personal_commerce_1.webp`,
    color: '#059669',
  },
];

/* ─── AUTOMATIONS ─── */
const automations = [
  { icon: '👋', label: 'Welcome series', desc: 'Greet new subscribers and turn them into buyers within 7 days.' },
  { icon: '🛒', label: 'Abandoned cart', desc: 'Recover up to 15% of abandoned carts automatically.' },
  { icon: '🔁', label: 'Win-back flow', desc: "Re-engage customers who haven't purchased in 90+ days." },
  { icon: '📦', label: 'Post-purchase', desc: 'Thank, upsell, and collect reviews after every order.' },
  { icon: '🎂', label: 'Birthday offer', desc: 'Delight customers on their birthday with a personalised deal.' },
  { icon: '🔔', label: 'Back-in-stock', desc: 'Notify waitlisted shoppers the moment inventory returns.' },
];

/* ─── STATS ─── */
const stats = [
  { val: '4,200%', label: 'average email marketing ROI' },
  { val: '320×',   label: 'revenue per automation send' },
  { val: '40%',    label: 'higher open rates with segmentation' },
  { val: '15%',    label: 'of abandoned carts recovered automatically' },
];

/* ─── TESTIMONIALS ─── */
const testimonials = [
  {
    quote: 'CommerceHub email automations generate 38% of our monthly revenue. We set it up once and it just keeps working.',
    name: 'Priya Sharma', title: 'Founder, The Skin Lab',
    avatar: 'P', stars: 5,
  },
  {
    quote: 'Switched from Mailchimp. The native customer data integration means our segments are always accurate — open rates doubled.',
    name: 'Marcus Reid', title: 'Head of Growth, Volta Sport',
    avatar: 'M', stars: 5,
  },
  {
    quote: 'The drag-and-drop builder is so good our designer stopped using Figma for email. Everything looks stunning and converts.',
    name: 'Chen Wei', title: 'CMO, Nomad Goods',
    avatar: 'C', stars: 5,
  },
];

/* ─── PRICING TIERS ─── */
const tiers = [
  {
    name: 'Starter',
    price: 'Free',
    note: 'Up to 10,000 emails/month',
    features: ['Drag-and-drop editor', '100+ templates', 'Basic automations', 'Analytics dashboard'],
    highlight: false,
  },
  {
    name: 'Growth',
    price: '₹999',
    note: 'per month',
    features: ['Everything in Starter', 'Advanced segmentation', 'A/B testing', 'Abandoned cart recovery', 'SMS add-on available'],
    highlight: true,
    badge: 'Most popular',
  },
  {
    name: 'Pro',
    price: '₹2,499',
    note: 'per month',
    features: ['Everything in Growth', 'Predictive send time', 'Custom reporting', 'Dedicated IP address', 'Priority support'],
    highlight: false,
  },
];

export default function EmailMarketingPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-32 pb-28 text-center">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 65% 50% at 50% -5%, rgba(220,38,38,0.28) 0%, transparent 68%)' }} />
        <div className="relative max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#DC2626] mb-6 px-3 py-1.5 rounded-full border border-[#DC2626]/30 bg-[#DC2626]/10">
              Email Marketing
            </span>
            <h1 className="text-5xl sm:text-7xl font-black leading-[0.93] tracking-tight mb-6">
              Email that sells.
              <br />
              <span className="text-[#DC2626]">Automatically.</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
              Build beautiful emails, automate your campaigns, and grow revenue — all from the same platform as your store. No third-party tools needed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/register')} className="inline-flex items-center gap-2 bg-[#DC2626] hover:bg-[#b91c1c] text-white font-bold text-base px-8 py-4 rounded-full transition-all duration-200 shadow-lg shadow-red-900/30">
                Start free trial <ArrowRightIcon className="w-4 h-4" />
              </button>
              <button onClick={() => navigate('/pricing')} className="inline-flex items-center gap-2 border border-white/15 hover:border-white/40 text-white font-semibold text-base px-8 py-4 rounded-full transition-all duration-200">
                View pricing
              </button>
            </div>
          </motion.div>

          {/* mock email preview card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-16 max-w-2xl mx-auto bg-[#0a0a0a] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl shadow-black/60"
          >
            {/* browser bar */}
            <div className="flex items-center gap-2 px-5 py-3.5 bg-[#111] border-b border-white/[0.06]">
              <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <span className="w-3 h-3 rounded-full bg-[#28CA41]" />
              <span className="ml-4 flex-1 bg-[#1a1a1a] rounded-md px-3 py-1 text-xs text-gray-600">
                CommerceHub Email Builder
              </span>
            </div>
            {/* email mockup body */}
            <div className="p-8 text-left space-y-4">
              <div className="h-32 bg-gradient-to-br from-[#DC2626]/20 to-[#7C3AED]/10 rounded-2xl flex items-center justify-center">
                <span className="text-4xl">👗</span>
              </div>
              <div className="space-y-2">
                <div className="h-5 bg-white/10 rounded-full w-3/4" />
                <div className="h-3.5 bg-white/[0.06] rounded-full w-full" />
                <div className="h-3.5 bg-white/[0.06] rounded-full w-5/6" />
              </div>
              <div className="inline-flex items-center gap-2 bg-[#DC2626] text-white text-xs font-bold px-5 py-2.5 rounded-full">
                Shop now <ArrowRightIcon className="w-3 h-3" />
              </div>
              <div className="flex gap-3 pt-2">
                {[0.7, 0.5, 0.4].map((o, i) => (
                  <div key={i} className="h-16 flex-1 rounded-xl" style={{ background: `rgba(255,255,255,${o * 0.06})` }} />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <section className="py-14 bg-[#080808] border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(({ val, label }) => (
            <motion.div key={val} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
              <p className="text-4xl sm:text-5xl font-black text-[#DC2626] leading-none mb-2">{val}</p>
              <p className="text-sm text-gray-500 leading-snug">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 bg-black">
        <div className="max-w-6xl mx-auto px-6 space-y-20">
          {features.map((f, i) => (
            <motion.div
              key={f.heading}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`grid md:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'md:[&>*:first-child]:order-last' : ''}`}
            >
              <div>
                <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6" style={{ background: `${f.color}14`, color: f.color }}>
                  {f.icon}
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-4 leading-tight">{f.heading}</h2>
                <p className="text-gray-400 text-lg leading-relaxed">{f.desc}</p>
              </div>
              <div className="rounded-3xl overflow-hidden border border-white/[0.07] bg-[#0a0a0a]">
                <img src={f.img} alt={f.heading} className="w-full h-64 object-cover" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── AUTOMATIONS GRID ── */}
      <section className="py-24 bg-[#060606]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-black mb-4">Pre-built automation flows</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Turn on any automation in one click. Every flow is pre-configured with best-practice timing and copy.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {automations.map((a, i) => (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.14] transition-all duration-300 group cursor-pointer"
              >
                <span className="text-3xl mb-4 block">{a.icon}</span>
                <h3 className="font-black text-white text-base mb-2">{a.label}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{a.desc}</p>
                <div className="mt-4 flex items-center gap-1.5 text-[#DC2626] text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Enable flow <ArrowRightIcon className="w-3 h-3" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-black text-white text-center mb-12">What merchants say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-7">
                <div className="flex gap-0.5 mb-5">
                  {[...Array(t.stars)].map((_, i) => <StarIcon key={i} className="w-4 h-4 fill-[#DC2626] text-[#DC2626]" />)}
                </div>
                <blockquote className="text-gray-300 text-sm leading-relaxed italic mb-6">"{t.quote}"</blockquote>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#DC2626]/20 flex items-center justify-center text-[#DC2626] font-black text-sm">{t.avatar}</div>
                  <div>
                    <p className="text-white font-bold text-sm">{t.name}</p>
                    <p className="text-gray-600 text-xs">{t.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-24 bg-[#060606]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black mb-3">Simple, transparent pricing</h2>
            <p className="text-gray-500">Included free on every CommerceHub plan. Upgrade for more sends and advanced features.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {tiers.map((tier) => (
              <div key={tier.name} className={`relative rounded-3xl p-8 border ${tier.highlight ? 'border-[#DC2626]/40 bg-[#DC2626]/5' : 'border-white/[0.06] bg-[#0a0a0a]'}`}>
                {tier.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#DC2626] text-white text-xs font-black px-4 py-1 rounded-full uppercase tracking-wide">
                    {tier.badge}
                  </span>
                )}
                <p className="font-black text-white text-lg mb-1">{tier.name}</p>
                <p className={`text-4xl font-black mb-1 ${tier.highlight ? 'text-[#DC2626]' : 'text-white'}`}>{tier.price}</p>
                <p className="text-gray-600 text-xs mb-6">{tier.note}</p>
                <ul className="space-y-3 mb-8">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-gray-400">
                      <CheckIcon className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" strokeWidth={2.5} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => navigate('/register')} className={`w-full py-3 rounded-xl font-bold text-sm transition-all duration-200 ${tier.highlight ? 'bg-[#DC2626] hover:bg-[#b91c1c] text-white' : 'border border-white/15 hover:border-white/30 text-white'}`}>
                  Get started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative py-32 bg-black overflow-hidden text-center">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 55% 45% at 50% 100%, rgba(220,38,38,0.2) 0%, transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto px-6">
          <h2 className="text-5xl sm:text-6xl font-black leading-tight mb-6">Your next sale is one email away.</h2>
          <p className="text-gray-400 text-lg mb-10">Start sending in minutes. No credit card required.</p>
          <button onClick={() => navigate('/register')} className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-black font-black text-lg px-10 py-4 rounded-full transition-all duration-200 shadow-xl shadow-white/5">
            Start free <ArrowRightIcon className="w-5 h-5" />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
