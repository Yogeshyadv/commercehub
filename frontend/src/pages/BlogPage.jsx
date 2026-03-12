import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRightIcon, SearchIcon, ClockIcon, UserCircleIcon, TagIcon,
  StarIcon, BookOpenIcon, TrendingUpIcon, MailIcon, CheckIcon,
  ChevronRightIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import HeroSection from '../components/marketing/HeroSection';
import CTASection from '../components/marketing/CTASection';
import { SectionWrapper, SectionHeading, PremiumCard } from '../components/marketing/Layout';

/* ───────────────────────────────────────── BLOG POSTS */
const posts = [
  { id: 1, category: 'Marketing', title: 'How 7 DTC Brands Drove 40%+ Growth With Email Alone', excerpt: 'Deep dive into automation sequences and segmentation strategies.', author: 'James O.', date: 'Jul 24', readTime: '7 min' },
  { id: 2, category: 'Technology', title: 'CommerceHub Checkout Extensions: A Developer Primer', excerpt: 'Step-by-step guide to building your first checkout UI extension.', author: 'Yuki T.', date: 'Jul 22', readTime: '11 min' },
  { id: 3, category: 'Growth', title: 'The BFCM Playbook: 12 Weeks Out', excerpt: 'Start preparing now or scramble in November. A week-by-week countdown.', author: 'Carlos M.', date: 'Jul 19', readTime: '13 min' },
];

export default function BlogPage() {
  const navigate = useNavigate();
  const categories = ['All', 'Commerce', 'Marketing', 'Growth', 'Tech'];

  return (
    <div className="bg-[#020617] min-h-screen text-white">
      <Navbar />

      <HeroSection 
        badge="Insights for Merchants"
        title="Commerce insights for ambitious merchants."
        subtitle="Practical guides, data-backed strategies, and deep dives on every topic that moves your business forward."
        primaryCTA={{ text: "Read Latest Posts", path: "#latest" }}
        visual={
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative glass p-6 rounded-3xl border border-white/10 shadow-2xl">
               <div className="w-full aspect-video bg-white/5 rounded-2xl mb-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-primary-600/10 blur-[60px]" />
                  <div className="absolute bottom-6 left-6 right-6">
                     <span className="text-[10px] font-black uppercase tracking-widest text-primary-500 mb-2 block">Featured</span>
                     <h3 className="text-xl font-black text-white leading-tight">The Future of Commerce in 2025: AI and Beyond</h3>
                  </div>
               </div>
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-gray-500">
                  <span>9 min read</span>
                  <span>Jul 28, 2025</span>
               </div>
            </div>
          </div>
        }
      />

      <SectionWrapper variant="layered" className="border-y border-white/5">
        <div className="flex flex-wrap justify-center gap-3">
           {categories.map(cat => (
              <button key={cat} className="px-6 py-2 rounded-full glass border border-white/10 text-xs font-bold uppercase tracking-widest hover:border-primary-500 transition-all">{cat}</button>
           ))}
        </div>
      </SectionWrapper>

      <SectionWrapper variant="deep" id="latest">
        <SectionHeading title="Latest Insights" subtitle="Fresh perspectives on commerce, marketing, and growth." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {posts.map((post, i) => (
              <PremiumCard key={i} delay={i * 0.1} padding="p-0" className="flex flex-col overflow-hidden">
                 <div className="aspect-[16/10] bg-white/5 relative border-b border-white/5">
                    <div className="absolute top-4 left-4 glass px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-white">{post.category}</div>
                 </div>
                 <div className="p-8 flex flex-col flex-1">
                    <h3 className="text-xl font-black text-white mb-4 tracking-tight leading-tight group-hover:text-primary-400 transition-colors uppercase">{post.title}</h3>
                    <p className="text-gray-400 text-sm font-medium leading-relaxed mb-8 flex-1">{post.excerpt}</p>
                    <div className="flex justify-between items-center pt-6 border-t border-white/5">
                       <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">{post.author}</span>
                       <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gray-700">
                          <span>{post.date}</span>
                          <span className="flex items-center gap-1"><ClockIcon className="w-3 h-3" /> {post.readTime}</span>
                       </div>
                    </div>
                 </div>
              </PremiumCard>
           ))}
        </div>
      </SectionWrapper>

      <SectionWrapper variant="gradient">
         <div className="max-w-4xl mx-auto glass p-12 md:p-20 rounded-[3rem] text-center border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 text-primary-500/10 pointer-events-none">
               <MailIcon size={200} />
            </div>
            <SectionHeading 
              title="Join 280,000 merchants" 
              subtitle="Get weekly commerce insights delivered straight to your inbox every Tuesday." 
              className="!mx-0"
            />
            <form className="flex flex-col sm:flex-row gap-4 mt-12 max-w-lg mx-auto relative z-10">
               <input type="email" placeholder="you@example.com" className="flex-1 glass bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:border-primary-500 outline-none" />
               <button className="bg-primary-600 hover:bg-primary-700 text-white font-black px-8 py-4 rounded-2xl transition-all shadow-xl shadow-primary-900/20 flex items-center justify-center gap-2">Subscribe <ArrowRightIcon className="w-4 h-4" /></button>
            </form>
         </div>
      </SectionWrapper>

      <CTASection title="Read. Learn. Grow your store." subtitle="Ready to build your own success story? Start for free today." />
      
      <Footer />
    </div>
  );
}
