import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRightIcon, ShoppingBagIcon, ZapIcon, SearchIcon,
  SmartphoneIcon, StarIcon, LayoutIcon, GlobeIcon, SparklesIcon,
  ChevronDownIcon, PlayIcon, TrendingUpIcon, CheckCircle2Icon
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
  checkout:   `${CDN}/50d42025c783062d9932cc40b4dbc876.png`,
  ai:         `${CDN}/27e4cd83b4296c634951aec9deee6a91.png`,
  uptime:     `${CDN}/bb72ac6bae01033e0d9a1723883fc5d4.png`,
  editor:     `${CDN}/7a4eec77108a4be805d703953ac70c30.png`,
  liquid:     `${CDN}/2e07f1679ba8d4c3e7717a75a2e67613.png`,
  speed:      `${CDN}/ea7de41c67f060d0ea79aca7f25f2953.png`,
  collab:     `${CDN}/73baf5efde53894bbe8620b107f5f4c6.png`,
  storefront: `${CDN}/88be45c1ad280aaa06301e64dc9efddc.png`,
  pitch:      `${CDN}/1410e37520422053adfa8b2bed85aef1.png`,
  tinker:     `${CDN}/f531232ca65eb5c5de30fe72c6c24bf1.png`,
  heritage:   `${CDN}/a426ec8c1268225a1d42d1f736748793.jpg`,
  atelier:    `${CDN}/e2854b815a12775485d05c74b0d1beef.jpg`,
  fabric:     `${CDN}/09d6b6af898edbbab263cbf4cd210bbc.png`,
  ritual:     `${CDN}/3c42db66e376e7e488d1e6f629c1404f.jpg`,
  founder:    `${CDN}/b1f157025c97fe3d76e56ffee75fe9a7.jpg`,
};

/* ───────────────────────────────────────── DATA */
const stats = [
  { value: '15%',   label: 'Higher conversion', desc: 'vs. industry benchmark',       icon: TrendingUpIcon },
  { value: '800+',  label: 'Themes',               desc: 'Professional & customizable',   icon: LayoutIcon },
  { value: '99.9%', label: 'Uptime',            desc: 'Enterprise-grade reliability',  icon: ZapIcon },
  { value: '16k+',  label: 'Apps',              desc: 'Extend any workflow',            icon: GlobeIcon },
];

const features = [
  {
    icon: ShoppingBagIcon,
    title: "World's best checkout",
    desc: "Our checkout converts 15% better on average than other platforms — more sales, more of the time.",
  },
  {
    icon: SparklesIcon,
    title: 'Powerful AI everywhere',
    desc: 'Launch your store and scale it with built-in AI for product descriptions, images, and marketing copy.',
  },
  {
    icon: PlayIcon,
    title: 'Videos and 3D models',
    desc: 'Help shoppers visualise products with rich media — videos, 3D models, and immersive augmented reality.',
  },
  {
    icon: SearchIcon,
    title: 'Smart search & filtering',
    desc: 'Give shoppers a fast way to find exactly what they need with auto-suggest and smart autocomplete.',
  },
  {
    icon: StarIcon,
    title: 'Product recommendations',
    desc: 'Encourage larger carts with intelligent cross-sell and upsell widgets powered by analytics.',
  },
  {
    icon: GlobeIcon,
    title: 'Localized commerce',
    desc: 'Let customers shop in their country, language, and currency with fully localised storefronts.',
  },
  {
    icon: SmartphoneIcon,
    title: 'Mobile-ready',
    desc: 'Every store is fully responsive out of the box — pixel-perfect on any device, anywhere.',
  },
  {
    icon: ZapIcon,
    title: 'Unmatched reliability',
    desc: '99.9% uptime with 300 points of presence worldwide so your store never lets a customer down.',
  },
];

const themes = [
  { name: 'Pitch', desc: 'Bold layouts, bright visuals', img: IMG.pitch },
  { name: 'Tinker', desc: 'Clean, modern functionality', img: IMG.tinker },
  { name: 'Heritage', desc: 'Craftsmanship, authenticity', img: IMG.heritage },
  { name: 'Atelier', desc: 'Sleek, luxurious showcases', img: IMG.atelier },
  { name: 'Fabric', desc: 'Minimalist, lifestyle media', img: IMG.fabric },
  { name: 'Ritual', desc: 'Fashion-forward, refined', img: IMG.ritual },
];

const faq = [
  { q: 'What is catalogue e-commerce?', a: 'Catalogue e-commerce lets you showcase your full product range online — with pricing, variants, rich descriptions, images, and an instant checkout flow — turning browsers into buyers.' },
  { q: 'How quickly can I launch?', a: 'With a pre-built theme and our guided setup, you can launch your store in hours. Our AI tools can auto-generate product descriptions, brand copy, and store designs.' },
  { q: 'Can I sell across multiple channels?', a: 'Yes — your catalogue syncs seamlessly with social shops, marketplaces, wholesale portals, and in-person POS. One inventory, everywhere you sell.' },
  { q: 'Do I need coding experience?', a: 'Not at all. Our drag-and-drop editor and no-code theme customiser let anyone build a beautiful store. Developers can extend everything via our APIs.' },
  { q: 'What payment methods are supported?', a: 'CommerceHub supports 100+ payment gateways — from PayPal to Stripe and regional providers worldwide. BNPL, wallets, and crypto all supported.' },
];

/* ───────────────────────────────────────── HELPERS */
function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors px-4">
      <button onClick={() => setOpen(o => !o)} className="w-full text-left flex items-center justify-between py-6 group">
        <span className="font-bold text-black text-lg group-hover:text-red-600 transition-colors pr-8 tracking-tight">{q}</span>
        <ChevronDownIcon className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-red-600' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <p className="text-gray-600 text-base leading-relaxed pb-6 pl-1 font-medium">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CatalogueEcommercePage() {
  const navigate = useNavigate();
  const [activeTheme, setActiveTheme] = useState(0);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <HeroSection 
        badge="Catalogue E-commerce"
        title="The world's best stores start here"
        subtitle="Showcase your catalogue, convert browsers into buyers, and sell everywhere — with the most powerful commerce platform on the planet."
        primaryCTA={{ text: "Start for free", path: "/register" }}
        secondaryCTA={{ text: "View pricing", path: "/pricing" }}
        visual={
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-2xl">
              <div className="bg-gray-50/50 flex items-center gap-2 px-5 py-3.5 border-b border-gray-100">
                <span className="w-3 h-3 rounded-full bg-red-600/70" />
                <span className="w-3 h-3 rounded-full bg-gray-200" />
                <span className="w-3 h-3 rounded-full bg-gray-200" />
              </div>
              <img src={IMG.checkout} alt="Checkout experience" className="w-full object-cover" />
            </div>
          </div>
        }
      />

      <SectionWrapper variant="secondary" className="border-y border-gray-100">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center group"
            >
              <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center mx-auto mb-6 group-hover:bg-red-50 group-hover:border-red-100 transition-all duration-300">
                <s.icon className="w-5 h-5 text-gray-400 group-hover:text-red-600 transition-colors" />
              </div>
              <p className="text-4xl font-extrabold text-black mb-2 tracking-tight group-hover:text-red-600 transition-colors">{s.value}</p>
              <p className="text-sm font-bold text-gray-500 mb-1">{s.label}</p>
              <p className="text-xs text-gray-400 font-medium">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper variant="primary" id="features">
        <SectionHeading 
          title="Everything you need, out of the box"
          subtitle="No plugins, no cobbled-together tools — just one cohesive platform built for modern commerce."
        />
        <FeatureGrid items={features} columns={4} />
      </SectionWrapper>

      {/* AI Showcase */}
      <SectionWrapper variant="secondary">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-red-600 text-xs font-black uppercase tracking-[0.2em] mb-4 block">AI-Powered Commerce</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-black mb-8 tracking-tight leading-tight">
              Powerful AI at every turn
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-10 font-medium max-w-xl">
              From launching your store to managing and scaling it, boost every part of your business with built-in AI that's made for commerce.
            </p>
            <button className="flex items-center gap-2 text-red-600 font-bold hover:gap-3 transition-all group">
              Learn more about CommerceHub Magic
              <ArrowRightIcon className="w-4 h-4" />
            </button>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden border border-gray-100 shadow-2xl group"
          >
             <div className="absolute inset-0 bg-red-100 blur-[80px] -z-10 rounded-full group-hover:bg-red-200/50 transition-all duration-700 opacity-50" />
             <img src={IMG.ai} alt="AI Interface" className="w-full object-cover group-hover:scale-105 transition-transform duration-700" />
          </motion.div>
        </div>
      </SectionWrapper>

      {/* Theme Showcase */}
      <SectionWrapper variant="primary">
        <SectionHeading 
          title="Pick your perfect theme"
          subtitle="Choose from 800+ proven themes, then customize with our easy-to-use visual editor — no coding required."
        />
        
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {themes.map((t, i) => (
            <button 
              key={i} 
              onClick={() => setActiveTheme(i)}
              className={`px-6 py-3 rounded-full text-sm font-bold border transition-all duration-300 ${
                activeTheme === i 
                  ? 'bg-black text-white border-black shadow-lg' 
                  : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:text-black'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTheme} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }} 
            transition={{ duration: 0.4 }}
            className="rounded-[2.5rem] overflow-hidden bg-gray-50 border border-gray-100 shadow-3xl"
          >
            <div className="bg-white flex items-center gap-2 px-6 py-4 border-b border-gray-100">
              <span className="w-3 h-3 rounded-full bg-red-600/60" />
              <div className="h-4 w-48 bg-gray-100 rounded-full" />
            </div>
            <div className="relative aspect-video lg:aspect-[21/9]">
              <img src={themes[activeTheme].img} alt={themes[activeTheme].name} className="w-full h-full object-cover object-top" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-12 flex flex-col justify-end">
                <h3 className="text-3xl font-extrabold text-white mb-2">{themes[activeTheme].name}</h3>
                <p className="text-gray-300 font-medium">{themes[activeTheme].desc}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </SectionWrapper>

      {/* FAQ */}
      <SectionWrapper variant="secondary">
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
