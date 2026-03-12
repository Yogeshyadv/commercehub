import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRightIcon, CheckIcon, ChevronDownIcon,
  ZapIcon, UsersIcon, BarChart2Icon, ShieldCheckIcon, LayersIcon, CodeIcon,
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
  heroImg:      `${CDN}/73c03f454eff3abe3013bbbbc9b82501.png`,
  storefrontImg: `${CDN}/f9390182b37cab5910307e399a6a69d6.webp`,
  volumeImg:    `${CDN}/862647fb70323fa4084102359da26a95.webp`,
  variantImg:   `${CDN}/a887e144dd7d29e316c4add7f934e236.webp`,
  techStackImg: `${CDN}/b8fa2d372bb0994b0a8b4a26aab3d0a7.webp`,
  brooklinenImg:`${CDN}/9c8a7be9c55bd11d1d75af682a4fbbda.webp`,
};

/* ───────────────────────────────────────── DATA */
const buyerJourneyTabs = [
  {
    id: 'cater',
    label: 'Buyer management',
    heading: 'Cater to the needs of every customer',
    desc: "Represent companies with multiple buyers and locations, and manage purchasing permissions with ease.",
    img: IMG.storefrontImg,
  },
  {
    id: 'design',
    label: 'Custom storefronts',
    heading: 'Design powerful storefront experiences',
    desc: "Personalise content for each B2B and B2C buyer with out-of-the-box themes or headless storefronts.",
    img: IMG.volumeImg,
  },
  {
    id: 'selfserve',
    label: 'Self-serve portal',
    heading: 'Delight customers with self-serve purchasing',
    desc: "Customers can easily place orders and manage their own accounts using an intuitive and customisable portal.",
    img: IMG.variantImg,
  },
];

const featureCategories = [
  {
    label: 'Customised buying experience',
    icon: <UsersIcon className="w-5 h-5" />,
    items: [
      { name: 'Company profiles', desc: 'Represent multiple buyers and locations with unique permission levels.' },
      { name: 'Customer-specific catalogs', desc: 'Offer a curated buying experience with product catalogs assigned to specific buyers.' },
      { name: 'Volume pricing', desc: 'Easily implement quantity price breaks to get your B2B customers buying in bulk.' },
    ],
  },
  {
    label: 'Optimised workflows',
    icon: <ZapIcon className="w-5 h-5" />,
    items: [
      { name: 'Workflow automations', desc: 'CommerceHub Flow support for companies and company locations.' },
      { name: 'Sales rep permissions', desc: 'Add sales reps as staff in the admin with specific permissions.' },
      { name: 'Checkout to draft', desc: 'Submit orders for review on your online store and approve before fulfilling.' },
    ],
  },
];

const highlights = [
  {
    icon: ShieldCheckIcon,
    title: 'Enterprise support',
    desc: 'Count on 24/7 technical support and dedicated account managers for your global expansion.',
  },
  {
    icon: BarChart2Icon,
    title: 'Boundless scalability',
    desc: 'With 20× admin API rate limits, you never have to worry about hitting performance ceilings.',
  },
  {
    icon: UsersIcon,
    title: 'Partner ecosystem',
    desc: 'Get the perfect solutions that differentiate you through our large network of certified experts.',
  },
];

function FeatureCat({ cat, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors px-4">
      <button onClick={() => setOpen(o => !o)} className="w-full text-left flex items-center justify-between py-6 group">
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-colors duration-300">
             {cat.icon}
           </div>
           <span className="font-bold text-black text-lg group-hover:text-red-600 transition-colors">{cat.label}</span>
        </div>
        <ChevronDownIcon className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${open ? 'rotate-180 text-red-600' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
           <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
             <div className="grid md:grid-cols-2 gap-4 pb-8 pl-1 px-1">
                {cat.items.map((item, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-gray-50 border border-gray-100">
                    <h5 className="text-black font-bold mb-2">{item.name}</h5>
                    <p className="text-gray-600 text-sm font-medium leading-relaxed">{item.desc}</p>
                  </div>
                ))}
             </div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function B2BEnterprisePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cater');
  const ct = buyerJourneyTabs.find(t => t.id === activeTab);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <HeroSection 
        badge="B2B for Enterprise"
        title="Transform your wholesale commerce"
        subtitle="Design your B2B buying experiences on a customisable platform backed by the best-converting checkout. Delight your customers worldwide."
        primaryCTA={{ text: "Talk to sales", path: "/register" }}
        secondaryCTA={{ text: "Try for free", path: "/register" }}
        visual={
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <img src={IMG.heroImg} alt="B2B Storefront" className="relative rounded-3xl border border-gray-100 shadow-2xl" />
          </div>
        }
      />

      <SectionWrapper variant="secondary" className="border-y border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { num: '01', title: 'Customised buyer experiences', desc: 'Wholesale tailored to every customer with curated catalogs and payment terms.' },
            { num: '02', title: 'Bring all your tech together', desc: 'Integrate with your ERPs and tech stack seamlessly using our robust APIs.' },
            { num: '03', title: 'Save time, reduce costs', desc: 'Run B2B and B2C from one admin at a fraction of the cost of legacy systems.' },
          ].map((card, i) => (
             <div key={i} className="p-10 rounded-3xl bg-white border border-gray-100 relative overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-300">
               <span className="absolute -top-4 -right-4 text-8xl font-black text-gray-400 opacity-5 group-hover:opacity-10 transition-opacity">{card.num}</span>
               <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center mb-6">
                 <CheckIcon className="w-5 h-5" strokeWidth={3} />
               </div>
               <h4 className="text-xl font-extrabold text-black mb-4 leading-snug">{card.title}</h4>
               <p className="text-gray-600 font-medium text-sm leading-relaxed">{card.desc}</p>
             </div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper variant="primary">
        <SectionHeading 
          title="Exceptional buyer journey"
          subtitle="Create best-in-class wholesale experiences with powerful B2B features built directly into our core."
        />
        
        <div className="grid lg:grid-cols-[360px_1fr] gap-12 items-start">
          <div className="flex flex-col gap-4">
            {buyerJourneyTabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`text-left p-6 rounded-2xl border transition-all duration-300 ${
                  activeTab === tab.id ? 'bg-red-50 border-red-200 shadow-md' : 'bg-white border-gray-100 hover:bg-gray-50'
                }`}>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${activeTab === tab.id ? 'bg-red-600' : 'bg-gray-300'}`} />
                  <span className={`font-bold transition-colors ${activeTab === tab.id ? 'text-black' : 'text-gray-500'}`}>{tab.label}</span>
                </div>
                {activeTab === tab.id && (
                  <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="text-gray-600 text-sm mt-4 pl-6 font-medium leading-relaxed">
                    {tab.desc}
                  </motion.p>
                 )}
              </button>
            ))}
          </div>
          <div className="bg-gray-50 rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm relative min-h-[460px]">
             <div className="bg-white px-6 py-4 flex items-center gap-2 border-b border-gray-100">
                <span className="w-3 h-3 rounded-full bg-red-600" />
                <div className="ml-3 flex-1 h-5 bg-gray-100 rounded-full" />
             </div>
             <img src={ct.img} alt={ct.heading} className="w-full h-[400px] object-cover" />
             <div className="p-8 bg-white border-t border-gray-100">
               <h3 className="text-2xl font-extrabold text-black">{ct.heading}</h3>
             </div>
          </div>
        </div>
      </SectionWrapper>

      <SectionWrapper variant="secondary">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
           <div>
              <SectionHeading 
                title="Total control over your tech stack"
                subtitle="Integrate your existing commerce tech stack with as much or little of our platform as you need."
                className="!text-left !mx-0"
              />
              <div className="space-y-8 mt-12">
                 {[
                   { title: 'Integrations done seamlessly', desc: 'Connect your ERP, CMS, and OMS systems with robust APIs and partner apps.' },
                   { title: 'Infinite customisation', desc: 'Go beyond headless with a fully extensible checkout and customer account portal.' },
                 ].map((item, i) => (
                    <div key={i} className="flex gap-4">
                       <div className="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                          <CheckIcon className="w-4 h-4 text-red-600" strokeWidth={3} />
                       </div>
                       <div>
                         <h5 className="font-bold text-black text-lg mb-2">{item.title}</h5>
                         <p className="text-gray-600 font-medium text-sm leading-relaxed">{item.desc}</p>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
           <div className="relative">
              <div className="absolute inset-0 bg-red-100 blur-[120px] rounded-full opacity-50" />
              <img src={IMG.techStackImg} alt="Tech Stack" className="relative rounded-3xl border border-gray-100 shadow-2xl" />
           </div>
        </div>
      </SectionWrapper>

      <SectionWrapper variant="primary">
        <SectionHeading 
          title="Enterprise B2B Features" 
          subtitle="Everything you need to run a world-class wholesale operation at scale." 
        />
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-4 sm:p-8 shadow-sm max-w-5xl mx-auto">
          {featureCategories.map((cat, i) => (
            <FeatureCat key={i} cat={cat} defaultOpen={i === 0} />
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper variant="secondary">
        <div className="grid md:grid-cols-3 gap-12">
          {highlights.map((h, i) => (
            <div key={i} className="text-center group">
              <div className="w-16 h-16 bg-white border border-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                <h.icon size={32} />
              </div>
              <h3 className="text-xl font-extrabold text-black mb-3">{h.title}</h3>
              <p className="text-gray-600 font-medium leading-relaxed">{h.desc}</p>
            </div>
          ))}
        </div>
      </SectionWrapper>

      <CTASection title="Talk to a B2B sales rep" subtitle="Launch your enterprise B2B store with the dedicated power of CommerceHub." />
      <Footer />
    </div>
  );
}
