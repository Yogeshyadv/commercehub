import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon, InstagramIcon, TwitterIcon, YoutubeIcon, LinkedinIcon,
  ShoppingBagIcon, ZapIcon, BarChart2Icon, CheckIcon, StarIcon,
  TrendingUpIcon, RefreshCwIcon, HashIcon, VideoIcon, ImageIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

const CDN = 'https://cdn.shopify.com/b/shopify-brochure2-assets';
const CF  = 'https://dwtqm09zovi8z.cloudfront.net/assets';

/* ─── CHANNELS ─── */
const channels = [
  { icon: <InstagramIcon className="w-6 h-6" />, name: 'Instagram',  color: '#E1306C', desc: 'Tag products in posts, reels, and stories. Turn every piece of content into a shoppable moment.' },
  { icon: <TwitterIcon   className="w-6 h-6" />, name: 'X (Twitter)', color: '#1D9BF0', desc: 'Run promoted campaigns and grow your audience with native commerce integrations.' },
  { icon: <YoutubeIcon   className="w-6 h-6" />, name: 'YouTube',     color: '#FF0000', desc: 'Enable YouTube Shopping and tag products directly in your videos and Shorts.' },
  { icon: <LinkedinIcon  className="w-6 h-6" />, name: 'LinkedIn',    color: '#0A66C2', desc: 'Reach B2B decision-makers and promote your catalogue to professional audiences.' },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.23 8.23 0 0 0 4.81 1.54V6.78a4.87 4.87 0 0 1-1.04-.09z" />
      </svg>
    ),
    name: 'TikTok', color: '#010101', desc: 'List your products on TikTok Shop and reach Gen Z buyers with shoppable videos and live streams.'
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current">
        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12c0 3.259.014 3.668.072 4.948.058 1.277.26 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24c3.259 0 3.668-.014 4.948-.072 1.277-.058 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.689.072-4.948 0-3.259-.014-3.667-.072-4.947-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85 0 3.204-.015 3.585-.074 4.85-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.897 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.897-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.163 6.162 6.163 3.405 0 6.162-2.76 6.162-6.163 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
      </svg>
    ),
    name: 'Instagram Shopping', color: '#833AB4', desc: 'Set up your Instagram shop with a full product catalogue that syncs with your CommerceHub inventory in real time.'
  },
];

/* ─── FEATURES ─── */
const features = [
  {
    icon: <ShoppingBagIcon className="w-6 h-6" />,
    heading: 'Shoppable posts across every platform',
    desc: 'Tag your products in photos, videos, and stories on Instagram, TikTok, Pinterest, and YouTube. Customers go from discovery to purchase in one tap — no link-in-bio friction.',
    img: `${CDN}/ebc54e1da391c75a5a98649fa293484a.webp`,
    color: '#DC2626',
  },
  {
    icon: <RefreshCwIcon className="w-6 h-6" />,
    heading: 'One product catalogue, everywhere',
    desc: 'Manage a single product catalogue and have it sync in real time across every social channel. Price changes, new products, and stock updates happen automatically — everywhere.',
    img: `${CDN}/4dd1cce5beb0f5dbb46115e31e300f80.webp`,
    color: '#7C3AED',
  },
  {
    icon: <BarChart2Icon className="w-6 h-6" />,
    heading: 'Unified social analytics dashboard',
    desc: 'See sales, clicks, impressions, and ROAS from every channel in one dashboard. Know exactly which platform and which content is driving your revenue.',
    img: `${CF}/boost_personal_commerce_3.webp`,
    color: '#0284C7',
  },
  {
    icon: <ZapIcon className="w-6 h-6" />,
    heading: 'Social ad campaigns, built in',
    desc: 'Create and manage Facebook, Instagram, and Google Shopping ads directly in CommerceHub. Our AI picks the best audience and bid strategy so every rupee is well spent.',
    img: `${CF}/catalogue_e_commerce.webp`,
    color: '#059669',
  },
];

/* ─── CONTENT FORMATS ─── */
const formats = [
  { icon: <ImageIcon className="w-5 h-5" />, label: 'Shoppable photos', color: '#E1306C' },
  { icon: <VideoIcon  className="w-5 h-5" />, label: 'Shoppable reels & videos', color: '#FF0000' },
  { icon: <HashIcon   className="w-5 h-5" />, label: 'Trending hashtag discovery', color: '#1D9BF0' },
  { icon: <ShoppingBagIcon className="w-5 h-5" />, label: 'Live shopping streams', color: '#010101' },
  { icon: <TrendingUpIcon  className="w-5 h-5" />, label: 'Paid social campaigns', color: '#DC2626' },
  { icon: <BarChart2Icon   className="w-5 h-5" />, label: 'Cross-channel attribution', color: '#7C3AED' },
];

/* ─── STATS ─── */
const stats = [
  { val: '130M+', label: 'buyers on social commerce monthly' },
  { val: '3×',    label: 'higher conversion from shoppable posts' },
  { val: '6',     label: 'social channels connected natively' },
  { val: '1',     label: 'product catalogue synced everywhere' },
];

/* ─── TESTIMONIALS ─── */
const testimonials = [
  {
    quote: 'We connected our CommerceHub store to TikTok Shop in under 10 minutes. Our products are now selling 24/7 through short-form video.',
    name: 'Aisha Patel', title: 'Founder, Radiant Beauty', avatar: 'A', stars: 5,
  },
  {
    quote: 'Instagram Shopping through CommerceHub means our catalogue is always accurate. No more "sold out" complaints after posts go viral.',
    name: 'Tomáš Novák', title: 'CEO, Bohemian Goods', avatar: 'T', stars: 5,
  },
  {
    quote: 'The unified analytics dashboard finally showed us that Instagram drives 4× more revenue than Facebook for our product category.',
    name: 'Fatima Al-Rashid', title: 'Head of Marketing, Saffron Studio', avatar: 'F', stars: 5,
  },
];

export default function SocialMediaPage() {
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
              Social Media Commerce
            </span>
            <h1 className="text-5xl sm:text-7xl font-black leading-[0.93] tracking-tight mb-6">
              Your audience is social.
              <br />
              <span className="text-[#DC2626]">Your store should be too.</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
              Sell on Instagram, TikTok, YouTube, and more — all synced to your CommerceHub inventory in real time. Turn every scroll into a sale.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/register')} className="inline-flex items-center gap-2 bg-[#DC2626] hover:bg-[#b91c1c] text-white font-bold text-base px-8 py-4 rounded-full transition-all duration-200 shadow-lg shadow-red-900/30">
                Start free trial <ArrowRightIcon className="w-4 h-4" />
              </button>
              <button onClick={() => navigate('/pricing')} className="inline-flex items-center gap-2 border border-white/15 hover:border-white/40 text-white font-semibold text-base px-8 py-4 rounded-full transition-all duration-200">
                See all channels
              </button>
            </div>
          </motion.div>

          {/* channel icon strip */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="mt-14 flex flex-wrap justify-center gap-4"
          >
            {channels.map((ch) => (
              <div
                key={ch.name}
                className="flex items-center gap-2.5 bg-[#0a0a0a] border border-white/[0.08] rounded-2xl px-5 py-3 hover:border-white/20 transition-all duration-200"
              >
                <span style={{ color: ch.color }}>{ch.icon}</span>
                <span className="text-sm font-semibold text-gray-300">{ch.name}</span>
              </div>
            ))}
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

      {/* ── CHANNELS DEEP DIVE ── */}
      <section className="py-20 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black mb-3">Every channel, one dashboard</h2>
            <p className="text-gray-500 text-lg">Connect once. Sell everywhere.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {channels.map((ch, i) => (
              <motion.div
                key={ch.name}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-7 hover:border-white/[0.14] transition-all duration-300"
              >
                <span className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-5" style={{ background: `${ch.color}15`, color: ch.color }}>
                  {ch.icon}
                </span>
                <h3 className="font-black text-white text-base mb-2">{ch.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{ch.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 bg-[#060606]">
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

      {/* ── CONTENT FORMATS ── */}
      <section className="py-20 bg-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-black mb-10">Every content format, made shoppable</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {formats.map((fmt) => (
              <div key={fmt.label} className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl px-5 py-4 flex items-center gap-3">
                <span className="shrink-0" style={{ color: fmt.color }}>{fmt.icon}</span>
                <span className="text-sm font-semibold text-gray-300 text-left">{fmt.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-[#060606]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-black text-white text-center mb-12">Merchants selling on social</h2>
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
            Start selling social,<br />
            <span className="text-[#DC2626]">today.</span>
          </h2>
          <p className="text-gray-400 text-lg mb-10">Connect your first channel in under 10 minutes.</p>
          <button onClick={() => navigate('/register')} className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-black font-black text-lg px-10 py-4 rounded-full transition-all duration-200 shadow-xl shadow-white/5">
            Start free <ArrowRightIcon className="w-5 h-5" />
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
