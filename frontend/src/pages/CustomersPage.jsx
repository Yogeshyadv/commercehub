import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRightIcon, UserIcon, UsersIcon, MailIcon, ZapIcon,
  TrendingUpIcon, ShieldIcon, StarIcon, ChevronDownIcon,
  CheckIcon, CheckCircle2Icon
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
  segmentEditor:   `${CDN}/29c1212f9b5c9def92b019932a27f7d7.png`,
  merchantFilters: `${CDN}/bdce218c4d942da3d1fe5b5cbab76ad7.png`,
  personalMsg:     `${CDN}/fb4921282649044d15b19a5503b5db0a.png`,
  airsign:         `${CDN}/ce9542d2ece70250fd348bc7f15218ab.webp`,
  automationFlow:  `${CDN}/9b909644076a5879900849df7182a1bf.png`,
  emailDashboard:  `${CDN}/28a9ef2717737dbfe4b273d5abba31fb.png`,
};

/* ───────────────────────────────────────── DATA */
const featureTabs = [
  {
    id: 'profiles',
    icon: <UserIcon className="w-5 h-5" />,
    label: 'Customer Profiles',
    heading: 'Everything you need, in one place',
    desc: 'Every customer gets a rich, automatically-populated profile including purchase history and lifetime value.',
    img: IMG.merchantFilters,
    badges: ['Purchase history', 'LTV tracking', 'Marketing consent'],
  },
  {
    id: 'segments',
    icon: <UsersIcon className="w-5 h-5" />,
    label: 'Smart Segments',
    heading: 'Group customers the way you think',
    desc: 'Build powerful segments using behaviour and purchase data that update automatically in real time.',
    img: IMG.segmentEditor,
    badges: ['Behaviour filters', 'Dynamic updates', 'AI suggestions'],
  },
  {
    id: 'campaigns',
    icon: <MailIcon className="w-5 h-5" />,
    label: 'Email & SMS',
    heading: 'Campaigns that feel personal',
    desc: 'Design branded emails in minutes with drag-and-drop templates and AI-generated copy.',
    img: IMG.emailDashboard,
    badges: ['AI copywriting', 'Express checkout', 'Responsive design'],
  },
];

const faqs = [
  { q: 'Is customer management included in every plan?', a: 'Yes. Customer profiles, segmentation, and basic email campaigns are available on all plans at no extra cost.' },
  { q: 'Can I import my existing customers?', a: 'Absolutely. You can import customer data via CSV at any time, including order history and tags.' },
  { q: 'How does automation work?', a: 'Set up welcome series, abandoned cart recovery, and more once — then watch them run on autopilot.' },
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

export default function CustomersPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profiles');
  const ct = featureTabs.find(t => t.id === activeTab);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <HeroSection 
        badge="Customer Management"
        title="Know your customers. Grow with them."
        subtitle="Build rich customer profiles, create smart segments, and launch personalised campaigns — all from one platform."
        primaryCTA={{ text: "Start for free", path: "/register" }}
        secondaryCTA={{ text: "Open dashboard", path: "/dashboard" }}
        visual={
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <img src={IMG.segmentEditor} alt="Customer UI" className="relative rounded-3xl border border-gray-100 shadow-2xl" />
          </div>
        }
      />

      <SectionWrapper variant="secondary" className="border-y border-gray-100">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: UserIcon, label: 'Profiles', val: 'Unified' },
            { icon: UsersIcon, label: 'Segments', val: 'Auto-sync' },
            { icon: TrendingUpIcon, label: 'Conversion', val: '+30%' },
            { icon: ZapIcon, label: 'Included', val: 'Free' },
          ].map((s, i) => (
             <div key={i} className="text-center group">
               <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center mx-auto mb-4 group-hover:bg-red-50 transition-all shadow-sm">
                 <s.icon className="w-5 h-5 text-red-600" />
               </div>
               <p className="text-2xl font-extrabold text-black mb-1 uppercase">{s.val}</p>
               <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{s.label}</p>
             </div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper variant="primary">
        <SectionHeading 
          title="Personalise Every Moment"
          subtitle="Everything you need to own the customer relationship and drive repeat sales efficiently."
        />
        
        <div className="grid lg:grid-cols-[360px_1fr] gap-12 items-start">
           <div className="flex flex-col gap-4">
              {featureTabs.map(tab => (
                 <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                   className={`text-left p-6 rounded-2xl border transition-all duration-300 ${
                     activeTab === tab.id ? 'bg-red-50 border-red-200 shadow-md' : 'bg-white border-gray-100 hover:bg-gray-50'
                   }`}>
                   <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${activeTab === tab.id ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-400'}`}>
                        {tab.icon}
                      </div>
                      <span className={`font-bold transition-colors ${activeTab === tab.id ? 'text-black' : 'text-gray-500'}`}>{tab.label}</span>
                   </div>
                 </button>
              ))}
           </div>
           
           <AnimatePresence mode="wait">
             <motion.div 
               key={activeTab}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="bg-gray-50 rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-sm"
             >
                <div className="bg-white px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                   <span className="w-3 h-3 rounded-full bg-red-600" />
                   <div className="h-4 w-40 bg-gray-100 rounded-full" />
                </div>
                <div className="p-10">
                   <div className="flex flex-wrap gap-2 mb-6">
                      {ct.badges.map(b => (
                         <span key={b} className="bg-red-50 border border-red-100 text-red-600 text-[10px] px-3 py-1 rounded-full uppercase font-black">{b}</span>
                      ))}
                   </div>
                   <h3 className="text-3xl font-extrabold text-black mb-4">{ct.heading}</h3>
                   <p className="text-gray-600 text-lg font-medium leading-relaxed mb-10">{ct.desc}</p>
                   <img src={ct.img} alt={ct.heading} className="w-full rounded-2xl border border-gray-100 shadow-sm" />
                </div>
             </motion.div>
           </AnimatePresence>
        </div>
      </SectionWrapper>

      {/* Testimonial Section */}
      <SectionWrapper variant="secondary">
        <div className="bg-red-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
           <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.1),transparent)]" />
           <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} className="relative z-10">
              <div className="flex justify-center gap-1 mb-8">
                 {[1,2,3,4,5].map(i => <StarIcon key={i} className="w-6 h-6 fill-white text-white" />)}
              </div>
              <p className="text-3xl md:text-5xl font-black text-white leading-tight max-w-4xl mx-auto mb-12">
                "We identified the segment, created a discount, and saw about 30% of those people convert immediately."
              </p>
              <div className="flex items-center justify-center gap-4">
                 <img src={IMG.airsign} className="w-14 h-14 rounded-full border-2 border-white/20" alt="Avatar" />
                 <div className="text-left">
                    <p className="font-black text-white">Alex Dashefsky</p>
                    <p className="text-white/80 text-sm">Co-founder, Airsign</p>
                 </div>
              </div>
           </motion.div>
        </div>
      </SectionWrapper>

      <SectionWrapper variant="primary">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
           <div className="relative order-2 lg:order-1">
              <div className="absolute inset-0 bg-red-100 blur-[120px] rounded-full opacity-50" />
              <img src={IMG.emailDashboard} className="relative rounded-3xl border border-gray-100 shadow-2xl" alt="Dashboard" />
           </div>
           <div className="order-1 lg:order-2">
              <SectionHeading 
                title="Understand exactly what is working"
                subtitle="Track revenue, conversion funnel, and performance across every single campaign in real-time."
                className="!text-left !mx-0"
              />
              <div className="space-y-6 mt-10">
                 {['Revenue per campaign tracking', 'Real-time conversion funnel view', 'AI-powered segment analysis'].map((item, i) => (
                    <div key={i} className="flex gap-4 items-center">
                       <CheckCircle2Icon className="w-6 h-6 text-red-600" />
                       <span className="text-lg font-bold text-gray-700">{item}</span>
                    </div>
                 ))}
              </div>
           </div>
        </div>
      </SectionWrapper>

      <SectionWrapper variant="secondary">
        <div className="max-w-4xl mx-auto">
          <SectionHeading title="Common questions" />
          <div className="bg-white border border-gray-100 rounded-[2rem] p-4 sm:p-8 shadow-sm">
            {faqs.map((f, i) => (
              <FaqItem key={i} q={f.q} a={f.a} />
            ))}
          </div>
        </div>
      </SectionWrapper>

      <CTASection title="Grow with your customers" subtitle="Turn customer data into real growth with CommerceHub's powerful marketing tools." />
      <Footer />
    </div>
  );
}
