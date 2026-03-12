import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollTextIcon, MailIcon, ArrowRightIcon, ChevronRightIcon, FileTextIcon, LockIcon, GavelIcon, ShieldIcon, CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import HeroSection from '../components/marketing/HeroSection';
import { SectionWrapper, SectionHeading } from '../components/marketing/Layout';

const EFFECTIVE = 'March 1, 2026';
const LAST_UPDATED = 'March 1, 2026';

const sections = [
  {
    id: 'acceptance',
    title: '1. Acceptance of Terms',
    body: [
      'By registering for, accessing, or using the CommerceHub platform and services (the "Services"), you ("Merchant" or "User") agree to be bound by these Terms of Service ("Terms") and all policies incorporated by reference, including our Privacy Policy and Cookie Policy.',
      'If you are entering into these Terms on behalf of a business entity, you represent and warrant that you have the authority to bind that entity. These Terms form a legally binding agreement between you and CommerceHub Technologies Pvt. Ltd. ("CommerceHub", "we", "us", or "our").',
    ],
  },
  {
    id: 'accounts',
    title: '2. Account Registration and Security',
    items: [
      'You must provide accurate, current, and complete information during registration.',
      'You are responsible for maintaining the confidentiality of your account credentials.',
      'You must notify us immediately at security@commercehub.io if you suspect any unauthorised use.',
      'You must be at least 18 years of age to create an account.',
      'We reserve the right to suspend accounts with fraudulent information.',
    ],
  },
  {
    id: 'acceptable-use',
    title: '3. Acceptable Use',
    body: ['You may use our Services only for lawful purposes and in accordance with these Terms.'],
    subsections: [
      {
        heading: '3.1 You may NOT use our platform to sell or promote:',
        items: [
          'Counterfeit goods, unlicensed intellectual property, or pirated software.',
          'Illegal firearms, weapons, or regulated substances.',
          'Pornographic, obscene, or sexually explicit content.',
          'Products that violate any applicable local, national, or international law.',
        ],
      },
    ],
  },
  {
    id: 'subscription',
    title: '4. Subscription and Billing',
    subsections: [
      {
        heading: '4.1 Billing',
        items: [
          'Subscriptions are billed in advance on a monthly or annual basis.',
          'All fees are non-refundable except as required by law.',
          'You are responsible for all taxes, levies, or duties.',
        ],
      },
      {
        heading: '4.2 Cancellation',
        items: [
          'You may cancel your subscription at any time via your account settings.',
          'Cancellation takes effect at the end of the current billing period.',
        ],
      },
    ],
  },
  {
    id: 'intellectual-property',
    title: '5. Intellectual Property',
    subsections: [
      {
        heading: '5.1 CommerceHub IP',
        body: 'The CommerceHub platform, software, logo, and all associated IP are owned by CommerceHub Technologies Pvt. Ltd. or its licensors.',
      },
      {
        heading: '5.2 Your Content',
        body: 'You retain all rights to content and data you upload. You grant CommerceHub a worldwide licence to host and display that content specifically to provide the Services.',
      },
    ],
  },
  {
    id: 'disclaimers',
    title: '8. Disclaimers',
    subsections: [
      {
        heading: '8.1 Service Availability',
        body: 'CommerceHub provides Services on an "as is" basis. We strive for 99.9% uptime but do not guarantee it.',
      },
      {
        heading: '8.2 Liability',
        body: 'CommerceHub shall not be liable for any indirect, incidental, or consequential damages. Our total liability is limited to fees paid in the last 12 months.',
      },
    ],
  },
  {
    id: 'contact',
    title: '12. Contact',
    body: ['For questions about these Terms, please contact our Legal team:'],
    contact: {
      email: 'legal@commercehub.io',
      address: 'CommerceHub Technologies Pvt. Ltd.\nAttn: Legal Department\n4th Floor, Prestige Tech Park\nOuter Ring Road, Bengaluru – 560 103\nKarnataka, India',
    },
  },
];

export default function TermsOfServicePage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('acceptance');

  useEffect(() => {
    const handler = () => {
      const scrollY = window.scrollY + 120;
      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el && el.offsetTop <= scrollY) setActiveSection(sec.id);
      }
    };
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <div className="bg-white min-h-screen selection:bg-red-100 selection:text-red-900">
      <Navbar />

      <HeroSection 
        badge="Legal Information"
        title="Terms of Service"
        subtitle={`Effective: ${EFFECTIVE} • Last updated: ${LAST_UPDATED}`}
        visual={
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-white p-8 rounded-3xl border border-gray-100 shadow-2xl flex flex-col items-center">
               <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-6">
                  <ScrollTextIcon className="w-8 h-8 text-red-600" />
               </div>
               <p className="text-center text-sm font-bold text-gray-500 uppercase tracking-widest">Legal Agreement</p>
            </div>
          </div>
        }
      />

      <SectionWrapper variant="primary" className="!pt-0">
        <div className="grid lg:grid-cols-[300px_1fr] gap-16 items-start">
          
          {/* Sticky TOC */}
          <aside className="hidden lg:block sticky top-24">
             <div className="bg-gray-50 p-8 rounded-[2.5rem] border border-gray-100">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-8">Navigation</p>
                <nav className="space-y-4">
                   {sections.map(sec => (
                     <a
                       key={sec.id}
                       href={`#${sec.id}`}
                       onClick={() => setActiveSection(sec.id)}
                       className={`block text-[11px] font-black uppercase tracking-[0.1em] transition-all ${activeSection === sec.id ? 'text-red-600 translate-x-1' : 'text-gray-500 hover:text-black hover:translate-x-1'}`}
                     >
                       {sec.title}
                     </a>
                   ))}
                </nav>
                <div className="mt-12 pt-8 border-t border-gray-200">
                   <p className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Legal Counsel</p>
                   <a href="mailto:legal@commercehub.io" className="flex items-center gap-2 text-black text-sm font-black uppercase tracking-widest group">
                     Contact Legal <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                   </a>
                </div>
             </div>
          </aside>

          {/* Content */}
          <article className="space-y-16 max-w-3xl">
            <div className="flex flex-wrap gap-3 pb-8 border-b border-gray-100">
              {[{ label: 'Privacy Policy', path: '/privacy' }, { label: 'Cookie Policy', path: '/cookies' }, { label: 'Accessibility', path: '/accessibility' }].map(l => (
                <button key={l.path} onClick={() => navigate(l.path)} className="text-[10px] font-black uppercase tracking-[0.15em] px-5 py-2.5 rounded-full border border-gray-200 bg-white text-gray-500 hover:border-black hover:text-black transition-all shadow-sm">
                  {l.label}
                </button>
              ))}
            </div>

            {sections.map((sec) => (
              <section key={sec.id} id={sec.id} className="scroll-mt-32">
                 <h2 className="text-3xl font-extrabold text-black mb-8 pb-4 border-b border-gray-100 tracking-tight">{sec.title}</h2>
                 
                 <div className="space-y-8">
                    {sec.body && sec.body.map((p, pi) => (
                      <p key={pi} className="text-gray-600 text-lg leading-relaxed font-medium">{p}</p>
                    ))}

                    {sec.subsections && sec.subsections.map(sub => (
                      <div key={sub.heading} className="mt-10 bg-gray-50 p-8 rounded-[2rem] border border-gray-100">
                        <h3 className="text-xl font-extrabold text-black mb-6">{sub.heading}</h3>
                        {sub.body && <p className="text-gray-600 text-base font-medium mb-6">{sub.body}</p>}
                        <ul className="grid gap-4">
                          {sub.items.map((item, ii) => (
                            <li key={ii} className="flex items-start gap-4 text-gray-600 font-medium text-base">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2.5 shrink-0" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {sec.items && (
                      <ul className="grid gap-4 mt-8">
                        {sec.items.map((item, ii) => (
                          <li key={ii} className="flex items-start gap-4 text-gray-600 font-medium text-base">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-600 mt-2.5 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {sec.contact && (
                      <div className="mt-8 bg-black p-10 rounded-[2.5rem] border-l-8 border-red-600 text-white shadow-xl">
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4">Legal Dept</p>
                        <a href={`mailto:${sec.contact.email}`} className="text-2xl font-black hover:text-red-500 transition-colors block mb-6">
                          {sec.contact.email}
                        </a>
                        <p className="text-gray-400 text-xs font-bold leading-relaxed whitespace-pre-line uppercase tracking-widest">{sec.contact.address}</p>
                      </div>
                    )}
                 </div>
              </section>
            ))}
          </article>
        </div>
      </SectionWrapper>

      <Footer />
    </div>
  );
}
