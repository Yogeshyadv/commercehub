import React from "react";

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition">
    <div className="mb-4 text-red-600 text-3xl">{icon}</div>
    <h3 className="text-xl font-semibold text-black mb-2">{title}</h3>
    <p className="text-gray-600 text-base">{description}</p>
  </div>
);

export default FeatureCard;
