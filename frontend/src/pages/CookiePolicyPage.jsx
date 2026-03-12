import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CookieIcon, MailIcon, ArrowRightIcon, ChevronRightIcon, FileTextIcon, LockIcon, ShieldIcon, DatabaseIcon, BarChartIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import HeroSection from '../components/marketing/HeroSection';
import { SectionWrapper, PremiumCard } from '../components/marketing/Layout';

const EFFECTIVE = 'March 1, 2026';
const LAST_UPDATED = 'March 1, 2026';

const cookieCategories = [
  {
    id: 'essential',
    label: 'Strictly Necessary',
    color: '#DC2626',
    required: true,
    description: 'Required for the platform to function. Cannot be disabled.',
    cookies: [
      { name: 'ch_session', provider: 'CommerceHub', purpose: 'Maintains authenticated merchant session.', duration: 'Session' },
      { name: 'ch_csrf', provider: 'CommerceHub', purpose: 'CSRF protection token.', duration: 'Session' },
    ],
  },
  {
    id: 'functional',
    label: 'Functional',
    color: '#7C3AED',
    required: false,
    description: 'Enables personalisation like remembered language settings.',
    cookies: [
      { name: 'ch_locale', provider: 'CommerceHub', purpose: 'Stores language and region settings.', duration: '1 year' },
      { name: 'ch_theme', provider: 'CommerceHub', purpose: 'Stores dashboard theme preference.', duration: '1 year' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    color: '#0891B2',
    required: false,
    description: 'Helps us understand how merchants use our platform.',
    cookies: [
      { name: '_ga', provider: 'Google Analytics', purpose: 'Traffic analysis.', duration: '2 years' },
      { name: 'amplitude_id_*', provider: 'Amplitude', purpose: 'Product analytics.', duration: '1 year' },
    ],
  },
];

const sections = [
  { id: 'overview', title: '1. What Are Cookies?' },
  { id: 'usage', title: '2. How We Use Them' },
  { id: 'categories', title: '3. Cookie Categories' },
  { id: 'third-party', title: '4. Third-Party' },
  { id: 'manage', title: '5. Management' },
  { id: 'contact', title: '6. Contact Us' },
];

export default function CookiePolicyPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedCategory, setExpandedCategory] = useState('essential');

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
        title="Cookie Policy"
        subtitle={`Effective: ${EFFECTIVE} • Last updated: ${LAST_UPDATED}`}
        visual={
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary-600 to-blue-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative glass p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center">
               <div className="w-16 h-16 rounded-2xl bg-primary-600/20 flex items-center justify-center mb-6">
                  <CookieIcon className="w-8 h-8 text-primary-500" />
               </div>
               <p className="text-center text-sm font-medium text-gray-400">Manage your tracking preferences with complete transparency.</p>
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
                  <div className="space-y-3">
                    {cookieCategories.map(cat => (
                      <div key={cat.id} className="flex items-center justify-between text-[10px] uppercase font-black tracking-widest">
                        <span className="text-gray-600">{cat.label}</span>
                        <span style={{ color: cat.color }}>{cat.required ? 'Req' : 'Opt'}</span>
                      </div>
                    ))}
                  </div>
               </div>
            </div>
          </aside>

          {/* Document Content */}
          <article className="space-y-16 max-w-3xl">
            {/* Quick Links */}
            <div className="flex flex-wrap gap-4 pb-12 border-b border-white/5">
              {[{ label: 'Privacy Policy', path: '/privacy' }, { label: 'Terms of Service', path: '/terms' }, { label: 'Accessibility', path: '/accessibility' }].map(l => (
                <button key={l.path} onClick={() => navigate(l.path)} className="text-[10px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full glass border border-white/10 text-gray-400 hover:text-white hover:border-primary-500 transition-all">
                  {l.label}
                </button>
              ))}
            </div>

            <section id="overview" className="scroll-mt-32 group">
              <h2 className="text-3xl font-black text-white mb-8 pb-4 border-b border-white/5 group-hover:text-primary-400 transition-colors uppercase tracking-tight">1. What Are Cookies?</h2>
              <div className="space-y-6">
                 <p className="text-gray-400 text-lg leading-relaxed font-medium text-justify italic">
                   "Cookies are small text files stored on your device that help us provide a seamless and secure experience."
                 </p>
                 <p className="text-gray-400 text-lg leading-relaxed font-medium">
                   Alongside cookies, we may also use similar technologies such as web beacons, pixels, local storage, and session storage to power the CommerceHub ecosystem.
                 </p>
              </div>
            </section>

            <section id="usage" className="scroll-mt-32 group">
              <h2 className="text-3xl font-black text-white mb-8 pb-4 border-b border-white/5 group-hover:text-primary-400 transition-colors uppercase tracking-tight">2. How We Use Them</h2>
              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                 {[
                   { title: 'Security', icon: <ShieldIcon />, desc: 'Protecting your account from hijacking and fraud.' },
                   { title: 'Auth', icon: <LockIcon />, desc: 'Keeping you signed in across page loads.' },
                   { title: 'Data', icon: <DatabaseIcon />, desc: 'Optimising load times through clever caching.' },
                   { title: 'Insights', icon: <BarChartIcon />, desc: 'Understanding merchant navigation patterns.' },
                 ].map((item, i) => (
                    <div key={i} className="glass p-6 rounded-2xl border border-white/5 hover:border-primary-500 transition-all">
                       <div className="text-primary-500 mb-4">{React.cloneElement(item.icon, { size: 20 })}</div>
                       <h4 className="text-white font-black text-sm uppercase tracking-widest mb-2">{item.title}</h4>
                       <p className="text-gray-500 text-xs font-medium leading-relaxed">{item.desc}</p>
                    </div>
                 ))}
              </div>
            </section>

            <section id="categories" className="scroll-mt-32 group">
              <h2 className="text-3xl font-black text-white mb-8 pb-4 border-b border-white/5 group-hover:text-primary-400 transition-colors uppercase tracking-tight">3. Cookie Categories</h2>
              <div className="space-y-4">
                 {cookieCategories.map(cat => (
                   <div key={cat.id} className="glass rounded-[2rem] border border-white/10 overflow-hidden">
                      <button 
                        onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                        className="w-full flex items-center justify-between p-8 text-left"
                      >
                         <div className="flex items-center gap-6">
                            <div className="w-3 h-3 rounded-full shadow-[0_0_12px_rgba(255,255,255,0.2)]" style={{ background: cat.color }} />
                            <div>
                               <h3 className="text-xl font-bold text-white tracking-tight">{cat.label}</h3>
                               <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">{cat.cookies.length} Active Cookies</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-6">
                            <span className="text-[10px] font-black uppercase tracking-widest" style={{ color: cat.color }}>{cat.required ? 'Mandatory' : 'Optional'}</span>
                            <ChevronRightIcon className={`w-5 h-5 text-gray-600 transition-transform ${expandedCategory === cat.id ? 'rotate-90 text-white' : ''}`} />
                         </div>
                      </button>
                      
                      <AnimatePresence>
                        {expandedCategory === cat.id && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden bg-white/[0.02]"
                          >
                             <div className="p-8 pt-0 border-t border-white/5">
                                <p className="text-gray-400 font-medium mb-8 leading-relaxed max-w-2xl">{cat.description}</p>
                                <div className="space-y-4">
                                   {cat.cookies.map((c, ci) => (
                                      <div key={ci} className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-xl border border-white/5 text-[10px] font-black uppercase tracking-widest">
                                         <div className="text-white selection:bg-primary-500/50">{c.name}</div>
                                         <div className="text-gray-600">{c.provider}</div>
                                         <div className="text-gray-400 col-span-2 md:col-span-1">{c.purpose}</div>
                                         <div className="text-primary-500 text-right">{c.duration}</div>
                                      </div>
                                   ))}
                                </div>
                             </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                   </div>
                 ))}
              </div>
            </section>

            <section id="contact" className="scroll-mt-32 group">
              <h2 className="text-3xl font-black text-white mb-8 pb-4 border-b border-white/5 group-hover:text-primary-400 transition-colors uppercase tracking-tight">6. Contact Us</h2>
              <div className="mt-8 glass p-10 rounded-[2.5rem] border border-white/5 border-l-4 border-l-primary-600">
                <p className="text-gray-400 font-medium mb-6">For any queries regarding our cookie practices, please reach out to our privacy team.</p>
                <a href="mailto:privacy@commercehub.io" className="text-2xl font-black text-white hover:text-primary-500 transition-colors block mb-4">
                  privacy@commercehub.io
                </a>
                <p className="text-gray-500 text-sm leading-relaxed font-medium uppercase tracking-widest">CommerceHub Technologies Pvt. Ltd. • Bengaluru, India</p>
              </div>
            </section>
          </article>
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
}
