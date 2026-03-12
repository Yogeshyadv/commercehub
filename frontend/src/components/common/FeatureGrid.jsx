import React from "react";
import FeatureCard from "./FeatureCard";

const features = [
  {
    icon: "🚀",
    title: "AI-Powered Analytics",
    description: "Gain actionable insights with advanced analytics and machine learning."
  },
  {
    icon: "🛒",
    title: "Multi-Tenant Commerce",
    description: "Manage multiple stores and vendors seamlessly in one platform."
  },
  {
    icon: "🔒",
    title: "Secure Authentication",
    description: "Robust security and access control for all users and tenants."
  },
  {
    icon: "💡",
    title: "Smart Inventory",
    description: "Automated inventory tracking and low-stock alerts."
  }
];

const FeatureGrid = () => (
  <section className="bg-gray-50 py-16 px-6 max-w-7xl mx-auto rounded-xl">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {features.map((feature, idx) => (
        <FeatureCard key={idx} {...feature} />
      ))}
    </div>
  </section>
);

export default FeatureGrid;
