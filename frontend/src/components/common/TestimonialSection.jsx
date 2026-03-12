import React from "react";
import TestimonialCard from "../components/common/TestimonialCard";

const testimonials = [
  {
    name: "Jane Doe",
    company: "Acme Corp",
    testimonial: "CommerceHub transformed our workflow and boosted sales!"
  },
  {
    name: "John Smith",
    company: "Beta LLC",
    testimonial: "The analytics and AI features are game-changers."
  }
];

const TestimonialSection = () => (
  <section className="bg-white py-16 px-6 max-w-7xl mx-auto rounded-xl">
    <h2 className="text-2xl md:text-3xl font-bold text-black mb-8 text-center">What Our Customers Say</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {testimonials.map((t, idx) => (
        <TestimonialCard key={idx} {...t} />
      ))}
    </div>
  </section>
);

export default TestimonialSection;
