import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon, SearchIcon, MapPinIcon, ClockIcon, CheckIcon,
  StarIcon, ZapIcon, HeartIcon, UsersIcon, GlobeIcon, TrendingUpIcon,
  CodeIcon, PaletteIcon, MegaphoneIcon, ShieldCheckIcon, BarChart2Icon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

/* ─── STATS ─── */
const stats = [
  { val: '10,000+', label: 'employees in 30+ countries' },
  { val: '4.7 / 5',  label: 'Glassdoor rating' },
  { val: '94%',      label: 'of employees recommend us' },
  { val: '200+',     label: 'open roles right now' },
];

/* ─── DEPARTMENTS ─── */
const departments = [
  { icon: <CodeIcon className="w-5 h-5" />,       label: 'Engineering',     count: 68,  color: '#7C3AED' },
  { icon: <PaletteIcon className="w-5 h-5" />,    label: 'Design',          count: 24,  color: '#EC4899' },
  { icon: <BarChart2Icon className="w-5 h-5" />,  label: 'Product',         count: 31,  color: '#0284C7' },
  { icon: <MegaphoneIcon className="w-5 h-5" />,  label: 'Marketing',       count: 42,  color: '#DC2626' },
  { icon: <UsersIcon className="w-5 h-5" />,      label: 'Sales & Success', count: 55,  color: '#059669' },
  { icon: <ShieldCheckIcon className="w-5 h-5" />,label: 'Operations',      count: 19,  color: '#D97706' },
];

/* ─── OPEN ROLES ─── */
const roles = [
  { title: 'Senior Backend Engineer — Checkout',    dept: 'Engineering', location: 'Bengaluru / Remote',    type: 'Full-time', level: 'Senior',     color: '#7C3AED' },
  { title: 'Product Designer — Merchant Dashboard', dept: 'Design',      location: 'Remote',                type: 'Full-time', level: 'Mid-Senior', color: '#EC4899' },
  { title: 'Staff ML Engineer — AI Features',       dept: 'Engineering', location: 'Bengaluru / London',    type: 'Full-time', level: 'Staff',      color: '#7C3AED' },
  { title: 'Growth Marketing Manager — APAC',       dept: 'Marketing',   location: 'Singapore / Remote',    type: 'Full-time', level: 'Mid',        color: '#DC2626' },
  { title: 'Senior Product Manager — Payments',     dept: 'Product',     location: 'Bengaluru / Mumbai',    type: 'Full-time', level: 'Senior',     color: '#0284C7' },
  { title: 'DevRel Engineer — Partner Platform',    dept: 'Engineering', location: 'Remote',                type: 'Full-time', level: 'Mid',        color: '#7C3AED' },
  { title: 'Brand Designer',                        dept: 'Design',      location: 'Bengaluru',             type: 'Full-time', level: 'Mid',        color: '#EC4899' },
  { title: 'Enterprise Account Executive — MENA',   dept: 'Sales & Success', location: 'Dubai / Remote',   type: 'Full-time', level: 'Senior',     color: '#059669' },
  { title: 'Data Engineer — Commerce Analytics',    dept: 'Engineering', location: 'Bengaluru / Remote',    type: 'Full-time', level: 'Mid',        color: '#7C3AED' },
];

/* ─── PERKS ─── */
const perks = [
  { emoji: '🏥', heading: 'Comprehensive health',   body: 'Full medical, dental, and vision coverage for you and your family from day one. No waiting period.' },
  { emoji: '🌍', heading: 'Work from anywhere',     body: 'Remote-first culture with optional offices in Bengaluru, London, Dubai, and Singapore.' },
  { emoji: '📚', heading: 'Rs.1.5L learning budget', body: 'Annual budget for courses, conferences, books, and any learning that makes you better at your craft.' },
  { emoji: '👶', heading: '26-week parental leave',  body: 'Full pay, full benefits, for all parents — regardless of gender or how your family was formed.' },
  { emoji: '💪', heading: 'Wellness stipend',        body: 'Rs.60,000/year for gym memberships, therapy, meditation apps, or anything that keeps you healthy.' },
  { emoji: '💰', heading: 'Equity for everyone',     body: 'Every full-time employee receives meaningful stock options. When CommerceHub wins, you win.' },
  { emoji: '⚡', heading: 'Home office setup',       body: 'Rs.80,000 budget to build the workspace you need to do your best work.' },
  { emoji: '🍔', heading: 'Daily meals (offices)',   body: 'Free breakfast, lunch, and snacks at all office locations. Also: really good filter coffee.' },
];

/* ─── LIFE AT CH ─── */
const lifeItems = [
  { heading: 'Radical ownership',    body: 'We hire smart people and trust them to make decisions. No micromanagement. No committee approvals for ideas you believe in.' },
  { heading: 'Diverse by design',    body: '42% of our engineering team identifies as women or non-binary. 60+ nationalities. We measure inclusion, not just intent.' },
  { heading: 'Impact at scale',      body: 'Your code runs on a platform processing $600M+ a day. Your design decision affects 2 million merchant storefronts.' },
  { heading: 'No politics, no BS',   body: 'Ideas win on merit. We have a no-HiPPO (Highest Paid Person\'s Opinion) policy. Results and reasoning beat seniority.' },
];

/* ─── TESTIMONIALS ─── */
const testimonials = [
  { quote: 'I joined as a junior designer. In 18 months I was leading the design system. The trust and ownership here are not buzzwords — they are how things actually work.', name: 'Ananya Singh', role: 'Senior Product Designer, 3 yrs', avatar: 'A', stars: 5 },
  { quote: 'I was skeptical about remote-first culture. On day one, I had a MacBook Pro, a home office allowance, and a 1-on-1 with the CTO. I have never looked back.', name: 'Kevin Oduya', role: 'Staff Engineer, 2 yrs', avatar: 'K', stars: 5 },
  { quote: 'The learning budget changed my career. I did a Stanford online certificate, attended two conferences, and bought every book my manager recommended. All expensed.', name: 'Riya Desai', role: 'PM — Growth, 4 yrs', avatar: 'R', stars: 5 },
];

const DEPTS = ['All', 'Engineering', 'Design', 'Product', 'Marketing', 'Sales & Success', 'Operations'];

export default function CareersPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeDept, setActiveDept] = useState('All');

  const filteredRoles = roles.filter(r => {
    const matchesDept = activeDept === 'All' || r.dept === activeDept;
    const matchesSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.dept.toLowerCase().includes(search.toLowerCase());
    return matchesDept && matchesSearch;
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
              Careers
            </span>
            <h1 className="text-5xl sm:text-7xl font-black leading-[0.93] tracking-tight mb-6">
              Build the platform
              <br />
              <span className="text-[#DC2626]">merchants depend on.</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
              2 million merchants rely on CommerceHub every day. Every engineer, designer, PM, and marketer here is directly responsible for whether those businesses succeed. That's the job.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#open-roles" className="inline-flex items-center gap-2 bg-[#DC2626] hover:bg-[#b91c1c] text-white font-bold text-base px-8 py-4 rounded-full transition-all duration-200 shadow-lg shadow-red-900/30">
                See {roles.length} open roles <ArrowRightIcon className="w-4 h-4" />
              </a>
              <button onClick={() => navigate('/about')} className="inline-flex items-center gap-2 border border-white/15 hover:border-white/40 text-white font-semibold text-base px-8 py-4 rounded-full transition-all duration-200">
                Our story
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

      {/* ── LIFE AT CH ── */}
      <section className="py-24 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black mb-3">Life at CommerceHub</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Not a startup, not a corporation. Something in between — and better than both.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {lifeItems.map((item, i) => (
              <motion.div
                key={item.heading}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-7"
              >
                <div className="w-2 h-8 bg-[#DC2626] rounded-full mb-5" />
                <h3 className="font-black text-white text-sm mb-2">{item.heading}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PERKS ── */}
      <section className="py-24 bg-[#060606]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black mb-3">Perks & benefits</h2>
            <p className="text-gray-500">We take care of you so you can take care of our merchants.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {perks.map((p, i) => (
              <motion.div
                key={p.heading}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 4) * 0.07 }}
                className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-6"
              >
                <span className="text-3xl mb-4 block">{p.emoji}</span>
                <h3 className="font-black text-white text-sm mb-2">{p.heading}</h3>
                <p className="text-gray-600 text-xs leading-relaxed">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OPEN ROLES ── */}
      <section className="py-24 bg-black" id="open-roles">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-4xl font-black mb-1">Open roles</h2>
              <p className="text-gray-500 text-sm">{roles.length} positions · remote-friendly · updated weekly</p>
            </div>
            {/* search */}
            <div className="relative w-full sm:w-72">
              <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search roles..."
                className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-full pl-10 pr-4 py-2.5 text-white placeholder-gray-700 text-sm focus:outline-none focus:border-[#DC2626]/50 transition-colors"
              />
            </div>
          </div>

          {/* dept tabs */}
          <div className="flex items-center gap-2 flex-wrap mb-8">
            {DEPTS.map(dept => (
              <button
                key={dept}
                onClick={() => setActiveDept(dept)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${activeDept === dept ? 'bg-[#DC2626] text-white' : 'bg-[#0a0a0a] border border-white/[0.08] text-gray-400 hover:border-white/[0.2] hover:text-white'}`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* roles list */}
          {filteredRoles.length > 0 ? (
            <div className="space-y-3">
              {filteredRoles.map((role, i) => (
                <motion.div
                  key={role.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="group bg-[#0a0a0a] border border-white/[0.06] rounded-2xl px-6 py-5 hover:border-white/[0.16] cursor-pointer transition-all duration-200"
                  onClick={() => navigate('/register')}
                >
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-4">
                      <div className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${role.color}14` }}>
                        <span className="text-sm font-black" style={{ color: role.color }}>{role.dept[0]}</span>
                      </div>
                      <div>
                        <p className="text-white font-bold text-sm group-hover:text-[#DC2626] transition-colors">{role.title}</p>
                        <div className="flex items-center gap-3 mt-1 flex-wrap">
                          <span className="flex items-center gap-1 text-gray-600 text-xs"><MapPinIcon className="w-3 h-3" /> {role.location}</span>
                          <span className="flex items-center gap-1 text-gray-600 text-xs"><ClockIcon className="w-3 h-3" /> {role.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${role.color}14`, color: role.color }}>{role.dept}</span>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/[0.05] text-gray-400">{role.level}</span>
                      <ArrowRightIcon className="w-4 h-4 text-gray-600 group-hover:text-[#DC2626] group-hover:translate-x-1 transition-all" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">No roles match your search.</p>
              <button onClick={() => { setSearch(''); setActiveDept('All'); }} className="mt-4 text-[#DC2626] text-sm font-bold hover:underline">
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── DEPARTMENTS ── */}
      <section className="py-16 bg-[#060606] border-y border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-600 mb-8 text-center">Open positions by department</p>
          <div className="grid sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {departments.map((d, i) => (
              <motion.div
                key={d.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-5 text-center cursor-pointer hover:border-white/[0.14] transition-all"
                onClick={() => setActiveDept(d.label)}
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 mx-auto" style={{ background: `${d.color}14`, color: d.color }}>
                  {d.icon}
                </span>
                <p className="text-white font-black text-xs mb-0.5">{d.label}</p>
                <p className="font-black" style={{ color: d.color }}>{d.count}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-black text-center mb-12">Hear from the team</h2>
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
                    <p className="text-gray-600 text-xs">{t.role}</p>
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
          <h2 className="text-5xl font-black leading-tight mb-5">Your work will reach<br /><span className="text-[#DC2626]">2 million merchants.</span></h2>
          <p className="text-gray-400 text-lg mb-10">If that sounds like the right scale for your ambitions, we would love to talk.</p>
          <a href="#open-roles" className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-black font-black text-lg px-10 py-4 rounded-full transition-all duration-200">
            Browse open roles <ArrowRightIcon className="w-5 h-5" />
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
