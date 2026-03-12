import React from "react";

const TestimonialCard = ({ name, company, testimonial }) => (
  <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition">
    <p className="text-gray-600 text-base mb-4">"{testimonial}"</p>
    <div className="text-black font-semibold mb-1">{name}</div>
    <div className="text-gray-500 text-sm">{company}</div>
  </div>
);

export default TestimonialCard;
