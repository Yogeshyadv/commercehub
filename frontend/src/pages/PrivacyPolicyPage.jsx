import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheckIcon, MailIcon, ArrowRightIcon, ChevronRightIcon, FileTextIcon, LockIcon, EyeIcon, Share2Icon, ClockIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';
import HeroSection from '../components/marketing/HeroSection';
import { SectionWrapper, SectionHeading } from '../components/marketing/Layout';

const EFFECTIVE = 'March 1, 2026';
const LAST_UPDATED = 'March 1, 2026';

const sections = [
  {
    id: 'overview',
    title: '1. Overview',
    body: [
      'CommerceHub ("we", "us", or "our") is committed to protecting the privacy of our merchants, buyers, and visitors. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform, services, and websites (collectively, the "Services").',
      'Please read this policy carefully. By accessing or using our Services, you acknowledge that you have read, understood, and agree to the practices described here. If you do not agree, please discontinue use of our Services.',
    ],
  },
  {
    id: 'information-we-collect',
    title: '2. Information We Collect',
    subsections: [
      {
        heading: '2.1 Information you provide directly',
        items: [
          'Account registration data: name, email address, phone number, business name, and billing address.',
          'Payment information: credit/debit card numbers, bank account details, and billing history.',
          'Store content: product listings, descriptions, images, pricing, and customer communications.',
          'Identity verification documents when required for payment enablement.',
          'Communications: emails, chat transcripts, and support tickets.',
        ],
      },
      {
        heading: '2.2 Information collected automatically',
        items: [
          'Log data: IP addresses, browser type, operating system, andReferring URLs.',
          'Device identifiers: device model, unique device IDs, and mobile network information.',
          'Usage data: features accessed, session duration, and click paths.',
          'Cookie and tracking technology data.',
          'Transaction data: order volumes, GMV, and payment methods.',
        ],
      },
    ],
  },
  {
    id: 'how-we-use',
    title: '3. How We Use Your Information',
    items: [
      'To provide, operate, and improve the CommerceHub platform.',
      'To process transactions and send related confirmations and invoices.',
      'To authenticate your identity and prevent fraudulent access.',
      'To provide customer support and respond to your enquiries.',
      'To send administrative communications and security alerts.',
      'To conduct research and develop new features.',
    ],
  },
  {
    id: 'sharing',
    title: '4. How We Share Your Information',
    body: [
      'CommerceHub does not sell your personal information. We share data only in the following circumstances:',
    ],
    items: [
      'Service providers: third-party vendors who perform services on our behalf.',
      'App developers: when you install an app from our App Store.',
      'Legal requirements: when required by applicable law or court order.',
      'With your consent: any other sharing with your explicit consent.',
    ],
  },
  {
    id: 'security',
    title: '6. Security',
    body: [
      'We implement industry-standard technical and organisational measures to protect your personal information:',
    ],
    items: [
      'TLS 1.3 encryption for all data in transit.',
      'AES-256 encryption for sensitive data at rest.',
      'PCI-DSS Level 1 certification for payment handling.',
      'Multi-factor authentication (MFA) available for all accounts.',
    ],
    footer: 'While we use commercially reasonable means to protect your data, we cannot guarantee absolute security.',
  },
  {
    id: 'contact',
    title: '12. Contact Us',
    body: [
      'If you have questions, concerns, or requests related to this Privacy Policy, please contact our Data Protection Officer:',
    ],
    contact: {
      email: 'privacy@commercehub.io',
      address: 'CommerceHub Technologies Pvt. Ltd.\nAttn: Data Protection Officer\n4th Floor, Prestige Tech Park\nOuter Ring Road, Bengaluru – 560 103\nKarnataka, India',
    },
  },
];

export default function PrivacyPolicyPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');

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
        title="Privacy Policy"
        subtitle={`Effective: ${EFFECTIVE} • Last updated: ${LAST_UPDATED}`}
        visual={
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
            <div className="relative bg-white p-8 rounded-3xl border border-gray-100 shadow-2xl flex flex-col items-center">
               <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-6">
                  <ShieldCheckIcon className="w-8 h-8 text-red-600" />
               </div>
               <p className="text-center text-sm font-bold text-gray-500 uppercase tracking-widest">Enterprise-grade Security</p>
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
                   <p className="text-xs font-bold text-gray-400 mb-4 uppercase tracking-widest">Help & Support</p>
                   <a href="mailto:privacy@commercehub.io" className="flex items-center gap-2 text-black text-sm font-black uppercase tracking-widest group">
                     Contact Us <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                   </a>
                </div>
             </div>
          </aside>

          {/* Content */}
          <article className="space-y-16 max-w-3xl">
            <div className="flex flex-wrap gap-3 pb-8 border-b border-gray-100">
              {[{ label: 'Terms of Service', path: '/terms' }, { label: 'Cookie Policy', path: '/cookies' }, { label: 'Accessibility', path: '/accessibility' }].map(l => (
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

                    {sec.footer && <p className="text-gray-400 text-sm italic mt-8 bg-gray-50 p-6 rounded-2xl border border-gray-100">{sec.footer}</p>}

                    {sec.contact && (
                      <div className="mt-8 bg-black p-10 rounded-[2.5rem] border-l-8 border-red-600 text-white shadow-xl">
                        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-4">Direct Enquiry</p>
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
