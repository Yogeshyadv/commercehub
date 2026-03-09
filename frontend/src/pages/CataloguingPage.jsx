import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRightIcon, CheckIcon, TagIcon, GridIcon, LayersIcon,
  FileTextIcon, SearchIcon, UploadIcon, SparklesIcon, DatabaseIcon,
  ImageIcon, ToggleLeftIcon, ChevronDownIcon, StarIcon, PencilIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

/* ───────────────────────────────────────── CDN */
const CDN = 'https://cdn.shopify.com/b/shopify-brochure2-assets';
const IMG = {
  editor:       `${CDN}/7a4eec77108a4be805d703953ac70c30.png`,
  speed:        `${CDN}/ea7de41c67f060d0ea79aca7f25f2953.png`,
  collab:       `${CDN}/73baf5efde53894bbe8620b107f5f4c6.png`,
  ai:           `${CDN}/27e4cd83b4296c634951aec9deee6a91.png`,
  pitch:        `${CDN}/1410e37520422053adfa8b2bed85aef1.png`,
  tinker:       `${CDN}/f531232ca65eb5c5de30fe72c6c24bf1.png`,
  storefront:   `${CDN}/88be45c1ad280aaa06301e64dc9efddc.png`,
  liquid:       `${CDN}/2e07f1679ba8d4c3e7717a75a2e67613.png`,
  b2bStore:     `${CDN}/f9390182b37cab5910307e399a6a69d6.webp`,
  techStack:    `${CDN}/b8fa2d372bb0994b0a8b4a26aab3d0a7.webp`,
  heritage:     `${CDN}/a426ec8c1268225a1d42d1f736748793.jpg`,
};

/* ───────────────────────────────────────── DATA */
const stats = [
  { value: 'Unlimited', label: 'Products & variants', desc: 'No catalogue cap ever',          icon: DatabaseIcon },
  { value: 'Bulk',      label: 'Import / export CSV',  desc: 'Thousands of items at once',     icon: UploadIcon },
  { value: 'Smart',     label: 'Auto-collections',     desc: 'Rule-based automated grouping',  icon: GridIcon },
  { value: 'AI-gen',    label: 'Descriptions & media', desc: 'Powered by Shopify Magic',        icon: SparklesIcon },
];

const catalogueTabs = [
  {
    id: 'products',
    icon: <TagIcon className="w-5 h-5" />,
    label: 'Product management',
    heading: 'One place for every product',
    desc: "Add titles, descriptions, images, videos, 3D models, variants (size, colour, material), pricing, SKUs, inventory, weight, and custom metafields — all in one intuitive interface.",
    img: IMG.editor,
    features: [
      'Unlimited products and variants',
      'Drag-and-drop image sorting',
      'Variant-level pricing & images',
      'Inventory tracking per location',
      'Barcode & SKU management',
    ],
  },
  {
    id: 'collections',
    icon: <GridIcon className="w-5 h-5" />,
    label: 'Collections',
    heading: 'Organise into smart collections',
    desc: "Create manual collections by hand-picking products, or automated (smart) collections where products are added automatically based on tags, price, title, or any custom condition you set.",
    img: IMG.b2bStore,
    features: [
      'Manual & automated collections',
      'Condition-based auto-rules',
      'Sort orders per collection',
      'Nested sub-collections',
      'Publish / hide by date',
    ],
  },
  {
    id: 'metafields',
    icon: <DatabaseIcon className="w-5 h-5" />,
    label: 'Metafields & custom data',
    heading: 'Custom data for every product',
    desc: "With metafields and metaobjects, add any type of structured data — ingredients, sizing guides, technical specs, care labels, or sustainability scores — and display them exactly how you want.",
    img: IMG.liquid,
    features: [
      'Custom field types (text, date, file, JSON)',
      'Metaobjects for rich content',
      'SEO-optimised schema output',
      'API-accessible for headless',
      'Filtering by custom metafields',
    ],
  },
  {
    id: 'bulkedit',
    icon: <PencilIcon className="w-5 h-5" />,
    label: 'Bulk editing',
    heading: 'Update thousands at once',
    desc: "Edit prices, inventory, tags, and metafields across your entire catalogue in seconds with the bulk editor, CSV import/export, or our API — saving hours of repetitive work.",
    img: IMG.collab,
    features: [
      'Bulk edit via spreadsheet-style UI',
      'CSV import/export with mapping',
      'Scheduled price changes',
      'Price list rules & overrides',
      'Full admin API access',
    ],
  },
];

const allFeatures = [
  { icon: <SparklesIcon className="w-5 h-5" />, heading: 'AI descriptions', desc: "Generate accurate product descriptions in seconds with Shopify Magic — just paste a product name and let AI do the rest." },
  { icon: <ImageIcon className="w-5 h-5" />, heading: 'Rich media', desc: "Showcase products with unlimited images, video, and 3D models. Zoom, 360° spin, and AR try-on — all built in." },
  { icon: <SearchIcon className="w-5 h-5" />, heading: 'SEO built-in', desc: "Auto-generate canonical URLs, JSON-LD schema, meta tags, and sitemaps. Full SEO control for every product page." },
  { icon: <ToggleLeftIcon className="w-5 h-5" />, heading: 'Product status', desc: "Draft, active, archived — control visibility across channels with a single toggle. Schedule launches in advance." },
  { icon: <LayersIcon className="w-5 h-5" />, heading: 'Product bundles', desc: "Offer fixed bundles and multipacks to drive larger average order values and reduce individual shipping costs." },
  { icon: <FileTextIcon className="w-5 h-5" />, heading: 'Inventory sync', desc: "Track stock across all your warehouses and locations in real time. Set reorder alerts and never oversell again." },
  { icon: <UploadIcon className="w-5 h-5" />, heading: 'Bulk import', desc: "Import your entire catalogue from any platform via CSV. Our templates make migration fast and headache-free." },
  { icon: <CheckIcon className="w-5 h-5" />, heading: 'Channels publishing', desc: "Publish your catalogue to online store, social shops, B2B portals, marketplaces, and POS—all from one place." },
];

const faq = [
  { q: 'How many products can I add?', a: "Unlimited. CommerceHub doesn't cap your product count or variant count — whether you sell 5 items or 5 million, the platform handles it all." },
  { q: 'Can I import my existing catalogue?', a: "Yes. Import your products from Shopify, WooCommerce, BigCommerce, or any platform via CSV. Our import wizard maps your columns to our fields and validates all data before importing." },
  { q: 'How do smart collections work?', a: "Smart (automated) collections use rules you define — product tag, title contains, price range, vendor — to automatically include matching products. New products that match are added instantly." },
  { q: 'What are metafields for?', a: "Metafields let you store custom data on products — like ingredients, care instructions, technical specs, or any structured field specific to your industry. They appear on your storefront exactly where you want." },
  { q: 'Can my team collaborate on the catalogue?', a: "Yes. You can add unlimited staff accounts with granular permissions — set who can create, edit, publish, or delete products without giving full admin access." },
];

/* ───────────────────────────────────────── HELPERS */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button onClick={() => setOpen(o => !o)} className="w-full text-left flex items-center justify-between py-5 group">
        <span className="font-black text-gray-900 text-base group-hover:text-[#DC2626] transition-colors pr-8">{q}</span>
        <ChevronDownIcon className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-[#DC2626]' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28 }} className="overflow-hidden">
            <p className="text-gray-500 text-sm font-medium leading-relaxed pb-5">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1], delay },
});

/* ───────────────────────────────────────── PAGE */
export default function CataloguingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const ct = catalogueTabs.find(t => t.id === activeTab);

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative bg-black text-white pt-36 pb-0 px-6 overflow-hidden">
        <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#DC2626]/10 rounded-full blur-[160px]" />
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
            <span className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.3em] text-[#DC2626] mb-7">
              <span className="w-5 h-[2px] bg-[#DC2626]" />Cataloguing
            </span>
            <h1 className="text-[clamp(2.8rem,5.5vw,4.8rem)] font-black leading-[1.0] tracking-tight text-white mb-6">
              Organise every product. Sell everywhere.
            </h1>
            <p className="text-gray-400 text-lg font-medium leading-relaxed mb-10 max-w-lg">
              Build, organise, and publish your full product catalogue — with AI-powered tools, smart collections, and rich media — all from a single powerful admin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={() => navigate('/register')} className="px-8 py-4 bg-[#DC2626] text-white font-black rounded-2xl hover:bg-[#B91C1C] active:scale-[0.98] transition-all text-sm flex items-center justify-center gap-2 group">
                Start for free <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button onClick={() => navigate('/pricing')} className="px-8 py-4 bg-white/[0.06] border border-white/[0.12] text-white font-black rounded-2xl hover:bg-white/[0.12] transition-all text-sm">
                View pricing
              </button>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }} className="relative">
            {/* Stacked card effect */}
            <div className="relative">
              <div className="absolute -top-3 left-3 right-3 h-full rounded-3xl bg-white/[0.03] border border-white/[0.05] -z-10" />
              <div className="absolute -top-1.5 left-1.5 right-1.5 h-full rounded-3xl bg-white/[0.05] border border-white/[0.07] -z-10" />
              <div className="rounded-3xl overflow-hidden border border-white/[0.07] shadow-2xl bg-[#111]">
                <div className="bg-[#1a1a1a] flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]">
                  <span className="w-3 h-3 rounded-full bg-[#DC2626]/70" /><span className="w-3 h-3 rounded-full bg-white/20" /><span className="w-3 h-3 rounded-full bg-white/20" />
                  <div className="ml-3 h-4 w-36 bg-white/[0.04] rounded" />
                  <div className="ml-auto h-7 w-24 bg-[#DC2626]/20 rounded-lg" />
                </div>
                <img src={IMG.editor} alt="Product catalogue editor" className="w-full object-cover max-h-[400px] object-top" loading="eager" />
              </div>
            </div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }}
              className="absolute -bottom-5 -right-5 bg-[#DC2626] text-white rounded-2xl px-5 py-4 shadow-xl z-10">
              <p className="font-black text-2xl leading-none">∞</p>
              <p className="text-white/80 text-xs font-semibold mt-0.5">Unlimited products</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1 }}
              className="absolute -top-5 -left-5 bg-white text-black rounded-2xl px-5 py-4 shadow-xl z-10">
              <p className="text-[#DC2626] font-black text-xl leading-none">AI ✦</p>
              <p className="text-gray-600 text-xs font-semibold mt-0.5">Auto descriptions</p>
            </motion.div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent pointer-events-none" />
      </section>

      {/* ── STATS BAR ── */}
      <section className="relative bg-gradient-to-b from-[#0a0a0a] to-black overflow-hidden border-y border-white/[0.05]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(220,38,38,0.06),transparent)]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#DC2626]/60 to-transparent" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={i} {...fadeUp(i * 0.1)}
                  className="group relative flex flex-col items-center text-center px-6 py-12 rounded-2xl hover:bg-white/[0.03] transition-all duration-300">
                  {i > 0 && (
                    <div className="hidden lg:block absolute left-0 inset-y-10 w-px bg-gradient-to-b from-transparent via-white/[0.07] to-transparent" />
                  )}
                  <div className="mb-5 relative w-12 h-12">
                    <div className="absolute -inset-3 rounded-3xl bg-[#DC2626]/15 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative w-full h-full bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-2xl flex items-center justify-center group-hover:border-[#DC2626]/50 group-hover:bg-[#DC2626]/15 transition-all duration-300">
                      <Icon className="w-5 h-5 text-[#DC2626]" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <p className="text-white text-3xl md:text-4xl font-black leading-none tracking-tight group-hover:text-[#DC2626] transition-colors duration-300">{s.value}</p>
                  </div>
                  <p className="text-gray-300 text-sm font-bold mb-1">{s.label}</p>
                  <p className="text-gray-600 text-xs font-medium">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TABBED FEATURE EXPLORER ── */}
      <section className="bg-[#0a0a0a] py-28 px-6 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="mb-14">
            <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-[#DC2626] mb-5">Catalogue Tools</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight max-w-2xl">
              A better way to manage every product
            </h2>
          </motion.div>

          {/* Tab pills */}
          <div className="flex flex-wrap gap-3 mb-10">
            {catalogueTabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-full border text-sm font-bold transition-all ${
                  activeTab === tab.id ? 'bg-[#DC2626] border-[#DC2626] text-white shadow-lg shadow-[#DC2626]/25' : 'bg-white/[0.04] border-white/[0.08] text-gray-400 hover:border-white/20 hover:text-white'
                }`}>
                <span className={activeTab === tab.id ? 'text-white' : 'text-[#DC2626]'}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              {/* Content */}
              <div>
                <h3 className="text-3xl font-black text-white mb-5">{ct.heading}</h3>
                <p className="text-gray-400 text-base font-medium leading-relaxed mb-8">{ct.desc}</p>
                <ul className="space-y-3">
                  {ct.features.map((f, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#DC2626]/20 text-[#DC2626] flex items-center justify-center shrink-0">
                        <CheckIcon className="w-3 h-3" strokeWidth={3} />
                      </div>
                      <span className="text-gray-300 text-sm font-semibold">{f}</span>
                    </li>
                  ))}
                </ul>
                <button onClick={() => navigate('/register')} className="mt-10 inline-flex items-center gap-2 bg-[#DC2626] text-white font-black text-sm px-7 py-4 rounded-2xl hover:bg-[#B91C1C] transition-all group">
                  Try it free <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
              {/* Screenshot */}
              <div className="rounded-3xl overflow-hidden border border-white/[0.07] bg-[#111] shadow-2xl">
                <div className="bg-[#1a1a1a] flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.06]">
                  <span className="w-3 h-3 rounded-full bg-[#DC2626]/70" /><span className="w-3 h-3 rounded-full bg-white/20" /><span className="w-3 h-3 rounded-full bg-white/20" />
                  <div className="ml-3 h-4 flex-1 bg-white/[0.04] rounded" />
                </div>
                <img src={ct.img} alt={ct.heading} className="w-full object-cover max-h-[400px]" loading="lazy" />
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* ── ALL CATALOGUING FEATURES ── */}
      <section className="bg-[#f7f7f7] py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-[#DC2626] mb-5">Everything included</span>
            <h2 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4">All the catalogue tools you need</h2>
            <p className="text-gray-500 text-base font-medium max-w-xl mx-auto">No plugins required — every feature ships with CommerceHub.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {allFeatures.map((f, i) => (
              <motion.div key={i} {...fadeUp(i * 0.05)} className="group bg-white rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all border border-gray-100">
                <div className="w-11 h-11 rounded-2xl bg-[#DC2626]/10 text-[#DC2626] flex items-center justify-center mb-6 group-hover:bg-[#DC2626] group-hover:text-white transition-all">
                  {f.icon}
                </div>
                <h3 className="text-gray-900 font-black text-base mb-2.5">{f.heading}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI + SPEED SPLIT ── */}
      <section className="bg-black py-28 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          <motion.div {...fadeUp()} className="rounded-3xl overflow-hidden border border-white/[0.07] bg-[#111] group hover:border-[#DC2626]/30 transition-all">
            <img src={IMG.ai} alt="AI catalogue tools" className="w-full object-cover max-h-[280px] group-hover:scale-[1.02] transition-transform duration-500" loading="lazy" />
            <div className="p-9">
              <span className="inline-block bg-[#DC2626]/15 text-[#DC2626] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4">AI-Powered</span>
              <h3 className="text-white font-black text-2xl mb-3">Describe. Publish. Done.</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">Shopify Magic generates product titles, descriptions, SEO meta tags, and even alt text for images — eliminating hours of copywriting work across your entire catalogue.</p>
              <button className="inline-flex items-center gap-2 font-black text-sm text-[#DC2626] group/b">
                Explore AI tools <ArrowRightIcon className="w-4 h-4 group-hover/b:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.1)} className="rounded-3xl overflow-hidden border border-white/[0.07] bg-[#111] group hover:border-[#DC2626]/30 transition-all">
            <img src={IMG.speed} alt="Performance and speed" className="w-full object-cover max-h-[280px] group-hover:scale-[1.02] transition-transform duration-500" loading="lazy" />
            <div className="p-9">
              <span className="inline-block bg-[#DC2626]/15 text-[#DC2626] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4">Performance</span>
              <h3 className="text-white font-black text-2xl mb-3">Built to handle everything</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">Billions of products. Flash sales. International traffic spikes. Our cataloguing infrastructure is battle-hardened for scale — 99.9% uptime, globally distributed, zero throttling.</p>
              <button className="inline-flex items-center gap-2 font-black text-sm text-[#DC2626] group/b">
                Learn about our platform <ArrowRightIcon className="w-4 h-4 group-hover/b:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIAL STRIP ── */}
      <section className="bg-[#DC2626] py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            {[...Array(5)].map((_, j) => (<StarIcon key={j} className="w-6 h-6 text-white fill-white" />))}
          </div>
          <motion.blockquote {...fadeUp()} className="text-white text-3xl md:text-4xl font-black leading-snug mb-8">
            "Managing 50,000 SKUs used to take a team of 12. With CommerceHub's bulk tools, AI descriptions, and smart collections, we do it with a team of 3."
          </motion.blockquote>
          <p className="text-white/80 font-bold">Alex Morgan — VP Merchandising, Vestiaire Collective</p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-white py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-14">
            <h2 className="text-4xl font-black text-gray-900 mb-4">Common questions</h2>
            <p className="text-gray-500 text-base font-medium">Everything about CommerceHub cataloguing tools.</p>
          </motion.div>
          <motion.div {...fadeUp(0.1)} className="bg-white rounded-3xl border border-gray-100 px-8 shadow-sm">
            {faq.map((item, i) => <FaqItem key={i} {...item} />)}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative bg-black py-36 px-6 text-center overflow-hidden">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#DC2626]/15 rounded-full blur-[130px]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.5) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
        <motion.div {...fadeUp()} className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
            Your catalogue, perfectly organised
          </h2>
          <p className="text-gray-400 text-xl font-medium mb-12 leading-relaxed">
            Start building your product catalogue today — no credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/register')} className="px-10 py-5 bg-[#DC2626] text-white font-black rounded-2xl hover:bg-[#B91C1C] transition-all text-sm flex items-center justify-center gap-2 group">
              Start for free <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => navigate('/pricing')} className="px-10 py-5 bg-white text-black font-black rounded-2xl hover:bg-gray-100 transition-all text-sm">
              View pricing
            </button>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
