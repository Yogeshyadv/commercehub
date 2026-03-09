import React from 'react';
import { motion } from 'framer-motion';
import { StarIcon } from 'lucide-react';

export function CustomerReviews() {
  const reviews = [
    {
      text: "Cool application, very convenient, I figured out what was happening for a long time, but as you adapt, things go easily... The main catalog turns out to be convenient and pleasing to the eye (◍•ᴗ•◍)❤",
      country: "Russia",
      flag: "🇷🇺"
    },
    {
      text: "This application fulfills its objective. The catalog is easy to use and the images shown to the client are of a good size. In addition, a large number of images can be uploaded at once. Fast and efficient.",
      country: "Spain",
      flag: "🇪🇸"
    },
    {
      text: "I am selling via Whatsapp. Whatsapp in-house cataloging, product listing and canned responses... However, this application offers more than all of these, especially for businesses that sell products.",
      country: "Turkey",
      flag: "🇹🇷"
    },
    {
      text: "The best app for both little and vip business. I'm getting 4 time what I was earning before. To change the price is so easy.",
      country: "Ivory Coast",
      flag: "🇨🇮"
    },
    {
      text: "I love it, they load the photos fast, I don't have to crop them, it lets me put several similar things and write the name of the item and price only once...",
      country: "Spain",
      flag: "🇪🇸"
    },
    {
      text: "On the trial subscription and already loving this app. Take away the stress of individual positing of item. Just post your catalogue on any social media or your contacts and voila!",
      country: "Spain",
      flag: "🇪🇸"
    }
  ];

  return (
    <section className="py-24 bg-[#f5f5f5] relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="text-[#DC2626] text-xs font-black uppercase tracking-[0.25em] mb-4">Customer stories</p>
          <h2 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            Loved by businesses<br className="hidden md:block" /> worldwide
          </h2>
        </motion.div>

        {/* Marquee effect for reviews */}
        <div className="relative w-full flex overflow-x-hidden group pb-8">
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
            className="flex gap-6 pr-6 whitespace-nowrap"
            style={{ width: "fit-content" }}
          >
            {/* Double the array for seamless scrolling */}
            {[...reviews, ...reviews, ...reviews].map((review, idx) => (
              <div 
              key={idx} 
              className="w-[350px] inline-flex flex-col bg-white p-8 rounded-3xl shadow-sm border border-gray-100 whitespace-normal flex-shrink-0"
            >
                <div className="flex text-[#FFB800] mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1 italic">
                  "{review.text}"
                </p>
                <div className="flex items-center gap-2 mt-auto font-bold text-gray-900">
                  <span className="text-2xl">{review.flag}</span>
                  {review.country}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
