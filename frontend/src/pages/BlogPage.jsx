import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon, SearchIcon, ClockIcon, UserCircleIcon, TagIcon,
  StarIcon, BookOpenIcon, TrendingUpIcon, MailIcon, CheckIcon,
  ChevronRightIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

const CDN = 'https://cdn.shopify.com/b/shopify-brochure2-assets';

/* ─── CATEGORIES ─── */
const CATS = ['All', 'Commerce', 'Marketing', 'Growth', 'Technology', 'Case Studies'];

/* ─── FEATURED POST ─── */
const featured = {
  category: 'Commerce',
  categoryColor: '#DC2626',
  title: 'The Future of Commerce in 2025: AI, Unified Commerce, and the Merchant Mandate',
  excerpt: 'As AI reshapes the buying journey and physical-digital boundaries dissolve, the merchants who win will be those who moved fastest. We break down the five trends defining this decade of commerce — and what you can do this quarter to capitalise on each one.',
  author: { name: 'Priya Sharma', role: 'Commerce Editor', avatar: 'P' },
  date: 'Jul 28, 2025',
  readTime: '9 min read',
  img: `${CDN}/home-hero.png`,
};

/* ─── BLOG POSTS ─── */
const posts = [
  { id: 1,  category: 'Marketing',   categoryColor: '#0284C7', title: 'How 7 DTC Brands Drove 40%+ Growth With Email Alone',              excerpt: 'A deep dive into the automation sequences, segmentation strategies, and design principles that turned email into their highest-ROI channel.',     author: 'James O.', date: 'Jul 24, 2025', readTime: '7 min', img: `${CDN}/email-marketing.png`        },
  { id: 2,  category: 'Technology',  categoryColor: '#7C3AED', title: 'CommerceHub Checkout Extensions: A Developer Primer',             excerpt: 'Step-by-step guide to building your first checkout UI extension — from local dev setup to App Store submission in under an afternoon.',       author: 'Yuki T.',   date: 'Jul 22, 2025', readTime: '11 min', img: `${CDN}/developers.png`             },
  { id: 3,  category: 'Growth',      categoryColor: '#059669', title: 'The BFCM Playbook: 12 Weeks Out',                                  excerpt: 'Start preparing now or scramble in November. A week-by-week countdown with every tactic, asset, and technical check you need.',            author: 'Carlos M.', date: 'Jul 19, 2025', readTime: '13 min', img: `${CDN}/pos-hero.png`               },
  { id: 4,  category: 'Case Studies',categoryColor: '#D97706', title: 'From Zero to Rs.12 Crore: How Verdure Wellness Scaled on CommerceHub', excerpt: 'The full story of how a Kerala-based Ayurvedic brand went from a garage operation to one of the fastest-growing wellness brands in India.',  author: 'Priya S.',  date: 'Jul 17, 2025', readTime: '8 min',  img: `${CDN}/enterprise.png`             },
  { id: 5,  category: 'Commerce',    categoryColor: '#DC2626', title: 'Understanding CommerceHub Markets: Sell Globally, Price Locally', excerpt: 'Currency rounding, local payment methods, duties handling, and storefront localisation — everything you need to know about cross-border expansion.',  author: 'Lin F.',   date: 'Jul 15, 2025', readTime: '10 min', img: `${CDN}/analytics.png`              },
  { id: 6,  category: 'Marketing',   categoryColor: '#0284C7', title: 'The 2025 SEO Guide for CommerceHub Merchants',                   excerpt: 'From Core Web Vitals to structured data to faceted navigation — a technical SEO checklist written specifically for CommerceHub stores.',    author: 'Noor P.',   date: 'Jul 12, 2025', readTime: '15 min', img: `${CDN}/seo-tools.png`              },
  { id: 7,  category: 'Technology',  categoryColor: '#7C3AED', title: 'CommerceHub AI: What All the New Features Actually Do',          excerpt: 'We tested every new AI feature released in the last six months — from smart product descriptions to predictive reorder alerts.',             author: 'Marcus W.', date: 'Jul 10, 2025', readTime: '6 min',  img: `${CDN}/ai-features.png`            },
  { id: 8,  category: 'Growth',      categoryColor: '#059669', title: 'Customer Retention in 2025: Why Your Next Sale is to Someone Who Already Bought', excerpt: 'A playbook for loyalty programs, win-back campaigns, and post-purchase experiences that dramatically raise LTV.',                 author: 'Amara O.',  date: 'Jul 8, 2025',  readTime: '9 min',  img: `${CDN}/customers.png`              },
  { id: 9,  category: 'Case Studies',categoryColor: '#D97706', title: 'Gymshark Built on CommerceHub: The Architecture Behind a Billion-Dollar Brand', excerpt: 'A technical and operational deep-dive into how Gymshark uses CommerceHub Plus to power global flash sales at scale.',        author: 'Devraj K.', date: 'Jul 5, 2025',  readTime: '12 min', img: `${CDN}/merchant-stories.png`      },
];

/* ─── TRENDING TOPICS ─── */
const trendingTopics = [
  'BFCM 2025', 'AI Copywriting', 'Headless Commerce', 'Email Flows', 'Multi-currency',
  'POS', 'Subscriptions', 'Meta Ads', 'Migration', 'Checkout Extensibility', 'SEO 2025', 'B2B',
];

/* ─── NEWSLETTER BENEFIT ─── */
const benefits = ['Weekly insights every Tuesday', 'Exclusive merchant case studies', 'Early access to new guides', 'No spam — unsubscribe any time'];

export default function BlogPage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const filteredPosts = posts.filter(p => {
    const matchesCat = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.excerpt.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) setSubscribed(true);
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-32 pb-24 text-center">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 65% 50% at 50% -5%, rgba(220,38,38,0.26) 0%, transparent 68%)' }} />
        <div className="relative max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#DC2626] mb-6 px-3 py-1.5 rounded-full border border-[#DC2626]/30 bg-[#DC2626]/10">
              CommerceHub Blog
            </span>
            <h1 className="text-5xl sm:text-7xl font-black leading-[0.93] tracking-tight mb-6">
              Commerce insights
              <br />
              <span className="text-[#DC2626]">for ambitious merchants.</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
              Practical guides, data-backed strategies, merchant case studies, and deep dives on every topic that moves your business forward.
            </p>
            <div className="relative max-w-xl mx-auto">
              <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search articles — e.g. email, BFCM, checkout..."
                className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-full pl-12 pr-6 py-4 text-white placeholder-gray-700 text-sm focus:outline-none focus:border-[#DC2626]/50 transition-colors"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FEATURED POST ── */}
      <section className="py-12 bg-[#060606]">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#DC2626] mb-6">Featured article</p>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group grid md:grid-cols-2 gap-0 bg-[#0a0a0a] border border-white/[0.07] rounded-3xl overflow-hidden hover:border-white/[0.16] cursor-pointer transition-all duration-300"
            onClick={() => navigate('/register')}
          >
            <div className="relative overflow-hidden bg-[#111] min-h-[260px]">
              <img src={featured.img} alt={featured.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500" onError={e => { e.currentTarget.style.display = 'none'; }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(220,38,38,0.15) 0%, transparent 60%)' }} />
            </div>
            <div className="p-10 flex flex-col justify-center">
              <span className="inline-block text-xs font-black uppercase tracking-wide px-2.5 py-1 rounded-full mb-4 w-fit" style={{ background: `${featured.categoryColor}14`, color: featured.categoryColor }}>
                {featured.category}
              </span>
              <h2 className="text-2xl font-black text-white leading-snug mb-4 group-hover:text-[#DC2626] transition-colors">{featured.title}</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{featured.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#DC2626]/20 flex items-center justify-center text-[#DC2626] font-black text-sm">{featured.author.avatar}</div>
                  <div>
                    <p className="text-white text-xs font-bold">{featured.author.name}</p>
                    <p className="text-gray-600 text-xs">{featured.author.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <span>{featured.date}</span>
                  <span className="flex items-center gap-1"><ClockIcon className="w-3 h-3" /> {featured.readTime}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CATEGORY TABS + GRID ── */}
      <section className="py-16 bg-black">
        <div className="max-w-6xl mx-auto px-6">
          {/* Category tabs */}
          <div className="flex items-center gap-2 flex-wrap mb-10">
            {CATS.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-all duration-200 ${activeCategory === cat ? 'bg-[#DC2626] text-white' : 'bg-[#0a0a0a] border border-white/[0.08] text-gray-400 hover:border-white/[0.2] hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Posts grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.38, delay: (i % 3) * 0.07 }}
                  className="group bg-[#0a0a0a] border border-white/[0.06] rounded-2xl overflow-hidden hover:border-white/[0.15] cursor-pointer transition-all duration-200 flex flex-col"
                  onClick={() => navigate('/register')}
                >
                  <div className="relative overflow-hidden bg-[#111] h-44">
                    <img src={post.img} alt={post.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-500" onError={e => { e.currentTarget.style.display = 'none'; }} />
                    <span className="absolute top-4 left-4 text-[10px] font-black uppercase tracking-wide px-2.5 py-1 rounded-full" style={{ background: `${post.categoryColor}cc`, color: '#fff' }}>
                      {post.category}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-white font-black text-base leading-snug mb-3 group-hover:text-[#DC2626] transition-colors flex-1">{post.title}</h3>
                    <p className="text-gray-500 text-xs leading-relaxed mb-5 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-600 pt-4 border-t border-white/[0.05]">
                      <span className="font-medium text-gray-400">{post.author}</span>
                      <div className="flex items-center gap-2.5">
                        <span>{post.date}</span>
                        <span className="flex items-center gap-1"><ClockIcon className="w-3 h-3" /> {post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">No articles match your search.</p>
              <button onClick={() => { setSearch(''); setActiveCategory('All'); }} className="mt-4 text-[#DC2626] text-sm font-bold hover:underline">Clear filters</button>
            </div>
          )}

          {filteredPosts.length > 0 && (
            <div className="text-center mt-12">
              <button onClick={() => navigate('/register')} className="inline-flex items-center gap-2 border border-white/15 hover:border-white/40 text-white font-semibold px-8 py-3.5 rounded-full text-sm transition-all duration-200">
                Load more articles <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── TRENDING TOPICS ── */}
      <section className="py-16 bg-[#060606] border-y border-white/[0.04]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUpIcon className="w-5 h-5 text-[#DC2626]" />
            <h2 className="text-base font-black text-white uppercase tracking-wide">Trending topics</h2>
          </div>
          <div className="flex flex-wrap gap-2.5">
            {trendingTopics.map(topic => (
              <button
                key={topic}
                onClick={() => { setSearch(topic); setActiveCategory('All'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="px-4 py-2 text-sm font-semibold bg-[#0a0a0a] border border-white/[0.08] rounded-full text-gray-400 hover:border-[#DC2626]/50 hover:text-white transition-all duration-200"
              >
                {topic}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── NEWSLETTER STRIP ── */}
      <section className="py-20 bg-black">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-[#0a0a0a] border border-white/[0.07] rounded-3xl p-10 sm:p-14 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#DC2626] mb-5 px-3 py-1.5 rounded-full border border-[#DC2626]/30 bg-[#DC2626]/10">
                <MailIcon className="w-3.5 h-3.5" /> Weekly Newsletter
              </span>
              <h2 className="text-3xl font-black mb-4 leading-tight">Get commerce insights<br />straight to your inbox.</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">Subscribe and join 280,000 merchants who get the CommerceHub Digest every Tuesday.</p>
              <ul className="space-y-2">
                {benefits.map(b => (
                  <li key={b} className="flex items-center gap-2.5 text-xs text-gray-400">
                    <CheckIcon className="w-3.5 h-3.5 text-[#DC2626] shrink-0" strokeWidth={2.5} /> {b}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              {subscribed ? (
                <div className="bg-green-900/20 border border-green-700/30 rounded-2xl p-8 text-center">
                  <CheckIcon className="w-10 h-10 text-green-400 mx-auto mb-3" strokeWidth={2} />
                  <p className="text-white font-black text-lg mb-1">You're in!</p>
                  <p className="text-gray-400 text-sm">Your first issue lands next Tuesday.</p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@yourstore.com"
                    required
                    className="w-full bg-[#060606] border border-white/[0.08] rounded-xl px-5 py-3.5 text-white placeholder-gray-700 text-sm focus:outline-none focus:border-[#DC2626]/50 transition-colors"
                  />
                  <button type="submit" className="w-full bg-[#DC2626] hover:bg-[#b91c1c] text-white font-black py-3.5 rounded-xl transition-all duration-200 text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-900/20">
                    <MailIcon className="w-4 h-4" /> Subscribe — it's free
                  </button>
                  <p className="text-gray-700 text-[11px] text-center">No spam. Unsubscribe any time. Read our Privacy Policy.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative py-28 bg-[#060606] overflow-hidden text-center">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 55% 45% at 50% 100%, rgba(220,38,38,0.2) 0%, transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto px-6">
          <h2 className="text-5xl font-black leading-tight mb-5">Read. Learn.<br /><span className="text-[#DC2626]">Grow your store.</span></h2>
          <p className="text-gray-400 text-lg mb-10">Start your free trial today and put every insight you have learned here into action.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/register')} className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-black font-black text-lg px-10 py-4 rounded-full transition-all duration-200">
              Start free trial <ArrowRightIcon className="w-5 h-5" />
            </button>
            <button className="inline-flex items-center gap-2 border border-white/20 hover:border-white/50 text-white font-bold text-lg px-10 py-4 rounded-full transition-all duration-200" onClick={() => { setSearch(''); setActiveCategory('All'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
              Browse all articles
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
