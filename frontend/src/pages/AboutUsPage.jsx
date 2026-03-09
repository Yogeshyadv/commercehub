import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon, CheckIcon, StarIcon, GlobeIcon, ZapIcon,
  HeartIcon, ShieldCheckIcon, TrendingUpIcon, UsersIcon, AwardIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

const CDN = 'https://cdn.shopify.com/b/shopify-brochure2-assets';

/* ─── STATS ─── */
const stats = [
  { val: '2M+',    label: 'merchants across 175 countries' },
  { val: '$220B',  label: 'GMV processed in 2025' },
  { val: '10,000+', label: 'employees worldwide' },
  { val: '2014',   label: 'founded in Bengaluru, India' },
];

/* ─── TIMELINE ─── */
const timeline = [
  { year: '2014', heading: 'Founded in a garage', body: 'Rahul and Priya Kapoor launch CommerceHub from a 400 sq ft apartment in Bengaluru, frustrated by how hard it was to move their family textile business online.' },
  { year: '2016', heading: 'First 10,000 merchants', body: 'Word of mouth drives explosive early growth across India. We launch cataloguing, payments, and shipping — the first true end-to-end commerce OS.' },
  { year: '2018', heading: 'Series B & global expansion', body: 'A $120M Series B allows us to expand into MENA, Southeast Asia, and the UK. Multi-currency, local tax engines, and 15 payment gateways go live.' },
  { year: '2020', heading: 'Powering pandemic pivots', body: 'When the world went offline, 300,000 merchants moved online with CommerceHub in six months. Our infrastructure scales to handle 8x normal transaction volumes.' },
  { year: '2022', heading: 'CommerceHub Plus & B2B', body: 'Enterprise and wholesale features launch, attracting brands like Vedic Organics, Artisano Furniture, and Chai Colony. GMV crosses $50B.' },
  { year: '2024', heading: 'AI goes native', body: 'We embed AI across the entire platform — from product descriptions to demand forecasting to personalised storefronts. 1 million merchants use AI features in the first 3 months.' },
  { year: '2026', heading: 'Unified commerce era', body: 'CommerceHub becomes the first platform to unify online, POS, B2B, and social commerce under a single merchant identity and inventory layer. 2 million merchants and counting.' },
];

/* ─── VALUES ─── */
const values = [
  { icon: <HeartIcon className="w-6 h-6" />,        heading: 'Merchant-first. Always.', body: 'Every product decision starts with one question: does this make it easier for a merchant to run their business? Not our metrics — their metrics.', color: '#DC2626' },
  { icon: <GlobeIcon className="w-6 h-6" />,         heading: 'Commerce without borders', body: 'We build for the merchant in Jaipur and the merchant in Jakarta equally. Every feature, every pricing tier, every support interaction is designed for global access.', color: '#0284C7' },
  { icon: <ZapIcon className="w-6 h-6" />,           heading: 'Move with urgency', body: "Commerce waits for no one. We ship fast, iterate in public, and treat a merchant's lost sale as our failure.", color: '#D97706' },
  { icon: <ShieldCheckIcon className="w-6 h-6" />,   heading: 'Trust is the product', body: 'Your data, your customers, your store. We protect merchant and buyer data with the same ferocity we would want for ourselves.', color: '#059669' },
  { icon: <UsersIcon className="w-6 h-6" />,         heading: 'Grow the whole ecosystem', body: 'We succeed when our merchants, partners, developers, and buyers all succeed. A rising tide lifts every store.', color: '#7C3AED' },
  { icon: <TrendingUpIcon className="w-6 h-6" />,    heading: 'Radical transparency', body: 'We publish our uptime, our roadmap, our carbon footprint, and our diversity data. If we cannot show it, we fix it first.', color: '#EC4899' },
];

/* ─── LEADERSHIP ─── */
const leaders = [
  { name: 'Rahul Kapoor',    role: 'Co-Founder & CEO',      avatar: 'R',  bg: '#DC2626', bio: 'Previously led growth at Flipkart. 3x founder. Obsessed with removing friction from commerce.'  },
  { name: 'Priya Kapoor',    role: 'Co-Founder & CTO',      avatar: 'P',  bg: '#7C3AED', bio: 'Ex-Google infrastructure engineer. Believes a checkout page should be as fast as a Google search.' },
  { name: 'Aditya Menon',    role: 'Chief Product Officer',  avatar: 'A',  bg: '#0284C7', bio: 'Former PM at Stripe. Has shipped 40+ major features. Counts "no" as a product decision.'         },
  { name: 'Sara Al-Rashidi', role: 'Chief Revenue Officer',  avatar: 'S',  bg: '#059669', bio: 'Built enterprise sales at Salesforce Commerce from $0 to $400M. Joins CommerceHub to democratise what enterprise means.' },
  { name: 'Marcus Webb',     role: 'VP Engineering',         avatar: 'M',  bg: '#D97706', bio: 'Systems architect who has designed platforms handling $1B+ daily. Thinks in transactions per second.' },
  { name: 'Yara El-Ashri',   role: 'VP Product Design',      avatar: 'Y',  bg: '#EC4899', bio: 'IDEO-trained designer. Her north star is the merchant who uses CommerceHub for the first time.' },
];

/* ─── INVESTORS ─── */
const investors = ['Sequoia Capital', 'Tiger Global', 'Bessemer Ventures', 'Steadview Capital', 'Matrix Partners', 'Peak XV Partners'];

/* ─── MEDIA LOGOS (text fallback) ─── */
const coverage = [
  { outlet: 'TechCrunch',    headline: '"CommerceHub is quietly becoming the Shopify of emerging markets"' },
  { outlet: 'Economic Times', headline: '"How two Bengaluru founders built a $12B commerce empire"'         },
  { outlet: 'Forbes',         headline: '"The best e-commerce platform for small businesses in 2025"'        },
  { outlet: 'Business Insider', headline: '"Inside CommerceHub\'s plan to own the next billion shoppers"'   },
];

export default function AboutUsPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-32 pb-24 text-center">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 65% 50% at 50% -5%, rgba(220,38,38,0.26) 0%, transparent 68%)' }} />
        <div className="relative max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#DC2626] mb-6 px-3 py-1.5 rounded-full border border-[#DC2626]/30 bg-[#DC2626]/10">
              About CommerceHub
            </span>
            <h1 className="text-5xl sm:text-7xl font-black leading-[0.93] tracking-tight mb-6">
              We exist so
              <br />
              <span className="text-[#DC2626]">merchants can thrive.</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
              CommerceHub started in a Bengaluru apartment in 2014. Today we power 2 million businesses across 175 countries — from first-time founders to publicly traded brands. Our mission has never changed: make commerce accessible to everyone.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/careers')} className="inline-flex items-center gap-2 bg-[#DC2626] hover:bg-[#b91c1c] text-white font-bold text-base px-8 py-4 rounded-full transition-all duration-200 shadow-lg shadow-red-900/30">
                Join our team <ArrowRightIcon className="w-4 h-4" />
              </button>
              <button onClick={() => navigate('/press')} className="inline-flex items-center gap-2 border border-white/15 hover:border-white/40 text-white font-semibold text-base px-8 py-4 rounded-full transition-all duration-200">
                Press & media
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

      {/* ── MISSION ── */}
      <section className="py-24 bg-black">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#DC2626] mb-4 block">Our mission</span>
            <h2 className="text-4xl font-black mb-6 leading-tight">Commerce should be possible for anyone, anywhere.</h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              For most of history, starting a business meant access to capital, infrastructure, and know-how that only a privileged few had. The internet changed that — but building and running an online store was still absurdly complicated.
            </p>
            <p className="text-gray-400 leading-relaxed mb-8">
              We built CommerceHub because we believed the gap between "I have an idea" and "I have a business" should be measured in hours, not months. Every feature we ship, every price we set, every hire we make is in pursuit of that gap shrinking further.
            </p>
            <div className="space-y-3">
              {['No enterprise licence required to access enterprise features', 'Transparent, flat-rate pricing — no revenue share on sales', 'Same platform, whether you do Rs.1,000/mo or Rs.100Cr/mo'].map(b => (
                <div key={b} className="flex items-start gap-3 text-sm text-gray-300">
                  <CheckIcon className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" strokeWidth={2.5} />
                  {b}
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="relative">
            <div className="absolute -inset-4 bg-[#DC2626]/5 rounded-3xl" />
            <div className="relative bg-[#0a0a0a] border border-white/[0.06] rounded-2xl overflow-hidden">
              <img src={`${CDN}/home-hero.png`} alt="CommerceHub mission" className="w-full object-cover h-72 opacity-70" onError={e => { e.currentTarget.style.display = 'none'; }} />
              <div className="p-6 border-t border-white/[0.06]">
                <p className="text-white font-black text-lg mb-1">"Make commerce better for everyone."</p>
                <p className="text-gray-500 text-sm">— Rahul Kapoor, Co-Founder & CEO</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="py-24 bg-[#060606]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black mb-3">Our story</h2>
            <p className="text-gray-500">From a Bengaluru apartment to powering 2 million businesses.</p>
          </div>
          <div className="relative">
            {/* vertical line */}
            <div className="absolute left-[22px] top-0 bottom-0 w-px bg-white/[0.06]" />
            <div className="space-y-10">
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                  className="flex gap-6"
                >
                  <div className="shrink-0 w-11 h-11 rounded-full bg-[#DC2626]/15 border border-[#DC2626]/30 flex items-center justify-center text-[#DC2626] font-black text-xs z-10">
                    {item.year.slice(-2)}
                  </div>
                  <div className="pt-1.5">
                    <div className="flex items-baseline gap-3 mb-1.5">
                      <span className="text-[#DC2626] text-xs font-black">{item.year}</span>
                      <h3 className="text-white font-black text-base">{item.heading}</h3>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.body}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-24 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black mb-3">What we believe</h2>
            <p className="text-gray-500 max-w-xl mx-auto">These are the principles that guide every decision — from product to hiring to pricing.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.heading}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.07 }}
                className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-7"
              >
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-5" style={{ background: `${v.color}14`, color: v.color }}>
                  {v.icon}
                </span>
                <h3 className="font-black text-white text-base mb-3">{v.heading}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{v.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LEADERSHIP ── */}
      <section className="py-24 bg-[#060606]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black mb-3">Leadership team</h2>
            <p className="text-gray-500">The people building the future of commerce.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {leaders.map((l, i) => (
              <motion.div
                key={l.name}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.07 }}
                className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-7"
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl text-white mb-5" style={{ background: `${l.bg}22` }}>
                  <span style={{ color: l.bg }}>{l.avatar}</span>
                </div>
                <p className="text-white font-black text-base mb-0.5">{l.name}</p>
                <p className="text-[#DC2626] text-xs font-bold mb-3">{l.role}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{l.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INVESTORS ── */}
      <section className="py-16 bg-black border-y border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-600 mb-8">Backed by the world's best investors</p>
          <div className="flex flex-wrap justify-center gap-8">
            {investors.map(inv => (
              <span key={inv} className="text-gray-500 font-bold text-sm hover:text-white transition-colors cursor-default">{inv}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRESS MENTIONS ── */}
      <section className="py-20 bg-[#060606]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-2">In the press</h2>
            <p className="text-gray-500 text-sm">What the world is saying about CommerceHub.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {coverage.map((c, i) => (
              <motion.div
                key={c.outlet}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.38, delay: i * 0.07 }}
                className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.14] transition-colors cursor-pointer"
                onClick={() => navigate('/press')}
              >
                <p className="text-[#DC2626] text-xs font-black uppercase tracking-widest mb-3">{c.outlet}</p>
                <p className="text-gray-300 text-sm font-medium leading-snug italic">{c.headline}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button onClick={() => navigate('/press')} className="inline-flex items-center gap-2 text-[#DC2626] font-bold text-sm hover:gap-3 transition-all">
              View all press coverage <ArrowRightIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative py-28 bg-black overflow-hidden text-center">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 55% 45% at 50% 100%, rgba(220,38,38,0.2) 0%, transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto px-6">
          <h2 className="text-5xl font-black leading-tight mb-5">Want to help build<br /><span className="text-[#DC2626]">the future of commerce?</span></h2>
          <p className="text-gray-400 text-lg mb-10">We're hiring across engineering, design, product, and growth. Come work on problems that matter for millions of merchants.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/careers')} className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-black font-black text-lg px-10 py-4 rounded-full transition-all duration-200">
              View open roles <ArrowRightIcon className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/register')} className="inline-flex items-center gap-2 border border-white/20 hover:border-white/50 text-white font-bold text-lg px-10 py-4 rounded-full transition-all duration-200">
              Start selling
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
