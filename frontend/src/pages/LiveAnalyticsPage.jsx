import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRightIcon, BarChart2Icon, TrendingUpIcon, RefreshCwIcon,
  GlobeIcon, UsersIcon, ShoppingCartIcon, ZapIcon, SearchIcon,
  StarIcon, ChevronDownIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

/* ───────────────────────────────────────── CDN */
const CDN = 'https://cdn.shopify.com/b/shopify-brochure2-assets';
const IMG = {
  heroCollage:       `${CDN}/f7b641680781a405eef214569ce5260d.png`,
  sessionsByDevice:  `${CDN}/97a33ba39a72a6ff16c272a01d052508.png`,
  customersOverTime: `${CDN}/ebe09b0d1c9c54920970f4db4c072f0e.png`,
  totalSales:        `${CDN}/728d989249c56184cc2bce5904c43fef.png`,
  grossByCountry:    `${CDN}/c2c504f333e0c1d11fa6de70ac311b98.png`,
  salesByProduct:    `${CDN}/a20027546c5356c5ba247bf954a2fd16.png`,
  grossByDevice:     `${CDN}/1d8cc21774384904961cfddbb8d27f60.png`,
  sessionsByCountry: `${CDN}/60e71ba6b30d6ee1562ea79850099150.png`,
  sessionsOverTime:  `${CDN}/cbcef3da13573db568ca097dca06cfb6.png`,
  liveGlobe:         `${CDN}/2dbc48f43dded4e3e3d1ff7a7c34167f.png`,
  marketingMeasure:  `${CDN}/0f285bfb46c2ada6ec8aa5050a9f0666.png`,
  marketingChannels: `${CDN}/7a8822075c8c1b4a1d7c808d1c2d5ebd.png`,
  apiData:           `${CDN}/3fdf92ccf990e5b7b8d294a15581acae.png`,
  conversionRate:    `${CDN}/004bf601a526e822ff6ce173340952ab.png`,
  ruby:              `${CDN}/40570d7e867526bfcf9df40af36789aa.png`,
  shelby:            `${CDN}/f9e46941653a1b883927e508f6b1c1ff.png`,
};

/* ───────────────────────────────────────── DATA */
const heroStats = [
  { value: 'Real-time', label: 'Live data updates',    desc: 'Seconds, not hours',        icon: RefreshCwIcon,  pulse: true },
  { value: '100+',      label: 'Pre-built reports',    desc: 'Commerce-specific charts',  icon: BarChart2Icon },
  { value: 'CommerceQL', label: 'Custom query language', desc: 'SQL-style analytics',      icon: SearchIcon },
  { value: 'Benchmark', label: 'Compare to peers',     desc: 'Industry-wide insights',    icon: TrendingUpIcon },
];

const chartCards = [
  { img: IMG.totalSales,        label: 'Total sales' },
  { img: IMG.sessionsByDevice,  label: 'Sessions by device' },
  { img: IMG.conversionRate,    label: 'Conversion rate' },
  { img: IMG.customersOverTime, label: 'Customers over time' },
  { img: IMG.grossByCountry,    label: 'Gross sales by country' },
  { img: IMG.salesByProduct,    label: 'Sales by product' },
  { img: IMG.grossByDevice,     label: 'Gross sales by device' },
  { img: IMG.sessionsOverTime,  label: 'Sessions over time' },
  { img: IMG.sessionsByCountry, label: 'Sessions by country' },
];

const reportingTabs = [
  {
    id: 'prebuilt',
    icon: <BarChart2Icon className="w-5 h-5" />,
    label: 'Pre-built reports',
    heading: 'Commerce reports, ready instantly',
    desc: "Access Shopify-built reports designed specifically for commerce insights. Immediately understand your store's performance with no additional setup — so you can focus on decisions, not data prep.",
    img: IMG.heroCollage,
    cta: 'See reports',
    badges: ['Sales', 'Conversion', 'Sessions', 'Customers', 'Inventory'],
  },
  {
    id: 'custom',
    icon: <SearchIcon className="w-5 h-5" />,
    label: 'Custom exploration',
    heading: 'Drill down into your data',
    desc: "Modify pre-built reports or create your own from scratch. Layer on additional metrics and dimensions to drill down into your reporting, and use CommerceQL — our commerce query language — for advanced analysis.",
    img: IMG.marketingChannels,
    cta: 'Start exploring',
    badges: ['CommerceQL', 'Custom metrics', 'Filters', 'Segments', 'Export'],
  },
  {
    id: 'realtime',
    icon: <RefreshCwIcon className="w-5 h-5" />,
    label: 'Real-time monitoring',
    heading: 'Your dashboard, live and personal',
    desc: "Never miss a change in performance. Drag, drop, and tailor your dashboard to your most critical metrics. All data updates in real time — essential during flash sales, BFCM, and product launches.",
    img: IMG.liveGlobe,
    cta: 'View dashboard',
    badges: ['Live data', 'Custom widgets', 'Drag & drop', 'Mobile ready', 'Alerts'],
  },
];

const reportTypes = [
  { icon: <TrendingUpIcon className="w-5 h-5" />, heading: 'Sales reports', desc: 'Know exactly how much your store is making across all channels, every day.' },
  { icon: <UsersIcon className="w-5 h-5" />, heading: 'Customer reports', desc: 'Understand who your customers are, where they come from, and how often they return.' },
  { icon: <ShoppingCartIcon className="w-5 h-5" />, heading: 'Conversion reports', desc: 'Pinpoint where shoppers drop off and what it takes to turn visitors into buyers.' },
  { icon: <GlobeIcon className="w-5 h-5" />, heading: 'Traffic & sessions', desc: 'See site traffic and where visitors come from — country, device, referral source.' },
  { icon: <BarChart2Icon className="w-5 h-5" />, heading: 'Marketing reports', desc: 'Organise activities into campaigns, track ROAS, CAC, and top channels at a glance.' },
  { icon: <ZapIcon className="w-5 h-5" />, heading: 'Benchmark reports', desc: "Compare your performance to similar businesses on CommerceHub — know where you stand." },
];

const testimonials = [
  {
    img: IMG.ruby,
    quote: "By using CommerceHub's analytics and reporting to identify best sellers and sales trends, we were able to grow our revenue year over year by 50% at Christmas.",
    name: 'Ruby Friel',
    role: 'Founder, Still Life Story',
  },
  {
    img: IMG.shelby,
    quote: "Creating custom dashboards lets us focus on our core product performance without needing to export and clean the data. It allows us to stay nimble and reactive.",
    name: 'Shelby Adams',
    role: 'Operations Manager, Cleverhood',
  },
];

const faq = [
  { q: 'How does real-time analytics work?', a: "Every sale, session, and customer event is captured and reflected in your dashboard within seconds. There's no batch processing or daily delays — your data is always current." },
  { q: 'What is CommerceQL?', a: "CommerceQL is our commerce-specific query language built into every report. Write custom queries to answer specific business questions, or simply ask our AI to write them for you." },
  { q: 'Can I build custom dashboards?', a: "Yes. Drag and drop any metric widget onto your homepage dashboard. Rearrange, resize, and focus on exactly what matters to your business — no engineering work needed." },
  { q: 'How does the Live View work?', a: "Live View shows you every sale rolling in on an animated world map in real time. See total sales, top products, and geographic data as they happen — essential during big events like BFCM." },
  { q: 'Can I connect external analytics tools?', a: "Yes. Connect Google Analytics 4, Meta Pixel, Klaviyo, and 1,000+ analytics integrations from the app store. Our API also gives raw event access for warehouse or BI tool integrations." },
  { q: 'How does benchmarking work?', a: "CommerceHub aggregates anonymised performance data across similar businesses in your industry and size tier. You see how your conversion rate, AOV, and growth compare — without exposing anyone's private data." },
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

/* Animated stats counter */
function AnimCounter({ from, to, suffix = '', duration = 1.5 }) {
  const [val, setVal] = useState(from);
  const hasAnimated = useRef(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !hasAnimated.current) {
        hasAnimated.current = true;
        const steps = 60;
        let step = 0;
        const timer = setInterval(() => {
          step++;
          setVal(Math.round(from + (to - from) * (step / steps)));
          if (step >= steps) clearInterval(timer);
        }, (duration * 1000) / steps);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [from, to, duration]);

  return <span ref={ref}>{val}{suffix}</span>;
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
});

/* ───────────────────────────────────────── PAGE */
export default function LiveAnalyticsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('prebuilt');
  const ct = reportingTabs.find(t => t.id === activeTab);

  // Animate chart cards in on scroll
  const chartRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: chartRef, offset: ['start end', 'end start'] });
  const chartX = useTransform(scrollYProgress, [0, 1], ['0%', '-5%']);

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative bg-black text-white pt-36 pb-0 px-6 overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-[#DC2626]/8 rounded-full blur-[180px]" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-[#DC2626] mb-7">
              <span className="w-5 h-[2px] bg-[#DC2626]" />Live Analytics
            </span>
            <h1 className="text-[clamp(2.8rem,5.5vw,4.8rem)] font-black leading-[1.0] tracking-tight text-white mb-6">
              Make smart decisions, fast
            </h1>
            <p className="text-gray-400 text-lg font-medium leading-relaxed mb-10 max-w-lg">
              Real-time and reliable data about your store — no setup required. Watch every sale, spot every trend, and stay ahead of every change.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => navigate('/register')} className="px-8 py-4 bg-[#DC2626] text-white font-black rounded-2xl hover:bg-[#B91C1C] active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2 group">
                View your analytics <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate('/pricing')} className="px-8 py-4 bg-white/[0.06] border border-white/[0.12] text-white font-black rounded-2xl hover:bg-white/[0.12] transition-all text-sm">
                View pricing
              </button>
            </div>
          </motion.div>

          {/* Right: Hero chart collage */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }} className="relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-white/[0.07]">
              <img src={IMG.heroCollage} alt="Sales and analytics charts" className="w-full object-cover" loading="eager" />
            </div>
            {/* Floating live badge */}
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }}
              className="absolute -top-4 -right-4 bg-[#DC2626] text-white rounded-2xl px-5 py-4 shadow-xl z-10 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
              </span>
              <span className="font-black text-sm">Live now</span>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 }}
              className="absolute -bottom-4 -left-4 bg-white text-black rounded-2xl px-5 py-4 shadow-xl z-10">
              <p className="text-[#DC2626] font-black text-2xl leading-none"><AnimCounter from={0} to={50} suffix="%" /></p>
              <p className="text-gray-600 text-xs font-semibold mt-0.5">YoY revenue growth</p>
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
            {heroStats.map((s, i) => {
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
                    {s.pulse && <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] animate-pulse flex-shrink-0" />}
                  </div>
                  <p className="text-gray-300 text-sm font-bold mb-1">{s.label}</p>
                  <p className="text-gray-600 text-xs font-medium">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── REPORTING FEATURE TABS ── */}
      <section className="bg-[#0a0a0a] py-28 px-6 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="mb-14">
            <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-[#DC2626] mb-5">Reporting</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight max-w-2xl">
              Fast, flexible, and relevant reporting
            </h2>
          </motion.div>

          {/* Tab pills */}
          <div className="flex flex-wrap gap-3 mb-10">
            {reportingTabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-full border text-sm font-bold transition-all ${
                  activeTab === tab.id ? 'bg-[#DC2626] border-[#DC2626] text-white shadow-lg shadow-[#DC2626]/25' : 'bg-white/[0.04] border-white/[0.08] text-gray-400 hover:border-white/20 hover:text-white'
                }`}>
                <span className={activeTab === tab.id ? 'text-white' : 'text-[#DC2626]'}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {ct.badges.map(b => (
                    <span key={b} className="bg-[#DC2626]/15 text-[#DC2626] text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">{b}</span>
                  ))}
                </div>
                <h3 className="text-3xl font-black text-white mb-5">{ct.heading}</h3>
                <p className="text-gray-400 text-base font-medium leading-relaxed mb-8">{ct.desc}</p>
                <button onClick={() => navigate('/register')} className="inline-flex items-center gap-2 bg-[#DC2626] text-white font-black text-sm px-7 py-4 rounded-2xl hover:bg-[#B91C1C] transition-all group">
                  {ct.cta} <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              <div className="rounded-3xl overflow-hidden border border-white/[0.07] bg-[#111] shadow-2xl">
                <div className="bg-[#1a1a1a] flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]">
                  <span className="w-3 h-3 rounded-full bg-[#DC2626]/70" /><span className="w-3 h-3 rounded-full bg-white/20" /><span className="w-3 h-3 rounded-full bg-white/20" />
                  <div className="ml-3 h-4 flex-1 bg-white/[0.04] rounded" />
                </div>
                <img src={ct.img} alt={ct.heading} className="w-full object-cover max-h-[420px]" loading="lazy" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── CHART GRID (MASONRY STRIP) ── */}
      <section className="bg-[#f7f7f7] py-28 px-6" ref={chartRef}>
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-[#DC2626] mb-5">Essential analytics</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-5">
              All your key metrics, in one place
            </h2>
            <p className="text-gray-500 text-base font-medium max-w-xl mx-auto">
              Choose from 100+ metrics to build dashboards and reports that answer exactly the questions your business needs.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {chartCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.04 }}
                className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all"
              >
                <img src={card.img} alt={card.label} className="w-full object-cover max-h-[180px]" loading="lazy" />
                <div className="p-4">
                  <p className="text-gray-800 font-black text-sm">{card.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REPORT TYPES GRID ── */}
      <section className="bg-black py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-[#DC2626] mb-5">Report types</span>
            <h2 className="text-4xl font-black text-white leading-tight mb-4">Everything you need to measure</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {reportTypes.map((r, i) => (
              <motion.div key={i} {...fadeUp(i * 0.07)} className="group bg-white/[0.03] border border-white/[0.07] rounded-3xl p-9 hover:border-[#DC2626]/40 hover:bg-white/[0.05] transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[#DC2626]/15 text-[#DC2626] flex items-center justify-center mb-6 group-hover:bg-[#DC2626] group-hover:text-white transition-all">
                  {r.icon}
                </div>
                <h3 className="text-white font-black text-lg mb-2.5">{r.heading}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{r.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE VIEW ── */}
      <section className="bg-[#0a0a0a] py-28 px-6 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div {...fadeUp()}>
            <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.25em] text-[#DC2626] mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DC2626] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#DC2626]" />
              </span>
              Live View
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">Watch every sale roll in</h2>
            <p className="text-gray-400 text-base leading-relaxed mb-6 max-w-lg">
              Follow flash sales, Black Friday Cyber Monday (BFCM), and major promotions in real time with dynamic metrics, geographical data, and rich visualisations — as they happen.
            </p>
            <ul className="space-y-3 mb-10">
              {[
                'Live global visitor map with purchase popups',
                'Real-time sales total & order counter',
                'Top products and collections right now',
                'Geographic breakdown by country and city',
                'Session counts vs historical averages',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#DC2626]/20 text-[#DC2626] flex items-center justify-center shrink-0">
                    <ArrowRightIcon className="w-3 h-3" />
                  </div>
                  <span className="text-gray-300 text-sm font-semibold">{item}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => navigate('/register')} className="inline-flex items-center gap-2 bg-[#DC2626] text-white font-black text-sm px-7 py-4 rounded-2xl hover:bg-[#B91C1C] transition-all group">
              View live metrics <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
          <motion.div {...fadeUp(0.15)} className="rounded-3xl overflow-hidden border border-white/[0.07] shadow-2xl">
            <img src={IMG.liveGlobe} alt="Live view global map" className="w-full object-cover" loading="lazy" />
          </motion.div>
        </div>
      </section>

      {/* ── MARKETING MEASUREMENT ── */}
      <section className="bg-white py-28 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <motion.div {...fadeUp(0.1)} className="order-2 lg:order-1 rounded-3xl overflow-hidden border border-gray-100 shadow-xl">
            <img src={IMG.marketingMeasure} alt="Marketing measurement" className="w-full object-cover" loading="lazy" />
          </motion.div>
          <motion.div {...fadeUp()} className="order-1 lg:order-2">
            <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-[#DC2626] mb-6">Marketing measurement</span>
            <h2 className="text-4xl font-black text-gray-900 leading-tight mb-5">Measure every marketing dollar</h2>
            <p className="text-gray-600 text-base leading-relaxed mb-6">
              Organise multichannel marketing into Campaigns — auto-generating shareable links and QR codes that attribute traffic and sales correctly. Understand ROAS, CAC, and top channels at a glance.
            </p>
            <ul className="space-y-3 mb-10">
              {[
                'Campaign-level attribution',
                'UTM link & QR code generator',
                'Channel comparison (email, social, ads, organic)',
                'Customer acquisition cost (CAC) tracking',
                'Return on ad spend (ROAS) reports',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#DC2626]/10 text-[#DC2626] flex items-center justify-center shrink-0">
                    <ArrowRightIcon className="w-3 h-3" />
                  </div>
                  <span className="text-gray-700 text-sm font-semibold">{item}</span>
                </li>
              ))}
            </ul>
            <button onClick={() => navigate('/register')} className="inline-flex items-center gap-2 bg-black text-white font-black text-sm px-7 py-4 rounded-2xl hover:bg-gray-900 transition-all group">
              Explore marketing reports <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-[#f7f7f7] py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Analytics that change businesses</h2>
            <p className="text-gray-500 text-base font-medium">Real results from real merchants.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={i} {...fadeUp(i * 0.1)} className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow flex flex-col">
                <div className="flex mb-5">
                  {[...Array(5)].map((_, j) => (<StarIcon key={j} className="w-4 h-4 text-[#DC2626] fill-[#DC2626]" />))}
                </div>
                <blockquote className="text-gray-900 text-lg font-black leading-snug mb-6 flex-1">"{t.quote}"</blockquote>
                <div className="flex items-center gap-4">
                  <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full object-cover" loading="lazy" />
                  <div>
                    <p className="text-gray-900 font-black text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs font-medium">{t.role}</p>
                  </div>
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
            <p className="text-gray-500 text-base font-medium">Everything about CommerceHub analytics.</p>
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
          <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-[#DC2626] mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#DC2626] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#DC2626]" />
            </span>
            Start measuring today
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            Start measuring with CommerceHub
          </h2>
          <p className="text-gray-400 text-xl font-medium mb-12 leading-relaxed">
            Try for free, and explore all the tools you need to grow your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/register')} className="px-10 py-5 bg-[#DC2626] text-white font-black rounded-2xl hover:bg-[#B91C1C] transition-all text-sm flex items-center justify-center gap-2 group">
              Start free trial <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
