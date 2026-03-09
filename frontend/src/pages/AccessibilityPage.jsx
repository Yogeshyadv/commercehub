import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AccessibilityIcon, MailIcon, ChevronRightIcon, CheckIcon, AlertTriangleIcon, MonitorIcon, KeyboardIcon, EyeIcon, TypeIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

const EFFECTIVE = 'March 1, 2026';
const LAST_UPDATED = 'March 1, 2026';

const sections = [
  { id: 'commitment', title: '1. Our Commitment' },
  { id: 'conformance', title: '2. Conformance Status' },
  { id: 'supported-tech', title: '3. Supported Technologies' },
  { id: 'assistive-tech', title: '4. Assistive Technologies Tested' },
  { id: 'known-issues', title: '5. Known Limitations' },
  { id: 'feedback', title: '6. Feedback and Contact' },
  { id: 'legal', title: '7. Legal Framework' },
];

const features = [
  {
    icon: <KeyboardIcon className="w-5 h-5" />,
    title: 'Keyboard Navigation',
    desc: 'All interactive elements are accessible via keyboard alone. We follow logical tab order and provide visible focus indicators across the entire platform.',
  },
  {
    icon: <EyeIcon className="w-5 h-5" />,
    title: 'Screen Reader Support',
    desc: 'Semantic HTML, ARIA roles, labels, and live regions ensure that screen reader users receive meaningful, contextual information about all interface elements.',
  },
  {
    icon: <TypeIcon className="w-5 h-5" />,
    title: 'Text Resizing',
    desc: 'Text can be resized up to 200% without loss of content or functionality. We use relative units (rem, em) throughout our stylesheets.',
  },
  {
    icon: <MonitorIcon className="w-5 h-5" />,
    title: 'Colour Contrast',
    desc: 'We maintain a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text, meeting WCAG 2.1 Level AA contrast requirements.',
  },
];

const assistiveTech = [
  { at: 'NVDA', browser: 'Mozilla Firefox (Windows)', status: 'Tested' },
  { at: 'JAWS', browser: 'Google Chrome (Windows)', status: 'Tested' },
  { at: 'VoiceOver', browser: 'Safari (macOS, iOS)', status: 'Tested' },
  { at: 'TalkBack', browser: 'Chrome (Android)', status: 'Tested' },
  { at: 'Microsoft Narrator', browser: 'Microsoft Edge (Windows)', status: 'Tested' },
  { at: 'Dragon NaturallySpeaking', browser: 'Google Chrome (Windows)', status: 'Tested' },
];

const knownIssues = [
  {
    issue: 'Complex data tables in Analytics dashboard lack proper row/column header associations',
    affected: 'Analytics → Reports',
    workaround: 'Data can be downloaded as CSV for use in assistive technology-friendly spreadsheets.',
    targetFix: 'Q2 2026',
    severity: 'Medium',
  },
  {
    issue: 'Image carousel on the product listing page does not announce image changes to screen readers',
    affected: 'Products → Listings',
    workaround: 'All images are also listed individually below the carousel with full alt text.',
    targetFix: 'Q1 2026',
    severity: 'High',
  },
  {
    issue: 'Drag-and-drop interface for reordering menu items has no keyboard equivalent',
    affected: 'Settings → Navigation',
    workaround: 'Items can be reordered via the "Move up / Move down" buttons in simple list view.',
    targetFix: 'Q2 2026',
    severity: 'Medium',
  },
  {
    issue: 'Some dynamically generated error messages are not announced by screen readers',
    affected: 'Checkout / Order forms',
    workaround: 'Error text appears inline below the relevant field with high-contrast styling.',
    targetFix: 'Q1 2026',
    severity: 'High',
  },
];

const severityColour = { High: '#DC2626', Medium: '#D97706', Low: '#16A34A' };

export default function AccessibilityPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('commitment');

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
              <AccessibilityIcon className="w-3.5 h-3.5" /> Accessibility
            </span>
            <h1 className="text-5xl sm:text-6xl font-black leading-tight mb-4">Accessibility Statement</h1>
            <p className="text-gray-500 text-base mb-2">Effective: <span className="text-white font-semibold">{EFFECTIVE}</span> &nbsp;·&nbsp; Last updated: <span className="text-white font-semibold">{LAST_UPDATED}</span></p>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">CommerceHub is committed to ensuring digital accessibility for people of all abilities.</p>
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
                <p className="text-xs text-gray-600 mb-3">Accessibility issues?</p>
                <a href="mailto:accessibility@commercehub.io" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#DC2626] hover:gap-2.5 transition-all">
                  <MailIcon className="w-3.5 h-3.5" /> Report a problem
                </a>
              </div>
            </div>
          </aside>

          {/* Doc body */}
          <article className="space-y-12 pt-2">
            {/* Cross-links */}
            <div className="flex flex-wrap gap-2 pb-2 border-b border-white/[0.06]">
              {[{ label: 'Privacy Policy', path: '/privacy' }, { label: 'Terms of Service', path: '/terms' }, { label: 'Cookie Policy', path: '/cookies' }].map(l => (
                <button key={l.path} onClick={() => navigate(l.path)} className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-[#0a0a0a] border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20 transition-all">
                  {l.label} <ChevronRightIcon className="w-3 h-3" />
                </button>
              ))}
            </div>

            {/* 1. Commitment */}
            <section id="commitment" className="scroll-mt-28">
              <h2 className="text-xl font-black text-white mb-5 pb-3 border-b border-white/[0.06]">1. Our Commitment</h2>
              <p className="text-gray-400 text-sm leading-7 mb-6">CommerceHub believes that commerce should be accessible to everyone. We are committed to ensuring our platform and websites conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. We continually evaluate and improve our Services to remove barriers for users with disabilities.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                {features.map(f => (
                  <div key={f.title} className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-5">
                    <div className="w-9 h-9 rounded-xl bg-[#DC2626]/10 text-[#DC2626] flex items-center justify-center mb-3">{f.icon}</div>
                    <p className="text-sm font-black text-white mb-2">{f.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 2. Conformance */}
            <section id="conformance" className="scroll-mt-28">
              <h2 className="text-xl font-black text-white mb-5 pb-3 border-b border-white/[0.06]">2. Conformance Status</h2>
              <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    <AlertTriangleIcon className="w-3.5 h-3.5" /> Partially Conforms
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-7">CommerceHub <strong className="text-white">partially conforms</strong> to WCAG 2.1 Level AA. "Partially conforms" means that some parts of the content do not fully conform to the accessibility standard. Known non-conformances are listed in Section 5 below, along with target remediation dates.</p>
              </div>
              <p className="text-gray-400 text-sm leading-7">We use the following evaluation methods: automated testing with Axe, Lighthouse, and IBM Equal Access Checker; manual testing with keyboard navigation and screen readers; and periodic third-party audits conducted against WCAG 2.1 criteria.</p>
            </section>

            {/* 3. Supported Technologies */}
            <section id="supported-tech" className="scroll-mt-28">
              <h2 className="text-xl font-black text-white mb-5 pb-3 border-b border-white/[0.06]">3. Supported Technologies</h2>
              <p className="text-gray-400 text-sm leading-7 mb-4">CommerceHub is designed to work with the following technologies. Functionality cannot be guaranteed if these are not supported:</p>
              <div className="grid sm:grid-cols-3 gap-3">
                {[
                  { label: 'HTML5', note: 'Semantic markup' },
                  { label: 'CSS', note: 'Including high-contrast media queries' },
                  { label: 'JavaScript', note: 'Must be enabled for full functionality' },
                  { label: 'WAI-ARIA 1.1', note: 'For dynamic content and widgets' },
                  { label: 'SVG', note: 'With accessible titles and descriptions' },
                  { label: 'PDF (tagged)', note: 'For downloadable invoices and reports' },
                ].map(t => (
                  <div key={t.label} className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-3">
                    <p className="text-sm font-black text-white">{t.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{t.note}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. Assistive Tech */}
            <section id="assistive-tech" className="scroll-mt-28">
              <h2 className="text-xl font-black text-white mb-5 pb-3 border-b border-white/[0.06]">4. Assistive Technologies Tested</h2>
              <p className="text-gray-400 text-sm leading-7 mb-5">The following assistive technologies were used during our most recent testing cycle:</p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left border-b border-white/[0.06]">
                      <th className="text-gray-600 text-xs font-black pb-3 pr-6">Assistive Technology</th>
                      <th className="text-gray-600 text-xs font-black pb-3 pr-6">Browser / Platform</th>
                      <th className="text-gray-600 text-xs font-black pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04]">
                    {assistiveTech.map(row => (
                      <tr key={row.at}>
                        <td className="py-3 pr-6 text-white font-medium text-sm">{row.at}</td>
                        <td className="py-3 pr-6 text-gray-400 text-sm">{row.browser}</td>
                        <td className="py-3">
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full">
                            <CheckIcon className="w-3 h-3" /> {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 5. Known Issues */}
            <section id="known-issues" className="scroll-mt-28">
              <h2 className="text-xl font-black text-white mb-5 pb-3 border-b border-white/[0.06]">5. Known Limitations</h2>
              <p className="text-gray-400 text-sm leading-7 mb-5">Despite our best efforts, the following known accessibility issues exist. We are actively working to resolve them:</p>
              <div className="space-y-4">
                {knownIssues.map((issue, i) => (
                  <div key={i} className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <p className="text-sm font-bold text-white leading-snug">{issue.issue}</p>
                      <span className="shrink-0 text-xs font-black px-2.5 py-1 rounded-full border" style={{ color: severityColour[issue.severity], borderColor: `${severityColour[issue.severity]}40`, background: `${severityColour[issue.severity]}12` }}>
                        {issue.severity}
                      </span>
                    </div>
                    <div className="grid sm:grid-cols-3 gap-3 text-xs">
                      <div>
                        <p className="text-gray-600 font-bold mb-0.5 uppercase tracking-wide">Affected area</p>
                        <p className="text-gray-400">{issue.affected}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-bold mb-0.5 uppercase tracking-wide">Workaround</p>
                        <p className="text-gray-400 leading-relaxed">{issue.workaround}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 font-bold mb-0.5 uppercase tracking-wide">Target fix</p>
                        <p className="text-[#DC2626] font-bold">{issue.targetFix}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. Feedback */}
            <section id="feedback" className="scroll-mt-28">
              <h2 className="text-xl font-black text-white mb-5 pb-3 border-b border-white/[0.06]">6. Feedback and Contact</h2>
              <p className="text-gray-400 text-sm leading-7 mb-4">We welcome your feedback on the accessibility of CommerceHub. If you experience any barriers that prevent you from accessing any part of our platform, or if you need content in an alternative format, please let us know:</p>
              <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-6 space-y-4">
                <a href="mailto:accessibility@commercehub.io" className="flex items-center gap-2 text-[#DC2626] font-bold text-sm hover:underline">
                  <MailIcon className="w-4 h-4" /> accessibility@commercehub.io
                </a>
                <p className="text-gray-400 text-sm leading-7">We aim to respond to accessibility feedback within <strong className="text-white">5 business days</strong>. Please include:</p>
                <ul className="space-y-2">
                  {[
                    'The URL or section of the platform where you experienced the issue.',
                    'The assistive technology you are using (name and version).',
                    'A description of the problem and what outcome you expected.',
                    'Your contact information so we can follow up with you.',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                      <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[#DC2626] mt-2" />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="pt-3 border-t border-white/[0.06]">
                  <p className="text-xs text-gray-500 leading-relaxed">
                    If you are not satisfied with our response, you may contact the relevant national enforcement authority. In India, this is the Department of Empowerment of Persons with Disabilities (DEPwD). In the EU, you may contact the national authority responsible for the Web Accessibility Directive.
                  </p>
                </div>
              </div>
            </section>

            {/* 7. Legal */}
            <section id="legal" className="scroll-mt-28">
              <h2 className="text-xl font-black text-white mb-5 pb-3 border-b border-white/[0.06]">7. Legal Framework</h2>
              <p className="text-gray-400 text-sm leading-7 mb-5">This accessibility statement is informed by the following legal and regulatory frameworks:</p>
              <div className="space-y-3">
                {[
                  { law: 'RPWD Act 2016 (India)', desc: 'The Rights of Persons with Disabilities Act, 2016 requires accessible digital services for persons with disabilities in India.' },
                  { law: 'ADA (United States)', desc: 'The Americans with Disabilities Act requires digital accessibility for services operating in or accessible from the United States.' },
                  { law: 'EN 301 549 (European Union)', desc: 'The European Standard for Accessibility requirements for ICT products and services, referenced in the EU Web Accessibility Directive 2016/2102.' },
                  { law: 'WCAG 2.1 Level AA', desc: 'The internationally recognised Web Content Accessibility Guidelines provide the technical basis for all our accessibility work.' },
                ].map(f => (
                  <div key={f.law} className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-4 flex items-start gap-4">
                    <span className="shrink-0 w-2 h-2 rounded-full bg-[#DC2626] mt-1.5" />
                    <div>
                      <p className="text-sm font-black text-white mb-1">{f.law}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </article>
        </div>
      </div>

      <Footer />
    </div>
  );
}
