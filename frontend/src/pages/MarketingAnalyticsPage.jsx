import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon, BarChart2Icon, TrendingUpIcon, ZapIcon, GlobeIcon,
  UsersIcon, ShoppingCartIcon, CheckIcon, StarIcon, RefreshCwIcon,
  DollarSignIcon, TargetIcon, PieChartIcon, ActivityIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

const CDN = 'https://cdn.shopify.com/b/shopify-brochure2-assets';
const CF  = 'https://dwtqm09zovi8z.cloudfront.net/assets';

/* ─── DASHBOARD METRICS MOCK ─── */
const metricCards = [
  { label: 'Total Revenue',       val: '₹4,82,340',  change: '+18.4%', up: true,  color: '#DC2626' },
  { label: 'Sessions',            val: '1,24,583',   change: '+11.2%', up: true,  color: '#7C3AED' },
  { label: 'Conversion Rate',     val: '3.74%',      change: '+0.9%',  up: true,  color: '#059669' },
  { label: 'Avg. Order Value',    val: '₹1,840',     change: '-2.1%',  up: false, color: '#EA580C' },
];

/* ─── REPORT CATEGORIES ─── */
const reportGroups = [
  {
    icon: <DollarSignIcon className="w-5 h-5" />,
    label: 'Sales reports',
    color: '#DC2626',
    reports: ['Total sales over time', 'Sales by product', 'Sales by channel', 'Gross profit by variant', 'Sales by billing region'],
  },
  {
    icon: <UsersIcon className="w-5 h-5" />,
    label: 'Customer reports',
    color: '#7C3AED',
    reports: ['Customers over time', 'New vs returning', 'Customers by location', 'Customer cohort analysis', 'Lifetime value (LTV)'],
  },
  {
    icon: <ShoppingCartIcon className="w-5 h-5" />,
    label: 'Order reports',
    color: '#0284C7',
    reports: ['Orders over time', 'Fulfilment times', 'Return rates', 'Average order value', 'Checkout conversion funnel'],
  },
  {
    icon: <GlobeIcon className="w-5 h-5" />,
    label: 'Acquisition reports',
    color: '#059669',
    reports: ['Sessions by traffic source', 'Sessions by device', 'Sessions by location', 'Marketing attribution', 'UTM campaign performance'],
  },
  {
    icon: <BarChart2Icon className="w-5 h-5" />,
    label: 'Marketing reports',
    color: '#EA580C',
    reports: ['Email campaign performance', 'Social channel ROAS', 'Ad spend vs revenue', 'Discount code usage', 'Promo performance'],
  },
  {
    icon: <ActivityIcon className="w-5 h-5" />,
    label: 'Inventory reports',
    color: '#BE185D',
    reports: ['Inventory on hand', 'Inventory value', 'Days of supply', 'ABC inventory analysis', 'Sell-through rate'],
  },
];

/* ─── FEATURES ─── */
const features = [
  {
    icon: <RefreshCwIcon className="w-6 h-6" />,
    heading: 'Real-time data — no refresh required',
    desc: 'Every metric on your dashboard updates the moment an order is placed, a session starts, or a campaign converts. You\'re always looking at live data, not yesterday\'s numbers.',
    img: `${CDN}/ebc54e1da391c75a5a98649fa293484a.webp`,
    color: '#DC2626',
  },
  {
    icon: <PieChartIcon className="w-6 h-6" />,
    heading: 'Custom reports with CommerceQL',
    desc: 'Go beyond pre-built reports with CommerceQL — our SQL-like query language. Ask any question about your business data and get a visual answer in seconds. No data warehouse needed.',
    img: `${CDN}/4dd1cce5beb0f5dbb46115e31e300f80.webp`,
    color: '#7C3AED',
  },
  {
    icon: <TargetIcon className="w-6 h-6" />,
    heading: 'Multi-channel attribution',
    desc: 'Know which marketing channels are really driving revenue — not just the last click. CommerceHub\'s attribution model shows the full customer journey from first touch to purchase.',
    img: `${CF}/boost_personal_commerce_3.webp`,
    color: '#0284C7',
  },
  {
    icon: <GlobeIcon className="w-6 h-6" />,
    heading: 'Benchmark against your peers',
    desc: 'See how your conversion rate, AOV, and revenue growth compare to similar stores in your category and size range. Know where you stand and where to improve.',
    img: `${CF}/catalogue_e_commerce.webp`,
    color: '#059669',
  },
];

/* ─── STATS ─── */
const stats = [
  { val: '100+',  label: 'pre-built commerce reports' },
  { val: 'Live',  label: 'real-time data updates' },
  { val: '60+',   label: 'custom metrics with CommerceQL' },
  { val: '360°',  label: 'view: sales, customers & marketing' },
];

/* ─── TESTIMONIALS ─── */
const testimonials = [
  {
    quote: 'CommerceHub analytics showed us that 67% of our revenue comes from returning customers. We shifted budget to retention campaigns and grew 40% in 3 months.',
    name: 'Natalie Wong', title: 'Co-founder, Zen Apparel', avatar: 'N', stars: 5,
  },
  {
    quote: 'The realtime dashboard during our product launch was incredible. We could see traffic, conversions, and revenue all at once and react in minutes.',
    name: 'Dmitri Volkov', title: 'Head of eCommerce, Nord Supply', avatar: 'D', stars: 5,
  },
  {
    quote: 'CommerceQL let our analyst build a custom CAC report that we\'d been asking our old platform for for 2 years. Took 10 minutes.',
    name: 'Amara Osei', title: 'Marketing Director, Kente & Co.', avatar: 'A', stars: 5,
  },
];

/* ─── INTEGRATIONS ─── */
const integrations = [
  'Google Analytics 4', 'Google Ads', 'Meta Ads', 'TikTok Ads',
  'Klaviyo', 'Mailchimp', 'Pinterest Ads', 'Snapchat Ads',
];

export default function MarketingAnalyticsPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-32 pb-28 text-center">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 65% 50% at 50% -5%, rgba(220,38,38,0.26) 0%, transparent 68%)' }} />
        <div className="relative max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#DC2626] mb-6 px-3 py-1.5 rounded-full border border-[#DC2626]/30 bg-[#DC2626]/10">
              Marketing Analytics
            </span>
            <h1 className="text-5xl sm:text-7xl font-black leading-[0.93] tracking-tight mb-6">
              Know your numbers.
              <br />
              <span className="text-[#DC2626]">Grow your business.</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
              Real-time reports, multi-channel attribution, and custom queries — all the data you need to make smarter marketing decisions, built directly into your store.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/register')} className="inline-flex items-center gap-2 bg-[#DC2626] hover:bg-[#b91c1c] text-white font-bold text-base px-8 py-4 rounded-full transition-all duration-200 shadow-lg shadow-red-900/30">
                Start free trial <ArrowRightIcon className="w-4 h-4" />
              </button>
              <button onClick={() => navigate('/product/analytics')} className="inline-flex items-center gap-2 border border-white/15 hover:border-white/40 text-white font-semibold text-base px-8 py-4 rounded-full transition-all duration-200">
                See live demo
              </button>
            </div>
          </motion.div>

          {/* mock dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-16 bg-[#0a0a0a] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl shadow-black/60"
          >
            <div className="flex items-center gap-2 px-5 py-3.5 bg-[#111] border-b border-white/[0.06]">
              <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <span className="w-3 h-3 rounded-full bg-[#28CA41]" />
              <span className="ml-4 flex-1 bg-[#1a1a1a] rounded-md px-3 py-1 text-xs text-gray-600">Analytics Dashboard — Today</span>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-500 font-semibold">LIVE</span>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {metricCards.map((m) => (
                  <div key={m.label} className="bg-[#111] border border-white/[0.06] rounded-2xl p-4">
                    <p className="text-xs text-gray-600 mb-2">{m.label}</p>
                    <p className="text-xl font-black text-white">{m.val}</p>
                    <span className={`text-xs font-bold mt-1 inline-block ${m.up ? 'text-green-400' : 'text-red-400'}`}>
                      {m.change} vs last period
                    </span>
                  </div>
                ))}
              </div>
              {/* fake chart bars */}
              <div className="bg-[#111] border border-white/[0.06] rounded-2xl p-5">
                <p className="text-xs text-gray-600 mb-4">Revenue over time</p>
                <div className="flex items-end gap-2 h-24">
                  {[35, 52, 41, 68, 75, 60, 82, 70, 90, 78, 95, 88, 100, 84].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t-md"
                      style={{ height: `${h}%`, background: i === 12 ? '#DC2626' : `rgba(220,38,38,${0.15 + h * 0.003})` }}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-700 mt-2">
                  <span>14 days ago</span><span>Today</span>
                </div>
              </div>
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

      {/* ── REPORT LIBRARY ── */}
      <section className="py-24 bg-[#060606]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-black mb-4">100+ reports, ready instantly</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Every report a commerce business needs — organised, searchable, and exportable to CSV.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {reportGroups.map((group, i) => (
              <motion.div
                key={group.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.14] transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${group.color}14`, color: group.color }}>
                    {group.icon}
                  </span>
                  <span className="font-black text-white text-sm">{group.label}</span>
                </div>
                <ul className="space-y-2.5">
                  {group.reports.map((r) => (
                    <li key={r} className="flex items-center gap-2.5 text-xs text-gray-500">
                      <span className="w-1 h-1 rounded-full shrink-0" style={{ background: group.color }} />
                      {r}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTEGRATIONS ── */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black mb-4">Connects with every ad platform</h2>
          <p className="text-gray-500 mb-10">Import your ad spend data from every major platform and see true ROAS inside your CommerceHub dashboard.</p>
          <div className="flex flex-wrap justify-center gap-3">
            {integrations.map((name) => (
              <div key={name} className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl px-5 py-3 text-sm font-semibold text-gray-400 hover:text-white hover:border-white/[0.14] transition-all duration-200">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-[#060606]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-black text-center mb-12">Merchants who know their numbers</h2>
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
      <section className="relative py-32 bg-black overflow-hidden text-center">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 55% 45% at 50% 100%, rgba(220,38,38,0.2) 0%, transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto px-6">
          <h2 className="text-5xl sm:text-6xl font-black leading-tight mb-6">
            Data that drives
            <br />
            <span className="text-[#DC2626]">real decisions.</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10">Start your free trial and have your first analytics dashboard live in minutes.</p>
          <button onClick={() => navigate('/register')} className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-black font-black text-lg px-10 py-4 rounded-full transition-all duration-200 shadow-xl shadow-white/5">
            Start free trial <ArrowRightIcon className="w-5 h-5" />
          </button>
          <p className="text-gray-700 text-sm mt-4">No credit card required</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
