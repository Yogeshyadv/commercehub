import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon, DownloadIcon, MailIcon, SearchIcon, ClockIcon,
  ExternalLinkIcon, CheckIcon, StarIcon, FileTextIcon, ImageIcon,
  VideoIcon, MicIcon, GlobeIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

const CDN = 'https://cdn.shopify.com/b/shopify-brochure2-assets';

/* ─── STATS ─── */
const stats = [
  { val: '$12B',  label: 'current valuation (Series D)' },
  { val: '2M+',   label: 'merchants on the platform' },
  { val: '$220B', label: 'GMV processed in 2025' },
  { val: '2014',  label: 'founded in Bengaluru, India' },
];

/* ─── PRESS RELEASES (latest) ─── */
const pressReleases = [
  { date: 'Mar 3, 2026',  tag: 'Product',     title: 'CommerceHub launches AI Storefront Builder — build a full store in under 10 minutes',      excerpt: 'The new AI-powered wizard uses a 5-question interview to generate a fully designed, copy-written, and product-populated storefront with zero manual setup.' },
  { date: 'Feb 18, 2026', tag: 'Funding',     title: 'CommerceHub raises $500M Series D at $12B valuation led by Sequoia Capital',                excerpt: 'The funding round will accelerate international expansion across MENA and Latin America, and double the engineering headcount over 18 months.' },
  { date: 'Jan 22, 2026', tag: 'Partnership', title: 'CommerceHub and Meta deepen integration to power Social Commerce checkout natively',        excerpt: 'Merchants can now complete sales directly within Instagram and WhatsApp without leaving the app, with full inventory sync and CommerceHub analytics.' },
  { date: 'Jan 7, 2026',  tag: 'Milestone',   title: 'CommerceHub surpasses $220B in annual GMV, crosses 2 million active merchant milestone',   excerpt: 'The company attributes growth to its Plus plan expansion, B2B launch, and AI-driven conversion improvements averaging 18% uplift per store.' },
  { date: 'Dec 5, 2025',  tag: 'Awards',      title: 'CommerceHub named "Best Commerce Platform" for third consecutive year by G2 and Forrester', excerpt: 'Recognised for merchant satisfaction, uptime reliability, developer ecosystem depth, and support quality across all plan tiers.' },
  { date: 'Nov 18, 2025', tag: 'Product',     title: 'CommerceHub Markets 2.0: localised storefronts, duties automation, and 60 new currencies',  excerpt: 'The biggest international update in company history makes selling in 175 countries as simple as selling in one, with automated compliance and localised checkout.' },
];

/* ─── NEWS COVERAGE ─── */
const coverage = [
  { outlet: 'TechCrunch',      date: 'Feb 18, 2026', headline: '"CommerceHub raises $500M — and it\'s still the most underrated commerce platform on the planet"', url: '#' },
  { outlet: 'Economic Times',  date: 'Feb 19, 2026', headline: '"From garage startup to $12B unicorn: the CommerceHub story is India\'s best-kept tech secret"',   url: '#' },
  { outlet: 'Forbes',          date: 'Jan 8, 2026',  headline: '"The e-commerce platform 2 million merchants swear by — and most people have never heard of"',       url: '#' },
  { outlet: 'Business Insider',date: 'Jan 7, 2026',  headline: '"CommerceHub crosses 2M merchants, challenges Shopify in emerging markets"',                          url: '#' },
  { outlet: 'Wired',           date: 'Dec 6, 2025',  headline: '"How CommerceHub built the most reliable checkout in the industry"',                                   url: '#' },
  { outlet: 'The Ken',         date: 'Nov 20, 2025', headline: '"CommerceHub\'s globalisation play is a masterclass in product localisation"',                        url: '#' },
];

/* ─── AWARDS ─── */
const awards = [
  { name: 'G2 Best Commerce Platform',      year: '2024 & 2025 & 2026', org: 'G2' },
  { name: 'Forrester Wave Leader',           year: '2025',               org: 'Forrester' },
  { name: 'Best Employer — Tech Sector',    year: '2025',               org: 'Great Place to Work' },
  { name: 'Best API Platform — Devs Choice', year: '2025',              org: 'API World' },
  { name: 'Top Rated SaaS — Asia Pacific',  year: '2024 & 2025',        org: 'GetApp' },
  { name: 'Climate Positive Technology',    year: '2025',               org: 'CarbonZero Council' },
];

/* ─── BRAND ASSETS ─── */
const brandAssets = [
  { icon: <ImageIcon className="w-5 h-5" />,    label: 'Logo pack (SVG, PNG)',          size: '2.4 MB',  color: '#0284C7' },
  { icon: <FileTextIcon className="w-5 h-5" />, label: 'Brand guidelines (PDF)',         size: '8.1 MB',  color: '#059669' },
  { icon: <ImageIcon className="w-5 h-5" />,    label: 'Product screenshots (ZIP)',      size: '42 MB',   color: '#7C3AED' },
  { icon: <VideoIcon className="w-5 h-5" />,    label: 'B-roll footage (MP4)',           size: '310 MB',  color: '#DC2626' },
  { icon: <FileTextIcon className="w-5 h-5" />, label: 'Executive bios & headshots',     size: '11 MB',   color: '#D97706' },
  { icon: <FileTextIcon className="w-5 h-5" />, label: 'Company fact sheet (PDF)',       size: '900 KB',  color: '#EC4899' },
];

const tagColors = {
  Product:     { bg: '#DC262614', color: '#DC2626' },
  Funding:     { bg: '#D9770614', color: '#D97706' },
  Partnership: { bg: '#028431​14', color: '#059669' },
  Milestone:   { bg: '#0284C714', color: '#0284C7' },
  Awards:      { bg: '#7C3AED14', color: '#7C3AED' },
};

export default function PressMediaPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('All');

  const tags = ['All', 'Product', 'Funding', 'Partnership', 'Milestone', 'Awards'];

  const filteredReleases = pressReleases.filter(pr => {
    const matchesTag = activeTag === 'All' || pr.tag === activeTag;
    const matchesSearch = !search || pr.title.toLowerCase().includes(search.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-32 pb-24 text-center">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 65% 50% at 50% -5%, rgba(220,38,38,0.26) 0%, transparent 68%)' }} />
        <div className="relative max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#DC2626] mb-6 px-3 py-1.5 rounded-full border border-[#DC2626]/30 bg-[#DC2626]/10">
              Press & Media
            </span>
            <h1 className="text-5xl sm:text-7xl font-black leading-[0.93] tracking-tight mb-6">
              The CommerceHub
              <br />
              <span className="text-[#DC2626]">newsroom.</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
              Latest press releases, media coverage, brand assets, and everything a journalist needs to tell the CommerceHub story accurately.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:press@commercehub.io" className="inline-flex items-center gap-2 bg-[#DC2626] hover:bg-[#b91c1c] text-white font-bold text-base px-8 py-4 rounded-full transition-all duration-200 shadow-lg shadow-red-900/30">
                <MailIcon className="w-4 h-4" /> Contact press team
              </a>
              <a href="#brand-assets" className="inline-flex items-center gap-2 border border-white/15 hover:border-white/40 text-white font-semibold text-base px-8 py-4 rounded-full transition-all duration-200">
                <DownloadIcon className="w-4 h-4" /> Download brand kit
              </a>
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

      {/* ── PRESS RELEASES ── */}
      <section className="py-24 bg-black">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-4xl font-black mb-1">Press releases</h2>
              <p className="text-gray-500 text-sm">Official announcements from CommerceHub.</p>
            </div>
            <div className="relative w-full sm:w-64">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search releases..."
                className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-full pl-10 pr-4 py-2.5 text-white placeholder-gray-700 text-sm focus:outline-none focus:border-[#DC2626]/50 transition-colors"
              />
            </div>
          </div>

          {/* tag tabs */}
          <div className="flex items-center gap-2 flex-wrap mb-8">
            {tags.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeTag === tag ? 'bg-[#DC2626] text-white' : 'bg-[#0a0a0a] border border-white/[0.08] text-gray-400 hover:border-white/[0.2] hover:text-white'}`}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredReleases.map((pr, i) => {
              const tc = tagColors[pr.tag] || { bg: '#ffffff10', color: '#9ca3af' };
              return (
                <motion.div
                  key={pr.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.38, delay: i * 0.06 }}
                  className="group bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-7 hover:border-white/[0.16] cursor-pointer transition-all duration-200"
                >
                  <div className="flex items-start gap-4 flex-wrap mb-3">
                    <span className="text-xs font-black uppercase tracking-wide px-2.5 py-1 rounded-full" style={{ background: tc.bg, color: tc.color }}>{pr.tag}</span>
                    <span className="text-gray-600 text-xs flex items-center gap-1 mt-0.5"><ClockIcon className="w-3 h-3" /> {pr.date}</span>
                  </div>
                  <h3 className="text-white font-black text-base leading-snug mb-3 group-hover:text-[#DC2626] transition-colors">{pr.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-4">{pr.excerpt}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DC2626]">
                    Read full release <ArrowRightIcon className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── NEWS COVERAGE ── */}
      <section className="py-20 bg-[#060606]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-black mb-2">In the news</h2>
            <p className="text-gray-500 text-sm">Selected coverage from global press.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {coverage.map((c, i) => (
              <motion.div
                key={c.headline}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.38, delay: i * 0.06 }}
                className="group bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.14] cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[#DC2626] text-xs font-black uppercase tracking-widest">{c.outlet}</p>
                  <span className="text-gray-700 text-xs">{c.date}</span>
                </div>
                <p className="text-gray-300 text-sm font-medium leading-snug italic mb-4">{c.headline}</p>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-600 group-hover:text-[#DC2626] transition-colors">
                  Read article <ExternalLinkIcon className="w-3 h-3" />
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AWARDS ── */}
      <section className="py-20 bg-black">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-2">Recognition & awards</h2>
            <p className="text-gray-500 text-sm">Third-party validation of what our merchants already know.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {awards.map((a, i) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.38, delay: (i % 3) * 0.07 }}
                className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-6 flex items-start gap-4"
              >
                <div className="shrink-0 w-10 h-10 rounded-xl bg-[#DC2626]/10 flex items-center justify-center">
                  <StarIcon className="w-5 h-5 fill-[#DC2626] text-[#DC2626]" />
                </div>
                <div>
                  <p className="text-white font-black text-sm mb-1">{a.name}</p>
                  <p className="text-gray-600 text-xs">{a.org} · {a.year}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRAND ASSETS ── */}
      <section className="py-20 bg-[#060606]" id="brand-assets">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-black mb-2">Brand assets</h2>
            <p className="text-gray-500 text-sm">Official CommerceHub logos, screenshots, and guidelines for press use. Please read our brand guidelines before publishing.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {brandAssets.map((a, i) => (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.38, delay: (i % 3) * 0.07 }}
                className="group bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4 hover:border-white/[0.16] cursor-pointer transition-all"
              >
                <span className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${a.color}14`, color: a.color }}>
                  {a.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm">{a.label}</p>
                  <p className="text-gray-600 text-xs">{a.size}</p>
                </div>
                <DownloadIcon className="w-4 h-4 text-gray-600 group-hover:text-[#DC2626] transition-colors shrink-0" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT PRESS ── */}
      <section className="py-20 bg-black">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-[#0a0a0a] border border-white/[0.07] rounded-3xl p-10 sm:p-14 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#DC2626] mb-5 px-3 py-1.5 rounded-full border border-[#DC2626]/30 bg-[#DC2626]/10">
                <MicIcon className="w-3.5 h-3.5" /> Press contacts
              </span>
              <h2 className="text-3xl font-black mb-4 leading-tight">Working on a story?<br />We want to help.</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">Our press team responds within 4 hours for time-sensitive requests. We offer on-record interviews, merchant case studies, and exclusive data for qualified media.</p>
              <ul className="space-y-2">
                {['On-record exec interviews available', 'Exclusive data & merchant introductions', 'Embargo available for embargoed releases', '4-hour response guarantee for press'].map(b => (
                  <li key={b} className="flex items-center gap-2.5 text-xs text-gray-400">
                    <CheckIcon className="w-3.5 h-3.5 text-[#DC2626] shrink-0" strokeWidth={2.5} /> {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <div className="bg-[#060606] border border-white/[0.06] rounded-2xl p-5">
                <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">Global press enquiries</p>
                <a href="mailto:press@commercehub.io" className="text-white font-black text-base hover:text-[#DC2626] transition-colors">press@commercehub.io</a>
              </div>
              <div className="bg-[#060606] border border-white/[0.06] rounded-2xl p-5">
                <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">India press team</p>
                <a href="mailto:india-press@commercehub.io" className="text-white font-black text-base hover:text-[#DC2626] transition-colors">india-press@commercehub.io</a>
              </div>
              <div className="bg-[#060606] border border-white/[0.06] rounded-2xl p-5">
                <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">Urgent / time-sensitive</p>
                <p className="text-white font-black text-base">+91 80 6789 0000</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative py-28 bg-[#060606] overflow-hidden text-center">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 55% 45% at 50% 100%, rgba(220,38,38,0.2) 0%, transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto px-6">
          <h2 className="text-5xl font-black leading-tight mb-5">Covering the future of commerce?<br /><span className="text-[#DC2626]">Let's talk.</span></h2>
          <p className="text-gray-400 text-lg mb-10">Get exclusive data, merchant stories, and executive access for your next piece.</p>
          <a href="mailto:press@commercehub.io" className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-black font-black text-lg px-10 py-4 rounded-full transition-all duration-200">
            <MailIcon className="w-5 h-5" /> Email the press team
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
