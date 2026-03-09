import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon, SearchIcon, StarIcon, CheckIcon, MapPinIcon,
  CodeIcon, PaletteIcon, MegaphoneIcon, GlobeIcon, CameraIcon,
  ShieldCheckIcon, TrendingUpIcon, ZapIcon, UsersIcon, AwardIcon,
  MicIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

/* ─── STATS ─── */
const stats = [
  { val: '4,000+',  label: 'certified CommerceHub partners' },
  { val: '150+',    label: 'countries with active partners' },
  { val: '4.8 / 5', label: 'average partner rating' },
  { val: 'Free',    label: 'to browse and contact partners' },
];

/* ─── PARTNER TYPES ─── */
const partnerTypes = [
  { icon: <CodeIcon className="w-6 h-6" />,       label: 'Development',  desc: 'Custom store builds, checkout extensions, private app development, and headless frontends.', color: '#7C3AED', count: '1,240 partners' },
  { icon: <PaletteIcon className="w-6 h-6" />,    label: 'Design',       desc: 'Brand identity, theme customisation, UI/UX audits, and conversion-focused Redesigns.', color: '#0284C7', count: '880 partners' },
  { icon: <MegaphoneIcon className="w-6 h-6" />,  label: 'Marketing',    desc: 'Paid media, SEO, email marketing, influencer strategy, and full-funnel growth management.', color: '#DC2626', count: '960 partners' },
  { icon: <GlobeIcon className="w-6 h-6" />,      label: 'Migration',    desc: 'Seamless migration from WooCommerce, Magento, BigCommerce, Salesforce, and any other platform.', color: '#059669', count: '450 partners' },
  { icon: <TrendingUpIcon className="w-6 h-6" />, label: 'SEO & Content', desc: 'Technical SEO, content strategy, link building, and organic growth for competitive categories.', color: '#D97706', count: '620 partners' },
  { icon: <CameraIcon className="w-6 h-6" />,     label: 'Photography',  desc: 'Product photography, video, 3D visualisation, and creative direction for your brand.', color: '#EC4899', count: '380 partners' },
];

/* ─── FEATURES ─── */
const features = [
  {
    badge: 'Verified experts',
    heading: 'Certified and vetted so you never have to guess',
    body: 'Every partner in our directory has completed the CommerceHub Partner Certification — rigorous exams across development, design, and business practices. We also verify past client work before any agency is listed.',
    bullets: ['Partner Certification required', 'Portfolio verification process', 'Background-checked agencies', 'Ongoing performance monitoring'],
    img: `https://cdn.shopify.com/b/shopify-brochure2-assets/dashboard-analytics.png`,
  },
  {
    badge: 'Ratings and reviews',
    heading: 'Real reviews from real merchants — nothing paid',
    body: 'Partner ratings come exclusively from verified contracts completed through our platform. We prohibit incentivised reviews. You see an honest 4.8 because it is earned, not bought.',
    bullets: ['Verified-purchase reviews only', 'Detailed project breakdowns', 'Response rate and timeline data', 'Public dispute resolution'],
    img: `https://cdn.shopify.com/b/shopify-brochure2-assets/developers.png`,
  },
  {
    badge: 'Fast matching',
    heading: 'Find the right partner in under 10 minutes',
    body: 'Our intelligent matching tool filters by specialisation, industry, budget, language, timezone, and past project type. You receive a shortlist of best-fit partners — not 400 unfiltered results.',
    bullets: ['Filter by 12+ criteria', 'AI-matched shortlists', 'See availability in real time', 'Direct message before committing'],
    img: `https://cdn.shopify.com/b/shopify-brochure2-assets/pos-hero.png`,
  },
];

/* ─── HOW IT WORKS ─── */
const steps = [
  { num: '01', heading: 'Describe your project', body: 'Tell us what you need — store build, redesign, migration, or ongoing growth. Takes 3 minutes.' },
  { num: '02', heading: 'Get matched instantly', body: 'Our system surfaces the top 5 certified partners for your exact requirements, budget, and timezone.' },
  { num: '03', heading: 'Review and connect', body: 'Read verified reviews, check portfolios, message directly — all before signing anything.' },
  { num: '04', heading: 'Build with confidence', body: 'Hire through CommerceHub for full project transparency, milestone tracking, and payment protection.' },
];

/* ─── PARTNER SPOTLIGHTS ─── */
const spotlights = [
  {
    name: 'Pixel & Craft Studio',
    location: 'London, UK',
    specialties: ['Headless Commerce', 'Custom Theme Dev', 'Shopify Markets'],
    rating: 4.9,
    reviews: 128,
    projects: '340+',
    avatar: 'P',
    color: '#7C3AED',
  },
  {
    name: 'GrowthOps Agency',
    location: 'Bangalore, India',
    specialties: ['Paid Media', 'Email Growth', 'Analytics Setup'],
    rating: 4.8,
    reviews: 214,
    projects: '510+',
    avatar: 'G',
    color: '#DC2626',
  },
  {
    name: 'Migrate Pro',
    location: 'Toronto, Canada',
    specialties: ['WooCommerce Migration', 'Data Integrity', 'Zero-downtime'],
    rating: 4.9,
    reviews: 89,
    projects: '190+',
    avatar: 'M',
    color: '#059669',
  },
];

/* ─── TESTIMONIALS ─── */
const testimonials = [
  { quote: 'I found a developer who had migrated 40 WooCommerce stores to CommerceHub. She had us live in 12 days with zero product data lost. Could not have done it without the partner directory.', name: 'James Okafor', title: 'Founder, Rova Athletics', avatar: 'J', stars: 5 },
  { quote: 'GrowthOps took our ROAS from 1.4x to 4.1x in three months. I found them through the directory, checked their verified reviews, and hired them the same day. Worth every rupee.', name: 'Sneha Reddy', title: 'CMO, Tulsi Foods', avatar: 'S', stars: 5 },
  { quote: 'Pixel & Craft built our headless storefront in 6 weeks. The partner matching tool was uncannily accurate — they were technically perfect and genuinely understood our brand.', name: 'Marcus Webb', title: 'CTO, ThreadForm', avatar: 'M', stars: 5 },
];

export default function HirePartnerPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeType, setActiveType] = useState('All');

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-32 pb-24 text-center">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 65% 50% at 50% -5%, rgba(220,38,38,0.26) 0%, transparent 68%)' }} />
        <div className="relative max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#DC2626] mb-6 px-3 py-1.5 rounded-full border border-[#DC2626]/30 bg-[#DC2626]/10">
              Partner Directory
            </span>
            <h1 className="text-5xl sm:text-7xl font-black leading-[0.93] tracking-tight mb-6">
              Find an expert.
              <br />
              <span className="text-[#DC2626]">Build anything.</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
              Connect with 4,000+ certified developers, designers, marketers, and migration specialists who live and breathe CommerceHub.
            </p>

            {/* search */}
            <div className="relative max-w-xl mx-auto mb-8">
              <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search by skill, location, or partner name..."
                className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-full pl-12 pr-6 py-4 text-white placeholder-gray-700 text-sm focus:outline-none focus:border-[#DC2626]/50 transition-colors"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/register')} className="inline-flex items-center gap-2 bg-[#DC2626] hover:bg-[#b91c1c] text-white font-bold text-base px-8 py-4 rounded-full transition-all duration-200 shadow-lg shadow-red-900/30">
                <SearchIcon className="w-4 h-4" /> Find a partner
              </button>
              <button className="inline-flex items-center gap-2 border border-white/15 hover:border-white/40 text-white font-semibold text-base px-8 py-4 rounded-full transition-all duration-200">
                Become a partner
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
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

      {/* ── PARTNER TYPES ── */}
      <section className="py-24 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-black mb-4">What do you need?</h2>
            <p className="text-gray-500 text-lg">From day-one builds to full-scale growth — there is a certified expert for every challenge.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {partnerTypes.map((pt, i) => (
              <motion.div
                key={pt.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.07 }}
                className="group bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-7 hover:border-white/[0.14] cursor-pointer transition-all duration-200"
                onClick={() => navigate('/register')}
              >
                <div className="flex items-start justify-between mb-5">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl" style={{ background: `${pt.color}14`, color: pt.color }}>
                    {pt.icon}
                  </span>
                  <span className="text-xs font-bold" style={{ color: pt.color }}>{pt.count}</span>
                </div>
                <h3 className="font-black text-white text-lg mb-2 group-hover:text-[#DC2626] transition-colors">{pt.label}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4">{pt.desc}</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: pt.color }}>
                  Browse experts <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 bg-[#060606]">
        <div className="max-w-6xl mx-auto px-6 space-y-28">
          {features.map((f, i) => (
            <motion.div
              key={f.badge}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className={`grid md:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'md:[&>*:first-child]:order-last' : ''}`}
            >
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#DC2626] mb-4 block">{f.badge}</span>
                <h2 className="text-3xl font-black mb-5 leading-tight">{f.heading}</h2>
                <p className="text-gray-400 leading-relaxed mb-7">{f.body}</p>
                <ul className="space-y-2.5">
                  {f.bullets.map(b => (
                    <li key={b} className="flex items-center gap-3 text-sm text-gray-300">
                      <CheckIcon className="w-4 h-4 text-[#DC2626] shrink-0" strokeWidth={2.5} /> {b}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-[#DC2626]/5 rounded-3xl" />
                <img src={f.img} alt={f.badge} className="relative rounded-2xl w-full object-cover h-64 border border-white/[0.06]" onError={e => { e.currentTarget.style.display = 'none'; }} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 bg-black">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black mb-3">How it works</h2>
            <p className="text-gray-500">From first search to first milestone in as little as 24 hours.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-6"
              >
                <p className="text-4xl font-black text-[#DC2626]/30 mb-4">{s.num}</p>
                <h3 className="font-black text-white text-sm mb-2">{s.heading}</h3>
                <p className="text-gray-600 text-xs leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNER SPOTLIGHTS ── */}
      <section className="py-20 bg-[#060606]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black mb-1">Featured partners</h2>
              <p className="text-gray-500 text-sm">A snapshot of top-rated experts in our directory.</p>
            </div>
            <button className="text-[#DC2626] text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all" onClick={() => navigate('/register')}>
              View all 4,000+ <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="grid sm:grid-cols-3 gap-5">
            {spotlights.map((sp, i) => (
              <motion.div
                key={sp.name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.09 }}
                className="group bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.14] cursor-pointer transition-all duration-200"
                onClick={() => navigate('/register')}
              >
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-xl" style={{ background: `${sp.color}14`, color: sp.color }}>
                    {sp.avatar}
                  </div>
                  <div>
                    <p className="text-white font-black text-sm group-hover:text-[#DC2626] transition-colors">{sp.name}</p>
                    <p className="text-gray-600 text-xs flex items-center gap-1"><MapPinIcon className="w-3 h-3" /> {sp.location}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {sp.specialties.map(s => (
                    <span key={s} className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/[0.05] text-gray-400">{s}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 pt-4 border-t border-white/[0.06]">
                  <span className="flex items-center gap-1">
                    <StarIcon className="w-3.5 h-3.5 fill-[#DC2626] text-[#DC2626]" />
                    <span className="text-white font-bold">{sp.rating}</span>
                    <span>({sp.reviews} reviews)</span>
                  </span>
                  <span>{sp.projects} projects</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-black text-center mb-12">Merchants who found their match</h2>
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

      {/* ── FINAL CTA ── */}
      <section className="relative py-28 bg-[#060606] overflow-hidden text-center">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 55% 45% at 50% 100%, rgba(220,38,38,0.2) 0%, transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto px-6">
          <h2 className="text-5xl font-black leading-tight mb-5">Your next milestone<br /><span className="text-[#DC2626]">starts with the right partner.</span></h2>
          <p className="text-gray-400 text-lg mb-10">Browse 4,000+ certified experts. Free to search, free to contact, no platform fee to hire.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/register')} className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-black font-black text-lg px-10 py-4 rounded-full transition-all duration-200">
              <SearchIcon className="w-5 h-5" /> Find a partner
            </button>
            <button className="inline-flex items-center gap-2 border border-white/20 hover:border-white/50 text-white font-bold text-lg px-10 py-4 rounded-full transition-all duration-200">
              Become a partner
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
