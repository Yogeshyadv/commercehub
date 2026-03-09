import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ScrollTextIcon, MailIcon, ChevronRightIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

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
      'You must provide accurate, current, and complete information during registration and keep your account information updated at all times.',
      'You are responsible for maintaining the confidentiality of your account credentials. You must not share your password or allow unauthorised access to your account.',
      'You must notify us immediately at security@commercehub.io if you suspect any unauthorised use of your account.',
      'You must be at least 18 years of age to create an account. By registering, you confirm that you meet this requirement.',
      'We reserve the right to suspend or terminate accounts that we reasonably believe contain false, misleading, or fraudulent information.',
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
          'Illegal firearms, weapons, ammunition, or regulated substances.',
          'Pornographic, obscene, or sexually explicit content.',
          'Products that violate any applicable local, national, or international law.',
          'Any goods or services associated with human trafficking, exploitation, or abuse.',
          'Gambling, lottery, or sweepstakes products without appropriate licences.',
          'Malware, spyware, hacking tools, or items designed to facilitate unauthorised access to systems.',
        ],
      },
      {
        heading: '3.2 You must NOT:',
        items: [
          'Use the Services to send unsolicited commercial communications (spam).',
          'Engage in scraping, crawling, or automated extraction of data from our platform without written permission.',
          'Attempt to circumvent, disable, or interfere with any security features of the Services.',
          'Misrepresent your identity or affiliation with any person or organisation.',
          'Engage in any conduct that could damage, disable, overburden, or impair our servers or networks.',
        ],
      },
    ],
  },
  {
    id: 'subscription',
    title: '4. Subscription, Billing and Cancellation',
    subsections: [
      {
        heading: '4.1 Subscription Plans',
        body: 'CommerceHub offers multiple subscription plans. Features and pricing are described at commercehub.io/pricing. We reserve the right to modify pricing with 30 days notice.',
      },
      {
        heading: '4.2 Billing',
        items: [
          'Subscriptions are billed in advance on a monthly or annual basis, depending on the plan you choose.',
          'All fees are non-refundable except as required by applicable law or described in our refund policy.',
          'If your payment fails, we will notify you and attempt to retry. Persistent failures may result in service suspension.',
          'You are responsible for all taxes, levies, or duties imposed by taxing authorities. CommerceHub will collect applicable GST where required by Indian law.',
        ],
      },
      {
        heading: '4.3 Cancellation',
        items: [
          'You may cancel your subscription at any time from your account settings. Cancellation takes effect at the end of the current billing period.',
          'Upon cancellation, you will retain access to your store data for 60 days to enable export. After that period, data may be deleted per our data retention policy.',
          'CommerceHub may cancel your subscription immediately if you breach these Terms.',
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
        body: 'The CommerceHub platform, software, logo, trademarks, and all associated intellectual property are owned by CommerceHub Technologies Pvt. Ltd. or its licensors. You are granted a limited, non-exclusive, non-transferable licence to use the Services as described herein.',
      },
      {
        heading: '5.2 Your Content',
        body: 'You retain all rights to content and data you upload or create on our platform ("Merchant Content"). By uploading content, you grant CommerceHub a worldwide, royalty-free licence to host, display, and transmit that content as necessary to provide the Services. You represent that you own or have the necessary rights to share such content.',
      },
      {
        heading: '5.3 Feedback',
        body: 'Any feedback, suggestions, or ideas you provide to CommerceHub may be used by us without restriction or compensation to you.',
      },
    ],
  },
  {
    id: 'payments',
    title: '6. Payments and Transactions',
    items: [
      'CommerceHub facilitates payment processing through certified third-party payment processors. By accepting payments, you agree to the payment processor terms and applicable card network rules.',
      'Merchant payouts are subject to the payout schedule specified in your plan and applicable reserve policies for fraud and chargeback protection.',
      'CommerceHub reserves the right to withhold payouts if we reasonably suspect fraudulent activity, policy violations, or pending disputes.',
      'You are responsible for accurately calculating and remitting all applicable taxes on your transactions. CommerceHub provides tools to assist but is not responsible for your tax compliance.',
      'Chargebacks and disputes are subject to our Chargeback Policy available in the Merchant Help Centre.',
    ],
  },
  {
    id: 'third-party',
    title: '7. Third-Party Apps and Integrations',
    body: [
      'Our App Store contains third-party applications developed by independent developers. CommerceHub does not endorse, warrant, or assume responsibility for third-party apps. Your use of such apps is governed by the terms of the respective developer.',
      'When you install a third-party app, you authorise it to access specified data from your store. Review permissions carefully before installation.',
    ],
  },
  {
    id: 'disclaimers',
    title: '8. Disclaimers and Limitation of Liability',
    subsections: [
      {
        heading: '8.1 Service Availability',
        body: 'CommerceHub provides the Services on an "as is" and "as available" basis. We make no warranty that the Services will be uninterrupted, error-free, or free of viruses or other harmful components. We strive for 99.9% uptime but do not guarantee it.',
      },
      {
        heading: '8.2 Limitation of Liability',
        body: 'To the maximum extent permitted by applicable law, CommerceHub shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or damages for loss of profits, revenues, data, business, or goodwill, arising out of or in connection with these Terms or the Services. Our aggregate liability shall not exceed the fees paid by you to CommerceHub in the 12 months preceding the claim.',
      },
    ],
  },
  {
    id: 'termination',
    title: '9. Termination',
    body: [
      'Either party may terminate these Terms at any time. We may suspend or terminate your access immediately and without notice if you breach these Terms, engage in fraudulent or illegal activity, or if required to do so by law.',
      'Upon termination, your right to use the Services ceases. Provisions that by their nature should survive termination (including Sections 5, 6, 8, and 10) shall survive.',
    ],
  },
  {
    id: 'governing-law',
    title: '10. Governing Law and Disputes',
    body: [
      'These Terms are governed by and construed in accordance with the laws of India. Any disputes arising out of or in connection with these Terms shall first be subject to good-faith negotiations. If unresolved within 30 days, disputes shall be submitted to binding arbitration under the Arbitration and Conciliation Act, 1996, seated in Bengaluru, Karnataka, India.',
      'Nothing in this clause shall prevent either party from seeking injunctive or other equitable relief in any court of competent jurisdiction.',
    ],
  },
  {
    id: 'changes-to-terms',
    title: '11. Changes to These Terms',
    body: [
      'We may update these Terms from time to time. We will notify you of material changes at least 30 days in advance via email or a prominent notice on our platform. Your continued use of the Services after the effective date of the updated Terms constitutes your acceptance.',
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
    <div className="bg-black text-white min-h-screen font-sans">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-32 pb-16 text-center">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 55% 40% at 50% -5%, rgba(220,38,38,0.2) 0%, transparent 65%)' }} />
        <div className="relative max-w-3xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#DC2626] mb-5 px-3 py-1.5 rounded-full border border-[#DC2626]/30 bg-[#DC2626]/10">
              <ScrollTextIcon className="w-3.5 h-3.5" /> Legal
            </span>
            <h1 className="text-5xl sm:text-6xl font-black leading-tight mb-4">Terms of Service</h1>
            <p className="text-gray-500 text-base mb-2">Effective: <span className="text-white font-semibold">{EFFECTIVE}</span> &nbsp;·&nbsp; Last updated: <span className="text-white font-semibold">{LAST_UPDATED}</span></p>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">These Terms govern your use of CommerceHub. By using the platform you agree to these Terms.</p>
          </motion.div>
        </div>
      </section>

      {/* ── CONTENT ── */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-[260px_1fr] gap-12 items-start">

          {/* Sticky TOC */}
          <aside className="hidden lg:block sticky top-24">
            <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-5">
              <p className="text-xs font-black uppercase tracking-widest text-gray-600 mb-4">Contents</p>
              <nav className="space-y-1">
                {sections.map(sec => (
                  <a
                    key={sec.id}
                    href={`#${sec.id}`}
                    onClick={() => setActiveSection(sec.id)}
                    className={`block text-xs py-1.5 px-3 rounded-lg transition-all font-medium ${activeSection === sec.id ? 'bg-[#DC2626]/10 text-[#DC2626]' : 'text-gray-500 hover:text-white'}`}
                  >
                    {sec.title}
                  </a>
                ))}
              </nav>
              <div className="mt-6 pt-5 border-t border-white/[0.06]">
                <p className="text-xs text-gray-600 mb-3">Legal questions?</p>
                <a href="mailto:legal@commercehub.io" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DC2626] hover:gap-2.5 transition-all">
                  <MailIcon className="w-3.5 h-3.5" /> Email our Legal team
                </a>
              </div>
            </div>
          </aside>

          {/* Doc body */}
          <article className="space-y-12 pt-2">
            {/* Cross-links */}
            <div className="flex flex-wrap gap-2 pb-2 border-b border-white/[0.06]">
              {[{ label: 'Privacy Policy', path: '/privacy' }, { label: 'Cookie Policy', path: '/cookies' }, { label: 'Accessibility', path: '/accessibility' }].map(l => (
                <button key={l.path} onClick={() => navigate(l.path)} className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-[#0a0a0a] border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20 transition-all">
                  {l.label} <ChevronRightIcon className="w-3 h-3" />
                </button>
              ))}
            </div>

            {sections.map(sec => (
              <section key={sec.id} id={sec.id} className="scroll-mt-28">
                <h2 className="text-xl font-black text-white mb-5 pb-3 border-b border-white/[0.06]">{sec.title}</h2>

                {sec.body && sec.body.map((p, pi) => (
                  <p key={pi} className="text-gray-400 text-sm leading-7 mb-4">{p}</p>
                ))}

                {sec.subsections && sec.subsections.map(sub => (
                  <div key={sub.heading} className="mb-6">
                    <h3 className="text-sm font-black text-white mb-3">{sub.heading}</h3>
                    {sub.body && <p className="text-gray-400 text-sm leading-7 mb-3">{sub.body}</p>}
                    {sub.items && (
                      <ul className="space-y-2">
                        {sub.items.map((item, ii) => (
                          <li key={ii} className="flex items-start gap-3 text-sm text-gray-400 leading-relaxed">
                            <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#DC2626] mt-2" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}

                {sec.items && (
                  <ul className="space-y-2 mb-4">
                    {sec.items.map((item, ii) => (
                      <li key={ii} className="flex items-start gap-3 text-sm text-gray-400 leading-relaxed">
                        <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#DC2626] mt-2" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}

                {sec.contact && (
                  <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-6 mt-3 space-y-3">
                    <a href={`mailto:${sec.contact.email}`} className="flex items-center gap-2 text-[#DC2626] font-bold text-sm hover:underline">
                      <MailIcon className="w-4 h-4" /> {sec.contact.email}
                    </a>
                    <p className="text-gray-500 text-xs leading-relaxed whitespace-pre-line">{sec.contact.address}</p>
                  </div>
                )}
              </section>
            ))}
          </article>
        </div>
      </div>

      <Footer />
    </div>
  );
}
