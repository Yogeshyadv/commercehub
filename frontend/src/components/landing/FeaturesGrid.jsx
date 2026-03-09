import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const brandLogos = [
  { name: 'Pantaloons',     cls: 'font-black tracking-tight' },
  { name: 'Hamleys',        cls: 'font-bold italic' },
  { name: 'MINISO',         cls: 'font-black tracking-[0.18em]' },
  { name: 'Sabyasachi',     cls: 'font-light tracking-widest' },
  { name: 'Peter England',  cls: 'font-bold tracking-tight' },
  { name: 'ZARA',           cls: 'font-black tracking-[0.3em]' },
  { name: 'H&M',            cls: 'font-black text-2xl' },
  { name: 'Tupperware',     cls: 'font-medium tracking-wide' },
  { name: 'Max Fashion',    cls: 'font-bold' },
  { name: 'Nykaa',          cls: 'font-black italic' },
  { name: 'W for Woman',    cls: 'font-semibold tracking-wide' },
  { name: 'Mamaearth',      cls: 'font-bold tracking-tight' },
];

const storeImages = [
  { src: 'https://cdn.shopify.com/b/shopify-brochure2-assets/c65bc0c2daf1df2c109d1f9c14444a57.webp', alt: 'Glossier' },
  { src: 'https://cdn.shopify.com/b/shopify-brochure2-assets/82f295147d6f32cd1533aa843f68b0c2.webp', alt: 'The Sill' },
  { src: 'https://cdn.shopify.com/b/shopify-brochure2-assets/92b0585e60e00efb6ceaf2aec6a66027.webp', alt: 'Vacation Inc' },
  { src: 'https://cdn.shopify.com/b/shopify-brochure2-assets/e919a4c2c7484b87699b2e6f5d020690.webp', alt: 'Aura Bora' },
  { src: 'https://cdn.shopify.com/b/shopify-brochure2-assets/268717f14ffc87467a9aeb1e6f5a7719.webp', alt: 'Kit and Ace' },
  { src: 'https://cdn.shopify.com/b/shopify-brochure2-assets/f11495397635517ec5ee47c2b360dd04.webp', alt: 'Super Smalls' },
  { src: 'https://cdn.shopify.com/b/shopify-brochure2-assets/c10c68f8cde3ae725cb4286678280226.webp', alt: 'Happy Monday' },
  { src: 'https://cdn.shopify.com/b/shopify-brochure2-assets/365260f1127ed2d9c4d6185512d63983.webp', alt: 'OnlyNY' },
  { src: 'https://cdn.shopify.com/b/shopify-brochure2-assets/2cc9891ed1b544cdbd548c289d1632cb.jpg',  alt: 'Bonaventura' },
  { src: 'https://cdn.shopify.com/b/shopify-brochure2-assets/afdceeca27acf0af45372d782b36a153.webp', alt: 'Rowing Blazers' },
  { src: 'https://cdn.shopify.com/b/shopify-brochure2-assets/b3a10e2014c5b6cd44f2bc4a893ffc75.webp', alt: 'Kirrin Finch' },
  { src: 'https://cdn.shopify.com/b/shopify-brochure2-assets/d1d0f12159bedd0521717f23600c1beb.webp', alt: 'Brooklinen' },
  { src: 'https://cdn.shopify.com/b/shopify-brochure2-assets/25528b246857074708e006916a5b77a6.jpg',  alt: 'A-morir' },
  { src: 'https://cdn.shopify.com/b/shopify-brochure2-assets/f478c242ac029c5f9116252ae2a8e2e1.webp', alt: 'Caraway' },
  { src: 'https://cdn.shopify.com/b/shopify-brochure2-assets/e103a64d117a2736cc4ff269828fe5ef.webp', alt: 'Thirsty Turtl' },
];

// Carousel constants — 3 big images visible at a time
const IMG_W = 460;
const IMG_H = 340;
const GAP    = 20;
const STEP   = IMG_W + GAP; // 410px per click
const VISIBLE = 3;
const MAX_IDX = storeImages.length - VISIBLE; // 12

const tabs = [
  {
    id: 'catalogue',
    label: 'Online store',
    heading: 'Sell anywhere and everywhere',
    desc: "Get a beautiful catalogue that's designed to convert. Choose a stylish theme or build completely custom for full control.",
    features: [
      'Beautiful product catalogues',
      'E-commerce website builder',
      'Custom themes & layouts',
      'Powerful search & filters',
      '2-click checkout',
      'Mobile-first design',
    ],
    img: 'https://dwtqm09zovi8z.cloudfront.net/assets/catalogue_e_commerce.webp',
  },
  {
    id: 'whatsapp',
    label: 'WhatsApp commerce',
    heading: 'Scale your business on WhatsApp',
    desc: 'Take WhatsApp Commerce to the next level with powerful features to boost your conversion rate and close more sales.',
    features: [
      'Automated order receipts',
      'Quick chat from catalogue',
      'Catalogue brochure sharing',
      'Real-time buyer notifications',
      'Direct and wholesale ordering',
      'Order tracking messages',
    ],
    img: 'https://dwtqm09zovi8z.cloudfront.net/assets/whatsapp_ordering.webp',
  },
  {
    id: 'b2b',
    label: 'B2B & wholesale',
    heading: 'Unlock new growth with B2B',
    desc: 'Create custom experiences for wholesale buyers with flexible pricing, discounts, and payment terms that scale with you.',
    features: [
      'MOA, MOQ & sets ordering',
      'Private cataloguing',
      'B2B tiered pricing',
      'Custom buyer portals',
      'Wholesale management',
      'Fast order booking',
    ],
    img: 'https://dwtqm09zovi8z.cloudfront.net/assets/boost_personal_commerce_1.webp',
  },
  {
    id: 'analytics',
    label: 'Analytics & insights',
    heading: 'Manage your business with ease',
    desc: 'Track customer activity live, boost conversion by engaging at the right time, and manage everything from one dashboard.',
    features: [
      'Real-time live analytics',
      'Customer activity tracking',
      'Conversion rate insights',
      'Full order management',
      'Inventory control',
      'Revenue reporting',
    ],
    img: 'https://dwtqm09zovi8z.cloudfront.net/assets/boost_personal_commerce_3.webp',
  },
];

export function FeaturesGrid() {
  const [activeTab, setActiveTab] = useState('catalogue');
  const [slideIdx, setSlideIdx]   = useState(0);
  const current = tabs.find(t => t.id === activeTab);

  // Auto-advance carousel
  useEffect(() => {
    const t = setTimeout(() => {
      setSlideIdx(i => (i >= MAX_IDX ? 0 : i + 1));
    }, 3800);
    return () => clearTimeout(t);
  }, [slideIdx]);

  const goPrev = () => setSlideIdx(i => Math.max(0, i - 1));
  const goNext = () => setSlideIdx(i => (i >= MAX_IDX ? 0 : i + 1));

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* ── Brand logos strip ── */}
        <div className="mb-20">
          <p className="text-center text-[11px] font-bold uppercase tracking-[0.25em] text-gray-400 mb-8">
            Trusted by thousands of businesses worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
            {brandLogos.map(b => (
              <span
                key={b.name}
                className={`text-gray-400 text-xl select-none whitespace-nowrap ${b.cls}`}
              >
                {b.name}
              </span>
            ))}
          </div>
          <div className="mt-12 border-t border-gray-100" />
        </div>

        {/* ── Heading ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.05]">
            The one commerce platform<br className="hidden md:block" /> behind it all
          </h2>
          <p className="mt-5 text-gray-500 text-lg font-medium max-w-xl mx-auto">
            Millions of businesses have grown using CommerceHub
          </p>
        </motion.div>

        {/* ── Store screenshot slide carousel ── */}
        <div className="relative mb-16">

          {/* Left arrow */}
          <button
            onClick={goPrev}
            disabled={slideIdx === 0}
            aria-label="Previous"
            className="absolute -left-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border-2 border-gray-200 shadow-lg flex items-center justify-center hover:border-gray-900 hover:shadow-xl transition-all disabled:opacity-25 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon className="w-5 h-5 text-gray-800" />
          </button>

          {/* Right arrow */}
          <button
            onClick={goNext}
            aria-label="Next"
            className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white border-2 border-gray-200 shadow-lg flex items-center justify-center hover:border-gray-900 hover:shadow-xl transition-all"
          >
            <ChevronRightIcon className="w-5 h-5 text-gray-800" />
          </button>

          {/* Left / right fade edges */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-12 z-10 bg-gradient-to-r from-white to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-12 z-10 bg-gradient-to-l from-white to-transparent" />

          {/* Rail */}
          <div className="overflow-hidden">
            <motion.div
              animate={{ x: -slideIdx * STEP }}
              transition={{ type: 'spring', stiffness: 200, damping: 28, mass: 0.8 }}
              className="flex"
              style={{ gap: `${GAP}px` }}
            >
              {storeImages.map((img, i) => (
                <img
                  key={i}
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  className="rounded-3xl object-cover shrink-0 shadow-xl"
                  style={{ width: `${IMG_W}px`, height: `${IMG_H}px` }}
                />
              ))}
            </motion.div>
          </div>

          {/* Dot / pill indicators */}
          <div className="flex justify-center items-center gap-1.5 mt-6">
            {Array.from({ length: MAX_IDX + 1 }).map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideIdx(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  slideIdx === i ? 'w-7 bg-black' : 'w-1.5 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="flex overflow-x-auto gap-2 mb-14 pb-1 justify-start md:justify-center">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap border-2 ${
                activeTab === tab.id
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-900 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
          >
            <div className="space-y-6 order-2 lg:order-1">
              <h3 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">{current.heading}</h3>
              <p className="text-lg text-gray-600 font-medium leading-relaxed">{current.desc}</p>
              <ul className="space-y-3 pt-2">
                {current.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="w-5 h-5 rounded-full bg-[#DC2626] flex items-center justify-center shrink-0">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-gray-800 font-semibold text-sm">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="order-1 lg:order-2">
              <img
                src={current.img}
                alt={current.heading}
                className="w-full max-w-lg mx-auto rounded-3xl shadow-2xl object-cover"
              />
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}

