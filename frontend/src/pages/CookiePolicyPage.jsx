import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CookieIcon, MailIcon, ChevronRightIcon, ToggleRightIcon, ToggleLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

const EFFECTIVE = 'March 1, 2026';
const LAST_UPDATED = 'March 1, 2026';

const cookieCategories = [
  {
    id: 'essential',
    label: 'Strictly Necessary',
    color: '#DC2626',
    required: true,
    description: 'These cookies are required for the platform to function. They cannot be disabled.',
    cookies: [
      { name: 'ch_session', provider: 'CommerceHub', purpose: 'Maintains your authenticated merchant session.', duration: 'Session' },
      { name: 'ch_csrf', provider: 'CommerceHub', purpose: 'CSRF protection token to prevent cross-site request forgery.', duration: 'Session' },
      { name: 'ch_tenant', provider: 'CommerceHub', purpose: 'Identifies which store/tenant the user is accessing.', duration: '24 hours' },
      { name: '__stripe_mid', provider: 'Stripe', purpose: 'Used for fraud detection and payment processing.', duration: '1 year' },
    ],
  },
  {
    id: 'functional',
    label: 'Functional',
    color: '#7C3AED',
    required: false,
    description: 'These cookies enable personalisation features like remembered preferences and language settings.',
    cookies: [
      { name: 'ch_locale', provider: 'CommerceHub', purpose: 'Stores your preferred language and region settings.', duration: '1 year' },
      { name: 'ch_theme', provider: 'CommerceHub', purpose: 'Stores your dashboard theme preference (light/dark).', duration: '1 year' },
      { name: 'ch_sidebar', provider: 'CommerceHub', purpose: 'Remembers sidebar collapsed/expanded state.', duration: '1 year' },
      { name: 'intercom-session-*', provider: 'Intercom', purpose: 'Enables persistent chat support sessions.', duration: '1 week' },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    color: '#0891B2',
    required: false,
    description: 'These cookies help us understand how merchants use our platform so we can improve it.',
    cookies: [
      { name: '_ga', provider: 'Google Analytics', purpose: 'Distinguishes unique users for traffic analysis.', duration: '2 years' },
      { name: '_ga_XXXXXXXX', provider: 'Google Analytics', purpose: 'Maintains session state across page requests.', duration: '2 years' },
      { name: 'amplitude_id_*', provider: 'Amplitude', purpose: 'Product analytics to understand feature usage.', duration: '1 year' },
      { name: 'hotjar_*', provider: 'Hotjar', purpose: 'Session recordings and heatmaps to analyse UX.', duration: '1 year' },
    ],
  },
  {
    id: 'marketing',
    label: 'Marketing',
    color: '#D97706',
    required: false,
    description: 'These cookies are used to serve you relevant ads and measure campaign effectiveness.',
    cookies: [
      { name: '_fbp', provider: 'Meta (Facebook)', purpose: 'Tracks conversions from Facebook ads.', duration: '90 days' },
      { name: '_gcl_au', provider: 'Google Ads', purpose: 'Used to store and track conversions from Google Ads.', duration: '90 days' },
      { name: 'li_fat_id', provider: 'LinkedIn', purpose: 'LinkedIn conversion tracking for enterprise campaigns.', duration: '30 days' },
      { name: 'ttclid', provider: 'TikTok', purpose: 'TikTok ads conversion attribution.', duration: '30 days' },
    ],
  },
];

const sections = [
  { id: 'what-are-cookies', title: '1. What Are Cookies?' },
  { id: 'how-we-use', title: '2. How We Use Cookies' },
  { id: 'cookie-types', title: '3. Cookie Categories' },
  { id: 'third-party', title: '4. Third-Party Cookies' },
  { id: 'manage-cookies', title: '5. Managing Your Preferences' },
  { id: 'do-not-track', title: '6. Do Not Track' },
  { id: 'contact', title: '7. Contact Us' },
];

export default function CookiePolicyPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('what-are-cookies');
  const [expandedCategory, setExpandedCategory] = useState('essential');

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
              <CookieIcon className="w-3.5 h-3.5" /> Legal
            </span>
            <h1 className="text-5xl sm:text-6xl font-black leading-tight mb-4">Cookie Policy</h1>
            <p className="text-gray-500 text-base mb-2">Effective: <span className="text-white font-semibold">{EFFECTIVE}</span> &nbsp;·&nbsp; Last updated: <span className="text-white font-semibold">{LAST_UPDATED}</span></p>
            <p className="text-gray-500 text-sm max-w-xl mx-auto">This policy explains what cookies we use, why we use them, and how you can control them.</p>
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
              <div className="mt-6 pt-5 border-t border-white/[0.06] space-y-2">
                <p className="text-xs text-gray-600">Cookie categories at a glance:</p>
                {cookieCategories.map(cat => (
                  <div key={cat.id} className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{cat.label}</span>
                    <span className="text-xs font-bold" style={{ color: cat.color }}>
                      {cat.required ? 'Always on' : 'Optional'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Doc body */}
          <article className="space-y-12 pt-2">
            {/* Cross-links */}
            <div className="flex flex-wrap gap-2 pb-2 border-b border-white/[0.06]">
              {[{ label: 'Privacy Policy', path: '/privacy' }, { label: 'Terms of Service', path: '/terms' }, { label: 'Accessibility', path: '/accessibility' }].map(l => (
                <button key={l.path} onClick={() => navigate(l.path)} className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full bg-[#0a0a0a] border border-white/[0.08] text-gray-400 hover:text-white hover:border-white/20 transition-all">
                  {l.label} <ChevronRightIcon className="w-3 h-3" />
                </button>
              ))}
            </div>

            {/* Section 1 */}
            <section id="what-are-cookies" className="scroll-mt-28">
              <h2 className="text-xl font-black text-white mb-5 pb-3 border-b border-white/[0.06]">1. What Are Cookies?</h2>
              <p className="text-gray-400 text-sm leading-7 mb-4">Cookies are small text files that websites store on your device when you visit them. They are widely used to make websites work efficiently, to remember your preferences, and to provide information to the site owners.</p>
              <p className="text-gray-400 text-sm leading-7">Alongside cookies, we may also use similar technologies such as web beacons, pixels, local storage, and session storage. For simplicity, we refer to all of these technologies as "cookies" in this policy.</p>
            </section>

            {/* Section 2 */}
            <section id="how-we-use" className="scroll-mt-28">
              <h2 className="text-xl font-black text-white mb-5 pb-3 border-b border-white/[0.06]">2. How We Use Cookies</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { title: 'Security', desc: 'Protecting your account from CSRF attacks, session hijacking, and fraudulent activity.' },
                  { title: 'Authentication', desc: 'Keeping you signed in across page loads without requiring re-authentication on every request.' },
                  { title: 'Preferences', desc: 'Remembering your language, region, currency, and UI configuration choices.' },
                  { title: 'Analytics', desc: 'Understanding how merchants navigate our platform to improve the user experience.' },
                  { title: 'Performance', desc: 'Optimising load times through caching and resource delivery strategies.' },
                  { title: 'Marketing', desc: 'Measuring the effectiveness of our advertising campaigns and personalising relevant messaging.' },
                ].map(item => (
                  <div key={item.title} className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-4">
                    <p className="text-sm font-black text-white mb-1">{item.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 3 — Cookie categories */}
            <section id="cookie-types" className="scroll-mt-28">
              <h2 className="text-xl font-black text-white mb-5 pb-3 border-b border-white/[0.06]">3. Cookie Categories</h2>
              <p className="text-gray-400 text-sm leading-7 mb-6">Click a category to view the specific cookies in use.</p>
              <div className="space-y-3">
                {cookieCategories.map(cat => (
                  <div key={cat.id} className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setExpandedCategory(expandedCategory === cat.id ? null : cat.id)}
                      className="w-full flex items-center justify-between px-5 py-4 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ background: cat.color }} />
                        <span className="font-black text-sm text-white">{cat.label}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full border font-medium" style={{ borderColor: `${cat.color}40`, color: cat.color, background: `${cat.color}12` }}>
                          {cat.cookies.length} cookies
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold" style={{ color: cat.color }}>{cat.required ? 'Always on' : 'Optional'}</span>
                        <ChevronRightIcon className={`w-4 h-4 text-gray-500 transition-transform ${expandedCategory === cat.id ? 'rotate-90' : ''}`} />
                      </div>
                    </button>

                    {expandedCategory === cat.id && (
                      <div className="px-5 pb-5 border-t border-white/[0.04]">
                        <p className="text-xs text-gray-500 leading-relaxed mt-3 mb-4">{cat.description}</p>
                        <div className="overflow-x-auto">
                          <table className="w-full text-xs">
                            <thead>
                              <tr className="text-left border-b border-white/[0.06]">
                                <th className="text-gray-600 font-bold pb-2 pr-4">Cookie name</th>
                                <th className="text-gray-600 font-bold pb-2 pr-4">Provider</th>
                                <th className="text-gray-600 font-bold pb-2 pr-4">Purpose</th>
                                <th className="text-gray-600 font-bold pb-2">Duration</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-white/[0.04]">
                              {cat.cookies.map(c => (
                                <tr key={c.name}>
                                  <td className="py-2.5 pr-4 font-mono text-white/80">{c.name}</td>
                                  <td className="py-2.5 pr-4 text-gray-400">{c.provider}</td>
                                  <td className="py-2.5 pr-4 text-gray-400 leading-relaxed">{c.purpose}</td>
                                  <td className="py-2.5 text-gray-400 whitespace-nowrap">{c.duration}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4 */}
            <section id="third-party" className="scroll-mt-28">
              <h2 className="text-xl font-black text-white mb-5 pb-3 border-b border-white/[0.06]">4. Third-Party Cookies</h2>
              <p className="text-gray-400 text-sm leading-7 mb-4">Some cookies on our platform are placed by third-party services we use. These third parties have their own privacy policies, which we encourage you to review:</p>
              <div className="grid sm:grid-cols-2 gap-3">
                {[
                  { name: 'Google Analytics', desc: 'Web traffic and product analytics.', url: 'https://policies.google.com/privacy' },
                  { name: 'Amplitude', desc: 'Product analytics and funnel analysis.', url: 'https://amplitude.com/privacy' },
                  { name: 'Hotjar', desc: 'Session recordings and heatmaps.', url: 'https://www.hotjar.com/legal/policies/privacy/' },
                  { name: 'Intercom', desc: 'Customer support chat widget.', url: 'https://www.intercom.com/legal/privacy' },
                  { name: 'Stripe', desc: 'Payment processing and fraud prevention.', url: 'https://stripe.com/privacy' },
                  { name: 'Meta / Facebook', desc: 'Advertising conversion tracking.', url: 'https://www.facebook.com/policies/cookies/' },
                ].map(tp => (
                  <div key={tp.name} className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-4">
                    <p className="text-sm font-black text-white mb-1">{tp.name}</p>
                    <p className="text-xs text-gray-500 mb-2">{tp.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 5 */}
            <section id="manage-cookies" className="scroll-mt-28">
              <h2 className="text-xl font-black text-white mb-5 pb-3 border-b border-white/[0.06]">5. Managing Your Preferences</h2>
              <p className="text-gray-400 text-sm leading-7 mb-4">You have several options for controlling cookies:</p>
              <div className="space-y-4">
                {[
                  { heading: 'Cookie consent banner', body: 'When you first visit CommerceHub, a cookie banner allows you to accept all, reject non-essential, or customise your preferences by category. You can revisit these at any time via the "Cookie preferences" link in our footer.' },
                  { heading: 'Browser settings', body: 'Most browsers allow you to refuse cookies, delete existing cookies, or alert you before a cookie is stored. Consult your browser\'s documentation or settings for instructions. Note: disabling strictly necessary cookies will prevent the platform from functioning correctly.' },
                  { heading: 'Opt-out tools', body: 'For analytics opt-out: Google Analytics Opt-out Browser Add-on, Amplitude opt-out documentation, Hotjar opt-out page. For advertising opt-out: Network Advertising Initiative (optout.networkadvertising.org), Digital Advertising Alliance (youradchoices.com).' },
                ].map(item => (
                  <div key={item.heading} className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-5">
                    <p className="text-sm font-black text-white mb-2">{item.heading}</p>
                    <p className="text-xs text-gray-400 leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 6 */}
            <section id="do-not-track" className="scroll-mt-28">
              <h2 className="text-xl font-black text-white mb-5 pb-3 border-b border-white/[0.06]">6. Do Not Track</h2>
              <p className="text-gray-400 text-sm leading-7">Some browsers include a "Do Not Track" (DNT) feature. There is currently no universally accepted standard for how DNT signals should be handled. CommerceHub does not currently respond to DNT browser signals. However, you can use the controls described in Section 5 to manage your cookie preferences.</p>
            </section>

            {/* Section 7 */}
            <section id="contact" className="scroll-mt-28">
              <h2 className="text-xl font-black text-white mb-5 pb-3 border-b border-white/[0.06]">7. Contact Us</h2>
              <p className="text-gray-400 text-sm leading-7 mb-4">If you have questions about our use of cookies, please contact us:</p>
              <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-6 space-y-3">
                <a href="mailto:privacy@commercehub.io" className="flex items-center gap-2 text-[#DC2626] font-bold text-sm hover:underline">
                  <MailIcon className="w-4 h-4" /> privacy@commercehub.io
                </a>
                <p className="text-gray-500 text-xs leading-relaxed">
                  CommerceHub Technologies Pvt. Ltd.{'\n'}
                  4th Floor, Prestige Tech Park{'\n'}
                  Outer Ring Road, Bengaluru – 560 103{'\n'}
                  Karnataka, India
                </p>
              </div>
            </section>
          </article>
        </div>
      </div>

      <Footer />
    </div>
  );
}
