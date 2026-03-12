import React from "react";

const HeroSection = () => (
  <section className="bg-white py-24 px-6 max-w-7xl mx-auto rounded-xl shadow-lg flex flex-col items-center text-center">
    <h1 className="text-4xl md:text-5xl font-bold text-black mb-6">
      Welcome to <span className="text-red-600">CommerceHub</span>
    </h1>
    <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
      Modern SaaS platform for multi-tenant commerce, analytics, and AI-powered business growth. Experience seamless management and powerful features in a beautiful, balanced interface.
    </p>
    <div className="flex gap-4">
      <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-red-500 transition">Get Started</button>
      <button className="bg-black text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-800 transition">Learn More</button>
    </div>
  </section>
);

export default HeroSection;
