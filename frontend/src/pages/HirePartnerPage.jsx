import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRightIcon, SearchIcon, StarIcon, CheckIcon, MapPinIcon,
  CodeIcon, PaletteIcon, MegaphoneIcon, GlobeIcon, CameraIcon,
  ShieldCheckIcon, TrendingUpIcon, ZapIcon, UsersIcon, AwardIcon,
  MicIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import HeroSection from '../components/marketing/HeroSection';
import CTASection from '../components/marketing/CTASection';
import { SectionWrapper, SectionHeading, PremiumCard } from '../components/marketing/Layout';

/* ───────────────────────────────────────── STATS */
const stats = [
  { val: '4,000+', label: 'Certified Partners' },
  { val: '150+', label: 'Countries' },
  { val: '4.8 / 5', label: 'Merchant Rating' },
  { val: 'Free', label: 'To Browse' },
];

const partnerTypes = [
  { icon: <CodeIcon />, title: 'Development', desc: 'Custom store builds, checkout extensions, and headless frontends.', color: '#7C3AED' },
  { icon: <PaletteIcon />, title: 'Design', desc: 'Brand identity, theme customisation, and UI/UX redid Audits.', color: '#0284C7' },
  { icon: <MegaphoneIcon />, title: 'Marketing', desc: 'Paid media, SEO, email marketing, and growth management.', color: '#DC2626' },
  { icon: <GlobeIcon />, title: 'Migration', desc: 'Seamlessly move from any platform with zero data loss.', color: '#059669' },
];

export default function HirePartnerPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-[#020617] min-h-screen text-white">
      <Navbar />

      <HeroSection 
        badge="Partner Directory"
        title="Find an expert. Build anything."
        subtitle="Connect with 4,000+ certified developers, designers, and marketers who live and breathe CommerceHub."
        primaryCTA={{ text: "Find a partner", path: "/register" }}
        secondaryCTA={{ text: "Become a partner", path: "/" }}
        visual={
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative glass p-8 rounded-3xl border border-white/10 shadow-2xl">
               <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-primary-600/20 text-primary-500 flex items-center justify-center font-black">PC</div>
                  <div>
                     <p className="font-bold text-white">Pixel & Craft</p>
                     <p className="text-[10px] text-gray-500 uppercase tracking-widest">Certified Developer • London</p>
                  </div>
               </div>
               <div className="flex gap-1 mb-6">
                  {[1,2,3,4,5].map(i => <StarIcon key={i} className="w-4 h-4 fill-primary-500 text-primary-500" />)}
               </div>
               <div className="space-y-3">
                  <div className="h-2 bg-white/5 rounded-full w-full" />
                  <div className="h-2 bg-white/5 rounded-full w-3/4" />
               </div>
            </div>
          </div>
        }
      />

      <SectionWrapper variant="layered" className="border-y border-white/5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
             <div key={i} className="text-center group">
               <p className="text-4xl font-black text-white mb-2 group-hover:text-primary-500 transition-colors uppercase">{s.val}</p>
               <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">{s.label}</p>
             </div>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper variant="deep">
        <SectionHeading title="What do you need?" subtitle="There's a certified expert for every stage of your commerce journey." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {partnerTypes.map((pt, i) => (
             <PremiumCard key={i} delay={i * 0.1}>
                <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6" style={{ color: pt.color }}>
                   {React.cloneElement(pt.icon, { className: 'w-7 h-7' })}
                </div>
                <h3 className="text-xl font-bold text-white mb-3 tracking-tight">{pt.title}</h3>
                <p className="text-gray-400 text-sm font-medium leading-relaxed">{pt.desc}</p>
             </PremiumCard>
          ))}
        </div>
      </SectionWrapper>

      <SectionWrapper variant="layered">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
           <div>
              <SectionHeading 
                title="Verified experts only."
                subtitle="Certified and vetted so you never have to guess. We verify every partner's portfolio and technical skill."
                className="!text-left !mx-0"
              />
              <div className="space-y-6 mt-10">
                 {['Partner Certification required', 'Portfolio verification process', 'AI-matched shortlists'].map((item, i) => (
                    <div key={i} className="flex gap-4 items-center">
                       <CheckIcon className="w-5 h-5 text-primary-500" strokeWidth={3} />
                       <span className="text-lg font-bold text-gray-300">{item}</span>
                    </div>
                 ))}
              </div>
           </div>
           <div className="relative">
              <div className="absolute inset-0 bg-primary-600/10 blur-[120px] rounded-full" />
              <div className="relative glass p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
                 <p className="text-2xl font-black text-white leading-relaxed mb-8 italic">
                   "GrowthOps took our ROAS from 1.4x to 4.1x in three months. Found them in the directory and hired them same-day."
                 </p>
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-600 text-white flex items-center justify-center font-black">SR</div>
                    <div>
                       <p className="font-bold text-white">Sneha Reddy</p>
                       <p className="text-gray-500 text-xs">CMO, Tulsi Foods</p>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </SectionWrapper>

      <CTASection title="Your next milestone starts here" subtitle="Browse 4,000+ certified experts. Free to search, free to contact." />
      
      <Footer />
    </div>
  );
}
