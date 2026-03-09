import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, MailIcon, ArrowRightIcon, ChevronRightIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

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
          'Payment information: credit/debit card numbers, bank account details, and billing history. Payment data is tokenised and processed by PCI-DSS Level 1 certified processors.',
          'Store content: product listings, descriptions, images, pricing, and customer communications you create on our platform.',
          'Identity verification documents when required for payment enablement or fraud prevention.',
          'Communications: emails, chat transcripts, and support tickets you send to CommerceHub.',
        ],
      },
      {
        heading: '2.2 Information collected automatically',
        items: [
          'Log data: IP addresses, browser type, operating system, referring URLs, pages visited, and timestamps.',
          'Device identifiers: device model, operating system version, unique device IDs, and mobile network information.',
          'Usage data: features accessed, actions taken, session duration, and click paths within the platform.',
          'Cookie and tracking technology data: see our Cookie Policy for full details.',
          'Transaction data: order volumes, GMV, payment methods, and refund rates for your store.',
        ],
      },
      {
        heading: '2.3 Information from third parties',
        items: [
          'Payment processors and fraud detection services.',
          'Social media platforms when you connect them to your store.',
          'App developers whose apps you install from the CommerceHub App Store.',
          'Business intelligence and analytics partners (aggregated and anonymised only).',
        ],
      },
    ],
  },
  {
    id: 'how-we-use',
    title: '3. How We Use Your Information',
    items: [
      'To provide, operate, and improve the CommerceHub platform and Services.',
      'To process transactions and send related confirmations, invoices, and receipts.',
      'To authenticate your identity and prevent fraudulent access to your account.',
      'To provide customer support and respond to your enquiries.',
      'To send administrative communications, including policy updates and security alerts.',
      'To send marketing communications where you have consented or where permitted by law.',
      'To conduct research, analytics, and develop new features and services.',
      'To comply with legal obligations and enforce our Terms of Service.',
      'To detect, investigate, and prevent security incidents, fraud, and abuse.',
    ],
  },
  {
    id: 'sharing',
    title: '4. How We Share Your Information',
    body: [
      'CommerceHub does not sell your personal information. We share data only in the following circumstances:',
    ],
    items: [
      'Service providers: third-party vendors who perform services on our behalf (hosting, payment processing, email delivery, fraud detection). All are bound by data processing agreements.',
      'App developers: when you install an app from our App Store, you authorise that app to access specific data as disclosed at installation.',
      'Business transfers: in connection with a merger, acquisition, or sale of assets, your data may be transferred as part of that transaction.',
      'Legal requirements: when required by applicable law, court order, or governmental authority.',
      'Protection of rights: to protect the rights, property, or safety of CommerceHub, our merchants, buyers, or the public.',
      'With your consent: any other sharing we do will only be with your explicit consent.',
    ],
  },
  {
    id: 'data-retention',
    title: '5. Data Retention',
    body: [
      'We retain personal information for as long as necessary to provide our Services, comply with legal obligations, resolve disputes, and enforce our agreements.',
      'Merchant account data is retained for the duration of the active subscription plus 7 years for tax and accounting compliance. You may request deletion of your personal data at any time (see Section 7). Note that some data may be retained longer if required by law or for legitimate business purposes such as fraud prevention.',
    ],
  },
  {
    id: 'security',
    title: '6. Security',
    body: [
      'We implement industry-standard technical and organisational measures to protect your personal information against unauthorised access, alteration, disclosure, or destruction. These include:',
    ],
    items: [
      'TLS 1.3 encryption for all data in transit.',
      'AES-256 encryption for sensitive data at rest.',
      'PCI-DSS Level 1 certification for payment data handling.',
      'SOC 2 Type II audited infrastructure.',
      'Regular penetration testing and vulnerability assessments.',
      'Multi-factor authentication (MFA) available and encouraged for all accounts.',
    ],
    footer: 'No method of electronic transmission or storage is 100% secure. While we use commercially reasonable means to protect your data, we cannot guarantee absolute security.',
  },
  {
    id: 'your-rights',
    title: '7. Your Rights',
    body: [
      'Depending on your location, you may have the following rights regarding your personal data:',
    ],
    items: [
      'Access: request a copy of the personal data we hold about you.',
      'Rectification: request correction of inaccurate or incomplete data.',
      'Erasure: request deletion of your personal data ("right to be forgotten") subject to legal retention requirements.',
      'Portability: receive your data in a structured, machine-readable format.',
      'Objection: object to processing of your data for direct marketing or based on legitimate interests.',
      'Restriction: request that we restrict processing of your data in certain circumstances.',
      'Withdraw consent: where processing is based on consent, withdraw it at any time.',
    ],
    footer: 'To exercise any of these rights, contact us at privacy@commercehub.io. We will respond within 30 days (or as required by applicable law).',
  },
  {
    id: 'cookies',
    title: '8. Cookies',
    body: [
      'We use cookies and similar tracking technologies. For full details on the types of cookies we use, how we use them, and how to manage your preferences, please read our Cookie Policy at commercehub.io/cookies.',
    ],
  },
  {
    id: 'international',
    title: '9. International Transfers',
    body: [
      'CommerceHub operates globally. Your data may be transferred to and processed in countries other than your country of residence, including India, the United States, the United Kingdom, and Singapore. These countries may have different data protection laws than your jurisdiction.',
      'Where we transfer data outside the European Economic Area (EEA), we rely on Standard Contractual Clauses (SCCs) approved by the European Commission, or other approved transfer mechanisms. For transfers from India, we comply with the Digital Personal Data Protection Act 2023 (DPDPA).',
    ],
  },
  {
    id: 'children',
    title: '10. Children\'s Privacy',
    body: [
      'Our Services are not directed to individuals under the age of 18. We do not knowingly collect personal data from children. If you believe a child has provided us personal data, please contact us immediately at privacy@commercehub.io and we will delete the information.',
    ],
  },
  {
    id: 'changes',
    title: '11. Changes to This Policy',
    body: [
      'We may update this Privacy Policy from time to time. We will notify you of material changes by posting a notice on our platform, or by email, at least 30 days before the changes take effect. Your continued use of the Services after the effective date constitutes acceptance of the updated policy.',
    ],
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
    <div className="bg-black text-white min-h-screen font-sans">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-32 pb-16 text-center">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 55% 40% at 50% -5%, rgba(220,38,38,0.2) 0%, transparent 65%)' }} />
        <div className="relative max-w-3xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#DC2626] mb-5 px-3 py-1.5 rounded-full border border-[#DC2626]/30 bg-[#DC2626]/10">
              <ShieldCheckIcon className="w-3.5 h-3.5" /> Legal
            </span>
            <h1 className="text-5xl sm:text-6xl font-black leading-tight mb-4">Privacy Policy</h1>
            <p className="text-gray-500 text-base mb-2">Effective: <span className="text-white font-semibold">{EFFECTIVE}</span> &nbsp;·&nbsp; Last updated: <span className="text-white font-semibold">{LAST_UPDATED}</span></p>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">This policy explains how CommerceHub collects, uses, and protects your personal information. Please read it carefully.</p>
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
                <p className="text-xs text-gray-600 mb-3">Questions about privacy?</p>
                <a href="mailto:privacy@commercehub.io" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DC2626] hover:gap-2.5 transition-all">
                  <MailIcon className="w-3.5 h-3.5" /> Email our DPO
                </a>
              </div>
            </div>
          </aside>

          {/* Doc body */}
          <article className="space-y-12 pt-2">
            {/* Quick links – other legal docs */}
            <div className="flex flex-wrap gap-2 pb-2 border-b border-white/[0.06]">
              {[{ label: 'Terms of Service', path: '/terms' }, { label: 'Cookie Policy', path: '/cookies' }, { label: 'Accessibility', path: '/accessibility' }].map(l => (
                <button key={l.path} onClick={() => navigate(l.path)} className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-[#0a0a0a] border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20 transition-all">
                  {l.label} <ChevronRightIcon className="w-3 h-3" />
                </button>
              ))}
            </div>

            {sections.map((sec, i) => (
              <section key={sec.id} id={sec.id} className="scroll-mt-28">
                <h2 className="text-xl font-black text-white mb-5 pb-3 border-b border-white/[0.06]">{sec.title}</h2>

                {sec.body && sec.body.map((p, pi) => (
                  <p key={pi} className="text-gray-400 text-sm leading-7 mb-4">{p}</p>
                ))}

                {sec.subsections && sec.subsections.map(sub => (
                  <div key={sub.heading} className="mb-6">
                    <h3 className="text-sm font-black text-white mb-3">{sub.heading}</h3>
                    <ul className="space-y-2">
                      {sub.items.map((item, ii) => (
                        <li key={ii} className="flex items-start gap-3 text-sm text-gray-400 leading-relaxed">
                          <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#DC2626] mt-2" />
                          {item}
                        </li>
                      ))}
                    </ul>
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

                {sec.footer && <p className="text-gray-500 text-xs italic leading-relaxed mt-4 bg-[#0a0a0a] border border-white/[0.05] rounded-xl p-4">{sec.footer}</p>}

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
