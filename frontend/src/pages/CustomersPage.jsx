import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowRightIcon, UserIcon, UsersIcon, MailIcon, ZapIcon,
  TrendingUpIcon, ShieldIcon, TagIcon, MessageSquareIcon,
  BarChart2Icon, StarIcon, ChevronDownIcon, SparklesIcon,
  CheckIcon, RefreshCwIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

/* ─────────────────────────────────────── CDN */
const CDN = 'https://cdn.shopify.com/b/shopify-brochure2-assets';
const IMG = {
  segmentEditor:   `${CDN}/29c1212f9b5c9def92b019932a27f7d7.png`,
  merchantFilters: `${CDN}/bdce218c4d942da3d1fe5b5cbab76ad7.png`,
  personalMsg:     `${CDN}/fb4921282649044d15b19a5503b5db0a.png`,
  discounts:       `${CDN}/0bf94f7863b51bf28ac5b366a741ffa2.png`,
  airsign:         `${CDN}/ce9542d2ece70250fd348bc7f15218ab.webp`,
  segmentsWork:    `${CDN}/00d5edb67a0dbeb42d10ae28da419f32.png`,
  automationFlow:  `${CDN}/9b909644076a5879900849df7182a1bf.png`,
  emailDashboard:  `${CDN}/28a9ef2717737dbfe4b273d5abba31fb.png`,
  checkoutBtn:     `${CDN}/c292b7e48cbb8ce80b0903a2d57ff342.png`,
  dataGraphs:      `${CDN}/10fd102de0fb8d6b9f31d5b27da3a0d7.png`,
};

/* ─────────────────────────────────────── HELPERS */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1], delay },
});

/* ─────────────────────────────────────── DATA */
const stats = [
  { value: '360°',  label: 'Unified customer view',  desc: 'Across all channels',           icon: UserIcon },
  { value: 'Smart', label: 'Auto-segments',           desc: 'Dynamic & always up to date',   icon: UsersIcon },
  { value: '30%',   label: 'Better conversion',       desc: 'With personalised campaigns',   icon: TrendingUpIcon },
  { value: 'Free',  label: 'Included in every plan',  desc: 'No extra tools needed',         icon: ZapIcon },
];

const featureTabs = [
  {
    id: 'profiles',
    icon: <UserIcon className="w-5 h-5" />,
    label: 'Customer Profiles',
    heading: 'Everything you need to know — in one place',
    desc: 'Every customer gets a rich, automatically-populated profile: purchase history, contact details, lifetime value, marketing consent, notes, and tags — all easily searchable and always current.',
    img: IMG.merchantFilters,
    badges: ['Purchase history', 'Lifetime value', 'Tags & notes', 'Consent tracking', 'Import / export'],
  },
  {
    id: 'segments',
    icon: <UsersIcon className="w-5 h-5" />,
    label: 'Smart Segments',
    heading: 'Group your customers the way you think',
    desc: 'Build powerful customer segments using behavioural, demographic, and purchase data. Segments update automatically — so your VIP, wholesale, and win-back groups are always accurate without any manual work.',
    img: IMG.segmentEditor,
    badges: ['Behaviour filters', 'Location targeting', 'Dynamic updates', 'Unlimited groups', 'AI suggestions'],
  },
  {
    id: 'campaigns',
    icon: <MailIcon className="w-5 h-5" />,
    label: 'Email & SMS',
    heading: 'Campaigns that feel personal, at scale',
    desc: 'Design beautiful branded emails in minutes with drag-and-drop templates. Layer in AI-generated copy, express checkout buttons, and personalised product recommendations — then send to exactly the right segment.',
    img: IMG.emailDashboard,
    badges: ['Drag-and-drop editor', 'AI copywriting', 'SMS marketing', 'Express checkout', 'Schedule & preview'],
  },
  {
    id: 'automation',
    icon: <ZapIcon className="w-5 h-5" />,
    label: 'Automation',
    heading: 'Grow on autopilot with smart workflows',
    desc: 'Set up welcome series, abandoned cart recovery, win-backs, and upsell flows once — then let them run forever. Every automation can be customised with conditions, delays, and personalised content.',
    img: IMG.automationFlow,
    badges: ['Welcome series', 'Cart recovery', 'Win-back flows', 'Upsell triggers', 'Custom conditions'],
  },
];

const featureGrid = [
  { icon: UserIcon,      title: '360° Customer Profiles',   desc: 'Unified profiles with order history, LTV, tags, and marketing consent — captured automatically.' },
  { icon: UsersIcon,     title: 'Dynamic Segmentation',     desc: 'Rule-based segments that update in real time as customers match your filters.' },
  { icon: MailIcon,      title: 'Email & SMS Campaigns',    desc: 'Branded templates with AI copy, express checkout links, and personalised product sections.' },
  { icon: ZapIcon,       title: 'Marketing Automation',     desc: 'Welcome flows, cart recovery, win-backs, and upsells — set up once and running forever.' },
  { icon: TagIcon,       title: 'Discounts & Loyalty',      desc: 'Target specific segments with exclusive discounts to reward loyalty and increase repeat purchases.' },
  { icon: BarChart2Icon, title: 'Campaign Analytics',       desc: 'Track open rates, click-throughs, conversions, and revenue per email in one dashboard.' },
  { icon: ShieldIcon,    title: 'Privacy & Consent',        desc: 'Built-in GDPR and CCPA compliance. Capture and honour marketing consent automatically.' },
  { icon: SparklesIcon,  title: 'AI-Powered Insights',      desc: "Use AI to surface high-risk churners, top spenders, and untapped segments before they drift." },
];

const faqs = [
  {
    q: 'Does customer management cost extra?',
    a: 'No. Customer profiles, segmentation, and basic email campaigns are included in every CommerceHub plan at no extra cost. Advanced automation and SMS are available on higher tiers.',
  },
  {
    q: 'How do customer segments stay up to date?',
    a: 'Segments are dynamic — they automatically update as customers place orders, change their profile, or match new filter criteria. You never need to manually refresh a list.',
  },
  {
    q: 'Can I import my existing customers?',
    a: 'Yes. You can import customer data via CSV at any time, including name, email, phone, tags, and purchase history if available.',
  },
  {
    q: 'How does the abandoned cart automation work?',
    a: 'When a customer adds items to their cart but does not complete checkout, CommerceHub automatically sends a timed reminder email (and optional SMS). You can customise the delay, message, and any incentive.',
  },
  {
    q: 'Is my customer data shared with third parties?',
    a: 'No. Your customer data belongs to you and is never sold or shared. You retain full ownership and can export it at any time.',
  },
  {
    q: 'Can I sync segments with paid ad platforms?',
    a: 'Yes. You can sync CommerceHub segments directly with Meta, Google, TikTok, and Pinterest to run highly targeted campaigns using your own first-party customer data.',
  },
];

/* ─────────────────────────────────────── COMPONENT */
export default function CustomersPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profiles');
  const [openFaq, setOpenFaq] = useState(null);

  /* Auto-cycle tabs every 4 s */
  useEffect(() => {
    const ids = featureTabs.map(t => t.id);
    const timer = setInterval(() => {
      setActiveTab(cur => {
        const idx = ids.indexOf(cur);
        return ids[(idx + 1) % ids.length];
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const activeTabData = featureTabs.find(t => t.id === activeTab);

  return (
    <div className="bg-black min-h-screen">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative bg-black overflow-hidden pt-32 pb-24 px-6">
        {/* Ambient glow + grid */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[#DC2626]/[0.07] blur-[120px] rounded-full" />
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left copy */}
            <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2.5 bg-[#DC2626]/10 border border-[#DC2626]/25 text-[#DC2626] text-[11px] font-black uppercase tracking-[0.25em] px-4 py-2 rounded-full mb-8">
                <UsersIcon className="w-3.5 h-3.5" />
                Customer Management
              </motion.div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight mb-8">
                Know your<br />
                <span className="text-[#DC2626]">customers.</span><br />
                Grow with them.
              </h1>

              <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-lg mb-10">
                Build rich customer profiles, create smart segments, and launch personalised campaigns — all from one platform, included in every plan.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button onClick={() => navigate('/pricing')}
                  className="px-8 py-4 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-black rounded-2xl shadow-xl shadow-[#DC2626]/25 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm">
                  Start for free
                </button>
                <button onClick={() => navigate('/dashboard')}
                  className="px-8 py-4 bg-white/[0.05] border border-white/[0.1] text-white font-black rounded-2xl hover:bg-white/[0.09] transition-all text-sm">
                  Open dashboard
                </button>
              </div>
            </motion.div>

            {/* Right hero image */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.15 }} className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl shadow-black/60 border border-white/[0.07]">
                <img src={IMG.segmentEditor} alt="Customer segment editor" className="w-full object-cover" loading="eager" />
              </div>

              {/* Floating conversion card */}
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.9 }}
                className="absolute -bottom-5 -left-5 bg-white text-black rounded-2xl px-5 py-4 shadow-2xl z-10">
                <p className="text-[#DC2626] font-black text-2xl leading-none">30%</p>
                <p className="text-gray-500 text-xs font-semibold mt-0.5">Higher conversion rate</p>
              </motion.div>

              {/* Floating merchants badge */}
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.1 }}
                className="absolute top-6 -right-4 bg-[#DC2626] text-white rounded-2xl px-4 py-3 shadow-xl z-10">
                <p className="font-black text-sm leading-none">500k+</p>
                <p className="text-red-200 text-[10px] font-semibold mt-0.5">merchants</p>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="relative bg-gradient-to-b from-[#0a0a0a] to-black overflow-hidden border-y border-white/[0.05]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(220,38,38,0.06),transparent)]" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#DC2626]/60 to-transparent" />
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
        </div>
        <div className="relative max-w-6xl mx-auto px-6 py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.div key={i} {...fadeUp(i * 0.1)}
                  className="group relative flex flex-col items-center text-center px-6 py-12 rounded-2xl hover:bg-white/[0.03] transition-all duration-300">
                  {i > 0 && (
                    <div className="hidden lg:block absolute left-0 inset-y-10 w-px bg-gradient-to-b from-transparent via-white/[0.07] to-transparent" />
                  )}
                  <div className="mb-5 relative w-12 h-12">
                    <div className="absolute -inset-3 rounded-3xl bg-[#DC2626]/15 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative w-full h-full bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-2xl flex items-center justify-center group-hover:border-[#DC2626]/50 group-hover:bg-[#DC2626]/15 transition-all duration-300">
                      <Icon className="w-5 h-5 text-[#DC2626]" />
                    </div>
                  </div>
                  <p className="text-white text-3xl md:text-4xl font-black leading-none tracking-tight mb-2 group-hover:text-[#DC2626] transition-colors duration-300">{s.value}</p>
                  <p className="text-gray-300 text-sm font-bold mb-1">{s.label}</p>
                  <p className="text-gray-600 text-xs font-medium">{s.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FEATURE TABS ── */}
      <section className="bg-[#0a0a0a] py-28 px-6 border-t border-white/[0.05]">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="mb-14">
            <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-[#DC2626] mb-5">Platform</span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white leading-tight max-w-2xl">
              Everything you need to own the customer relationship
            </h2>
          </motion.div>

          {/* Tab pills */}
          <div className="flex flex-wrap gap-3 mb-8">
            {featureTabs.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-full border text-sm font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#DC2626] border-[#DC2626] text-white shadow-lg shadow-[#DC2626]/25'
                    : 'bg-white/[0.04] border-white/[0.08] text-gray-400 hover:border-white/20 hover:text-white'
                }`}>
                <span className={activeTab === tab.id ? 'text-white' : 'text-[#DC2626]'}>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Auto-advance progress bar */}
          <div className="h-0.5 bg-white/[0.05] rounded-full overflow-hidden mb-12 max-w-sm">
            <motion.div
              key={activeTab}
              className="h-full bg-[#DC2626] rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 4, ease: 'linear' }}
            />
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            {activeTabData && (
              <motion.div key={activeTab}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                  <h3 className="text-3xl md:text-4xl font-black text-white mb-5 leading-tight">{activeTabData.heading}</h3>
                  <p className="text-gray-400 font-medium leading-relaxed mb-8">{activeTabData.desc}</p>
                  <div className="flex flex-wrap gap-2.5 mb-8">
                    {activeTabData.badges.map((b, i) => (
                      <span key={i} className="inline-flex items-center gap-1.5 bg-white/[0.06] border border-white/[0.08] text-gray-300 text-xs font-bold px-3.5 py-2 rounded-full">
                        <CheckIcon className="w-3 h-3 text-[#DC2626]" /> {b}
                      </span>
                    ))}
                  </div>
                  <button onClick={() => navigate('/pricing')} className="inline-flex items-center gap-2 text-[#DC2626] font-black text-sm group/btn">
                    Get started free <ArrowRightIcon className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
                <div className="rounded-3xl overflow-hidden border border-white/[0.07] shadow-2xl shadow-black/40">
                  <img src={activeTabData.img} alt={activeTabData.heading} className="w-full object-cover" loading="lazy" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* ── FEATURE GRID ── */}
      <section className="bg-black py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-[#DC2626] mb-5">Features</span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">The complete customer toolkit</h2>
            <p className="text-gray-400 font-medium mt-4 max-w-xl mx-auto">Everything you need to understand, engage, and retain every customer — in one platform.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featureGrid.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={i} {...fadeUp(i * 0.06)}
                  className="group bg-[#0d0d0d] border border-white/[0.06] rounded-3xl p-7 hover:border-[#DC2626]/30 hover:bg-[#0d0d0d]/80 transition-all duration-300">
                  <div className="w-11 h-11 bg-[#DC2626]/10 border border-[#DC2626]/20 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-[#DC2626]/20 group-hover:border-[#DC2626]/40 transition-all">
                    <Icon className="w-5 h-5 text-[#DC2626]" />
                  </div>
                  <h3 className="text-white font-black text-base mb-2 group-hover:text-[#DC2626] transition-colors">{f.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SHOWCASE: SEGMENTATION + AUTOMATION ── */}
      <section className="bg-black py-10 pb-28 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
          {[
            {
              img: IMG.personalMsg,
              tag: 'Segmentation',
              heading: 'Know exactly who to talk to',
              desc: 'Build segments as targeted as your marketing plans. Filter by location, purchase behaviour, email engagement, product bought, lifetime value, and more. Segments update automatically as your customers evolve.',
              cta: 'Explore segmentation',
            },
            {
              img: IMG.automationFlow,
              tag: 'Automation',
              heading: 'Turn one-time buyers into loyal fans',
              desc: 'Set up welcome emails, cart recovery sequences, win-back campaigns, and upsell flows once — then watch them work around the clock. Every workflow is fully customisable with conditions, delays, and personalised content.',
              cta: 'See automation tools',
            },
          ].map((item, i) => (
            <motion.div key={i} {...fadeUp(i * 0.1)} className="rounded-3xl overflow-hidden border border-white/[0.07] bg-[#111] group hover:border-[#DC2626]/30 transition-all">
              <img src={item.img} alt={item.heading} className="w-full object-cover max-h-[280px] group-hover:scale-[1.02] transition-transform duration-500" loading="lazy" />
              <div className="p-8">
                <span className="inline-block bg-[#DC2626]/15 text-[#DC2626] text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-4">{item.tag}</span>
                <h3 className="text-white font-black text-xl mb-3">{item.heading}</h3>
                <p className="text-gray-400 text-sm font-medium leading-relaxed mb-5">{item.desc}</p>
                <button onClick={() => navigate('/pricing')} className="inline-flex items-center gap-2 text-[#DC2626] font-black text-sm group/btn">
                  {item.cta} <ArrowRightIcon className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIAL STRIP ── */}
      <section className="bg-[#DC2626] py-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-[0.08]"
          style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative max-w-5xl mx-auto text-center">
          <motion.div {...fadeUp()}>
            <div className="flex justify-center mb-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} className="w-6 h-6 text-white fill-white" />
              ))}
            </div>
            <p className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight max-w-3xl mx-auto mb-8">
              "We identified the segment, created a discount, communicated in a very personalised way — and saw about 30% of those people convert."
            </p>
            <div className="flex items-center justify-center gap-4">
              <img src={IMG.airsign} alt="Airsign product" className="w-14 h-14 rounded-full object-cover border-2 border-white/30 shadow-lg" loading="lazy" />
              <div className="text-left">
                <p className="text-white font-black text-sm">Alex Dashefsky</p>
                <p className="text-red-200 text-xs font-semibold">Co-founder, Airsign</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CAMPAIGN ANALYTICS SPLIT ── */}
      <section className="bg-[#0a0a0a] py-28 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div {...fadeUp()}>
            <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-[#DC2626] mb-6">Campaign Analytics</span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
              Understand exactly what is working
            </h2>
            <p className="text-gray-400 font-medium leading-relaxed mb-10">
              Every email and SMS you send comes with a full performance breakdown. Track open rates, click-throughs, conversions, and revenue attributed to each campaign — and refine your approach over time.
            </p>
            <ul className="space-y-4 mb-10">
              {[
                'Email open rates & click-throughs',
                'Revenue per campaign',
                'Conversion funnel view',
                'Unsubscribe & bounce tracking',
                'Benchmark vs. industry average',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300 text-sm font-medium">
                  <span className="w-5 h-5 bg-[#DC2626]/15 border border-[#DC2626]/30 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckIcon className="w-3 h-3 text-[#DC2626]" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <button onClick={() => navigate('/product/analytics')} className="inline-flex items-center gap-2 text-[#DC2626] font-black text-sm group/btn">
              Explore analytics <ArrowRightIcon className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          <motion.div {...fadeUp(0.15)} className="rounded-3xl overflow-hidden border border-white/[0.07] shadow-2xl shadow-black/40">
            <img src={IMG.emailDashboard} alt="Campaign analytics dashboard" className="w-full object-cover" loading="lazy" />
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="bg-black py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div {...fadeUp()} className="text-center mb-16">
            <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-[#DC2626] mb-5">FAQ</span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">Common questions</h2>
          </motion.div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} {...fadeUp(i * 0.05)} className="border border-white/[0.07] rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-7 py-6 text-left group hover:bg-white/[0.02] transition-colors">
                  <span className="text-white font-bold text-sm pr-4 group-hover:text-[#DC2626] transition-colors">{faq.q}</span>
                  <ChevronDownIcon className={`w-5 h-5 text-gray-500 flex-shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-[#DC2626]' : ''}`} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}
                      className="overflow-hidden">
                      <p className="px-7 pb-6 text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#0a0a0a] py-28 px-6 relative overflow-hidden border-t border-white/[0.05]">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#DC2626]/[0.08] blur-[100px] rounded-full" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#DC2626]/50 to-transparent" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div {...fadeUp()}>
            <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-[#DC2626] mb-6">Get started</span>
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-[0.95] tracking-tight mb-6">
              Turn customer data<br />into <span className="text-[#DC2626]">real growth.</span>
            </h2>
            <p className="text-gray-400 text-lg font-medium mb-10 max-w-xl mx-auto">
              Start building smarter customer relationships today. No setup fees, no extra tools, no limits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={() => navigate('/pricing')}
                className="px-10 py-5 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-black rounded-2xl shadow-xl shadow-[#DC2626]/25 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm">
                Start for free
              </button>
              <button onClick={() => navigate('/enterprise')}
                className="px-10 py-5 bg-white text-black font-black rounded-2xl hover:bg-gray-100 transition-all text-sm">
                Talk to sales
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
