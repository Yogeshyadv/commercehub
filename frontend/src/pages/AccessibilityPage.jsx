import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AccessibilityIcon, MailIcon, ArrowRightIcon, ChevronRightIcon, CheckIcon, AlertTriangleIcon, MonitorIcon, KeyboardIcon, EyeIcon, TypeIcon, FileTextIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import HeroSection from '../components/marketing/HeroSection';
import { SectionWrapper, PremiumCard } from '../components/marketing/Layout';

const EFFECTIVE = 'March 1, 2026';
const LAST_UPDATED = 'March 1, 2026';

const sections = [
  { id: 'commitment', title: '1. Our Commitment' },
  { id: 'conformance', title: '2. Conformance Status' },
  { id: 'supported-tech', title: '3. Supported Tech' },
  { id: 'assistive-tech', title: '4. Assistive Tech' },
  { id: 'known-issues', title: '5. Known Issues' },
  { id: 'feedback', title: '6. Feedback' },
];

const features = [
  { icon: <KeyboardIcon />, title: 'Keyboard Only', desc: 'Full navigation without a mouse.' },
  { icon: <EyeIcon />, title: 'Screen Readers', desc: 'Meaningful ARIA hierarchies.' },
  { icon: <TypeIcon />, title: 'Text Scaling', desc: 'Resize up to 200% without loss.' },
  { icon: <MonitorIcon />, title: 'Contrast', desc: 'WCAG AA 4.5:1 ratio targets.' },
];

export default function AccessibilityPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('commitment');

  useEffect(() => {
    const handler = () => {
      const scrollY = window.scrollY + 120;
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el && el.offsetTop <= scrollY) setActiveSection(section.id);
      }
    };
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="bg-[#020617] min-h-screen text-white selection:bg-primary-500/30">
      <Navbar />

      <HeroSection 
        badge="Legal Information"
        title="Accessibility Statement"
        subtitle={`Effective: ${EFFECTIVE} • Last updated: ${LAST_UPDATED}`}
        visual={
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative glass p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center">
               <div className="w-16 h-16 rounded-2xl bg-primary-600/20 flex items-center justify-center mb-6">
                  <AccessibilityIcon className="w-8 h-8 text-primary-500" />
               </div>
               <p className="text-center text-sm font-medium text-gray-400">Commerce for everyone, regardless of ability.</p>
            </div>
          </div>
        }
      />

      <SectionWrapper variant="deep" className="!pt-0">
        <div className="grid lg:grid-cols-[300px_1fr] gap-16 items-start">
          
          {/* Sticky TOC */}
          <aside className="hidden lg:block sticky top-24">
            <div className="glass p-8 rounded-[2rem] border border-white/10">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-8">Navigation</p>
               <nav className="space-y-4">
                  {sections.map(sec => (
                    <a
                      key={sec.id}
                      href={`#${sec.id}`}
                      onClick={() => setActiveSection(sec.id)}
                      className={`block text-xs font-bold uppercase tracking-widest transition-all ${activeSection === sec.id ? 'text-primary-500 bg-primary-500/5 -mx-4 px-4 py-2 rounded-lg' : 'text-gray-500 hover:text-white'}`}
                    >
                      {sec.title}
                    </a>
                  ))}
               </nav>
               <div className="mt-12 pt-8 border-t border-white/5">
                  <p className="text-xs font-bold text-gray-600 mb-4 uppercase tracking-widest">Feedback?</p>
                  <a href="mailto:accessibility@commercehub.io" className="flex items-center gap-2 text-primary-500 text-sm font-black uppercase tracking-widest group">
                    Report Issue <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
               </div>
            </div>
          </aside>

          {/* Document Content */}
          <article className="space-y-16 max-w-3xl">
            {/* Quick Links */}
            <div className="flex flex-wrap gap-4 pb-12 border-b border-white/5">
              {[{ label: 'Privacy Policy', path: '/privacy' }, { label: 'Terms of Service', path: '/terms' }, { label: 'Cookie Policy', path: '/cookies' }].map(l => (
                <button key={l.path} onClick={() => navigate(l.path)} className="text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full glass border border-white/10 text-gray-400 hover:text-white hover:border-primary-500 transition-all">
                  {l.label}
                </button>
              ))}
            </div>

            <section id="commitment" className="scroll-mt-32 group">
              <h2 className="text-3xl font-black text-white mb-8 pb-4 border-b border-white/5 group-hover:text-primary-400 transition-colors uppercase tracking-tight">1. Our Commitment</h2>
              <p className="text-gray-400 text-lg font-medium leading-relaxed mb-12">
                CommerceHub believes that commerce should be accessible to everyone. We are committed to ensuring our platform and websites conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                 {features.map((f, i) => (
                    <div key={i} className="glass p-6 rounded-2xl border border-white/5 hover:border-primary-500 transition-all group/feat">
                       <div className="text-primary-500 mb-4 group-hover/feat:scale-110 transition-transform">{React.cloneElement(f.icon, { size: 24 })}</div>
                       <h4 className="text-white font-black text-sm uppercase tracking-widest mb-2">{f.title}</h4>
                       <p className="text-gray-500 text-xs font-medium leading-relaxed">{f.desc}</p>
                    </div>
                 ))}
              </div>
            </section>

            <section id="conformance" className="scroll-mt-32 group">
              <h2 className="text-3xl font-black text-white mb-8 pb-4 border-b border-white/5 group-hover:text-primary-400 transition-colors uppercase tracking-tight">2. Conformance Status</h2>
              <div className="glass p-8 rounded-[2rem] border border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                   <AlertTriangleIcon className="text-amber-500" size={24} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500 mb-4">Current Status: Partially Conforms</p>
                <p className="text-gray-400 text-lg leading-relaxed font-medium">
                  CommerceHub partially conforms to WCAG 2.1 Level AA. This means that some parts of the content do not yet fully conform to the accessibility standard. We are actively working on remediating these areas.
                </p>
              </div>
            </section>

            <section id="supported-tech" className="scroll-mt-32 group">
              <h2 className="text-3xl font-black text-white mb-8 pb-4 border-b border-white/5 group-hover:text-primary-400 transition-colors uppercase tracking-tight">3. Supported Technologies</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                 {['HTML5', 'CSS3', 'WAI-ARIA', 'JavaScript', 'SVG', 'Tagged PDF'].map((tech, i) => (
                    <div key={i} className="glass p-4 rounded-xl border border-white/5 text-center">
                       <p className="text-[10px] font-black uppercase tracking-widest text-primary-500">{tech}</p>
                    </div>
                 ))}
              </div>
            </section>

            <section id="feedback" className="scroll-mt-32 group">
              <h2 className="text-3xl font-black text-white mb-8 pb-4 border-b border-white/5 group-hover:text-primary-400 transition-colors uppercase tracking-tight">6. Feedback</h2>
              <div className="mt-8 glass p-10 rounded-[2.5rem] border border-white/5 border-l-4 border-l-primary-600">
                <p className="text-gray-400 font-medium mb-8 leading-relaxed">
                  We welcome your feedback. If you experience any barriers or need content in an alternative format, please let us know.
                </p>
                <a href="mailto:accessibility@commercehub.io" className="text-2xl font-black text-white hover:text-primary-500 transition-colors block mb-4 underline decoration-primary-500/30 underline-offset-8">
                  accessibility@commercehub.io
                </a>
                <p className="text-gray-500 text-[10px] font-black leading-relaxed uppercase tracking-[0.2em]">Responsiveness Target: 5 Business Days</p>
              </div>
            </section>
          </article>
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
}
