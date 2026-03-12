import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon, SearchIcon, TrendingUpIcon, GlobeIcon, LinkIcon,
  ZapIcon, BarChart2Icon, CheckIcon, StarIcon, FileTextIcon,
  MapPinIcon, RefreshCwIcon, TargetIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

const CDN = 'https://cdn.shopify.com/b/shopify-brochure2-assets';
const CF  = 'https://dwtqm09zovi8z.cloudfront.net/assets';

/* ─── SEO TOOLS LIST ─── */
const seoTools = [
  {
    icon: <SearchIcon       className="w-6 h-6" />,
    heading: 'Auto-generated SEO meta tags',
    desc: "CommerceHub writes optimised meta titles and descriptions for every product and collection page automatically. You can edit them — or let AI handle it.",
    color: '#DC2626',
  },
  {
    icon: <GlobeIcon        className="w-6 h-6" />,
    heading: 'Automatic sitemap generation',
    desc: 'A clean, always-up-to-date XML sitemap is generated automatically and submitted to Google and Bing every time you add or update products.',
    color: '#7C3AED',
  },
  {
    icon: <LinkIcon         className="w-6 h-6" />,
    heading: 'Smart 301 redirect manager',
    desc: 'Changed a URL? CommerceHub automatically creates a 301 redirect so you never lose SEO juice or send customers to broken pages.',
    color: '#0284C7',
  },
  {
    icon: <FileTextIcon     className="w-6 h-6" />,
    heading: 'Structured data (Schema.org)',
    desc: 'Product rich snippets, breadcrumbs, and review stars are added automatically. Get enhanced listings in Google search results with zero code.',
    color: '#059669',
  },
  {
    icon: <ZapIcon          className="w-6 h-6" />,
    heading: 'Page speed optimisation',
    desc: 'All themes are built to Core Web Vitals standards. Images are auto-compressed, code is minified, and assets are served from a global CDN — out of the box.',
    color: '#EA580C',
  },
  {
    icon: <MapPinIcon       className="w-6 h-6" />,
    heading: 'Local SEO for physical stores',
    desc: 'If you have a physical location, CommerceHub integrates with Google My Business to keep your local listings accurate and optimised.',
    color: '#BE185D',
  },
  {
    icon: <TrendingUpIcon   className="w-6 h-6" />,
    heading: 'SEO audit & recommendations',
    desc: 'Get a live score for every page and actionable recommendations — fix thin content, missing alt text, or duplicate titles in one click.',
    color: '#DC2626',
  },
  {
    icon: <RefreshCwIcon    className="w-6 h-6" />,
    heading: 'Canonical URL control',
    desc: 'Prevent duplicate content penalties. CommerceHub lets you set canonical URLs on every page, collection, and product variant.',
    color: '#7C3AED',
  },
];

/* ─── KEY FEATURES (big alternating) ─── */
const features = [
  {
    icon: <SearchIcon className="w-6 h-6" />,
    heading: 'AI-powered SEO that writes itself',
    desc: 'Our AI analyses your products and generates SEO-optimised titles, descriptions, and alt text based on what actually ranks for your category. Edit anything, or let it run on autopilot.',
    img: `${CDN}/ebc54e1da391c75a5a98649fa293484a.webp`,
    color: '#DC2626',
  },
  {
    icon: <BarChart2Icon className="w-6 h-6" />,
    heading: 'See your organic performance in real time',
    desc: 'Track keyword rankings, organic sessions, and revenue attributed to SEO — all inside your dashboard. Know which pages to improve and which to double down on.',
    img: `${CDN}/4dd1cce5beb0f5dbb46115e31e300f80.webp`,
    color: '#7C3AED',
  },
  {
    icon: <ZapIcon className="w-6 h-6" />,
    heading: 'The fastest stores rank higher',
    desc: 'Google uses Core Web Vitals as a ranking factor. CommerceHub stores average 95+ Lighthouse scores out of the box — no plugin configuration, no developer needed.',
    img: `${CF}/boost_personal_commerce_3.webp`,
    color: '#0284C7',
  },
];

/* ─── STATS ─── */
const stats = [
  { val: '95+',  label: 'average Lighthouse performance score' },
  { val: '2×',   label: 'organic traffic growth in first 6 months' },
  { val: '100%', label: 'of pages get structured data automatically' },
  { val: '<50ms', label: 'server response time globally' },
];

/* ─── CHECKLIST ─── */
const checklist = [
  'Editable title tags & meta descriptions on every page',
  'Auto-generated XML sitemap submitted to Google',
  'Image alt text editor for all product photos',
  '301 redirect manager — no broken links ever',
  'Schema.org structured data for rich snippets',
  'Canonical URL control for variants & collections',
  'Robots.txt editor',
  'Google Search Console integration',
  'Google Analytics 4 integration',
  'Social meta tags (Open Graph, Twitter Card)',
  'Mobile-first responsive design on all themes',
  'Global CDN for fastest page load times',
];

/* ─── TESTIMONIALS ─── */
const testimonials = [
  {
    quote: 'Our organic traffic tripled in 8 months after switching to CommerceHub. The auto-generated meta tags alone saved us 20 hours a month.',
    name: 'Sarah Mitchell', title: 'Owner, Botanica Market', avatar: 'S', stars: 5,
  },
  {
    quote: 'CommerceHub\'s structured data means we have review stars in Google results for every product. Our CTR went up 46%.',
    name: 'Arjun Mehta', title: 'Head of eCommerce, Spice Route', avatar: 'A', stars: 5,
  },
  {
    quote: 'I used to hire a freelancer to manage redirects every time I updated URLs. CommerceHub does it automatically — it\'s one less thing to think about.',
    name: 'Luisa Fernandez', title: 'Founder, Casa Linen', avatar: 'L', stars: 5,
  },
];

/* ─── RANKING FACTORS TABLE ─── */
const rankingFactors = [
  { factor: 'Page speed (Core Web Vitals)',   ch: true,  diy: false },
  { factor: 'Auto sitemap generation',        ch: true,  diy: false },
  { factor: 'Structured data / Schema.org',  ch: true,  diy: false },
  { factor: 'Auto 301 redirects',            ch: true,  diy: false },
  { factor: 'Canonical URL management',      ch: true,  diy: false },
  { factor: 'Global CDN',                    ch: true,  diy: false },
  { factor: 'Mobile-first responsive themes',ch: true,  diy: true  },
  { factor: 'Meta tag control',              ch: true,  diy: true  },
];

export default function SEOToolsPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-white text-black min-h-screen font-sans">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-32 pb-28 text-center">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 65% 50% at 50% -5%, rgba(220,38,38,0.26) 0%, transparent 68%)' }} />
        <div className="relative max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#DC2626] mb-6 px-3 py-1.5 rounded-full border border-[#DC2626]/30 bg-[#DC2626]/10">
              SEO Tools
            </span>
            <h1 className="text-5xl sm:text-7xl font-black leading-[0.93] tracking-tight mb-6">
              Rank higher.
              <br />
              <span className="text-[#DC2626]">Sell more. Automatically.</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
              CommerceHub handles 90% of your SEO automatically — sitemap, structured data, 301 redirects, and page speed — so you can focus on your business, not technical SEO.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/register')} className="inline-flex items-center gap-2 bg-[#DC2626] hover:bg-[#b91c1c] text-white font-bold text-base px-8 py-4 rounded-full transition-all duration-200 shadow-lg shadow-red-900/30">
                Start free trial <ArrowRightIcon className="w-4 h-4" />
              </button>
              <button onClick={() => navigate('/pricing')} className="inline-flex items-center gap-2 border border-white/15 hover:border-white/40 text-white font-semibold text-base px-8 py-4 rounded-full transition-all duration-200">
                See pricing
              </button>
            </div>
          </motion.div>

          {/* mock SEO score card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-16 max-w-xl mx-auto bg-[#0a0a0a] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl"
          >
            <div className="flex items-center gap-2 px-5 py-3.5 bg-[#111] border-b border-white/[0.06]">
              <span className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <span className="w-3 h-3 rounded-full bg-[#28CA41]" />
              <span className="ml-4 flex-1 bg-[#1a1a1a] rounded-md px-3 py-1 text-xs text-gray-600">SEO Performance</span>
            </div>
            <div className="p-7 space-y-5">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs text-gray-600 uppercase tracking-wider mb-1">Overall SEO Score</p>
                  <p className="text-5xl font-black text-[#DC2626]">97</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600 mb-1">Lighthouse Performance</p>
                  <p className="text-2xl font-black text-green-400">98</p>
                </div>
              </div>
              {[
                { label: 'Meta tags',          score: 100, color: '#DC2626' },
                { label: 'Structured data',    score: 100, color: '#DC2626' },
                { label: 'Page speed',         score: 98,  color: '#DC2626' },
                { label: 'Mobile usability',   score: 100, color: '#DC2626' },
                { label: 'Sitemap',            score: 100, color: '#DC2626' },
              ].map(({ label, score, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-400">{label}</span>
                    <span className="font-bold" style={{ color }}>{score}</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${score}%`, background: color }} />
                  </div>
                </div>
              ))}
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

      {/* ── FEATURES (alternating) ── */}
      <section className="py-24 bg-white">
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

      {/* ── SEO TOOLS GRID ── */}
      <section className="py-24 bg-[#060606]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-black mb-4">Everything SEO, built in</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">No plugins, no extra cost. Every tool you need to rank is included on every plan.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {seoTools.map((t, i) => (
              <motion.div
                key={t.heading}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.07 }}
                className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.14] transition-all duration-300"
              >
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4" style={{ background: `${t.color}14`, color: t.color }}>
                  {t.icon}
                </span>
                <h3 className="font-black text-white text-sm mb-2">{t.heading}</h3>
                <p className="text-gray-600 text-xs leading-relaxed">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHECKLIST vs DIY ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3">CommerceHub vs. DIY SEO</h2>
            <p className="text-gray-500">Technical SEO handled for you — no plugins, no developers, no headaches.</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-[#0a0a0a]">
                  <th className="text-left px-6 py-4 text-gray-500 font-semibold">Ranking factor</th>
                  <th className="px-6 py-4 text-center font-black text-[#DC2626] text-xs uppercase tracking-wide">CommerceHub</th>
                  <th className="px-6 py-4 text-center font-black text-gray-600 text-xs uppercase tracking-wide">DIY / Others</th>
                </tr>
              </thead>
              <tbody>
                {rankingFactors.map((row, i) => (
                  <tr key={row.factor} className={`border-b border-white/[0.04] ${i % 2 === 0 ? 'bg-[#060606]' : 'bg-[#080808]'}`}>
                    <td className="px-6 py-4 text-gray-300 font-medium">{row.factor}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#DC2626]/15 text-[#DC2626]">
                        <CheckIcon className="w-4 h-4" strokeWidth={2.5} />
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {row.diy ? (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-green-900/20 text-green-400">
                          <CheckIcon className="w-4 h-4" strokeWidth={2.5} />
                        </span>
                      ) : (
                        <span className="text-xs font-semibold text-gray-600 bg-white/[0.04] px-3 py-1 rounded-full">Manual setup</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── FULL CHECKLIST ── */}
      <section className="py-20 bg-[#060606]">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-black text-white mb-10 text-center">Complete SEO feature list</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {checklist.map((item) => (
              <div key={item} className="flex items-start gap-3 bg-[#0a0a0a] border border-white/[0.06] rounded-xl px-5 py-3.5">
                <CheckIcon className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" strokeWidth={2.5} />
                <span className="text-gray-400 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-black text-center mb-12">Merchants ranking with CommerceHub</h2>
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
      <section className="relative py-32 bg-[#060606] overflow-hidden text-center">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 55% 45% at 50% 100%, rgba(220,38,38,0.2) 0%, transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto px-6">
          <h2 className="text-5xl sm:text-6xl font-black leading-tight mb-6">
            The best SEO tool
            <br />
            <span className="text-[#DC2626]">is your store itself.</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10">Start ranking from day one. No setup required.</p>
          <button onClick={() => navigate('/register')} className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-black font-black text-lg px-10 py-4 rounded-full transition-all duration-200 shadow-xl shadow-white/5">
            Start free trial <ArrowRightIcon className="w-5 h-5" />
          </button>
          <p className="text-gray-700 text-sm mt-4">No credit card · Free migration support</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
