import React from "react";

const FooterGrid = () => (
  <footer className="bg-black text-white py-12 px-6 max-w-7xl mx-auto rounded-xl mt-16">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div>
        <h4 className="font-bold text-lg mb-2">CommerceHub</h4>
        <p className="text-gray-500 text-sm mb-4">Modern SaaS platform for commerce and analytics.</p>
        <span className="text-gray-600 text-xs">© 2026 CommerceHub. All rights reserved.</span>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2">Links</h4>
        <ul className="space-y-2">
          <li><a href="#" className="text-white hover:text-red-600 transition">Home</a></li>
          <li><a href="#" className="text-white hover:text-red-600 transition">Features</a></li>
          <li><a href="#" className="text-white hover:text-red-600 transition">Pricing</a></li>
          <li><a href="#" className="text-white hover:text-red-600 transition">Contact</a></li>
        </ul>
      </div>
      <div>
        <h4 className="font-bold text-lg mb-2">Contact</h4>
        <p className="text-gray-500 text-sm mb-2">support@commercehub.com</p>
        <p className="text-gray-500 text-sm">+1 (555) 123-4567</p>
      </div>
    </div>
  </footer>
);

export default FooterGrid;
