import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon, TrendingUpIcon, MessageSquareIcon, UsersIcon,
  ZapIcon, SearchIcon, StarIcon, CalendarIcon, MicIcon, BookOpenIcon,
  GlobeIcon, AwardIcon, HeartIcon, ThumbsUpIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

const CDN = 'https://cdn.shopify.com/b/shopify-brochure2-assets';

/* ─── STATS ─── */
const stats = [
  { val: '4.4M',   label: 'active community members' },
  { val: '180+',   label: 'countries represented' },
  { val: '50K+',   label: 'discussion threads' },
  { val: '12K',    label: 'new posts every week' },
];

/* ─── CATEGORIES ─── */
const categories = [
  { emoji: '🧑‍💼', name: 'General Discussion',     threads: '12,450', color: '#DC2626', desc: 'Introduce yourself, share wins, and talk shop with fellow merchants.' },
  { emoji: '🛠',  name: 'Technical Help',           threads: '18,220', color: '#7C3AED', desc: 'Troubleshoot themes, apps, checkout issues, and API integrations.' },
  { emoji: '📣',  name: 'Marketing & Growth',       threads: '9,340',  color: '#0284C7', desc: 'Strategies for ads, email, SEO, and building a loyal customer base.' },
  { emoji: '🔌',  name: 'Apps & Integrations',      threads: '14,680', color: '#059669', desc: 'Reviews, comparisons, and help with any app in the CommerceHub ecosystem.' },
  { emoji: '🏆',  name: 'Success Stories',          threads: '3,910',  color: '#D97706', desc: 'Real merchants sharing real milestones — inspiration that fuels your next move.' },
  { emoji: '💡',  name: 'Feature Requests',         threads: '6,830',  color: '#EC4899', desc: 'Vote on and suggest features. Our product team reads every post.' },
  { emoji: '🌍',  name: 'International Selling',    threads: '5,270',  color: '#06B6D4', desc: 'Tax, shipping, currencies, and compliance for cross-border commerce.' },
  { emoji: '🤖',  name: 'AI & Automation',          threads: '4,120',  color: '#8B5CF6', desc: 'Prompts, workflows, and tutorials for using AI in your store.' },
];

/* ─── TRENDING THREADS ─── */
const threads = [
  {
    category: 'Technical Help',
    categoryColor: '#7C3AED',
    title: 'Checkout not loading after app install — here is what fixed it for me',
    author: 'devraj_k',
    avatar: 'D',
    time: '2 hours ago',
    replies: 47,
    upvotes: 213,
    solved: true,
  },
  {
    category: 'Marketing & Growth',
    categoryColor: '#0284C7',
    title: 'How we went from 0 to 10K email subscribers in 90 days — full breakdown',
    author: 'themuniz_co',
    avatar: 'M',
    time: '5 hours ago',
    replies: 89,
    upvotes: 541,
    solved: false,
  },
  {
    category: 'Success Stories',
    categoryColor: '#D97706',
    title: 'Just hit Rs.1 crore monthly GMV — this community helped me get here',
    author: 'spice_route_official',
    avatar: 'S',
    time: '1 day ago',
    replies: 132,
    upvotes: 1890,
    solved: false,
  },
  {
    category: 'Feature Requests',
    categoryColor: '#EC4899',
    title: 'Please add native subscription management — 847 upvotes and counting',
    author: 'yara_builds',
    avatar: 'Y',
    time: '3 days ago',
    replies: 214,
    upvotes: 847,
    solved: false,
  },
  {
    category: 'Apps & Integrations',
    categoryColor: '#059669',
    title: 'Comparison: top 5 review apps in 2025 — my honest take after testing all of them',
    author: 'noor_elashi',
    avatar: 'N',
    time: '4 days ago',
    replies: 63,
    upvotes: 392,
    solved: false,
  },
];

/* ─── COMMUNITY EXPERTS ─── */
const experts = [
  { name: 'Devraj Kumar',     role: 'Technical Expert',      specialty: 'Themes & APIs',       avatar: 'D', replies: '4,120', upvotes: '28K' },
  { name: 'Yara El-Ashri',   role: 'Marketing Mentor',       specialty: 'Email & Paid Ads',    avatar: 'Y', replies: '2,870', upvotes: '19K' },
  { name: 'Carlos Mendez',   role: 'Growth Strategist',      specialty: 'DTC & Conversion',    avatar: 'C', replies: '3,450', upvotes: '24K' },
  { name: 'Noor Patel',      role: 'Apps Specialist',        specialty: 'Integrations & PLM',  avatar: 'N', replies: '2,100', upvotes: '14K' },
];

/* ─── UPCOMING EVENTS ─── */
const events = [
  { badge: 'WEBINAR',      date: 'Aug 14',  title: 'BFCM Prep 2025: High-Volume Flash Sales Without Downtime',   attendees: '3,241' },
  { badge: 'AMA',          date: 'Aug 21',  title: 'Ask the Team: CommerceHub AI Roadmap — Live Q&A',            attendees: '1,870' },
  { badge: 'WORKSHOP',     date: 'Sep 3',   title: 'From 0 to Paid: Running Your First Meta Ad Campaign',         attendees: '2,560' },
  { badge: 'LIVE STREAM',  date: 'Sep 10',  title: 'Community Showcase: 10 Merchants Share Their Store Setups',  attendees: '4,100' },
];

/* ─── TESTIMONIALS ─── */
const testimonials = [
  { quote: 'I asked a super basic question at 11pm expecting nothing. Within 20 minutes I had three detailed replies from experienced merchants. This community is incredible.', name: 'Amara Osei', title: 'Owner, Osei Naturals', avatar: 'A', stars: 5 },
  { quote: 'The Feature Requests board actually gets read. We suggested multi-currency checkout improvements in January — it shipped in March. Real feedback loop.', name: 'Lin Feng', title: 'CTO, CloudBasket', avatar: 'L', stars: 5 },
  { quote: 'I found my business partner in the Success Stories thread. We bonded over a shared struggle and have been collaborating ever since. The community pays dividends beyond commerce.', name: 'Fatima Al-Rashidi', title: 'Co-Founder, Zahra Living', avatar: 'F', stars: 5 },
];

export default function CommunityForumsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const filteredCategories = categories.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-32 pb-24 text-center">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 65% 50% at 50% -5%, rgba(220,38,38,0.26) 0%, transparent 68%)' }} />
        <div className="relative max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#DC2626] mb-6 px-3 py-1.5 rounded-full border border-[#DC2626]/30 bg-[#DC2626]/10">
              Community Forums
            </span>
            <h1 className="text-5xl sm:text-7xl font-black leading-[0.93] tracking-tight mb-6">
              Learn from
              <br />
              <span className="text-[#DC2626]">4.4 million merchants.</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
              Ask questions, share expertise, celebrate wins, and build real connections with the world's largest community of independent business owners.
            </p>
            <div className="relative max-w-xl mx-auto mb-8">
              <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search forums — e.g. shipping rates, Black Friday tips..."
                className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-full pl-12 pr-6 py-4 text-white placeholder-gray-700 text-sm focus:outline-none focus:border-[#DC2626]/50 transition-colors"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/register')} className="inline-flex items-center gap-2 bg-[#DC2626] hover:bg-[#b91c1c] text-white font-bold text-base px-8 py-4 rounded-full transition-all duration-200 shadow-lg shadow-red-900/30">
                <UsersIcon className="w-4 h-4" /> Join the community
              </button>
              <button className="inline-flex items-center gap-2 border border-white/15 hover:border-white/40 text-white font-semibold text-base px-8 py-4 rounded-full transition-all duration-200">
                Browse threads
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

      {/* ── FORUM CATEGORIES ── */}
      <section className="py-24 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-black mb-4">Find your conversation</h2>
            <p className="text-gray-500 text-lg max-w-xl mx-auto">Eight distinct forums covering every corner of running an online business.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredCategories.map((cat, i) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.07 }}
                className="group bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.16] cursor-pointer transition-all duration-200"
                onClick={() => navigate('/register')}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-3xl">{cat.emoji}</span>
                  <span className="text-xs font-bold" style={{ color: cat.color }}>{cat.threads} threads</span>
                </div>
                <h3 className="font-black text-white text-base mb-2 group-hover:text-[#DC2626] transition-colors">{cat.name}</h3>
                <p className="text-gray-600 text-xs leading-relaxed">{cat.desc}</p>
                <div className="mt-4 flex items-center gap-1 text-xs font-bold" style={{ color: cat.color }}>
                  Browse <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRENDING THREADS ── */}
      <section className="py-20 bg-[#060606]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black mb-1">Trending now</h2>
              <p className="text-gray-500 text-sm">The most active discussions this week.</p>
            </div>
            <button className="text-[#DC2626] text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all" onClick={() => navigate('/register')}>
              See all threads <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            {threads.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -14 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.38, delay: i * 0.07 }}
                className="group bg-[#0a0a0a] border border-white/[0.06] rounded-2xl px-6 py-5 hover:border-white/[0.14] cursor-pointer transition-all duration-200"
                onClick={() => navigate('/register')}
              >
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-9 h-9 rounded-full bg-[#DC2626]/15 flex items-center justify-center text-[#DC2626] font-black text-sm mt-0.5">
                    {t.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1.5 flex-wrap">
                      <span className="text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full" style={{ background: `${t.categoryColor}14`, color: t.categoryColor }}>
                        {t.category}
                      </span>
                      {t.solved && <span className="text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-full bg-green-600/15 text-green-400">Solved</span>}
                      <span className="text-gray-700 text-xs">{t.time}</span>
                    </div>
                    <h4 className="text-white font-semibold text-sm group-hover:text-[#DC2626] transition-colors leading-snug mb-1">{t.title}</h4>
                    <p className="text-gray-600 text-xs">by {t.author}</p>
                  </div>
                  <div className="shrink-0 flex items-center gap-4 text-xs text-gray-600 mt-1">
                    <span className="flex items-center gap-1"><MessageSquareIcon className="w-3.5 h-3.5" /> {t.replies}</span>
                    <span className="flex items-center gap-1"><ThumbsUpIcon className="w-3.5 h-3.5" /> {t.upvotes}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── UPCOMING EVENTS ── */}
      <section className="py-20 bg-black">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-black mb-1">Upcoming community events</h2>
              <p className="text-gray-500 text-sm">Free webinars, AMAs, and live workshops. Every month.</p>
            </div>
            <button className="text-[#DC2626] text-sm font-bold flex items-center gap-1 hover:gap-2 transition-all">
              View full calendar <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {events.map((ev, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-6 hover:border-[#DC2626]/30 cursor-pointer transition-all duration-200"
                onClick={() => navigate('/register')}
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full bg-[#DC2626]/10 text-[#DC2626]">{ev.badge}</span>
                  <span className="text-gray-600 text-xs flex items-center gap-1"><CalendarIcon className="w-3.5 h-3.5" /> {ev.date}</span>
                </div>
                <h3 className="text-white font-bold text-sm leading-snug mb-3 group-hover:text-[#DC2626] transition-colors">{ev.title}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-xs flex items-center gap-1"><UsersIcon className="w-3.5 h-3.5" /> {ev.attendees} registered</span>
                  <span className="text-[#DC2626] text-xs font-bold flex items-center gap-1">RSVP <ArrowRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" /></span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMUNITY EXPERTS ── */}
      <section className="py-20 bg-[#060606]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3">Community experts</h2>
            <p className="text-gray-500">Top-rated contributors who go above and beyond to help fellow merchants.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {experts.map((ex, i) => (
              <motion.div
                key={ex.name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-6 text-center hover:border-[#DC2626]/30 transition-all duration-200"
              >
                <div className="w-14 h-14 rounded-full bg-[#DC2626]/15 flex items-center justify-center text-[#DC2626] font-black text-xl mx-auto mb-4">
                  {ex.avatar}
                </div>
                <p className="text-white font-black text-sm mb-1">{ex.name}</p>
                <p className="text-[#DC2626] text-xs font-bold mb-1">{ex.role}</p>
                <p className="text-gray-600 text-xs mb-4">{ex.specialty}</p>
                <div className="flex justify-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><MessageSquareIcon className="w-3 h-3" /> {ex.replies}</span>
                  <span className="flex items-center gap-1"><ThumbsUpIcon className="w-3 h-3" /> {ex.upvotes}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-black text-center mb-12">What our community says</h2>
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
          <h2 className="text-5xl font-black leading-tight mb-5">Join the community.<br /><span className="text-[#DC2626]">You belong here.</span></h2>
          <p className="text-gray-400 text-lg mb-10">Free to join. Thousands of merchants ready to help you grow. Your next breakthrough is one thread away.</p>
          <button onClick={() => navigate('/register')} className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-black font-black text-lg px-10 py-4 rounded-full transition-all duration-200">
            <UsersIcon className="w-5 h-5" /> Join for free
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
