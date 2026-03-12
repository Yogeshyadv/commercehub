import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRightIcon, TrendingUpIcon, DollarSignIcon, MailIcon,
  CheckIcon, DownloadIcon, FileTextIcon, CalendarIcon, BarChart2Icon,
  GlobeIcon, ZapIcon, ShieldCheckIcon, UsersIcon, StarIcon, ChevronDownIcon,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/landing/Navbar';
import Footer from '../components/landing/Footer';

/* ─── HEADLINE METRICS ─── */
const metrics = [
  { val: '$12B',  label: 'Series D valuation (Feb 2026)' },
  { val: '$220B', label: 'GMV processed in 2025' },
  { val: '62%',   label: 'YoY GMV growth in 2025' },
  { val: '$500M', label: 'raised in latest round' },
];

/* ─── GROWTH MILESTONES ─── */
const milestones = [
  { year: '2020', gmv: '$8B',   merchants: '280K',   note: 'Pandemic acceleration — 300K new merchants onboarded in 6 months' },
  { year: '2021', gmv: '$28B',  merchants: '600K',   note: 'B2B & wholesale goes live; first international expansion to MENA' },
  { year: '2022', gmv: '$62B',  merchants: '1.1M',   note: 'CommerceHub Plus launched; Series C at $4.2B valuation' },
  { year: '2023', gmv: '$105B', merchants: '1.5M',   note: 'AI features ship; CommerceHub Markets launched; Southeast Asia expansion' },
  { year: '2024', gmv: '$136B', merchants: '1.8M',   note: 'Social commerce integration; headless storefront; Series D closes at $12B' },
  { year: '2025', gmv: '$220B', merchants: '2.0M',   note: 'Native POS hardware; AI Storefront Builder; unified commerce launch' },
];

/* ─── FINANCIALS (illustrative) ─── */
const financials = [
  { label: 'Annual Recurring Revenue (ARR)',  val: '$1.4B',   change: '+58% YoY' },
  { label: 'Gross Merchandise Volume (GMV)',  val: '$220B',   change: '+62% YoY' },
  { label: 'Take Rate',                       val: '0.64%',   change: 'Stable'   },
  { label: 'Gross Margin',                    val: '71%',     change: '+4pp YoY' },
  { label: 'Active Merchants',                val: '2.03M',   change: '+14% YoY' },
  { label: 'Net Revenue Retention (NRR)',     val: '124%',    change: '+6pp YoY' },
];

/* ─── INVESTOR BACKING ─── */
const investors = [
  { name: 'Sequoia Capital',       stage: 'Series A, B, C, D', type: 'Lead'    },
  { name: 'Tiger Global',          stage: 'Series B, C, D',    type: 'Lead'    },
  { name: 'Bessemer Ventures',     stage: 'Series C, D',       type: 'Partner' },
  { name: 'Peak XV Partners',      stage: 'Series A, B',       type: 'Early'   },
  { name: 'Matrix Partners India', stage: 'Seed, Series A',    type: 'Early'   },
  { name: 'Steadview Capital',     stage: 'Series C, D',       type: 'Partner' },
];

/* ─── COMPETITIVE MOATS ─── */
const moats = [
  { icon: <ZapIcon className="w-5 h-5" />,          heading: 'Network effects',         body: '4,000+ partners, 10,000+ apps, and 2M merchants create a flywheel that grows stronger with every merchant added.', color: '#DC2626' },
  { icon: <BarChart2Icon className="w-5 h-5" />,    heading: 'Commerce data advantage',  body: '$220B in annual transaction data powers AI features that competitors cannot replicate without comparable scale.', color: '#0284C7' },
  { icon: <GlobeIcon className="w-5 h-5" />,        heading: 'Emerging market depth',    body: 'Deep localisation across 175 countries — including local payments, tax engines, and language support — built over 12 years.', color: '#059669' },
  { icon: <ShieldCheckIcon className="w-5 h-5" />,  heading: 'Infrastructure trust',     body: '99.99% uptime track record and PCI-DSS Level 1 compliance is years and hundreds of millions in engineering to replicate.', color: '#7C3AED' },
];

/* ─── IR DOCS ─── */
const irDocs = [
  { icon: <FileTextIcon className="w-5 h-5" />, label: 'FY2025 Annual Report (PDF)',         size: '4.2 MB', color: '#DC2626' },
  { icon: <FileTextIcon className="w-5 h-5" />, label: 'Q4 2025 Investor Presentation',      size: '6.1 MB', color: '#0284C7' },
  { icon: <FileTextIcon className="w-5 h-5" />, label: 'Series D Term Sheet Summary',        size: '900 KB', color: '#7C3AED' },
  { icon: <FileTextIcon className="w-5 h-5" />, label: 'Corporate Governance Framework',     size: '1.8 MB', color: '#059669' },
  { icon: <FileTextIcon className="w-5 h-5" />, label: 'ESG & Impact Report 2025',           size: '5.3 MB', color: '#D97706' },
  { icon: <CalendarIcon className="w-5 h-5" />,  label: 'Upcoming earnings call schedule',   size: 'PDF',    color: '#EC4899' },
];

/* ─── FAQ ─── */
const faqs = [
  { q: 'Is CommerceHub publicly listed?', a: 'CommerceHub is currently a private company. We completed a $500M Series D in February 2026 at a $12B valuation. We have not announced any IPO timeline at this stage.' },
  { q: 'How do I contact the investor relations team?', a: 'Please email ir@commercehub.io for all investor enquiries. We aim to respond within 2 business days.' },
  { q: 'What is CommerceHub\'s primary revenue model?', a: 'Revenue comes from three streams: (1) monthly subscription plans at Rs.699–Rs.24,999/month, (2) payment processing fees on CommerceHub Payments transactions, and (3) app and partner revenue share at 15–20%.' },
  { q: 'In which geographies does CommerceHub operate?', a: 'CommerceHub supports merchants in 175 countries and processes transactions in 130+ currencies. Our largest markets by GMV are India, UAE, UK, Southeast Asia, and the US.' },
  { q: 'What is your approach to profitability?', a: 'We are unit-economics positive at the merchant cohort level and investing aggressively in infrastructure, AI, and international expansion. We expect to reach cash-flow breakeven by late 2027 at current growth rates.' },
];

export default function InvestorsPage() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="bg-white text-black min-h-screen font-sans">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden pt-32 pb-24 text-center">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 65% 50% at 50% -5%, rgba(220,38,38,0.26) 0%, transparent 68%)' }} />
        <div className="relative max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#DC2626] mb-6 px-3 py-1.5 rounded-full border border-[#DC2626]/30 bg-[#DC2626]/10">
              Investor Relations
            </span>
            <h1 className="text-5xl sm:text-7xl font-black leading-[0.93] tracking-tight mb-6">
              Building the
              <br />
              <span className="text-[#DC2626]">commerce operating system.</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed mb-10">
              CommerceHub is the unified platform powering 2 million businesses and $220B in annual GMV. We are building the infrastructure layer that every online business will run on.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="mailto:ir@commercehub.io" className="inline-flex items-center gap-2 bg-[#DC2626] hover:bg-[#b91c1c] text-white font-bold text-base px-8 py-4 rounded-full transition-all duration-200 shadow-lg shadow-red-900/30">
                <MailIcon className="w-4 h-4" /> Contact IR team
              </a>
              <a href="#ir-docs" className="inline-flex items-center gap-2 border border-white/15 hover:border-white/40 text-white font-semibold text-base px-8 py-4 rounded-full transition-all duration-200">
                <DownloadIcon className="w-4 h-4" /> Download annual report
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── HEADLINE METRICS ── */}
      <section className="py-14 bg-[#080808] border-y border-white/[0.05]">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {metrics.map(({ val, label }) => (
            <motion.div key={val} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
              <p className="text-4xl sm:text-5xl font-black text-[#DC2626] leading-none mb-2">{val}</p>
              <p className="text-sm text-gray-500 leading-snug">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FINANCIALS KPIs ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-2">Key performance metrics</h2>
            <p className="text-gray-500 text-sm">FY2025 unaudited figures. Full financials available to accredited investors under NDA.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {financials.map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: (i % 3) * 0.07 }}
                className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-6"
              >
                <p className="text-gray-500 text-xs mb-3 uppercase tracking-wider">{f.label}</p>
                <p className="text-3xl font-black text-white mb-1">{f.val}</p>
                <p className={`text-xs font-bold ${f.change.includes('+') ? 'text-green-400' : 'text-gray-500'}`}>{f.change}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GMV GROWTH MILESTONES ── */}
      <section className="py-20 bg-[#060606]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-12">
            <h2 className="text-3xl font-black mb-2">GMV & merchant growth</h2>
            <p className="text-gray-500 text-sm">Six years of compounding growth — consistent across market cycles.</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-white/[0.06]">
            <table className="w-full text-sm min-w-[560px]">
              <thead>
                <tr className="border-b border-white/[0.06] bg-[#0a0a0a]">
                  {['Year', 'GMV', 'Merchants', 'Highlight'].map(h => (
                    <th key={h} className="text-left px-6 py-4 text-gray-600 text-xs font-black uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {milestones.map((m, i) => (
                  <tr key={m.year} className={`border-b border-white/[0.04] ${i % 2 === 0 ? 'bg-[#060606]' : 'bg-[#080808]'}`}>
                    <td className="px-6 py-4 text-[#DC2626] font-black">{m.year}</td>
                    <td className="px-6 py-4 text-white font-bold">{m.gmv}</td>
                    <td className="px-6 py-4 text-white">{m.merchants}</td>
                    <td className="px-6 py-4 text-gray-500 text-xs">{m.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── COMPETITIVE MOATS ── */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-2">Why CommerceHub wins</h2>
            <p className="text-gray-500 text-sm">Durable competitive advantages built over 12 years.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {moats.map((m, i) => (
              <motion.div
                key={m.heading}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-7"
              >
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl mb-5" style={{ background: `${m.color}14`, color: m.color }}>
                  {m.icon}
                </span>
                <h3 className="font-black text-white text-sm mb-2">{m.heading}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{m.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INVESTORS ── */}
      <section className="py-20 bg-[#060606]">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-2">Our investors</h2>
            <p className="text-gray-500 text-sm">Backed by the world's best technology investors across every round.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {investors.map((inv, i) => (
              <motion.div
                key={inv.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.38, delay: (i % 3) * 0.07 }}
                className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl px-6 py-5 flex items-center gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-[#DC2626]/10 flex items-center justify-center text-[#DC2626] font-black text-base shrink-0">
                  {inv.name[0]}
                </div>
                <div>
                  <p className="text-white font-black text-sm">{inv.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${inv.type === 'Lead' ? 'bg-[#DC2626]/10 text-[#DC2626]' : inv.type === 'Early' ? 'bg-green-900/20 text-green-400' : 'bg-white/[0.05] text-gray-500'}`}>
                      {inv.type}
                    </span>
                    <span className="text-gray-600 text-xs">{inv.stage}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── IR DOCUMENTS ── */}
      <section className="py-20 bg-black" id="ir-docs">
        <div className="max-w-5xl mx-auto px-6">
          <div className="mb-10">
            <h2 className="text-3xl font-black mb-2">IR documents</h2>
            <p className="text-gray-500 text-sm">Public filings, presentations, and governance documents.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {irDocs.map((d, i) => (
              <motion.div
                key={d.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: (i % 3) * 0.06 }}
                className="group bg-[#0a0a0a] border border-white/[0.06] rounded-2xl p-5 flex items-center gap-4 hover:border-white/[0.16] cursor-pointer transition-all"
              >
                <span className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${d.color}14`, color: d.color }}>
                  {d.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm">{d.label}</p>
                  <p className="text-gray-600 text-xs">{d.size}</p>
                </div>
                <DownloadIcon className="w-4 h-4 text-gray-600 group-hover:text-[#DC2626] transition-colors shrink-0" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 bg-[#060606]">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black mb-2">Investor FAQs</h2>
            <p className="text-gray-500 text-sm">Common questions from current and prospective investors.</p>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#0a0a0a] border border-white/[0.06] rounded-2xl overflow-hidden">
                <button className="w-full flex items-center justify-between px-6 py-5 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-semibold text-white text-sm pr-6">{faq.q}</span>
                  <span className={`shrink-0 w-7 h-7 rounded-full border flex items-center justify-center transition-all duration-200 ${openFaq === i ? 'border-[#DC2626] text-[#DC2626]' : 'border-white/20 text-gray-500'}`}>
                    <span className="text-lg leading-none font-light">{openFaq === i ? '−' : '+'}</span>
                  </span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-white/[0.06]">
                    <p className="pt-4">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT IR ── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-gray-50 border border-gray-200 rounded-3xl p-10 sm:p-14 grid md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[#DC2626] mb-5 px-3 py-1.5 rounded-full border border-[#DC2626]/30 bg-[#DC2626]/10">
                <TrendingUpIcon className="w-3.5 h-3.5" /> Investor Relations
              </span>
              <h2 className="text-3xl font-black mb-4 leading-tight">Connect with our<br />IR team.</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">For financial information, accredited investor access, or general capital markets enquiries, our IR team responds within 2 business days.</p>
              <ul className="space-y-2">
                {['Accredited investor data room available', 'Management meetings for institutional investors', 'ESG & governance data on request', '2-business-day response SLA'].map(b => (
                  <li key={b} className="flex items-center gap-2.5 text-xs text-gray-400">
                    <CheckIcon className="w-3.5 h-3.5 text-[#DC2626] shrink-0" strokeWidth={2.5} /> {b}
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <div className="bg-[#060606] border border-white/[0.06] rounded-2xl p-5">
                <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">Investor relations</p>
                <a href="mailto:ir@commercehub.io" className="text-white font-black text-base hover:text-[#DC2626] transition-colors">ir@commercehub.io</a>
              </div>
              <div className="bg-[#060606] border border-white/[0.06] rounded-2xl p-5">
                <p className="text-xs text-gray-600 uppercase tracking-widest mb-1">Head of IR</p>
                <p className="text-white font-black text-base">Vikram Nair</p>
                <p className="text-gray-500 text-xs">+91 80 6789 0001</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative py-28 bg-[#060606] overflow-hidden text-center">
        <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(ellipse 55% 45% at 50% 100%, rgba(220,38,38,0.2) 0%, transparent 70%)' }} />
        <div className="relative max-w-2xl mx-auto px-6">
          <h2 className="text-5xl font-black leading-tight mb-5">The commerce OS<br /><span className="text-[#DC2626]">for the next billion merchants.</span></h2>
          <p className="text-gray-400 text-lg mb-10">Interested in learning more about CommerceHub as an investment opportunity? Reach out to our IR team.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:ir@commercehub.io" className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-black font-black text-lg px-10 py-4 rounded-full transition-all duration-200">
              <MailIcon className="w-5 h-5" /> Contact IR
            </a>
            <button onClick={() => navigate('/about')} className="inline-flex items-center gap-2 border border-white/20 hover:border-white/50 text-white font-bold text-lg px-10 py-4 rounded-full transition-all duration-200">
              About CommerceHub
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
