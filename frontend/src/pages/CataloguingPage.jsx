import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRightIcon, CheckIcon, TagIcon, GridIcon, LayersIcon,
  FileTextIcon, SearchIcon, UploadIcon, SparklesIcon, DatabaseIcon,
  ImageIcon, ToggleLeftIcon, ChevronDownIcon, StarIcon, PencilIcon,
  CheckCircle2Icon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import HeroSection from '../components/marketing/HeroSection';
import CTASection from '../components/marketing/CTASection';
import { SectionWrapper, SectionHeading, PremiumCard } from '../components/marketing/Layout';
import { FeatureGrid } from '../components/marketing/FeatureGrid';

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
  { value: 'Unlimited', label: 'Products & variants', icon: DatabaseIcon },
  { value: 'Bulk',      label: 'Import / export CSV',  icon: UploadIcon },
  { value: 'Smart',     label: 'Auto-collections',     icon: GridIcon },
  { value: 'AI-gen',    label: 'Media powered by AI', icon: SparklesIcon },
];

const catalogueTabs = [
  {
    id: 'products',
    icon: <TagIcon className="w-5 h-5" />,
    label: 'Product management',
    heading: 'One place for every product',
    desc: "Add titles, descriptions, images, videos, 3D models, variants, pricing, SKUs, inventory, and custom metafields — all in one intuitive interface.",
    img: IMG.editor,
  },
  {
    id: 'collections',
    icon: <GridIcon className="w-5 h-5" />,
    label: 'Collections',
    heading: 'Organise into smart collections',
    desc: "Create manual collections by hand-picking products, or automated collections where products are added automatically based on tags or price.",
    img: IMG.b2bStore,
  },
  {
    id: 'metafields',
    icon: <DatabaseIcon className="w-5 h-5" />,
    label: 'Metafields',
    heading: 'Custom data for every product',
    desc: "Add any type of structured data — ingredients, sizing guides, technical specs — and display them exactly how you want.",
    img: IMG.liquid,
  },
  {
    id: 'bulkedit',
    icon: <PencilIcon className="w-5 h-5" />,
    label: 'Bulk editing',
    heading: 'Update thousands at once',
    desc: "Edit prices, inventory, and tags across your entire catalogue in seconds with the bulk editor or CSV import/export.",
    img: IMG.collab,
  },
];

const allFeatures = [
  { icon: SparklesIcon, title: 'AI descriptions', desc: "Generate accurate product descriptions in seconds with CommerceHub Magic." },
  { icon: ImageIcon, title: 'Rich media', desc: "Showcase products with unlimited images, video, and 3D models." },
  { icon: SearchIcon, title: 'SEO built-in', desc: "Auto-generate canonical URLs, meta tags, and sitemaps." },
  { icon: ToggleLeftIcon, title: 'Product status', desc: "Draft, active, archived — control visibility across all channels." },
  { icon: LayersIcon, title: 'Product bundles', desc: "Offer fixed bundles and multipacks to drive larger order values." },
  { icon: FileTextIcon, title: 'Inventory sync', desc: "Track stock across all warehouses and locations in real time." },
  { icon: UploadIcon, title: 'Bulk import', desc: "Import your entire catalogue from any platform via CSV." },
  { icon: CheckIcon, title: 'Channel publishing', desc: "Publish to store, social, B2B, and POS—all from one place." },
];

const faq = [
  { q: 'How many products can I add?', a: "Unlimited. CommerceHub doesn't cap your product count or variant count — whether you sell 5 items or 5 million, we handle it all." },
  { q: 'Can I import my existing catalogue?', a: "Yes. Import your products from Shopify, WooCommerce, or any platform via CSV. Our import wizard makes migration fast." },
  { q: 'How do smart collections work?', a: "Smart collections use rules you define — product tag, price range, vendor — to automatically include matching products instantly." },
  { q: 'What are metafields for?', a: "Metafields let you store custom data on products — like ingredients, sizing guides, or technical specs — specific to your industry." },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors px-4">
      <button onClick={() => setOpen(o => !o)} className="w-full text-left flex items-center justify-between py-6 group">
        <span className="font-bold text-black text-lg group-hover:text-red-600 transition-colors pr-8">{q}</span>
        <ChevronDownIcon className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-red-600' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
           <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
             <p className="text-gray-600 text-base leading-relaxed pb-6 pl-1 font-medium">{a}</p>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CataloguingPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('products');
  const ct = catalogueTabs.find(t => t.id === activeTab);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <HeroSection 
        badge="Cataloguing"
        title="Organise every product. Sell everywhere."
        subtitle="Build, organise, and publish your full product catalogue — with AI-powered tools, smart collections, and rich media."
        primaryCTA={{ text: "Start for free", path: "/register" }}
        secondaryCTA={{ text: "View pricing", path: "/pricing" }}
        visual={
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-2xl">
              <div className="bg-gray-50 flex items-center gap-2 px-5 py-3.5 border-b border-gray-100">
                <span className="w-3 h-3 rounded-full bg-red-600/70" />
                <div className="ml-3 h-4 w-36 bg-gray-200 rounded-full" />
              </div>
              <img src={IMG.editor} alt="Catalogue Editor" className="w-full object-cover" />
            </div>
          </div>
        }
      />

      <SectionWrapper variant="secondary" className="border-y border-gray-100">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div key={i} className="text-center group">
              <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center mx-auto mb-6 group-hover:bg-red-50 group-hover:border-red-100 transition-all duration-300 shadow-sm">
                <s.icon className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" />
              </div>
              <p className="text-4xl font-extrabold text-black mb-2 tracking-tight transition-colors uppercase">{s.value}</p>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper variant="primary">
        <SectionHeading 
          title="A better way to manage every product"
          subtitle="Explore the powerful tools designed to make cataloguing seamless and scalable for any business size."
        />
        
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {catalogueTabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-full border text-sm font-bold transition-all duration-300 ${
                activeTab === tab.id 
                ? 'bg-black border-black text-white shadow-lg' 
                : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200 hover:text-black'
              }`}>
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
            className="grid lg:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h3 className="text-4xl font-extrabold text-black mb-6 tracking-tight">{ct.heading}</h3>
              <p className="text-lg text-gray-600 font-medium leading-relaxed mb-10">{ct.desc}</p>
              <button 
                onClick={() => navigate('/register')} 
                className="px-8 py-4 bg-gray-50 border border-gray-100 hover:bg-gray-100 text-black font-bold rounded-2xl transition-all flex items-center gap-2 group"
              >
                Try this feature <ArrowRightIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="bg-gray-50 rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm">
              <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-600/60" />
                <div className="h-4 w-40 bg-gray-100 rounded-full" />
              </div>
              <img src={ct.img} alt={ct.heading} className="w-full h-[400px] object-cover" />
            </div>
          </motion.div>
        </AnimatePresence>
      </SectionWrapper>

      <SectionWrapper variant="secondary">
        <SectionHeading 
          title="All the catalogue tools you need"
          subtitle="No plugins required — every feature ships standard with CommerceHub."
        />
        <FeatureGrid items={allFeatures} columns={4} />
      </SectionWrapper>

      <SectionWrapper variant="primary">
        <div className="max-w-4xl mx-auto">
          <SectionHeading title="Common questions" />
          <div className="bg-white border border-gray-100 rounded-[2rem] p-4 sm:p-8 shadow-sm">
            {faq.map((item, i) => (
              <FaqItem key={i} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </SectionWrapper>

      <CTASection />
      <Footer />
    </div>
  );
}
