import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon, SearchIcon, TagIcon, BarChart2Icon, DollarSignIcon,
  ShoppingBagIcon, TruckIcon, PaletteIcon, FileTextIcon, UsersIcon,
  GlobeIcon, ZapIcon, Calculator, Hash, Percent, Package, Mail,
  QrCodeIcon, LinkIcon, ImageIcon, ClipboardListIcon, TrendingUpIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

/* ─────────────────────────────────────
   TOOLS DATA
───────────────────────────────────────*/
const tools = [
  /* ── Business Finance ── */
  {
    id: 'profit-margin',
    category: 'Finance',
    icon: <Percent className="w-6 h-6" />,
    name: 'Profit Margin Calculator',
    desc: 'Calculate your ideal selling price to hit your target profit margin. Understand gross vs. net margin instantly.',
    cta: 'Calculate now',
    color: '#DC2626',
    popular: true,
    component: 'ProfitMarginCalc',
  },
  {
    id: 'markup-calculator',
    category: 'Finance',
    icon: <Calculator className="w-6 h-6" />,
    name: 'Markup Calculator',
    desc: 'Find the perfect markup percentage from cost to sale price. Avoid underpricing your products ever again.',
    cta: 'Calculate now',
    color: '#DC2626',
    popular: false,
  },
  {
    id: 'break-even',
    category: 'Finance',
    icon: <TrendingUpIcon className="w-6 h-6" />,
    name: 'Break-Even Calculator',
    desc: 'Discover exactly how many units you need to sell before your business turns profitable.',
    cta: 'Calculate now',
    color: '#DC2626',
    popular: false,
  },
  {
    id: 'cpc-calculator',
    category: 'Finance',
    icon: <DollarSignIcon className="w-6 h-6" />,
    name: 'CPM / CPC Calculator',
    desc: 'Plan your ad budgets smarter. Calculate cost-per-mille and cost-per-click for any advertising campaign.',
    cta: 'Calculate now',
    color: '#DC2626',
    popular: false,
  },

  /* ── Product & Inventory ── */
  {
    id: 'barcode-generator',
    category: 'Products',
    icon: <Hash className="w-6 h-6" />,
    name: 'Barcode Generator',
    desc: 'Generate free EAN-13, UPC-A, or Code 128 barcodes for your products instantly — ready to download and print.',
    cta: 'Generate barcode',
    color: '#7C3AED',
    popular: true,
  },
  {
    id: 'qr-code',
    category: 'Products',
    icon: <QrCodeIcon className="w-6 h-6" />,
    name: 'QR Code Generator',
    desc: 'Create custom QR codes for your store, products, or campaigns. Download in high resolution PNG or SVG.',
    cta: 'Generate QR code',
    color: '#7C3AED',
    popular: false,
  },
  {
    id: 'sku-generator',
    category: 'Products',
    icon: <Package className="w-6 h-6" />,
    name: 'SKU Generator',
    desc: 'Build consistent, searchable SKU codes for all your product variants in seconds.',
    cta: 'Generate SKUs',
    color: '#7C3AED',
    popular: false,
  },
  {
    id: 'shipping-label',
    category: 'Products',
    icon: <TruckIcon className="w-6 h-6" />,
    name: 'Shipping Label Maker',
    desc: 'Design and print professional shipping labels with all required carrier fields — free, no account needed.',
    cta: 'Create label',
    color: '#7C3AED',
    popular: false,
  },

  /* ── Marketing & Copy ── */
  {
    id: 'business-name',
    category: 'Marketing',
    icon: <ZapIcon className="w-6 h-6" />,
    name: 'Business Name Generator',
    desc: 'Enter a keyword and get hundreds of unique, brandable business name ideas — powered by AI.',
    cta: 'Generate names',
    color: '#0284C7',
    popular: true,
  },
  {
    id: 'slogan-maker',
    category: 'Marketing',
    icon: <TagIcon className="w-6 h-6" />,
    name: 'Slogan Maker',
    desc: 'Create memorable slogans and taglines for your brand or product with our AI-powered generator.',
    cta: 'Make a slogan',
    color: '#0284C7',
    popular: false,
  },
  {
    id: 'email-subject',
    category: 'Marketing',
    icon: <Mail className="w-6 h-6" />,
    name: 'Email Subject Line Generator',
    desc: 'Write email subject lines that get opened. Generate 20+ high-converting subject line options instantly.',
    cta: 'Generate lines',
    color: '#0284C7',
    popular: false,
  },
  {
    id: 'hashtag-generator',
    category: 'Marketing',
    icon: <Hash className="w-6 h-6" />,
    name: 'Hashtag Generator',
    desc: 'Find the best hashtags for any niche or product. Maximise your organic reach on Instagram and TikTok.',
    cta: 'Find hashtags',
    color: '#0284C7',
    popular: false,
  },
  {
    id: 'utm-builder',
    category: 'Marketing',
    icon: <LinkIcon className="w-6 h-6" />,
    name: 'UTM Link Builder',
    desc: 'Build properly formatted UTM tracking URLs for all your campaigns — no more guessing in Google Analytics.',
    cta: 'Build UTM link',
    color: '#0284C7',
    popular: false,
  },

  /* ── Design & Branding ── */
  {
    id: 'logo-maker',
    category: 'Design',
    icon: <PaletteIcon className="w-6 h-6" />,
    name: 'Logo Maker',
    desc: 'Design a professional logo for your business in minutes with our AI-powered logo creator.',
    cta: 'Create logo',
    color: '#059669',
    popular: true,
  },
  {
    id: 'image-resizer',
    category: 'Design',
    icon: <ImageIcon className="w-6 h-6" />,
    name: 'Image Resizer',
    desc: 'Resize product photos to perfect dimensions for your store, social media, or marketplace listings — for free.',
    cta: 'Resize image',
    color: '#059669',
    popular: false,
  },
  {
    id: 'color-palette',
    category: 'Design',
    icon: <PaletteIcon className="w-6 h-6" />,
    name: 'Brand Colour Palette Generator',
    desc: 'Extract a professional colour palette from your logo or inspiration image. Build a consistent brand identity.',
    cta: 'Generate palette',
    color: '#059669',
    popular: false,
  },

  /* ── Business Planning ── */
  {
    id: 'business-plan',
    category: 'Planning',
    icon: <FileTextIcon className="w-6 h-6" />,
    name: 'Business Plan Generator',
    desc: 'Answer a few questions and get a professionally structured business plan template — ready to customise.',
    cta: 'Create plan',
    color: '#EA580C',
    popular: true,
  },
  {
    id: 'terms-conditions',
    category: 'Planning',
    icon: <ClipboardListIcon className="w-6 h-6" />,
    name: 'Terms & Conditions Generator',
    desc: 'Generate a legally sound T&C document for your online store. Customised to your business in minutes.',
    cta: 'Generate T&C',
    color: '#EA580C',
    popular: false,
  },
  {
    id: 'privacy-policy',
    category: 'Planning',
    icon: <FileTextIcon className="w-6 h-6" />,
    name: 'Privacy Policy Generator',
    desc: 'Create a GDPR and CCPA-compliant privacy policy for free. Required by law for any online store.',
    cta: 'Generate policy',
    color: '#EA580C',
    popular: false,
  },

  /* ── Market Research ── */
  {
    id: 'trend-finder',
    category: 'Research',
    icon: <BarChart2Icon className="w-6 h-6" />,
    name: 'Market Trend Finder',
    desc: 'Spot rising product trends before the competition. Powered by real search data and market signals.',
    cta: 'Find trends',
    color: '#BE185D',
    popular: true,
  },
  {
    id: 'audience-builder',
    category: 'Research',
    icon: <UsersIcon className="w-6 h-6" />,
    name: 'Target Audience Builder',
    desc: 'Define and document your ideal customer persona with guided prompts — know exactly who you\'re selling to.',
    cta: 'Build audience',
    color: '#BE185D',
    popular: false,
  },
  {
    id: 'domain-checker',
    category: 'Research',
    icon: <GlobeIcon className="w-6 h-6" />,
    name: 'Domain Name Checker',
    desc: 'Check if your dream domain name is available across all major TLDs — instantly and for free.',
    cta: 'Check domain',
    color: '#BE185D',
    popular: false,
  },
];

const categories = ['All', ...Array.from(new Set(tools.map((t) => t.category)))];

/* ─────────────────────────────────────
   INTERACTIVE PROFIT MARGIN CALC
───────────────────────────────────────*/
function ProfitMarginWidget() {
  const [cost, setCost] = useState('');
  const [margin, setMargin] = useState('');
  const sellPrice = useMemo(() => {
    const c = parseFloat(cost);
    const m = parseFloat(margin);
    if (!c || !m || m >= 100) return null;
    return (c / (1 - m / 100)).toFixed(2);
  }, [cost, margin]);
  const profit = useMemo(() => {
    if (!sellPrice || !cost) return null;
    return (parseFloat(sellPrice) - parseFloat(cost)).toFixed(2);
  }, [sellPrice, cost]);

  return (
    <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-3xl p-8 max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <span className="w-10 h-10 rounded-xl bg-[#DC2626]/10 text-[#DC2626] flex items-center justify-center">
          <Percent className="w-5 h-5" />
        </span>
        <h3 className="font-black text-white text-lg">Profit Margin Calculator</h3>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            Cost price (₹)
          </label>
          <input
            type="number"
            value={cost}
            min="0"
            onChange={(e) => setCost(e.target.value)}
            placeholder="e.g. 500"
            className="w-full bg-[#0f0f0f] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-700 text-sm focus:outline-none focus:border-[#DC2626]/50 transition-colors"
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
            Target gross margin (%)
          </label>
          <input
            type="number"
            value={margin}
            min="0"
            max="99"
            onChange={(e) => setMargin(e.target.value)}
            placeholder="e.g. 40"
            className="w-full bg-[#0f0f0f] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder-gray-700 text-sm focus:outline-none focus:border-[#DC2626]/50 transition-colors"
          />
        </div>
      </div>
      {sellPrice && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 grid grid-cols-2 gap-4"
        >
          <div className="bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-2xl p-5 text-center">
            <p className="text-3xl font-black text-[#DC2626]">₹{sellPrice}</p>
            <p className="text-xs text-gray-500 mt-1">Selling price</p>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 text-center">
            <p className="text-3xl font-black text-black">₹{profit}</p>
            <p className="text-xs text-gray-500 mt-1">Profit per unit</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* ═════════════════════════════════════
   PAGE
═════════════════════════════════════ */
export default function FreeToolsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = useMemo(() => {
    return tools.filter((t) => {
      const matchCat = activeCategory === 'All' || t.category === activeCategory;
      const q = search.toLowerCase();
      const matchQ = !q || t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q);
      return matchCat && matchQ;
    });
  }, [search, activeCategory]);

  const popular = tools.filter((t) => t.popular);

  return (
    <div className="bg-white text-black min-h-screen font-sans">
      <Navbar />

      {/* ────────────────────────────────────
          HERO
      ──────────────────────────────────── */}
      <section className="relative overflow-hidden pt-32 pb-24 text-center">
        {/* ambient glow */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% -5%, rgba(220,38,38,0.25) 0%, transparent 65%)',
          }}
        />
        <div className="relative max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#DC2626] mb-6 px-3 py-1.5 rounded-full border border-[#DC2626]/30 bg-[#DC2626]/10">
              100% Free · No account required
            </span>
            <h1 className="text-5xl sm:text-7xl font-black leading-[0.92] tracking-tight mb-6">
              Free business tools
              <br />
              <span className="text-[#DC2626]">built for commerce</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
              Calculators, generators, and planners to help you start, run, and grow your business.
              No signup needed — use them all, completely free.
            </p>

            {/* Search */}
            <div className="relative max-w-xl mx-auto">
              <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tools — e.g. barcode, profit margin..."
                className="w-full bg-[#0a0a0a] border border-white/[0.08] rounded-full pl-12 pr-6 py-4 text-white placeholder-gray-700 text-sm focus:outline-none focus:border-[#DC2626]/50 transition-colors"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ────────────────────────────────────
          POPULAR TOOLS SPOTLIGHT
      ──────────────────────────────────── */}
      <section className="py-16 bg-[#060606] border-y border-white/[0.04]">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-gray-600 mb-8">
            Most popular tools
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-5">
            {popular.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="group relative bg-[#0a0a0a] border border-white/[0.06] rounded-3xl p-7 hover:border-white/[0.14] transition-all duration-300 cursor-pointer"
              >
                <span
                  className="inline-flex items-center justify-center w-12 h-12 rounded-2xl mb-5 text-white"
                  style={{ background: `${t.color}18`, color: t.color }}
                >
                  {t.icon}
                </span>
                <span
                  className="absolute top-5 right-5 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full"
                  style={{ background: `${t.color}18`, color: t.color }}
                >
                  Popular
                </span>
                <h3 className="font-black text-white text-lg mb-2">{t.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-5">{t.desc}</p>
                <span
                  className="inline-flex items-center gap-1.5 text-sm font-bold group-hover:gap-3 transition-all duration-200"
                  style={{ color: t.color }}
                >
                  {t.cta}
                  <ArrowRightIcon className="w-4 h-4" />
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────
          INLINE CALCULATOR — PROFIT MARGIN
      ──────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block text-xs font-bold uppercase tracking-[0.18em] text-[#DC2626] mb-4">
              Free tool
            </span>
            <h2 className="text-4xl sm:text-5xl font-black leading-tight mb-5">
              Know your numbers
              <br />
              before you sell.
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-6">
              Enter your cost price and target margin — we'll tell you exactly what to charge so
              every sale is profitable from day one.
            </p>
            <div className="flex flex-col gap-3">
              {[
                'Real-time calculation as you type',
                'Works for any currency',
                'Save and export results',
              ].map((pt) => (
                <div key={pt} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#DC2626]/10 flex items-center justify-center shrink-0">
                    <svg viewBox="0 0 12 12" className="w-3 h-3 text-[#DC2626] fill-current">
                      <path d="M10.2 2.8L4.8 8.2 2 5.4l-.8.8 3.6 3.6 6.2-6.2z" />
                    </svg>
                  </span>
                  <span className="text-gray-400 text-sm">{pt}</span>
                </div>
              ))}
            </div>
          </div>
          <ProfitMarginWidget />
        </div>
      </section>

      {/* ────────────────────────────────────
          ALL TOOLS GRID (filtered)
      ──────────────────────────────────── */}
      <section className="py-20 bg-[#060606]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-black text-white">All free tools</h2>
              <p className="text-gray-600 text-sm mt-1">{filtered.length} tools available</p>
            </div>
            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide transition-all duration-200 border ${
                    activeCategory === cat
                      ? 'bg-[#DC2626] border-[#DC2626] text-white'
                      : 'border-white/10 text-gray-500 hover:border-white/25 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-600">
              <SearchIcon className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="text-lg">No tools match your search.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((t, i) => (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
                  className="group bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-6 hover:border-white/[0.14] transition-all duration-300 cursor-pointer flex flex-col"
                >
                  <div className="flex items-start justify-between mb-4">
                    <span
                      className="inline-flex items-center justify-center w-11 h-11 rounded-xl text-white"
                      style={{ background: `${t.color}15`, color: t.color }}
                    >
                      {t.icon}
                    </span>
                    <span
                      className="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full"
                      style={{ background: `${t.color}12`, color: t.color }}
                    >
                      {t.category}
                    </span>
                  </div>
                  <h3 className="font-black text-white text-base mb-2">{t.name}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-5">{t.desc}</p>
                  <span
                    className="inline-flex items-center gap-1.5 text-sm font-bold group-hover:gap-3 transition-all duration-200 mt-auto"
                    style={{ color: t.color }}
                  >
                    {t.cta}
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </span>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ────────────────────────────────────
          COMMERCE TOOLS INFO SECTION
      ──────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-black text-black mb-8 text-center">
            Why use CommerceHub free tools?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: <ZapIcon className="w-6 h-6" />,
                title: 'Instant results',
                desc: 'All tools work in real time with no loading screens, no account creation, and no email required.',
                color: '#DC2626',
              },
              {
                icon: <ShoppingBagIcon className="w-6 h-6" />,
                title: 'Built for ecommerce',
                desc: 'Every tool is built with online sellers in mind. Not generic business software — commerce-first.',
                color: '#7C3AED',
              },
              {
                icon: <GlobeIcon className="w-6 h-6" />,
                title: 'Works everywhere',
                desc: 'Use them on any device, in any browser. Supports multiple currencies and global markets.',
                color: '#059669',
              },
            ].map(({ icon, title, desc, color }) => (
              <div
                key={title}
                className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-7 text-center"
              >
                <span
                  className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5 mx-auto"
                  style={{ background: `${color}12`, color }}
                >
                  {icon}
                </span>
                <h3 className="font-black text-white text-base mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ────────────────────────────────────
          CTA — bridge to store creation
      ──────────────────────────────────── */}
      <section className="relative py-32 bg-[#060606] overflow-hidden text-center">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 50% 100%, rgba(220,38,38,0.2) 0%, transparent 70%)',
          }}
        />
        <div className="relative max-w-2xl mx-auto px-6">
          <h2 className="text-5xl sm:text-6xl font-black leading-tight mb-6">
            Tools are just
            <br />
            <span className="text-[#DC2626]">the beginning.</span>
          </h2>
          <p className="text-gray-600 text-lg mb-10 leading-relaxed">
            Once you've planned your business, launch your online store with CommerceHub —
            the world's most complete commerce platform.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-black text-lg px-10 py-4 rounded-full transition-all duration-200 shadow-xl"
          >
            Start your store — free
            <ArrowRightIcon className="w-5 h-5" />
          </button>
          <p className="text-gray-700 text-sm mt-4">No credit card required · 3-day free trial</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
