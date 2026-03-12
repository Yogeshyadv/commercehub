import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRightIcon, BarChart2Icon, TrendingUpIcon, RefreshCwIcon,
  GlobeIcon, UsersIcon, ShoppingCartIcon, ZapIcon, SearchIcon,
  ChevronDownIcon, CheckCircle2Icon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import HeroSection from '../components/marketing/HeroSection';
import CTASection from '../components/marketing/CTASection';
import { SectionWrapper, SectionHeading, PremiumCard } from '../components/marketing/Layout';
import { FeatureGrid } from '../components/marketing/FeatureGrid';

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
  conversionRate:    `${CDN}/004bf601a526e822ff6ce173340952ab.png`,
};

/* ───────────────────────────────────────── DATA */
const heroStats = [
  { value: 'Real-time', label: 'Live updates', icon: RefreshCwIcon },
  { value: '100+',      label: 'Pre-built reports', icon: BarChart2Icon },
  { value: 'Insights', label: 'AI-driven', icon: SearchIcon },
  { value: 'Benchmark', label: 'Industry-wide', icon: TrendingUpIcon },
];

const chartCards = [
  { img: IMG.totalSales,        label: 'Total sales' },
  { img: IMG.sessionsByDevice,  label: 'Sessions by device' },
  { img: IMG.conversionRate,    label: 'Conversion rate' },
  { img: IMG.customersOverTime, label: 'Customers over time' },
  { img: IMG.grossByCountry,    label: 'Gross sales by country' },
  { img: IMG.salesByProduct,    label: 'Sales by product' },
];

const reportingTabs = [
  {
    id: 'prebuilt',
    icon: <BarChart2Icon className="w-5 h-5" />,
    label: 'Pre-built reports',
    heading: 'Commerce reports, ready instantly',
    desc: "Access Shopify-built reports designed specifically for commerce insights. Immediately understand your store's performance with no additional setup.",
    img: IMG.heroCollage,
    badges: ['Sales', 'Conversion', 'Inventory'],
  },
  {
    id: 'custom',
    icon: <SearchIcon className="w-5 h-5" />,
    label: 'Custom exploration',
    heading: 'Drill down into your data',
    desc: "Modify pre-built reports or create your own from scratch. Layer on additional metrics and dimensions using CommerceQL.",
    img: IMG.marketingChannels,
    badges: ['CommerceQL', 'Filters', 'Segments'],
  },
  {
    id: 'realtime',
    icon: <RefreshCwIcon className="w-5 h-5" />,
    label: 'Real-time monitoring',
    heading: 'Your dashboard, live and personal',
    desc: "Never miss a change in performance. Drag, drop, and tailor your dashboard to your most critical metrics. All data updates in real time.",
    img: IMG.liveGlobe,
    badges: ['Live data', 'Alerts', 'Mobile ready'],
  },
];

const reportTypes = [
  { icon: TrendingUpIcon, title: 'Sales reports', desc: 'Know exactly how much your store is making across all channels.' },
  { icon: UsersIcon, title: 'Customer reports', desc: 'Understand who your customers are and where they come from.' },
  { icon: ShoppingCartIcon, title: 'Conversion reports', desc: 'Pinpoint where shoppers drop off and what it takes to turn them into buyers.' },
  { icon: GlobeIcon, title: 'Traffic & sessions', desc: 'See site traffic sources — country, device, and referral sources.' },
  { icon: BarChart2Icon, title: 'Marketing reports', desc: 'Track ROAS, CAC, and top channels at a glance.' },
  { icon: ZapIcon, title: 'Benchmark reports', desc: "Compare your performance to similar businesses on CommerceHub." },
];

const faq = [
  { q: 'How does real-time analytics work?', a: "Every sale, session, and customer event is captured and reflected in your dashboard within seconds. There's no batch processing or daily delays." },
  { q: 'What is CommerceQL?', a: "CommerceQL is our commerce-specific query language built into every report. Write custom queries to answer specific business questions effortlessly." },
  { q: 'Can I build custom dashboards?', a: "Yes. Drag and drop any metric widget onto your homepage dashboard. Rearrange and resize to focus on exactly what matters." },
  { q: 'Can I connect external tools?', a: "Yes. Connect GA4, Meta Pixel, Klaviyo, and 1,000+ analytics integrations from the app store easily." },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors px-4">
      <button onClick={() => setOpen(o => !o)} className="w-full text-left flex items-center justify-between py-6 group">
        <span className="font-bold text-black text-lg group-hover:text-red-600 transition-colors pr-8">{q}</span>
        <ChevronDownIcon className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-red-600' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
           <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
             <p className="text-gray-600 text-base leading-relaxed pb-6 pl-1 font-medium">{a}</p>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LiveAnalyticsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('prebuilt');
  const ct = reportingTabs.find(t => t.id === activeTab);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <HeroSection 
        badge="Live Analytics"
        title="Make smart decisions, fast"
        subtitle="Real-time and reliable data about your store — no setup required. Watch every sale, spot every trend, and stay ahead."
        primaryCTA={{ text: "View analytics", path: "/register" }}
        secondaryCTA={{ text: "View pricing", path: "/pricing" }}
        visual={
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-2xl">
              <div className="bg-gray-50 px-5 py-3.5 border-b border-gray-100 flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600" />
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#DC2626]">Live</span>
              </div>
              <img src={IMG.heroCollage} alt="Analytics Dashboard" className="w-full object-cover" />
            </div>
          </div>
        }
      />

      <SectionWrapper variant="secondary" className="border-y border-gray-100">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {heroStats.map((s, i) => (
            <motion.div key={i} className="text-center group">
              <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center mx-auto mb-6 group-hover:bg-red-50 group-hover:border-red-100 transition-all duration-300 shadow-sm">
                <s.icon className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" />
              </div>
              <p className="text-3xl font-extrabold text-black mb-2 tracking-tight transition-colors uppercase">{s.value}</p>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest leading-tight">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper variant="primary">
        <SectionHeading 
          title="Fast, flexible, and relevant reporting"
          subtitle="Access pre-built reports or build your own custom dashboards in seconds with our integrated analytics engine."
        />
        
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {reportingTabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-full border text-sm font-bold transition-all duration-300 ${
                activeTab === tab.id 
                ? 'bg-black border-black text-white shadow-lg' 
                : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200 hover:text-black'
              }`}>
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <div className="flex gap-2 mb-6">
                {ct.badges.map(b => (
                  <span key={b} className="px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-600 text-[10px] font-black uppercase tracking-widest">{b}</span>
                ))}
              </div>
              <h3 className="text-4xl font-extrabold text-black mb-6 tracking-tight">{ct.heading}</h3>
              <p className="text-lg text-gray-600 font-medium leading-relaxed mb-10">{ct.desc}</p>
              <button 
                onClick={() => navigate('/register')} 
                className="px-8 py-4 bg-gray-50 border border-gray-100 hover:bg-gray-100 text-black font-bold rounded-2xl transition-all flex items-center gap-2 group"
              >
                Try reporting <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-gray-50 rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm">
              <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-600/60" />
                <div className="h-4 w-40 bg-gray-100 rounded-full" />
              </div>
              <img src={ct.img} alt={ct.heading} className="w-full h-[400px] object-cover" />
            </div>
          </motion.div>
        </AnimatePresence>
      </SectionWrapper>

      <SectionWrapper variant="secondary">
        <SectionHeading 
          title="All your key metrics, in one place"
          subtitle="Choose from 100+ commerce-specific charts designed to give you instant clarity."
        />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {chartCards.map((card, i) => (
             <div key={i} className="bg-white rounded-3xl overflow-hidden border border-gray-100 group shadow-sm hover:shadow-xl transition-all duration-300">
               <img src={card.img} alt={card.label} className="w-full h-[200px] object-cover group-hover:scale-105 transition-transform duration-500" />
               <div className="p-6 bg-white border-t border-gray-50">
                 <p className="font-extrabold text-black tracking-tight">{card.label}</p>
               </div>
             </div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper variant="primary">
        <SectionHeading 
          title="Everything you need to measure"
          subtitle="Full funnel visibility across every sales and marketing channel."
        />
        <FeatureGrid items={reportTypes} columns={3} />
      </SectionWrapper>

      {/* FAQ */}
      <SectionWrapper variant="secondary">
        <div className="max-w-4xl mx-auto">
          <SectionHeading title="Common questions" />
          <div className="bg-white border border-gray-100 rounded-[2rem] p-4 sm:p-8 shadow-sm">
            {faq.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </SectionWrapper>

      <CTASection />
      <Footer />
    </div>
  );
}
