import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon, BarChart3Icon, SmartphoneIcon, PackageIcon, UsersIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const cards = [
  {
    icon: <BarChart3Icon className="w-5 h-5" />,
    title: 'Analytics dashboard',
    desc: 'Track sales, revenue, and customer behaviour in real time from a single place.',
  },
  {
    icon: <SmartphoneIcon className="w-5 h-5" />,
    title: 'Manage on the go',
    desc: 'Run your entire store from your phone — fulfil orders, check inventory, chat with customers.',
  },
  {
    icon: <PackageIcon className="w-5 h-5" />,
    title: 'Inventory control',
    desc: 'Set low-stock alerts, track SKUs across warehouses, and avoid stockouts automatically.',
  },
  {
    icon: <UsersIcon className="w-5 h-5" />,
    title: 'Team & permissions',
    desc: "Add staff, assign roles, and control who sees what — keep your business running smoothly.",
  },
];

export function TakeCareOfBusiness() {
  const navigate = useNavigate();

  return (
    <section className="bg-black text-white py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* Top text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mb-16"
        >
          <span className="inline-block px-3 py-1 rounded-full bg-[#DC2626]/20 text-[#DC2626] text-xs font-bold uppercase tracking-widest mb-5">
            Business tools
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.05] mb-6">
            Take care of<br className="hidden md:block" /> business
          </h2>
          <p className="text-gray-400 text-lg font-medium leading-relaxed">
            Everything you need to manage and scale your business — orders, inventory, analytics, and your team — all from one powerful platform.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="mt-8 inline-flex items-center gap-2 px-7 py-4 bg-[#DC2626] text-white text-sm font-bold rounded-xl hover:bg-[#B91C1C] active:scale-95 transition-all shadow-lg group"
          >
            Start for free
            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Dashboard preview + cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">

          {/* Dashboard image */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="bg-[#111] rounded-3xl overflow-hidden border border-white/[0.07] shadow-2xl">
              {/* Fake browser chrome */}
              <div className="bg-[#1a1a1a] px-4 py-3 flex items-center gap-2 border-b border-white/[0.06]">
                <span className="w-3 h-3 rounded-full bg-[#DC2626]/60" />
                <span className="w-3 h-3 rounded-full bg-white/20" />
                <span className="w-3 h-3 rounded-full bg-white/20" />
                <div className="ml-3 flex-1 bg-white/[0.05] rounded-md h-6 max-w-[240px]" />
              </div>
              {/* Dashboard body */}
              <div className="p-5 space-y-4">
                {/* KPI row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Revenue', value: '₹2,84,900', change: '+18%' },
                    { label: 'Orders', value: '1,204', change: '+11%' },
                    { label: 'Customers', value: '892', change: '+24%' },
                  ].map((kpi, i) => (
                    <div key={i} className="bg-white/[0.05] rounded-xl p-3 border border-white/[0.05]">
                      <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-widest mb-1">{kpi.label}</p>
                      <p className="text-white font-black text-base leading-none">{kpi.value}</p>
                      <p className="text-[#DC2626] text-[10px] font-bold mt-1">{kpi.change}</p>
                    </div>
                  ))}
                </div>
                {/* Chart bars */}
                <div className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.05]">
                  <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-widest mb-3">Sales this week</p>
                  <div className="flex items-end gap-2 h-20">
                    {[40, 65, 55, 80, 70, 90, 75].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-md bg-[#DC2626]/70" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <div className="flex justify-between mt-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                      <span key={d} className="text-[8px] text-gray-600 font-semibold">{d}</span>
                    ))}
                  </div>
                </div>
                {/* Recent orders */}
                <div className="bg-white/[0.04] rounded-xl p-4 border border-white/[0.05] space-y-2">
                  <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-widest mb-2">Recent orders</p>
                  {[
                    { id: '#4821', customer: 'Priya S.', amount: '₹3,200', status: 'Paid' },
                    { id: '#4820', customer: 'Rahul M.', amount: '₹1,850', status: 'Shipped' },
                    { id: '#4819', customer: 'Ananya K.', amount: '₹7,400', status: 'Processing' },
                  ].map(order => (
                    <div key={order.id} className="flex items-center justify-between">
                      <span className="text-gray-400 text-[10px] font-mono">{order.id}</span>
                      <span className="text-gray-300 text-[10px] font-semibold">{order.customer}</span>
                      <span className="text-white text-[10px] font-bold">{order.amount}</span>
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        order.status === 'Paid' ? 'bg-[#DC2626]/20 text-[#DC2626]' :
                        order.status === 'Shipped' ? 'bg-white/10 text-gray-300' :
                        'bg-white/[0.07] text-gray-500'
                      }`}>{order.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Feature cards */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6"
          >
            {cards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.15 * i }}
                className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-6 hover:bg-white/[0.07] hover:border-[#DC2626]/30 transition-all group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#DC2626]/20 text-[#DC2626] flex items-center justify-center mb-4 group-hover:bg-[#DC2626] group-hover:text-white transition-all">
                  {card.icon}
                </div>
                <h4 className="text-white font-bold text-base mb-2">{card.title}</h4>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{card.desc}</p>
              </motion.div>
            ))}

            {/* Mobile app preview card */}
            <div className="sm:col-span-2 bg-gradient-to-br from-[#DC2626]/10 to-transparent border border-[#DC2626]/20 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-[#DC2626] flex items-center justify-center">
                <SmartphoneIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="text-white font-bold text-base mb-1">CommerceHub mobile app</h4>
                <p className="text-gray-400 text-sm font-medium">Manage orders, check analytics, and respond to customers — all from your pocket.</p>
              </div>
              <button
                onClick={() => navigate('/register')}
                className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-xs font-bold rounded-xl hover:bg-gray-100 transition-all whitespace-nowrap"
              >
                Get the app <ArrowRightIcon className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
