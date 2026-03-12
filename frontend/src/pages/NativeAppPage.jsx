import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRightIcon, SmartphoneIcon, ZapIcon, ShoppingBagIcon, StarIcon,
  RefreshCwIcon, BellIcon, UsersIcon, LockIcon, MapPinIcon, ChevronDownIcon,
  HeartIcon, ScanIcon, TruckIcon, CheckCircle2Icon
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
  phonesArray:  `${CDN}/3094f950310a0b5cc4cfa8fdbac50d8a.webp`,
  checkout:     `${CDN}/50d42025c783062d9932cc40b4dbc876.png`,
  ai:           `${CDN}/27e4cd83b4296c634951aec9deee6a91.png`,
  collab:       `${CDN}/73baf5efde53894bbe8620b107f5f4c6.png`,
  hydrogen:     `${CDN}/ad1e1746f969329119853ff117af96f1.png`,
  b2bStore:     `${CDN}/f9390182b37cab5910307e399a6a69d6.webp`,
  liveGlobe:    `${CDN}/2dbc48f43dded4e3e3d1ff7a7c34167f.png`,
  marketingCh:  `${CDN}/7a8822075c8c1b4a1d7c808d1c2d5ebd.png`,
};

/* ───────────────────────────────────────── DATA */
const appFeatures = [
  {
    id: 'wallet',
    icon: <LockIcon className="w-5 h-5" />,
    tag: 'BUILT-IN WALLET',
    heading: 'Converts up to 50% higher',
    desc: "Customers checkout with our one-tap system, which remembers all their payment and shipping info. Just 2 taps and it's theirs.",
    img: IMG.checkout,
  },
  {
    id: 'personalisation',
    icon: <HeartIcon className="w-5 h-5" />,
    tag: 'PERSONALISATION',
    heading: 'Tailored for each shopper',
    desc: "When people find you on the app, they automatically see products they're likely to want, based on their unique taste profile.",
    img: IMG.marketingCh,
  },
  {
    id: 'sync',
    icon: <RefreshCwIcon className="w-5 h-5" />,
    tag: 'FULLY SYNCED',
    heading: 'Seamless experience',
    desc: "Each shopper's cart follows them from your online store to the app, eliminating friction and bringing buyers back.",
    img: IMG.collab,
  },
  {
    id: 'tracking',
    icon: <TruckIcon className="w-5 h-5" />,
    tag: 'REAL-TIME TRACKING',
    heading: 'More reasons to revisit',
    desc: "Customers track their packages in real time from the app, building habitual brand engagement that drives repeat sales.",
    img: IMG.liveGlobe,
  },
];

const customiseFeatures = [
  {
    icon: SmartphoneIcon,
    title: 'Look and feel',
    desc: 'Add video, brand colours, and rich assets to make your app store page feel distinctly yours.',
  },
  {
    icon: ShoppingBagIcon,
    title: 'Merchandising',
    desc: 'Add featured collections, subscription products, and limited-time offers — fully synced.',
  },
  {
    icon: ZapIcon,
    title: 'One-tap checkout',
    desc: 'Let people buy right from the app with Shop Pay, or send them to your branded online store.',
  },
  {
    icon: UsersIcon,
    title: 'Campaigns & acquire',
    desc: "Run performance campaigns to acquire new customers at a set cost-per-acquisition rate.",
  },
  {
    icon: BellIcon,
    title: 'Push notifications',
    desc: "Send targeted notifications for flash sales, back-in-stock alerts, and abandoned carts.",
  },
  {
    icon: ScanIcon,
    title: 'AR & 3D try-on',
    desc: "Let shoppers virtually try on products in their space using augmented reality.",
  },
];

const faq = [
  { q: 'What is the native commerce app?', a: 'Our native app lets your customers shop your full catalogue directly from their phone — with personalised product feeds, one-tap checkout, live order tracking, and push notifications, all natively integrated.' },
  { q: 'How is this different from a mobile website?', a: "A native app runs directly on iOS and Android, giving access to device features like push notifications and Face ID that a mobile website can't match." },
  { q: 'How does personalisation work?', a: "Our AI analyses each shopper's history to surface products they're most likely to want — increasing time-in-app and average order value." },
  { q: 'Is there a cost per transaction?', a: "No marketplace fees, ever. Unlike other app stores that take a cut, you keep 100% of your revenue. Your customers remain yours." },
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
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="text-gray-600 text-base leading-relaxed pb-6 pl-1 font-medium">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function NativeAppPage() {
  const navigate = useNavigate();
  const [activeFeature, setActiveFeature] = useState('wallet');
  const current = appFeatures.find(f => f.id === activeFeature);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <HeroSection 
        badge="Native Commerce App"
        title="Reach the world's best shoppers"
        subtitle="Sell to high-intent shoppers on our native app — powered by the world's fastest checkout. Just by joining CommerceHub."
        primaryCTA={{ text: "Get more customers", path: "/register" }}
        secondaryCTA={{ text: "View pricing", path: "/pricing" }}
        visual={
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <img src={IMG.phonesArray} alt="Mobile App" className="relative w-full rounded-3xl border border-gray-100 shadow-2xl" />
          </div>
        }
      />

      <SectionWrapper variant="secondary" className="border-y border-gray-100">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: '250M+', label: 'Verified shoppers' },
            { value: '50%', label: 'Higher conversion' },
            { value: '48%', label: 'Repeat customers' },
            { value: '$0', label: 'Platform fees' },
          ].map((s, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <p className="text-4xl font-extrabold text-black mb-2 tracking-tight">{s.value}</p>
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper variant="primary">
        <SectionHeading 
          title="Sell faster. Sell more. Sell again."
          subtitle="Everything your shoppers love about mobile commerce, built into a single powerful app experience."
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-12 items-start">
          <div className="flex flex-col gap-4">
            {appFeatures.map((feat) => (
              <button 
                key={feat.id} 
                onClick={() => setActiveFeature(feat.id)}
                className={`text-left rounded-2xl p-6 transition-all duration-300 border ${
                  activeFeature === feat.id 
                    ? 'bg-red-50 border-red-200 shadow-md' 
                    : 'bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200'
                }`}
              >
                <div className="flex items-center gap-4 mb-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    activeFeature === feat.id ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {feat.icon}
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${
                    activeFeature === feat.id ? 'text-red-700' : 'text-gray-500'
                  }`}>{feat.tag}</span>
                </div>
                <h4 className={`text-lg font-bold transition-colors ${activeFeature === feat.id ? 'text-black' : 'text-gray-500'}`}>
                  {feat.heading}
                </h4>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div 
              key={activeFeature}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-50 rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm"
            >
              <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-600/60" />
                <div className="h-4 w-40 bg-gray-100 rounded-full" />
              </div>
              <img src={current.img} alt={current.heading} className="w-full h-[400px] object-cover" />
              <div className="p-10">
                <h3 className="text-3xl font-extrabold text-black mb-4 tracking-tight">{current.heading}</h3>
                <p className="text-gray-600 font-medium text-lg leading-relaxed">{current.desc}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </SectionWrapper>

      <SectionWrapper variant="secondary">
        <SectionHeading 
          title="Amp up your brand on the app"
          subtitle="Six ways to choose exactly how your brand shows up — and converts — on the app."
        />
        <FeatureGrid items={customiseFeatures} columns={3} />
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
