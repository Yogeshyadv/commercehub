import React from 'react';
import { motion } from 'framer-motion';

export function GlobalReach() {
  return (
    <section className="py-20 bg-[#f8fafc] dark:bg-[#050c14] relative z-10 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row bg-white dark:bg-gray-900 rounded-[3rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
          
          <div className="lg:w-1/2 p-10 lg:p-16 bg-gradient-to-br from-[#25D366]/10 to-blue-500/5 dark:from-[#25D366]/5 dark:to-transparent flex flex-col justify-center">
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              src="https://dwtqm09zovi8z.cloudfront.net/assets/talk_to_an_expert.webp"
              alt="Talk to an expert"
              className="w-full max-w-sm mx-auto mb-8 drop-shadow-xl rounded-2xl"
            />
            <h2 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              Talk to an expert
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-medium mb-8">
              Let our experts guide you with using CommerceHub for your specific business case.
            </p>
            <div className="space-y-4">
              <a href="mailto:sales@commercehub.com" className="flex items-center text-gray-900 dark:text-white hover:text-[#25D366] transition-colors font-semibold">
                <span className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-4">✉️</span>
                sales@commercehub.com
              </a>
              <a href="tel:+919876543210" className="flex items-center text-gray-900 dark:text-white hover:text-[#25D366] transition-colors font-semibold">
                <span className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mr-4">📞</span>
                +91 98765 43210
              </a>
            </div>
          </div>

          <div className="lg:w-1/2 p-10 lg:p-16 flex items-center justify-center bg-white dark:bg-gray-900">
            <div className="w-full max-w-md">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Book a personalized demo</h3>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Business Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-[#25D366] outline-none transition-all dark:text-white" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">How many products do you have?</label>
                  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-[#25D366] outline-none transition-all dark:text-white">
                    <option>1 - 50</option>
                    <option>51 - 200</option>
                    <option>201 - 1000</option>
                    <option>1000+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
                  <div className="flex">
                    <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-500 font-bold">
                      +91
                    </span>
                    <input type="tel" className="flex-1 px-4 py-3 rounded-r-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-[#25D366] outline-none transition-all dark:text-white" />
                  </div>
                </div>
                <button type="submit" className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl shadow-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-all">
                  SUBMIT
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
