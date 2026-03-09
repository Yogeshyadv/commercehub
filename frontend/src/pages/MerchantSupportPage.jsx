import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon, MessageCircleIcon, PhoneIcon, MailIcon, BookOpenIcon,
  ZapIcon, ClockIcon, ShieldCheckIcon, UsersIcon, FileTextIcon,
  SearchIcon, CheckIcon, StarIcon, HeadphonesIcon, GlobeIcon,
  PlayCircleIcon, ChevronDownIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

const CDN = 'https://cdn.shopify.com/b/shopify-brochure2-assets';

/* ─── SUPPORT CHANNELS ─── */
const channels = [
  {
    icon: <MessageCircleIcon className="w-7 h-7" />,
    heading: '24/7 Live Chat',
    desc: 'Get help from a real human in under 2 minutes — any time, day or night. Our support team knows commerce inside out.',
    badge: 'Fastest',
    color: '#DC2626',
    cta: 'Start a chat',
  },
  {
    icon: <PhoneIcon className="w-7 h-7" />,
    heading: 'Phone Support',
    desc: 'Speak directly with a CommerceHub specialist. Available on Grow, Advanced, and Plus plans.',
    badge: 'Plus plans',
    color: '#7C3AED',
    cta: 'Request a callback',
  },
  {
    icon: <MailIcon className="w-7 h-7" />,
    heading: 'Email Support',
    desc: 'Send a detailed request and get a thorough response from our support team — typically within 4 hours.',
    badge: 'All plans',
    color: '#0284C7',
    cta: 'Send an email',
  },
  {
    icon: <BookOpenIcon className="w-7 h-7" />,
    heading: 'Help Centre',
    desc: "Search 3,000+ step-by-step articles, video tutorials, and guides. Most questions are answered before you finish typing.",
    badge: 'Self-serve',
    color: '#059669',
    cta: 'Browse articles',
  },
];

/* ─── STATS ─── */
const stats = [
  { val: '<2 min',  label: 'average live chat first response' },
  { val: '97%',     label: 'customer satisfaction (CSAT)' },
  { val: '24/7',    label: 'support every day of the year' },
  { val: '3,000+',  label: 'help articles & tutorials' },
];

/* ─── HELP TOPICS ─── */
const helpTopics = [
  { icon: '🏪', label: 'Setting up your store',        count: '142 articles' },
  { icon: '💳', label: 'Payments & payouts',           count: '98 articles'  },
  { icon: '📦', label: 'Shipping & fulfilment',        count: '115 articles' },
  { icon: '🎨', label: 'Themes & design',              count: '87 articles'  },
  { icon: '🛒', label: 'Products & inventory',         count: '203 articles' },
  { icon: '📊', label: 'Analytics & reports',          count: '64 articles'  },
  { icon: '🔌', label: 'Apps & integrations',          count: '178 articles' },
  { icon: '🌍', label: 'International selling',        count: '72 articles'  },
  { icon: '🔐', label: 'Account & billing',            count: '89 articles'  },
  { icon: '📱', label: 'Point of sale (POS)',          count: '93 articles'  },
  { icon: '📧', label: 'Email marketing',              count: '56 articles'  },
  { icon: '🤖', label: 'AI & automation',              count: '41 articles'  },
];

/* ─── FAQ ─── */
const faqs = [
  { q: 'How do I contact CommerceHub support?', a: 'You can reach us via live chat (fastest — typically under 2 minutes), email, or phone (Grow plan and above). Live chat and email are available on all plans, 24/7.' },
  { q: 'What is your average response time?', a: 'Live chat: under 2 minutes. Email: under 4 hours. Phone: immediate (callback queued within 15 minutes during peak hours).' },
  { q: 'Is support available in my language?', a: 'Our Help Centre is available in 20+ languages. Live chat and phone support are currently offered in English, Hindi, Spanish, French, German, Portuguese, and Japanese.' },
  { q: 'Does CommerceHub offer onboarding support?', a: 'Yes. Plus plan merchants receive a dedicated onboarding specialist who guides you through your full store setup and migration. All plans have access to our Getting Started guide and video tutorials.' },
  { q: 'What is a Merchant Success Manager?', a: 'Plus plan merchants are assigned a dedicated Merchant Success Manager — a commerce expert who proactively helps you plan campaigns, optimise your store, and hit your growth targets.' },
  { q: 'Where can I find video tutorials?', a: 'All our video tutorials are available free in the Help Centre and on the CommerceHub YouTube channel. Covering everything from first product upload to advanced checkout customisation.' },
];

/* ─── TESTIMONIALS ─── */
const testimonials = [
  { quote: 'I had a checkout issue on Black Friday — commerece hub support had it fixed in 4 minutes via live chat. That kind of support is worth every penny.', name: 'Tom Bradley', title: 'Founder, Bradley Provisions', avatar: 'T', stars: 5 },
  { quote: 'Our dedicated Merchant Success Manager proactively flagged a shipping configuration issue before our launch. I would never have caught it myself.', name: 'Priya Agarwal', title: 'Director, Verdure Wellness', avatar: 'P', stars: 5 },
  { quote: 'The Help Centre is genuinely one of the best I have used. Searchable, clear screenshots, and video walkthroughs for everything. I rarely need to contact support at all.', name: 'Carlos Mendez', title: 'CEO, Artesano Market', avatar: 'C', stars: 5 },
];

/* ─── PLAN SUPPORT TABLE ─── */
const planSupport = [
  { feature: 'Help Centre access',       basic: true,  grow: true,  advanced: true,  plus: true  },
  { feature: '24/7 live chat',           basic: true,  grow: true,  advanced: true,  plus: true  },
  { feature: '24/7 email support',       basic: true,  grow: true,  advanced: true,  plus: true  },
  { feature: 'Phone support',            basic: false, grow: true,  advanced: true,  plus: true  },
  { feature: 'Priority queue',           basic: false, grow: false, advanced: true,  plus: true  },
  { feature: 'Onboarding specialist',    basic: false, grow: false, advanced: false, plus: true  },
  { feature: 'Merchant Success Manager', basic: false, grow: false, advanced: false, plus: true  },
  { feature: 'Custom SLA',              basic: false, grow: false, advanced: false, plus: true  },
];

export default function MerchantSupportPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const filteredTopics = helpTopics.filter(t =>
    !search || t.label.toLowerCase().includes(search.toLowerCase())
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
              Merchant Support
            </span>
            <h1 className="text-5xl sm:text-7xl font-black leading-[0.93] tracking-tight mb-6">
              We're here for you.
              <br />
              <span className="text-[#DC2626]">Always.</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
              Real humans. Real answers. 24 hours a day, 7 days a week, 365 days a year — including holidays. Because your business doesn't stop, neither do we.
            </p>

            {/* search bar */}
            <div className="relative max-w-xl mx-auto mb-8">
              <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search help articles — e.g. payments, shipping, themes..."
                className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-full pl-12 pr-6 py-4 text-white placeholder-gray-700 text-sm focus:outline-none focus:border-[#DC2626]/50 transition-colors"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/register')} className="inline-flex items-center gap-2 bg-[#DC2626] hover:bg-[#b91c1c] text-white font-bold text-base px-8 py-4 rounded-full transition-all duration-200 shadow-lg shadow-red-900/30">
                <MessageCircleIcon className="w-4 h-4" /> Start live chat
              </button>
              <button onClick={() => navigate('/community')} className="inline-flex items-center gap-2 border border-white/15 hover:border-white/40 text-white font-semibold text-base px-8 py-4 rounded-full transition-all duration-200">
                Visit community
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

      {/* ── SUPPORT CHANNELS ── */}
      <section className="py-24 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl sm:text-5xl font-black mb-4">Get help your way</h2>
            <p className="text-gray-500 text-lg">Choose the channel that works best for you right now.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {channels.map((ch, i) => (
              <motion.div
                key={ch.heading}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="group bg-[#0a0a0a] border border-white/[0.06] rounded-3xl p-7 hover:border-white/[0.14] transition-all duration-300 flex flex-col"
              >
                <div className="flex items-start justify-between mb-5">
                  <span className="inline-flex items-center justify-center w-14 h-14 rounded-2xl" style={{ background: `${ch.color}14`, color: ch.color }}>
                    {ch.icon}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ background: `${ch.color}14`, color: ch.color }}>
                    {ch.badge}
                  </span>
                </div>
                <h3 className="font-black text-white text-lg mb-3">{ch.heading}</h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-5">{ch.desc}</p>
                <button className="inline-flex items-center gap-1.5 text-sm font-bold group-hover:gap-3 transition-all duration-200" style={{ color: ch.color }}>
                  {ch.cta} <ArrowRightIcon className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HELP TOPICS ── */}
      <section className="py-20 bg-[#060606]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3">Browse the Help Centre</h2>
            <p className="text-gray-500">3,000+ articles written by real commerce experts.</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredTopics.map((t, i) => (
              <motion.div
                key={t.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: (i % 4) * 0.06 }}
                className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl px-5 py-5 hover:border-white/[0.14] cursor-pointer transition-all duration-200 group"
              >
                <span className="text-2xl mb-3 block">{t.icon}</span>
                <p className="text-white font-bold text-sm mb-1 group-hover:text-[#DC2626] transition-colors">{t.label}</p>
                <p className="text-gray-600 text-xs">{t.count}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLAN SUPPORT TABLE ── */}
      <section className="py-20 bg-black">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3">Support by plan</h2>
            <p className="text-gray-500">Every plan includes 24/7 coverage. Plus unlocks dedicated expertise.</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06] bg-[#0a0a0a]">
                  <th className="text-left px-6 py-4 text-gray-500 font-semibold">Feature</th>
                  {['Basic', 'Grow', 'Advanced', 'Plus'].map((plan, i) => (
                    <th key={plan} className={`px-5 py-4 text-center font-black text-xs uppercase tracking-wide ${i === 3 ? 'text-[#DC2626]' : 'text-gray-500'}`}>
                      {plan}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {planSupport.map((row, i) => (
                  <tr key={row.feature} className={`border-b border-white/[0.04] ${i % 2 === 0 ? 'bg-[#060606]' : 'bg-[#080808]'}`}>
                    <td className="px-6 py-4 text-gray-300 font-medium">{row.feature}</td>
                    {[row.basic, row.grow, row.advanced, row.plus].map((val, vi) => (
                      <td key={vi} className="px-5 py-4 text-center">
                        {val ? (
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${vi === 3 ? 'bg-[#DC2626]/15 text-[#DC2626]' : 'bg-green-900/20 text-green-400'}`}>
                            <CheckIcon className="w-4 h-4" strokeWidth={2.5} />
                          </span>
                        ) : (
                          <span className="text-gray-700">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-[#060606]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-black text-center mb-12">What merchants say about our support</h2>
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

      {/* ── FAQ ── */}
      <section className="py-20 bg-black">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-3">Frequently asked questions</h2>
            <p className="text-gray-500">Everything you need to know about CommerceHub support.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl overflow-hidden">
                <button className="w-full flex items-center justify-between px-6 py-5 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-semibold text-white text-sm pr-6">{faq.q}</span>
                  <span className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-200 ${openFaq === i ? 'border-[#DC2626] text-[#DC2626]' : 'border-white/20 text-gray-500'}`}>
                    <span className="text-lg leading-none font-light">{openFaq === i ? '−' : '+'}</span>
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/[0.06]">
                    <p className="pt-4">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative py-28 bg-[#060606] overflow-hidden text-center">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 55% 45% at 50% 100%, rgba(220,38,38,0.2) 0%, transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto px-6">
          <h2 className="text-5xl font-black leading-tight mb-5">Still need help?<br /><span className="text-[#DC2626]">We are one click away.</span></h2>
          <p className="text-gray-400 text-lg mb-10">Start a live chat now and get a real answer in under 2 minutes.</p>
          <button onClick={() => navigate('/register')} className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-black font-black text-lg px-10 py-4 rounded-full transition-all duration-200">
            <MessageCircleIcon className="w-5 h-5" /> Start live chat
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
